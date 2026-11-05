# 프리패스 홈페이지 고객용 디자인 시안

- 기준 저장소: freepass-creator/freepasshomepage
- 기준 revision: a29f7e478e9c88d6824380e3a3bee87299697dc9
- 작업 브랜치: work/freepasshomepage/customer-design
- 디자인 참고: 렌트채권 마켓의 navy #16314d, teal #15916b, Pretendard, 간결한 구획과 정보 위계.
- 기존 자산 재사용: assets/mewcar-ci.svg, 회사 정보, 상품 찾기 URL, 메일 수신처. 인포그래픽은 기존 공급사→프리패스→영업채널 연결 개념을 고객 이해에 맞춰 HTML/CSS/SVG로 구현.
- 내용: 고객용 상품 비교 안내, 이용 3단계, 영업 파트너/공급사 전환 탭, 운영 기반, MEWCAR, FAQ, 문의.

## 적용
index.html, css/style.css, js/main.js를 기존 정적 홈페이지의 동일 경로에 적용합니다. assets/mewcar-ci.svg는 기존 파일을 유지합니다. 서버·빌드·추가 npm 의존성이 필요하지 않습니다. 현재 운영 사이트에는 적용하지 않고 시안 링크로 게시합니다.

## 동작
상품 찾기는 https://freepasserp.com/ 을 새 창으로 엽니다. 문의 폼은 기존 방식대로 기본 이메일 앱을 열며 사용자가 이메일 앱에서 전송해야 전달됩니다. 서버 접수나 개인정보 저장 기능을 추가하지 않았습니다.

## 검증
- node --check js/main.js 통과.
- HTML id 중복, 앵커 대상, 로컬 이미지/CSS/JS 경로 검사 통과.
- Node VM 기반 메뉴 토글, 파트너 탭 상태 전환, 방향키 이동, 문의 mailto 생성 검사 통과.
- prettier 3.6.2 적용.
- 관리형 환경의 cua_repl.js 및 Sites helper 미제공으로 브라우저 렌더링·모바일 실제 화면은 미검증. 공개 전 뷰포트별 육안 검토 권장.
- .ai-core/verify-kit.mjs: 전체 Git 이력 fetch 후 PASS. 기존 bootstrap의 중앙 Core freshness 경고는 별도 미해결이며, 번들 무결성은 확인.

next_start_here: 이 문서와 index.html. 현재 브랜치에서 시안 의견을 반영하고 운영 배포 경로를 확인합니다.
