# 07. 자신만의 CIPHER로 바꾸기

이제 reference의 이름과 색만 바꾸는 단계를 넘어 자기 게임의 기준을 세웁니다. 한꺼번에 장편을 만들지 말고 한 구역, 세 인물, 한 사건으로 시작합니다.

## 한 장짜리 기획

다음 네 문장을 먼저 채웁니다.

```text
주인공은 ______이다.
이 구역은 ______ 때문에 평소와 달라졌다.
주인공이 처음 만나는 사람은 ______이다.
이 장이 끝날 때 플레이어는 ______을 알게 된다.
```

이 네 문장을 파일에 대응합니다.

| 기획 | 파일의 위치 |
|---|---|
| 구역과 분위기 | `world` |
| 인물의 외형과 역할 | `characters` |
| 사람 수와 행동 | `population` |
| 사건의 진행 | `narrative.beats` |
| 실제 대사 | `narrative.dialogues` |

## 교체 순서

1. `world.name`과 물·집을 바꿉니다.
2. Character catalog를 자기 인물 이름과 색으로 바꿉니다.
3. Population group의 수와 행동을 바꿉니다.
4. 한 줄 시나리오를 2~4개 beat로 나눕니다.
5. 대사를 씁니다.
6. `npm run verify`를 통과시킵니다.
7. `npm run capture`로 여섯 단계 화면을 다시 찍습니다.

## GitHub에 올리기

새 공개 저장소를 만든 뒤 주소를 연결합니다.

```bash
git add .
git commit -m "Create my game from cipher_ref"
git remote add origin https://github.com/gykim80/MY_GAME.git
git push -u origin main
```

GitHub Pages나 정적 hosting에서는 `npm run build`가 만든 `dist`를 배포합니다. API server나 database가 없으므로 첫 버전은 정적 파일만으로 공개할 수 있습니다.

## 다음 module

reference가 표현하지 못하는 기능이 필요할 때 module을 하나씩 늘립니다.

- 전투가 필요하면 `combat` module과 skill data를 추가합니다.
- inventory가 필요하면 `inventory` module을 추가합니다.
- GLB를 쓰려면 Character module의 primitive 생성 부분을 loader로 교체합니다.
- 여러 장을 잇고 싶으면 Narrative에 chapter 전환 action을 추가합니다.

기준은 같습니다. content는 무엇을 만들지 말하고 module은 그것을 어떻게 실행할지 맡습니다. 이 경계를 지키면 `cipher_ref`를 떠난 뒤에도 자기 게임이 커질 수 있습니다.

최종 체크포인트: repository 이름, 마을, 등장인물, NPC 행동, 첫 사건이 reference와 다른 자기 게임이 되고 `npm run verify`가 통과합니다.
