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
          <h1 class="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-8 tracking-tight">
            Taking the <span class="bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-purple-600">Pain</span> Out of <br>Video Creation
          </h1>
          <p class="text-xl lg:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            I help creators and professionals edit, polish, and publish high-quality videos for YouTube and social media. You film, I handle the rest.
          </p>
          <div class="flex flex-col sm:flex-row gap-5 justify-center">
            <RouterLink to="/work" class="btn-cta text-lg bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              See My Work
            </RouterLink>
            <a href="https://wa.me/919910843251" target="_blank" class="px-8 py-4 rounded-xl font-semibold border-2 border-gray-200 hover:border-primary hover:text-primary transition-all hover:bg-sky-50">
              Contact Me
            </a>
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
          <div class="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border-t-4 border-primary/20 hover:border-primary">
            <div class="w-12 h-12 bg-sky-50 rounded-lg flex items-center justify-center mb-6 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-3">YouTube Vlogs</h3>
            <p class="text-gray-600">Engaging storytelling, smooth cuts, and sound design to keep your audience watching.</p>
          </div>
          <!-- Service 2 -->
          <div class="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border-t-4 border-primary/20 hover:border-primary">
            <div class="w-12 h-12 bg-sky-50 rounded-lg flex items-center justify-center mb-6 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                 <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-3">Reels & Shorts</h3>
            <p class="text-gray-600">Fast-paced, vertical content optimized for Instagram Reels, TikTok, and YouTube Shorts.</p>
          </div>
          <!-- Service 3 -->
          <div class="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border-t-4 border-primary/20 hover:border-primary">
            <div class="w-12 h-12 bg-sky-50 rounded-lg flex items-center justify-center mb-6 text-primary">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-3">Corporate & Interviews</h3>
            <p class="text-gray-600">Professional editing for interviews, podcasts, and corporate presentations.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- About Snippet -->
    <section class="bg-white py-20 border-t border-gray-100">
      <div class="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
         <!-- Placeholder for Image or Graphic -->
        <div class="w-full md:w-1/2 aspect-video bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400">
           <!-- Ideally an image of Anshul or a workspace setup -->
           <span class="text-lg">Anshul's Workspace / Photo</span>
        </div>
        <div class="w-full md:w-1/2">
          <h2 class="text-3xl font-bold mb-6">About Me</h2>
          <p class="text-gray-600 mb-6 leading-relaxed">
            Hi, I'm Anshul. I've been editing videos for over X years. My passion is storytelling through cuts, color, and sound. I understand the pressure of content creation, which is why I aim to be your reliable partner in the post-production process.
          </p>
           <RouterLink to="/work" class="text-primary font-medium hover:underline">
            View My Portfolio &rarr;
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>
