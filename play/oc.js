/* ═══════════════════════════════════════════════════════════════════════════
   Ovelhas Play — Motor de Jogo Partilhado v4.0 (oc.js)
   HiDPI Canvas · 5 Dificuldades · Campanha de 100 Níveis por Jogo ·
   Árvore de Talentos Permanentes · Poderes Ativos (Lã Temporal & Escudo) ·
   Cosméticos Globais (Trilhos, Nebulosas & Música) · Desafio Diário 2x ⭐
   Todo o código, sons e gráficos procedurais são 100% originais.
   ═══════════════════════════════════════════════════════════════════════════ */
  (function () {
    const OC = (window.OC = {});
    const memStore = {};
    const get = (k, d) => {
      try {
        const v = localStorage.getItem(k);
        if (v === null) return memStore[k] !== undefined ? memStore[k] : d;
        const parsed = JSON.parse(v);
        return parsed === null || parsed === undefined ? d : parsed;
      } catch (e) {
        return memStore[k] !== undefined ? memStore[k] : d;
      }
    };
    const set = (k, v) => {
      memStore[k] = v;
      try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { }
    };
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
    { id: 'c18', name: 'Coroa do Rei da Colina', rarity: 'Lendário', emo: '👑', img: 'ovelha-arcoiris' },
    { id: 'c19', name: 'Farol da Nebulosa Escura', rarity: 'Raro', emo: '🔦', img: 'ovelha-azul' },
    { id: 'c20', name: 'Prancha do Cometa Dourado', rarity: 'Épico', emo: '🏄', img: 'ovelha-arcoiris' },
    { id: 'c21', name: 'Tear das Sete Estrelas', rarity: 'Épico', emo: '🕸️', img: 'ovelha-melancia' },
    { id: 'c22', name: 'Troféu do Golfe Lunar', rarity: 'Raro', emo: '⛳', img: 'ovelha-verde' },
    { id: 'c23', name: 'Orbe da Sinfonia Galáctica', rarity: 'Lendário', emo: '🎼', img: 'ovelha-roxa' },
    { id: 'c24', name: 'Trono do Planeta Amendoim', rarity: 'Lendário', emo: '🥜', img: 'elefante-amendoim' }
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
      try { parent !== window && parent.postMessage({ op: 'cards', owned }, '*'); } catch (e) { }
      return card;
    };

  /* ── 5 Níveis de Dificuldade Oficiais & 5 Mundos (100 Níveis por Jogo) ─── */
  OC.DIFFICULTIES = [
    { id: 0, key: 'facil', name: 'Cordeirinho', sub: 'Iniciante · Mais Tempo & Escudo', emo: '🌱', col: '#06d6a0', speedMul: 0.78, scoreMul: 1.00, starBonus: 0, shieldBonus: 1 },
    { id: 1, key: 'normal', name: 'Pastor Estelar', sub: 'Normal · Equilíbrio Clássico', emo: '🐑', col: '#4cc9f0', speedMul: 1.00, scoreMul: 1.35, starBonus: 1, shieldBonus: 0 },
    { id: 2, key: 'dificil', name: 'Comandante', sub: 'Difícil · Ritmo Acelerado (1.8x pts)', emo: '🚀', col: '#ffd166', speedMul: 1.24, scoreMul: 1.80, starBonus: 2, shieldBonus: 0 },
    { id: 3, key: 'mestre', name: 'Mestre da Nebulosa', sub: 'Especialista · Alta Velocidade (2.5x pts)', emo: '👑', col: '#ff85a2', speedMul: 1.48, scoreMul: 2.50, starBonus: 4, shieldBonus: 0 },
    { id: 4, key: 'lenda', name: 'Lenda do Universo', sub: 'Insano · 3.5x Pontos & Cromo Garantido!', emo: '🌌', col: '#9b5de5', speedMul: 1.75, scoreMul: 3.50, starBonus: 7, shieldBonus: 0 }
  ];

  OC.WORLDS = [
    { id: 1, name: 'Mundo 1: Prado das Estrelas', emo: '🌱', col: '#06d6a0', range: [1, 20] },
    { id: 2, name: 'Mundo 2: Cintura de Amendoim', emo: '🥜', col: '#ffd166', range: [21, 40] },
    { id: 3, name: 'Mundo 3: Nebulosa de Cristal', emo: '💎', col: '#4cc9f0', range: [41, 60] },
    { id: 4, name: 'Mundo 4: Vórtice Arco-Íris', emo: '🌈', col: '#ff85a2', range: [61, 80] },
    { id: 5, name: 'Mundo 5: Coração do Universo', emo: '👑', col: '#9b5de5', range: [81, 100] }
  ];

  OC.TALENT_DEFS = [
    { id: 'shield', name: 'Escudo de Lã Dourada', emo: '🛡️', desc: 'Dá cargas de Escudo que salvam da derrota e permitem continuar a partida.', baseCost: 8 },
    { id: 'slow', name: 'Lã Temporal (Câmara Lenta)', emo: '⏳', desc: 'Aumenta a duração e reduz a recarga do poder de abrandar o tempo [Tecla Shift].', baseCost: 10 },
    { id: 'magnet', name: 'Íman de Estrelas', emo: '🧲', desc: 'Multiplica todos os pontos (+20%/nv) e estrelas ganhas em cada nível.', baseCost: 12 },
    { id: 'luck', name: 'Benção do Rebanho', emo: '🍀', desc: 'Começa cada nível com bónus de pontos e aumenta a sorte de Cromos Raros/Lendários.', baseCost: 10 }
  ];

  OC.fmt = n => String(Math.floor(n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f');
  OC.fmtTime = sec => {
    sec = Math.max(0, Math.floor(sec || 0));
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    return h > 0 ? `${h}h ${m}m` : m > 0 ? `${m}m ${s}s` : `${s}s`;
  };
  OC.gameId = () => {
    const m = (typeof location !== 'undefined' && location.pathname || '').match(/games\/([^/]+)/);
    return m ? m[1] : 'game';
  };

  /* ── Gestão de Campanha & Progresso por Jogo (`OC.campaign`) ───────────── */
  OC.getCampaign = (gid = OC.gameId()) => {
    const def = {
      diff: 1, // Pastor Estelar (Normal) por omissão
      cur: 1,
      unlocked: 1,
      stars: {},
      wins: 0,
      timeSec: 0,
      talents: { shield: 1, slow: 1, magnet: 0, luck: 0 }
    };
    const raw = get('op_camp_' + gid, null);
    if (!raw || typeof raw !== 'object') return def;
    return {
      diff: typeof raw.diff === 'number' ? Math.max(0, Math.min(4, raw.diff)) : 1,
      cur: Math.max(1, Math.min(100, raw.cur || 1)),
      unlocked: Math.max(1, Math.min(100, raw.unlocked || 1)),
      stars: raw.stars || {},
      wins: raw.wins || 0,
      timeSec: raw.timeSec || 0,
      talents: { ...def.talents, ...(raw.talents || {}) }
    };
  };
  OC.saveCampaign = (data, gid = OC.gameId()) => {
    set('op_camp_' + gid, data);
    try { parent !== window && parent.postMessage({ op: 'camp', id: gid, data }, '*'); } catch (e) {}
    return data;
  };
  OC.worldForLevel = (lv = 1) => OC.WORLDS[Math.min(4, Math.floor((Math.max(1, lv) - 1) / 20))];
  OC.isBossLevel = (lv = 1) => lv % 5 === 0;
  OC.levelTargetScore = (lv = 1, diffId = 1) => {
    const d = OC.DIFFICULTIES[diffId] || OC.DIFFICULTIES[1];
    const base = 80 + (lv - 1) * 35 + Math.floor((lv - 1) / 5) * 60;
    return Math.round(base * (0.85 + d.id * 0.2));
  };

  /* Estado dinâmico da sessão atual */
  let campState = OC.getCampaign();
  let shieldCharges = 1;
  let slowActive = 0, slowCooldown = 0;

  function resetSessionPowers() {
    campState = OC.getCampaign();
    const d = OC.DIFFICULTIES[campState.diff] || OC.DIFFICULTIES[1];
    const shLv = (campState.talents && campState.talents.shield) || 1;
    shieldCharges = Math.floor((shLv + 1) / 2) + (d.shieldBonus || 0);
    slowActive = 0;
    slowCooldown = 0;
    updateCampaignBarUI();
  }

  OC.diff = {
    get id() { return campState.diff; },
    get info() { return OC.DIFFICULTIES[campState.diff] || OC.DIFFICULTIES[1]; },
    get level() { return campState.cur; },
    get world() { return OC.worldForLevel(campState.cur); },
    get isBoss() { return OC.isBossLevel(campState.cur); },
    get speedMul() {
      const d = OC.DIFFICULTIES[campState.diff] || OC.DIFFICULTIES[1];
      const lvScale = 1 + Math.min(0.45, (campState.cur - 1) * 0.0045);
      return d.speedMul * lvScale;
    },
    get mult() {
      return this.speedMul;
    },
    get scoreMul() {
      const d = OC.DIFFICULTIES[campState.diff] || OC.DIFFICULTIES[1];
      const magLv = (campState.talents && campState.talents.magnet) || 0;
      const lvBonus = 1 + (campState.cur - 1) * 0.02;
      return d.scoreMul * (1 + magLv * 0.20) * lvBonus;
    },
    get shieldCharges() { return shieldCharges; }
  };

  OC.effectiveTimeScale = () => {
    if (slowActive > 0) return 0.42;
    return OC.diff.speedMul;
  };

  OC.triggerSlowMo = () => {
    if (!OC.started || OC.paused || slowActive > 0 || slowCooldown > 0) return false;
    const slowLv = (campState.talents && campState.talents.slow) || 1;
    slowActive = 3.2 + slowLv * 0.55;
    slowCooldown = Math.max(8, 16 - slowLv * 0.8);
    OC.sfx.tone(620, 0.35, 'sine', 0.14, 0, 240);
    OC.toast(`⏳ Lã Temporal Ativada (${slowActive.toFixed(1)}s)!`);
    updateCampaignBarUI();
    return true;
  };

  /* ── Missões Diárias, Jogo Desafio do Dia (2x ⭐) & Cosméticos Globais ─── */
  const ALL_GAME_IDS = [
    'herois-nebulosa','incubadora-cosmica','expedicao-amendoim','horta-lunar','alquimia-estelar','defesa-gravidade','odisseia-submarina','corrida-carrilhao','la-infinita','sinfonia-cosmica','torre-relogio','fabrica-cores','salto-cosmico','surfa-cometas','pato-foguete','nuvem-pula','pinball-la','tear-constelacoes','tiro-cores','arco-iris','cobra-la','corrida-rebanho','rei-colina','duelo-pastores','ovelhas-match','fusao-zoo','torre-la','quatro-em-linha','saida-estabulo','tecelao-gravidade','rebanho-tatico','ordena-rebanho','pastor-estrelas','labirinto-lanterna','pares-cosmicos','eco-estrelas','quem-fugiu','contas-cosmicas','sopa-letras','banda-ovelhas','coro-ovelhas','golfe-lunar'
  ];
  OC.dailyGameId = () => {
    const s = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const n = parseInt(s, 10) || 20261108;
    return ALL_GAME_IDS[(n * 17) % ALL_GAME_IDS.length];
  };
  OC.isDailyGame = (gid = OC.gameId()) => gid === OC.dailyGameId();
  OC.getCosmetics = () => get('op_cosmetics', {
    trail: 'rainbow',
    nebula: 'royal',
    bgmStyle: 'space',
    owned: ['trail_rainbow', 'nebula_royal', 'bgm_space']
  });

  OC.todayKey = () => new Date().toISOString().slice(0, 10);
  OC.checkDaily = () => {
    const today = OC.todayKey();
    const st = get('op_daily', { lastDate: '', streak: 0, claimed: false, gamesPlayed: [], starsToday: 0, dropsToday: 0, levelsClearedToday: 0 });
    if (st.lastDate !== today) {
      const yest = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      st.streak = (st.lastDate === yest) ? (st.streak + 1) : 1;
      st.lastDate = today;
      st.claimed = false;
      st.gamesPlayed = [];
      st.starsToday = 0;
      st.dropsToday = 0;
      st.levelsClearedToday = 0;
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
      }
    }
    if (type === 'level') {
      st.levelsClearedToday = (st.levelsClearedToday || 0) + 1;
      if (st.levelsClearedToday === 5) {
        OC.addStars(15);
        OC.toast('🏆 Missão Diária: 5 Níveis de Campanha Vencidos! (+15⭐)');
      }
    }
    set('op_daily', st);
  };

  /* ── Estrelas, Recordes e Patentes ─────────────────────────────────────── */
  OC.stars = () => {
    const s = Number(get('op_stars', 0));
    return Number.isFinite(s) && s >= 0 ? Math.floor(s) : 0;
  };
  OC.addStars = n => {
    n = Number(n);
    if (!Number.isFinite(n) || n <= 0) return OC.stars();
    n = Math.floor(n);
    const oldR = OC.rank(OC.stars());
    const t = OC.stars() + n;
    set('op_stars', t);
    OC.recordMissionProgress('stars', n);
    const newR = OC.rank(t);
    if (newR !== oldR) setTimeout(() => OC.toast('🎖️ Nova Patente: ' + newR + '!'), 350);
    try { parent !== window && parent.postMessage({ op: 'stars', total: t }, '*'); } catch (e) {}
    return t;
  };
  OC.spendStars = n => {
    n = Number(n);
    if (!Number.isFinite(n) || n < 0) return false;
    n = Math.floor(n);
    const cur = OC.stars();
    if (cur < n) return false;
    const t = cur - n;
    set('op_stars', t);
    try { parent !== window && parent.postMessage({ op: 'stars', total: t }, '*'); } catch (e) {}
    return true;
  };
  OC.best = (id, v) => {
    const k = 'op_best_' + id;
    const rawB = Number(get(k, 0));
    const b = Number.isFinite(rawB) && rawB >= 0 ? Math.floor(rawB) : 0;
    if (v !== undefined && Number.isFinite(Number(v))) {
      const nv = Math.max(0, Math.floor(Number(v)));
      if (nv > b) {
        set(k, nv);
        OC.unlock('rec_' + id, '🏆 Novo Recorde!');
        const qb = typeof document !== 'undefined' && document.getElementById('oc-qbest');
        if (qb) { qb.hidden = false; qb.textContent = '🏆 ' + OC.fmt(nv); }
        try { parent !== window && parent.postMessage({ op: 'best', id, best: nv }, '*'); } catch (e) {}
        return nv;
      }
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
    [1000, '💎 Guardião Supremo do Universo'],
    [2500, '🪐 Imperador Galáctico de Lã'],
    [5000, '✨ Divindade Cósmica Arco-Íris']
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
          try {
            const comp = ac.createDynamicsCompressor();
            comp.threshold.value = -16; comp.knee.value = 18; comp.ratio.value = 4;
            comp.attack.value = 0.004; comp.release.value = 0.2;
            masterGain.connect(comp); comp.connect(ac.destination);
          } catch (e) { masterGain.connect(ac.destination); }
        }
      }
      if (ac && ac.state === 'suspended') ac.resume();
    } catch (e) { }
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
      } catch (e) { }
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
    whoosh: () => OC.tone(900, .22, 'sine', .05, 0, 180),
    levelUp: () => {
      [392, 523.25, 659.25, 783.99].forEach((f, i) => OC.tone(f, .16, 'square', .05, i * .07));
      OC.tone(1046.5, .35, 'triangle', .1, .3);
    },
    combo: (n = 1) => OC.tone(440 * Math.pow(1.0595, Math.min(24, n * 2)), .12, 'triangle', .11),
    tone: (f, d, t, v, dl, sl) => OC.tone(f, d, t, v, dl, sl)
  };
  OC.vibrate = (ms = 20) => { try { if (!OC.muted && navigator.vibrate) navigator.vibrate(ms); } catch (e) {} };

  const SCALE = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
  let bgmStep = 0;
  function startBGM() {
    if (bgmTimer) return;
    bgmTimer = setInterval(() => {
      if (OC.muted || !OC.bgmOn || document.hidden || OC.paused) return;
      if (typeof location !== 'undefined' && /banda-ovelhas|eco-estrelas|simon-ovelhas|sinfonia-cosmica|coro-ovelhas/.test(location.pathname)) return;
      const cos = OC.getCosmetics();
      const style = cos.bgmStyle || 'space';
      const n = SCALE[(bgmStep * 3 + Math.floor(bgmStep / 4)) % SCALE.length];
      if (style === 'retro') {
        OC.tone(n * 1.25, .22, 'square', .016, 0);
        if (bgmStep % 2 === 0) OC.tone(n * 0.5, .28, 'triangle', .018, 0);
      } else if (style === 'lullaby') {
        OC.tone(n * 1.5, .55, 'sine', .02, 0);
        if (bgmStep % 3 === 0) OC.tone(n, .65, 'sine', .015, 0);
      } else if (style === 'harp') {
        OC.tone(n, .38, 'triangle', .024, 0, n * 1.02);
        if (bgmStep % 4 === 0) OC.tone(n * 0.75, .6, 'sine', .018, 0);
      } else {
        OC.tone(n, .42, 'sine', .022, 0);
        if (bgmStep % 4 === 0) OC.tone(n * 0.5, .75, 'triangle', .018, 0);
      }
      bgmStep++;
    }, 480);
  }
  OC.music = { start: () => { ensureAC(); startBGM(); } };

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
    if (e.data.op === 'openCamp') OC.openCampaignModal();
  });

  /* ── Sistema de Partículas, Estrelas e Efeitos (`OC.fx`) ───────────────── */
  const fxParts = [], fxTexts = [], bgStars = [];
  let fxShake = 0, lastTrailT = 0;
  const NEBULA_PALETTES = {
    royal: ['#1f1854', '#080a20'],
    emerald: ['#0f3d3e', '#05141c'],
    ocean: ['#102a56', '#050c1e'],
    sunset: ['#3e1948', '#14081e'],
    gold: ['#38280e', '#0e0a04']
  };
  const TRAIL_PALETTES = {
    rainbow: ['#ff85a2', '#ffd166', '#06d6a0', '#4cc9f0', '#9b5de5'],
    gold: ['#ffd166', '#ffb703', '#fff3b0'],
    ice: ['#00f5d4', '#4cc9f0', '#caf0f8'],
    fire: ['#ff595e', '#ff9f1c', '#ffd166'],
    neon: ['#f72585', '#7209b7', '#4cc9f0']
  };
  for (let i = 0; i < 85; i++) {
    bgStars.push({ rx: Math.random(), ry: Math.random(), r: 0.7 + Math.random() * 1.8, ph: Math.random() * 6.28 });
  }
  addEventListener('pointermove', e => {
    const now = performance.now();
    if (now - lastTrailT < 36) return;
    lastTrailT = now;
    const cos = OC.getCosmetics();
    const cols = TRAIL_PALETTES[cos.trail] || TRAIL_PALETTES.rainbow;
    const col = cols[Math.floor(Math.random() * cols.length)];
    fxParts.push({
      x: e.clientX, y: e.clientY,
      vx: (Math.random() - 0.5) * 35, vy: (Math.random() - 0.5) * 35,
      col, r: 2 + Math.random() * 2.5, l: 0.35
    });
  }, { passive: true });

  OC.fx = {
    drawStars: (ctx, W, H, now = 0) => {
      ctx.save();
      const cos = OC.getCosmetics();
      const pal = NEBULA_PALETTES[cos.nebula] || NEBULA_PALETTES.royal;
      const wCol = OC.diff.world ? OC.diff.world.col : pal[0];
      const g = ctx.createRadialGradient(W * 0.5, H * 0.25, 20, W * 0.5, H * 0.5, Math.max(W, H) * 0.85);
      g.addColorStop(0, slowActive > 0 ? '#123b52' : pal[0]);
      g.addColorStop(1, pal[1]);
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
      if (slowActive > 0) {
        ctx.strokeStyle = 'rgba(0,245,212,0.35)';
        ctx.lineWidth = 6;
        ctx.strokeRect(3, 3, W - 6, H - 6);
      } else if (OC.diff.isBoss) {
        ctx.strokeStyle = wCol + '33';
        ctx.lineWidth = 4;
        ctx.strokeRect(2, 2, W - 4, H - 4);
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
      if (OC.reducedMotion) amt *= 0.25;
      fxShake = Math.max(fxShake, amt);
    },
    offset: () => fxShake > 0.2 ? [(Math.random() - 0.5) * fxShake, (Math.random() - 0.5) * fxShake] : [0, 0],
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
    if (!document.body) return;
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
        if (alive) origRAF(anim); else if (cv.remove) cv.remove();
      })();
    };

  /* ── Ecrã Final com Progressão de Campanha (100 Níveis), Escudo & Dificuldade */
  OC.end = function (opts = {}) {
    const existing = document.querySelector('.oc-end-wrap');
    if (existing) existing.remove();

    const gid = opts.id || OC.gameId();
    campState = OC.getCampaign(gid);
    const dInfo = OC.DIFFICULTIES[campState.diff] || OC.DIFFICULTIES[1];
    const luckLv = (campState.talents && campState.talents.luck) || 0;
    const magLv = (campState.talents && campState.talents.magnet) || 0;

    // Pontuação amplificada pela Dificuldade, Nível de Campanha e Talento Íman/Sorte
    const rawScore = typeof opts.score === 'number' ? opts.score : (opts.win ? 150 : 60);
    const luckStartBonus = luckLv * 25;
    const finalScore = Math.round((rawScore + luckStartBonus) * OC.diff.scoreMul);

    const prevBest = gid ? OC.best(gid) : 0;
    const isNewBest = (finalScore > prevBest && gid);
    if (gid) OC.best(gid, finalScore);
    const bestNow = gid ? OC.best(gid) : finalScore;

    const targetScore = OC.levelTargetScore(campState.cur, campState.diff);
    let passedLevel = opts.win !== false || finalScore >= targetScore * 0.65;

    // Cálculo de 1 a 3 estrelas do nível de campanha + Bónus 2x Jogo Desafio do Dia
    let levelStars = passedLevel ? (finalScore >= targetScore * 1.15 || (opts.stars || 0) >= 3 ? 3 : finalScore >= targetScore * 0.8 || (opts.stars || 0) >= 2 ? 2 : 1) : 1;
    const bossBonus = (passedLevel && OC.isBossLevel(campState.cur)) ? 5 : 0;
    const isDaily = OC.isDailyGame(gid);
    const dailyMult = isDaily ? 2 : 1;
    let earnedStars = Math.max(1, Math.min(90, Math.floor(((opts.stars || levelStars * 2) * (1 + magLv * 0.15) + dInfo.starBonus + bossBonus) * dailyMult)));

    const curLv = campState.cur;
    if (passedLevel) {
      const prevLvStars = campState.stars[curLv] || 0;
      if (levelStars > prevLvStars) campState.stars[curLv] = levelStars;
      if (curLv >= campState.unlocked && campState.unlocked < 100) {
        campState.unlocked = curLv + 1;
      }
      campState.wins = (campState.wins || 0) + 1;
      OC.saveCampaign(campState, gid);
      OC.recordMissionProgress('level', 1);
    }

    const total = OC.addStars(earnedStars);
    const cardChance = Math.min(1.0, 0.55 + luckLv * 0.05 + (dInfo.id === 4 && passedLevel ? 0.5 : 0) + (OC.isBossLevel(curLv) && passedLevel ? 0.45 : 0));
    const wonCard = Math.random() < cardChance ? OC.unlockCard() : null;

    const wInfo = OC.worldForLevel(curLv);
    const title = opts.title || (passedLevel ? `Nível ${curLv} Concluído!` : 'Fim da Ronda!');
    const text = opts.text || opts.msg || `Pontuação: ${OC.fmt(finalScore)}`;
    const retry = opts.retry || opts.onRetry;

    const totalCampStars = Object.values(campState.stars).reduce((a, b) => a + b, 0);
    const canAdvance = passedLevel && curLv < 100;
    const canUseShield = !passedLevel && shieldCharges > 0;

    const w = document.createElement('div');
    w.className = 'oc-end-wrap';
    w.innerHTML = `
      <div class="oc-end-card" style="max-width:440px">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;margin-bottom:6px;font-size:.78rem;font-weight:900">
          <span style="padding:4px 10px;border-radius:99px;background:${wInfo.col}26;border:1px solid ${wInfo.col};color:${wInfo.col}">${wInfo.emo} Nível ${curLv}/100 ${OC.isBossLevel(curLv) ? '⚔️ BOSS' : ''}</span>
          <span style="padding:4px 10px;border-radius:99px;background:${dInfo.col}26;border:1px solid ${dInfo.col};color:${dInfo.col}">${dInfo.emo} ${dInfo.name} (${dInfo.scoreMul.toFixed(2)}x)</span>
        </div>
        <div class="oc-end-stars">
          <span class="s ${levelStars >= 1 ? 'lit' : ''}" style="animation-delay:.08s">⭐</span>
          <span class="s big ${levelStars >= 2 ? 'lit' : ''}" style="animation-delay:.22s">⭐</span>
          <span class="s ${levelStars >= 3 ? 'lit' : ''}" style="animation-delay:.36s">⭐</span>
        </div>
        <h2>${title}</h2>
        <p class="oc-end-txt" style="margin:6px 0 10px">${text}<br><small style="color:#00f5d4">Pontuação Total (c/ Bónus ${OC.diff.scoreMul.toFixed(1)}x): <b>${OC.fmt(finalScore)} pts</b></small></p>
        ${bestNow > 0 ? `<div style="margin:0 auto 8px;font-weight:900;font-size:.88rem;color:${isNewBest ? '#00f5d4' : '#ffd166'}">${isNewBest ? '🏆 NOVO RECORDE PESSOAL: ' : '🏆 Recorde: '}${OC.fmt(bestNow)} · Campanha: ${totalCampStars}/300 ⭐</div>` : ''}
        <div class="oc-end-pill">+<b id="oc-cnt">0</b> ⭐ ganhas ${isDaily ? '(⚡ 2x Desafio do Dia!)' : ''} · Total <b>${OC.fmt(total)}</b> ⭐</div>
        ${wonCard ? `<div style="margin:8px auto 4px;padding:7px 12px;border-radius:14px;background:rgba(255,133,162,.18);border:1px solid #ff85a2;font-weight:900;font-size:.84rem;color:#fff">🃏 Cromo Ganho: ${wonCard.emo} ${wonCard.name} (${wonCard.rarity})</div>` : ''}
        <div class="oc-end-rank" style="margin:6px 0 10px">${OC.rank(total)} · ⏱ Tempo no jogo: ${OC.fmtTime(campState.timeSec)}</div>

        <div style="display:flex;flex-direction:column;gap:8px;margin-top:6px">
          ${canAdvance ? `<button class="oc-end-btn" id="oc-next-lv" style="background:linear-gradient(135deg,#06d6a0,#4cc9f0);color:#041f18">▶ Avançar para o Nível ${curLv + 1} ${OC.isBossLevel(curLv + 1) ? '⚔️ (BOSS!)' : ''}</button>` : ''}
          ${canUseShield ? `<button class="oc-end-btn" id="oc-use-shield" style="background:linear-gradient(135deg,#ffd166,#06d6a0);color:#1a0a00">🛡️ Usar Escudo de Lã (${shieldCharges}x) & Vencer Nível ${curLv}!</button>` : ''}
          <div style="display:flex;gap:8px">
            <button class="oc-end-btn" id="ocr" style="flex:1;padding:11px;font-size:1rem">🔁 ${canAdvance ? `Repetir Nv.${curLv}` : 'Jogar Outra Vez'}</button>
            <button class="oc-ghost" id="oc-open-camp" style="flex:1;padding:11px;font-size:.95rem;border-color:#ffd166;color:#ffd166">🗺️ 100 Níveis & Talentos</button>
          </div>
        </div>
        <div class="oc-end-Hint">Carrega em <b>Espaço</b> ou <b>Enter</b> para continuar</div>
      </div>`;
    document.body.appendChild(w);
    OC.sfx.win();
    OC.confetti(w);
    updateCampaignBarUI();

    let cur = 0; const cntEl = w.querySelector('#oc-cnt');
    const iv = setInterval(() => {
      cur++; if (cntEl) cntEl.textContent = cur;
      if (cur >= earnedStars) clearInterval(iv);
    }, Math.max(20, Math.min(80, Math.floor(450 / earnedStars))));

    const startRun = (advanceLevel) => {
      window.removeEventListener('keydown', onKey);
      OC.sfx.click();
      if (advanceLevel && campState.cur < 100) {
        campState.cur++;
        OC.saveCampaign(campState, gid);
      }
      resetSessionPowers();
      if (w.remove) w.remove();
      if (retry) retry(); else location.reload();
    };

    const onKey = e => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        startRun(canAdvance);
      }
    };
    setTimeout(() => window.addEventListener('keydown', onKey), 250);

    const nextBtn = w.querySelector('#oc-next-lv');
    if (nextBtn) nextBtn.onclick = () => startRun(true);
    const ocrBtn = w.querySelector('#ocr');
    if (ocrBtn) ocrBtn.onclick = () => startRun(false);
    const shBtn = w.querySelector('#oc-use-shield');
    if (shBtn) shBtn.onclick = () => {
      if (shieldCharges <= 0) return;
      shieldCharges--;
      campState.stars[curLv] = Math.max(campState.stars[curLv] || 0, 2);
      if (curLv >= campState.unlocked && campState.unlocked < 100) campState.unlocked = curLv + 1;
      campState.wins = (campState.wins || 0) + 1;
      if (campState.cur < 100) campState.cur++;
      OC.saveCampaign(campState, gid);
      OC.sfx.levelUp();
      OC.toast(`🛡️ Escudo de Lã Dourada ativado! Nível ${curLv} superado!`);
      window.removeEventListener('keydown', onKey);
      if (w.remove) w.remove();
      resetSessionPowers();
      if (retry) retry(); else location.reload();
    };
    const campBtn = w.querySelector('#oc-open-camp');
    if (campBtn) campBtn.onclick = () => {
      OC.sfx.click();
      OC.openCampaignModal(() => startRun(false));
    };
  };

  /* ── Modal de Campanha (100 Níveis), 5 Dificuldades & Árvore de Talentos ── */
  OC.openCampaignModal = function (onApply) {
    const existing = document.getElementById('oc-camp-modal');
    if (existing) existing.remove();
    const gid = OC.gameId();
    campState = OC.getCampaign(gid);
    const wasPaused = OC.paused;
    if (OC.started && !OC.paused && !document.querySelector('.oc-end-wrap')) OC.pause(true);

    let activeTab = 'levels'; // 'levels' | 'diff' | 'talents'
    let selectedWorld = Math.floor((campState.cur - 1) / 20);

    const m = document.createElement('div');
    m.id = 'oc-camp-modal';
    m.className = 'oc-camp-modal';

    function renderModal() {
      const totalCampStars = Object.values(campState.stars).reduce((a, b) => a + b, 0);
      const dInfo = OC.DIFFICULTIES[campState.diff] || OC.DIFFICULTIES[1];
      const wObj = OC.WORLDS[selectedWorld] || OC.WORLDS[0];

      let bodyHtml = '';
      if (activeTab === 'levels') {
        const [startLv, endLv] = wObj.range;
        let gridHtml = '';
        for (let lv = startLv; lv <= endLv; lv++) {
          const isUnlocked = lv <= campState.unlocked;
          const isCur = lv === campState.cur;
          const stCnt = campState.stars[lv] || 0;
          const isBoss = OC.isBossLevel(lv);
          gridHtml += `
            <button type="button" class="oc-lv-cell ${isUnlocked ? 'open' : 'locked'} ${isCur ? 'cur' : ''} ${isBoss ? 'boss' : ''}" data-lv="${lv}" ${!isUnlocked ? 'disabled' : ''}>
              <div class="n">${isBoss ? '⚔️ ' : ''}${lv}</div>
              <div class="s">${isUnlocked ? ('⭐'.repeat(stCnt) + '☆'.repeat(3 - stCnt)) : '🔒'}</div>
            </button>`;
        }
        bodyHtml = `
          <div class="oc-world-tabs">
            ${OC.WORLDS.map((w, idx) => `<button type="button" class="oc-wtab ${idx === selectedWorld ? 'on' : ''}" data-w="${idx}" style="--wc:${w.col}">${w.emo} Mundo ${idx + 1}</button>`).join('')}
          </div>
          <div style="font:700 1rem Fredoka,sans-serif;color:${wObj.col};margin:6px 0">${wObj.emo} ${wObj.name} (Níveis ${wObj.range[0]}–${wObj.range[1]})</div>
          <div class="oc-lv-grid">${gridHtml}</div>
          <div style="font-size:.8rem;color:#c9c6e8;margin-top:6px">⚔️ A cada 5 níveis enfrentas um <b>Desafio Boss da Nebulosa</b> com triplo de estrelas e alta probabilidade de Cromo Raro!</div>
        `;
      } else if (activeTab === 'diff') {
        bodyHtml = `
          <div class="oc-diff-list">
            ${OC.DIFFICULTIES.map(d => `
              <button type="button" class="oc-diff-item ${campState.diff === d.id ? 'on' : ''}" data-diff="${d.id}" style="--dc:${d.col}">
                <span class="emo">${d.emo}</span>
                <div class="txt">
                  <b>${d.name} <span style="color:${d.col}">(${d.scoreMul.toFixed(2)}x Pontos · +${d.starBonus}⭐/vitória)</span></b>
                  <small>${d.sub}</small>
                </div>
                <span class="chk">${campState.diff === d.id ? '✔ Ativo' : 'Escolher'}</span>
              </button>
            `).join('')}
          </div>
        `;
      } else {
        bodyHtml = `
          <div style="font-size:.86rem;color:#ffd166;font-weight:800;margin-bottom:8px">⭐ As tuas Estrelas Disponíveis: <b>${OC.fmt(OC.stars())} ⭐</b></div>
          <div class="oc-talent-list">
            ${OC.TALENT_DEFS.map(t => {
              const lv = (campState.talents && campState.talents[t.id]) || 0;
              const cost = t.baseCost * (lv + 1);
              const maxed = lv >= 10;
              return `
                <div class="oc-talent-item">
                  <div class="ico">${t.emo}</div>
                  <div class="info">
                    <b>${t.name} <span style="color:#00f5d4">Nv. ${lv}/10</span></b>
                    <small>${t.desc}</small>
                    <div class="bar"><i style="width:${lv * 10}%"></i></div>
                  </div>
                  <button type="button" class="oc-tbuy" data-tid="${t.id}" ${maxed || OC.stars() < cost ? 'disabled' : ''}>
                    ${maxed ? 'MÁX' : `Evoluir (${cost}⭐)`}
                  </button>
                </div>`;
            }).join('')}
          </div>
        `;
      }

      m.innerHTML = `
        <div class="oc-camp-card">
          <div class="oc-camp-head">
            <div>
              <h2>🗺️ Campanha & Maestria</h2>
              <small style="color:#c9c6e8;font-weight:800">⭐ ${totalCampStars}/300 Estrelas · 🏆 ${campState.wins} Vitórias · ⏱ ${OC.fmtTime(campState.timeSec)} jogados</small>
            </div>
            <button type="button" class="oc-qbtn" id="oc-camp-close">✕</button>
          </div>
          <div class="oc-camp-tabs">
            <button type="button" class="oc-ctab ${activeTab === 'levels' ? 'on' : ''}" data-tab="levels">🗺️ 100 Níveis (Nv.${campState.cur})</button>
            <button type="button" class="oc-ctab ${activeTab === 'diff' ? 'on' : ''}" data-tab="diff">${dInfo.emo} Dificuldade: ${dInfo.name}</button>
            <button type="button" class="oc-ctab ${activeTab === 'talents' ? 'on' : ''}" data-tab="talents">🛠️ Talentos & Poderes</button>
          </div>
          <div class="oc-camp-body">${bodyHtml}</div>
          <div class="oc-camp-foot">
            <button type="button" class="oc-end-btn" id="oc-camp-play">▶ Jogar Nível ${campState.cur} (${dInfo.emo} ${dInfo.name})</button>
          </div>
        </div>
      `;

      m.querySelector('#oc-camp-close').onclick = () => {
        OC.sfx.click();
        m.remove();
        if (!wasPaused && OC.paused && !document.querySelector('.oc-end-wrap')) OC.pause(false);
      };
      m.querySelector('#oc-camp-play').onclick = () => {
        OC.sfx.click();
        m.remove();
        resetSessionPowers();
        mountIntroDifficultySelector();
        if (!wasPaused && OC.paused && !document.querySelector('.oc-end-wrap')) OC.pause(false);
        if (onApply) onApply();
      };
      m.querySelectorAll('.oc-ctab').forEach(b => {
        b.onclick = () => { OC.sfx.click(); activeTab = b.dataset.tab; renderModal(); };
      });
      m.querySelectorAll('.oc-wtab').forEach(b => {
        b.onclick = () => { OC.sfx.click(); selectedWorld = +b.dataset.w; renderModal(); };
      });
      m.querySelectorAll('.oc-lv-cell.open').forEach(b => {
        b.onclick = () => {
          campState.cur = +b.dataset.lv;
          OC.saveCampaign(campState, gid);
          resetSessionPowers();
          OC.sfx.pop();
          renderModal();
        };
      });
      m.querySelectorAll('.oc-diff-item').forEach(b => {
        b.onclick = () => {
          campState.diff = +b.dataset.diff;
          OC.saveCampaign(campState, gid);
          resetSessionPowers();
          OC.sfx.good();
          renderModal();
        };
      });
      m.querySelectorAll('.oc-tbuy').forEach(b => {
        b.onclick = () => {
          const tid = b.dataset.tid;
          const def = OC.TALENT_DEFS.find(x => x.id === tid);
          const lv = (campState.talents && campState.talents[tid]) || 0;
          const cost = def.baseCost * (lv + 1);
          if (lv < 10 && OC.spendStars(cost)) {
            campState.talents[tid] = lv + 1;
            OC.saveCampaign(campState, gid);
            resetSessionPowers();
            OC.sfx.levelUp();
            OC.toast(`🛠️ ${def.name} evoluiu para Nível ${lv + 1}!`);
            renderModal();
          } else {
            OC.sfx.bad();
          }
        };
      });
    }

    document.body.appendChild(m);
    renderModal();
  };

  /* ── Pausa Global & Relógio Virtual com Escala de Dificuldade e Câmara Lenta */
  OC.reducedMotion = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  OC.paused = false;
  OC.started = false;
  let lastRawRAF = performance.now(), virtualNow = performance.now(), playTimerAcc = 0;
  const origRAF = window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : (fn => setTimeout(() => fn(performance.now()), 16));
  const rafQueue = [];

  window.requestAnimationFrame = function (cb) {
    return origRAF(function tick(rawNow) {
      const realDt = Math.min(0.05, Math.max(0, (rawNow - lastRawRAF) / 1000));
      lastRawRAF = rawNow;
      if (OC.paused) {
        rafQueue.push(cb);
        return;
      }
      if (OC.started && !document.hidden) {
        playTimerAcc += realDt;
        if (playTimerAcc >= 5) {
          const addS = Math.floor(playTimerAcc);
          playTimerAcc -= addS;
          campState.timeSec = (campState.timeSec || 0) + addS;
          OC.saveCampaign(campState);
        }
        if (slowActive > 0) {
          slowActive = Math.max(0, slowActive - realDt);
          if (slowActive === 0) updateCampaignBarUI();
        } else if (slowCooldown > 0) {
          slowCooldown = Math.max(0, slowCooldown - realDt);
          if (slowCooldown === 0) updateCampaignBarUI();
        }
      }
      const scale = OC.started ? OC.effectiveTimeScale() : 1;
      virtualNow += realDt * 1000 * scale;
      try { cb(virtualNow); } catch (err) { console.error('[OvelhasPlay Frame Guard]', err); }
    });
  };

  const pauseCbs = [];
  OC.onPause = cb => pauseCbs.push(cb);
  let pauseEl = null;
  OC.pause = (v = true) => {
    v = !!v;
    if (v === OC.paused) return;
    if (v && (document.querySelector('.oc-end-wrap') || !OC.started)) return;
    OC.paused = v;
    if (!v) {
      lastRawRAF = performance.now();
      const pending = rafQueue.splice(0, rafQueue.length);
      pending.forEach(fn => window.requestAnimationFrame(fn));
    }
    pauseCbs.forEach(cb => { try { cb(v); } catch (e) {} });
    const pb = document.getElementById('oc-pause-btn');
    if (pb) pb.textContent = v ? '▶' : '⏸';
    if (v) {
      const dInfo = OC.DIFFICULTIES[campState.diff] || OC.DIFFICULTIES[1];
      pauseEl = document.createElement('div');
      pauseEl.className = 'oc-pause';
      pauseEl.innerHTML = `<div class="oc-pause-card"><div class="oc-pause-ico">⏸</div><h2>Jogo em Pausa</h2>
        <div style="font-size:.85rem;color:#00f5d4;font-weight:800;margin-bottom:4px">🗺️ Nível ${campState.cur}/100 · ${dInfo.emo} ${dInfo.name}</div>
        <button class="oc-end-btn" id="oc-resume">▶ Continuar</button>
        <button class="oc-ghost" id="oc-p-camp" style="border-color:#ffd166;color:#ffd166">🗺️ Mudar Nível / Dificuldade / Talentos</button>
        <button class="oc-ghost" id="oc-restart">🔄 Recomeçar Partida</button>
        <button class="oc-ghost" id="oc-snd">${OC.muted ? '🔇 Som: Desligado' : '🔊 Som: Ligado'}</button>
        <button class="oc-ghost" id="oc-bgm">${OC.bgmOn ? '🎵 Música: Ligada' : '🎵 Música: Desligada'}</button>
        <div class="oc-end-Hint">Carrega em <b>Esc</b> ou <b>P</b> para continuar</div></div>`;
      document.body.appendChild(pauseEl);
      pauseEl.querySelector('#oc-resume').onclick = () => { OC.sfx.click(); OC.pause(false); };
      pauseEl.querySelector('#oc-p-camp').onclick = () => { OC.sfx.click(); OC.openCampaignModal(); };
      pauseEl.querySelector('#oc-restart').onclick = () => { OC.sfx.click(); location.reload(); };
      pauseEl.querySelector('#oc-snd').onclick = (e) => {
        OC.setMuted(!OC.muted);
        e.target.textContent = OC.muted ? '🔇 Som: Desligado' : '🔊 Som: Ligado';
      };
      pauseEl.querySelector('#oc-bgm').onclick = (e) => {
        OC.bgmOn = !OC.bgmOn; set('op_bgm', OC.bgmOn);
        e.target.textContent = OC.bgmOn ? '🎵 Música: Ligada' : '🎵 Música: Desligada';
      };
    } else if (pauseEl) { pauseEl.remove(); pauseEl = null; }
  };

  addEventListener('keydown', e => {
    if (e.code === 'Escape' || e.code === 'KeyP') {
      if (document.querySelector('.oc-end-wrap') || document.getElementById('oc-camp-modal')) return;
      e.preventDefault(); OC.pause(!OC.paused);
    }
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
      if (OC.started && !OC.paused) OC.triggerSlowMo();
    }
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) OC.pause(true); });
  addEventListener('message', e => { if (e.data && e.data.op === 'pause') OC.pause(e.data.v === undefined ? !OC.paused : e.data.v); });
  addEventListener('click', e => { if (e.target.closest && e.target.closest('.ov .btn, .ov button:not(.oc-diff-chip):not(.oc-camp-open-btn)')) { OC.started = true; resetSessionPowers(); } }, true);

  /* Ciclo de jogo padrão com dt escalado pela dificuldade e pausa automática */
  OC.loop = (update, draw) => {
    let last = virtualNow;
    const step = now => {
      const dt = Math.min(0.06, Math.max(0, (now - last) / 1000)); last = now;
      if (!OC.paused) update && update(dt, now);
      draw && draw(now, dt);
      window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  };

    /* ── Canvas Fullscreen Responsivo (`OC.canvas`) & Moldura Fixa (`OC.fit`) */
    function patchCtx(ctx) {
      const origDrawImage = ctx.drawImage ? ctx.drawImage.bind(ctx) : () => { };
      ctx.drawImage = function (img, ...args) {
        if (!img || (img.tagName === 'IMG' && (!img.complete || !img.naturalWidth))) return;
        try { return origDrawImage(img, ...args); } catch (e) { }
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
        c.width = Math.max(320, window.innerWidth || 800);
        c.height = Math.max(240, window.innerHeight || 600);
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
      ctx.se tTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      cv.style.cssText += ';position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);touch-action:none;border-radius:18px;box-shadow:0 16px 50px rgba(0,0,0,.65),0 0 0 1px rgba(255,255,255,.12)';
      const r = () => {
        const iw = Math.max(320, innerWidth || W), ih = Math.max(240, innerHeight || H);
        const pad = Math.min(iw, ih) > 520 ? 12 : 0;
        const s = Math.max(0.1, Math.min((iw - pad) / W, (ih - pad) / H));
        cv.style.width = Math.round(W * s) + 'px';
        cv.style.height = Math.round(H * s) + 'px';
      };
      r(); addEventListener('resize', r);
      return e => {
        const b = cv.getBoundingClientRect();
        const bw = b.width || W, bh = b.height || H;
        return { x: (e.clientX - b.left) / bw * W, y: (e.clientY - b.top) / bh * H };
      };
    };

  /* ── Injeção de CSS Partilhado + Controlos de Campanha/Dificuldade ──────── */
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
    .ov{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;text-align:center;padding:16px;background:radial-gradient(circle at 50% 30%,rgba(28,22,78,.88),rgba(6,8,24,.94));backdrop-filter:blur(10px);z-index:10;animation:ocFade .25s ease-out;overflow-y:auto}
    .ov .card{max-width:500px;display:flex;flex-direction:column;align-items:center;gap:8px;padding:22px 20px;border-radius:28px;background:rgba(20,16,58,.78);border:1px solid rgba(255,255,255,.16);box-shadow:0 20px 60px rgba(0,0,0,.55)}
    .ov h1,.ov h2{font:700 clamp(1.75rem,4.5vw,2.35rem) Fredoka,sans-serif;background:linear-gradient(135deg,#fff,#ffd166,#ff85a2);-webkit-background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 4px 12px rgba(0,0,0,.5))}
    .ov p{font-weight:700;color:#e0dcf8;max-width:450px;line-height:1.45;font-size:.96rem;background:rgba(255,255,255,.06);padding:11px 15px;border-radius:18px;border:1px solid rgba(255,255,255,.1)}
    .kbs{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin-top:2px;font-size:.82rem;color:#c9c6e8}
    .kb{padding:3px 9px;border-radius:8px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.22);color:#ffd166;font-weight:800}
    @keyframes ocFade{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:none}}
    .oc-toast{position:fixed;left:50%;top:16px;transform:translate(-50%,-80px);padding:10px 20px;border-radius:99px;background:linear-gradient(135deg,#ffd166,#ff85a2);color:#1a0a00;font:700 .96rem Fredoka,sans-serif;box-shadow:0 10px 30px #0009;z-index:10005;transition:transform .3s cubic-bezier(.34,1.56,.64,1);pointer-events:none;white-space:nowrap}
    .oc-toast.on{transform:translate(-50%,0)}
    .oc-pause{position:fixed;inset:0;z-index:9998;display:flex;align-items:center;justify-content:center;background:rgba(5,7,25,.78);backdrop-filter:blur(8px);animation:ocFade .2s ease-out;padding:14px}
    .oc-pause-card{width:100%;max-width:340px;display:flex;flex-direction:column;gap:9px;text-align:center;padding:24px 20px;border-radius:28px;background:linear-gradient(155deg,#192158,#2d1b63);border:2px solid rgba(255,255,255,.2);box-shadow:0 24px 70px #000c}
    .oc-pause-ico{font-size:2.4rem}
    .oc-pause-card h2{font:700 1.85rem Fredoka,sans-serif;color:#ffd166;margin-bottom:2px}
    .oc-ghost{width:100%;padding:10px;border-radius:99px;border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.07);color:#fff;font:700 .95rem Fredoka,sans-serif;cursor:pointer;transition:.15s}
    .oc-ghost:hover{background:rgba(255,255,255,.16)}
    @media (prefers-reduced-motion: reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important}}
    .oc-end-wrap{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(5,7,25,.84);backdrop-filter:blur(10px);padding:12px;font-family:Nunito,sans-serif;animation:ocFade .25s ease-out}
    .oc-end-card{max-width:430px;width:100%;text-align:center;padding:22px 20px;border-radius:30px;background:linear-gradient(155deg,#192158,#2d1b63 60%,#16133a);border:2px solid rgba(255,255,255,.22);color:#f0edff;box-shadow:0 24px 70px #000c,inset 0 2px 0 rgba(255,255,255,.2)}
    .oc-end-stars{display:flex;justify-content:center;align-items:flex-end;gap:10px;margin-bottom:4px;height:60px}
    .oc-end-stars .s{font-size:38px;filter:grayscale(1) opacity(.3);transform:scale(.5);animation:ocStarPop .45s cubic-bezier(.34,1.56,.64,1) forwards}
    .oc-end-stars .s.big{font-size:50px}
    .oc-end-stars .s.lit{filter:drop-shadow(0 6px 14px #ffd166aa)}
    @keyframes ocStarPop{to{transform:scale(1)}}
    .oc-end-card h2{font:700 1.85rem Fredoka,sans-serif;color:#ffd166;text-shadow:0 3px 10px #0008}
    .oc-end-txt{margin:6px 0 12px;font-weight:700;color:#d8d5f0;line-height:1.4}
    .oc-end-pill{display:inline-block;padding:6px 16px;border-radius:99px;background:#ffd16622;border:1px solid #ffd16688;color:#ffd166;font-weight:900;font-size:.95rem}
    .oc-end-rank{margin:6px 0 12px;color:#00f5d4;font-weight:900;font-size:.88rem}
    .oc-end-btn{width:100%;padding:12px;border:0;border-radius:99px;font:700 1.08rem Fredoka,sans-serif;background:linear-gradient(135deg,#ffd166,#ff85a2 60%,#ff6b35);color:#1a0a00;cursor:pointer;box-shadow:0 8px 24px #ff6b3566;transition:transform .15s}
    .oc-end-btn:hover{transform:scale(1.02)}
    .oc-end-Hint{margin-top:6px;font-size:.75rem;color:#c9c6e8;opacity:.75;font-weight:700}
    .oc-qbar{position:fixed;right:10px;bottom:8px;z-index:9000;display:flex;align-items:center;gap:5px;pointer-events:auto}
    .oc-cbar{position:fixed;left:10px;bottom:8px;z-index:9000;display:flex;align-items:center;gap:5px;pointer-events:auto}
    .oc-qpill{padding:5px 11px;border-radius:99px;background:rgba(12,16,46,.86);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.2);color:#ffd166;font:700 .78rem Fredoka,sans-serif;box-shadow:0 4px 12px rgba(0,0,0,.4);cursor:pointer;transition:.15s}
    .oc-qpill:hover{border-color:#ffd166;transform:translateY(-1px)}
    .oc-qbtn{width:34px;height:34px;border-radius:50%;border:1px solid rgba(255,255,255,.22);background:rgba(12,16,46,.86);backdrop-filter:blur(8px);color:#fff;font-size:.95rem;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,.4);transition:transform .15s,border-color .15s}
    .oc-qbtn:hover{transform:scale(1.08);border-color:#ffd166}
    .ov .oc-best-badge{margin-top:2px;padding:5px 14px;border-radius:99px;background:rgba(0,245,212,.14);border:1px solid rgba(0,245,212,.45);color:#00f5d4;font:700 .84rem Fredoka,sans-serif}
    .oc-intro-diff{display:flex;flex-direction:column;align-items:center;gap:6px;width:100%;max-width:450px;background:rgba(12,16,48,.75);border:1px solid rgba(255,255,255,.16);border-radius:18px;padding:9px 12px;margin:2px 0}
    .oc-diff-row{display:flex;flex-wrap:wrap;justify-content:center;gap:5px;width:100%}
    .oc-diff-chip{padding:5px 10px;border-radius:99px;border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.06);color:#e0dcf8;font:700 .76rem Fredoka,sans-serif;cursor:pointer;transition:.14s}
    .oc-diff-chip.on{background:var(--dc,#ffd166);color:#140800;border-color:#fff;box-shadow:0 0 12px var(--dc,#ffd166)}
    .oc-camp-open-btn{padding:5px 12px;border-radius:99px;border:1px solid #ffd16688;background:rgba(255,209,102,.15);color:#ffd166;font:700 .78rem Fredoka,sans-serif;cursor:pointer;transition:.14s}
    .oc-camp-open-btn:hover{background:#ffd166;color:#1a0a00}
    .oc-camp-modal{position:fixed;inset:0;z-index:10002;display:flex;align-items:center;justify-content:center;background:rgba(5,7,24,.86);backdrop-filter:blur(10px);padding:12px;animation:ocFade .2s ease-out}
    .oc-camp-card{width:100%;max-width:580px;max-height:92vh;display:flex;flex-direction:column;gap:10px;padding:18px;border-radius:26px;background:linear-gradient(155deg,#171e52,#261758);border:2px solid rgba(255,255,255,.22);box-shadow:0 24px 70px #000d;overflow:hidden}
    .oc-camp-head{display:flex;justify-content:space-between;align-items:center;gap:10px}
    .oc-camp-head h2{font:700 1.45rem Fredoka,sans-serif;color:#ffd166}
    .oc-camp-tabs{display:flex;gap:6px;flex-wrap:wrap}
    .oc-ctab{flex:1;min-width:130px;padding:8px 10px;border-radius:14px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.06);color:#fff;font:700 .84rem Fredoka,sans-serif;cursor:pointer}
    .oc-ctab.on{background:linear-gradient(135deg,#ffd166,#ff85a2);color:#1a0a00;border-color:#fff}
    .oc-camp-body{overflow-y:auto;padding-right:4px;max-height:56vh}
    .oc-world-tabs{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:6px}
    .oc-wtab{flex:1;padding:6px 8px;border-radius:10px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.05);color:#fff;font:700 .76rem Fredoka,sans-serif;cursor:pointer}
    .oc-wtab.on{background:var(--wc,#06d6a0);color:#061512;border-color:#fff}
    .oc-lv-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:7px}
    .oc-lv-cell{padding:8px 4px;border-radius:14px;border:2px solid rgba(255,255,255,.16);background:rgba(15,20,56,.85);color:#fff;font-family:Fredoka,sans-serif;cursor:pointer;transition:.14s;display:flex;flex-direction:column;align-items:center;gap:2px}
    .oc-lv-cell.open:hover{transform:translateY(-2px);border-color:#ffd166}
    .oc-lv-cell.cur{border-color:#00f5d4;background:rgba(0,245,212,.18);box-shadow:0 0 14px rgba(0,245,212,.35)}
    .oc-lv-cell.boss{border-color:#ff85a288;background:rgba(255,133,162,.14)}
    .oc-lv-cell.locked{opacity:.42;cursor:not-allowed}
    .oc-lv-cell .n{font-size:.92rem;font-weight:700}
    .oc-lv-cell .s{font-size:.68rem;letter-spacing:1px}
    .oc-diff-list,.oc-talent-list{display:flex;flex-direction:column;gap:8px}
    .oc-diff-item{display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:16px;border:2px solid rgba(255,255,255,.16);background:rgba(15,20,56,.8);color:#fff;text-align:left;cursor:pointer;transition:.14s}
    .oc-diff-item:hover{border-color:var(--dc,#ffd166)}
    .oc-diff-item.on{border-color:var(--dc,#ffd166);background:rgba(255,255,255,.12);box-shadow:0 0 18px rgba(255,209,102,.2)}
    .oc-diff-item .emo{font-size:1.75rem}
    .oc-diff-item .txt{flex:1}.oc-diff-item b{display:block;font:700 .95rem Fredoka,sans-serif}.oc-diff-item small{color:#c9c6e8;font-weight:700;font-size:.78rem}
    .oc-diff-item .chk{padding:4px 10px;border-radius:99px;background:rgba(255,255,255,.12);font:700 .76rem Fredoka,sans-serif;color:#ffd166}
    .oc-talent-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:16px;background:rgba(15,20,56,.85);border:1px solid rgba(255,255,255,.16)}
    .oc-talent-item .ico{font-size:1.7rem;width:38px;text-align:center}
    .oc-talent-item .info{flex:1;text-align:left}.oc-talent-item b{display:block;font:700 .92rem Fredoka,sans-serif}.oc-talent-item small{display:block;color:#c9c6e8;font-size:.75rem;font-weight:700;margin-bottom:4px}
    .oc-talent-item .bar{height:6px;border-radius:99px;background:rgba(255,255,255,.12);overflow:hidden}.oc-talent-item .bar i{display:block;height:100%;background:linear-gradient(90deg,#06d6a0,#ffd166)}
    .oc-tbuy{padding:8px 12px;border-radius:12px;border:0;background:linear-gradient(135deg,#ffd166,#ff85a2);color:#1a0a00;font:700 .8rem Fredoka,sans-serif;cursor:pointer;white-space:nowrap}
    .oc-tbuy:disabled{opacity:.4;cursor:not-allowed}
  `;
  document.head.appendChild(st);
  const f = document.createElement('link');
  f.rel = 'stylesheet';
  f.href = '../../../assets/fonts/fonts.css';
  document.head.appendChild(f);

  /* Atualiza a barra de campanha/poderes inferior esquerda */
  function updateCampaignBarUI() {
    const cb = document.getElementById('oc-cbar');
    if (!cb) return;
    const dInfo = OC.DIFFICULTIES[campState.diff] || OC.DIFFICULTIES[1];
    const wInfo = OC.worldForLevel(campState.cur);
    const slowBtn = cb.querySelector('#oc-slow-btn');
    const campBtn = cb.querySelector('#oc-camp-pill');
    const shPill = cb.querySelector('#oc-shield-pill');
    if (campBtn) {
      campBtn.innerHTML = `${dInfo.emo} Nv.${campState.cur}/100 ${OC.isBossLevel(campState.cur) ? '⚔️' : ''} <span style="color:${wInfo.col}">· ${dInfo.name}</span>`;
    }
    if (shPill) {
      shPill.textContent = `🛡️ ${shieldCharges}`;
      shPill.hidden = shieldCharges <= 0;
    }
    if (slowBtn) {
      if (slowActive > 0) {
        slowBtn.textContent = `⏳ ${Math.ceil(slowActive)}s`;
        slowBtn.style.borderColor = '#00f5d4';
        slowBtn.style.color = '#00f5d4';
      } else if (slowCooldown > 0) {
        slowBtn.textContent = `⏳ ${Math.ceil(slowCooldown)}s`;
        slowBtn.style.opacity = '0.55';
        slowBtn.style.borderColor = '';
        slowBtn.style.color = '#fff';
      } else {
        slowBtn.textContent = `⏳ Lã Temporal`;
        slowBtn.style.opacity = '1';
        slowBtn.style.borderColor = '#00f5d4';
        slowBtn.style.color = '#00f5d4';
      }
    }
  }

  /* Injeta seletor de 5 Dificuldades + Botão de 100 Níveis no ecrã inicial (.ov) */
  function mountIntroDifficultySelector() {
    const ov = document.querySelector('.ov .card') || document.querySelector('.ov');
    if (!ov) return;
    campState = OC.getCampaign();
    let box = ov.querySelector('.oc-intro-diff');
    if (!box) {
      box = document.createElement('div');
      box.className = 'oc-intro-diff';
      const btn = ov.querySelector('.btn');
      if (btn) ov.insertBefore(box, btn); else ov.appendChild(box);
    }
    const dInfo = OC.DIFFICULTIES[campState.diff] || OC.DIFFICULTIES[1];
    const wInfo = OC.worldForLevel(campState.cur);
    const totalCampStars = Object.values(campState.stars).reduce((a, b) => a + b, 0);

    box.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;width:100%;gap:8px;flex-wrap:wrap">
        <span style="font:700 .82rem Fredoka,sans-serif;color:${wInfo.col}">${wInfo.emo} Campanha: Nível ${campState.cur}/100 (${totalCampStars}⭐)</span>
        <button type="button" class="oc-camp-open-btn">🗺️ Mapa 100 Níveis & Talentos</button>
      </div>
      <div class="oc-diff-row">
        ${OC.DIFFICULTIES.map(d => `<button type="button" class="oc-diff-chip ${campState.diff === d.id ? 'on' : ''}" data-d="${d.id}" style="--dc:${d.col}" title="${d.sub}">${d.emo} ${d.name}</button>`).join('')}
      </div>
      <div style="font-size:.74rem;color:#c9c6e8;font-weight:700">${dInfo.emo} <b>${dInfo.name}</b>: ${dInfo.sub}</div>
    `;
    box.querySelectorAll('.oc-diff-chip').forEach(b => {
      b.onclick = (e) => {
        e.stopPropagation();
        campState.diff = +b.dataset.d;
        OC.saveCampaign(campState);
        resetSessionPowers();
        OC.sfx.click();
        mountIntroDifficultySelector();
      };
    });
    const openBtn = box.querySelector('.oc-camp-open-btn');
    if (openBtn) {
      openBtn.onclick = (e) => {
        e.stopPropagation();
        OC.sfx.click();
        OC.openCampaignModal();
      };
    }
  }

  /* Injeta controlos rápidos (Campanha + Lã Temporal + Recorde + Pausa + Som) */
  const mountQuickControls = () => {
    if (!document.body || document.getElementById('oc-qbar')) return;
    const gid = OC.gameId();
    const mig = { 'tear-constelacoes': 'ovelha-ninja', 'eco-estrelas': 'simon-ovelhas' };
    if (mig[gid]) {
      const oldBest = get('op_best_' + mig[gid], 0);
      if (oldBest > OC.best(gid)) set('op_best_' + gid, oldBest);
    }
    resetSessionPowers();
    mountIntroDifficultySelector();

    const b = OC.best(gid);
    const ov = document.querySelector('.ov .card') || document.querySelector('.ov');
    if (ov && b > 0 && !ov.querySelector('.oc-best-badge')) {
      const bd = document.createElement('div');
      bd.className = 'oc-best-badge';
      bd.textContent = '🏆 Recorde Pessoal: ' + OC.fmt(b);
      const diffBox = ov.querySelector('.oc-intro-diff') || ov.querySelector('.btn');
      if (diffBox) ov.insertBefore(bd, diffBox); else ov.appendChild(bd);
    }

    const cb = document.createElement('div');
    cb.id = 'oc-cbar';
    cb.className = 'oc-cbar';
    cb.innerHTML = `
      <button type="button" class="oc-qpill" id="oc-camp-pill" title="Abrir Mapa de 100 Níveis, Dificuldade e Talentos"></button>
      <span class="oc-qpill" id="oc-shield-pill" title="Cargas de Escudo de Lã Dourada ativas">🛡️ 1</span>
      <button type="button" class="oc-qpill" id="oc-slow-btn" title="Ativar Lã Temporal (Câmara Lenta) [Tecla Shift]">⏳ Lã Temporal</button>
    `;
    document.body.appendChild(cb);
    cb.querySelector('#oc-camp-pill').onclick = (e) => { e.stopPropagation(); OC.sfx.click(); OC.openCampaignModal(); };
    cb.querySelector('#oc-slow-btn').onclick = (e) => { e.stopPropagation(); OC.triggerSlowMo(); };

    const qb = document.createElement('div');
    qb.id = 'oc-qbar';
    qb.className = 'oc-qbar';
    qb.innerHTML = `
      ${b > 0 ? `<span class="oc-qpill" id="oc-qbest" title="O teu recorde neste jogo">🏆 ${OC.fmt(b)}</span>` : `<span class="oc-qpill" id="oc-qbest" hidden></span>`}
      <button type="button" class="oc-qbtn" id="oc-mute-btn" title="Ligar/Desligar Som" aria-label="Som">${OC.muted ? '🔇' : '🔊'}</button>
      <button type="button" class="oc-qbtn" id="oc-pause-btn" title="Pausa (Esc / P)" aria-label="Pausa">⏸</button>`;
    document.body.appendChild(qb);
    qb.querySelector('#oc-mute-btn').onclick = (e) => { e.stopPropagation(); OC.setMuted(!OC.muted); };
    qb.querySelector('#oc-pause-btn').onclick = (e) => {
      e.stopPropagation();
      OC.started = true;
      OC.pause(!OC.paused);
    };
    updateCampaignBarUI();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountQuickControls);
  else mountQuickControls();

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
