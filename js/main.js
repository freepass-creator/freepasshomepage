/* 뮤카패스 — «누구세요» 입구 + 문구 복사 + 폰 하단 문의 버튼 */
(function () {
  "use strict";
  /* 첫 화면을 먼저 그린 뒤에 시작한다(아래쪽 등장 효과·메뉴 연결은 그려진 다음이어도 눈에 띄지 않는다) */
  function boot() {

  var START = {
    channel: {
      title: "상품 찾는 시간은 줄이고,<br>고객에게만 <span class=\"nw\"><em class=\"pop\">집중</em>할 수 있어요.</span>",
      points: [
        "여러 공급사의 차량·기간·대여료·보증금·출고 상태를 <b>같은 기준</b>으로 검색",
        "견적기와 <b>우리 팀 이름을 단 고객용 화면(화이트라벨)</b>으로 바로 제안",
        "전자계약부터 실적 기준 <b>영업 정산</b>까지 한 흐름"
      ],
      msg: "[뮤카패스] 영업 채널(영업팀·대리점)입니다. 상품 찾기와 파트너 등록이 궁금해요."
    },
    supplier: {
      title: "차만 <em class=\"pop\">잘</em> 준비해 주시면,<br>세일즈와 계약은 파트너분들이 이어 드려요.",
      points: [
        "쓰시던 상품 자료를 <b>그대로 주시면</b> 영업 채널이 비교하기 쉬운 기준으로 정리",
        "상품이 영업 채널의 <b>검색과 제안으로 바로 연결</b>",
        "월마감 뒤 <b>공급사 청구까지</b> 실적 기준으로 바로 정리"
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
  var hasStart = !!(title && list && msg && status);   /* 회사 소개(about) 페이지에는 «누구세요» 입구가 없다 */

  function pick(key) {
    var s = START[key]; if (!s || !hasStart) return;
    title.innerHTML = s.title;  /* 고정 문구(START)만 넣는다 */
    list.innerHTML = s.points.map(function (p) { return "<li>" + p + "</li>"; }).join("");
    msg.textContent = s.msg;
    status.textContent = "";
    buttons.forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.start === key)); });
  }
  buttons.forEach(function (b) {
    b.addEventListener("click", function () {
      pick(b.dataset.start);
      if (window.matchMedia("(max-width: 860px)").matches) {
        var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;  /* 움직임 줄이기 설정 존중 */
        document.querySelector(".start-answer").scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" });
      }
    });
  });

  /* 첫 화면 그림의 공급사·영업 채널 칸을 누르면 이용 안내에서 그 칸을 골라 둔 채로 내려간다 */
  document.querySelectorAll("[data-start-go]").forEach(function (a) {
    a.addEventListener("click", function () { pick(a.getAttribute("data-start-go")); });
  });

  /* 문구 복사: 복사는 방문자가 직접 누를 때만 */
  var copyBtn = document.getElementById("start-copy");
  var copyLabel = copyBtn ? copyBtn.textContent : "", copyTimer = 0;   /* 두 번 눌러도 원래 글자로 돌아오게 고정 */
  if (copyBtn) copyBtn.addEventListener("click", function () {
    var text = msg.textContent;
    function done() {
      status.textContent = "복사했어요. 카톡 대화창에 붙여넣으시면 돼요.";
      copyBtn.classList.add("done"); copyBtn.textContent = "복사됨 ✓";
      clearTimeout(copyTimer);
      copyTimer = setTimeout(function () { copyBtn.classList.remove("done"); copyBtn.textContent = copyLabel; }, 1600);
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else { fallback(); }
    function fallback() {
      var t = document.createElement("textarea"); t.value = text; t.setAttribute("readonly", "");
      t.style.position = "fixed"; t.style.opacity = "0"; document.body.appendChild(t); t.select(); t.setSelectionRange(0, text.length);
      var ok = false; try { ok = document.execCommand("copy"); } catch (e) { ok = false; }   /* 실패하면 false 만 돌려주는 브라우저가 있다 */
      if (ok) done(); else status.textContent = "복사가 안 되면 문구를 길게 눌러 복사하시면 돼요.";
      document.body.removeChild(t);
    }
  });

  
  var dock = document.getElementById("dock");
  var gate = document.getElementById("flow");
  var watch = document.querySelectorAll(".last .cta, .start-answer .cta, footer.foot");
  if (dock && gate && "IntersectionObserver" in window) {
    var visible = new Set();
    function update() {
      var passed = window.scrollY > 0 && gate.getBoundingClientRect().top < window.innerHeight * 0.5;
      dock.classList.toggle("show", passed && visible.size === 0);
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target); });
      update();
    });
    watch.forEach(function (el) { io.observe(el); });
    window.addEventListener("scroll", update, { passive: true }); update();
  }

  /* 모바일 햄버거 메뉴 — 메뉴를 누르면 닫히고, 바깥을 누르거나 Esc 로도 닫힌다 */
  var burger = document.getElementById("burger");
  var nav = document.getElementById("top-nav");
  if (burger && nav) {
    function setMenu(open) {
      nav.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    }
    burger.addEventListener("click", function (e) { e.stopPropagation(); setMenu(!nav.classList.contains("open")); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("click", function (e) { if (!nav.contains(e.target)) setMenu(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape" || !nav.classList.contains("open")) return;
      var inside = nav.contains(document.activeElement);
      setMenu(false);
      if (inside) burger.focus();   /* 메뉴 안에서 닫으면 포커스를 메뉴 단추로 돌려 놓는다 */
    });
  }

  /* 스크롤 등장: 첫 화면 아래에 있는 카드만, 같은 줄은 차례로(0.06초 간격). 스크립트가 없으면 그냥 보인다 */
  if (!window.matchMedia("(max-width: 640px), (prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
    /* «rv» 표시는 스크립트만 붙이므로 <html> 에 따로 표시하지 않는다(붙이면 문서 전체를 다시 계산해 첫 로딩이 막혔다) */
    var rvSel = ".sec > .wrap > .eyebrow, .sec h2.poster .pre, .sec h2.poster .main, .sec-lead, .what-card, .what-card li, .about-link, .flow-steps li, .ease li, .tool, .erp-guide, .erp-steps li, .family, .ai-band, .ai-list li, .start-choices button, .start-answer, .faq details, .fam-parent, .fam-card, .about-info .info > div, .about-acts, .last h2, .last p";
    var rvIo = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target; el.classList.add("in"); rvIo.unobserve(el);
        /* 등장이 끝나면 표시를 걷어 원래의 hover·눌림 반응으로 돌려 놓는다 */
        setTimeout(function () { el.classList.remove("rv", "in"); el.style.removeProperty("--d"); }, 2400);
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    /* 아래쪽 구역 속까지 재면 배치를 미리 다 하게 되므로, 구역(섹션) 위치로만 첫 화면 밖인지 판단한다 */
    var vh = window.innerHeight, below = new Map(), pendingReveal = [];
    document.querySelectorAll(rvSel).forEach(function (el) {
      var sec = el.closest("section, footer") || el;
      if (!below.has(sec)) below.set(sec, sec.getBoundingClientRect().top >= vh);
      if (below.get(sec) && !el.closest("[hidden]")) pendingReveal.push(el);
    });
    pendingReveal.forEach(function (el) {
      var i = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.setProperty("--d", Math.min(i, 8) * 0.11 + "s");
      el.classList.add("rv");
      rvIo.observe(el);
    });
  }

  
  if (nav) {
    var spy = [];
    nav.querySelectorAll('a[href^="#"]').forEach(function (a) {
      var sec = document.getElementById(a.getAttribute("href").slice(1));
      if (sec) spy.push({ a: a, s: sec });
    });
    if (spy.length) {
      var spyTick = false;
      function spyUpdate() {
        spyTick = false;
        var line = window.innerHeight * 0.4, cur = null;
        if (window.scrollY > 0) spy.forEach(function (o) { var r = o.s.getBoundingClientRect(); if (r.top <= line && r.bottom > line) cur = o; });
        spy.forEach(function (o) {
          var on = o === cur; o.a.classList.toggle("on", on);
          if (on) o.a.setAttribute("aria-current", "location"); else if (o.a.getAttribute("aria-current") === "location") o.a.removeAttribute("aria-current");
        });
      }
      window.addEventListener("scroll", function () { if (!spyTick) { spyTick = true; requestAnimationFrame(spyUpdate); } }, { passive: true });
      spyUpdate();
    }
  }

  
  /* 살아 있는 느낌: 카드 위에서 빛이 마우스를 따라오고, 첫 화면 그림이 마우스 위치에 살짝 반응한다(마우스가 있고 움직임을 허용한 기기에서만) */
  if (window.matchMedia("(hover:hover) and (prefers-reduced-motion:no-preference)").matches) {
    var GLOW = ".what-card,.tool,.flow-steps li,.erp-guide,.start-choices button";
    var heroArt = document.querySelector(".hero-art"), heroBox = document.querySelector(".hero");
    var mx = 0, my = 0, glowEl = null, ticking = false;
    var paint = function () {
      ticking = false;
      if (glowEl) {
        var r = glowEl.getBoundingClientRect();
        glowEl.style.setProperty("--mx", (mx - r.left) + "px"); glowEl.style.setProperty("--my", (my - r.top) + "px");
      }
      if (heroArt && heroBox) {
        var h = heroBox.getBoundingClientRect(), inside = my >= h.top && my <= h.bottom;
        heroArt.style.setProperty("--px", inside ? ((mx / window.innerWidth) * 2 - 1).toFixed(3) : "0");
        heroArt.style.setProperty("--py", inside ? (((my - h.top) / h.height) * 2 - 1).toFixed(3) : "0");
      }
    };
    document.addEventListener("pointermove", function (e) {
      mx = e.clientX; my = e.clientY;
      glowEl = e.target.closest ? e.target.closest(GLOW) : null;
      if (!ticking) { ticking = true; requestAnimationFrame(paint); }
    }, { passive: true });
  }

  var top = document.getElementById("top");
  if (!top) return;
  var lastY = window.scrollY;
  function onScroll() {
    var y = window.scrollY;
    top.classList.toggle("scr", y > 8);
    var menuOpen = nav && nav.classList.contains("open");
    if (y < 80 || menuOpen) top.classList.remove("tuck");
    else if (y > lastY + 4) top.classList.add("tuck");
    else if (y < lastY - 4) top.classList.remove("tuck");
    if (Math.abs(y - lastY) > 4) lastY = y;
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  }
  /* 화면 밖 구역은 글꼴이 올 때까지 배치를 건너뛴다(CSS content-visibility) — 글꼴이 바뀔 때 다시 배치할 양이 화면 안으로 준다.
     글꼴이 오면 한 장면에 한 구역씩 펼친다(한꺼번에 펼치면 긴 작업). 계속 건너뛰게 두면 접근성 검사기가 그 구역 색을 잘못 읽는다 */
  function unfold(narrow) {
    var secs = Array.prototype.slice.call(document.querySelectorAll("main > section, .foot"));
    (function next() {
      var s = secs.shift(); if (!s) return;
      if (!s.classList.contains("cv-open")) s.classList.add("cv-open");
      requestAnimationFrame(function () { setTimeout(next, narrow ? 115 : 0); });
    })();
  }
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () {
    var narrow = window.matchMedia("(max-width: 640px)").matches;
    requestAnimationFrame(function () {
      if (!narrow) { setTimeout(function () { unfold(false); }, 0); return; }
      setTimeout(function () {
        if ("requestIdleCallback" in window) requestIdleCallback(function () { unfold(true); }, {timeout: 800});
        else unfold(true);
      }, 1550);
    });
  });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { requestAnimationFrame(function () { setTimeout(boot, 0); }); });
  else requestAnimationFrame(function () { setTimeout(boot, 0); });
})();


