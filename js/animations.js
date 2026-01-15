// DayPrism Landing Page Animations
// Using GSAP ScrollTrigger for scroll-driven animations

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Check if mobile (simplified animation)
const isMobile = window.innerWidth < 768;

if (!prefersReducedMotion && !isMobile) {
    initScrollAnimations();
}

function initScrollAnimations() {
    const sources = document.querySelectorAll('.source-icon');
    const prismContainer = document.querySelector('.prism-container');
    const outputs = document.querySelectorAll('.output-card');

    // Get prism position for convergence target
    const prismRect = prismContainer.getBoundingClientRect();
    const prismCenterY = window.innerHeight * 0.38; // Match CSS top: 38%

    // Create the main timeline
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.animation-section',
            start: 'top 80%', // Start animation earlier - when section is 80% from top
            end: 'bottom bottom',
            scrub: 0.5,
            pin: '.animation-container',
            pinSpacing: false,
        }
    });

    // Phase 1: Sources appear quickly (0% - 15%)
    sources.forEach((source, index) => {
        const delay = index * 0.01; // Faster stagger
        tl.fromTo(source,
            {
                opacity: 0,
                scale: 0.5,
                y: -30
            },
            {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.08,
                ease: 'back.out(1.5)'
            },
            delay
        );
    });

    // Phase 2: Sources converge DOWN to prism (15% - 40%)
    sources.forEach((source, index) => {
        const rect = source.getBoundingClientRect();
        const sourceX = rect.left + rect.width / 2;
        const sourceY = rect.top + rect.height / 2;

        // Target is center of screen horizontally, and prism position vertically
        const targetX = window.innerWidth / 2;
        const targetY = prismCenterY;

        tl.to(source, {
            x: targetX - sourceX,
            y: targetY - sourceY,
            scale: 0.2,
            opacity: 0,
            duration: 0.25,
            ease: 'power2.in'
        }, 0.15 + index * 0.01);
    });

    // Phase 3: Prism appears (35% - 45%)
    tl.to(prismContainer, {
        opacity: 1,
        scale: 1,
        duration: 0.12,
        ease: 'back.out(2)'
    }, 0.35);

    // Prism glow pulse
    tl.to('.prism-glow', {
        scale: 1.3,
        opacity: 1,
        duration: 0.1,
        ease: 'power2.out'
    }, 0.38);

    // Phase 4: Output cards emerge from below prism (45% - 75%)
    outputs.forEach((card, index) => {
        const delay = 0.45 + index * 0.025;

        tl.fromTo(card,
            {
                opacity: 0,
                y: 30
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.08,
                ease: 'back.out(1.5)'
            },
            delay
        );
    });

    // Hold the final state (75% - 100%)
    tl.to({}, { duration: 0.25 });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

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

// Resize handler for responsive behavior
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Refresh ScrollTrigger on resize
        ScrollTrigger.refresh();
    }, 250);
});

// Performance: Pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        gsap.globalTimeline.pause();
    } else {
        gsap.globalTimeline.resume();
    }
});

console.log('DayPrism animations initialized');
