// Terminal typing effect
const lines = [
    { text: "whoami", type: "cmd" },
    { text: "Samridhi — Full-Stack Web Developer", type: "out" },
    { text: "cat skills.json", type: "cmd" },
    { text: '["React", "Next.js", "Node.js", "Express", "MongoDB"]', type: "out" },
    { text: "echo $STATUS", type: "cmd" },
    { text: "Open to Frontend / Full-Stack roles", type: "out", accent: true }
];
const el = document.getElementById('terminal-text');
let li = 0, ci = 0;
function typeLine() {
    if (li >= lines.length) { el.innerHTML += `<div><span class="cursor"></span></div>`; return; }
    const line = lines[li];
    const prefix = line.type === 'cmd' ? '<span style="color:var(--teal)">➜</span> ' : '';
    const color = line.accent ? 'var(--pink)' : (line.type === 'cmd' ? 'var(--text)' : 'var(--muted)');
    const rowId = `row-${li}`;
    el.innerHTML += `<div id="${rowId}">${prefix}<span style="color:${color}"></span></div>`;
    const span = document.getElementById(rowId).querySelector('span:last-child');
    ci = 0;
    const speed = line.type === 'cmd' ? 55 : 18;
    function typeChar() {
        if (ci < line.text.length) { span.textContent += line.text[ci]; ci++; setTimeout(typeChar, speed); }
        else { li++; setTimeout(typeLine, 280); }
    }
    typeChar();
}
typeLine();

// Generic scroll reveal
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.15 });
reveals.forEach(r => io.observe(r));

// Count-up stats
(function () {
    const stats = document.querySelectorAll('.stat-num');
    const statIO = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const el = e.target;
                const target = parseFloat(el.dataset.target);
                const suffix = el.dataset.suffix || '';
                const decimals = el.dataset.decimal ? parseInt(el.dataset.decimal) : 0;
                let start = null; const duration = 1400;
                function step(ts) {
                    if (!start) start = ts;
                    const p = Math.min((ts - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - p, 3);
                    const val = eased * target;
                    el.textContent = decimals ? val.toFixed(decimals) + suffix : Math.round(val) + suffix;
                    if (p < 1) requestAnimationFrame(step);
                }
                requestAnimationFrame(step);
                statIO.unobserve(el);
            }
        });
    }, { threshold: 0.4 });
    stats.forEach(s => statIO.observe(s));
})();

// Achievements list stagger
(function () {
    const items = document.querySelectorAll('#achieve-list li');
    const aIO = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const idx = Array.from(items).indexOf(e.target);
                setTimeout(() => e.target.classList.add('in'), idx * 120);
                aIO.unobserve(e.target);
            }
        });
    }, { threshold: 0.2 });
    items.forEach(i => aIO.observe(i));
})();

// Timeline stagger
(function () {
    const items = document.querySelectorAll('#timeline .tl-item');
    const tIO = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const idx = Array.from(items).indexOf(e.target);
                setTimeout(() => e.target.classList.add('in'), idx * 150);
                tIO.unobserve(e.target);
            }
        });
    }, { threshold: 0.2 });
    items.forEach(i => tIO.observe(i));
})();

// Skill cards: gradients, ring fill, counting numbers, tilt
(function () {
    const defs = document.getElementById('gradient-defs');
    const cards = document.querySelectorAll('.skill-card');
    const CIRCUMFERENCE = 326.7;
    cards.forEach((card, i) => {
        const [c1, c2] = card.dataset.color.split(',');
        const gradId = `skillGrad${i}`;
        const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        grad.setAttribute('id', gradId); grad.setAttribute('x1', '0%'); grad.setAttribute('y1', '0%'); grad.setAttribute('x2', '100%'); grad.setAttribute('y2', '100%');
        grad.innerHTML = `<stop offset="0%" stop-color="#${c1}"/><stop offset="100%" stop-color="#${c2}"/>`;
        defs.appendChild(grad);
        card.querySelector('.ring-fill').style.stroke = `url(#${gradId})`;
    });
    function animateCard(card) {
        const pct = parseInt(card.dataset.pct, 10);
        const ring = card.querySelector('.ring-fill');
        const numEl = card.querySelector('.pct-num');
        const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;
        requestAnimationFrame(() => { ring.style.strokeDashoffset = offset; });
        let start = null; const duration = 1300;
        function step(ts) {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            numEl.textContent = Math.round(eased * pct);
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }
    const skillIO = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) {
                const idx = Array.from(cards).indexOf(e.target);
                setTimeout(() => { e.target.classList.add('in'); animateCard(e.target); }, idx * 90);
                skillIO.unobserve(e.target);
            }
        });
    }, { threshold: 0.25 });
    cards.forEach(c => skillIO.observe(c));

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(hover: none)').matches;
    if (!reduceMotion && !isTouch) {
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const px = (e.clientX - rect.left) / rect.width - 0.5;
                const py = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = `translateY(0) rotateX(${py * -12}deg) rotateY(${px * 12}deg) scale(1.03)`;
            });
            card.addEventListener('mouseleave', () => { card.style.transform = 'translateY(0) rotateX(0) rotateY(0) scale(1)'; });
        });
    }
})();