(() => {
  const board = document.querySelector('.board');
  if (!board || !board.querySelector('.route-layer')) return;
  const hub = board.querySelector('.board-hub');
  const overlay = board.querySelector('.route-layer');
  const sources = [...board.querySelectorAll('.src')];
  const outputs = [...board.querySelectorAll('.std')];
  const makePath = (path, kind, delay) => {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    el.setAttribute('d', path);
    el.setAttribute('class', kind);
    el.setAttribute('pathLength', '100');
    el.style.setProperty('--delay', delay + 's');
    return el;
  };

  const inputLabels = ['엑셀', 'PDF', '카톡'];
  const packets = [];
  function makePacket(index, delay) {
    const inPacket = index < inputLabels.length;
    const el = document.createElementNS('http://www.w3.org/2000/svg','g');
    el.setAttribute('class', 'route-packet ' + (inPacket ? 'in-' + index : 'out'));
    el.style.setProperty('--delay', delay + 's');
    if (inPacket) {
      el.innerHTML = '<rect x="-14" y="-6.5" width="28" height="13"/><text x="0" y="3">' + inputLabels[index] + '</text>';
    } else {
      el.innerHTML = '<rect x="-6.5" y="-6.5" width="13" height="13"/><path d="M -3,0 L -1,2 L 3,-2"/>';
    }
    overlay.append(el);
    return el;
  }
  function draw() {
    const origin = overlay.getBoundingClientRect();
    const bounds = el => {
      const rect = el.getBoundingClientRect();
      return {
        left: rect.left - origin.left, right: rect.right - origin.left,
        center: rect.top + rect.height / 2 - origin.top
      };
    };
    const box = bounds(hub);
    const routes = [
      ...sources.map((item, index) => [bounds(item).right, bounds(item).center, box.left, box.center + (index - 1) * 12, index * .44]),
      ...outputs.map((item, index) => [box.right, box.center + (index - 1) * 12, bounds(item).left, bounds(item).center, 4.55 + index * .44])
    ];
    overlay.setAttribute('viewBox', '0 0 ' + origin.width + ' ' + origin.height);
    for (const [index, route] of routes.entries()) {
      const [x1, y1, x2, y2, delay] = route;
      const elbow = x1 + (x2 - x1) * .57;
      const direction = Math.sign(y2 - y1);
      const bend = Math.min(9, Math.max(2, (x2 - x1) / 3), Math.abs(y2 - y1) / 2);
      const path = 'M ' + x1 + ',' + y1 + ' H ' + (elbow - bend)
        + ' Q ' + elbow + ',' + y1 + ' ' + elbow + ',' + (y1 + bend * direction)
        + ' V ' + (y2 - bend * direction) + ' Q ' + elbow + ',' + y2 + ' ' + (elbow + bend) + ',' + y2
        + ' H ' + x2;
      for (const [offset, kind] of [[0, 'rail'],[1, 'pulse']]) {
        const current = overlay.querySelectorAll('.rail, .pulse')[index * 2 + offset];
        if (current) current.setAttribute('d', path);
        else overlay.insertBefore(makePath(path, kind, delay), packets[0] || null);
      }
      const packet = packets[index] || (packets[index] = makePacket(index, delay));
      packet.style.offsetPath = 'path("' + path + '")';
    }
  }
  sources.forEach((item,index) => item.style.setProperty('--delay', index * .44 + 's'));
  outputs.forEach((item,index) => item.style.setProperty('--delay', index * .44 + 's'));
  const start = () => {
    draw();
    if ('ResizeObserver' in window) new ResizeObserver(draw).observe(board);
    board.classList.add('flow-ready');
    button.hidden = false;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => board.classList.toggle('is-offscreen', !entries[0].isIntersecting)).observe(board);
    }
  };
  const button = document.querySelector('.flow-toggle');
  button.addEventListener('click', () => {
    const paused = board.classList.toggle('is-paused');
    const label = paused ? '정제 흐름 재생' : '정제 흐름 일시정지';
    button.setAttribute('aria-label', label);
    button.title = label;
    button.textContent = paused ? '▶' : 'Ⅱ';
  });
  const initialize = () => {
    document.fonts.ready.then(() => {
      if ('requestIdleCallback' in window) requestIdleCallback(start, {timeout: 1500});
      else start();
    });
  };
  if (matchMedia('(max-width: 640px) and (prefers-reduced-motion: no-preference)').matches) {
    const delayed = () => setTimeout(initialize, 4200);
    if (document.readyState === 'complete') delayed();
    else window.addEventListener('load', delayed, {once: true});
  } else {
    initialize();
  }
})();



