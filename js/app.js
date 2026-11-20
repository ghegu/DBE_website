/* ==========================================================================
   DBE Website: Interactive Editorial, Mirror Photobooth & Living Mascotte Guide
   ========================================================================== */

(function () {
  'use strict';

  const STATE = {
    lang: 'en',
    mascotMoodIdx: 0,
    acetateMode: 'lens-red',
    lensPos: { x: 210, y: 155, w: 330, h: 255 },
    selectedSkillIdx: 0,
    planTrack: 'all',
    planSem: 'all',
    planQuery: '',
    wizCitizenship: 'it',
    wizDegree: 'direct',
    wizEnglish: 'cert',
    selectedStickerIdx: 0,
    postcardBg: 'red',
    pageStickMode: false,
    vellumPeel: 0,
    guideOpen: false,
    guideMood: 'classic',
    guideFill: '#000000'
  };

  // Accurate mapping of the 9 extracted mascot faces to their true expressions
  const MOOD_ORDER = ['eyebrow', 'classic', 'intense', 'wide', 'joy', 'peek', 'calm', 'squint', 'shy'];
  const MOOD_LABELS = {
    eyebrow: { en: 'Skeptical', it: 'Scettico' },
    classic: { en: 'Curious', it: 'Curioso' },
    intense: { en: 'Unbothered', it: 'Rilassato' },
    wide: { en: 'Surprised', it: 'Sorpreso' },
    joy: { en: 'Determined', it: 'Determinato' },
    peek: { en: 'Peeking', it: 'Sbirciando' },
    calm: { en: 'Sleepy', it: 'Assonnato' },
    squint: { en: 'Suspicious', it: 'Sospettoso' },
    shy: { en: 'Happy', it: 'Felice' }
  };

  const MASCOT_BUBBLES = {
    en: [
      'che vvuò? click me!',
      '120 ECTS, 100% English',
      'Exhibit or Digital?',
      'Palazzo Gravina, Naples',
      'Open access, LM-12!',
      'Less talk. More making.',
      'Try the acetate lens ↓',
      'Peel my stickers below!',
      'Federico II, since 1224'
    ],
    it: [
      'che vvuò? cliccami!',
      '120 CFU, 100% Inglese',
      'Exhibit o Digital?',
      'Palazzo Gravina, Napoli',
      'Accesso libero, LM-12!',
      'Less talk. More making.',
      'Prova il filtro acetato ↓',
      'Attacca gli stickers giù!',
      'Federico II, dal 1224'
    ]
  };

  /* ---------- HELPER: CLIENT-SIDE CRISP PDF GENERATOR (ZERO DEPENDENCIES) ---------- */
  function downloadCanvasAsPDF(canvas, filename) {
    const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.94);
    const base64 = jpegDataUrl.split(',')[1];
    const binStr = atob(base64);
    const imgBytes = new Uint8Array(binStr.length);
    for (let i = 0; i < binStr.length; i++) imgBytes[i] = binStr.charCodeAt(i);

    const wPx = canvas.width;
    const hPx = canvas.height;
    // Scale page cleanly to A4-like points (width 842pt for landscape)
    const pageW = 842;
    const pageH = Math.round((hPx / wPx) * pageW);

    const enc = s => new TextEncoder().encode(s);
    const parts = [];
    const offsets = [0];
    let byteLen = 0;

    function pushBytes(arr) {
      parts.push(arr);
      byteLen += arr.length;
    }
    function pushStr(str) {
      pushBytes(enc(str));
    }

    pushStr('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');

    // Obj 1: Catalog
    offsets.push(byteLen);
    pushStr('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');

    // Obj 2: Pages
    offsets.push(byteLen);
    pushStr('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');

    // Obj 3: Page
    offsets.push(byteLen);
    pushStr(
      `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] ` +
      `/Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`
    );

    // Obj 4: JPEG Image XObject
    offsets.push(byteLen);
    pushStr(
      `4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${wPx} /Height ${hPx} ` +
      `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imgBytes.length} >>\nstream\n`
    );
    pushBytes(imgBytes);
    pushStr('\nendstream\nendobj\n');

    // Obj 5: Content stream drawing image full-bleed
    const contentStream = `q\n${pageW} 0 0 ${pageH} 0 0 cm\n/Im0 Do\nQ\n`;
    offsets.push(byteLen);
    pushStr(`5 0 obj\n<< /Length ${contentStream.length} >>\nstream\n${contentStream}endstream\nendobj\n`);

    const xrefStart = byteLen;
    pushStr(`xref\n0 6\n0000000000 65535 f \n`);
    for (let i = 1; i <= 5; i++) {
      pushStr(String(offsets[i]).padStart(10, '0') + ' 00000 n \n');
    }
    pushStr(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`);

    const blob = new Blob(parts, { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  /* ---------- 1. HYDRATE EXTRACTED VECTOR SVGS ---------- */
  function hydrateSVGs() {
    if (!window.DBE_SVGS) return;
    document.querySelectorAll('[data-svg]').forEach(el => {
      const key = el.getAttribute('data-svg');
      if (window.DBE_SVGS[key]) {
        el.innerHTML = window.DBE_SVGS[key];
      }
    });
  }

  /* ---------- 2. LIVING MASCOTTE GENERATOR & EYE TRACKING ---------- */
  function buildMascotSVG(mood = 'eyebrow', fill = '#000000', eyeColor = '#FFFFFF') {
    const M = window.DBE_MASCOT;
    if (!M) return '';
    const eyes = M.moods[mood] || M.moods.classic;
    const eyePaths = eyes
      .map(d => `<path d="${d}" fill="${eyeColor}" fill-rule="evenodd"/>`)
      .join('');
    return `<svg class="dbe-mascot-svg" viewBox="${M.viewBox}" xmlns="http://www.w3.org/2000/svg">
      <path d="${M.body}" fill="${fill}"/>
      <g class="mascot-eyes">${eyePaths}</g>
    </svg>`;
  }

  function buildStickerSVGBySrc(src, hiRes = true) {
    const M = window.DBE_MASCOT;
    if (!M) return null;
    const badgeSpecs = {
      'assets/svg/badge-red-intense.svg': ['#ED1C24', 'intense', '#FFFFFF'],
      'assets/svg/badge-blue-eyebrow.svg': ['#2E3192', 'eyebrow', '#FFFFFF'],
      'assets/svg/badge-yellow-peek.svg': ['#FFF200', 'peek', '#000000'],
      'assets/svg/badge-cyan-wide.svg': ['#00AEEF', 'wide', '#FFFFFF'],
      'assets/svg/badge-red-joy.svg': ['#ED1C24', 'joy', '#FFFFFF'],
      'assets/svg/badge-blue-classic.svg': ['#2E3192', 'classic', '#FFFFFF']
    };
    const b = badgeSpecs[src];
    if (b) {
      const [bg, mood, txtCol] = b;
      const eyes = (M.moods[mood] || M.moods.classic).map(d => `<path d="${d}" fill="#FFFFFF" fill-rule="evenodd"/>`).join('');
      const sz = hiRes ? 640 : 200;
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="${sz}" height="${sz}">
        <circle cx="100" cy="100" r="98" fill="${bg}"/>
        <g transform="translate(30, 12)"><path d="${M.outline}" fill="#FFFFFF"/><path d="${M.body}" fill="#000000"/>${eyes}</g>
        <text x="100" y="180" text-anchor="middle" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-weight="700" font-size="9.2" fill="${txtCol}">@dbe_federicosecondo</text>
      </svg>`;
    }
    const m = src.match(/sticker-([a-z]+)\.svg$/);
    if (!m) return null;
    const mood = m[1];
    const eyes = (M.moods[mood] || M.moods.classic).map(d => `<path d="${d}" fill="#FFFFFF" fill-rule="evenodd"/>`).join('');
    const w = hiRes ? 560 : 140;
    const h = hiRes ? 640 : 160;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 160" width="${w}" height="${h}">
      <path d="${M.outline}" fill="#FFFFFF" stroke="#000000" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="${M.body}" fill="#000000"/>
      ${eyes}
    </svg>`;
  }

  function renderAllMascots() {
    const mood = MOOD_ORDER[STATE.mascotMoodIdx % MOOD_ORDER.length];
    const heroInB = document.getElementById('hero-mascot-in-b');
    const heroPeek = document.getElementById('hero-peeking-svg');
    const outlineMascot = document.getElementById('outline-mascot');
    const bmTop = document.getElementById('bm-top-mascot');
    const bmBottom = document.getElementById('bm-bottom-mascot');
    const mirrorMascot = document.getElementById('mirror-corner-mascot');

    if (heroInB) heroInB.innerHTML = buildMascotSVG(mood, '#000000', '#FFFFFF');
    if (heroPeek) heroPeek.innerHTML = buildMascotSVG(MOOD_ORDER[(STATE.mascotMoodIdx + 5) % MOOD_ORDER.length], '#000000', '#FFFFFF');
    if (outlineMascot) outlineMascot.innerHTML = buildMascotSVG(mood, '#000000', '#FFFFFF');
    if (bmTop) bmTop.innerHTML = buildMascotSVG('squint', '#000000', '#FFFFFF');
    if (bmBottom) bmBottom.innerHTML = buildMascotSVG('eyebrow', '#000000', '#FFFFFF');
    if (mirrorMascot) mirrorMascot.innerHTML = buildMascotSVG('shy', '#000000', '#FFFFFF');

    const bubble = document.getElementById('hero-mascot-bubble');
    if (bubble) {
      const list = MASCOT_BUBBLES[STATE.lang] || MASCOT_BUBBLES.en;
      bubble.textContent = list[STATE.mascotMoodIdx % list.length];
    }
  }

  function initMascotInteractions() {
    renderAllMascots();
    const cycle = () => {
      STATE.mascotMoodIdx = (STATE.mascotMoodIdx + 1) % MOOD_ORDER.length;
      renderAllMascots();
    };
    ['hero-mascot-in-b', 'hero-peeking-mascot', 'outline-mascot'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('click', cycle);
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cycle(); }
      });
    });

    // Subtle pointer-following eyes
    let raf = null;
    window.addEventListener('pointermove', e => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        document.querySelectorAll('.dbe-mascot-svg').forEach(svg => {
          const rect = svg.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > window.innerHeight) return;
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
          const dist = Math.min(3.4, Math.hypot(e.clientX - cx, e.clientY - cy) / 95);
          const dx = Math.cos(angle) * dist;
          const dy = Math.sin(angle) * dist;
          const eyesG = svg.querySelector('.mascot-eyes');
          if (eyesG) eyesG.setAttribute('transform', `translate(${dx.toFixed(2)}, ${dy.toFixed(2)})`);
        });
      });
    }, { passive: true });
  }

  /* ---------- 3. STICKY NAV, SCROLL SPY & MOBILE DRAWER ---------- */
  function initNavigation() {
    const nav = document.getElementById('site-nav');
    const hero = document.getElementById('hero');
    const guideRoot = document.getElementById('dbe-guide');
    const burger = document.getElementById('nav-burger');
    const drawer = document.getElementById('mobile-drawer');

    const onScroll = () => {
      const threshold = hero ? Math.max(80, hero.offsetHeight - 100) : 120;
      const pastHero = window.scrollY > threshold;
      nav.classList.toggle('is-scrolled', pastHero);
      if (guideRoot) {
        guideRoot.classList.toggle('is-on-hero', !pastHero && !STATE.guideOpen);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (burger && drawer) {
      const toggleDrawer = force => {
        const open = typeof force === 'boolean' ? force : !drawer.classList.contains('is-open');
        drawer.classList.toggle('is-open', open);
        drawer.setAttribute('aria-hidden', String(!open));
        burger.setAttribute('aria-expanded', String(open));
      };
      burger.addEventListener('click', () => toggleDrawer());
      drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleDrawer(false)));
    }

    const sectionIds = ['hero', 'program', 'directions', 'skills', 'study-plan', 'admissions', 'campus', 'stickers', 'mirror', 'contacts'];
    const navParentMap = {
      hero: '#hero',
      program: '#program',
      directions: '#directions',
      skills: '#directions',
      'study-plan': '#study-plan',
      admissions: '#admissions',
      campus: '#campus',
      stickers: '#campus',
      mirror: '#contacts',
      contacts: '#contacts'
    };
    const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
    const navLinks = document.querySelectorAll('.nav-links a');
    const bmLinks = document.querySelectorAll('.bookmark-toc a');

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const sid = entry.target.id;
          const exactHash = '#' + sid;
          const navHash = navParentMap[sid] || exactHash;
          navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === navHash));
          bmLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === exactHash));
          if (typeof window.__onSectionEntered === 'function') {
            window.__onSectionEntered(sid);
          }
        });
      }, { rootMargin: '-38% 0px -52% 0px', threshold: 0.01 });
      sections.forEach(s => io.observe(s));
    }
  }

  /* ---------- 4. INTERACTIVE TALKING FORKS (NO HEIGHT JUMP!) ---------- */
  function initMunariForks() {
    const forkBtn = document.getElementById('munari-fork-btn');
    const forkCap = document.getElementById('fork-caption');
    const captions = ['che vvuò?', 'how does it work?', 'bend the rules!', 'less talk. more making.', 'design is a gesture.'];
    let idx = 0;
    if (forkBtn && forkCap) {
      const trigger = () => {
        idx = (idx + 1) % captions.length;
        forkCap.textContent = captions[idx];
        forkBtn.classList.add('is-gesturing');
        setTimeout(() => forkBtn.classList.remove('is-gesturing'), 320);
      };
      forkBtn.addEventListener('click', trigger);
      forkBtn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger(); } });
    }

    const foldedBtn = document.getElementById('folded-fork-btn');
    const foldedLabel = document.getElementById('folded-fork-label');
    let flipped = false;
    if (foldedBtn && foldedLabel) {
      foldedBtn.addEventListener('click', () => {
        flipped = !flipped;
        foldedLabel.textContent = flipped ? 'start here' : 'the end';
        foldedBtn.querySelector('.folded-fork-svg').style.transform = flipped ? 'scaleX(-1)' : '';
      });
    }
  }

  /* ---------- 5. INTERACTIVE RED/BLUE ACETATE OPTICAL DUALITY ENGINE ---------- */
  let applyAcetateGlobal = null;

  function initAcetateStudio() {
    const stage = document.getElementById('anaglyph-stage');
    const decodedRed = document.getElementById('decoded-red');
    const decodedBlue = document.getElementById('decoded-blue');
    const lensFrame = document.getElementById('optical-lens-frame');
    const lensLabel = document.getElementById('lens-frame-label');
    const statusPill = document.getElementById('acetate-status-pill');
    const modeBtns = document.querySelectorAll('.acetate-mode-btn');
    const pocketRed = document.getElementById('pocket-red');
    const pocketBlue = document.getElementById('pocket-blue');
    const cardExhibit = document.getElementById('card-exhibit');
    const cardDigital = document.getElementById('card-digital');

    if (!stage || !decodedRed || !decodedBlue) return;

    function updateLensClip() {
      const rect = stage.getBoundingClientRect();
      const sw = rect.width || 700;
      const sh = rect.height || 670;
      const lw = Math.min(STATE.lensPos.w, sw - 24);
      const lh = Math.min(STATE.lensPos.h, sh - 24);
      const x = Math.max(8, Math.min(STATE.lensPos.x, sw - lw - 8));
      const y = Math.max(8, Math.min(STATE.lensPos.y, sh - lh - 8));
      STATE.lensPos.x = x;
      STATE.lensPos.y = y;

      const right = Math.max(0, sw - (x + lw));
      const bottom = Math.max(0, sh - (y + lh));
      const insetVal = `inset(${y.toFixed(1)}px ${right.toFixed(1)}px ${bottom.toFixed(1)}px ${x.toFixed(1)}px)`;

      lensFrame.style.left = `${x}px`;
      lensFrame.style.top = `${y}px`;
      lensFrame.style.width = `${lw}px`;
      lensFrame.style.height = `${lh}px`;

      if (STATE.acetateMode === 'lens-red') {
        decodedRed.style.clipPath = insetVal;
        decodedBlue.style.clipPath = 'inset(0 100% 0 0)';
      } else if (STATE.acetateMode === 'lens-blue') {
        decodedBlue.style.clipPath = insetVal;
        decodedRed.style.clipPath = 'inset(0 100% 0 0)';
      }
    }

    function applyAcetateMode(mode) {
      STATE.acetateMode = mode;
      modeBtns.forEach(btn => {
        const active = btn.getAttribute('data-lens') === mode;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-selected', String(active));
      });

      const isRed = mode === 'red' || mode === 'lens-red';
      const isBlue = mode === 'blue' || mode === 'lens-blue';
      pocketRed.classList.toggle('is-selected', isRed);
      pocketBlue.classList.toggle('is-selected', isBlue);
      cardExhibit.classList.toggle('is-highlighted', isRed);
      cardDigital.classList.toggle('is-highlighted', isBlue);

      if (statusPill) {
        if (mode === 'red') statusPill.textContent = 'RED ACETATE · READING EXHIBIT (DB102)';
        else if (mode === 'blue') statusPill.textContent = 'BLUE ACETATE · READING DIGITAL (DB103)';
        else if (mode === 'lens-red') statusPill.textContent = 'DRAG RED LENS · EXHIBIT (DB102)';
        else if (mode === 'lens-blue') statusPill.textContent = 'DRAG BLUE LENS · DIGITAL (DB103)';
        else statusPill.textContent = 'OVERLAPPED PRINT · PICK RED OR BLUE';
      }

      if (mode === 'both') {
        decodedRed.style.opacity = '0';
        decodedBlue.style.opacity = '0';
        decodedRed.style.clipPath = 'inset(0 100% 0 0)';
        decodedBlue.style.clipPath = 'inset(0 100% 0 0)';
        lensFrame.classList.remove('is-visible');
      } else if (mode === 'red') {
        decodedRed.style.opacity = '1';
        decodedBlue.style.opacity = '0';
        decodedRed.style.clipPath = 'inset(0 0 0 0)';
        decodedBlue.style.clipPath = 'inset(0 100% 0 0)';
        lensFrame.classList.remove('is-visible');
      } else if (mode === 'blue') {
        decodedBlue.style.opacity = '1';
        decodedRed.style.opacity = '0';
        decodedBlue.style.clipPath = 'inset(0 0 0 0)';
        decodedRed.style.clipPath = 'inset(0 100% 0 0)';
        lensFrame.classList.remove('is-visible');
      } else if (mode === 'lens-red' || mode === 'lens-blue') {
        decodedRed.style.opacity = mode === 'lens-red' ? '1' : '0';
        decodedBlue.style.opacity = mode === 'lens-blue' ? '1' : '0';
        lensLabel.textContent = mode === 'lens-red' ? 'RED ACETATE · EXHIBIT' : 'BLUE ACETATE · DIGITAL';
        lensFrame.classList.add('is-visible');
        updateLensClip();
      }
    }

    applyAcetateGlobal = applyAcetateMode;

    modeBtns.forEach(btn => {
      btn.addEventListener('click', () => applyAcetateMode(btn.getAttribute('data-lens')));
    });

    const onPocketRed = () => applyAcetateMode(STATE.acetateMode === 'red' ? 'lens-red' : 'red');
    const onPocketBlue = () => applyAcetateMode(STATE.acetateMode === 'blue' ? 'lens-blue' : 'blue');
    pocketRed.addEventListener('click', onPocketRed);
    pocketBlue.addEventListener('click', onPocketBlue);
    pocketRed.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPocketRed(); } });
    pocketBlue.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPocketBlue(); } });

    document.querySelectorAll('[data-trigger-lens]').forEach(btn => {
      btn.addEventListener('click', () => applyAcetateMode(btn.getAttribute('data-trigger-lens')));
    });

    let dragging = false;
    let dragOffX = 0;
    let dragOffY = 0;

    lensFrame.addEventListener('pointerdown', e => {
      dragging = true;
      stage.classList.add('is-dragging');
      const fRect = lensFrame.getBoundingClientRect();
      dragOffX = e.clientX - fRect.left;
      dragOffY = e.clientY - fRect.top;
      lensFrame.setPointerCapture(e.pointerId);
    });

    lensFrame.addEventListener('pointermove', e => {
      if (!dragging) return;
      const sRect = stage.getBoundingClientRect();
      STATE.lensPos.x = e.clientX - sRect.left - dragOffX;
      STATE.lensPos.y = e.clientY - sRect.top - dragOffY;
      updateLensClip();
    });

    const endDrag = () => {
      dragging = false;
      stage.classList.remove('is-dragging');
    };
    lensFrame.addEventListener('pointerup', endDrag);
    lensFrame.addEventListener('pointercancel', endDrag);

    stage.addEventListener('click', e => {
      if (e.target.closest('button') || e.target.closest('#optical-lens-frame')) return;
      if (STATE.acetateMode === 'both') {
        const sRect = stage.getBoundingClientRect();
        STATE.lensPos.x = e.clientX - sRect.left - STATE.lensPos.w / 2;
        STATE.lensPos.y = e.clientY - sRect.top - STATE.lensPos.h / 2;
        applyAcetateMode('lens-red');
      }
    });

    window.addEventListener('resize', () => {
      if (STATE.acetateMode === 'lens-red' || STATE.acetateMode === 'lens-blue') updateLensClip();
    });

    document.querySelectorAll('[data-jump-track]').forEach(link => {
      link.addEventListener('click', () => setStudyPlanTrack(link.getAttribute('data-jump-track')));
    });

    STATE.lensPos = { x: 210, y: 155, w: 330, h: 255 };
    applyAcetateMode('lens-red');
  }

  /* ---------- 6. COBALT DIE-CUT WINDOW, YELLOW FOLDOUT & ON-DEMAND INDEX ---------- */
  function renderSkillsSection() {
    const grid = document.getElementById('skills-six-grid');
    const spot = document.getElementById('skill-spotlight-bar');
    if (!grid || !spot) return;

    const skills = window.DBE_DATA.skills;
    const L = STATE.lang;

    grid.innerHTML = skills.map((sk, idx) => `
      <button type="button" class="skill-tile ${idx === STATE.selectedSkillIdx ? 'is-selected' : ''}" data-skill-idx="${idx}">
        <span class="skill-tile-num">${sk.num}.</span>
        <span class="skill-tile-title">${sk.key}</span>
        <span class="skill-tile-sub">${sk.sub[L]}</span>
      </button>
    `).join('');

    const cur = skills[STATE.selectedSkillIdx];
    spot.innerHTML = `
      <div>
        <strong>${cur.num}. ${cur.key}: ${cur.sub[L]}</strong>
        <p>${cur.detail[L]}</p>
      </div>
      <span style="font-family:var(--font-mono); font-size:0.72rem; font-weight:800; color:var(--cobalt); max-width:34ch;">${cur.studio[L]}</span>
    `;

    grid.querySelectorAll('.skill-tile').forEach(btn => {
      btn.addEventListener('click', () => {
        STATE.selectedSkillIdx = Number(btn.getAttribute('data-skill-idx'));
        renderSkillsSection();
      });
    });
  }

  function initFoldoutAndIndex() {
    renderSkillsSection();

    const foldout = document.getElementById('yellow-foldout');
    const foldBtn = document.getElementById('foldout-toggle-btn');
    if (foldout && foldBtn) {
      foldBtn.addEventListener('click', () => {
        const folded = foldout.classList.toggle('is-folded');
        foldBtn.setAttribute('aria-expanded', String(!folded));
        const dict = window.DBE_DATA.i18n[STATE.lang];
        foldBtn.textContent = folded ? dict.skills_btn_unfold : dict.skills_btn_fold;
      });
    }

    const drawer = document.getElementById('bookmark-drawer');
    const openBtn = document.getElementById('open-index-btn');
    const cardPinBtn = document.getElementById('bm-card-pin-btn');
    const closeBtn = document.getElementById('bookmark-close-btn');

    const toggleDrawer = force => {
      if (!drawer) return;
      const open = typeof force === 'boolean' ? force : !drawer.classList.contains('is-open');
      drawer.classList.toggle('is-open', open);
      drawer.setAttribute('aria-hidden', String(!open));
    };

    openBtn?.addEventListener('click', () => toggleDrawer());
    cardPinBtn?.addEventListener('click', () => toggleDrawer(true));
    closeBtn?.addEventListener('click', () => toggleDrawer(false));
    drawer?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleDrawer(false)));
  }

  /* ---------- 7. COMPLETE 2026/2027 120 ECTS STUDY PLAN EXPLORER ---------- */
  function setStudyPlanTrack(track) {
    STATE.planTrack = track;
    document.querySelectorAll('#plan-track-tabs .tab-btn').forEach(btn => {
      const active = btn.getAttribute('data-track') === track;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', String(active));
    });
    const seg = document.getElementById('ects-track-seg');
    if (seg) {
      seg.style.background = track === 'digital' ? 'var(--cyan)' : 'var(--red)';
    }
    renderStudyPlan();
  }

  function renderStudyPlan() {
    const body = document.getElementById('course-list-body');
    if (!body) return;
    const L = STATE.lang;
    const q = STATE.planQuery.trim().toLowerCase();

    const filtered = window.DBE_DATA.courses.filter(c => {
      if (STATE.planTrack === 'y1' && c.track !== 'y1') return false;
      if (STATE.planTrack === 'exhibit' && c.track !== 'exhibit' && c.track !== 'common2') return false;
      if (STATE.planTrack === 'digital' && c.track !== 'digital' && c.track !== 'common2') return false;
      if (STATE.planSem !== 'all' && String(c.semester) !== STATE.planSem) return false;
      if (q) {
        const hay = `${c.title.en} ${c.title.it} ${c.ssd} ${c.code} ${c.modules.join(' ')} ${c.desc[L]}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (!filtered.length) {
      body.innerHTML = `<div style="padding:2rem; text-align:center; font-family:var(--font-mono); color:var(--ink-muted);">No matching courses found. Try clearing your filter.</div>`;
      return;
    }

    const tagMap = {
      y1: { cls: 'tag-y1', txt: 'YEAR 1' },
      exhibit: { cls: 'tag-exhibit', txt: 'EXHIBIT' },
      digital: { cls: 'tag-digital', txt: 'DIGITAL' },
      common2: { cls: 'tag-common2', txt: 'Y2 ALL' }
    };

    body.innerHTML = filtered.map(c => {
      const tg = tagMap[c.track];
      const semLabel = L === 'it' ? `${c.semester}° Sem.` : `Sem ${c.semester}`;
      return `
        <div class="course-row" data-course-id="${c.id}">
          <button type="button" class="course-row-btn" aria-expanded="false">
            <span class="course-tag ${tg.cls}">${tg.txt}</span>
            <span class="course-name">
              ${c.title[L]}
              <span class="course-modules-preview">${c.modules[0]}${c.modules.length > 1 ? ` + ${c.modules.length - 1} more` : ''}</span>
            </span>
            <span class="course-ssd">${c.ssd}</span>
            <span class="course-sem">${semLabel}</span>
            <span class="course-ects">${c.ects} ECTS</span>
            <span class="course-expand-icon" aria-hidden="true">+</span>
          </button>
          <div class="course-detail-panel">
            <div>
              <p>${c.desc[L]}</p>
              <span style="font-family:var(--font-mono); font-size:0.72rem; color:var(--ink-soft);">OFFICIAL CODE: ${c.code} · SSD: ${c.ssd}</span>
            </div>
            <div>
              <strong style="display:block; font-family:var(--font-mono); font-size:0.7rem; text-transform:uppercase; margin-bottom:0.5rem;">Modules &amp; 2026/27 Faculty</strong>
              <ul class="module-chip-list">
                ${c.modules.map(m => `<li>${m}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      `;
    }).join('');

    body.querySelectorAll('.course-row-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const row = btn.closest('.course-row');
        const isOpen = row.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', String(isOpen));
      });
    });
  }

  function initStudyPlan() {
    document.querySelectorAll('#plan-track-tabs .tab-btn').forEach(btn => {
      btn.addEventListener('click', () => setStudyPlanTrack(btn.getAttribute('data-track')));
    });
    document.querySelectorAll('.plan-filters .filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        STATE.planSem = pill.getAttribute('data-sem');
        document.querySelectorAll('.plan-filters .filter-pill').forEach(p => p.classList.toggle('is-active', p === pill));
        renderStudyPlan();
      });
    });
    const searchInput = document.getElementById('plan-search');
    if (searchInput) {
      searchInput.addEventListener('input', e => {
        STATE.planQuery = e.target.value;
        renderStudyPlan();
      });
    }
    renderStudyPlan();
  }

  /* ---------- 8. INTERACTIVE 2026/2027 ADMISSIONS ELIGIBILITY WIZARD ---------- */
  function setWizardCitizenship(val) {
    STATE.wizCitizenship = val;
    document.querySelectorAll('#wiz-citizenship button').forEach(b => {
      b.classList.toggle('is-active', b.getAttribute('data-val') === val);
    });
    renderAdmissionsWizard();
  }

  function renderAdmissionsWizard() {
    const out = document.getElementById('wizard-result-card');
    if (!out) return;
    const L = STATE.lang;
    const cit = STATE.wizCitizenship;
    const deg = STATE.wizDegree;
    const eng = STATE.wizEnglish;

    const directClass = deg !== 'other';
    const badgeClass = directClass ? 'is-direct' : 'is-review';
    const badgeText = directClass
      ? (L === 'it' ? '✓ LAUREA IN CLASSE AMMESSA, PRONTO A CANDIDARTI' : '✓ ELIGIBLE DEGREE CLASS, READY TO APPLY')
      : (L === 'it' ? '⚡ VALUTAZIONE CURRICULARE INDIVIDUALE' : '⚡ INDIVIDUAL CURRICULAR ASSESSMENT');

    let headline = '';
    let timelineNote = '';
    let items = [];
    let portals = '';

    if (cit === 'noneu') {
      headline = L === 'it'
        ? 'Percorso Candidati Extra-UE (A.A. 2026/2027)'
        : 'Extra-EU International Track (A.Y. 2026/2027)';
      timelineNote = L === 'it'
        ? 'Le candidature Extra-UE aprono dal 15 Febbraio 2026. Inizio lezioni 1° anno: 5 Ottobre 2026.'
        : 'Extra-EU pre-applications open from February 15, 2026. First year classes start October 5, 2026.';
      items = [
        L === 'it'
          ? 'Invia a infodiarcdbe@unina.it gli 8 documenti richiesti: Lettera Motivazionale, Portfolio, Certificato Inglese, CV, Passaporto, Certificato di Laurea in inglese, Transcript esami in inglese e Lettera di presentazione di un docente universitario.'
          : 'Email infodiarcdbe@unina.it with the 8 required PDFs: Motivation Letter, Design Portfolio, English Proficiency Certificate, CV, Passport scan, Bachelor Degree Certificate (EN), Transcript of Records (EN), and Professor Reference Letter.',
        eng === 'interview'
          ? (L === 'it' ? 'Nessuna certificazione B2? La commissione DBE verificherà il tuo inglese durante il colloquio online.' : 'No formal B2 certificate? The DBE Admissions Committee tests your English during the online interview.')
          : (L === 'it' ? 'Allega il tuo certificato inglese B2+ (IELTS, TOEFL, Cambridge) e sostieni il breve colloquio online di ammissione.' : 'Attach your B2+ certificate and complete the DBE online admission interview.'),
        L === 'it'
          ? 'Dopo il superamento del colloquio, registrati su Universitaly.it per la lettera di pre-ammissione e la richiesta di visto studenti presso l’Ambasciata Italiana.'
          : 'Once admitted, submit your pre-enrollment on Universitaly.it to receive your pre-admission letter and apply for your Italian Student Visa.',
        L === 'it'
          ? 'Completa l’immatricolazione in presenza a Napoli (tasse pubbliche agevolabili tramite ISEE Parificato e borse ADISURC).'
          : 'Complete on-site enrollment in Naples (public tuition adjusted via ISEE Parificato, eligible for ADISURC regional scholarships).'
      ];
      portals = `
        <a href="https://www.diarc.dbe.unina.it/images/DBE_application_smart_guide_26-27_color_web.pdf" target="_blank" rel="noopener" class="btn btn-red" style="padding:0.65rem 1rem; font-size:0.76rem;">Smart Guide 26/27 PDF ↗</a>
        <a href="https://www.universitaly.it/" target="_blank" rel="noopener" class="btn btn-black" style="padding:0.65rem 1rem; font-size:0.76rem;">Universitaly.it ↗</a>
        <a href="mailto:infodiarcdbe@unina.it?subject=DBE%202026/2027%20Extra-EU%20Application" class="btn btn-yellow" style="padding:0.65rem 1rem; font-size:0.76rem;">Email Admissions ↗</a>
      `;
    } else if (cit === 'eu') {
      headline = L === 'it'
        ? 'Percorso Candidati UE (Titolo Estero, A.A. 2026/2027)'
        : 'EU / EEA Foreign Degree Track (A.Y. 2026/2027)';
      timelineNote = L === 'it'
        ? 'Nessun visto richiesto. Prepara la Dichiarazione di Valore (DOV) prima dell’inizio lezioni del 5 Ottobre 2026.'
        : 'No student visa required. Prepare your Declaration of Value (DOV) ahead of the October 5, 2026 semester start.';
      items = [
        L === 'it'
          ? 'Richiedi la Dichiarazione di Valore (DOV) e il Transcript tradotto del tuo titolo triennale (≥180 ECTS) presso l’Ambasciata o Consolato Italiano nel tuo Paese (o tramite CIMEA).'
          : 'Obtain your Declaration of Value (DOV) and official Transcript of Records (≥180 ECTS) from the Italian Embassy or Consulate in your country (or CIMEA).',
        eng === 'interview'
          ? (L === 'it' ? 'In assenza di certificato B2, la commissione valuterà la conoscenza dell’inglese via colloquio.' : 'Without a formal B2 certificate, English proficiency is assessed via departmental interview.')
          : (L === 'it' ? 'Prepara il certificato inglese B2+, CV e Portfolio (consigliato per corsi affini).' : 'Prepare your B2+ English certificate, CV, and Portfolio (especially if coming from a multidisciplinary background).'),
        L === 'it'
          ? 'Contatta infodiarcdbe@unina.it per la verifica curriculare e procedi con l’immatricolazione a Napoli (tasse pubbliche in base al reddito ISEE).'
          : 'Contact infodiarcdbe@unina.it for curricular verification and complete enrollment in Naples (public income based tuition).'
      ];
      portals = `
        <a href="https://www.diarc.dbe.unina.it/images/DBE_application_smart_guide_26-27_color_web.pdf" target="_blank" rel="noopener" class="btn btn-red" style="padding:0.65rem 1rem; font-size:0.76rem;">Smart Guide 26/27 PDF ↗</a>
        <a href="mailto:infodiarcdbe@unina.it?subject=DBE%202026/2027%20EU%20Application" class="btn btn-black" style="padding:0.65rem 1rem; font-size:0.76rem;">Contact infodiarcdbe@unina.it ↗</a>
      `;
    } else {
      headline = L === 'it'
        ? 'Percorso Studenti Italiani (A.A. 2026/2027)'
        : 'Italian / Resident Degree Track (A.Y. 2026/2027)';
      timelineNote = L === 'it'
        ? 'Domanda online su Segrepass dal 1° Settembre 2026 (accesso aperto anche al 2° semestre). Inizio lezioni: 5 Ottobre 2026.'
        : 'Online enrollment via Segrepass opens from September 1, 2026 (1st and 2nd semester entry available). Classes start October 5, 2026.';
      items = [
        directClass
          ? (L === 'it'
              ? 'La tua classe di laurea rientra tra quelle ammesse (L-03, L-04, L-07, L-09, L-17, L-21, L-23, L-31): presenta domanda online su segrepass.unina.it dal 1° Settembre.'
              : 'Your Bachelor class is directly eligible (L-03, L-04, L-07, L-09, L-17, L-21, L-23, L-31): apply online on segrepass.unina.it starting September 1.')
          : (L === 'it'
              ? 'Provenendo da altra classe, la commissione DBE valuterà il tuo piano di studi (CFU nei settori affini), CV e Portfolio per confermare l’ammissione.'
              : 'Coming from another Bachelor class, the DBE Committee reviews your transcript, CV, and Portfolio to confirm curricular eligibility.'),
        eng === 'interview'
          ? (L === 'it' ? 'Senza certificazione B2 puoi sostenere il test o colloquio di verifica della lingua inglese direttamente con la commissione DiARC.' : 'Without a formal B2 certificate, you can complete the English B2 check directly with the DiARC committee.')
          : (L === 'it' ? 'Carica la tua certificazione inglese livello B2 o superiore durante la procedura di ammissione.' : 'Upload your B2 or higher English certificate during your online application.'),
        L === 'it'
          ? 'Tasse universitarie calcolate sull’ISEE universitario (No-Tax Area gratuita salvo tassa regionale ~156€) e accesso alle borse ADISURC Campania.'
          : 'Public tuition is strictly income based via ISEE (No-Tax Area pays only ~€156/yr regional fee) plus ADISURC Campania scholarships.'
      ];
      portals = `
        <a href="https://www.segrepass.unina.it/" target="_blank" rel="noopener" class="btn btn-red" style="padding:0.65rem 1rem; font-size:0.76rem;">Apply on Segrepass ↗</a>
        <a href="https://www.diarc.dbe.unina.it/images/DBE_application_smart_guide_26-27_color_web.pdf" target="_blank" rel="noopener" class="btn btn-black" style="padding:0.65rem 1rem; font-size:0.76rem;">Smart Guide 26/27 PDF ↗</a>
      `;
    }

    out.innerHTML = `
      <span class="wizard-status-badge ${badgeClass}">${badgeText}</span>
      <h3 style="margin:0 0 0.45rem 0; font-size:1.45rem; font-weight:900; letter-spacing:-0.02em;">${headline}</h3>
      <p style="margin:0; font-size:0.92rem; color:var(--ink-muted);">${timelineNote}</p>
      <ul class="wizard-checklist">
        ${items.map((txt, i) => `<li><span class="chk-num">0${i + 1}</span><span>${txt}</span></li>`).join('')}
      </ul>
      <div class="wizard-portals">${portals}</div>
    `;
  }

  function initAdmissionsWizard() {
    document.querySelectorAll('#wiz-citizenship button').forEach(btn => {
      btn.addEventListener('click', () => setWizardCitizenship(btn.getAttribute('data-val')));
    });
    const degSel = document.getElementById('wiz-degree');
    if (degSel) {
      degSel.addEventListener('change', e => {
        STATE.wizDegree = e.target.value;
        renderAdmissionsWizard();
      });
    }
    document.querySelectorAll('#wiz-english button').forEach(btn => {
      btn.addEventListener('click', () => {
        STATE.wizEnglish = btn.getAttribute('data-val');
        document.querySelectorAll('#wiz-english button').forEach(b => b.classList.toggle('is-active', b === btn));
        renderAdmissionsWizard();
      });
    });
    renderAdmissionsWizard();
  }

  /* ---------- 9. CAREERS & FAQ RENDERING ---------- */
  function renderCareersAndFAQ() {
    const L = STATE.lang;
    const cGrid = document.getElementById('careers-grid');
    if (cGrid) {
      cGrid.innerHTML = window.DBE_DATA.careers.map(c => {
        const pillCls = c.track === 'exhibit' ? 'pill-exhibit' : (c.track === 'digital' ? 'pill-digital' : 'pill-both');
        return `
          <article class="career-card">
            <div>
              <span class="career-track-pill ${pillCls}">${c.badge[L]}</span>
              <h3>${c.title[L]}</h3>
              <p>${c.desc[L]}</p>
            </div>
            <div class="career-roles">${c.roles}</div>
          </article>
        `;
      }).join('');
    }

    const faqEl = document.getElementById('faq-list');
    if (faqEl) {
      faqEl.innerHTML = window.DBE_DATA.faqs.map((item, i) => `
        <div class="faq-item ${i === 0 ? 'is-open' : ''}">
          <button type="button" class="faq-q" aria-expanded="${i === 0}">
            <span>${item.q[L]}</span>
            <span style="font-family:var(--font-mono); font-size:1.2rem;">${i === 0 ? '−' : '+'}</span>
          </button>
          <div class="faq-a">${item.a[L]}</div>
        </div>
      `).join('');

      faqEl.querySelectorAll('.faq-q').forEach(btn => {
        btn.addEventListener('click', () => {
          const item = btn.closest('.faq-item');
          const open = item.classList.toggle('is-open');
          btn.setAttribute('aria-expanded', String(open));
          btn.querySelector('span:last-child').textContent = open ? '−' : '+';
        });
      });
    }
  }

  /* ---------- 10. "TAKE ME WITH YOU!" STICKER ATELIER (HIGH-RES PNG + PDF!) ---------- */
  let syncStickerLabelsGlobal = null;

  function initStickerAtelier() {
    const palette = document.getElementById('sticker-palette-grid');
    const selName = document.getElementById('selected-sticker-name');
    const stage = document.getElementById('postcard-stage');
    const pageLayer = document.getElementById('page-sticker-layer');
    const pageStickBtn = document.getElementById('toggle-page-stick-btn');
    const clearPageBtn = document.getElementById('clear-page-stickers-btn');
    const hud = document.getElementById('sticker-mode-hud');
    const hudThumb = document.getElementById('hud-sticker-thumb');
    const hudLabel = document.getElementById('hud-mode-label');
    const ghostWrap = document.getElementById('sticker-ghost-cursor');
    const ghostImg = document.getElementById('sticker-ghost-img');
    if (!palette || !stage) return;

    const stickers = window.DBE_DATA.stickers;

    function getStickerLabel(st) {
      return st.label[STATE.lang] || st.label.en;
    }

    function renderStickerPalette() {
      palette.innerHTML = stickers.map((st, idx) => `
        <button type="button" class="sticker-pick-btn ${idx === STATE.selectedStickerIdx ? 'is-active' : ''}" data-st-idx="${idx}" title="${getStickerLabel(st)}">
          <img src="${st.src}" alt="${getStickerLabel(st)}">
        </button>
      `).join('');

      palette.querySelectorAll('.sticker-pick-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          STATE.selectedStickerIdx = Number(btn.getAttribute('data-st-idx'));
          syncSelectedStickerUI();
        });
      });
    }

    function syncSelectedStickerUI() {
      const st = stickers[STATE.selectedStickerIdx];
      palette.querySelectorAll('.sticker-pick-btn').forEach((b, i) => {
        b.classList.toggle('is-active', i === STATE.selectedStickerIdx);
      });
      if (selName) {
        const prefix = STATE.lang === 'it' ? 'SELEZIONATO' : 'SELECTED';
        selName.textContent = `${prefix}: ${getStickerLabel(st).toUpperCase()}`;
      }
      if (hudThumb) hudThumb.src = st.src;
      if (ghostImg) ghostImg.src = st.src;
    }

    syncStickerLabelsGlobal = () => {
      renderStickerPalette();
      syncSelectedStickerUI();
    };
    renderStickerPalette();
    syncSelectedStickerUI();

    function addStickerToStage(stObj, xPct, yPct, rotDeg) {
      const el = document.createElement('div');
      el.className = 'placed-sticker' + (stObj.isBadge ? ' is-badge' : '');
      el.style.left = `${xPct}%`;
      el.style.top = `${yPct}%`;
      el.style.transform = `translate(-50%, -50%) rotate(${rotDeg}deg)`;
      el.dataset.src = stObj.src;
      el.dataset.isBadge = stObj.isBadge ? '1' : '0';
      el.dataset.x = xPct;
      el.dataset.y = yPct;
      el.dataset.rot = rotDeg;
      el.title = 'Drag to move, double-click to remove';
      el.innerHTML = `<img src="${stObj.src}" alt="${getStickerLabel(stObj)}">`;

      let dragging = false;
      el.addEventListener('pointerdown', e => {
        e.stopPropagation();
        dragging = true;
        el.setPointerCapture(e.pointerId);
      });
      el.addEventListener('pointermove', e => {
        if (!dragging) return;
        const r = stage.getBoundingClientRect();
        const nx = Math.max(6, Math.min(94, ((e.clientX - r.left) / r.width) * 100));
        const ny = Math.max(8, Math.min(92, ((e.clientY - r.top) / r.height) * 100));
        el.style.left = `${nx}%`;
        el.style.top = `${ny}%`;
        el.dataset.x = nx;
        el.dataset.y = ny;
      });
      el.addEventListener('pointerup', () => { dragging = false; });
      el.addEventListener('dblclick', e => { e.stopPropagation(); el.remove(); });

      stage.appendChild(el);
    }

    function clearPostcardStage() {
      stage.querySelectorAll('.placed-sticker').forEach(n => n.remove());
    }
    clearPostcardStage();

    stage.addEventListener('click', e => {
      if (e.target.closest('.placed-sticker')) return;
      const r = stage.getBoundingClientRect();
      const xPct = ((e.clientX - r.left) / r.width) * 100;
      const yPct = ((e.clientY - r.top) / r.height) * 100;
      const rot = Math.round((Math.random() - 0.5) * 28);
      addStickerToStage(stickers[STATE.selectedStickerIdx], xPct, yPct, rot);
    });

    document.querySelectorAll('.bg-swatch-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        STATE.postcardBg = btn.getAttribute('data-paper');
        stage.setAttribute('data-bg', STATE.postcardBg);
        document.querySelectorAll('.bg-swatch-btn').forEach(b => b.classList.toggle('is-active', b === btn));
      });
    });

    document.getElementById('postcard-clear-btn')?.addEventListener('click', () => {
      stage.querySelectorAll('.placed-sticker').forEach(n => n.remove());
    });

    document.getElementById('postcard-shuffle-btn')?.addEventListener('click', () => {
      stage.querySelectorAll('.placed-sticker').forEach(n => n.remove());
      for (let i = 0; i < 5; i++) {
        const pick = stickers[Math.floor(Math.random() * stickers.length)];
        addStickerToStage(pick, 16 + i * 17 + (Math.random() * 6 - 3), 30 + Math.random() * 44, Math.round((Math.random() - 0.5) * 32));
      }
    });

    // Stick Anywhere on Page mode (non-blocking, with floating HUD, Ghost Cursor & ESC exit)
    function setPageStickMode(active) {
      STATE.pageStickMode = active;
      document.body.classList.toggle('is-stick-mode', active);
      if (hud) {
        hud.classList.toggle('is-visible', active);
        hud.setAttribute('aria-hidden', String(!active));
      }
      if (ghostWrap && !active) ghostWrap.classList.remove('is-visible');
      if (pageStickBtn) {
        const isIt = STATE.lang === 'it';
        pageStickBtn.textContent = active
          ? (isIt ? 'Sticker su Pagina: ATTIVO (Esci)' : 'Stick Anywhere on Page: ON (Exit)')
          : (isIt ? 'Attacca ovunque sulla pagina: OFF' : 'Stick Anywhere on Page: OFF');
        pageStickBtn.classList.toggle('btn-red', active);
        pageStickBtn.classList.toggle('btn-black', !active);
      }
      if (hudLabel) {
        hudLabel.textContent = STATE.lang === 'it'
          ? 'MODALITÀ STICKER · CLICCA OVUNQUE'
          : 'STICKER MODE · CLICK ANYWHERE';
      }
      syncSelectedStickerUI();
    }

    if (pageStickBtn && pageLayer) {
      pageStickBtn.addEventListener('click', e => {
        e.stopPropagation();
        setPageStickMode(!STATE.pageStickMode);
      });

      document.addEventListener('pointermove', e => {
        if (!STATE.pageStickMode || !ghostWrap) return;
        const overUI = e.target.closest(
          '#sticker-mode-hud, #dbe-guide, .site-nav, .sticker-tray-card, #postcard-stage, button, a, input, select'
        );
        if (overUI) {
          ghostWrap.classList.remove('is-visible');
          return;
        }
        ghostWrap.style.left = `${e.clientX}px`;
        ghostWrap.style.top = `${e.clientY}px`;
        ghostWrap.classList.add('is-visible');
      }, { passive: true });

      document.addEventListener('click', e => {
        if (!STATE.pageStickMode) return;
        if (
          e.target.closest(
            '#sticker-mode-hud, #dbe-guide, .site-nav, .bookmark-drawer, .sticker-tray-card, #postcard-stage, button, a, input, select'
          )
        ) {
          return;
        }
        const st = stickers[STATE.selectedStickerIdx];
        const el = document.createElement('img');
        el.className = 'page-stamped-sticker';
        el.src = st.src;
        el.alt = getStickerLabel(st);
        const rot = Math.round((Math.random() - 0.5) * 30);
        el.style.left = `${e.pageX}px`;
        el.style.top = `${e.pageY}px`;
        el.style.transform = `translate(-50%, -50%) rotate(${rot}deg)`;
        pageLayer.appendChild(el);
      });

      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && STATE.pageStickMode) setPageStickMode(false);
      });
    }

    document.getElementById('hud-exit-btn')?.addEventListener('click', () => setPageStickMode(false));
    document.getElementById('hud-undo-btn')?.addEventListener('click', () => {
      if (pageLayer && pageLayer.lastElementChild) pageLayer.lastElementChild.remove();
    });
    document.getElementById('hud-clear-btn')?.addEventListener('click', () => {
      if (pageLayer) pageLayer.innerHTML = '';
    });
    document.getElementById('hud-prev-btn')?.addEventListener('click', () => {
      STATE.selectedStickerIdx = (STATE.selectedStickerIdx - 1 + stickers.length) % stickers.length;
      syncSelectedStickerUI();
    });
    document.getElementById('hud-next-btn')?.addEventListener('click', () => {
      STATE.selectedStickerIdx = (STATE.selectedStickerIdx + 1) % stickers.length;
      syncSelectedStickerUI();
    });

    clearPageBtn?.addEventListener('click', e => {
      e.stopPropagation();
      if (pageLayer) pageLayer.innerHTML = '';
      if (STATE.pageStickMode) setPageStickMode(false);
    });

    // ULTRA-CRISP 2400x1500 ZERO-DISTORTION CANVAS BUILDER (for both PNG and PDF!)
    async function renderPostcardToHiResCanvas() {
      const W = 2400, H = 1500;
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const bgColors = { red: '#ED1C24', cobalt: '#2E3192', yellow: '#FFF200', white: '#FFFFFF' };
      const fgColors = { red: '#FFFFFF', cobalt: '#FFFFFF', yellow: '#0A0A0A', white: '#0A0A0A' };
      ctx.fillStyle = bgColors[STATE.postcardBg] || '#ED1C24';
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = '#0A0A0A';
      ctx.lineWidth = 14;
      ctx.strokeRect(7, 7, W - 14, H - 14);

      ctx.fillStyle = fgColors[STATE.postcardBg] || '#FFFFFF';
      ctx.font = '900 140px "Helvetica Neue", Helvetica, Arial, sans-serif';
      ctx.fillText('A SPACE IS NEVER', 110, 235);
      ctx.fillText('JUST A SPACE.', 110, 375);

      ctx.font = '700 38px Menlo, monospace';
      ctx.fillText('DBE · DESIGN FOR THE BUILT ENVIRONMENT · FEDERICO II NAPLES 2026/27', 110, H - 95);

      // Compute proportional sticker size matching exact on-screen ratio & TRUE SVG aspect ratio!
      const stageRect = stage.getBoundingClientRect();
      const scaleFactor = W / (stageRect.width || 620);
      const nodes = Array.from(stage.querySelectorAll('.placed-sticker'));

      for (const n of nodes) {
        const src = n.dataset.src;
        const isBadge = n.dataset.isBadge === '1';
        const svgStr = buildStickerSVGBySrc(src, true);
        if (!svgStr) continue;

        const img = new Image();
        const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);
        await new Promise(res => {
          img.onload = res;
          img.onerror = res;
          img.src = url;
        });

        const drawW = (isBadge ? 96 : 91) * scaleFactor;
        const drawH = (isBadge ? 96 : 104) * scaleFactor; // Exact 7:8 aspect ratio -> ZERO squashing!
        const px = (parseFloat(n.dataset.x) / 100) * W;
        const py = (parseFloat(n.dataset.y) / 100) * H;
        const rot = (parseFloat(n.dataset.rot) || 0) * Math.PI / 180;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(rot);
        ctx.shadowColor = 'rgba(0,0,0,0.22)';
        ctx.shadowBlur = 18;
        ctx.shadowOffsetY = 10;
        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();
      }

      return canvas;
    }

    document.getElementById('postcard-download-btn')?.addEventListener('click', async () => {
      const canvas = await renderPostcardToHiResCanvas();
      const link = document.createElement('a');
      link.download = 'DBE-Federico-II-Naples-Postcard.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });

    document.getElementById('postcard-pdf-btn')?.addEventListener('click', async () => {
      const canvas = await renderPostcardToHiResCanvas();
      downloadCanvasAsPDF(canvas, 'DBE-Federico-II-Naples-Postcard.pdf');
    });
  }

  /* ---------- 11. SECTION 05 TRANSLUCENT VELLUM OVERLAY (TRASPARENTE.PDF) ---------- */
  let setVellumGlobal = null;

  function initVellumOverlay() {
    const sheet = document.getElementById('vellum-sheet');
    const slider = document.getElementById('vellum-slider');
    const btn = document.getElementById('vellum-toggle-btn');
    if (!sheet || !slider || !btn) return;

    function setPeel(pct) {
      STATE.vellumPeel = pct;
      slider.value = pct;
      sheet.style.transform = `translateX(-${pct}%)`;
      sheet.style.opacity = pct >= 98 ? '0' : '1';
      sheet.style.pointerEvents = pct > 85 ? 'none' : 'auto';
      if (STATE.lang === 'it') {
        btn.textContent = pct > 50 ? '← Chiudi Carta Lucida' : 'Solleva Carta Lucida →';
      } else {
        btn.textContent = pct > 50 ? '← Close Tracing Sheet' : 'Lift Tracing Sheet →';
      }
    }

    setVellumGlobal = setPeel;

    slider.addEventListener('input', e => {
      sheet.classList.add('is-peeling');
      setPeel(Number(e.target.value));
    });
    slider.addEventListener('change', () => sheet.classList.remove('is-peeling'));

    btn.addEventListener('click', () => {
      sheet.classList.remove('is-peeling');
      setPeel(STATE.vellumPeel > 50 ? 0 : 100);
    });

    sheet.addEventListener('click', () => {
      sheet.classList.remove('is-peeling');
      setPeel(100);
    });
    sheet.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPeel(STATE.vellumPeel > 50 ? 0 : 100); }
    });
  }

  /* ---------- 12. PAGE 12 INTERACTIVE MIRROR CAMERA PHOTOBOOTH ---------- */
  function initMirrorPhotobooth() {
    const frame = document.getElementById('mirror-frame');
    const video = document.getElementById('mirror-video');
    const imgEl = document.getElementById('mirror-captured-img');
    const flash = document.getElementById('mirror-flash');
    const controls = document.getElementById('mirror-controls-bar');
    const startBtn = document.getElementById('mirror-start-btn');
    const uploadInput = document.getElementById('mirror-upload-input');
    const snapBtn = document.getElementById('mirror-snap-btn');
    const retakeBtn = document.getElementById('mirror-retake-btn');
    const dlPngBtn = document.getElementById('mirror-dl-png-btn');
    const dlPdfBtn = document.getElementById('mirror-dl-pdf-btn');
    const stopBtn = document.getElementById('mirror-stop-btn');
    const errBox = document.getElementById('mirror-error-msg');
    if (!frame || !video) return;

    let stream = null;
    let lastPortraitCanvas = null;

    function showError(msg) {
      if (!errBox) return;
      errBox.textContent = msg;
      errBox.classList.toggle('is-visible', Boolean(msg));
    }

    function stopStream() {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
        stream = null;
      }
      video.srcObject = null;
    }

    function showIdleState() {
      stopStream();
      frame.classList.remove('is-live', 'has-photo');
      if (controls) controls.style.display = 'none';
      showError('');
    }

    function showLiveControls() {
      if (controls) controls.style.display = 'flex';
      if (snapBtn) snapBtn.style.display = 'inline-flex';
      if (retakeBtn) retakeBtn.style.display = 'none';
      if (dlPngBtn) dlPngBtn.style.display = 'none';
      if (dlPdfBtn) dlPdfBtn.style.display = 'none';
    }

    function showCapturedControls() {
      if (controls) controls.style.display = 'flex';
      if (snapBtn) snapBtn.style.display = 'none';
      if (retakeBtn) retakeBtn.style.display = 'inline-flex';
      if (dlPngBtn) dlPngBtn.style.display = 'inline-flex';
      if (dlPdfBtn) dlPdfBtn.style.display = 'inline-flex';
    }

    async function composePortraitCanvas(sourceEl, mirrorFlip) {
      const W = 1600, H = 1200;
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Cover crop source into 4:3 frame
      const sw = sourceEl.videoWidth || sourceEl.naturalWidth || 1280;
      const sh = sourceEl.videoHeight || sourceEl.naturalHeight || 960;
      const scale = Math.max(W / sw, H / sh);
      const dw = sw * scale;
      const dh = sh * scale;
      const dx = (W - dw) / 2;
      const dy = (H - dh) / 2;

      ctx.save();
      if (mirrorFlip) {
        ctx.translate(W, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(sourceEl, dx, dy, dw, dh);
      ctx.restore();

      // Editorial DBE Red Border & Typography Overlay
      ctx.strokeStyle = '#ED1C24';
      ctx.lineWidth = 28;
      ctx.strokeRect(14, 14, W - 28, H - 28);

      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(0,0,0,0.65)';
      ctx.shadowBlur = 10;
      ctx.font = '900 32px Menlo, monospace';
      ctx.fillText('+ DBE · FEDERICO II · NAPLES', 60, 86);
      ctx.textAlign = 'right';
      ctx.fillText('2026 / 2027 +', W - 60, 86);
      ctx.textAlign = 'left';
      ctx.shadowBlur = 0;

      // Red "I'M IN · FUTURE DESIGNER" stamp bottom-left
      ctx.fillStyle = '#ED1C24';
      ctx.fillRect(58, H - 132, 520, 74);
      ctx.strokeStyle = '#0A0A0A';
      ctx.lineWidth = 6;
      ctx.strokeRect(58, H - 132, 520, 74);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 34px "Helvetica Neue", Helvetica, Arial, sans-serif';
      ctx.fillText('I’M IN · FUTURE DESIGNER', 84, H - 83);

      // Draw crisp vector Happy Mascotte bottom-right
      const hiSvg = buildStickerSVGBySrc('assets/svg/sticker-shy.svg', true);
      if (hiSvg) {
        const mImg = new Image();
        await new Promise(res => {
          mImg.onload = res;
          mImg.onerror = res;
          mImg.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(hiSvg);
        });
        ctx.drawImage(mImg, W - 255, H - 280, 195, 223);
      }

      return canvas;
    }

    startBtn?.addEventListener('click', async () => {
      showError('');
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showError(
          STATE.lang === 'it'
            ? 'La fotocamera non è disponibile in questo browser (su file:// Safari può bloccarla). Usa "Carica una Foto" oppure apri il sito su http://127.0.0.1:8765/.'
            : 'Camera access is unavailable in this browser context (on file:// Safari may block webcam access). Use "Upload a Photo" or open http://127.0.0.1:8765/.'
        );
        return;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } }, audio: false });
        video.srcObject = stream;
        await video.play();
        frame.classList.remove('has-photo');
        frame.classList.add('is-live');
        showLiveControls();
      } catch (err) {
        showError(
          STATE.lang === 'it'
            ? 'Permesso fotocamera negato o non disponibile. Puoi comunque usare il tasto "Carica una Foto" qui sopra!'
            : 'Camera permission denied or unavailable. You can still use "Upload a Photo" above!'
        );
      }
    });

    snapBtn?.addEventListener('click', async () => {
      if (flash) {
        flash.classList.add('is-flashing');
        setTimeout(() => flash.classList.remove('is-flashing'), 220);
      }
      lastPortraitCanvas = await composePortraitCanvas(video, true);
      imgEl.src = lastPortraitCanvas.toDataURL('image/png');
      frame.classList.remove('is-live');
      frame.classList.add('has-photo');
      showCapturedControls();
    });

    uploadInput?.addEventListener('change', e => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      showError('');
      const reader = new FileReader();
      reader.onload = ev => {
        const tempImg = new Image();
        tempImg.onload = async () => {
          stopStream();
          lastPortraitCanvas = await composePortraitCanvas(tempImg, false);
          imgEl.src = lastPortraitCanvas.toDataURL('image/png');
          frame.classList.remove('is-live');
          frame.classList.add('has-photo');
          showCapturedControls();
        };
        tempImg.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });

    retakeBtn?.addEventListener('click', () => {
      if (stream) {
        frame.classList.remove('has-photo');
        frame.classList.add('is-live');
        showLiveControls();
      } else {
        showIdleState();
      }
    });

    stopBtn?.addEventListener('click', showIdleState);

    dlPngBtn?.addEventListener('click', () => {
      if (!lastPortraitCanvas) return;
      const link = document.createElement('a');
      link.download = 'DBE-Future-Designer-Mirror-Portrait.png';
      link.href = lastPortraitCanvas.toDataURL('image/png');
      link.click();
    });

    dlPdfBtn?.addEventListener('click', () => {
      if (!lastPortraitCanvas) return;
      downloadCanvasAsPDF(lastPortraitCanvas, 'DBE-Future-Designer-Mirror-Portrait.pdf');
    });
  }

  /* ---------- 13. LIVING DBE MASCOTTE VIRTUAL ASSISTANT (ROAMING GUIDE) ---------- */
  function initMascotteGuide() {
    const panel = document.getElementById('guide-panel');
    const toggleBtn = document.getElementById('guide-toggle-btn');
    const closeBtn = document.getElementById('guide-close-btn');
    const figEl = document.getElementById('guide-mascot-figure');
    const portraitEl = document.getElementById('guide-panel-portrait');
    const moodTextEl = document.getElementById('guide-panel-mood');
    const reactionChip = document.getElementById('guide-reaction-chip');
    const msgBox = document.getElementById('guide-messages');
    const chipsBox = document.getElementById('guide-chips');
    const form = document.getElementById('guide-input-form');
    const input = document.getElementById('guide-input');
    if (!panel || !toggleBtn || !figEl) return;

    function updateGuideAppearance(mood, fill = '#000000') {
      STATE.guideMood = mood;
      STATE.guideFill = fill;
      figEl.innerHTML = buildMascotSVG(mood, fill, '#FFFFFF');
      if (portraitEl) portraitEl.innerHTML = buildMascotSVG(mood, fill, '#FFFFFF');
      if (moodTextEl) {
        const lbl = (MOOD_LABELS[mood] && MOOD_LABELS[mood][STATE.lang]) || 'Curious';
        moodTextEl.textContent = STATE.lang === 'it'
          ? `UMORE: ${lbl.toUpperCase()} · GUIDA INTERATTIVA`
          : `MOOD: ${lbl.toUpperCase()} · INTERACTIVE GUIDE`;
      }
    }

    function hopMascot() {
      figEl.classList.remove('is-hopping');
      void figEl.offsetWidth;
      figEl.classList.add('is-hopping');
    }

    // Section-aware live reactions as user scrolls!
    const sectionReactions = {
      hero: { mood: 'classic', fill: '#000000', en: 'Ciao! Ask me anything about DBE', it: 'Ciao! Chiedimi tutto su DBE' },
      program: { mood: 'eyebrow', fill: '#000000', en: 'che vvuò? Ask me who I am!', it: 'che vvuò? Chiedimi chi sono!' },
      directions: { mood: 'joy', fill: '#ED1C24', en: 'Exhibit or Digital? Ask me to compare!', it: 'Exhibit o Digital? Chiedimi le differenze!' },
      skills: { mood: 'wide', fill: '#2E3192', en: '6 core studio skills inside!', it: '6 competenze chiave nei laboratori!' },
      'study-plan': { mood: 'classic', fill: '#000000', en: '120 ECTS! Looking for a course?', it: '120 CFU! Cerchi un esame preciso?' },
      admissions: { mood: 'shy', fill: '#000000', en: 'Open access! Need help applying?', it: 'Accesso libero! Ti aiuto a iscriverti?' },
      campus: { mood: 'peek', fill: '#000000', en: 'Palazzo Gravina, heart of Naples', it: 'Palazzo Gravina, centro di Napoli' },
      stickers: { mood: 'shy', fill: '#000000', en: 'Hey, those are my stickers!', it: 'Ehi, quelli sono i miei sticker!' },
      mirror: { mood: 'wide', fill: '#000000', en: 'Look in the Mirror Camera!', it: 'Prova lo Specchio fotografico!' },
      contacts: { mood: 'classic', fill: '#000000', en: 'Contacts, offices & FAQ here!', it: 'Contatti, segreteria e FAQ qui!' }
    };

    window.__onSectionEntered = sid => {
      const react = sectionReactions[sid];
      if (!react) return;
      if (!STATE.guideOpen) {
        updateGuideAppearance(react.mood, react.fill);
      }
      if (reactionChip) reactionChip.textContent = react[STATE.lang] || react.en;
    };

    function teleportTo(targetId, setupFn) {
      hopMascot();
      const target = document.getElementById(targetId);
      if (typeof setupFn === 'function') setupFn();
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.classList.remove('guide-highlight');
        void target.offsetWidth;
        target.classList.add('guide-highlight');
      }
    }

    function appendMessage(role, htmlText, actionObj) {
      const div = document.createElement('div');
      div.className = `guide-msg ${role === 'user' ? 'msg-user' : 'msg-bot'}`;
      div.innerHTML = htmlText;
      if (actionObj) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'guide-msg-action';
        btn.textContent = actionObj.label;
        btn.addEventListener('click', () => teleportTo(actionObj.targetId, actionObj.run));
        div.appendChild(document.createElement('br'));
        div.appendChild(btn);
      }
      msgBox.appendChild(div);
      msgBox.scrollTop = msgBox.scrollHeight;
    }

    // Smart Bilingual Knowledge Engine (Zero boring generic replies!)
    function answerQuery(rawQ) {
      const q = rawQ.toLowerCase();
      const isIt = STATE.lang === 'it' || /\b(come|quanto|dove|quando|cosa|quali|chi|serve|tasse|iscrizione|esami|laurea|ciao|inglese|tirocinio|sede|orari)\b/.test(q);

      // 1. "che vvuò?" / Who is the Mascotte & what can it do
      if (/che vvu|chi sei|who are you|mascott|what do you do|cosa fai|cosa puoi fare|nome|name/.test(q)) {
        updateGuideAppearance('eyebrow', '#ED1C24');
        hopMascot();
        return {
          text: isIt
            ? '<strong>Che vvuò?</strong> (ovvero <em>"che vuoi?"</em> in napoletano!) Sono la <strong>Mascotte ufficiale di DBE</strong>, nata direttamente dalle pagine del nostro progetto editoriale.<br><br><strong>Cosa posso fare per te?</strong> Ti faccio da guida interattiva sul sito: chiedimi qualsiasi cosa su <strong>piano di studi (120 CFU)</strong>, differenze <strong>Exhibit vs Digital</strong>, <strong>ammissione 2026/27</strong>, <strong>inglese B2</strong>, <strong>tasse ISEE</strong>, <strong>Palazzo Gravina</strong> o <strong>contatti</strong>, e ti porto subito nella sezione giusta!'
            : '<strong>Che vvuò?</strong> (that’s <em>"what do you want?"</em> in Neapolitan!) I’m the official <strong>DBE Mascotte</strong>, born straight from the pages of our editorial project.<br><br><strong>What can I do?</strong> I’m your interactive guide across the website: ask me about the <strong>120 ECTS study plan</strong>, <strong>Exhibit vs Digital</strong>, <strong>2026/27 admissions</strong>, <strong>B2 English</strong>, <strong>ISEE tuition</strong>, <strong>Palazzo Gravina</strong>, or <strong>contacts</strong>, and I’ll walk you right to the section you need!',
          action: { label: isIt ? 'Esplora i 120 CFU →' : 'Explore 120 ECTS Plan →', targetId: 'study-plan' }
        };
      }

      // 1b. Talking Forks on the Manifesto page
      if (/forchett|fork/.test(q)) {
        updateGuideAppearance('eyebrow', '#ED1C24');
        hopMascot();
        return {
          text: isIt
            ? 'Nella sezione <strong>01 · Il Corso</strong> trovi le forchette interattive dell’editoriale: cliccale per animarle!'
            : 'In section <strong>01 · Program</strong> you can tap the interactive editorial forks to see them gesture!',
          action: { label: isIt ? 'Vai alla Sezione 01 →' : 'Walk me to Section 01 →', targetId: 'program' }
        };
      }

      // 2. Tuition / Fees / ISEE / Scholarships
      if (/tass|cost|fee|tuition|isee|bors|scholar|adisurc|pay|pag|free|grat/.test(q)) {
        updateGuideAppearance('shy', '#000000');
        hopMascot();
        return {
          text: isIt
            ? 'Alla <strong>Federico II</strong> le tasse sono pubbliche e calcolate sull’<strong>ISEE</strong>. In No-Tax Area paghi solo ~156€/anno (tassa regionale e bollo), e puoi richiedere le borse <strong>ADISURC Campania</strong> (alloggio, mensa e contributo).'
            : 'At <strong>Federico II</strong>, tuition is public and strictly income based via <strong>ISEE</strong>. Students in the No-Tax Area pay only ~€156/year, and both Italian and international students can apply for <strong>ADISURC Campania</strong> scholarships.',
          action: { label: isIt ? 'Vai alle FAQ in fondo →' : 'Walk me to Tuition FAQ →', targetId: 'faq' }
        };
      }

      // 3. Exhibit vs Digital Curricula
      if (/exhibit|digital|differen|curricul|indirizz|percors|scelt|track|acetat/.test(q)) {
        const wantsDig = /digital|ux|ui|interac|vr|ar|iot/.test(q);
        updateGuideAppearance('joy', wantsDig ? '#00AEEF' : '#ED1C24');
        hopMascot();
        return {
          text: isIt
            ? 'Il <strong>1° anno (60 CFU)</strong> è comune a tutti. Al <strong>2° anno</strong> scegli tra:<br>• <strong>Exhibit Design (DB102)</strong>: musei, allestimenti, interni, lighting, digital fabrication.<br>• <strong>Digital Design (DB103)</strong>: UI/UX, Interaction Design, Systemic Design, AR/VR e IoT.'
            : '<strong>Year 1 (60 ECTS)</strong> is shared by everyone. In <strong>Year 2</strong> you choose:<br>• <strong>Exhibit Design (DB102)</strong>: museums, interiors, temporary spaces, lighting, digital fabrication.<br>• <strong>Digital Design (DB103)</strong>: UI/UX, Interaction Design, Systemic Design, AR/VR and IoT.',
          action: {
            label: wantsDig ? (isIt ? 'Attiva Filtro Blu (Digital) →' : 'Activate Blue Acetate (Digital) →') : (isIt ? 'Attiva Filtro Rosso (Exhibit) →' : 'Activate Red Acetate (Exhibit) →'),
            targetId: 'directions',
            run: () => { if (applyAcetateGlobal) applyAcetateGlobal(wantsDig ? 'blue' : 'red'); }
          }
        };
      }

      // 4. English B2 / Language / Interview
      if (/b2|english|ingles|ielts|toefl|lingua|language|colloqui|interview/.test(q)) {
        updateGuideAppearance('classic', '#000000');
        hopMascot();
        return {
          text: isIt
            ? 'Il corso è <strong>100% in inglese</strong> ed è richiesto almeno il livello <strong>B2</strong>. Non hai una certificazione ufficiale (IELTS, TOEFL, Cambridge)? Nessun problema: la commissione verifica il tuo inglese durante il <strong>colloquio di ammissione</strong>.'
            : 'DBE is taught <strong>100% in English</strong> with a minimum <strong>B2</strong> requirement. No formal certificate yet (IELTS, TOEFL, Cambridge)? No worries: the departmental committee can assess your English during the <strong>admission interview</strong>.',
          action: { label: isIt ? 'Apri Checker Requisiti →' : 'Open Eligibility Checker →', targetId: 'admissions' }
        };
      }

      // 5. Portfolio / Documents / Extra-EU / Apply / Deadlines / Numero chiuso
      if (/portfol|apply|iscriv|ammiss|requisit|document|extra|non-eu|visa|universitaly|segrepass|scadenz|deadlin|numero chiuso|cap|date|quando/.test(q)) {
        const isExtra = /extra|non-eu|foreign|visa|universitaly|ester|international/.test(q);
        updateGuideAppearance('joy', '#2E3192');
        hopMascot();
        return {
          text: isIt
            ? 'DBE è ad <strong>accesso libero</strong> (niente numero chiuso!).<br>• <strong>Extra-UE</strong>: apertura dal <strong>15 Febbraio 2026</strong> (8 documenti + Portfolio a <code>infodiarcdbe@unina.it</code> e Universitaly).<br>• <strong>Italiani</strong>: dal <strong>1° Settembre 2026</strong> su Segrepass.<br>• <strong>Inizio lezioni 1° anno</strong>: <strong>5 Ottobre 2026</strong>.'
            : 'DBE has <strong>open access</strong> (no local cap!).<br>• <strong>Extra-EU</strong>: opens <strong>Feb 15, 2026</strong> (8 documents + Portfolio to <code>infodiarcdbe@unina.it</code> then Universitaly).<br>• <strong>Italian students</strong>: from <strong>Sep 1, 2026</strong> on Segrepass.<br>• <strong>1st year lessons start</strong>: <strong>Oct 5, 2026</strong>.',
          action: {
            label: isExtra ? (isIt ? 'Imposta Checklist Extra-UE →' : 'Open Extra-EU Checklist →') : (isIt ? 'Apri Checklist 2026/27 →' : 'Open 2026/27 Checklist →'),
            targetId: 'admissions',
            run: () => {
              if (setVellumGlobal) setVellumGlobal(100);
              if (isExtra) setWizardCitizenship('noneu');
            }
          }
        };
      }

      // 6. Courses / Study Plan / ECTS / Exams
      if (/esam|cors|cours|plan|piano|cfu|ects|studi|manifest|laborator|studio|workshop|tesi|thesis/.test(q)) {
        updateGuideAppearance('wide', '#000000');
        hopMascot();
        return {
          text: isIt
            ? 'Il piano 2026/27 vale <strong>120 CFU</strong>: <strong>60 CFU</strong> al 1° anno comune (Industrial, Interior, Web, Strutture & Materiali, Visual Expression, Storia, Filiera Circolare) + <strong>40 CFU</strong> di laboratori del 2° anno + <strong>8 CFU</strong> a scelta + <strong>6 CFU</strong> Tirocinio + <strong>6 CFU</strong> Tesi.'
            : 'The 2026/27 plan totals <strong>120 ECTS</strong>: <strong>60 ECTS</strong> shared Year 1 (Industrial, Interior, Web, Structures & Materials, Visual Expression, History, Circular Supply Chain) + <strong>40 ECTS</strong> Year 2 track studios + <strong>8 ECTS</strong> electives + <strong>6 ECTS</strong> traineeship + <strong>6 ECTS</strong> thesis.',
          action: {
            label: isIt ? 'Esplora tutti i 120 CFU →' : 'Walk me to 120 ECTS Plan →',
            targetId: 'study-plan',
            run: () => setStudyPlanTrack('all')
          }
        };
      }

      // 7. Contacts / Secretariat / Offices
      if (/contatt|contact|email|segreteri|secretariat|forno vecchio|toledo|uffic|office|portal/.test(q)) {
        updateGuideAppearance('classic', '#2E3192');
        hopMascot();
        return {
          text: isIt
            ? 'Puoi scrivere alla <strong>Segreteria Didattica DBE</strong> (Amelia Corbisiero e Patrizia Masucci) a <code>infodiarcdbe@unina.it</code> o al Coordinatore <strong>Prof. Alfonso Morone</strong> (<code>alfonso.morone@unina.it</code>). La Segreteria Studenti è in <strong>Via Forno Vecchio 36</strong>.'
            : 'You can reach the <strong>DBE Academic Secretariat</strong> (Amelia Corbisiero & Patrizia Masucci) at <code>infodiarcdbe@unina.it</code> or Program Coordinator <strong>Prof. Alfonso Morone</strong> (<code>alfonso.morone@unina.it</code>). The Student Affairs Office is at <strong>Via Forno Vecchio 36</strong>.',
          action: { label: isIt ? 'Vai a 06 · Contatti →' : 'Walk me to 06 · Contacts →', targetId: 'contacts' }
        };
      }

      // 7b. Palazzo Gravina / Campus / Location / Hours / Coordinator / Professors
      if (/dove|where|palazzo|gravina|sed|indirizz|address|metro|orar|hour|morone|prof|docent|coordinat|napoli|naples/.test(q)) {
        updateGuideAppearance('peek', '#2E3192');
        hopMascot();
        return {
          text: isIt
            ? 'Le lezioni si tengono a <strong>Palazzo Gravina</strong> (Via Monteoliveto 3, 2° piano, Aule 18, 19, 21, vicino Metro Toledo/Dante/Università). Coordinatore: <strong>Prof. Alfonso Morone</strong>. Email ufficiale: <code>infodiarcdbe@unina.it</code>.'
            : 'Classes take place at <strong>Palazzo Gravina</strong> (Via Monteoliveto 3, 2nd floor, Rooms 18, 19, 21, minutes from Toledo, Dante and Università Metro). Coordinator: <strong>Prof. Alfonso Morone</strong>. Official email: <code>infodiarcdbe@unina.it</code>.',
          action: { label: isIt ? 'Vedi 05 · Sede e Docenti →' : 'Walk me to 05 · Campus →', targetId: 'campus' }
        };
      }

      // 8. Erasmus / Internship / Careers
      if (/erasmus|tirocini|intern|trainee|lavor|career|sbocch|job|estero|abroad/.test(q)) {
        updateGuideAppearance('shy', '#000000');
        hopMascot();
        return {
          text: isIt
            ? 'Puoi fare sia scambi <strong>Erasmus+</strong> in scuole europee di design (referente Prof. Cristina Mattiucci) sia il <strong>Tirocinio obbligatorio (6 CFU)</strong> in studi, musei, aziende tech o all’estero! Gli sbocchi spaziano da Exhibit & Museografia a UI/UX, AR/VR e Design Management.'
            : 'You can join <strong>Erasmus+</strong> studio exchanges across Europe (Prof. Cristina Mattiucci) and complete your mandatory <strong>6 ECTS Traineeship</strong> in studios, museums, tech firms, or abroad! Graduates work in Exhibit, Interior, UI/UX, AR/VR and Design Management.',
          action: { label: isIt ? 'Scopri Carriere & Erasmus →' : 'Walk me to Careers & Campus →', targetId: 'campus' }
        };
      }

      // 9. Mirror / Photo / Stickers
      if (/specchi|mirror|foto|photo|camera|selfie|sticker|cartolin|postcard/.test(q)) {
        const isMirror = /specchi|mirror|foto|photo|camera|selfie/.test(q);
        updateGuideAppearance('wide', '#ED1C24');
        hopMascot();
        return {
          text: isMirror
            ? (isIt ? 'Nella sezione <strong>Carta Specchiata</strong> di Pagina 12 puoi attivare la fotocamera o caricare una foto per scaricare il tuo ritratto DBE in PNG o PDF!' : 'In the interactive <strong>Page 12 Mirror Card</strong> section you can turn on your camera or upload a portrait and download it as PNG or PDF!')
            : (isIt ? 'Nell’Atelier <strong>TAKE ME WITH YOU!</strong> trovi tutti i miei 15 sticker originali per comporre una cartolina DBE Napoli o attaccarli ovunque sulla pagina!' : 'Inside <strong>TAKE ME WITH YOU!</strong> you have all 15 original stickers to build your DBE Naples postcard (PNG/PDF) or stamp them anywhere on the page!'),
          action: {
            label: isMirror ? (isIt ? 'Vai allo Specchio →' : 'Take me to the Mirror →') : (isIt ? 'Vai agli Sticker →' : 'Take me to Stickers →'),
            targetId: isMirror ? 'mirror' : 'stickers'
          }
        };
      }

      // Fallback helpful guide
      updateGuideAppearance('classic', '#000000');
      return {
        text: isIt
          ? 'Ottima domanda! Posso aiutarti subito su: <strong>piano di studi (120 CFU)</strong>, differenze <strong>Exhibit vs Digital</strong>, <strong>iscrizione 2026/27</strong>, <strong>tasse ISEE</strong>, <strong>livello B2 / Portfolio</strong>, <strong>Palazzo Gravina</strong> o <strong>Erasmus+</strong>. Per richieste personali scrivi a <code>infodiarcdbe@unina.it</code>.'
          : 'Great question! I can help right away with the <strong>120 ECTS study plan</strong>, <strong>Exhibit vs Digital</strong>, <strong>2026/27 admissions</strong>, <strong>ISEE tuition</strong>, <strong>B2 English & portfolio</strong>, <strong>Palazzo Gravina</strong>, or <strong>Erasmus+</strong>. For specific academic cases, email <code>infodiarcdbe@unina.it</code>.',
        action: { label: isIt ? 'Esplora il Piano di Studi →' : 'Explore Study Plan →', targetId: 'study-plan' }
      };
    }

    function renderQuickChips() {
      if (!chipsBox) return;
      const list = STATE.lang === 'it'
        ? ['Exhibit vs Digital?', 'Come iscriversi 26/27?', 'Quanto costa (ISEE)?', 'Serve il B2?', 'Palazzo Gravina', 'Che vvuò?']
        : ['Exhibit vs Digital?', 'How to apply 26/27?', 'Tuition & ISEE?', 'English B2?', 'Palazzo Gravina', 'che vvuò?'];
      chipsBox.innerHTML = list.map(q => `<button type="button" class="guide-chip">${q}</button>`).join('');
      chipsBox.querySelectorAll('.guide-chip').forEach(ch => {
        ch.addEventListener('click', () => handleAsk(ch.textContent));
      });
    }

    function handleAsk(question) {
      const clean = question.trim();
      if (!clean) return;
      appendMessage('user', clean.replace(/</g, '&lt;'));
      const res = answerQuery(clean);
      setTimeout(() => {
        appendMessage('bot', res.text, res.action);
      }, 160);
    }

    function setGuideOpen(open) {
      STATE.guideOpen = open;
      panel.classList.toggle('is-open', open);
      panel.setAttribute('aria-hidden', String(!open));
      toggleBtn.setAttribute('aria-expanded', String(open));
      const guideRoot = document.getElementById('dbe-guide');
      const hero = document.getElementById('hero');
      if (guideRoot && hero) {
        const pastHero = window.scrollY > Math.max(80, hero.offsetHeight - 100);
        guideRoot.classList.toggle('is-on-hero', !pastHero && !open);
      }
      if (open) {
        hopMascot();
        if (!msgBox.children.length) {
          appendMessage(
            'bot',
            STATE.lang === 'it'
              ? 'Ciao! Sono la <strong>Mascotte di DBE</strong>. Chiedimi qualsiasi info su corsi, ammissione 26/27, tasse, portfolio o Palazzo Gravina: cambio espressione e ti accompagno nella sezione giusta!'
              : 'Ciao! I’m the <strong>DBE Mascotte</strong>. Ask me anything about courses, 26/27 admissions, tuition, portfolio, or Palazzo Gravina, and I’ll walk you straight to the right section!'
          );
        }
        setTimeout(() => input?.focus(), 120);
      }
    }

    // Clicking the Hero cover's giant bottom-right peeking Mascotte ALSO opens the Guide!
    document.getElementById('hero-peeking-mascot')?.addEventListener('click', () => {
      if (!STATE.guideOpen) setGuideOpen(true);
    });

    toggleBtn.addEventListener('click', () => setGuideOpen(!STATE.guideOpen));
    closeBtn?.addEventListener('click', () => setGuideOpen(false));
    form?.addEventListener('submit', e => {
      e.preventDefault();
      if (!input.value.trim()) return;
      handleAsk(input.value);
      input.value = '';
    });

    updateGuideAppearance('classic', '#000000');
    renderQuickChips();

    window.__refreshGuideLang = () => {
      renderQuickChips();
      updateGuideAppearance(STATE.guideMood, STATE.guideFill);
      if (input) {
        input.placeholder = STATE.lang === 'it'
          ? 'Chiedi tasse, esami, B2, portfolio, sede...'
          : 'Ask about tuition, courses, B2, portfolio...';
      }
      const sendBtn = document.getElementById('guide-send-btn');
      if (sendBtn) sendBtn.textContent = STATE.lang === 'it' ? 'CHIEDI' : 'ASK';
    };
  }

  /* ---------- 14. BILINGUAL EN / IT SWITCHER ---------- */
  function applyLanguage(lang) {
    STATE.lang = lang;
    document.documentElement.lang = lang;
    const dict = window.DBE_DATA.i18n[lang];
    if (dict) {
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) el.textContent = dict[key];
      });
    }
    document.querySelectorAll('.lang-btn').forEach(b => {
      b.classList.toggle('is-active', b.getAttribute('data-lang') === lang);
    });
    renderAllMascots();
    renderSkillsSection();
    renderStudyPlan();
    renderAdmissionsWizard();
    renderCareersAndFAQ();
    if (syncStickerLabelsGlobal) syncStickerLabelsGlobal();
    if (setVellumGlobal) setVellumGlobal(STATE.vellumPeel);
    if (typeof window.__refreshGuideLang === 'function') window.__refreshGuideLang();
  }

  function initLanguageSwitcher() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => applyLanguage(btn.getAttribute('data-lang')));
    });
    applyLanguage('en');
  }

  /* ---------- 15. FULL STATE RESET ON RELOAD & SAFARI BFCACHE ---------- */
  function resetToFreshPageState() {
    // 1. Clear all page stickers & postcard stickers
    const pageLayer = document.getElementById('page-sticker-layer');
    if (pageLayer) pageLayer.innerHTML = '';
    const postcardStage = document.getElementById('postcard-stage');
    if (postcardStage) {
      postcardStage.querySelectorAll('.placed-sticker').forEach(n => n.remove());
      STATE.postcardBg = 'red';
      postcardStage.setAttribute('data-bg', 'red');
      document.querySelectorAll('.bg-swatch-btn').forEach(b => {
        b.classList.toggle('is-active', b.getAttribute('data-paper') === 'red');
      });
    }
    STATE.selectedStickerIdx = 0;
    STATE.pageStickMode = false;
    document.body.classList.remove('is-stick-mode');
    document.getElementById('sticker-mode-hud')?.classList.remove('is-visible');
    document.getElementById('sticker-ghost-cursor')?.classList.remove('is-visible');
    if (syncStickerLabelsGlobal) syncStickerLabelsGlobal();

    // 2. Reset Acetate Lens position and mode
    STATE.lensPos = { x: 210, y: 155, w: 330, h: 255 };
    if (applyAcetateGlobal) applyAcetateGlobal('lens-red');

    // 3. Reset Vellum Tracing Sheet slider
    const vellumSlider = document.getElementById('vellum-slider');
    if (vellumSlider) vellumSlider.value = '0';
    if (setVellumGlobal) setVellumGlobal(0);

    // 4. Reset Study Plan search & filters
    STATE.planTrack = 'all';
    STATE.planSem = 'all';
    STATE.planQuery = '';
    const planSearch = document.getElementById('plan-search');
    if (planSearch) planSearch.value = '';
    document.querySelectorAll('#plan-track-tabs .tab-btn').forEach(btn => {
      const active = btn.getAttribute('data-track') === 'all';
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', String(active));
    });
    document.querySelectorAll('.plan-filters .filter-pill').forEach(pill => {
      pill.classList.toggle('is-active', pill.getAttribute('data-sem') === 'all');
    });
    renderStudyPlan();

    // 5. Reset Admissions Wizard controls
    STATE.wizCitizenship = 'it';
    STATE.wizDegree = 'direct';
    STATE.wizEnglish = 'cert';
    const wizDeg = document.getElementById('wiz-degree');
    if (wizDeg) wizDeg.value = 'direct';
    document.querySelectorAll('#wiz-citizenship button').forEach(b => {
      b.classList.toggle('is-active', b.getAttribute('data-val') === 'it');
    });
    document.querySelectorAll('#wiz-english button').forEach(b => {
      b.classList.toggle('is-active', b.getAttribute('data-val') === 'cert');
    });
    renderAdmissionsWizard();

    // 6. Reset Mirror Photobooth input & frame
    const mirrorUpload = document.getElementById('mirror-upload-input');
    if (mirrorUpload) mirrorUpload.value = '';
    document.getElementById('mirror-stop-btn')?.click();
  }

  /* ---------- BOOTSTRAP ALL MODULES ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    hydrateSVGs();
    initNavigation();
    initMascotInteractions();
    initMunariForks();
    initAcetateStudio();
    initFoldoutAndIndex();
    initStudyPlan();
    initAdmissionsWizard();
    initStickerAtelier();
    initVellumOverlay();
    initMirrorPhotobooth();
    initMascotteGuide();
    initLanguageSwitcher();
    resetToFreshPageState();
  });

  window.addEventListener('pageshow', () => {
    resetToFreshPageState();
  });
})();
