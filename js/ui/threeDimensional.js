/**
 * CALQIO 3D Spatial Canvas & Dynamic Interactive Tilt Engine
 * Renders smooth WebGL/Canvas 3D geometric math polyhedra (Icosahedron, Dodecahedron, Octahedron, Torus, Mobius loops)
 * plus interactive physics-based mouse tilt with specular holographic shine on cards.
 */

export const ThreeDimensionalEngine = {
  canvas: null,
  ctx: null,
  animId: null,
  polyhedra: [],
  particles: [],
  mouse: { x: 0, y: 0, targetX: 0, targetY: 0 },
  width: 0,
  height: 0,
  tiltCards: new WeakSet(),

  /**
   * Initializes the 3D Canvas Background and interactive tilt listeners
   */
  init() {
    this.createCanvas();
    this.init3DGeometry();
    this.bindEvents();
    this.animate();
    this.initTiltEffects();
  },

  createCanvas() {
    let existingCanvas = document.getElementById('calqio-3d-canvas');
    if (!existingCanvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'calqio-3d-canvas';
      this.canvas.className = 'calqio-3d-ambient-canvas';
      document.body.prepend(this.canvas);
    } else {
      this.canvas = existingCanvas;
    }
    this.ctx = this.canvas.getContext('2d');
    this.resize();
  },

  resize() {
    if (!this.canvas) return;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
  },

  /**
   * Generates mathematical 3D Wireframe Polyhedra
   */
  init3DGeometry() {
    this.polyhedra = [];
    this.particles = [];

    // 1. Floating 3D Geometric Mathematical Shapes placed gracefully in canvas corners/margins
    const shapes = [
      { type: 'icosahedron', x: this.width * 0.92, y: this.height * 0.18, size: 70, speedX: 0.002, speedY: 0.004, speedZ: 0.002, color: 'rgba(99, 102, 241, ' },
      { type: 'octahedron', x: this.width * 0.08, y: this.height * 0.32, size: 60, speedX: 0.003, speedY: -0.003, speedZ: 0.003, color: 'rgba(6, 182, 212, ' },
      { type: 'torus', x: this.width * 0.91, y: this.height * 0.78, size: 75, speedX: -0.002, speedY: 0.003, speedZ: 0.004, color: 'rgba(236, 72, 153, ' },
      { type: 'cube', x: this.width * 0.09, y: this.height * 0.82, size: 50, speedX: 0.004, speedY: 0.003, speedZ: -0.002, color: 'rgba(245, 158, 11, ' },
      { type: 'dodecahedron', x: this.width * 0.88, y: this.height * 0.48, size: 55, speedX: 0.002, speedY: 0.002, speedZ: 0.003, color: 'rgba(16, 185, 129, ' }
    ];

    shapes.forEach(shape => {
      this.polyhedra.push({
        ...shape,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        vertices: this.getVerticesForShape(shape.type, shape.size),
        edges: this.getEdgesForShape(shape.type),
        baseX: shape.x,
        baseY: shape.y,
        floatOffset: Math.random() * 100
      });
    });

    // 2. Ambient Floating Math Matrix Particles
    const particleCount = 45;
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        z: Math.random() * 600 - 300,
        size: Math.random() * 2.5 + 1,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.4,
        hue: Math.floor(Math.random() * 5),
        alpha: Math.random() * 0.5 + 0.2
      });
    }
  },

  getVerticesForShape(type, s) {
    if (type === 'cube') {
      return [
        [-s, -s, -s], [s, -s, -s], [s, s, -s], [-s, s, -s],
        [-s, -s, s],  [s, -s, s],  [s, s, s],  [-s, s, s]
      ];
    } else if (type === 'octahedron') {
      return [
        [0, -s * 1.3, 0], [0, s * 1.3, 0],
        [-s, 0, 0], [s, 0, 0],
        [0, 0, -s], [0, 0, s]
      ];
    } else if (type === 'icosahedron') {
      const phi = (1 + Math.sqrt(5)) / 2;
      const a = s * 0.8;
      const b = a / phi;
      return [
        [0, b, a], [0, b, -a], [0, -b, a], [0, -b, -a],
        [b, a, 0], [b, -a, 0], [-b, a, 0], [-b, -a, 0],
        [a, 0, b], [-a, 0, b], [a, 0, -b], [-a, 0, -b]
      ];
    } else if (type === 'dodecahedron') {
      const phi = (1 + Math.sqrt(5)) / 2;
      const a = s * 0.7;
      const b = a / phi;
      const c = a * phi;
      return [
        [-a, -a, -a], [-a, -a, a], [-a, a, -a], [-a, a, a],
        [a, -a, -a], [a, -a, a], [a, a, -a], [a, a, a],
        [0, -b, -c], [0, -b, c], [0, b, -c], [0, b, c],
        [-b, -c, 0], [-b, c, 0], [b, -c, 0], [b, c, 0],
        [-c, 0, -b], [c, 0, -b], [-c, 0, b], [c, 0, b]
      ];
    } else if (type === 'torus') {
      const vertices = [];
      const R = s;
      const r = s * 0.35;
      const segU = 8;
      const segV = 6;
      for (let i = 0; i < segU; i++) {
        const u = (i / segU) * Math.PI * 2;
        for (let j = 0; j < segV; j++) {
          const v = (j / segV) * Math.PI * 2;
          const x = (R + r * Math.cos(v)) * Math.cos(u);
          const y = (R + r * Math.cos(v)) * Math.sin(u);
          const z = r * Math.sin(v);
          vertices.push([x, y, z]);
        }
      }
      return vertices;
    }
    return [];
  },

  getEdgesForShape(type) {
    if (type === 'cube') {
      return [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7]
      ];
    } else if (type === 'octahedron') {
      return [
        [0, 2], [0, 3], [0, 4], [0, 5],
        [1, 2], [1, 3], [1, 4], [1, 5],
        [2, 4], [4, 3], [3, 5], [5, 2]
      ];
    } else if (type === 'icosahedron') {
      return [
        [0, 2], [0, 4], [0, 6], [0, 8], [0, 9],
        [1, 3], [1, 4], [1, 6], [1, 10], [1, 11],
        [2, 5], [2, 7], [2, 8], [2, 9],
        [3, 5], [3, 7], [3, 10], [3, 11],
        [4, 8], [4, 10], [5, 8], [5, 10],
        [6, 9], [6, 11], [7, 9], [7, 11],
        [8, 10], [9, 11]
      ];
    } else if (type === 'dodecahedron') {
      return [
        [0, 8], [0, 12], [0, 16],
        [1, 9], [1, 12], [1, 18],
        [2, 10], [2, 13], [2, 16],
        [3, 11], [3, 13], [3, 18],
        [4, 8], [4, 14], [4, 17],
        [5, 9], [5, 14], [5, 19],
        [6, 10], [6, 15], [6, 17],
        [7, 11], [7, 15], [7, 19],
        [8, 10], [9, 11],
        [12, 14], [13, 15],
        [16, 17], [18, 19]
      ];
    } else if (type === 'torus') {
      const edges = [];
      const segU = 8;
      const segV = 6;
      for (let i = 0; i < segU; i++) {
        for (let j = 0; j < segV; j++) {
          const idx = i * segV + j;
          const nextV = i * segV + ((j + 1) % segV);
          const nextU = ((i + 1) % segU) * segV + j;
          edges.push([idx, nextV]);
          edges.push([idx, nextU]);
        }
      }
      return edges;
    }
    return [];
  },

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.init3DGeometry();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / this.width - 0.5) * 2;
      this.mouse.targetY = (e.clientY / this.height - 0.5) * 2;
    });

    const observer = new MutationObserver(() => {
      this.initTiltEffects();
    });
    const mainEl = document.getElementById('app-main');
    if (mainEl) {
      observer.observe(mainEl, { childList: true, subtree: true });
    }
  },

  animate() {
    this.animId = requestAnimationFrame(() => this.animate());
    if (!this.ctx) return;

    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    this.ctx.clearRect(0, 0, this.width, this.height);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const baseOpacity = isDark ? 0.35 : 0.22;

    // 1. Render Floating Particles
    this.particles.forEach(p => {
      p.x += p.vx + this.mouse.x * 0.2;
      p.y += p.vy + this.mouse.y * 0.2;
      p.z += p.vz;

      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;
      if (p.z < -300) p.z = 300;
      if (p.z > 300) p.z = -300;

      const fov = 400;
      const scale = fov / (fov + p.z);
      const projX = p.x + (p.x - this.width / 2) * (scale - 1);
      const projY = p.y + (p.y - this.height / 2) * (scale - 1);

      this.ctx.beginPath();
      this.ctx.arc(projX, projY, Math.max(0.5, p.size * scale), 0, Math.PI * 2);

      let particleColor = `rgba(99, 102, 241, ${p.alpha * baseOpacity})`;
      if (p.hue === 1) particleColor = `rgba(139, 92, 246, ${p.alpha * baseOpacity})`;
      else if (p.hue === 2) particleColor = `rgba(236, 72, 153, ${p.alpha * baseOpacity})`;
      else if (p.hue === 3) particleColor = `rgba(6, 182, 212, ${p.alpha * baseOpacity})`;
      else if (p.hue === 4) particleColor = `rgba(16, 185, 129, ${p.alpha * baseOpacity})`;

      this.ctx.fillStyle = particleColor;
      this.ctx.fill();
    });

    // 2. Render 3D Floating Polyhedra
    const time = Date.now() * 0.001;
    this.polyhedra.forEach((poly) => {
      poly.rotX += poly.speedX;
      poly.rotY += poly.speedY;
      poly.rotZ += poly.speedZ;

      const floatY = Math.sin(time * 1.5 + poly.floatOffset) * 15;
      const targetPosX = poly.baseX + this.mouse.x * 25;
      const targetPosY = poly.baseY + floatY + this.mouse.y * 25;

      const cosX = Math.cos(poly.rotX);
      const sinX = Math.sin(poly.rotX);
      const cosY = Math.cos(poly.rotY);
      const sinY = Math.sin(poly.rotY);
      const cosZ = Math.cos(poly.rotZ);
      const sinZ = Math.sin(poly.rotZ);

      const projected = poly.vertices.map(v => {
        let x = v[0];
        let y = v[1];
        let z = v[2];

        let y1 = y * cosX - z * sinX;
        let z1 = y * sinX + z * cosX;

        let x2 = x * cosY + z1 * sinY;
        let z2 = -x * sinY + z1 * cosY;

        let x3 = x2 * cosZ - y1 * sinZ;
        let y3 = x2 * sinZ + y1 * cosZ;

        const fov = 350;
        const scale = fov / (fov + z2 + 100);
        return {
          x: targetPosX + x3 * scale,
          y: targetPosY + y3 * scale,
          z: z2,
          scale
        };
      });

      this.ctx.lineWidth = isDark ? 1.4 : 1.1;
      poly.edges.forEach(edge => {
        const p1 = projected[edge[0]];
        const p2 = projected[edge[1]];
        if (!p1 || !p2) return;

        const avgZ = (p1.z + p2.z) / 2;
        const edgeAlpha = Math.max(0.08, Math.min(0.7, (avgZ + 100) / 200)) * baseOpacity * 1.8;

        this.ctx.strokeStyle = `${poly.color}${edgeAlpha})`;
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();
      });

      projected.forEach(p => {
        const nodeAlpha = Math.max(0.1, (p.z + 100) / 200) * baseOpacity * 2.2;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, Math.max(1, 2.2 * p.scale), 0, Math.PI * 2);
        this.ctx.fillStyle = `${poly.color}${nodeAlpha})`;
        this.ctx.fill();
      });
    });
  },

  /**
   * 3D Physics-Based Mouse Parallax & Specular Glare Tilt for Cards
   */
  initTiltEffects() {
    const targets = document.querySelectorAll('.card, .calc-card, .stat-card, .domain-card, .featured-calculator-card, .discipline-chip, .pro-sci-console, .util-hero-card, .keypad-btn');

    targets.forEach(card => {
      if (this.tiltCards.has(card)) return;
      this.tiltCards.add(card);

      card.classList.add('tilt-3d-element');

      if (!card.querySelector('.tilt-glare-layer') && !card.classList.contains('keypad-btn')) {
        const glare = document.createElement('div');
        glare.className = 'tilt-glare-layer';
        card.style.position = 'relative';
        card.appendChild(glare);
      }

      let bounds;

      const onMouseEnter = () => {
        bounds = card.getBoundingClientRect();
      };

      const onMouseMove = (e) => {
        if (!bounds) bounds = card.getBoundingClientRect();
        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;

        const centerX = bounds.width / 2;
        const centerY = bounds.height / 2;

        const deltaX = (mouseX - centerX) / centerX;
        const deltaY = (mouseY - centerY) / centerY;

        const maxTilt = card.classList.contains('keypad-btn') ? 6 : 8;
        const rotateX = -deltaY * maxTilt;
        const rotateY = deltaX * maxTilt;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px) scale3d(1.015, 1.015, 1.015)`;

        const glareEl = card.querySelector('.tilt-glare-layer');
        if (glareEl) {
          const glareX = (mouseX / bounds.width) * 100;
          const glareY = (mouseY / bounds.height) * 100;
          glareEl.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 40%, transparent 70%)`;
          glareEl.style.opacity = '1';
        }
      };

      const onMouseLeave = () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)`;
        const glareEl = card.querySelector('.tilt-glare-layer');
        if (glareEl) {
          glareEl.style.opacity = '0';
        }
      };

      card.addEventListener('mouseenter', onMouseEnter);
      card.addEventListener('mousemove', onMouseMove);
      card.addEventListener('mouseleave', onMouseLeave);
    });
  }
};