(() => {
  const list = document.querySelector('.tool-select');
  if (!list) return;
  const tabs = [...list.querySelectorAll('[role=tab]')];
  function select(tab, focus = false) {
    for (const item of tabs) {
      const chosen = item === tab;
      item.setAttribute('aria-selected', String(chosen));
      item.tabIndex = chosen ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !chosen;
    }
    if (focus) tab.focus();
  }
  tabs.forEach(tab => tab.addEventListener('click', () => select(tab)));
  list.addEventListener('keydown', event => {
    const active = tabs.indexOf(event.target);
    if (active < 0) return;
    const keys = {ArrowRight: (active + 1) % tabs.length, ArrowLeft: (active + tabs.length - 1) % tabs.length, Home: 0, End: tabs.length - 1};
    if (!(event.key in keys)) return;
    event.preventDefault();
    select(tabs[keys[event.key]], true);
  });
  const deepLinks = {'#erp-guide-h': 'tool-search', '#quote-guide-h': 'tool-quote', '#contract-tool': 'contract-tool', '#white-preview-h': 'tool-white'};
  function followHash() {
    const id = deepLinks[location.hash];
    if (!id) return;
    select(document.getElementById(id));
    requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView({block:'start'}));
  }
  document.querySelectorAll('a[href="#quote-guide-h"],a[href="#contract-tool"],a[href="#white-preview-h"]').forEach(link => link.addEventListener('click', () => select(document.getElementById(deepLinks[link.hash]))));
  window.addEventListener('hashchange', followHash);
  followHash();
})();



(() => {
  const fields = document.querySelectorAll('.quote-options select');
  const announcement = document.querySelector('.quote-announce');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const rows = new WeakMap();
  for (const field of fields) field.addEventListener('change', () => {
    const output = document.getElementById(field.id + '-value');
    output.textContent = field.value;
    const customerValue = document.querySelector('[data-quote-mirror="' + field.id + '"]');
    customerValue.textContent = field.value;
    announcement.textContent = field.labels[0].firstChild.textContent.trim() + ' ' + field.value + ' 반영됨';
    if (!reduceMotion.matches && output.animate) {
      const row = output.closest('.tool-preview-row');
      rows.get(row)?.cancel();
      rows.set(row, row.animate([{backgroundColor:'#d6f5ee'}, {backgroundColor:'#fff'}], {duration:420,easing:'ease-out'}));
    }
  });
})();
