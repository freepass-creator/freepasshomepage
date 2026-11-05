(function () {
  "use strict";
  const menu = document.querySelector(".menu-toggle"),
    nav = document.querySelector("#navigation");
  function closeMenu() {
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-label", "메뉴 열기");
  }
  menu.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    nav.classList.toggle("open", open);
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
  });
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      closeMenu();
      menu.focus();
    }
  });
  const tabs = [...document.querySelectorAll('.audience-tabs [role="tab"]')];
  function selectTab(tab) {
    tabs.forEach((t) => {
      const active = t === tab;
      t.setAttribute("aria-selected", String(active));
      t.tabIndex = active ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !active;
    });
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (e) => {
      let next;
      if (e.key === "ArrowRight" || e.key === "ArrowLeft")
        next =
          tabs[
            (i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length
          ];
      if (e.key === "Home") next = tabs[0];
      if (e.key === "End") next = tabs[tabs.length - 1];
      if (next) {
        e.preventDefault();
        selectTab(next);
        next.focus();
      }
    });
  });
  document.querySelectorAll("[data-inquiry]").forEach((a) =>
    a.addEventListener("click", () => {
      document.querySelector('select[name="type"]').value = a.dataset.inquiry;
    }),
  );
  const form = document.querySelector("#contact-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form),
      v = (k) => String(data.get(k) || "").trim();
    const subject =
      "[프리패스모빌리티] " + v("type") + " - " + (v("company") || v("name"));
    const body = [
      "회사명 / 소속: " + (v("company") || "-"),
      "담당자: " + v("name"),
      "연락처: " + (v("phone") || "-"),
      "문의 유형: " + v("type"),
      "",
      "문의 내용",
      v("message") || "-",
    ].join("\n");
    document.querySelector("#form-status").textContent =
      "이메일 앱을 열었습니다. 전송을 완료해 주세요. 앱이 열리지 않으면 pyh@teamjpk.com으로 직접 문의해 주세요.";
    window.location.href =
      "mailto:pyh@teamjpk.com?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(body);
  });
})();

/* Four comparison criteria: accessible, keyboard-operable infographic. */
(function () {
  const copy = {
    vehicle: {
      title: "나의 일상에 맞는 차량인가요?",
      body: "원하는 차종과 상품 정보를 살펴보세요. 출퇴근, 가족과의 이동 등 이용 목적에 맞는 차를 찾는 것부터 시작합니다.",
      tags: ["차종", "상품 정보", "이용 목적"],
    },
    term: {
      title: "얼마나 오래 이용할 계획인가요?",
      body: "상품별로 제공되는 이용 기간을 비교하세요. 같은 차량도 기간에 따라 대여 조건이 달라질 수 있으니, 나의 이용 계획과 함께 살펴보세요.",
      tags: ["이용 기간", "기간별 조건", "이용 계획"],
    },
    budget: {
      title: "매월 대여료와 초기 조건은 어떤가요?",
      body: "월 대여료뿐 아니라 보증금 등 초기 조건을 함께 확인하세요. 자세한 견적과 계약 조건은 상담을 통해 확인한 뒤 결정합니다.",
      tags: ["월 대여료", "보증금", "상세 견적"],
    },
    delivery: {
      title: "언제부터 이용할 수 있나요?",
      body: "상품에 표시된 출고상태를 확인하고, 상담 시 실제 재고와 진행 가능 일정을 확인하세요. 최종 일정은 공급사 확인을 거쳐 안내합니다.",
      tags: ["출고상태", "재고 확인", "일정 상담"],
    },
  };
  const tabs = [...document.querySelectorAll("[data-criterion]")],
    panel = document.getElementById("criterion-panel");
  function activate(tab) {
    const c = copy[tab.dataset.criterion];
    tabs.forEach((t) => {
      const active = t === tab;
      t.setAttribute("aria-selected", String(active));
      t.tabIndex = active ? 0 : -1;
    });
    panel.setAttribute("aria-labelledby", tab.id);
    panel.querySelector(".criterion-count").textContent =
      String(tabs.indexOf(tab) + 1).padStart(2, "0") + " / 04";
    panel.querySelector("h3").textContent = c.title;
    panel.querySelector("p").textContent = c.body;
    panel.querySelector(".criterion-tags").replaceChildren(
      ...c.tags.map((text) => {
        const tag = document.createElement("span");
        tag.textContent = text;
        return tag;
      }),
    );
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => activate(tab));
    tab.addEventListener("keydown", (e) => {
      let n;
      if (e.key === "ArrowRight" || e.key === "ArrowLeft")
        n = (i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
      if (e.key === "Home") n = 0;
      if (e.key === "End") n = tabs.length - 1;
      if (n !== undefined) {
        e.preventDefault();
        activate(tabs[n]);
        tabs[n].focus();
      }
    });
  });
})();
