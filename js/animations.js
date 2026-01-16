// DayPrism Landing Page Animations
// Compact visual: Sources surround prism closely, converge in, cards burst out

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.innerWidth < 768;

if (!prefersReducedMotion && !isMobile) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAnimations);
    } else {
        initAnimations();
    }
}

function initAnimations() {
    const sources = document.querySelectorAll('.source-icon');
    const prism = document.querySelector('.prism-container');
    const cards = document.querySelectorAll('.output-card');

    if (!prism) return;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // ============================================
    // SOURCES: Position in a tight circle AROUND the prism
    // Much closer so the convergence feels connected
    // ============================================
    const sourceRadius = 180; // Tight circle around prism
    const sourceCount = sources.length;

    sources.forEach((source, i) => {
        const angle = (i / sourceCount) * Math.PI * 2 - Math.PI / 2; // Start from top
        const x = centerX + Math.cos(angle) * sourceRadius;
        const y = centerY + Math.sin(angle) * sourceRadius;

        gsap.set(source, {
            left: x - 25,
            top: y - 30,
            opacity: 1,
            scale: 1
        });
    });

    // ============================================
    // CARDS: Final positions in 2 rows below/around prism
    // Start at center, will burst outward
    // ============================================
    const cardWidth = 200;
    const cardHeight = 100;
    const cardGap = 16;

    // Two rows of 4 cards each, centered below the prism
    const row1Y = centerY + 100; // First row below prism
    const row2Y = centerY + 220; // Second row
    const totalRowWidth = 4 * cardWidth + 3 * cardGap;
    const startX = centerX - totalRowWidth / 2;

    const cardFinalPositions = [
        // Row 1: 4 cards
        { x: startX, y: row1Y },
        { x: startX + cardWidth + cardGap, y: row1Y },
        { x: startX + 2 * (cardWidth + cardGap), y: row1Y },
        { x: startX + 3 * (cardWidth + cardGap), y: row1Y },
        // Row 2: 4 cards
        { x: startX, y: row2Y },
        { x: startX + cardWidth + cardGap, y: row2Y },
        { x: startX + 2 * (cardWidth + cardGap), y: row2Y },
        { x: startX + 3 * (cardWidth + cardGap), y: row2Y },
    ];

    cards.forEach((card, i) => {
        const pos = cardFinalPositions[i];
        card._finalX = pos.x;
        card._finalY = pos.y;

        // Start hidden at prism center
        gsap.set(card, {
            left: centerX - cardWidth / 2,
            top: centerY - cardHeight / 2,
            opacity: 0,
            scale: 0.1
        });
    });

    // Prism starts visible but smaller
    gsap.set(prism, { opacity: 0.3, scale: 0.8 });

    // ============================================
    // ANIMATION TIMELINE
    // ============================================
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.animation-section',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3,
        }
    });

    // PHASE 1 (0-20%): Everything visible, prism grows
    tl.to(prism, {
        opacity: 1,
        scale: 1,
        duration: 0.15,
        ease: 'power2.out'
    }, 0);

    // PHASE 2 (15-50%): Sources converge INTO prism center simultaneously
    sources.forEach((source, i) => {
        tl.to(source, {
            left: centerX - 25,
            top: centerY - 30,
            scale: 0,
            opacity: 0,
            duration: 0.3,
            ease: 'power3.in'
        }, 0.15 + i * 0.015); // Slight stagger for visual effect
    });

    // PHASE 3 (45-95%): Cards burst OUT from prism center
    cards.forEach((card, i) => {
        tl.to(card, {
            left: card._finalX,
            top: card._finalY,
            scale: 1,
            opacity: 1,
            duration: 0.2,
            ease: 'power2.out'
        }, 0.45 + i * 0.04);
    });

    // Hold at end
    tl.to({}, { duration: 0.05 });
}

// Hover effects
document.querySelectorAll('.cta-button').forEach(btn => {
    btn.addEventListener('mouseenter', () => gsap.to(btn, { scale: 1.02, duration: 0.2 }));
    btn.addEventListener('mouseleave', () => gsap.to(btn, { scale: 1, duration: 0.2 }));
});

if (!isMobile) {
    document.querySelectorAll('.output-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.02,
                boxShadow: '0 8px 30px rgba(139, 92, 246, 0.3)',
                borderColor: '#8B5CF6',
                duration: 0.2
            });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                boxShadow: 'none',
                borderColor: '#48484A',
                duration: 0.2
            });
        });
    });
}

// Resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (window.innerWidth >= 768) ScrollTrigger.refresh();
    }, 200);
});

console.log('DayPrism animations loaded');
