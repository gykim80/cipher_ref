import assert from 'node:assert/strict';
import test from 'node:test';
import { generatePlacements } from '../src/modules/population/place-population.ts';
import { characters, narrative, population, world } from '../src/content/sample-content.ts';

test( '같은 seed는 같은 NPC 배치를 만든다', () => {
	const first = generatePlacements( 'fixed', population, world.buildings );
	const second = generatePlacements( 'fixed', population, world.buildings );
	assert.deepEqual( first, second );
	assert.equal( first.length, 11 );
} );

test( 'NPC는 건물 내부에 배치되지 않는다', () => {
	for ( const npc of generatePlacements( 'fixed', population, world.buildings ) ) for ( const building of world.buildings ) {
		const insideX = Math.abs( npc.at[ 0 ] - building.at[ 0 ] ) < building.size[ 0 ] / 2 + 0.8;
		const insideZ = Math.abs( npc.at[ 1 ] - building.at[ 1 ] ) < building.size[ 2 ] / 2 + 0.8;
		assert.equal( insideX && insideZ, false, `${ npc.id }가 ${ building.id } 안에 배치됨` );
	}
} );

test( 'population과 narrative가 존재하는 character와 NPC만 참조한다', () => {
	const characterIds = new Set( characters.map( ( character ) => character.id ) );
	for ( const group of population ) assert.ok( characterIds.has( group.character ), group.character );
	const npcIds = new Set( generatePlacements( 'cipher-ref', population, world.buildings ).map( ( npc ) => npc.id ) );
	for ( const beat of narrative.beats ) if ( beat.trigger.kind === 'talk' ) assert.ok( npcIds.has( beat.trigger.npc ), beat.trigger.npc );
} );
