/* ═══════════════════════════════════════════════════════════════════════════
   Ovelhas Play — Studio-Grade Poki Engine & Retention Meta-System (oc.js)
   HiDPI Canvas · Procedural Soundtrack · Collectible Cards · Daily Streak · XP
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  const OC = (window.OC = {});
  const get = (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } };
  const set = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  OC.get = get; OC.set = set;

  /* ── 24 Cromos Colecionáveis do Álbum Galáctico ────────────────────────── */
  OC.CARDS = [
    { id: 'c1', name: 'Ovelha Arco-Íris Capitã', rarity: 'Lendário', emo: '🌈', img: 'ovelha-arcoiris' },
    { id: 'c2', name: 'Ovelha Azul Astrónoma', rarity: 'Comum', emo: '🔭', img: 'ovelha-azul' },
    { id: 'c3', name: 'Ovelha Rosa Estilista', rarity: 'Comum', emo: '💖', img: 'ovelha-rosa' },
    { id: 'c4', name: 'Ovelha Verde Botânica', rarity: 'Comum', emo: '🌱', img: 'ovelha-verde' },
    { id: 'c5', name: 'Ovelha Roxa Alquimista', rarity: 'Raro', emo: '🔮', img: 'ovelha-roxa' },
    { id: 'c6', name: 'Ovelha Laranja Piloto', rarity: 'Raro', emo: '🚀', img: 'ovelha-laranja' },
    { id: 'c7', name: 'Ovelha Melancia DJ', rarity: 'Raro', emo: '🍉', img: 'ovelha-melancia' },
    { id: 'c8', name: 'Elefante Amendoim Chef', rarity: 'Épico', emo: '🐘', img: 'elefante-amendoim' },
    { id: 'c9', name: 'Pato Magnético Espacial', rarity: 'Épico', emo: '🦆', img: 'pato' },
    { id: 'c10', name: 'Cometa de Lã Dourada', rarity: 'Raro', emo: '☄️', img: 'ovelha-arcoiris' },
    { id: 'c11', name: 'Guardião da Nebulosa', rarity: 'Lendário', emo: '👾', img: 'elefante-amendoim' },
    { id: 'c12', name: 'Submarino da Lua Azul', rarity: 'Raro', emo: '🫧', img: 'ovelha-azul' },
    { id: 'c13', name: 'Expresso das Estrelas', rarity: 'Épico', emo: '🚂', img: 'ovelha-roxa' },
    { id: 'c14', name: 'Tarte Dourada de Amendoim', rarity: 'Comum', emo: '🥧', img: 'elefante-amendoim' },
    { id: 'c15', name: 'Batuta da Aurora Cósmica', rarity: 'Épico', emo: '🎻', img: 'ovelha-rosa' },
    { id: 'c16', name: 'Relógio do Tempo Solar', rarity: 'Raro', emo: '⚙️', img: 'ovelha-laranja' },
    { id: 'c17', name: 'Árvore de Cristal', rarity: 'Épico', emo: '🌳', img: 'ovelha-verde' },
    { id: 'c18', name: 'Coroa do Rei da Colina', rarity: 'Lendário', emo: '👑', img: 'ovelha-arcoiris' }
  ];

  OC.cardsOwned = () => get('op_cards', {});
  OC.unlockCard = (cardId) => {
    const owned = OC.cardsOwned();
    const card = cardId ? OC.CARDS.find(c => c.id === cardId) : OC.CARDS[Math.floor(Math.random() * OC.CARDS.length)];
    if (!card) return null;
    const isNew = !owned[card.id];
    owned[card.id] = (owned[card.id] || 0) + 1;
    set('op_cards', owned);
    if (isNew) {
      OC.addStars(5);
      OC.toast(`🃏 NOVO CROMO (${card.rarity}): ${card.emo} ${card.name}! (+5⭐)`);
    } else {
      OC.addStars(2);
      OC.toast(`🃏 Cromo Repetido Convertido: ${card.emo} ${card.name} (+2⭐)`);
    }
    try { parent !== window && parent.postMessage({ op: 'cards', owned }, '*'); } catch (e) {}
    return card;
  };

  /* ── Missões Diárias & Streak de Dias Seguidos ─────────────────────────── */
  OC.todayKey = () => new Date().toISOString().slice(0, 10);
  OC.checkDaily = () => {
    const today = OC.todayKey();
    const st = get('op_daily', { lastDate: '', streak: 0, claimed: false, gamesPlayed: [], starsToday: 0, dropsToday: 0 });
    if (st.lastDate !== today) {
      const yest = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      st.streak = (st.lastDate === yest) ? (st.streak + 1) : 1;
      st.lastDate = today;
      st.claimed = false;
      st.gamesPlayed = [];
      st.starsToday = 0;
      st.dropsToday = 0;
      set('op_daily', st);
    }
    return st;
  };
  OC.recordMissionProgress = (type, val) => {
    const st = OC.checkDaily();
    if (type === 'game' && val && !st.gamesPlayed.includes(val)) {
      st.gamesPlayed.push(val);
      if (st.gamesPlayed.length === 3) {
        OC.addStars(10);
        OC.toast('🎯 Missão Diária Concluída: Jogar 3 Jogos! (+10⭐)');
      }
    }
    if (type === 'stars') {
      const before = st.starsToday || 0;
      st.starsToday = before + val;
      if (before < 15 && st.starsToday >= 15) {
        set('op_daily', st);
        OC.unlockCard();
      }
    }
    if (type === 'drop') {
      st.dropsToday = (st.dropsToday || 0) + 1;
    }
    set('op_daily', st);
  };

  /* ── Estrelas, Recordes e Patentes ─────────────────────────────────────── */
  OC.stars = () => get('op_stars', 0);
  OC.addStars = n => {
    n = Math.max(0, Math.floor(n));
    if (n <= 0) return OC.stars();
    const oldR = OC.rank(OC.stars());
    const t = OC.stars() + n;
    set('op_stars', t);
    OC.recordMissionProgress('stars', n);
    const newR = OC.rank(t);
    if (newR !== oldR) setTimeout(() => OC.toast('🎖️ Nova Patente: ' + newR + '!'), 350);
    try { parent !== window && parent.postMessage({ op: 'stars', total: t }, '*'); } catch (e) {}
    return t;
  };
  OC.best = (id, v) => {
    const k = 'op_best_' + id, b = get(k, 0);
    if (v !== undefined && v > b) {
      set(k, v);
      OC.unlock('rec_' + id, '🏆 Novo Recorde!');
      try { parent !== window && parent.postMessage({ op: 'best', id, best: v }, '*'); } catch (e) {}
      return v;
    }
    return b;
  };
  OC.ranks = [
    [0, '🐣 Cadete Espacial'],
    [15, '🐑 Ovelha Aprendiz'],
    [45, '🚀 Piloto do Rebanho'],
    [110, '🌟 Capitão Estrela'],
    [250, '👑 Comandante Arco-Íris'],
    [500, '🌌 Lenda da Nebulosa'],
    [1000, '💎 Guardião Supremo do Universo']
  ];
  OC.rank = (s = OC.stars()) => OC.ranks.filter(r => s >= r[0]).pop()[1];

  /* ── Recursos Visuais ──────────────────────────────────────────────────── */
  OC.A = '../../../assets/personagens/';
  OC.SHEEP = ['arcoiris', 'azul', 'rosa', 'verde', 'roxa', 'laranja', 'melancia'];
  OC.COLORS = {
    arcoiris: '#ff85a2', azul: '#4cc9f0', rosa: '#ff9ecd',
    verde: '#06d6a0', roxa: '#9b5de5', laranja: '#ff9f1c', melancia: '#ef476f'
  };
  const imgCache = {};
  OC.img = (n) => {
    const clean = String(n).replace(/\.png$/i, '');
    if (imgCache[clean]) return imgCache[clean];
    const i = new Image();
    i.src = OC.A + clean + '.png';
    return (imgCache[clean] = i);
  };

  /* ── Áudio Sintetizado & Banda Sonora Ambiente (WebAudio) ──────────────── */
  let ac, masterGain, bgmTimer;
  OC.muted = get('op_muted', false);
  OC.bgmOn = get('op_bgm', true);

  function ensureAC() {
    try {
      if (!ac) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) {
          ac = new AC();
          masterGain = ac.createGain();
          masterGain.gain.value = OC.muted ? 0 : 1;
          masterGain.connect(ac.destination);
        }
      }
      if (ac && ac.state === 'suspended') ac.resume();
    } catch (e) {}
    return ac;
  }

  OC.tone = (f, d = .15, type = 'sine', v = .13, delay = 0, slide) => {
    if (OC.muted) return;
    try {
      if (!ensureAC()) return;
      const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + delay;
      o.type = type;
      o.frequency.setValueAtTime(Math.max(20, f), t);
      if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, slide), t + d);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(v, t + Math.min(0.015, d * 0.2));
      g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g); g.connect(masterGain);
      o.start(t); o.stop(t + d + 0.01);
    } catch (e) {}
  };

  OC.sfx = {
    pop: () => { OC.tone(540 + Math.random() * 240, .09, 'triangle', .13, 0, 920); },
    good: () => {
      OC.tone(587.3, .11, 'triangle', .13, 0);
      OC.tone(880, .18, 'triangle', .14, .08);
      OC.tone(1174.7, .22, 'sine', .1, .16);
    },
    coin: () => OC.sfx.good(),
    bad: () => {
      OC.tone(240, .28, 'sawtooth', .09, 0, 85);
      OC.tone(180, .32, 'triangle', .1, .05, 65);
    },
    hit: () => OC.sfx.bad(),
    win: () => {
      [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => {
        OC.tone(f, .26, 'triangle', .14, i * .09);
        OC.tone(f * 0.5, .28, 'sine', .08, i * .09);
      });
    },
    jump: () => OC.tone(310, .15, 'square', .065, 0, 760),
    click: () => OC.tone(800, .04, 'sine', .07, 0, 1200),
    tone: (f, d, t, v, dl, sl) => OC.tone(f, d, t, v, dl, sl)
  };

  /* Música espacial suave gerada em tempo real (pentatónica cósmica) */
  const SCALE = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
  let bgmStep = 0;
  function startBGM() {
    if (bgmTimer) return;
    bgmTimer = setInterval(() => {
      if (OC.muted || !OC.bgmOn || document.hidden) return;
      if (typeof location !== 'undefined' && /banda-ovelhas|simon-ovelhas|sinfonia-cosmica/.test(location.pathname)) return;
      const n = SCALE[(bgmStep * 3 + Math.floor(bgmStep / 4)) % SCALE.length];
      OC.tone(n, .42, 'sine', .022, 0);
      if (bgmStep % 4 === 0) OC.tone(n * 0.5, .75, 'triangle', .018, 0);
      bgmStep++;
    }, 480);
  }
  OC.music = {
    start: () => { ensureAC(); startBGM(); }
  };

  OC.setMuted = m => {
    OC.muted = !!m;
    set('op_muted', OC.muted);
    if (masterGain && ac) masterGain.gain.value = OC.muted ? 0 : 1;
    const mb = document.getElementById('oc-mute-btn');
    if (mb) mb.textContent = OC.muted ? '🔇' : '🔊';
  };
  window.addEventListener('message', e => {
    if (!e.data) return;
    if (e.data.op === 'mute') OC.setMuted(e.data.v);
    if (e.data.op === 'bgm') { OC.bgmOn = !!e.data.v; set('op_bgm', OC.bgmOn); }
  });

  /* ── Sistema de Partículas, Estrelas e Efeitos (`OC.fx`) ───────────────── */
  const fxParts = [], fxTexts = [], bgStars = [];
  let fxShake = 0;
  for (let i = 0; i < 85; i++) {
    bgStars.push({ rx: Math.random(), ry: Math.random(), r: 0.7 + Math.random() * 1.8, ph: Math.random() * 6.28 });
  }
  OC.fx = {
    drawStars: (ctx, W, H, now = 0) => {
      ctx.save();
      const g = ctx.createRadialGradient(W * 0.5, H * 0.25, 20, W * 0.5, H * 0.5, Math.max(W, H) * 0.85);
      g.addColorStop(0, '#1f1854');
      g.addColorStop(1, '#080a20');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      if (fxShake > 0.2) {
        ctx.translate((Math.random() - 0.5) * fxShake, (Math.random() - 0.5) * fxShake);
      }
      for (const s of bgStars) {
        ctx.fillStyle = `rgba(255,255,255,${0.35 + 0.45 * Math.sin(now * 0.002 + s.ph)})`;
        ctx.beginPath();
        ctx.arc(s.rx * W, s.ry * H, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    },
    burst: (x, y, col = '#ffd166', n = 16) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2, sp = 50 + Math.random() * 180;
        fxParts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, col, r: 2.5 + Math.random() * 3.5, l: 0.55 });
      }
    },
    floatText: (x, y, txt, col = '#ffd166') => {
      fxTexts.push({ x, y, txt, col, l: 0.85 });
    },
    shake: (amt = 10) => {
      fxShake = Math.max(fxShake, amt);
    },
    update: (ctx, dt = 0.016) => {
      fxShake = Math.max(0, fxShake - 32 * dt);
      ctx.save();
      for (let i = fxParts.length - 1; i >= 0; i--) {
        const p = fxParts[i];
        p.x += p.vx * dt; p.y += p.vy * dt; p.l -= dt;
        if (p.l <= 0) { fxParts.splice(i, 1); continue; }
        ctx.globalAlpha = Math.max(0, Math.min(1, p.l * 2));
        ctx.fillStyle = p.col;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.font = '700 18px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      for (let i = fxTexts.length - 1; i >= 0; i--) {
        const t = fxTexts[i];
        t.y -= 45 * dt; t.l -= dt;
        if (t.l <= 0) { fxTexts.splice(i, 1); continue; }
        ctx.globalAlpha = Math.max(0, Math.min(1, t.l * 1.4));
        ctx.fillStyle = t.col;
        ctx.fillText(t.txt, t.x, t.y);
      }
      ctx.restore();
    }
  };

  /* ── Toasts de Conquistas & Confetis ───────────────────────────────────── */
  OC.toast = function (msg) {
    const t = document.createElement('div');
    t.className = 'oc-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('on'), 20);
    setTimeout(() => { t.classList.remove('on'); setTimeout(() => { if (t.remove) t.remove(); }, 350); }, 3200);
  };
  OC.unlock = function (key, label) {
    const u = get('op_ach', {});
    if (u[key]) return;
    u[key] = 1; set('op_ach', u);
    OC.toast(label);
  };

  OC.confetti = function (container) {
    const cv = document.createElement('canvas');
    cv.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:10000';
    (container || document.body).appendChild(cv);
    const ctx = cv.getContext('2d');
    const W = (cv.width = innerWidth), H = (cv.height = innerHeight);
    const cols = ['#ffd166', '#ff85a2', '#00f5d4', '#4cc9f0', '#9b5de5', '#06d6a0'];
    const ps = Array.from({ length: 85 }, () => ({
      x: W / 2 + (Math.random() - .5) * 140,
      y: H * .45,
      vx: (Math.random() - .5) * 16,
      vy: -6 - Math.random() * 12,
      w: 7 + Math.random() * 6,
      h: 4 + Math.random() * 5,
      rot: Math.random() * 6.28,
      vr: (Math.random() - .5) * .25,
      c: cols[Math.floor(Math.random() * cols.length)],
      l: 1
    }));
    (function anim() {
      ctx.clearRect(0, 0, W, H);
      let alive = false;
      for (const p of ps) {
        p.x += p.vx; p.y += p.vy; p.vy += .32; p.vx *= .99; p.rot += p.vr; p.l -= .011;
        if (p.l > 0 && p.y < H + 30) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = Math.min(1, p.l * 2);
          ctx.translate(p.x, p.y); ctx.rotate(p.rot);
          ctx.fillStyle = p.c;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      }
      if (alive) requestAnimationFrame(anim); else if (cv.remove) cv.remove();
    })();
  };

  /* ── Ecrã Final Nivel Poki + Sorteio de Cromo Colecionável ─────────────── */
  OC.end = function (opts = {}) {
    const title = opts.title || (opts.win ? 'Vitória Espacial!' : 'Fim da Partida!');
    const text = opts.text || opts.msg || (opts.score !== undefined ? `Pontuação final: ${opts.score}` : '');
    const retry = opts.retry || opts.onRetry;
    let stars = Math.max(1, Math.min(30, Math.floor(opts.stars || 1)));
    const total = OC.addStars(stars);
    // 55% chance to win a collectible card at the end of any match!
    const wonCard = Math.random() < 0.55 ? OC.unlockCard() : null;
    const tier = stars >= 3 ? 3 : stars >= 2 ? 2 : 1;
    const w = document.createElement('div');
    w.className = 'oc-end-wrap';
    w.innerHTML = `
      <div class="oc-end-card">
        <div class="oc-end-stars">
          <span class="s ${tier >= 1 ? 'lit' : ''}" style="animation-delay:.08s">⭐</span>
          <span class="s big ${tier >= 2 ? 'lit' : ''}" style="animation-delay:.22s">⭐</span>
          <span class="s ${tier >= 3 ? 'lit' : ''}" style="animation-delay:.36s">⭐</span>
        </div>
        <h2>${title}</h2>
        <p class="oc-end-txt">${text}</p>
        <div class="oc-end-pill">+<b id="oc-cnt">0</b> ⭐ ganhas · Total <b>${total}</b> ⭐</div>
        ${wonCard ? `<div style="margin:10px auto 4px;padding:8px 14px;border-radius:16px;background:rgba(255,133,162,.18);border:1px solid #ff85a2;font-weight:900;font-size:.88rem;color:#fff">🃏 Cromo Ganho: ${wonCard.emo} ${wonCard.name} (${wonCard.rarity})</div>` : ''}
        <div class="oc-end-rank">${OC.rank(total)}</div>
        <button class="oc-end-btn" id="ocr">🔁 Jogar Outra Vez</button>
        <div class="oc-end-Hint">Carrega em <b>Espaço</b> ou <b>Enter</b> para repetir</div>
        <a class="oc-end-link" target="_top" href="../../../index.html#sobre">📖 Descobre o livro das Ovelhas Coloridas →</a>
      </div>`;
    document.body.appendChild(w);
    OC.sfx.win();
    OC.confetti(w);
    let cur = 0; const cntEl = w.querySelector('#oc-cnt');
    const iv = setInterval(() => {
      cur++; if (cntEl) cntEl.textContent = cur;
      if (cur >= stars) clearInterval(iv);
    }, Math.max(25, Math.min(90, Math.floor(500 / stars))));

    const doRetry = () => {
      window.removeEventListener('keydown', onKey);
      OC.sfx.click();
      if (w.remove) w.remove();
      retry && retry();
    };
    const onKey = e => {
      if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); doRetry(); }
    };
    setTimeout(() => window.addEventListener('keydown', onKey), 250);
    const ocrBtn = w.querySelector('#ocr');
    if (ocrBtn) ocrBtn.onclick = doRetry;
  };

  /* ── Baú / Cromo Surpresa Flutuante durante os Jogos (Retenção Contínua) */
  setInterval(() => {
    if (typeof document === 'undefined' || document.hidden) return;
    if (document.querySelector('.oc-chest-drop')) return;
    const ch = document.createElement('button');
    ch.className = 'oc-chest-drop';
    ch.innerHTML = '🎁✨';
    ch.title = 'Toca para abrir o Presente Cósmico!';
    ch.style.top = (18 + Math.random() * 55) + '%';
    ch.onclick = (e) => {
      e.stopPropagation();
      OC.sfx.win();
      OC.unlockCard();
      OC.recordMissionProgress('drop', 1);
      if (ch.remove) ch.remove();
    };
    document.body.appendChild(ch);
    setTimeout(() => { if (ch.remove) ch.remove(); }, 11000);
  }, 45000);

  /* ── Canvas Fullscreen Responsivo (`OC.canvas`) & Moldura Fixa (`OC.fit`) */
  function patchCtx(ctx) {
    const origDrawImage = ctx.drawImage ? ctx.drawImage.bind(ctx) : () => {};
    ctx.drawImage = function (img, ...args) {
      if (!img || (img.tagName === 'IMG' && (!img.complete || !img.naturalWidth))) return;
      try { return origDrawImage(img, ...args); } catch (e) {}
    };
    if (!ctx.roundRect) {
      ctx.roundRect = function (x, y, w, h, r) {
        r = Math.min(r || 8, w / 2, h / 2);
        this.moveTo(x + r, y);
        this.arcTo(x + w, y, x + w, y + h, r);
        this.arcTo(x + w, y + h, x, y + h, r);
        this.arcTo(x, y + h, x, y, r);
        this.arcTo(x, y, x + w, y, r);
        this.closePath();
      };
    }
    return ctx;
  }

  OC.canvas = function (id = 'c') {
    const c = document.getElementById(id) || document.querySelector('canvas');
    const ctx = patchCtx(c.getContext('2d'));
    const resize = () => {
      c.width = window.innerWidth || 800;
      c.height = window.innerHeight || 600;
    };
    resize();
    window.addEventListener('resize', resize);
    return { c, ctx };
  };

  OC.fit = function (cv, W, H) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    const ctx = patchCtx(cv.getContext('2d'));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    cv.style.cssText += ';position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);touch-action:none;border-radius:18px;box-shadow:0 16px 50px rgba(0,0,0,.65),0 0 0 1px rgba(255,255,255,.12)';
    const r = () => {
      const pad = Math.min(innerWidth, innerHeight) > 520 ? 12 : 0;
      const s = Math.min((innerWidth - pad) / W, (innerHeight - pad) / H);
      cv.style.width = Math.round(W * s) + 'px';
      cv.style.height = Math.round(H * s) + 'px';
    };
    r(); addEventListener('resize', r);
    return e => {
      const b = cv.getBoundingClientRect();
      return { x: (e.clientX - b.left) / b.width * W, y: (e.clientY - b.top) / b.height * H };
    };
  };

  /* ── Injeção de CSS Poki-Grade + Controlos Rápidos ─────────────────────── */
  const st = document.createElement('style');
  st.textContent = `
    *{box-sizing:border-box;margin:0;padding:0;user-select:none;-webkit-tap-highlight-color:transparent}
    html,body{width:100%;height:100%;overflow:hidden;background:radial-gradient(circle at 50% 20%,#1b1648,#070a1e 80%);font-family:Nunito,sans-serif;color:#f0edff;touch-action:none}
    .hide{display:none!important}
    .btn{padding:13px 32px;border:0;border-radius:99px;font:700 1.15rem Fredoka,sans-serif;background:linear-gradient(135deg,#ffd166,#ff85a2 55%,#ff6b35);color:#1a0a00;cursor:pointer;box-shadow:0 8px 24px #ff6b3566,inset 0 2px 0 #fff8;transition:transform .16s cubic-bezier(.34,1.56,.64,1),box-shadow .16s}
    .btn:hover{transform:translateY(-2px) scale(1.04);box-shadow:0 12px 30px #ff85a288,inset 0 2px 0 #fffb}
    .btn:active{transform:scale(.95)}
    .hud{position:absolute;left:12px;right:12px;top:10px;display:flex;justify-content:space-between;align-items:center;gap:8px;padding:0;font:700 1.08rem Fredoka,sans-serif;pointer-events:none;z-index:5}
    .hud>span:not(:empty),.hud>.pill{padding:6px 14px;border-radius:99px;background:rgba(15,21,56,.78);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.16);box-shadow:0 4px 14px rgba(0,0,0,.35);text-shadow:0 2px 4px #0009}
    .ov{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;text-align:center;padding:24px;background:radial-gradient(circle at 50% 30%,rgba(28,22,78,.86),rgba(6,8,24,.92));backdrop-filter:blur(10px);z-index:10;animation:ocFade .25s ease-out}
    .ov .card{max-width:460px;display:flex;flex-direction:column;align-items:center;gap:10px;padding:28px 24px;border-radius:28px;background:rgba(20,16,58,.75);border:1px solid rgba(255,255,255,.16);box-shadow:0 20px 60px rgba(0,0,0,.55)}
    .ov h1,.ov h2{font:700 clamp(2rem,5vw,2.6rem) Fredoka,sans-serif;background:linear-gradient(135deg,#fff,#ffd166,#ff85a2);-webkit-background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 4px 12px rgba(0,0,0,.5))}
    .ov p{font-weight:700;color:#e0dcf8;max-width:430px;line-height:1.5;font-size:1.02rem;background:rgba(255,255,255,.06);padding:14px 18px;border-radius:20px;border:1px solid rgba(255,255,255,.1)}
    .kbs{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin-top:4px;font-size:.86rem;color:#c9c6e8}
    .kb{padding:3px 9px;border-radius:8px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.22);color:#ffd166;font-weight:800}
    @keyframes ocFade{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:none}}
    .oc-toast{position:fixed;left:50%;top:16px;transform:translate(-50%,-80px);padding:10px 20px;border-radius:99px;background:linear-gradient(135deg,#ffd166,#ff85a2);color:#1a0a00;font:700 1rem Fredoka,sans-serif;box-shadow:0 10px 30px #0009;z-index:10001;transition:transform .3s cubic-bezier(.34,1.56,.64,1);pointer-events:none}
    .oc-toast.on{transform:translate(-50%,0)}
    .oc-chest-drop{position:fixed;left:-70px;z-index:9990;width:58px;height:58px;border-radius:50%;border:2px solid #fff;background: radial-gradient(circle,#ffd166,#ff85a2);font-size:1.7rem;cursor:pointer;box-shadow:0 0 24px #ffd166;animation:ocChestFly 11s linear forwards}
    @keyframes ocChestFly{0%{left:-70px;transform:translateY(0) rotate(-10deg)}50%{transform:translateY(-28px) rotate(12deg)}100%{left:105vw;transform:translateY(10px) rotate(-10deg)}}
    .oc-end-wrap{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(5,7,25,.82);backdrop-filter:blur(10px);padding:14px;font-family:Nunito,sans-serif;animation:ocFade .25s ease-out}
    .oc-end-card{max-width:400px;width:100%;text-align:center;padding:28px 24px;border-radius:32px;background:linear-gradient(155deg,#192158,#2d1b63 60%,#16133a);border:2px solid rgba(255,255,255,.22);color:#f0edff;box-shadow:0 24px 70px #000c,inset 0 2px 0 rgba(255,255,255,.2)}
    .oc-end-stars{display:flex;justify-content:center;align-items:flex-end;gap:10px;margin-bottom:8px;height:68px}
    .oc-end-stars .s{font-size:42px; filter:grayscale(1) opacity(.3);transform:scale(.5);animation:ocStarPop .45s cubic-bezier(.34,1.56,.64,1) forwards}
    .oc-end-stars .s.big{font-size:56px}
    .oc-end-stars .s.lit{filter:drop-shadow(0 6px 14px #ffd166aa)}
    @keyframes ocStarPop{to{transform:scale(1)}}
    .oc-end-card h2{font:700 2rem Fredoka,sans-serif;color:#ffd166;text-shadow:0 3px 10px #0008}
    .oc-end-txt{margin:8px 0 14px;font-weight:700;color:#d8d5f0;line-height:1.45}
    .oc-end-pill{display:inline-block;padding:8px 18px;border-radius:99px;background:#ffd16622;border:1px solid #ffd16688;color:#ffd166;font-weight:900;font-size:1rem}
    .oc-end-rank{margin:8px 0 16px;color:#00f5d4;font-weight:900;font-size:.95rem}
    .oc-end-btn{width:100%;padding:14px;border:0;border-radius:99px;font:700 1.15rem Fredoka,sans-serif;background:linear-gradient(135deg,#ffd166,#ff85a2 60%,#ff6b35);color:#1a0a00;cursor:pointer;box-shadow:0 8px 24px #ff6b3566;transition:transform .15s}
    .oc-end-btn:hover{transform:scale(1.03)}
    .oc-end-Hint{margin-top:8px;font-size:.78rem;color:#c9c6e8;opacity:.75;font-weight:700}
    .oc-end-link{display:block;margin-top:14px;color:#ff85a2;font-weight:800;text-decoration:none;font-size:.92rem}
  `;
  document.head.appendChild(st);
  const f = document.createElement('link');
  f.rel = 'stylesheet';
  f.href = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;700&family=Nunito:wght@700;900&display=swap';
  document.head.appendChild(f);

  /* Arranca BGM e regista progresso diário no primeiro toque/clique/tecla */
  let sessionRecorded = false;
  const bootAudio = () => {
    ensureAC();
    startBGM();
    if (!sessionRecorded && typeof location !== 'undefined') {
      sessionRecorded = true;
      const m = location.pathname.match(/games\/([^/]+)/);
      if (m) OC.recordMissionProgress('game', m[1]);
    }
    document.querySelectorAll('.btn').forEach(b => {
      if (!b.dataset.ocBound) {
        b.dataset.ocBound = '1';
        b.addEventListener('pointerdown', () => OC.sfx.click(), { passive: true });
      }
    });
  };
  addEventListener('pointerdown', () => { try { window.focus(); } catch (e) {} bootAudio(); }, { passive: true });
  addEventListener('keydown', bootAudio, { passive: true });
})();
