<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const heroRef = ref(null);
const canvasRef = ref(null);
let animationFrameId;
let mouse = { x: null, y: null };
let particles = [];

const colors = ['#EF476F', '#FFD166', '#06D6A0', '#118AB2', '#073B4C', '#87CEEB', '#9333EA', '#F472B6'];

class Particle {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.radius = Math.random() * 13 + 2; // 2px to 15px
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    
    // Higher base speed for "more speed" request
    this.vx = (Math.random() - 0.5) * 2; 
    this.vy = (Math.random() - 0.5) * 2;
    
    this.originalVx = this.vx;
    this.originalVy = this.vy;
  }

  update() {
    // If mouse is active (on screen)
    if (mouse.x != null && mouse.y != null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Move towards mouse
      // Simulating attraction force
      const forceDirectionX = dx / distance;
      const forceDirectionY = dy / distance;
      const force = 5; // Strength of attraction

      // Smoothly steer velocity towards target
      // This creates a "swarming" effect rather than instant snapping
      this.vx += forceDirectionX * 0.2; 
      this.vy += forceDirectionY * 0.2;

      // Cap max speed when chasing mouse
      const maxSpeed = 8;
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > maxSpeed) {
        this.vx = (this.vx / speed) * maxSpeed;
        this.vy = (this.vy / speed) * maxSpeed;
      }

    } else {
      // Return to random movement logic if mouse leaves
      // Add slight randomness to "forget" previous path but maintain momentum
      
      // Cap max wander speed
      const maxSpeed = 2;
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > maxSpeed) {
        this.vx = (this.vx / speed) * maxSpeed;
        this.vy = (this.vy / speed) * maxSpeed;
      }
      
      // Bounce off edges
      if (this.x + this.radius > this.canvasWidth || this.x - this.radius < 0) {
        this.vx = -this.vx;
      }
      if (this.y + this.radius > this.canvasHeight || this.y - this.radius < 0) {
        this.vy = -this.vy;
      }
    }

    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    // Lower opacity as requested implicitly by "background" and previous design
    ctx.globalAlpha = 0.6; 
    ctx.fill();
    ctx.globalAlpha = 1.0;
  }
}

const initParticles = (width, height) => {
  particles = [];
  for (let i = 0; i < 70; i++) {
    particles.push(new Particle(width, height));
  }
};

const animate = () => {
  if (!canvasRef.value) return;
  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach(particle => {
    particle.update();
    particle.draw(ctx);
  });
  
  animationFrameId = requestAnimationFrame(animate);
};

const handleMouseMove = (e) => {
  const rect = heroRef.value.getBoundingClientRect();
  // Store mouse pos relative to the hero section
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
};

const handleMouseLeave = () => {
  mouse.x = null;
  mouse.y = null;
  
  // Randomize velocities again slightly to ensure they spread out
  particles.forEach(p => {
    p.vx = (Math.random() - 0.5) * 2;
    p.vy = (Math.random() - 0.5) * 2;
  });
};

const handleResize = () => {
  if (heroRef.value && canvasRef.value) {
    const { offsetWidth, offsetHeight } = heroRef.value;
    canvasRef.value.width = offsetWidth;
    canvasRef.value.height = offsetHeight;
    // Re-init particles on resize to keep them within bounds? 
    // Or just update bounds. For simplicity, re-init.
    initParticles(offsetWidth, offsetHeight);
  }
};

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
  // Animate
  animate();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  cancelAnimationFrame(animationFrameId);
});
import ReelsShortsIcon from '../assets/reels-shorts-icon.png'
import FacelessIcon from '../assets/faceless-icon.png'
import TalkingHeadIcon from '../assets/talking-head-icon.png'
</script>

<template>
  <div class="bg-gray-50 overflow-hidden">
    <!-- Hero Section -->
    <section 
      ref="heroRef" 
      class="relative bg-white py-20 lg:py-32 border-b border-gray-100 overflow-hidden" 
      @mousemove="handleMouseMove" 
      @mouseleave="handleMouseLeave"
    >
      <!-- Canvas Background -->
      <canvas 
        ref="canvasRef" 
        class="absolute inset-0 z-0 pointer-events-none"
      ></canvas>

      <div class="container relative z-10 mx-auto px-6 text-center pointer-events-none">
        <!-- Re-enable pointer events for interactive children -->
        <div class="pointer-events-auto">
          <h1 class="text-4xl md:text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-8 tracking-tight">
            Focus on <span class="bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-purple-600">Creating</span>, <br>I’ll Handle the Editing
          </h1>
          <div class="bg-white/40 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-white/30 inline-block max-w-3xl mx-auto mb-12">
            <p class="text-xl lg:text-2xl text-gray-700 leading-relaxed">
              I help busy professionals finally launch their long-pending social media channels. You simply record your insights, and I handle the entire editing process - turning your passion into published content.
            </p>
          </div>
          <div class="flex flex-col sm:flex-row gap-5 justify-center">
            <RouterLink to="/work" class="btn-cta text-lg bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              See My Work
            </RouterLink>
            <!-- Contact Me link removed -->
          </div>
        </div>
      </div>
    </section>


    <!-- Services Section -->
    <section class="py-20">
      <div class="container mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold mb-4">What I Do</h2>
          <p class="text-gray-600 max-w-xl mx-auto">I offer end-to-end video editing services tailored to your needs.</p>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Service 1 -->
          <div class="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border-t-4 border-primary/20 hover:border-primary flex flex-col items-center text-center">
            <div class="bg-primary/10 w-[90px] h-[90px] rounded-lg flex items-center justify-center mb-4">
               <img :src="ReelsShortsIcon" alt="Reels & Shorts" class="w-full h-full object-contain p-2" />
            </div>
            <h3 class="text-xl font-bold mb-3">Reels & Shorts</h3>
            <p class="text-gray-600">Capture immediate attention with dynamic, short-form videos optimized for trends and high engagement across platforms like Instagram and YouTube.</p>
          </div>
          <!-- Service 2 -->
          <div class="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border-t-4 border-primary/20 hover:border-primary flex flex-col items-center text-center">
            <div class="bg-primary/10 w-[90px] h-[90px] rounded-lg flex items-center justify-center mb-4">
              <img :src="FacelessIcon" alt="Faceless Videos" class="w-full h-full object-contain p-2" />
            </div>
            <h3 class="text-xl font-bold mb-3">Faceless videos</h3>
            <p class="text-gray-600">Communicate your message effectively without needing to be on camera through professionally edited videos utilizing premium stock footage, motion graphics, and dynamic text.</p>
          </div>
          <!-- Service 3 -->
          <div class="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border-t-4 border-primary/20 hover:border-primary flex flex-col items-center text-center">
            <div class="bg-primary/10 w-[90px] h-[90px] rounded-lg flex items-center justify-center mb-4">
              <img :src="TalkingHeadIcon" alt="Talking Head Videos" class="w-full h-full object-contain p-2" />
            </div>
            <h3 class="text-xl font-bold mb-3">Talking head videos</h3>
            <p class="text-gray-600">Build authority and a personal connection with your audience while I handle the technical polish, transforming your raw insights into clean, professional, and highly watchable content.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
```
