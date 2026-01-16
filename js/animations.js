// DayPrism Landing Page Animations - Bold Maximalist
// Smooth visual: Sources converge with prismatic trails, cards emerge with trails

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
    const animationContainer = document.querySelector('.animation-container');
    const progressFill = document.querySelector('.progress-fill');
    const progressLabels = document.querySelectorAll('.progress-label');

    if (!prism || !animationContainer) return;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // ============================================
    // CREATE SVG OVERLAY FOR TRAIL LINES
    // ============================================
    const svgNS = 'http://www.w3.org/2000/svg';
    const trailSvg = document.createElementNS(svgNS, 'svg');
    trailSvg.setAttribute('class', 'trail-lines');
    trailSvg.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 5;
    `;
    animationContainer.appendChild(trailSvg);

    // ============================================
    // MULTI-COLOR GRADIENT DEFINITIONS
    // ============================================
    const defs = document.createElementNS(svgNS, 'defs');

    // Prismatic trail colors
    const trailColors = [
        { id: 'trailViolet', color: '#8B5CF6' },
        { id: 'trailBlue', color: '#3B82F6' },
        { id: 'trailCyan', color: '#06B6D4' },
        { id: 'trailTeal', color: '#14B8A6' },
        { id: 'trailGold', color: '#F59E0B' },
        { id: 'trailOrange', color: '#F97316' },
        { id: 'trailPink', color: '#EC4899' },
        { id: 'trailMagenta', color: '#D946EF' }
    ];

    // Create gradient for each color (incoming - source to center)
    trailColors.forEach(({ id, color }) => {
        const gradIn = document.createElementNS(svgNS, 'linearGradient');
        gradIn.setAttribute('id', `${id}In`);
        gradIn.innerHTML = `
            <stop offset="0%" stop-color="${color}" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
        `;
        defs.appendChild(gradIn);

        // Outgoing gradient (center to card)
        const gradOut = document.createElementNS(svgNS, 'linearGradient');
        gradOut.setAttribute('id', `${id}Out`);
        gradOut.innerHTML = `
            <stop offset="0%" stop-color="${color}" stop-opacity="0"/>
            <stop offset="100%" stop-color="${color}" stop-opacity="0.8"/>
        `;
        defs.appendChild(gradOut);
    });

    trailSvg.insertBefore(defs, trailSvg.firstChild);

    // ============================================
    // SOURCES: Position in circle around prism
    // ============================================
    const sourceRadius = 230;
    const sourceCount = sources.length;
    const sourcePositions = [];

    sources.forEach((source, i) => {
        const angle = (i / sourceCount) * Math.PI * 2 - Math.PI / 2;
        const x = centerX + Math.cos(angle) * sourceRadius;
        const y = centerY + Math.sin(angle) * sourceRadius;

        sourcePositions.push({ x, y, angle });

        gsap.set(source, {
            left: x - 25,
            top: y - 30,
            opacity: 1,
            scale: 1
        });

        // Create trail line with unique color
        const colorIndex = i % trailColors.length;
        const line = document.createElementNS(svgNS, 'line');
        line.setAttribute('x1', x);
        line.setAttribute('y1', y);
        line.setAttribute('x2', centerX);
        line.setAttribute('y2', centerY);
        line.setAttribute('stroke', `url(#${trailColors[colorIndex].id}In)`);
        line.setAttribute('stroke-width', '2');
        line.setAttribute('stroke-linecap', 'round');
        line.setAttribute('opacity', '0');
        line.setAttribute('class', 'source-trail');
        trailSvg.appendChild(line);
        source._trailLine = line;
    });

    // ============================================
    // CARDS: Final positions in 2 rows
    // ============================================
    const cardWidth = 260; // Updated for new card size
    const cardHeight = 120;
    const cardGap = 16;
    const row1Y = centerY + 120;
    const row2Y = centerY + 270;
    const totalRowWidth = 4 * cardWidth + 3 * cardGap;
    const startX = centerX - totalRowWidth / 2;

    const cardFinalPositions = [
        { x: startX, y: row1Y },
        { x: startX + cardWidth + cardGap, y: row1Y },
        { x: startX + 2 * (cardWidth + cardGap), y: row1Y },
        { x: startX + 3 * (cardWidth + cardGap), y: row1Y },
        { x: startX, y: row2Y },
        { x: startX + cardWidth + cardGap, y: row2Y },
        { x: startX + 2 * (cardWidth + cardGap), y: row2Y },
        { x: startX + 3 * (cardWidth + cardGap), y: row2Y },
    ];

    cards.forEach((card, i) => {
        const pos = cardFinalPositions[i];
        card._finalX = pos.x;
        card._finalY = pos.y;
        card._finalCenterX = pos.x + cardWidth / 2;
        card._finalCenterY = pos.y + cardHeight / 2;

        gsap.set(card, {
            left: centerX - cardWidth / 2,
            top: centerY - cardHeight / 2,
            opacity: 0,
            scale: 0.1
        });

        // Create trail line with unique color
        const colorIndex = i % trailColors.length;
        const line = document.createElementNS(svgNS, 'line');
        line.setAttribute('x1', centerX);
        line.setAttribute('y1', centerY);
        line.setAttribute('x2', centerX);
        line.setAttribute('y2', centerY);
        line.setAttribute('stroke', `url(#${trailColors[colorIndex].id}Out)`);
        line.setAttribute('stroke-width', '2');
        line.setAttribute('stroke-linecap', 'round');
        line.setAttribute('opacity', '0');
        line.setAttribute('class', 'card-trail');
        trailSvg.appendChild(line);
        card._trailLine = line;
    });

    // Prism starts smaller
    gsap.set(prism, { opacity: 0.3, scale: 0.8 });

    // ============================================
    // ANIMATION TIMELINE - TIGHTER & SMOOTHER
    // ============================================
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.animation-section',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.2, // Slightly faster scrub
            onEnter: () => document.body.classList.add('animation-active'),
            onLeave: () => document.body.classList.remove('animation-active'),
            onEnterBack: () => document.body.classList.add('animation-active'),
            onLeaveBack: () => document.body.classList.remove('animation-active'),
            onUpdate: (self) => {
                // Update progress indicator
                const progress = self.progress * 100;
                if (progressFill) {
                    progressFill.style.width = `${progress}%`;
                }

                // Update phase labels
                if (progressLabels.length) {
                    progressLabels.forEach(label => {
                        label.classList.remove('active', 'completed');
                    });

                    if (progress < 40) {
                        progressLabels[0].classList.add('active');
                    } else if (progress < 70) {
                        progressLabels[0].classList.add('completed');
                        progressLabels[1].classList.add('active');
                    } else {
                        progressLabels[0].classList.add('completed');
                        progressLabels[1].classList.add('completed');
                        progressLabels[2].classList.add('active');
                    }
                }

                // Activate prism rays when prism is visible
                if (progress > 10 && progress < 90) {
                    prism.classList.add('active');
                } else {
                    prism.classList.remove('active');
                }
            }
        }
    });

    // PHASE 1 (0-15%): Prism fades in and grows
    tl.to(prism, {
        opacity: 1,
        scale: 1,
        duration: 0.15,
        ease: 'power2.out'
    }, 0);

    // PHASE 2 (8-50%): Sources converge with trails
    sources.forEach((source, i) => {
        const startTime = 0.08 + i * 0.015; // Tighter stagger
        const trailLine = source._trailLine;

        // Show trail line first
        tl.to(trailLine, {
            attr: { opacity: 0.7 },
            duration: 0.10,
            ease: 'power1.in'
        }, startTime);

        // Animate source moving to center
        tl.to(source, {
            left: centerX - 25,
            top: centerY - 30,
            scale: 0.3,
            opacity: 0.5,
            duration: 0.30,
            ease: 'power2.inOut'
        }, startTime + 0.06);

        // Shrink trail as source moves
        tl.to(trailLine, {
            attr: {
                x1: centerX,
                y1: centerY,
                opacity: 0
            },
            duration: 0.25,
            ease: 'power2.in'
        }, startTime + 0.12);

        // Final fade out of source
        tl.to(source, {
            scale: 0,
            opacity: 0,
            duration: 0.10,
            ease: 'power2.in'
        }, startTime + 0.30);
    });

    // PHASE 3 (55-92%): Cards emerge with trails
    cards.forEach((card, i) => {
        const startTime = 0.55 + i * 0.025; // Tighter stagger
        const trailLine = card._trailLine;
        const finalX = card._finalCenterX;
        const finalY = card._finalCenterY;

        // Show trail line extending outward
        tl.to(trailLine, {
            attr: {
                x2: finalX,
                y2: finalY,
                opacity: 0.7
            },
            duration: 0.15,
            ease: 'power2.out'
        }, startTime);

        // Card emerges and follows the trail
        tl.to(card, {
            left: card._finalX,
            top: card._finalY,
            scale: 1,
            opacity: 1,
            duration: 0.24,
            ease: 'power2.out'
        }, startTime + 0.06);

        // Trail fades as card arrives
        tl.to(trailLine, {
            attr: {
                x1: finalX,
                y1: finalY,
                opacity: 0
            },
            duration: 0.18,
            ease: 'power2.out'
        }, startTime + 0.16);
    });

    // Hold at end
    tl.to({}, { duration: 0.03 });
}

// Hover effects
document.querySelectorAll('.cta-button').forEach(btn => {
    btn.addEventListener('mouseenter', () => gsap.to(btn, { scale: 1.02, duration: 0.2 }));
    btn.addEventListener('mouseleave', () => gsap.to(btn, { scale: 1, duration: 0.2 }));
});

// Sticky navigation visibility
const stickyNav = document.getElementById('stickyNav');
if (stickyNav) {
    let lastScrollY = 0;
    const heroHeight = document.querySelector('.hero')?.offsetHeight || window.innerHeight;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Show nav after scrolling past hero
        if (currentScrollY > heroHeight * 0.7) {
            stickyNav.classList.add('visible');
        } else {
            stickyNav.classList.remove('visible');
        }

        lastScrollY = currentScrollY;
    }, { passive: true });
}

// Card hover effects handled by CSS now for glassmorphism

// Resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (window.innerWidth >= 768) ScrollTrigger.refresh();
    }, 200);
});

console.log('DayPrism animations loaded v4 - Bold Maximalist');
