/**
 * ═══════════════════════════════════════════════════════════
 * Ovelhas Coloridas — Testimonials & Reviews Display Module
 * Real-time rendering of reviews from Firebase Firestore
 * ═══════════════════════════════════════════════════════════
 */

(function initTestimonialsDisplay() {
    const gridContainer = document.getElementById('testimonials-grid');
    const scoreNumEl = document.getElementById('summary-score-num');
    const starsEl = document.getElementById('summary-stars');
    const countEl = document.getElementById('summary-count');

    if (!gridContainer) return;

    // Formatação de estrelas em HTML
    function getStarsHtml(rating) {
        const num = Math.max(0, Math.min(5, Number(rating) || 0));
        let starsStr = '';
        for (let i = 1; i <= 5; i++) {
            if (num >= i) {
                starsStr += '<span class="star filled">★</span>';
            } else if (num >= i - 0.5) {
                starsStr += '<span class="star half">★</span>';
            } else {
                starsStr += '<span class="star empty">☆</span>';
            }
        }
        return `<div class="testimonial-stars" aria-label="${num} de 5 estrelas">${starsStr} <span class="stars-numeric">${num.toFixed(1)}</span></div>`;
    }

    // Formatação amigável de data
    function formatReviewDate(timestamp, fallbackIso) {
        let d;
        if (timestamp && timestamp.toDate) {
            d = timestamp.toDate();
        } else if (timestamp && timestamp.seconds) {
            d = new Date(timestamp.seconds * 1000);
        } else if (fallbackIso) {
            d = new Date(fallbackIso);
        } else {
            return 'Recentemente';
        }
        return d.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    // Renderizar lista de reviews
    function renderReviewsList(reviews) {
        if (!reviews || !reviews.length) {
            // Estado de convite acolhedor se ainda não existirem críticas na base de dados
            scoreNumEl.textContent = '5.0';
            starsEl.innerHTML = '★★★★★';
            countEl.textContent = 'Sê o primeiro a avaliar!';

            gridContainer.innerHTML = `
                <div class="testimonials-empty-card reveal active">
                    <img src="assets/personagens/ovelha-arcoiris.png" alt="Ovelha Arco-Íris" class="empty-sheep-icon">
                    <h3>Gostaste do livro? Partilha connosco!</h3>
                    <p>O nosso rebanho espacial adoraria saber o que achaste do livro e das ilustrações. Deixa a tua crítica e ajuda outros leitores a descobrir o Planeta Amendoim!</p>
                    <a href="avaliar.html" class="btn-leave-review-inline">
                        <span>🚀</span> Deixar a Minha Avaliação
                    </a>
                </div>
            `;
            return;
        }

        // Calcular médias
        const total = reviews.length;
        const avg = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / total;
        const formattedAvg = avg.toFixed(1);

        scoreNumEl.textContent = formattedAvg;
        countEl.textContent = `Baseado em ${total} ${total === 1 ? 'avaliação' : 'avaliações'} de leitores`;

        // Renderizar estrelas do sumário
        let summaryStars = '';
        for (let i = 1; i <= 5; i++) {
            summaryStars += (avg >= i - 0.25) ? '★' : '☆';
        }
        starsEl.innerHTML = summaryStars;

        // Renderizar os cards
        const cardsHtml = reviews.map((r, index) => {
            const charKey = r.character || 'ovelha-arcoiris';
            const charData = (window.OvelhasFirebase && window.OvelhasFirebase.SHEEP_CHARACTERS && window.OvelhasFirebase.SHEEP_CHARACTERS[charKey]) 
                ? window.OvelhasFirebase.SHEEP_CHARACTERS[charKey] 
                : {
                    name: 'Ovelha Arco-Íris',
                    image: 'assets/personagens/ovelha-arcoiris.png',
                    color: '#ffd166',
                    glow: 'rgba(255, 209, 102, 0.4)'
                };

            const isVerified = !!r.verifiedPurchase;
            const dateStr = formatReviewDate(r.createdAt, r.createdAtClient);
            const delayClass = `reveal-delay-${(index % 4) + 1}`;

            return `
                <article class="testimonial-card reveal active ${delayClass} ${isVerified ? 'has-verified-badge' : ''}" style="--char-color: ${charData.color}; --char-glow: ${charData.glow};">
                    <div class="card-nebula-glow"></div>
                    
                    <div class="testimonial-header">
                        <div class="testimonial-author-wrap">
                            <div class="testimonial-avatar" style="border-color: ${charData.color}; box-shadow: 0 0 12px ${charData.glow};">
                                <img src="${charData.image}" alt="${charData.name}" loading="lazy" width="50" height="50">
                            </div>
                            <div class="testimonial-author-meta">
                                <h3 class="testimonial-author-name">${escapeHtml(r.name || 'Leitor Espacial')}</h3>
                                <time class="testimonial-date">${dateStr}</time>
                            </div>
                        </div>

                        ${isVerified ? `
                            <div class="verified-purchase-badge" title="Compra validada pelos autores">
                                <svg class="badge-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" width="14" height="14">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                </svg>
                                <span>Compra Confirmada</span>
                            </div>
                        ` : ''}
                    </div>

                    ${getStarsHtml(r.rating)}

                    ${r.title ? `<h4 class="testimonial-title">"${escapeHtml(r.title)}"</h4>` : ''}

                    <div class="testimonial-body">
                        <p>${escapeHtml(r.comment || '').replace(/\n/g, '<br>')}</p>
                    </div>

                    <div class="testimonial-footer">
                        <span class="testimonial-character-fav">
                            Personagem favorita: <strong>${charData.name}</strong>
                        </span>
                    </div>
                </article>
            `;
        }).join('');

        gridContainer.innerHTML = cardsHtml;
    }

    // Função de sanitização HTML simples contra XSS
    function escapeHtml(text) {
        if (!text) return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    // Inicialização da escuta em tempo real
    function startListening() {
        if (window.OvelhasFirebase && typeof window.OvelhasFirebase.onPublicReviews === 'function') {
            window.OvelhasFirebase.onPublicReviews((reviews) => {
                renderReviewsList(reviews);
            });
        } else {
            // Tentar novamente após 200ms se o Firebase ainda estiver a carregar
            setTimeout(startListening, 200);
        }
    }

    // Arrancar após carregamento do DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startListening);
    } else {
        startListening();
    }
})();
