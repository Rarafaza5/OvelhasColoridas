/**
 * ═══════════════════════════════════════════════════════════
 * Ovelhas Coloridas — Firebase & Firestore Configuration
 * Reviews & Verified Purchase Tokens System
 * ═══════════════════════════════════════════════════════════
 */

const firebaseConfig = {
  apiKey: "AIzaSyDlcDw00v_Jcat_KApXCbS_uRbpSSIObko",
  authDomain: "ovelhascoloridas-235c1.firebaseapp.com",
  projectId: "ovelhascoloridas-235c1",
  storageBucket: "ovelhascoloridas-235c1.firebasestorage.app",
  messagingSenderId: "791349999782",
  appId: "1:791349999782:web:5bce745534725f29691c67"
};

// Inicialização segura do Firebase
let app = null;
let db = null;

try {
  if (typeof firebase !== 'undefined') {
    if (!firebase.apps || !firebase.apps.length) {
      app = firebase.initializeApp(firebaseConfig);
    } else {
      app = firebase.app();
    }
    db = firebase.firestore();
  } else {
    console.warn("Firebase SDK ainda não carregado.");
  }
} catch (err) {
  console.error("Erro ao inicializar Firebase:", err);
}

// Utilitários de Coleções
const REVIEWS_COLLECTION = 'reviews';
const TOKENS_COLLECTION = 'review_tokens';

// Dicionário de ovelhas disponíveis com respetivas imagens e cores
const SHEEP_CHARACTERS = {
  'ovelha-arcoiris': {
    name: 'Ovelha Arco-Íris',
    role: 'A Principal',
    image: 'assets/personagens/ovelha-arcoiris.png',
    color: '#ffd166',
    glow: 'rgba(255, 209, 102, 0.4)'
  },
  'ovelha-azul': {
    name: 'Ovelha Azul',
    role: 'A Engenheira',
    image: 'assets/personagens/ovelha-azul.png',
    color: '#00f5d4',
    glow: 'rgba(0, 245, 212, 0.4)'
  },
  'ovelha-roxa': {
    name: 'Ovelha Roxa',
    role: 'A Curiosa',
    image: 'assets/personagens/ovelha-roxa.png',
    color: '#9b5de5',
    glow: 'rgba(155, 93, 229, 0.4)'
  },
  'ovelha-melancia': {
    name: 'Ovelha Melancia',
    role: 'A Comilona',
    image: 'assets/personagens/ovelha-melancia.png',
    color: '#ff4d6d',
    glow: 'rgba(255, 77, 109, 0.4)'
  },
  'ovelha-verde': {
    name: 'Ovelha Verde',
    role: 'A Ambientalista',
    image: 'assets/personagens/ovelha-verde.png',
    color: '#52b788',
    glow: 'rgba(82, 183, 136, 0.4)'
  },
  'ovelha-rosa': {
    name: 'Ovelha Rosa',
    role: 'A Brincalhona',
    image: 'assets/personagens/ovelha-rosa.png',
    color: '#ff85a2',
    glow: 'rgba(255, 133, 162, 0.4)'
  },
  'ovelha-laranja': {
    name: 'Ovelha Laranja',
    role: 'A Planeadora',
    image: 'assets/personagens/ovelha-laranja.png',
    color: '#f77f00',
    glow: 'rgba(247, 127, 0, 0.4)'
  },
  'elefante-amendoim': {
    name: 'Elefante Amendoim',
    role: 'Amigo das Estrelas',
    image: 'assets/personagens/elefante-amendoim.png',
    color: '#f4a261',
    glow: 'rgba(244, 162, 97, 0.4)'
  }
};

/**
 * Gera um token único para compras confirmadas
 */
