/**
 * Educational Floating Elements — Guaranteed Full-Page Visibility
 * Uses DOM-based CSS animations (no 3D camera math needed)
 * Shapes are placed as position:absolute across the full document height
 */

function initHero3D() {
    const isContact = document.body.getAttribute('data-page') === 'contact'
        || window.location.pathname.toLowerCase().includes('contact');

    // ── 1. SPACE / GALAXY (Contact page) ──────────────────────────────────
    if (isContact) {
        // Wait safely for THREE to load since it might come asynchronously or after a hard refresh
        let attempts = 0;
        const checkThree = setInterval(() => {
            attempts++;
            if (typeof THREE !== 'undefined' && document.getElementById('hero-3d-container')) {
                clearInterval(checkThree);
                initSpaceCanvas();
            } else if (attempts > 50) {
                clearInterval(checkThree); // Abort after 2.5 seconds
            }
        }, 50);
        return;
    }

    // ── 2. EDUCATIONAL FLOATING SHAPES (All other pages) ─────────────────
    setTimeout(() => initFloatingShapes(), 200);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHero3D);
} else {
    initHero3D();
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   EDUCATIONAL SHAPES — FIXED VIEWPORT (always visible everywhere)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function initFloatingShapes() {
    const container = document.getElementById('hero-3d-container');
    if (!container) return;

    // FIXED to viewport — scroll doesn't matter, shapes always visible
    container.style.cssText = `
        position: fixed !important;
        top: 0; left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 0;
        pointer-events: none;
        overflow: hidden;
    `;

    // Theme colors
    const getColors = () => {
        const t = localStorage.getItem('theme') || 'modern';
        return {
            modern: ['#4338ca', '#818cf8', '#6366f1'],
            green: ['#059669', '#34d399', '#10b981'],
            midnight: ['#7c3aed', '#c084fc', '#a855f7'],
            sunset: ['#ea580c', '#fdba74', '#f97316'],
            ocean: ['#0891b2', '#67e8f9', '#0ea5e9'],
            gray: ['#334155', '#94a3b8', '#64748b'],
        }[t] || ['#4338ca', '#818cf8', '#6366f1'];
    };

    // SVG shapes
    const SHAPES = [
        (c) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="none" stroke="${c}" stroke-width="2" opacity="0.75"/>
            <ellipse cx="50" cy="50" rx="20" ry="45" fill="none" stroke="${c}" stroke-width="1.5" opacity="0.5"/>
            <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="${c}" stroke-width="1.5" opacity="0.5"/>
            <line x1="5" y1="50" x2="95" y2="50" stroke="${c}" stroke-width="1" opacity="0.4"/>
            <line x1="50" y1="5" x2="50" y2="95" stroke="${c}" stroke-width="1" opacity="0.4"/>
        </svg>`,
        (c) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="8" fill="${c}" opacity="0.9"/>
            <ellipse cx="50" cy="50" rx="45" ry="18" fill="none" stroke="${c}" stroke-width="2" opacity="0.65"/>
            <ellipse cx="50" cy="50" rx="45" ry="18" fill="none" stroke="${c}" stroke-width="2" opacity="0.65" transform="rotate(60 50 50)"/>
            <ellipse cx="50" cy="50" rx="45" ry="18" fill="none" stroke="${c}" stroke-width="2" opacity="0.65" transform="rotate(120 50 50)"/>
        </svg>`,
        (c) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <polygon points="50,5 95,90 5,90" fill="none" stroke="${c}" stroke-width="2.5" opacity="0.75"/>
            <polygon points="50,25 80,80 20,80" fill="none" stroke="${c}" stroke-width="1.5" opacity="0.4"/>
        </svg>`,
        (c) => `<svg viewBox="0 0 40 120" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="10" width="20" height="80" rx="3" fill="${c}" opacity="0.7"/>
            <polygon points="10,90 30,90 20,115" fill="${c}" opacity="0.5"/>
            <rect x="10" y="6" width="20" height="8" rx="2" fill="${c}" opacity="0.9"/>
        </svg>`,
        (c) => `<svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg">
            <line x1="40" y1="45" x2="10" y2="5" stroke="${c}" stroke-width="4" stroke-linecap="round" opacity="0.8"/>
            <line x1="40" y1="45" x2="70" y2="5" stroke="${c}" stroke-width="4" stroke-linecap="round" opacity="0.8"/>
            <circle cx="15" cy="72" r="15" fill="none" stroke="${c}" stroke-width="3" opacity="0.7"/>
            <circle cx="65" cy="72" r="15" fill="none" stroke="${c}" stroke-width="3" opacity="0.7"/>
            <line x1="40" y1="45" x2="15" y2="58" stroke="${c}" stroke-width="3" opacity="0.6"/>
            <line x1="40" y1="45" x2="65" y2="58" stroke="${c}" stroke-width="3" opacity="0.6"/>
        </svg>`,
        (c) => `<svg viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="5" width="110" height="65" rx="5" fill="none" stroke="${c}" stroke-width="3" opacity="0.8"/>
            <rect x="12" y="12" width="96" height="50" rx="2" fill="${c}" opacity="0.12"/>
            <rect x="45" y="72" width="30" height="8" rx="2" fill="${c}" opacity="0.6"/>
            <rect x="30" y="78" width="60" height="5" rx="2" fill="${c}" opacity="0.5"/>
        </svg>`,
        (c) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <polygon points="50,5 90,27 90,73 50,95 10,73 10,27" fill="none" stroke="${c}" stroke-width="2.5" opacity="0.75"/>
            <polygon points="50,20 78,35 78,65 50,80 22,65 22,35" fill="none" stroke="${c}" stroke-width="1.5" opacity="0.4"/>
        </svg>`,
    ];

    // Inject CSS keyframes once
    if (!document.getElementById('float-keyframes')) {
        const s = document.createElement('style');
        s.id = 'float-keyframes';
        s.textContent = `
            @keyframes floatUp {
                0%   { opacity: 0;    transform: translateY(20px)  rotate(0deg)           scale(0.85); }
                15%  { opacity: 0.6; }
                50%  { opacity: 0.7;  transform: translateY(-15px) rotate(var(--r2))      scale(1.05); }
                85%  { opacity: 0.6; }
                100% { opacity: 0;    transform: translateY(-40px) rotate(var(--r-end))   scale(0.85); }
            }
        `;
        document.head.appendChild(s);
    }

    let colors = getColors();
    const TOTAL = 55; // shapes always on screen simultaneously

    // Spawn a single shape element at a random viewport position
    const spawnShape = () => {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const svg = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        const size = 15 + Math.random() * 35;          // 15–50px
        const left = Math.random() * (window.innerWidth - size);
        const top = Math.random() * (window.innerHeight - size);
        const dur = 5 + Math.random() * 10;             // 5–15s lifespan
        const r2 = (Math.random() > 0.5 ? 1 : -1) * (90 + Math.random() * 90);
        const rEnd = r2 + (Math.random() > 0.5 ? 1 : -1) * (60 + Math.random() * 60);

        const el = document.createElement('div');
        el.style.cssText = `
            position: absolute;
            left: ${left}px;
            top: ${top}px;
            width: ${size}px;
            height: ${size}px;
            opacity: 0;
            animation: floatUp ${dur}s ease-in-out forwards;
            --r2: ${r2}deg;
            --r-end: ${rEnd}deg;
            will-change: transform, opacity;
            filter: blur(2px);
        `;
        el.innerHTML = svg(color);
        container.appendChild(el);

        // Remove element after animation, then spawn a replacement
        setTimeout(() => {
            el.remove();
            spawnShape();
        }, dur * 1000 + 100);
    };

    // Seed all initial shapes with staggered start times
    container.innerHTML = '';
    for (let i = 0; i < TOTAL; i++) {
        setTimeout(spawnShape, i * (6000 / TOTAL));
    }

    // When theme changes, update color palette for new spawns
    new MutationObserver(() => { colors = getColors(); })
        .observe(document.body, { attributes: true, attributeFilter: ['class'] });
}





/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SPACE CANVAS — Real 3D Earth + Galaxy (Contact page)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function initSpaceCanvas() {
    const container = document.getElementById('hero-3d-container');
    if (!container || typeof THREE === 'undefined') return;

    container.style.cssText = `
        position: fixed !important;
        top: 0; left: 0; width: 100vw; height: 100vh;
        z-index: -10; pointer-events: none;
    `;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#00000f');

    const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100000);
    camera.position.set(0, 20, 280);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // ── Stars on a sphere shell ────────────────────────────
    const COUNT = 25000;
    const sGeo = new THREE.BufferGeometry();
    const sPos = new Float32Array(COUNT * 3);
    const sCol = new Float32Array(COUNT * 3);
    const pal = [
        new THREE.Color(0xffffff), new THREE.Color(0xaaddff),
        new THREE.Color(0xddaaff), new THREE.Color(0xffddaa),
        new THREE.Color(0x88eeff)
    ];
    for (let i = 0; i < COUNT; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 8000 + Math.random() * 2000;
        sPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        sPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        sPos[i * 3 + 2] = r * Math.cos(phi);
        const c = pal[Math.floor(Math.random() * pal.length)];
        sCol[i * 3] = c.r; sCol[i * 3 + 1] = c.g; sCol[i * 3 + 2] = c.b;
    }
    sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    sGeo.setAttribute('color', new THREE.BufferAttribute(sCol, 3));
    scene.add(new THREE.Points(sGeo, new THREE.PointsMaterial({
        size: 2.5, vertexColors: true, transparent: true,
        opacity: 0.9, blending: THREE.AdditiveBlending, sizeAttenuation: false
    })));

    // ── Milky Way band ─────────────────────────────────────
    const mw = new THREE.Mesh(
        new THREE.TorusGeometry(5000, 900, 4, 80),
        new THREE.MeshBasicMaterial({ color: 0x334499, transparent: true, opacity: 0.07, side: THREE.BackSide })
    );
    mw.rotation.x = Math.PI / 2.5;
    scene.add(mw);

    // ── Bright Glowing Stars (Instead of Nebula Blobs) ─────────────────────
    const B_COUNT = 800;
    const bsGeo = new THREE.BufferGeometry();
    const bsPos = new Float32Array(B_COUNT * 3);
    const bsCol = new Float32Array(B_COUNT * 3);
    const bColors = [
        new THREE.Color(0xffffff), new THREE.Color(0xaaddff),
        new THREE.Color(0xffaaaa), new THREE.Color(0xaaffaa)
    ];
    for (let i = 0; i < B_COUNT; i++) {
        const r = 2000 + Math.random() * 6000;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        bsPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        bsPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        bsPos[i * 3 + 2] = r * Math.cos(phi);

        const c = bColors[Math.floor(Math.random() * bColors.length)];
        bsCol[i * 3] = c.r; bsCol[i * 3 + 1] = c.g; bsCol[i * 3 + 2] = c.b;
    }
    bsGeo.setAttribute('position', new THREE.BufferAttribute(bsPos, 3));
    bsGeo.setAttribute('color', new THREE.BufferAttribute(bsCol, 3));
    scene.add(new THREE.Points(bsGeo, new THREE.PointsMaterial({
        size: 5.5, // Larger size for bright stars
        vertexColors: true, transparent: true,
        opacity: 0.95, blending: THREE.AdditiveBlending, sizeAttenuation: true
    })));

    // ── Earth Globe ────────────────────────────────────────
    const earthGroup = new THREE.Group();
    earthGroup.position.set(55, -45, 0);
    scene.add(earthGroup);

    const texLoader = new THREE.TextureLoader();
    texLoader.crossOrigin = 'anonymous';

    // Earth material — diffuse base without blinding specular reflection
    const earthMat = new THREE.MeshLambertMaterial({
        color: 0x1a6b9e, emissive: 0x001133
    });
    const earthMesh = new THREE.Mesh(new THREE.SphereGeometry(100, 56, 56), earthMat);
    earthGroup.add(earthMesh);

    // Globe Grid overlay (represents boundaries/map grid)
    const gridMat = new THREE.MeshBasicMaterial({
        color: 0x4499ff,
        wireframe: true,
        transparent: true,
        opacity: 0.12
    });
    const globeGrid = new THREE.Mesh(new THREE.SphereGeometry(101.5, 32, 24), gridMat);
    earthGroup.add(globeGrid);

    texLoader.load(
        'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
        (tex) => { earthMat.map = tex; earthMat.needsUpdate = true; }
    );

    // Cloud layer
    const cloudMat = new THREE.MeshPhongMaterial({ transparent: true, opacity: 0.38, depthWrite: false });
    const cloudMesh = new THREE.Mesh(new THREE.SphereGeometry(101.8, 56, 56), cloudMat);
    earthGroup.add(cloudMesh);
    texLoader.load(
        'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png',
        (tex) => { cloudMat.map = tex; cloudMat.needsUpdate = true; }
    );

    // Blue atmosphere halo
    earthGroup.add(new THREE.Mesh(
        new THREE.SphereGeometry(110, 48, 48),
        new THREE.MeshPhongMaterial({ color: 0x1177ee, transparent: true, opacity: 0.13, side: THREE.BackSide, blending: THREE.AdditiveBlending })
    ));
    earthGroup.add(new THREE.Mesh(
        new THREE.SphereGeometry(118, 48, 48),
        new THREE.MeshPhongMaterial({ color: 0x0055cc, transparent: true, opacity: 0.05, side: THREE.BackSide, blending: THREE.AdditiveBlending })
    ));

    // ── Lighting ───────────────────────────────────────────
    const sun = new THREE.DirectionalLight(0xfff5e0, 2.8);
    sun.position.set(400, 120, 200);
    scene.add(sun);
    scene.add(new THREE.AmbientLight(0x112244, 0.55));
    const rim = new THREE.DirectionalLight(0x2244bb, 0.35);
    rim.position.set(-200, 0, -100);
    scene.add(rim);

    // ── Animation ──────────────────────────────────────────
    const animate = () => {
        requestAnimationFrame(animate);
        earthMesh.rotation.y += 0.0007;
        cloudMesh.rotation.y += 0.0009;
        cloudMesh.rotation.x += 0.00008;
        earthGroup.rotation.y += 0.00004;
        mw.rotation.z += 0.00004;
        renderer.render(scene, camera);
    };
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(innerWidth, innerHeight);
    });
}
