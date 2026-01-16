// DayPrism Landing Page Animations
// Visual flow: Sources → converge INTO prism → Cards emerge OUT

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.innerWidth < 768;

if (!prefersReducedMotion && !isMobile) {
    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', initAnimations);
    if (document.readyState !== 'loading') {
        initAnimations();
    }
}

function initAnimations() {
    const container = document.querySelector('.animation-container');
    const sources = document.querySelectorAll('.source-icon');
    const prism = document.querySelector('.prism-container');
    const cards = document.querySelectorAll('.output-card');

    if (!container || !prism) return;

    const containerRect = container.getBoundingClientRect();
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // ============================================
    // POSITION SOURCES in an arc at TOP of screen
    // They will animate DOWN into the prism
    // ============================================
    const sourceCount = sources.length;
    const arcWidth = Math.min(window.innerWidth * 0.8, 900);
    const arcStartX = centerX - arcWidth / 2;
    const sourceY = window.innerHeight * 0.15; // Near top

    sources.forEach((source, i) => {
        const progress = sourceCount > 1 ? i / (sourceCount - 1) : 0.5;
        const x = arcStartX + progress * arcWidth;
        // Slight arc curve
        const yOffset = Math.sin(progress * Math.PI) * 30;

        gsap.set(source, {
            left: x - 25,
            top: sourceY + yOffset,
            opacity: 1,
            scale: 1
        });
    });

    // ============================================
    // POSITION CARDS around the prism (final positions)
    // They start at center and animate outward
    // ============================================
    // 4 cards on left side, 4 on right side of prism
    const cardPositions = [
        // Left column (from top to bottom)
        { x: centerX - 320, y: centerY - 140 },
        { x: centerX - 320, y: centerY + 10 },
        // Right column
        { x: centerX + 120, y: centerY - 140 },
        { x: centerX + 120, y: centerY + 10 },
        // Far left column
        { x: centerX - 540, y: centerY - 70 },
        { x: centerX - 540, y: centerY + 80 },
        // Far right column
        { x: centerX + 340, y: centerY - 70 },
        { x: centerX + 340, y: centerY + 80 },
    ];

    cards.forEach((card, i) => {
        const pos = cardPositions[i] || { x: centerX, y: centerY + 200 };
        // Store final position
        card._finalX = pos.x;
        card._finalY = pos.y;
        // Start cards at center (hidden, will animate outward)
        gsap.set(card, {
            left: centerX - 100, // center minus half card width
            top: centerY - 50,
            opacity: 0,
            scale: 0.3
        });
    });

    // Prism starts hidden
    gsap.set(prism, { opacity: 0, scale: 0.5 });

    // ============================================
    // CREATE THE ANIMATION TIMELINE
    // ============================================
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.animation-section',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.5,
        }
    });

    // PHASE 1 (0% - 30%): Sources visible, start moving toward center
    // Prism fades in as sources approach
    tl.to(prism, {
        opacity: 1,
        scale: 1,
        duration: 0.2,
        ease: 'power2.out'
    }, 0.05);

    // PHASE 2 (10% - 50%): Sources converge INTO the prism center
    sources.forEach((source, i) => {
        tl.to(source, {
            left: centerX - 25,
            top: centerY - 25,
            scale: 0.2,
            opacity: 0,
            duration: 0.35,
            ease: 'power2.in'
        }, 0.1 + i * 0.02);
    });

    // PHASE 3 (45% - 90%): Cards emerge OUT FROM the prism
    cards.forEach((card, i) => {
        tl.to(card, {
            left: card._finalX,
            top: card._finalY,
            scale: 1,
            opacity: 1,
            duration: 0.25,
            ease: 'power2.out'
        }, 0.45 + i * 0.05);
    });

    // PHASE 4 (90% - 100%): Hold final state
    tl.to({}, { duration: 0.1 });
}

// Button hover
document.querySelectorAll('.cta-button').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        gsap.to(btn, { scale: 1.02, duration: 0.2 });
    });
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { scale: 1, duration: 0.2 });
    });
});

// Card hover (desktop)
if (!isMobile) {
    document.querySelectorAll('.output-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.03,
                boxShadow: '0 12px 40px rgba(139, 92, 246, 0.3)',
                borderColor: '#8B5CF6',
                duration: 0.25
            });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                boxShadow: 'none',
                borderColor: '#48484A',
                duration: 0.25
            });
        });
    });
}

// Resize handler
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (window.innerWidth >= 768) {
            ScrollTrigger.refresh();
        }
    }, 200);
});

console.log('DayPrism animations loaded');
