import { BoxGeometry, CylinderGeometry, Group, Mesh, MeshStandardMaterial, SphereGeometry } from 'three';
import type { ICharacterDef, ICharacterRuntime } from '../../contracts.ts';

function part( geometry: BoxGeometry | CylinderGeometry | SphereGeometry, color: number ): Mesh {
	const mesh = new Mesh( geometry, new MeshStandardMaterial( { color, roughness: 0.82 } ) );
	mesh.castShadow = true; mesh.receiveShadow = true;
	return mesh;
}

export function createCharacter( def: ICharacterDef ): ICharacterRuntime {
	const root = new Group();
	root.name = def.id;
	const scale = def.height / 1.8;
	const body = part( new CylinderGeometry( 0.34, 0.48, 0.82, 8 ), Number( def.color ) ); body.position.y = 1.12;
	const head = part( new SphereGeometry( 0.25, 16, 12 ), 0xd8a477 ); head.position.y = 1.78;
	const hat = part( new CylinderGeometry( 0.42, 0.42, 0.08, 16 ), def.role === 'guard' ? 0x342d2b : 0x5a4635 ); hat.position.y = 2.02;
	const leftArm = part( new BoxGeometry( 0.18, 0.7, 0.2 ), Number( def.color ) ); leftArm.position.set( -0.48, 1.18, 0 );
	const rightArm = part( new BoxGeometry( 0.18, 0.7, 0.2 ), Number( def.color ) ); rightArm.position.set( 0.48, 1.18, 0 );
	const leftLeg = part( new BoxGeometry( 0.22, 0.72, 0.25 ), 0x343d46 ); leftLeg.position.set( -0.2, 0.42, 0 );
	const rightLeg = part( new BoxGeometry( 0.22, 0.72, 0.25 ), 0x343d46 ); rightLeg.position.set( 0.2, 0.42, 0 );
	root.add( body, head, hat, leftArm, rightArm, leftLeg, rightLeg );
	root.scale.setScalar( scale );
	return { def, root, parts: { leftArm, rightArm, leftLeg, rightLeg } };
}

export function animateCharacter( character: ICharacterRuntime, time: number, speed: number ): void {
	const swing = Math.sin( time * 8 ) * Math.min( 0.7, speed * 0.16 );
	character.parts.leftArm.rotation.x = swing;
	character.parts.rightArm.rotation.x = -swing;
	character.parts.leftLeg.rotation.x = -swing;
	character.parts.rightLeg.rotation.x = swing;
	character.root.position.y = Math.abs( Math.sin( time * 8 ) ) * Math.min( 0.04, speed * 0.01 );
}