function generateRandomToken(prefix = 'oc_') {
  const chars = 'abcdefghijkmnpqrstuvwxyz23456789';
  let rand = '';
  for (let i = 0; i < 12; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return prefix + rand;
}

/**
 * Cria um novo link/token de Compra Confirmada no Firestore
 * @param {string} customerName - Nome do cliente ou nota (opcional)
 * @param {number} maxUses - Número de utilizações permitidas (padrão 1, ou 9999 para ilimitado)
 * @returns {Promise<{token: string, url: string, id: string}>}
 */
async function createVerifiedPurchaseToken(customerName = '', maxUses = 1) {
  if (!db) throw new Error("Base de dados Firestore não inicializada");

  const tokenStr = generateRandomToken();
  const tokenDoc = {
    token: tokenStr,
    customerName: customerName.trim(),
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    used: false,
    useCount: 0,
    maxUses: Number(maxUses) || 1,
    active: true
  };

  const docRef = await db.collection(TOKENS_COLLECTION).add(tokenDoc);

  // Constrói o URL absoluto para a página de avaliação
  const baseUrl = window.location.href.split('?')[0].replace(/admin\.html.*$/, 'avaliar.html');
  const finalUrl = baseUrl.endsWith('avaliar.html') 
    ? `${baseUrl}?token=${tokenStr}`
    : `${window.location.origin}/avaliar.html?token=${tokenStr}`;

  return {
    id: docRef.id,
    token: tokenStr,
    url: finalUrl,
    customerName: tokenDoc.customerName
  };
}

/**
 * Valida se um token de compra confirmada existe e pode ser usado
 * @param {string} tokenStr
 * @returns {Promise<{valid: boolean, reason?: string, data?: object, docId?: string}>}
 */
async function validateVerifiedToken(tokenStr) {
  if (!tokenStr || !tokenStr.trim()) {
    return { valid: false, reason: 'Sem token' };
  }
  if (!db) {
    return { valid: false, reason: 'Firestore indisponível' };
  }

  try {
    const cleanToken = tokenStr.trim();
    const snapshot = await db.collection(TOKENS_COLLECTION)
      .where('token', '==', cleanToken)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return { valid: false, reason: 'Token não encontrado' };
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    if (data.active === false) {
      return { valid: false, reason: 'Token desativado' };
    }

    const useCount = Number(data.useCount) || 0;
    const maxUses = Number(data.maxUses) || 1;

    if (useCount >= maxUses) {
      return { 
        valid: false, 
        reason: 'Token já atingiu o limite de utilizações',
        data: data,
        docId: doc.id
      };
    }

    return {
      valid: true,
      data: data,
      docId: doc.id
    };
  } catch (error) {
    console.error("Erro ao validar token:", error);
    return { valid: false, reason: error.message };
  }
}

/**
 * Marca um token como usado no Firestore
 */
async function markTokenAsUsed(tokenDocId, reviewId) {
  if (!db || !tokenDocId) return;
  try {
    const docRef = db.collection(TOKENS_COLLECTION).doc(tokenDocId);
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      const data = docSnap.data();
      const newUseCount = (Number(data.useCount) || 0) + 1;
      const maxUses = Number(data.maxUses) || 1;
      const isNowUsed = newUseCount >= maxUses;

      await docRef.update({
        useCount: newUseCount,
        used: isNowUsed,
        lastUsedAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastReviewId: reviewId || null
      });
    }
  } catch (err) {
    console.error("Erro ao marcar token como usado:", err);
  }
}

/**
 * Submete uma nova crítica / testemunho
 * @param {object} reviewData - { name, rating, title, comment, character, token }
 * @returns {Promise<{success: boolean, id: string, verified: boolean}>}
 */
async function submitReview({ name, rating, title, comment, character, token }) {
  if (!db) throw new Error("Base de dados Firestore não inicializada");

  const cleanRating = Math.max(0, Math.min(5, Math.round(Number(rating) * 2) / 2)); // suporta 0 a 5 com passos de 0.5 se aplicável, ou inteiros
  const cleanName = (name || '').trim();
  const cleanComment = (comment || '').trim();
  const cleanTitle = (title || '').trim();
  const chosenCharacter = character && SHEEP_CHARACTERS[character] ? character : 'ovelha-arcoiris';

  if (!cleanName) throw new Error("Por favor, introduz o teu nome.");
  if (!cleanComment) throw new Error("Por favor, escreve a tua opinião sobre o livro.");
  if (isNaN(cleanRating) || cleanRating < 0 || cleanRating > 5) {
    throw new Error("Por favor, seleciona uma avaliação de 0 a 5 estrelas.");
  }

  // Verifica se o token de compra confirmada é válido
  let isVerified = false;
  let tokenDocId = null;

  if (token && token.trim()) {
    const check = await validateVerifiedToken(token.trim());
    if (check.valid) {
      isVerified = true;
      tokenDocId = check.docId;
    }
  }

  const newReview = {
    name: cleanName,
    rating: cleanRating,
    title: cleanTitle,
    comment: cleanComment,
    character: chosenCharacter,
    verifiedPurchase: isVerified,
    tokenUsed: isVerified ? token.trim() : null,
    approved: true, // Visível no site por padrão; admin pode desativar
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    createdAtClient: new Date().toISOString()
  };

  const docRef = await db.collection(REVIEWS_COLLECTION).add(newReview);

  // Se usou token válido, atualiza o token
  if (isVerified && tokenDocId) {
    await markTokenAsUsed(tokenDocId, docRef.id);
  }

  return {
    success: true,
    id: docRef.id,
    verified: isVerified
  };
}

/**
 * Escuta em tempo real as críticas públicas aprovadas (para o index.html)
 * @param {function} callback - Recebe array de reviews
 * @returns {function} unsubscribe
 */
