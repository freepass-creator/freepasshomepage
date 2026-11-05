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

## v2: 이미지·인포그래픽 보강 (2026-11-05)
- 기존 뮤카 사이트용 연출 차량 사진 재사용: mewcar-mobility/apps/sales-portal/assets/mewcar-web-benz-parked-20261012-v1.webp → assets/mobility-lifestyle.webp. 픽셀 확인 후 사용. 실제 판매 매물 오인 방지 설명 포함.
- 신규 assets/mobility-map.svg: 편집 가능한 자동차·도로·상품/상담/계약·인도/운영 흐름 일러스트.
- 차량/기간/대여 조건/출고상태 비교 기준을 선택하는 접근성 탭 인포그래픽 추가.
- 기존 임시 f 심벌을 제거하고 ci_center의 freepassmobility 워드마크 색상·굵기 기준을 적용.
- 뮤카패스 CI: GitHub의 freepasshomepage/ci_center/mewcar/mewcar-mobility, 연결 PC의 C:\dev·사용자 폴더, Drive 이미지 이름을 조사했으나 정확한 CI 원본을 찾지 못함. 뮤카·뮤카모빌리티 CI와 혼동하여 대체하지 않음. 사용자에게 위치 확인 질문 전달, 답변 대기.
- 검증: 앵커/고유 ID/로컬 자산, SVG XML 파싱, JS 구문, 비교 기준 본문 변경/키보드 이동/파트너 탭과의 상태 독립성 검사 PASS. 지정 브라우저 도구 미제공으로 모바일 렌더링은 미검증.
- 새 시안: https://lucid-kernel-efbm3m2.shipstatic.com
- 영구 보관: https://my.shipstatic.com/claim/2276e877db0fe9c8bfcb4b8399cb0d8e
- 이전 시안은 유지되며 v2는 위 새 링크를 사용합니다. 운영 홈페이지는 변경하지 않음.
- next_start_here: 뮤카패스 CI의 정확한 파일을 확인한 후 브랜드 영역에 반영.

## v3: 기존 CI 원본 직접 확인·반영
- 확보 및 픽셀 확인한 자산:
  - freepasserp5/public/assets/freepassmobility-ci-reference.png → assets/freepass-mobility-ci.png
  - mewcar-mobility/apps/sales-portal/assets/mewcar-ci.png → assets/mewcar-original-ci.png
  - mewcar-mobility/apps/sales-portal/assets/mewcar-mobility-ci-20261020.png → assets/mewcar-mobility-ci.png
- 위 자산은 각각 프리패스모빌리티, 뮤카, 뮤카모빌리티 CI입니다. 확인되지 않은 합성 브랜드명이나 새 CI를 만들지 않았습니다.
- 상단·하단의 CSS 텍스트 워드마크를 원본 PNG로 변경. 투명 여백은 CSS 뷰포트로 처리하고 픽셀 원본은 그대로 보관.
- 브랜드 협업 영역을 프리패스 × 뮤카 로고, 상품→영업→운영→고객 선택 흐름, 뮤카모빌리티 가로형 CI로 확대.
- 검증: 자산 존재/alt, JS 구문, Git diff 공백 검사 PASS. 모바일 실브라우저 렌더링 미검증.
- 최신 시안: https://edgy-byte-7w2peuf.shipstatic.com
- 영구 보관: https://my.shipstatic.com/claim/a1956a5d0bbc78cb8cbfd301895db5bf
- next_start_here: index.html #brands 및 위 원본 CI 자산. 운영 홈페이지 적용 전 시안 검토.

## v4: 붕붕마켓 참고, 실제 이미지 중심으로 전면 재구성
- 사용자 수정: 선·표·텍스트 중심의 이전 시안은 의도와 다름. 붕붕마켓 디자인을 참고해 실제 그림/이미지를 적극 활용하도록 정정.
- 확인한 근거: boongboong-market/design/b2c-concept-v2.txt, design/concept-images.json, 연결 PC의 production-desktop.png 및 차량 캠페인 원본. 큰 차량 연출, 생활 장면 그림, 이미지 기반 이용 절차를 적용.
- 신규 이미지 생성: /workspace/generated_images/exec-fb1c8dc5-c74b-4afa-b9fc-6d51b8a3b9d4.png (1536×1024, 2열×3행). 생성 원본 보존. assets/freepass-scenes.webp에 웹 최적화본 저장.
- 6개 장면: SUV 히어로, 가족, 출근, 주말, 상담, 계약·인도. CSS sprite로 각 장면 배치, 글자와 버튼은 별도 HTML 유지. 이미지 내 실제 상품 조건·가격 고정 없음. 연출 이미지 표시.
- 첫 화면 도식, 비교표, 선형 네트워크 삭제. 이미지 10개 배치와 기존 사진/정식 CI 3종 유지. 모바일은 하나의 콘텐츠 트리로 세로 배치.
- 검증: JS 구문, 모든 섹션 링크/ID/로컬 자산, 생성 이미지 접근성 라벨, 메뉴/문의 링크 동작 PASS. 게시 서비스 제공 첫 화면 캡처 확인. 모바일 실브라우저 렌더링은 도구 제한으로 미검증.
- 최신 시안: https://fractal-halo-9vspwx9.shipstatic.com
- 영구 보관: https://my.shipstatic.com/claim/4ba289e15b9314ae57f45795ca9b7f50
- next_start_here: index.html 및 css/style.css의 art 장면 매핑.

## v5: 프리패스모빌리티 회사 홈페이지로 목적 복원
- 사용자 정정: 붕붕마켓은 이미지 표현 참고 대상이며, 프리패스 홈페이지를 소비자 마켓으로 바꾸라는 뜻이 아님.
- 회사 소개 정본: origin/main:index.html. 공급사·영업 파트너·서비스·비전·MEWCAR 협업·사업 문의 구조와 원문의 확인된 기능만 사용.
- 제거: 나의 드라이브, 출근/가족/여행 추천, 소비자 차량 쇼핑 캠페인, 생활 장면 이미지.
- 신규 아트: /workspace/generated_images/exec-4f835860-530f-4c45-9787-2014ed4d90da.png. 공급사→프리패스→영업 파트너 사업 구조, 상품 정보 정리, 영업 제안, 전자계약·청구·정산, 공급사 협업, 기업 간 협업의 6장면. 원본 보존, assets/freepass-corporate-scenes.webp로 웹 최적화. 장면은 실제 사옥/직원/고객 사진이 아닌 사업 설명용 일러스트.
- 첫 화면: 기존 문구 '흩어진 기회를 영업실적으로 엮어냅니다'와 모빌리티 중개 플랫폼 소개 복원. 상품 링크는 상품 플랫폼으로 구분하고, 사업 소개·제휴 문의를 안내.
- CI 원본 3종 유지. 운영 홈페이지에는 적용하지 않고 검토용 링크 게시.
- 검증: 회사 핵심 기능과 주체의 콘텐츠 포함/소비자 캠페인 제거, 앵커/고유 ID/자산 경로/이미지 접근성 설명, JS 구문, diff 검사 PASS. 모바일 실브라우저 렌더링은 미검증.
- 최신 시안: https://intense-diode-pt7c5y2.shipstatic.com
- 보관: https://my.shipstatic.com/claim/227653486425829db994c3b7f633558b
- next_start_here: 이 v5 절과 index.html. 홈페이지 목적은 프리패스의 회사·사업 소개이며 소비자 매물 마켓이 아님.
