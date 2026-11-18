/* 뮤카패스 — «누구세요» 입구 + 문구 복사 + 폰 하단 문의 버튼 */
(function () {
  "use strict";

  var START = {
    sales: {
      title: "상품 찾는 시간은 줄이고, 고객에게 집중하세요.",
      points: [
        "여러 공급사의 차량·기간·대여료·보증금·출고상태를 <b>같은 기준</b>으로 검색",
        "견적기와 고객용 화면으로 <b>바로 비교·제안</b>",
        "전자계약부터 청구·정산까지 <b>계약 이후도 한 흐름</b>"
      ],
      msg: "[뮤카패스] 영업자입니다. 상품 찾기와 파트너 등록이 궁금해요."
    },
    team: {
      title: "우리 이름으로, 같은 상품을 보여주세요.",
      points: [
        "회사 CI·담당자 정보로 보이는 <b>고객용 상품 화면(화이트라벨)</b>",
        "담당자별로 고객이 이어지는 <b>귀속 관리</b>",
        "팀 실적 기준의 <b>청구·정산</b>까지 한 번에"
      ],
      msg: "[뮤카패스] 영업팀(대리점)입니다. 화이트라벨과 팀 단위 이용이 궁금해요."
    },
    supplier: {
      title: "좋은 상품이 더 많은 영업 현장에 닿도록.",
      points: [
        "차량·대여료·보증금·출고상태를 <b>영업자가 비교하기 쉬운 기준</b>으로 정리",
        "상품이 영업자의 <b>검색과 제안으로 바로 연결</b>",
        "계약 이후 <b>공급사 청구까지</b> 거래 기준으로 관리"
      ],
      msg: "[뮤카패스] 공급사(렌터카사)입니다. 상품 입점 방법이 궁금해요."
    },
    etc: {
      title: "필요한 구조를 함께 만들어요.",
      points: [
        "상품 공급·영업 운영·사업 제휴 모두 이야기할 수 있어요",
        "정해진 양식 없이 <b>카톡으로 편하게</b> 시작해요"
      ],
      msg: "[뮤카패스] 제휴 문의드립니다."
    }
  };

  var title = document.getElementById("start-title");
  var list = document.getElementById("start-points");
  var msg = document.getElementById("start-msg");
  var status = document.getElementById("copy-status");
  var buttons = document.querySelectorAll("[data-start]");

  function pick(key) {
    var s = START[key]; if (!s) return;
    title.textContent = s.title;
    list.innerHTML = s.points.map(function (p) { return "<li>" + p + "</li>"; }).join("");
    msg.textContent = s.msg;
    status.textContent = "문구를 복사해 붙여넣거나, 편하게 말씀해 주세요.";
    buttons.forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.start === key)); });
  }
  buttons.forEach(function (b) {
    b.addEventListener("click", function () {
      pick(b.dataset.start);
      if (window.matchMedia("(max-width: 860px)").matches) {
        document.querySelector(".start-answer").scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* 문구 복사: 복사는 방문자가 직접 누를 때만 */
  var copyBtn = document.getElementById("start-copy");
  copyBtn.addEventListener("click", function () {
    var text = msg.textContent;
    function done() { status.textContent = "복사했어요. 카톡 대화창에 붙여넣어 주세요."; }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else { fallback(); }
    function fallback() {
      var t = document.createElement("textarea"); t.value = text; t.setAttribute("readonly", "");
      t.style.position = "fixed"; t.style.opacity = "0"; document.body.appendChild(t); t.select();
      try { document.execCommand("copy"); done(); } catch (e) { status.textContent = "복사가 안 되면 문구를 길게 눌러 복사해 주세요."; }
      document.body.removeChild(t);
    }
  });

  /* 폰 하단 문의 버튼: 설명(하는 일·일하는 방식)을 지나야 나타나고, 다른 문의 버튼이 보이는 동안에는 숨긴다.
     대표 11-18 «설명도 없는데 카톡 문의하기가 바로 나오냐». */
  var dock = document.getElementById("dock");
  var gate = document.getElementById("flow");
  var watch = document.querySelectorAll(".last .cta, .start-answer .cta");
  if (dock && gate && "IntersectionObserver" in window) {
    var visible = new Set();
    function update() {
      var passed = gate.getBoundingClientRect().top < window.innerHeight * 0.5;
      dock.classList.toggle("show", passed && visible.size === 0);
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target); });
      update();
    });
    watch.forEach(function (el) { io.observe(el); });
    window.addEventListener("scroll", update, { passive: true }); update();
  }

  /* 머리띠: 스크롤하면 그림자 */
  var top = document.getElementById("top");
  function onScroll() { top.classList.toggle("scr", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
})();
