// DayPrism Landing Page Animations
// Sources converge INTO the prism, cards emerge OUT OF the prism

gsap.registerPlugin(ScrollTrigger);

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Check if mobile
const isMobile = window.innerWidth < 768;

if (!prefersReducedMotion && !isMobile) {
    initScrollAnimations();
} else if (isMobile) {
    // On mobile, just show everything (handled by CSS)
}

function initScrollAnimations() {
    const sources = document.querySelectorAll('.source-icon');
    const prismContainer = document.querySelector('.prism-container');
    const outputs = document.querySelectorAll('.output-card');
    const animContainer = document.querySelector('.animation-container');

    // Get center of the animation container
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Position source icons in a circle around the center (they start spread out)
    const sourceRadius = Math.min(window.innerWidth, window.innerHeight) * 0.35;
    sources.forEach((source, i) => {
        const angle = (i / sources.length) * Math.PI * 2 - Math.PI / 2; // Start from top
        const x = centerX + Math.cos(angle) * sourceRadius - 30; // 30 = half icon width approx
        const y = centerY + Math.sin(angle) * sourceRadius - 30;
        source.style.left = `${x}px`;
        source.style.top = `${y}px`;
    });

    // Position output cards around center (they will animate outward FROM center)
    // Two rows: 4 on top arc, 4 on bottom arc
    const cardRadius = Math.min(window.innerWidth * 0.42, 450);
    outputs.forEach((card, i) => {
        // Cards positioned in two rows below center
        let angle, radius;
        if (i < 4) {
            // Top row - arc above center
            angle = Math.PI + (i - 1.5) * 0.35; // Spread across top
            radius = cardRadius * 0.75;
        } else {
            // Bottom row - arc below center
            angle = (i - 5.5) * 0.35; // Spread across bottom
            radius = cardRadius * 0.85;
        }

        const finalX = centerX + Math.cos(angle) * radius - 110; // 110 = half card width
        const finalY = centerY + Math.sin(angle) * radius - 50; // 50 = half card height approx

        // Store final positions as data attributes
        card.dataset.finalX = finalX;
        card.dataset.finalY = finalY;

        // Start cards at center (they'll animate outward)
        card.style.left = `${centerX - 110}px`;
        card.style.top = `${centerY - 50}px`;
    });

    // Create main timeline
    const mainTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.animation-section',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.8,
        }
    });

    // PHASE 1: Sources appear (0% - 15%)
    // All sources fade in at their spread positions
    sources.forEach((source, i) => {
        mainTimeline.to(source, {
            opacity: 1,
            duration: 0.12,
            ease: 'power2.out'
        }, 0.01 * i);
    });

    // PHASE 2: Prism starts appearing as sources begin converging (10% - 25%)
    mainTimeline.to(prismContainer, {
        opacity: 1,
        scale: 1,
        duration: 0.15,
        ease: 'power2.out'
    }, 0.10);

    // PHASE 3: Sources converge INTO the prism center (15% - 45%)
    sources.forEach((source, i) => {
        // Calculate current position
        const rect = source.getBoundingClientRect();
        const currentX = parseFloat(source.style.left);
        const currentY = parseFloat(source.style.top);

        // Animate toward center
        mainTimeline.to(source, {
            left: centerX - 30, // Move to center
            top: centerY - 30,
            scale: 0.2,
            opacity: 0,
            duration: 0.25,
            ease: 'power2.in'
        }, 0.15 + i * 0.015);
    });

    // PHASE 4: Cards emerge OUT FROM the prism center (40% - 80%)
    outputs.forEach((card, i) => {
        const finalX = parseFloat(card.dataset.finalX);
        const finalY = parseFloat(card.dataset.finalY);

        mainTimeline.to(card, {
            left: finalX,
            top: finalY,
            opacity: 1,
            scale: 1,
            duration: 0.2,
            ease: 'power2.out'
        }, 0.40 + i * 0.04);
    });

    // PHASE 5: Hold the final state (80% - 100%)
    mainTimeline.to({}, { duration: 0.2 });
}

// Button hover effects
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('mouseenter', () => {
        gsap.to(button, {
            scale: 1.02,
            duration: 0.2,
            ease: 'power2.out'
        });
    });

    button.addEventListener('mouseleave', () => {
        gsap.to(button, {
            scale: 1,
            duration: 0.2,
            ease: 'power2.out'
        });
    });
});

// Output card hover effects (desktop only)
if (!isMobile) {
    document.querySelectorAll('.output-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.03,
                boxShadow: '0 12px 40px rgba(139, 92, 246, 0.25)',
                borderColor: '#8B5CF6',
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                boxShadow: 'none',
                borderColor: '#48484A',
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

// Handle resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Recalculate positions on resize
        if (!prefersReducedMotion && window.innerWidth >= 768) {
            ScrollTrigger.refresh();
        }
    }, 250);
});

// Pause when not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        gsap.globalTimeline.pause();
    } else {
        gsap.globalTimeline.resume();
    }
});

console.log('DayPrism animations initialized');
