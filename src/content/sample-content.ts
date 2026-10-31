import type { ICharacterDef, INarrativeDef, IPopulationGroup, IWorldDef } from '../contracts.ts';

export const world: IWorldDef = {
	id: 'river_village', name: '해오름 나루', size: 56,
	water: { side: 'south', width: 11, color: 0x3f8795 },
	buildings: [
		{ id: 'inn', at: [ -10, -4 ], size: [ 7, 3.5, 5 ], color: 0xc29f6c },
		{ id: 'smithy', at: [ 10, -8 ], size: [ 6, 3, 5 ], color: 0xa98159 },
		{ id: 'storehouse', at: [ -13, -15 ], size: [ 8, 4, 6 ], color: 0xb99362 },
		{ id: 'home', at: [ 12, -18 ], size: [ 6, 3.2, 5 ], color: 0xc8ae7c },
	],
	points: { start: [ 0, 12 ], dock: [ 8, 20 ], square: [ 0, -7 ] },
};

export const characters: ICharacterDef[] = [
	{ id: 'hero', name: '여행자', color: 0x374a67, height: 1.8, role: 'hero' },
	{ id: 'villager', name: '마을 사람', color: 0x8b5c4a, height: 1.68, role: 'civilian' },
	{ id: 'merchant', name: '장돌뱅이', color: 0x6e7a3e, height: 1.72, role: 'civilian' },
	{ id: 'guard', name: '나루 경비', color: 0x69434a, height: 1.78, role: 'guard' },
];

export const population: IPopulationGroup[] = [
	{ id: 'villagers', character: 'villager', count: 7, area: [ -18, -21, 18, 4 ], behavior: 'wander' },
	{ id: 'merchant', character: 'merchant', count: 1, area: [ -3, -9, 3, -5 ], behavior: 'idle', dialogue: 'rumor' },
	{ id: 'guards', character: 'guard', count: 3, area: [ -16, 6, 16, 15 ], behavior: 'patrol' },
];

export const narrative: INarrativeDef = {
	id: 'empty_boat', title: '빈 배의 소문',
	beats: [
		{ id: 'ask', objective: '장터의 장돌뱅이에게 말을 거세요 · E', trigger: { kind: 'talk', npc: 'merchant_1' }, dialogue: 'rumor' },
		{ id: 'dock', objective: '강가 부두에서 빈 배를 조사하세요', trigger: { kind: 'start' } },
	],
	dialogues: [ { id: 'rumor', speaker: '장돌뱅이', lines: [ '새벽마다 빈 배가 혼자 돌아온다오.', '강 건너에는 아무도 살지 않는데 말이오.' ] } ],
};
