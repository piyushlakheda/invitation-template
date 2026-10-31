/**
 * High Performance Canvas Rose Petals & Golden Stardust Particle Engine
 * Harshita & Akash Engagement Invitation
 */

class PetalsEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.petals = [];
    this.sparkles = [];
    this.maxPetals = 38;
    this.maxSparkles = 25;
    this.wind = 0.4;
    this.windTarget = 0.4;
    this.mouseX = 0;
    this.mouseY = 0;

    this.colors = [
      { r: 242, g: 147, b: 170, a: 0.8 }, // Rose blush
      { r: 226, g: 110, b: 140, a: 0.75 }, // Jaipur pink
      { r: 200, g: 60, b: 90, a: 0.7 },    // Crimson petal
      { r: 255, g: 215, b: 225, a: 0.85 }, // Pale rose
    ];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });

    // Seed particles
    for (let i = 0; i < this.maxPetals; i++) {
      this.petals.push(this.createPetal(true));
    }

    for (let i = 0; i < this.maxSparkles; i++) {
      this.sparkles.push(this.createSparkle(true));
    }

    // Interactive breeze on mouse move
    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      const normalizedX = (e.clientX / window.innerWidth) - 0.5;
      this.windTarget = normalizedX * 1.5;
    }, { passive: true });

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  createPetal(randomY = false) {
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : -30,
      size: 10 + Math.random() * 14,
      aspectRatio: 1.2 + Math.random() * 0.5,
      speedY: 1.1 + Math.random() * 1.6,
      speedX: (Math.random() - 0.5) * 0.8,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03,
      flip: Math.random() * Math.PI,
      flipSpeed: 0.02 + Math.random() * 0.03,
      swayOffset: Math.random() * Math.PI * 2,
      swaySpeed: 0.015 + Math.random() * 0.02,
      color: color,
    };
  }

  createSparkle(randomY = false) {
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : -10,
      size: 1.5 + Math.random() * 2.5,
      speedY: 0.5 + Math.random() * 1.0,
      alpha: Math.random(),
      alphaSpeed: 0.015 + Math.random() * 0.025,
      alphaDir: Math.random() > 0.5 ? 1 : -1,
    };
  }

  drawPetal(p) {
    this.ctx.save();
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate(p.rotation);
    this.ctx.scale(1, Math.cos(p.flip));

    this.ctx.beginPath();
    // Organic teardrop / rose petal bezier path
    const w = p.size;
    const h = p.size * p.aspectRatio;
    
    this.ctx.moveTo(0, -h * 0.5);
    this.ctx.bezierCurveTo(w * 0.7, -h * 0.4, w * 0.7, h * 0.3, 0, h * 0.5);
    this.ctx.bezierCurveTo(-w * 0.7, h * 0.3, -w * 0.7, -h * 0.4, 0, -h * 0.5);

    const grad = this.ctx.createLinearGradient(0, -h * 0.5, 0, h * 0.5);
    grad.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.color.a})`);
    grad.addColorStop(1, `rgba(${p.color.r - 20}, ${p.color.g - 20}, ${p.color.b - 20}, ${p.color.a * 0.75})`);
    
    this.ctx.fillStyle = grad;
    this.ctx.fill();

    // Center vein highlight
    this.ctx.strokeStyle = `rgba(255, 255, 255, 0.25)`;
    this.ctx.lineWidth = 0.8;
    this.ctx.beginPath();
    this.ctx.moveTo(0, -h * 0.3);
    this.ctx.lineTo(0, h * 0.3);
    this.ctx.stroke();

    this.ctx.restore();
  }

  drawSparkle(s) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    this.ctx.fillStyle = `rgba(247, 219, 133, ${s.alpha * 0.75})`;
    this.ctx.shadowColor = 'rgba(212, 175, 55, 0.8)';
    this.ctx.shadowBlur = 8;
    this.ctx.fill();
    this.ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Smooth wind interpolation
    this.wind += (this.windTarget - this.wind) * 0.05;

    // Update & draw petals
    for (let i = 0; i < this.petals.length; i++) {
      const p = this.petals[i];
      p.swayOffset += p.swaySpeed;
      p.x += Math.sin(p.swayOffset) * 1.2 + this.wind + p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;
      p.flip += p.flipSpeed;

      this.drawPetal(p);

      // Wrap around when falling off bottom or sides
      if (p.y > this.height + 40 || p.x < -40 || p.x > this.width + 40) {
        this.petals[i] = this.createPetal(false);
      }
    }

    // Update & draw golden sparkles
    for (let i = 0; i < this.sparkles.length; i++) {
      const s = this.sparkles[i];
      s.y += s.speedY;
      s.x += this.wind * 0.5;
      s.alpha += s.alphaSpeed * s.alphaDir;

      if (s.alpha >= 1) {
        s.alpha = 1;
        s.alphaDir = -1;
      } else if (s.alpha <= 0.1) {
        s.alpha = 0.1;
        s.alphaDir = 1;
      }

      this.drawSparkle(s);

      if (s.y > this.height + 10) {
        this.sparkles[i] = this.createSparkle(false);
      }
    }

    requestAnimationFrame(this.animate);
  }
}

// Initialized when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new PetalsEngine('petalsCanvas');
});
