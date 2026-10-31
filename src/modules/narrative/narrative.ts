import type { INarrativeDef, INpcRuntime } from '../../contracts.ts';

export interface INarrativeRuntime {
	current: number;
	objective: HTMLElement;
	dialogue: HTMLElement;
	def: INarrativeDef;
}

export function createNarrative( def: INarrativeDef, objective: HTMLElement, dialogue: HTMLElement ): INarrativeRuntime {
	if ( !def.beats.length ) throw new Error( '내러티브에는 beat가 하나 이상 필요합니다' );
	const runtime = { current: 0, objective, dialogue, def };
	showObjective( runtime );
	return runtime;
}

function showObjective( runtime: INarrativeRuntime ): void {
	runtime.objective.textContent = runtime.def.beats[ runtime.current ]?.objective ?? '이 장의 이야기가 끝났습니다';
}

export function talkTo( runtime: INarrativeRuntime, npc: INpcRuntime ): boolean {
	const beat = runtime.def.beats[ runtime.current ];
	if ( !beat || beat.trigger.kind !== 'talk' || beat.trigger.npc !== npc.id ) return false;
	const dialogueId = beat.dialogue ?? npc.dialogue;
	const dialogue = runtime.def.dialogues.find( ( item ) => item.id === dialogueId );
	if ( dialogue ) {
		runtime.dialogue.innerHTML = `<strong>${ dialogue.speaker }</strong><span>${ dialogue.lines.join( '<br>' ) }</span>`;
		runtime.dialogue.classList.add( 'visible' );
		setTimeout( () => runtime.dialogue.classList.remove( 'visible' ), 5000 );
	}
	runtime.current++;
	showObjective( runtime );
	return true;
}
