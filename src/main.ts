import { AxesHelper, BoxGeometry, GridHelper, Mesh, MeshStandardMaterial, PlaneGeometry, Vector2 } from 'three';
import './style.css';
import { createRenderHost, resizeAndRender } from './core/renderer.ts';
import { animateCharacter, createCharacter } from './modules/character/create-character.ts';
import { animateWater, createEnvironment } from './modules/environment/create-environment.ts';
import { createPopulation, updatePopulation } from './modules/population/place-population.ts';
import { createNarrative, talkTo, type INarrativeRuntime } from './modules/narrative/narrative.ts';
import { characters, narrative, population, world } from './content/sample-content.ts';
import type { INpcRuntime } from './contracts.ts';

const lessons = [ 'scene', 'light', 'camera', 'world', 'population', 'narrative' ] as const;
type TLesson = typeof lessons[number];
const queryLesson = new URLSearchParams( location.search ).get( 'lesson' );
const lesson: TLesson = lessons.includes( queryLesson as TLesson ) ? queryLesson as TLesson : 'narrative';
const lessonLabel: Record<TLesson, string> = { scene: '1 · Scene과 좌표', light: '2 · Mesh와 Light', camera: '3 · Camera와 Render', world: '4 · 물과 마을', population: '5 · Character와 NPC', narrative: '6 · Narrative' };

document.querySelector<HTMLDivElement>( '#app' )!.innerHTML = `
  <canvas id="game"></canvas>
  <header><div><b>cipher_ref</b><span>${ lessonLabel[ lesson ] }</span></div><nav>${ lessons.map( ( item ) => `<a class="${ item === lesson ? 'active' : '' }" href="?lesson=${ item }">${ item }</a>` ).join( '' ) }</nav></header>
  <aside class="lesson"><small>LEARNING CHECKPOINT</small><h1>${ lessonLabel[ lesson ] }</h1><p id="explain"></p><code id="module"></code></aside>
  <div class="objective"><small>현재 목표</small><span id="objective">화면을 관찰하세요</span></div>
  <div id="prompt" class="prompt">E · 대화</div>
  <div id="dialogue" class="dialogue"></div>
  <div class="controls">WASD 이동 · E 대화 · lesson 버튼으로 단계 비교</div>`;

const descriptions: Record<TLesson, [ string, string ]> = {
	scene: [ 'Scene은 3D 물체가 들어가는 무대입니다. 빨강 X, 초록 Y, 파랑 Z축 위에 model 하나를 올렸습니다.', 'core/renderer + modules/character' ],
	light: [ 'Geometry는 모양, Material은 표면입니다. Light가 있어야 입체와 그림자가 보입니다.', 'modules/character/create-character.ts' ],
	camera: [ 'PerspectiveCamera를 멀리 올리고 비스듬히 내려다보면 쿼터뷰가 됩니다.', 'core/renderer.ts' ],
	world: [ 'Environment module이 땅, 물, 길, 집, 나무를 WorldDef 한 장으로 조립합니다.', 'modules/environment/create-environment.ts' ],
	population: [ 'Population module은 Character catalog에서 외형을 골라 건물을 피해 NPC를 배치합니다.', 'modules/population/place-population.ts' ],
	narrative: [ 'Narrative module이 objective와 dialogue를 NPC id에 연결합니다. 장돌뱅이에게 다가가 E를 누르세요.', 'modules/narrative/narrative.ts' ],
};
document.querySelector( '#explain' )!.textContent = descriptions[ lesson ][ 0 ];
document.querySelector( '#module' )!.textContent = descriptions[ lesson ][ 1 ];

const canvas = document.querySelector<HTMLCanvasElement>( '#game' )!;
const host = createRenderHost( canvas, lesson );
const heroDef = characters.find( ( item ) => item.id === 'hero' )!;
const hero = createCharacter( heroDef );
host.scene.add( hero.root );
let environment: ReturnType<typeof createEnvironment> | undefined;
let npcs: INpcRuntime[] = [];
let narrativeRuntime: INarrativeRuntime | undefined;

