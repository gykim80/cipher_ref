# cipher_ref로 시작하는 나만의 3D 게임

이 책은 3D 수학이나 rendering engine을 이미 아는 사람만을 위한 책이 아닙니다. 첫 세 쪽에서 화면에 입체가 나타나는 최소 원리를 익히고, 공개 저장소 `cipher_ref`를 내려받아 물과 마을, 캐릭터, NPC, 이야기를 차례로 바꿉니다.

완성된 CIPHER를 실행해 보는 데서 출발하지 않습니다. 독자가 작은 reference game의 구조를 이해하고 자기 설정과 자산으로 교체하는 데서 출발합니다.

## 읽는 순서

1. [3D 게임의 기본 세 쪽](01-3d-basics.md)
2. [GitHub에서 내려받아 첫 실행](02-install.md)
3. [폴더와 module 이해](03-architecture.md)
4. [물·지형·마을 바꾸기](04-environment.md)
5. [캐릭터와 배경 NPC 배치](05-characters-and-npcs.md)
6. [시나리오를 objective와 dialogue로 만들기](06-narrative.md)
7. [자신만의 CIPHER로 바꾸기](07-your-cipher.md)

## 이 책이 약속하는 결과

마지막 장까지 진행하면 독자는 다음을 할 수 있습니다.

- 3D model이 Scene, Camera, Light를 거쳐 화면에 그려지는 이유를 설명한다
- `cipher_ref`를 clone하고 개발 서버를 실행한다
- JSON과 TypeScript content만 바꿔 다른 물가와 마을을 만든다
- 주인공과 별개로 배경 NPC의 종류, 수, 행동, 배치를 정한다
- 시나리오를 objective, trigger, dialogue의 연속으로 만든다
- 자신의 GitHub 저장소에 새로운 game을 올린다

모든 그림은 이 저장소의 `npm run capture`로 직접 촬영합니다.
