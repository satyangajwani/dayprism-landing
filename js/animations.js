// DayPrism Landing Page Animations
// Using GSAP ScrollTrigger for scroll-driven animations

gsap.registerPlugin(ScrollTrigger);

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Check if mobile
const isMobile = window.innerWidth < 768;

if (!prefersReducedMotion && !isMobile) {
    initScrollAnimations();
} else if (isMobile) {
    // On mobile, just show everything
    document.querySelectorAll('.source-icon').forEach(el => el.style.opacity = '1');
    document.querySelector('.prism-container').style.opacity = '1';
    document.querySelectorAll('.output-card').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
    });
}

function initScrollAnimations() {
    const sources = document.querySelectorAll('.source-icon');
    const prismContainer = document.querySelector('.prism-container');
    const outputs = document.querySelectorAll('.output-card');

    // Create main timeline pinned to the animation section
    const mainTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.animation-section',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
        }
    });

    // Phase 1: Sources fade in (0% - 20% of scroll)
    // All sources appear at once, staggered
    sources.forEach((source, i) => {
        mainTimeline.to(source, {
            opacity: 1,
            duration: 0.15,
            ease: 'power2.out'
        }, i * 0.01);
    });

    // Phase 2: Sources move toward center and fade out (20% - 45%)
    const prismCenterX = window.innerWidth / 2;
    const prismCenterY = window.innerHeight * 0.45;

    sources.forEach((source, i) => {
        const rect = source.getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;

        mainTimeline.to(source, {
            x: prismCenterX - startX,
            y: prismCenterY - startY,
            scale: 0.3,
            opacity: 0,
            duration: 0.25,
            ease: 'power2.in'
        }, 0.2 + i * 0.008);
    });

    // Phase 3: Prism appears (40% - 50%)
    mainTimeline.to(prismContainer, {
        opacity: 1,
        duration: 0.15,
        ease: 'power2.out'
    }, 0.4);

    // Phase 4: Output cards appear (50% - 80%)
    outputs.forEach((card, i) => {
        mainTimeline.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.1,
            ease: 'power2.out'
        }, 0.5 + i * 0.025);
    });

    // Hold the final state (80% - 100%)
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
                y: -8,
                boxShadow: '0 12px 40px rgba(139, 92, 246, 0.25)',
                borderColor: '#8B5CF6',
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
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
        ScrollTrigger.refresh();
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
