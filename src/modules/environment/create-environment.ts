import { BoxGeometry, ConeGeometry, CylinderGeometry, Group, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, PlaneGeometry, RepeatWrapping, TextureLoader } from 'three';
import type { IBuildingDef, IWorldDef } from '../../contracts.ts';

function box( width: number, height: number, depth: number, color: number ): Mesh {
	const mesh = new Mesh( new BoxGeometry( width, height, depth ), new MeshStandardMaterial( { color, roughness: 0.9 } ) );
	mesh.castShadow = true; mesh.receiveShadow = true;
	return mesh;
}

function createBuilding( def: IBuildingDef ): Group {
	const group = new Group(); group.name = def.id;
	const wall = box( def.size[ 0 ], def.size[ 1 ], def.size[ 2 ], Number( def.color ?? 0xc6a878 ) );
	wall.position.y = def.size[ 1 ] / 2;
	const roof = new Mesh( new ConeGeometry( Math.max( def.size[ 0 ], def.size[ 2 ] ) * 0.72, 1.5, 4 ), new MeshStandardMaterial( { color: 0x34404a, roughness: 0.8 } ) );
	roof.position.y = def.size[ 1 ] + 0.65; roof.rotation.y = Math.PI / 4; roof.castShadow = true;
	const door = box( 0.75, 1.45, 0.08, 0x493323 ); door.position.set( 0, 0.72, def.size[ 2 ] / 2 + 0.05 );
	group.position.set( def.at[ 0 ], 0, def.at[ 1 ] ); group.add( wall, roof, door );
	return group;
}

function createTree( x: number, z: number, scale: number ): Group {
	const tree = new Group(); tree.position.set( x, 0, z ); tree.scale.setScalar( scale );
	const trunk = new Mesh( new CylinderGeometry( 0.16, 0.22, 1.5, 7 ), new MeshStandardMaterial( { color: 0x5b4028 } ) ); trunk.position.y = 0.75; trunk.castShadow = true;
	const crown = new Mesh( new ConeGeometry( 0.9, 2.4, 8 ), new MeshStandardMaterial( { color: 0x426c46, roughness: 1 } ) ); crown.position.y = 2.1; crown.castShadow = true;
	tree.add( trunk, crown ); return tree;
}

export interface IEnvironmentRuntime {
	root: Group;
	buildings: readonly IBuildingDef[];
}

export function createEnvironment( world: IWorldDef ): IEnvironmentRuntime {
	const root = new Group(); root.name = world.id;
	const ground = new Mesh( new PlaneGeometry( world.size, world.size ), new MeshStandardMaterial( { color: 0x78925f, roughness: 1 } ) );
	ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; root.add( ground );
	const water = new Mesh( new PlaneGeometry( world.size, world.water.width ), new MeshPhysicalMaterial( { color: world.water.color, roughness: 0.2, metalness: 0.05, transparent: true, opacity: 0.82 } ) );
	water.rotation.x = -Math.PI / 2; water.position.set( 0, 0.04, world.water.side === 'south' ? world.size / 2 - world.water.width / 2 : -world.size / 2 + world.water.width / 2 ); root.add( water );
	const road = new Mesh( new PlaneGeometry( 7, world.size - world.water.width ), new MeshStandardMaterial( { color: 0x9d8765, roughness: 1 } ) );
	road.rotation.x = -Math.PI / 2; road.position.set( 0, 0.025, -world.water.width / 2 ); root.add( road );
	for ( const building of world.buildings ) root.add( createBuilding( building ) );
	for ( let index = 0; index < 18; index++ ) {
		const side = index % 2 ? -1 : 1;
		root.add( createTree( side * ( 13 + ( index % 4 ) * 2.7 ), -18 + index * 2.1, 0.75 + ( index % 3 ) * 0.12 ) );
	}
	const dock = box( 5, 0.25, 7, 0x6c4d31 ); dock.position.set( 8, 0.15, world.size / 2 - world.water.width + 2.2 ); root.add( dock );
	return { root, buildings: world.buildings };
}

export function animateWater( runtime: IEnvironmentRuntime, time: number ): void {
	const water = runtime.root.children[ 1 ];
	if ( water ) water.position.y = 0.04 + Math.sin( time * 1.4 ) * 0.035;
}
