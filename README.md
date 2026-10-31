# cipher_ref

`cipher_ref`는 3D 게임의 기본을 이해한 뒤 배경, 캐릭터, NPC, 내러티브를 하나씩 바꾸며 자신만의 쿼터뷰 게임을 만드는 MIT 오픈소스 starter입니다.

완성된 CIPHER를 복제하지 않습니다. 외부 3D asset 없이 primitive geometry로 시작하며 각 module의 입력과 출력을 눈으로 확인할 수 있습니다.

## 시작하기

```bash
git clone https://github.com/gykim80/cipher_ref.git
cd cipher_ref
npm install
npm run dev
```

브라우저에서 `http://127.0.0.1:4173`을 엽니다. `WASD`로 이동하고 `E`로 가까운 NPC와 대화합니다.

## Lesson 화면

- `?lesson=scene`: Scene, 좌표축, 첫 3D model
- `?lesson=light`: geometry, material, light, shadow
- `?lesson=camera`: perspective camera와 쿼터뷰
- `?lesson=world`: 지형, 물, 마을
- `?lesson=population`: 캐릭터 catalog와 NPC 배치
- `?lesson=narrative`: objective와 dialogue가 있는 완성 sample

## 폴더

```text
src/core/                 renderer와 game loop
src/modules/environment/  물·지형·마을
src/modules/character/    procedural character와 animation
src/modules/population/   seed 기반 NPC 배치
src/modules/narrative/    objective·dialogue 진행
src/content/              독자가 바꾸는 game data
docs/book/                따라 만들기 원고
```

## 검증

```bash
npm run verify
npm run capture
```

`capture`는 개발 서버가 실행 중일 때 lesson 화면을 `docs/book/img`에 저장합니다.