function onPublicReviews(callback) {
  if (!db) {
    console.warn("Firestore não inicializado.");
    callback([]);
    return () => {};
  }

  try {
    return db.collection(REVIEWS_COLLECTION)
      .where('approved', '==', true)
      .onSnapshot((snapshot) => {
        const reviews = [];
        snapshot.forEach((doc) => {
          reviews.push({ id: doc.id, ...doc.data() });
        });
        // Ordena por data (mais recentes primeiro), salvaguardando timestamps nulos
        reviews.sort((a, b) => {
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAtClient ? new Date(a.createdAtClient).getTime() : 0);
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAtClient ? new Date(b.createdAtClient).getTime() : 0);
          return timeB - timeA;
        });
        callback(reviews);
      }, (err) => {
        console.error("Erro no listener de reviews públicas:", err);
        // Fallback: tentar busca única simples
        fetchPublicReviewsOnce().then(callback).catch(() => callback([]));
      });
  } catch (err) {
    console.error("Erro ao configurar onPublicReviews:", err);
    return () => {};
  }
}

/**
 * Busca de fallback pontual caso onSnapshot falhe
 */
async function fetchPublicReviewsOnce() {
  if (!db) return [];
  try {
    const snapshot = await db.collection(REVIEWS_COLLECTION)
      .where('approved', '==', true)
      .get();
    const reviews = [];
    snapshot.forEach(doc => reviews.push({ id: doc.id, ...doc.data() }));
    reviews.sort((a, b) => {
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAtClient ? new Date(a.createdAtClient).getTime() : 0);
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAtClient ? new Date(b.createdAtClient).getTime() : 0);
      return timeB - timeA;
    });
    return reviews;
  } catch (err) {
    console.error("Erro ao buscar reviews:", err);
    return [];
  }
}

/**
 * Funções exclusivas para o Painel de Administração (admin.html)
 */

// Escuta todas as críticas no admin (mesmo as não aprovadas)
function onAllReviewsAdmin(callback) {
  if (!db) return () => {};
  try {
    return db.collection(REVIEWS_COLLECTION)
      .onSnapshot((snapshot) => {
        const reviews = [];
        snapshot.forEach((doc) => {
          reviews.push({ id: doc.id, ...doc.data() });
        });
        reviews.sort((a, b) => {
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAtClient ? new Date(a.createdAtClient).getTime() : 0);
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAtClient ? new Date(b.createdAtClient).getTime() : 0);
          return timeB - timeA;
        });
        callback(reviews);
      }, (err) => {
        console.error("Erro ao escutar reviews no admin:", err);
      });
  } catch (err) {
    console.error("Erro admin reviews:", err);
    return () => {};
  }
}

// Escuta todos os tokens gerados no admin
function onAllTokensAdmin(callback) {
  if (!db) return () => {};
  try {
    return db.collection(TOKENS_COLLECTION)
      .onSnapshot((snapshot) => {
        const tokens = [];
        snapshot.forEach((doc) => {
          tokens.push({ id: doc.id, ...doc.data() });
        });
        tokens.sort((a, b) => {
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return timeB - timeA;
        });
        callback(tokens);
      }, (err) => {
        console.error("Erro ao escutar tokens no admin:", err);
      });
  } catch (err) {
    console.error("Erro admin tokens:", err);
    return () => {};
  }
}

// Alternar aprovação de uma review
async function toggleReviewApproval(reviewId, currentStatus) {
  if (!db) throw new Error("Firestore indisponível");
  return db.collection(REVIEWS_COLLECTION).doc(reviewId).update({
    approved: !currentStatus
  });
}

// Alternar badge de Compra Confirmada
async function toggleReviewVerified(reviewId, currentStatus) {
  if (!db) throw new Error("Firestore indisponível");
  return db.collection(REVIEWS_COLLECTION).doc(reviewId).update({
    verifiedPurchase: !currentStatus
  });
}

// Apagar review
async function deleteReviewDoc(reviewId) {
  if (!db) throw new Error("Firestore indisponível");
  return db.collection(REVIEWS_COLLECTION).doc(reviewId).delete();
}

// Apagar token
async function deleteTokenDoc(tokenId) {
  if (!db) throw new Error("Firestore indisponível");
  return db.collection(TOKENS_COLLECTION).doc(tokenId).delete();
}

// Exportações globais para utilização nos scripts das páginas
window.OvelhasFirebase = {
  db,
  SHEEP_CHARACTERS,
  createVerifiedPurchaseToken,
  validateVerifiedToken,
  submitReview,
  onPublicReviews,
  fetchPublicReviewsOnce,
  onAllReviewsAdmin,
  onAllTokensAdmin,
  toggleReviewApproval,
  toggleReviewVerified,
  deleteReviewDoc,
  deleteTokenDoc
};
