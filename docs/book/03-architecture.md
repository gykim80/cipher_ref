# 03. 폴더와 module 이해

게임 코드를 처음 열면 파일 이름이 많아 어디부터 봐야 할지 막막합니다. `cipher_ref`는 바뀌는 이유가 같은 파일끼리 모았습니다.

```text
src/
├─ core/
│  └─ renderer.ts
├─ modules/
│  ├─ environment/create-environment.ts
│  ├─ character/create-character.ts
│  ├─ population/place-population.ts
│  └─ narrative/narrative.ts
├─ content/
│  └─ sample-content.ts
├─ contracts.ts
└─ main.ts
```

`core`는 canvas, Camera, renderer, game loop의 바닥입니다. `modules`는 하나의 책임만 맡습니다. `content`는 이 게임에서 사용할 마을과 인물과 이야기입니다. `main.ts`는 이들을 순서대로 조립합니다.

## 의존 방향

```text
content ──┐
          ├→ environment ─┐
          ├→ character ───┼→ main → 화면
          ├→ population ──┤
          └→ narrative ───┘

modules → contracts
```

Environment가 Narrative를 직접 부르지 않고 Character가 Population의 배치를 결정하지 않습니다. 그래서 물과 마을 module만 다른 project로 가져가거나, 같은 배경에 전혀 다른 이야기를 얹을 수 있습니다.

## 독자가 주로 바꿀 파일

처음에는 `src/content/sample-content.ts` 하나만 바꿉니다. module 코드는 content를 화면으로 만드는 기계입니다. content를 바꾸는 것만으로 원하는 결과를 만들 수 없을 때에만 module을 확장합니다.

다음 장부터 이 원칙을 지킵니다.

1. content 숫자와 글을 바꾼다.
2. 화면을 확인한다.
3. test를 돌린다.
4. 표현할 수 없는 규칙이 생겼을 때 module을 바꾼다.

체크포인트: 물 색을 바꾸려면 `sample-content.ts`, 물 표면의 움직임을 바꾸려면 `create-environment.ts`를 열어야 한다고 구분할 수 있습니다.
