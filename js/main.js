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
  const tabs = [...document.querySelectorAll('[role="tab"]')];
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