if ( lesson === 'scene' ) {
	host.scene.add( new AxesHelper( 3 ) );
	host.camera.position.set( 5, 3.5, 6 );
} else if ( lesson === 'light' ) {
	const floor = new Mesh( new PlaneGeometry( 12, 12 ), new MeshStandardMaterial( { color: 0x687565, roughness: 1 } ) );
	floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; host.scene.add( floor, new GridHelper( 12, 12, 0x48514a, 0x778276 ) );
	host.camera.position.set( 7, 5, 8 );
} else {
	environment = createEnvironment( world ); host.scene.add( environment.root );
	hero.root.position.set( world.points.start![ 0 ], 0, world.points.start![ 1 ] );
	if ( lesson === 'camera' ) host.camera.position.set( 14, 13, 14 );
	if ( lesson === 'population' || lesson === 'narrative' ) {
		const runtime = createPopulation( 'cipher-ref', population, characters, world.buildings ); npcs = runtime.npcs; host.scene.add( runtime.root );
		document.querySelector( '#objective' )!.textContent = `${ npcs.length }명의 NPC가 seed로 배치되었습니다`;
	}
	if ( lesson === 'narrative' ) narrativeRuntime = createNarrative( narrative, document.querySelector( '#objective' )!, document.querySelector( '#dialogue' )! );
}

if ( lesson === 'narrative' && new URLSearchParams( location.search ).has( 'demo' ) ) {
	const merchant = npcs.find( ( npc ) => npc.id === 'merchant_1' );
	if ( merchant && narrativeRuntime ) {
		hero.root.position.set( merchant.root.position.x - 1.2, 0, merchant.root.position.z );
		setTimeout( () => talkTo( narrativeRuntime!, merchant ), 250 );
	}
}

const keys = new Set<string>();
addEventListener( 'keydown', ( event ) => { keys.add( event.code ); if ( event.code === 'KeyE' ) interact(); } );
addEventListener( 'keyup', ( event ) => keys.delete( event.code ) );
const prompt = document.querySelector<HTMLElement>( '#prompt' )!;
let nearest: INpcRuntime | undefined;

function interact(): void {
	if ( nearest && narrativeRuntime ) talkTo( narrativeRuntime, nearest );
}

function updateHero( time: number, dt: number ): void {
	const input = new Vector2( Number( keys.has( 'KeyD' ) ) - Number( keys.has( 'KeyA' ) ), Number( keys.has( 'KeyS' ) ) - Number( keys.has( 'KeyW' ) ) );
	const speed = input.lengthSq() ? 4 : 0;
	if ( speed ) {
		input.normalize(); hero.root.position.x += ( input.x + input.y ) * 0.707 * speed * dt; hero.root.position.z += ( input.y - input.x ) * 0.707 * speed * dt;
		hero.root.rotation.y = Math.atan2( input.x + input.y, input.y - input.x );
	}
	animateCharacter( hero, time, speed );
	if ( lesson !== 'scene' && lesson !== 'light' ) {
		host.lookAt.lerp( hero.root.position, 1 - Math.exp( -dt * 5 ) );
		host.camera.position.lerp( host.lookAt.clone().add( { x: 15, y: 13, z: 15 } ), 1 - Math.exp( -dt * 5 ) );
	}
	nearest = npcs.reduce<INpcRuntime | undefined>( ( best, npc ) => {
		const distance = npc.root.position.distanceTo( hero.root.position );
		return distance < 2.4 && ( !best || distance < best.root.position.distanceTo( hero.root.position ) ) ? npc : best;
	}, undefined );
	prompt.classList.toggle( 'visible', Boolean( nearest && lesson === 'narrative' ) );
}

function frame(): void {
	const dt = Math.min( host.clock.getDelta(), 0.05 ); const time = host.clock.elapsedTime;
	updateHero( time, dt ); updatePopulation( npcs, time, dt ); if ( environment ) animateWater( environment, time );
	if ( lesson === 'scene' ) hero.root.rotation.y += dt * 0.35;
	resizeAndRender( host ); requestAnimationFrame( frame );
}
frame();
