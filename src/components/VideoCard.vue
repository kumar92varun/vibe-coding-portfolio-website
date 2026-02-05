<script setup>
defineProps({
  video: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
    <!-- Thumbnail -->
    <a :href="video.videoUrl" target="_blank" class="block aspect-video bg-gray-200 relative overflow-hidden">
      <img :src="video.thumbnail" :alt="video.title" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      
      <!-- Overlay Play Button -->
      <div class="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center pl-1 text-black shadow-lg transform scale-90 group-hover:scale-110 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
            <path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
      
      <!-- Category Badge -->
      <div class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-800 shadow-sm">
        {{ video.category }}
      </div>
    </a>

    <!-- Content -->
    <div class="p-5">
      <div class="flex items-center gap-2 mb-2">
         <span v-for="tag in video.tags" :key="tag" class="text-xs font-medium text-primary bg-sky-50 px-2 py-0.5 rounded">
           #{{ tag }}
         </span>
      </div>
      <h3 class="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-primary transition-colors">
        <a :href="video.videoUrl" target="_blank">{{ video.title }}</a>
      </h3>
      <p class="text-sm text-gray-500 line-clamp-2">{{ video.description }}</p>
    </div>
  </div>
</template>
