import type { ColorRepresentation, Group, Object3D } from 'three';

export type TVec2 = readonly [ number, number ];
export type TArea = readonly [ number, number, number, number ];

export interface IBuildingDef {
	id: string;
	at: TVec2;
	size: readonly [ number, number, number ];
	color?: ColorRepresentation;
}

export interface IWorldDef {
	id: string;
	name: string;
	size: number;
	water: { side: 'north' | 'south'; width: number; color: ColorRepresentation };
	buildings: readonly IBuildingDef[];
	points: Readonly<Record<string, TVec2>>;
}

export interface ICharacterDef {
	id: string;
	name: string;
	color: ColorRepresentation;
	height: number;
	role: 'hero' | 'civilian' | 'guard';
}

export interface ICharacterRuntime {
	def: ICharacterDef;
	root: Group;
	parts: { leftArm: Object3D; rightArm: Object3D; leftLeg: Object3D; rightLeg: Object3D };
}

export interface IPopulationGroup {
	id: string;
	character: string;
	count: number;
	area: TArea;
	behavior: 'idle' | 'wander' | 'patrol';
	dialogue?: string;
}

export interface INpcRuntime extends ICharacterRuntime {
	id: string;
	behavior: IPopulationGroup['behavior'];
	dialogue?: string;
	home: TVec2;
	phase: number;
}

export interface IDialogueDef {
	id: string;
	speaker: string;
	lines: readonly string[];
}

export interface INarrativeBeat {
	id: string;
	objective: string;
	trigger: { kind: 'start' } | { kind: 'talk'; npc: string };
	dialogue?: string;
}

export interface INarrativeDef {
	id: string;
	title: string;
	beats: readonly INarrativeBeat[];
	dialogues: readonly IDialogueDef[];
}
