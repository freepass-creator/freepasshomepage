<!-- AI-OPS-PROJECT-RULES:v1 -->
**▣ 이 저장소에서 일하는 모든 AI가 먼저 지키는 것 — 오픈·검사·마감 (대표 11-19 «그 프로젝트에 그냥 지침을 박아놔야 돼 … 이마에다 새겨놔야 돼»)**

바탕 규칙 정본: `C:/dev/ai-ops/docs/대표-지침-실행규칙.md` (그 PC에 없으면 GitHub `freepass-creator/ai-ops` 같은 경로). 이 블록은 그 요약이며 아래 저장소 고유 규칙보다 앞선다 — 단 저장소의 안전·보안 규칙은 그대로 지킨다. 이 블록은 `node C:/dev/ai-ops/scripts/ai/지침.mjs 프로젝트박기 <저장소>` 로만 고친다(손으로 고치면 다음 박기 때 덮인다).

**오픈 (시작할 때)**
1. 완료 기준 한 줄을 정한다(어디서 무엇이 보이면 끝인가).
2. `git fetch` 후 기본 가지 최신에서 작업 사본을 만든다: `C:/dev/_wt/<저장소>/<작업ID>`. 본 체크아웃에 직접 커밋을 쌓지 않는다.
3. 이미 있는지 본다: 열린 PR(`gh pr list`)·다른 세션 작업·이 저장소 문서.
4. 아래 저장소 고유 규칙을 읽는다.

**하는 중**
- 묻는 것은 돈·되돌릴 수 없음·법적 약속·보안 설정·비밀값·권한 확대·외부 발송뿐. 그 밖은 «대표가 ‘아니’라고 할 이유가 있나?»를 스스로 판단해 없으면 하고 결과로 보고한다.
- 막히면 원인 확인 후 다른 길 두 번, 안전장치는 우회하지 않고 «막힘: 무엇이 왜, 누가 풀 수 있나»를 올린다.
- 알아낸 사실·정한 값은 정본(서버·시트·결정 장부)에 들어가고 재조회돼야 끝. 내 역할이 아니면 역할대로 넘긴다(PC4 응대·PC3 수집·PC1 서버·PC0 지침).

**검사 (병합 전 필수 — 하나라도 빠지면 병합하지 않는다)**
- 이 저장소의 시험·빌드·형식 검사를 전부 통과. GitHub 검사가 결제·러너 문제로 안 돌면 같은 검사를 로컬에서 돌리고 결과를 PR 댓글에 남긴다.
- 웹 화면을 만들거나 바꿨으면 Lighthouse 4점수(성능·접근성·권장사항·SEO)를 **모바일·데스크톱 둘 다 95 이상**(목표 100). 95 미만이거나 이전보다 낮으면 병합 금지. 재는 법 `C:/dev/ai-ops/docs/aiknowhow/라이트하우스.md`.
- 웹이면 품질 검사 필수 항목(보안 헤더·깨진 링크·카톡 공유 미리보기·휴대폰 폭·콘솔 오류 0): `C:/dev/ai-ops/docs/aiknowhow/품질검사-목록.md`.
- 결과 숫자를 PR 본문·보고에 적는다.

**마감 (끝낼 때 — 이게 끝나야 «완료»)**
1. PR → 검사 → 병합.
2. 운영·실제 화면에서 반영을 다시 조회한다(웹은 운영 주소로 Lighthouse 재측정).
3. 병합된 작업 가지·작업 사본을 지운다(미커밋·미푸시가 없는지 먼저 확인, 강제 삭제 금지).
4. 대표 결정은 결정 장부(`scripts/결정/박기.ps1`), 다음 사람용은 인계(next_start_here).
5. `node C:/dev/ai-ops/scripts/ai/마감점검.mjs` 가 «마감 정상»이어야 «완료»라고 보고한다. «부족» 줄이 있으면 그것부터 끝낸다.

**보고**: 결과 → 확인 근거 → 남은 것 → 새로 알아야 할 것 → 다음. 확인 못 했으면 «실행함·미검증».
<!-- /AI-OPS-PROJECT-RULES:v1 -->

# Project AI entrypoint

Before editing, read project-owned instructions and `.ai-core/START_HERE.md`. Use `.ai-core/catalog/` to identify current projects, capabilities, and work routes. Run `node .ai-core/verify-kit.mjs` before relying on the bundled standards. Preserve this project's canonical source, existing assets, history, and deployment boundaries. Record purpose, target revision, changes, verification, remaining uncertainty, and `next_start_here`.

## 글꼴
문구(index.html·about.html·js/main.js)를 바꾸면 `python tools/subset-fonts.py` 로 글꼴을 다시 줄이고 `--check` 로 빠진 글자가 없는지 확인한다. 글꼴은 페이지에 쓰인 글자만 담고 있다.
