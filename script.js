/* ============================================================
   FREEPASS MOBILITY — 스크립트
   ============================================================ */

/* ── 1. 히어로 캔버스 ── */
(function () {
  const canvas = document.getElementById('sky');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  let W, H;
  let mouseX = 0.5, mouseY = 0.5;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    W = rect.width; H = rect.height;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  canvas.parentElement.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouseX = (e.clientX - r.left) / r.width;
    mouseY = (e.clientY - r.top) / r.height;
  });

  /* ── 별 3레이어 (깊이감) ── */
  const starLayers = [
    // 먼 별 (느리게 움직임)
    Array.from({ length: 180 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 0.6 + 0.15,
      twSpd: Math.random() * 0.0015 + 0.0002,
      phase: Math.random() * Math.PI * 2,
      baseA: Math.random() * 0.3 + 0.05,
      depth: 0.15,
    })),
    // 중간 별
    Array.from({ length: 60 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.0 + 0.4,
      twSpd: Math.random() * 0.002 + 0.0004,
      phase: Math.random() * Math.PI * 2,
      baseA: Math.random() * 0.35 + 0.15,
      depth: 0.3,
    })),
    // 가까운 밝은 별 (글로우 포함)
    Array.from({ length: 15 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.4 + 0.8,
      twSpd: Math.random() * 0.0018 + 0.0005,
      phase: Math.random() * Math.PI * 2,
      baseA: Math.random() * 0.3 + 0.35,
      depth: 0.5,
      glow: true,
    })),
  ];

  /* ── 유성 ── */
  const shooters = [];
  setInterval(() => {
    const count = Math.random() < 0.25 ? 2 : 1;
    for (let n = 0; n < count; n++) {
      if (Math.random() < 0.65) {
        const spread = (Math.random() - 0.5) * 0.6;
        const baseAngle = Math.PI / 4 + spread;
        const speed = Math.random() * 0.005 + 0.003;
        shooters.push({
          x: Math.random() * 0.7 + 0.1,
          y: Math.random() * 0.4,
          vx: Math.cos(baseAngle) * speed,
          vy: Math.sin(baseAngle) * speed,
          life: 1,
          decay: Math.random() * 0.012 + 0.005,
          len: Math.random() * 70 + 35,
          width: Math.random() * 1.0 + 0.4,
        });
      }
    }
  }, 2500);

  /* ── 중개 네트워크 구조 ──
     손님들(흩어짐) → 영업자들 → 프리패스(허브) ← 렌터카사들
  */
  const HUB = { x: 0.70, y: 0.35 };

  // 영업파트너 (5명 — 렌터카사보다 많음)
  const SALES = [
    { x: 0.38, y: 0.18, label: '영업파트너', color: [140,210,255] },
    { x: 0.35, y: 0.42, label: '영업파트너', color: [130,200,250] },
    { x: 0.40, y: 0.65, label: '영업파트너', color: [120,195,245] },
    { x: 0.48, y: 0.82, label: '영업파트너', color: [135,205,252] },
    { x: 0.30, y: 0.80, label: '영업파트너', color: [125,198,248] },
  ];

  // 렌터카사 (3개 — 차량 위성 여러 개 보유)
  const RENTALS = [
    { x: 0.85, y: 0.20, label: '렌터카사', color: [100,185,245] },
    { x: 0.88, y: 0.50, label: '렌터카사', color: [90,175,240] },
    { x: 0.82, y: 0.75, label: '렌터카사', color: [95,180,242] },
  ];


  // 영업파트너 위성 (작은 점 2~3개)
  SALES.forEach(n => {
    n.satellites = Array.from({ length: 2 }, (_, i) => ({
      angle: (i / 2) * Math.PI * 2 + Math.random(),
      dist: 14 + Math.random() * 6,
      speed: (Math.random() * 0.0003 + 0.0002) * (Math.random() < 0.5 ? 1 : -1),
      r: Math.random() * 0.6 + 0.3,
    }));
  });

  // 렌터카사 위성 = 차량들 (5~7대씩, 궤도 넓게)
  RENTALS.forEach(n => {
    n.cars = Array.from({ length: Math.floor(Math.random() * 3) + 5 }, (_, i) => ({
      angle: (i / 7) * Math.PI * 2 + Math.random() * 0.5,
      dist: 20 + Math.random() * 18,
      speed: (Math.random() * 0.0003 + 0.0001) * (Math.random() < 0.5 ? 1 : -1),
      r: Math.random() * 1.0 + 0.6,
    }));
    n.satellites = [];
  });

  const ALL_NODES = [...SALES, ...RENTALS];

  // 전체 경로 여정 파티클: 손님→영업→허브→렌트사 (또는 역방향)
  // progress 0~0.33: 손님↔영업, 0.33~0.66: 영업↔허브, 0.66~1.0: 허브↔렌트사
  // 여정: 영업파트너 ↔ 허브 ↔ 렌터카사(차량)
  function makeJourney() {
    const si = Math.floor(Math.random() * SALES.length);
    const ri = Math.floor(Math.random() * RENTALS.length);
    const carIdx = Math.floor(Math.random() * (RENTALS[ri].cars ? RENTALS[ri].cars.length : 1));
    return {
      sale: si,
      rental: ri,
      carIdx: carIdx,
      progress: Math.random(),
      speed: Math.random() * 0.0005 + 0.00025,
      size: Math.random() * 1.2 + 0.6,
      forward: Math.random() < 0.5,
      color: Math.random() < 0.5 ? [140,210,255] : [100,230,200],
    };
  }
  const journeys = Array.from({ length: 18 }, makeJourney);

  let hubOrbitAngle = 0;

  function render(t) {
    ctx.clearRect(0, 0, W, H);
    const px = (mouseX - 0.5) * 6;
    const py = (mouseY - 0.5) * 4;
    hubOrbitAngle += 0.0003;

    const bg = ctx.createRadialGradient(W*0.65,H*0.4,0,W*0.5,H*0.5,H);
    bg.addColorStop(0,'#12254a'); bg.addColorStop(0.5,'#0f1d3a'); bg.addColorStop(1,'#0a1225');
    ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);

    for (const layer of starLayers) for (const s of layer) {
      const tw = Math.sin(t*s.twSpd+s.phase);
      const a = s.baseA*(0.35+(tw+1)/2*0.65);
      const sx = s.x*W+px*s.depth, sy = s.y*H+py*s.depth;
      if (s.glow) { const sg=ctx.createRadialGradient(sx,sy,0,sx,sy,s.r*5); sg.addColorStop(0,`rgba(200,225,255,${a*0.35})`); sg.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=sg; ctx.beginPath(); ctx.arc(sx,sy,s.r*5,0,Math.PI*2); ctx.fill(); }
      ctx.beginPath(); ctx.arc(sx,sy,s.r,0,Math.PI*2); ctx.fillStyle=`rgba(220,235,255,${a})`; ctx.fill();
    }

    for (let i=shooters.length-1;i>=0;i--) {
      const s=shooters[i]; s.x+=s.vx; s.y+=s.vy; s.life-=s.decay;
      if(s.life<=0){shooters.splice(i,1);continue;}
      const sx=s.x*W,sy=s.y*H,tx=sx-s.vx*s.len,ty=sy-s.vy*s.len;
      const gr=ctx.createLinearGradient(sx,sy,tx,ty);
      gr.addColorStop(0,`rgba(220,240,255,${s.life*0.8})`); gr.addColorStop(0.3,`rgba(180,220,255,${s.life*0.4})`); gr.addColorStop(1,'rgba(150,200,255,0)');
      ctx.beginPath(); ctx.moveTo(sx,sy); ctx.lineTo(tx,ty); ctx.strokeStyle=gr; ctx.lineWidth=s.width; ctx.stroke();
    }

    const hx=HUB.x*W+px*0.4, hy=HUB.y*H+py*0.4;
    const hp=0.7+Math.sin(t*0.001)*0.3;


    for (const s of SALES) {
      const sx=s.x*W+px*0.3, sy=s.y*H+py*0.3; const [r,g,b]=s.color;
      ctx.beginPath(); ctx.moveTo(hx,hy); ctx.lineTo(sx,sy); ctx.strokeStyle=`rgba(${r},${g},${b},0.10)`; ctx.lineWidth=6; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(hx,hy); ctx.lineTo(sx,sy); ctx.strokeStyle=`rgba(${r},${g},${b},0.32)`; ctx.lineWidth=1; ctx.stroke();
    }
    for (const r2 of RENTALS) {
      const rx=r2.x*W+px*0.3, ry=r2.y*H+py*0.3; const [r,g,b]=r2.color;
      ctx.beginPath(); ctx.moveTo(hx,hy); ctx.lineTo(rx,ry); ctx.strokeStyle=`rgba(${r},${g},${b},0.10)`; ctx.lineWidth=6; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(hx,hy); ctx.lineTo(rx,ry); ctx.strokeStyle=`rgba(${r},${g},${b},0.32)`; ctx.lineWidth=1; ctx.stroke();
    }

    // 여정 파티클 (손님→영업→허브→렌트사→차량)
    for (const j of journeys) {
      j.progress = (j.progress + j.speed);
      if (j.progress >= 1) { Object.assign(j, makeJourney()); j.progress = 0; }
      const p = j.forward ? j.progress : 1 - j.progress;

      const s = SALES[j.sale];
      const r2 = RENTALS[j.rental];
      const car = r2.cars ? r2.cars[j.carIdx % r2.cars.length] : null;

      const sx = s.x*W+px*0.3, sy = s.y*H+py*0.3;
      const rx = r2.x*W+px*0.3, ry = r2.y*H+py*0.3;

      let carX = rx, carY = ry;
      if (car) {
        carX = rx + Math.cos(car.angle) * car.dist;
        carY = ry + Math.sin(car.angle) * car.dist;
      }

      let jpx, jpy;
      if (p < 0.33) {
        const seg = p / 0.33;
        jpx = sx + (hx - sx) * seg;
        jpy = sy + (hy - sy) * seg;
      } else if (p < 0.66) {
        const seg = (p - 0.33) / 0.33;
        jpx = hx + (rx - hx) * seg;
        jpy = hy + (ry - hy) * seg;
      } else {
        const seg = (p - 0.66) / 0.34;
        jpx = rx + (carX - rx) * seg;
        jpy = ry + (carY - ry) * seg;

        ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(carX, carY);
        ctx.strokeStyle = `rgba(100,230,200,${0.3 * (1 - seg)})`;
        ctx.lineWidth = 0.8; ctx.stroke();
      }

      const fade = Math.sin(p * Math.PI);
      const [jr,jg,jb] = j.color;

      const jgl = ctx.createRadialGradient(jpx,jpy,0,jpx,jpy,j.size*5);
      jgl.addColorStop(0,`rgba(${jr},${jg},${jb},${fade*0.25})`);
      jgl.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle = jgl;
      ctx.beginPath(); ctx.arc(jpx,jpy,j.size*5,0,Math.PI*2); ctx.fill();

      ctx.beginPath(); ctx.arc(jpx,jpy,j.size,0,Math.PI*2);
      ctx.fillStyle = `rgba(${jr},${jg},${jb},${fade*0.9})`;
      ctx.fill();
    }


    const drawNode = (n) => {
      const nx=n.x*W+px*0.3, ny=n.y*H+py*0.3; const [r,g,b]=n.color;
      const np=0.6+Math.sin(t*0.0012+n.x*10)*0.4;
      const ng=ctx.createRadialGradient(nx,ny,0,nx,ny,30);
      ng.addColorStop(0,`rgba(${r},${g},${b},${0.1*np})`); ng.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=ng; ctx.beginPath(); ctx.arc(nx,ny,30,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(nx,ny,8,0,Math.PI*2);
      ctx.strokeStyle=`rgba(${r},${g},${b},${0.25*np})`; ctx.lineWidth=0.8; ctx.stroke();
      ctx.beginPath(); ctx.arc(nx,ny,3,0,Math.PI*2);
      ctx.fillStyle=`rgba(${r},${g},${b},${0.7*np})`; ctx.fill();
      // 위성 (영업자=손님 노란빛)
      if(n.satellites) for(const sat of n.satellites){
        sat.angle+=sat.speed;
        const satX=nx+Math.cos(sat.angle)*sat.dist, satY=ny+Math.sin(sat.angle)*sat.dist;
        const stw=Math.sin(t*0.003+sat.angle*5);
        const sa=0.4+(stw+1)/2*0.6;
        const sg=ctx.createRadialGradient(satX,satY,0,satX,satY,sat.r*3);
        sg.addColorStop(0,`rgba(255,220,130,${0.15*sa*np})`);
        sg.addColorStop(1,'rgba(0,0,0,0)');
        ctx.fillStyle=sg; ctx.beginPath(); ctx.arc(satX,satY,sat.r*3,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(satX,satY,sat.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(255,220,130,${0.55*sa*np})`; ctx.fill();
      }
      // 차량 위성 (렌터카사만 — 민트빛으로 반짝)
      if(n.cars) {
        ctx.beginPath(); ctx.arc(nx,ny,28,0,Math.PI*2);
        ctx.strokeStyle=`rgba(100,230,200,${0.06*np})`; ctx.lineWidth=0.4; ctx.stroke();
        for(const car of n.cars){
          car.angle+=car.speed;
          const carX=nx+Math.cos(car.angle)*car.dist;
          const carY=ny+Math.sin(car.angle)*car.dist;
          const ctw=Math.sin(t*0.0025+car.angle*3);
          const ca=0.4+(ctw+1)/2*0.6;
          // 차량 글로우
          const cg=ctx.createRadialGradient(carX,carY,0,carX,carY,car.r*4);
          cg.addColorStop(0,`rgba(100,230,200,${0.18*ca*np})`);
          cg.addColorStop(1,'rgba(0,0,0,0)');
          ctx.fillStyle=cg; ctx.beginPath(); ctx.arc(carX,carY,car.r*4,0,Math.PI*2); ctx.fill();
          // 차량 점
          ctx.beginPath(); ctx.arc(carX,carY,car.r,0,Math.PI*2);
          ctx.fillStyle=`rgba(100,230,200,${0.65*ca*np})`; ctx.fill();
        }
      }
      ctx.font='400 10px Pretendard,sans-serif';
      ctx.fillStyle=`rgba(255,255,255,${0.55*np})`;
      ctx.textAlign='center'; ctx.fillText(n.label,nx,ny+24);
    };
    SALES.forEach(drawNode); RENTALS.forEach(drawNode);

    for(let i=0;i<2;i++){
      ctx.save(); ctx.translate(hx,hy);
      ctx.rotate(hubOrbitAngle*(i===0?1:-0.7)+i*0.5);
      ctx.beginPath(); ctx.ellipse(0,0,30+i*14,15+i*7,0,0,Math.PI*2);
      ctx.strokeStyle=`rgba(100,185,245,${(0.18-i*0.05)*hp})`; ctx.lineWidth=0.7; ctx.stroke(); ctx.restore();
    }
    const hg=ctx.createRadialGradient(hx,hy,0,hx,hy,60);
    hg.addColorStop(0,`rgba(13,78,139,${0.25*hp})`); hg.addColorStop(0.5,`rgba(13,78,139,${0.1*hp})`); hg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=hg; ctx.beginPath(); ctx.arc(hx,hy,60,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(hx,hy,20,0,Math.PI*2);
    ctx.strokeStyle=`rgba(150,210,255,${0.35*hp})`; ctx.lineWidth=1.2; ctx.stroke();
    ctx.beginPath(); ctx.arc(hx,hy,11,0,Math.PI*2);
    ctx.strokeStyle=`rgba(150,210,255,${0.18*hp})`; ctx.lineWidth=0.6; ctx.stroke();
    ctx.beginPath(); ctx.arc(hx,hy,6,0,Math.PI*2);
    ctx.fillStyle=`rgba(180,225,255,${0.75*hp})`; ctx.fill();
    ctx.font='600 12px Pretendard,sans-serif';
    ctx.fillStyle=`rgba(255,255,255,${0.6*hp})`;
    ctx.textAlign='center'; ctx.fillText('freepass',hx,hy+36);
    ctx.font='300 10px Pretendard,sans-serif';
    ctx.fillStyle=`rgba(255,255,255,${0.35*hp})`;
    ctx.fillText('mobility',hx,hy+50);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
})();

/* ── 네비게이션 스크롤 + 히어로 페이드 ── */
(function () {
  const nav = document.getElementById('gnb');
  const hero = document.querySelector('.hero');
  const heroFade = document.getElementById('heroFade');
  window.addEventListener('scroll', () => {
    const heroH = hero.offsetHeight;
    const past = window.scrollY > heroH - 80;
    document.body.classList.toggle('hero-dark', !past);
    nav.classList.toggle('scrolled', past);

    // 스크롤 30%부터 히어로 하단이 밝아짐
    const fadeStart = heroH * 0.2;
    const fadeEnd = heroH * 0.85;
    const fadeProgress = Math.max(0, Math.min(1, (window.scrollY - fadeStart) / (fadeEnd - fadeStart)));
    heroFade.style.opacity = fadeProgress;
  });
})();

/* ── 2. 스크롤 등장 애니메이션 ── */
(function () {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('v'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.rv').forEach(el => obs.observe(el));
})();

/* ── 3. 모바일 메뉴 ── */
(function () {
  const btn = document.getElementById('mobileBtn');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('mobileOverlay');
  const closeBtn = document.getElementById('drawerClose');
  const links = document.querySelectorAll('.drawer-link');

  function open() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);
  links.forEach(l => l.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ── 4. 숫자 카운트업 ── */
(function () {
  const nums = document.querySelectorAll('.stat-num');
  if (!nums.length) return;

  function parseTarget(el) {
    const text = el.childNodes[0].textContent.trim();
    return parseFloat(text.replace(/,/g, ''));
  }
  function formatNum(n) {
    if (n >= 1000) return n.toLocaleString();
    return String(n);
  }
  function countUp(el, target, duration) {
    const startTime = performance.now();
    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      el.childNodes[0].textContent = formatNum(Math.round(target * ease));
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }
  function getDuration(t) {
    if (t <= 5) return 2500;
    if (t <= 20) return 2200;
    if (t <= 50) return 2000;
    return 1500;
  }

  const targets = new Map();
  nums.forEach(el => targets.set(el, parseTarget(el)));

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        countUp(e.target, targets.get(e.target), getDuration(targets.get(e.target)));
      } else {
        e.target.childNodes[0].textContent = '0';
      }
    });
  }, { threshold: 0.3 });
  nums.forEach(el => obs.observe(el));
})();

/* ── 5. 문의 폼 AJAX ── */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    const origText = btn.innerHTML;
    btn.innerHTML = '전송 중...';
    btn.disabled = true;

    fetch('https://formsubmit.co/ajax/freepassmobility@gmail.com', {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success === "true" || data.success === true) {
        form.reset();
        btn.innerHTML = '문의가 접수되었습니다. 감사합니다.';
        setTimeout(() => { btn.innerHTML = origText; btn.disabled = false; }, 4000);
      } else {
        btn.innerHTML = '전송에 실패했습니다. 다시 시도해주세요.';
        setTimeout(() => { btn.innerHTML = origText; btn.disabled = false; }, 3000);
      }
    })
    .catch(() => {
      btn.innerHTML = '전송에 실패했습니다. 다시 시도해주세요.';
      setTimeout(() => { btn.innerHTML = origText; btn.disabled = false; }, 3000);
    });
  });
})();

/* ── 6. 연락처 자동 하이픈 ── */
(function () {
  const phone = document.querySelector('input[name="phone"]');
  if (!phone) return;
  phone.addEventListener('input', function () {
    let v = this.value.replace(/[^0-9]/g, '');
    if (v.startsWith('02')) {
      if (v.length <= 2) v = v;
      else if (v.length <= 6) v = v.slice(0,2) + '-' + v.slice(2);
      else if (v.length <= 9) v = v.slice(0,2) + '-' + v.slice(2,5) + '-' + v.slice(5);
      else v = v.slice(0,2) + '-' + v.slice(2,6) + '-' + v.slice(6,10);
    } else if (v.length <= 3) {
      v = v;
    } else if (v.length <= 7) {
      v = v.slice(0,3) + '-' + v.slice(3);
    } else if (v.length <= 10) {
      v = v.slice(0,3) + '-' + v.slice(3,6) + '-' + v.slice(6);
    } else {
      v = v.slice(0,3) + '-' + v.slice(3,7) + '-' + v.slice(7,11);
    }
    this.value = v;
  });
})();
