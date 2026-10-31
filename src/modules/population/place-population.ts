import { Group, Vector2 } from 'three';
import type { IBuildingDef, ICharacterDef, INpcRuntime, IPopulationGroup, TArea, TVec2 } from '../../contracts.ts';
import { animateCharacter, createCharacter } from '../character/create-character.ts';

function hash( value: string ): number { let state = 2166136261; for ( const char of value ) state = Math.imul( state ^ char.charCodeAt( 0 ), 16777619 ); return state >>> 0; }
function rng( seed: string ): () => number { let state = hash( seed ); return () => { state += 0x6D2B79F5; let value = state; value = Math.imul( value ^ value >>> 15, value | 1 ); value ^= value + Math.imul( value ^ value >>> 7, value | 61 ); return ( ( value ^ value >>> 14 ) >>> 0 ) / 4294967296; }; }
function blocked( at: TVec2, buildings: readonly IBuildingDef[] ): boolean { return buildings.some( ( building ) => Math.abs( at[ 0 ] - building.at[ 0 ] ) < building.size[ 0 ] / 2 + 0.8 && Math.abs( at[ 1 ] - building.at[ 1 ] ) < building.size[ 2 ] / 2 + 0.8 ); }

export function generatePlacements( seed: string, groups: readonly IPopulationGroup[], buildings: readonly IBuildingDef[] ): Array<{ id: string; character: string; at: TVec2; behavior: IPopulationGroup['behavior']; dialogue?: string; phase: number }> {
	const placements: Array<{ id: string; character: string; at: TVec2; behavior: IPopulationGroup['behavior']; dialogue?: string; phase: number }> = [];
	for ( const group of groups ) {
		const next = rng( `${ seed }:${ group.id }` );
		for ( let index = 0; index < group.count; index++ ) {
			let at: TVec2 | undefined;
			for ( let attempt = 0; attempt < 100; attempt++ ) {
				const candidate: TVec2 = [ group.area[ 0 ] + next() * ( group.area[ 2 ] - group.area[ 0 ] ), group.area[ 1 ] + next() * ( group.area[ 3 ] - group.area[ 1 ] ) ];
				if ( !blocked( candidate, buildings ) && placements.every( ( item ) => Math.hypot( item.at[ 0 ] - candidate[ 0 ], item.at[ 1 ] - candidate[ 1 ] ) > 1.5 ) ) { at = candidate; break; }
			}
			if ( !at ) throw new Error( `${ group.id } 배치 공간이 부족합니다` );
			placements.push( { id: `${ group.id }_${ index + 1 }`, character: group.character, at, behavior: group.behavior, dialogue: group.dialogue, phase: next() * Math.PI * 2 } );
		}
	}
	return placements;
}

export function createPopulation( seed: string, groups: readonly IPopulationGroup[], catalog: readonly ICharacterDef[], buildings: readonly IBuildingDef[] ): { root: Group; npcs: INpcRuntime[] } {
	const root = new Group(); root.name = 'population';
	const npcs = generatePlacements( seed, groups, buildings ).map( ( placement ) => {
		const def = catalog.find( ( item ) => item.id === placement.character );
		if ( !def ) throw new Error( `없는 캐릭터: ${ placement.character }` );
		const character = createCharacter( def ); character.root.position.set( placement.at[ 0 ], 0, placement.at[ 1 ] ); root.add( character.root );
		return { ...character, ...placement, home: placement.at } satisfies INpcRuntime;
	} );
	return { root, npcs };
}

export function updatePopulation( npcs: readonly INpcRuntime[], time: number, dt: number ): void {
	for ( const npc of npcs ) {
		let speed = 0;
		if ( npc.behavior !== 'idle' ) {
			const radius = npc.behavior === 'patrol' ? 4 : 1.4; const pace = npc.behavior === 'patrol' ? 0.35 : 0.18;
			const target = new Vector2( npc.home[ 0 ] + Math.cos( time * pace + npc.phase ) * radius, npc.home[ 1 ] + Math.sin( time * pace + npc.phase ) * radius );
			const direction = target.sub( new Vector2( npc.root.position.x, npc.root.position.z ) ); speed = Math.min( 1.4, direction.length() );
			if ( direction.lengthSq() > 0.01 ) { direction.normalize(); npc.root.position.x += direction.x * dt * speed; npc.root.position.z += direction.y * dt * speed; npc.root.rotation.y = Math.atan2( direction.x, direction.y ); }
		}
		animateCharacter( npc, time + npc.phase, speed );
	}
}
