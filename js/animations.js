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
    const prismLogo = document.querySelector('.prism-logo');
    const outputs = document.querySelectorAll('.output-card');
    const animationContainer = document.querySelector('.animation-container');

    // Create the main timeline
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.animation-section',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            pin: '.animation-container',
            pinSpacing: false,
        }
    });

    // Phase 1: Sources appear scattered (0% - 20%)
    sources.forEach((source, index) => {
        const delay = index * 0.03;
        tl.fromTo(source,
            {
                opacity: 0,
                scale: 0.5,
                y: 50
            },
            {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.15,
                ease: 'back.out(1.7)'
            },
            delay
        );
    });

    // Phase 2: Sources converge to center (20% - 50%)
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    sources.forEach((source, index) => {
        const rect = source.getBoundingClientRect();
        const sourceX = rect.left + rect.width / 2;
        const sourceY = rect.top + rect.height / 2;

        tl.to(source, {
            x: centerX - sourceX,
            y: centerY - sourceY,
            scale: 0.3,
            opacity: 0,
            duration: 0.4,
            ease: 'power2.in'
        }, 0.5 + index * 0.02);
    });

    // Phase 3: Prism appears (45% - 55%)
    tl.to(prismContainer, {
        opacity: 1,
        scale: 1,
        duration: 0.2,
        ease: 'back.out(2)'
    }, 0.7);

    // Prism glow pulse
    tl.to('.prism-glow', {
        scale: 1.5,
        opacity: 1,
        duration: 0.15,
        ease: 'power2.out'
    }, 0.75);

    // Phase 4: Output cards emerge (55% - 100%)
    outputs.forEach((card, index) => {
        const delay = 0.8 + index * 0.03;

        tl.to(card, {
            opacity: 1,
            scale: 1,
            duration: 0.15,
            ease: 'back.out(1.7)'
        }, delay);
    });

    // Add subtle parallax to source icons during hover/idle
    sources.forEach(source => {
        gsap.to(source, {
            y: '+=10',
            x: '+=5',
            duration: 2 + Math.random() * 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    });
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
