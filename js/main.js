(function () {
    const svg = document.getElementById('cat');
    const lp = document.getElementById('lp');
    const rp = document.getElementById('rp');
    const pawL = document.getElementById('paw-l');
    const pawR = document.getElementById('paw-r');
    const armL = document.getElementById('arm-l');
    const armR = document.getElementById('arm-r');

    /* catbody.svg viewBox is 267 × 204 */
    const VW = 267, VH = 204;

    const EYES = [
        { el: lp, ox: 86, oy: 125 },
        { el: rp, ox: 181, oy: 125 },
    ];

    const PAWS = {
        l: { el: pawL, arm: armL, ox: 29, oy: 182 },
        r: { el: pawR, arm: armR, ox: 237, oy: 182 }
    };

    const MAX_EYE = 12;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let sx = VW / 2, sy = VH / 2;
    let grabState = { active: false, paw: null, startT: 0, targetX: 0, targetY: 0 };

    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
    });

    document.addEventListener('touchmove', e => {
        mx = e.touches[0].clientX; my = e.touches[0].clientY;
    }, { passive: true });

    function loop(now) {
        requestAnimationFrame(loop);

        const r = svg.parentElement.getBoundingClientRect();
        sx = (mx - r.left) / r.width * VW;
        sy = (my - r.top) / r.height * VH;

        // Update eyes
        EYES.forEach(({ el, ox, oy }) => {
            const dx = sx - ox;
            const dy = sy - oy;
            const dist = Math.hypot(dx, dy);
            const t = dist > 0 ? 1 - Math.exp(-dist / 40) : 0;
            const move = t * MAX_EYE;
            el.setAttribute('cx', (dist > 0 ? ox + dx / dist * move : ox).toFixed(2));
            el.setAttribute('cy', (dist > 0 ? oy + dy / dist * move : oy).toFixed(2));
        });

        // Update grab animation
        let dl = 0, dly = 0, dr = 0, dry = 0;

        if (grabState.active) {
            let elapsed = now - grabState.startT;
            if (elapsed < 150) {
                // Reaching
                let progress = Math.sin((elapsed / 150) * (Math.PI / 2));
                let pawInfo = PAWS[grabState.paw];
                let dx = grabState.targetX - pawInfo.ox;
                let dy = grabState.targetY - pawInfo.oy;
                if (grabState.paw === 'l') { dl = dx * progress; dly = dy * progress; }
                else { dr = dx * progress; dry = dy * progress; }
            } else if (elapsed < 450) {
                // Returning
                let progress = 1 - ((elapsed - 150) / 300);
                progress = progress * progress;
                let pawInfo = PAWS[grabState.paw];
                let dx = grabState.targetX - pawInfo.ox;
                let dy = grabState.targetY - pawInfo.oy;
                if (grabState.paw === 'l') { dl = dx * progress; dly = dy * progress; }
                else { dr = dx * progress; dry = dy * progress; }
            } else {
                grabState.active = false;
            }
        }

        // Apply transforms
        pawL.setAttribute('transform', `translate(${dl}, ${dly})`);
        armL.setAttribute('x2', PAWS.l.ox + dl);
        armL.setAttribute('y2', PAWS.l.oy + dly);

        pawR.setAttribute('transform', `translate(${dr}, ${dry})`);
        armR.setAttribute('x2', PAWS.r.ox + dr);
        armR.setAttribute('y2', PAWS.r.oy + dry);
    }
    requestAnimationFrame(loop);

    const MAX_REACH = 80;

    function scheduleGrab() {
        setTimeout(() => {
            if (!grabState.active) {
                let p = sx < VW / 2 ? 'l' : 'r';

                let originX = PAWS[p].ox;
                let originY = PAWS[p].oy;
                let dx = sx - originX;
                let dy = sy - originY;
                let dist = Math.hypot(dx, dy);

                if (dist > MAX_REACH) {
                    dx = (dx / dist) * MAX_REACH;
                    dy = (dy / dist) * MAX_REACH;
                }

                grabState = {
                    active: true,
                    paw: p,
                    startT: performance.now(),
                    targetX: originX + dx,
                    targetY: originY + dy
                };
            }
            scheduleGrab();
        }, 1500 + Math.random() * 3000);
    }
    scheduleGrab();
})();

// --- BLUR TEXT REVEAL ANIMATION ---
document.addEventListener("DOMContentLoaded", () => {
    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const bioText = document.querySelector('.bio p');
    if (bioText) {
        // Wrap each word in a span for stagger animation
        bioText.innerHTML = bioText.textContent.replace(/\S+/g, "<span class='blur-word' style='opacity:0.1;'>$&</span>");

        gsap.to('.blur-word', {
            scrollTrigger: {
                trigger: '.bio',
                start: 'top 85%',
                end: 'bottom 150%',
                scrub: 1, // Smooth scrubbing tied to scroll
            },
            opacity: 1,
            stagger: 0.1,
            ease: 'none'
        });
    }
});