// Tech marquee (built from devicon CDN, duplicated for seamless loop)
(function () {
    const icons = [
        ['html5', 'HTML'], ['css3', 'CSS'], ['javascript', 'JavaScript'], ['react', 'React'],
        ['nodejs', 'Node.js'], ['express', 'Express'], ['mongodb', 'MongoDB'], ['tailwindcss', 'Tailwind'],
        ['git', 'Git'], ['github', 'original', 'GitHub'], ['nextjs', 'original', 'Next.js']
    ];
    const track = document.getElementById('marquee-track');
    const iconDefs = [
        { slug: 'html5', variant: 'original' }, { slug: 'css3', variant: 'original' }, { slug: 'javascript', variant: 'original' },
        { slug: 'react', variant: 'original' }, { slug: 'nodejs', variant: 'original' }, { slug: 'express', variant: 'original' },
        { slug: 'mongodb', variant: 'original' }, { slug: 'tailwindcss', variant: 'original' }, { slug: 'git', variant: 'original' },
        { slug: 'github', variant: 'original' }, { slug: 'nextjs', variant: 'original' }
    ];
    function buildSet() {
        return iconDefs.map(d => `<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${d.slug}/${d.slug}-${d.variant}.svg" alt="${d.slug}" loading="lazy">`).join('');
    }
    track.innerHTML = buildSet() + buildSet();
})();

// Project cards: staggered slide-rotate-settle
const projectEls = document.querySelectorAll('.project-reveal');
const io3 = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
        if (e.isIntersecting) {
            const idx = Array.from(projectEls).indexOf(e.target);
            setTimeout(() => e.target.classList.add('in'), idx * 130);
            io3.unobserve(e.target);
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
projectEls.forEach(el => io3.observe(el));

// Card tilt-glow radial tracking
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
});

// Magnetic buttons
document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
});

// Contact form: ripple + mailto handoff
(function () {
    const form = document.getElementById('contact-form');
    const btn = document.getElementById('submit-btn');
    const success = document.getElementById('form-success');
    btn.addEventListener('click', (e) => {
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = (e.clientX - rect.left) + 'px';
        ripple.style.top = (e.clientY - rect.top) + 'px';
        ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + 'px';
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 650);
    });
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('f-name').value;
        const email = document.getElementById('f-email').value;
        const msg = document.getElementById('f-message').value;
        const subject = encodeURIComponent(`Portfolio contact from ${name}`);
        const body = encodeURIComponent(`${msg}\n\n— ${name} (${email})`);
        window.location.href = `mailto:guptasamridhi98@gmail.com?subject=${subject}&body=${body}`;
        success.classList.add('show');
    });
})();

// Ambient particle field
(function () {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function resize() { w = canvas.width = window.innerWidth; h = canvas.height = document.body.scrollHeight; }
    function init() {
        resize();
        const count = Math.min(70, Math.floor(w / 22));
        particles = Array.from({ length: count }, () => ({
            x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.6 + 0.4,
            vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.15,
            hue: Math.random() > 0.5 ? '124,58,237' : '6,214,160'
        }));
    }
    function tick() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.hue},0.5)`; ctx.fill();
        });
        if (!reduceMotion) requestAnimationFrame(tick);
    }
    if (!reduceMotion) { init(); tick(); window.addEventListener('resize', init); }
})();

// Mobile nav / hero grid responsiveness
function handleResize() {
    const links = document.querySelectorAll('.hidden-mobile');
    links.forEach(l => l.style.display = window.innerWidth < 640 ? 'none' : 'flex');
    const grid = document.getElementById('hero-grid');
    grid.style.gridTemplateColumns = window.innerWidth < 900 ? '1fr' : '1.1fr 1fr';
}
window.addEventListener('resize', handleResize);
handleResize();