<script setup>
import { ref, computed } from 'vue'
import VideoCard from '../components/VideoCard.vue'
import videosData from '../data/videos.json'

// State
const videos = ref(videosData)
const currentFilter = ref('All')
const selectedVideoId = ref(null)

// Extract unique categories for filter buttons
const categories = computed(() => {
  const cats = new Set(videos.value.map(v => v.category))
  return ['All', ...Array.from(cats)]
})

// Filtered videos
const filteredVideos = computed(() => {
  if (currentFilter.value === 'All') {
    return videos.value
  }
  return videos.value.filter(video => video.category === currentFilter.value)
})

const setFilter = (category) => {
  currentFilter.value = category
}

const openModal = (videoInfo) => {
  if (videoInfo && videoInfo.videoId) {
    selectedVideoId.value = videoInfo.videoId
    document.body.style.overflow = 'hidden' // Prevent bg scrolling
  }
}

const closeModal = () => {
  selectedVideoId.value = null
  document.body.style.overflow = '' // Restore bg scrolling
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 pt-28 pb-12">
    <div class="container mx-auto px-6">
      
      <!-- Page Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">My Work</h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Browse through my latest video editing projects, featuring vlogs, commercials, and social media content.
        </p>
      </div>

      <!-- Filter Bar -->
      <div class="flex flex-wrap justify-center gap-3 mb-12">
        <button 
          v-for="category in categories" 
          :key="category"
          @click="setFilter(category)"
          class="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border cursor-pointer"
          :class="currentFilter === category 
            ? 'bg-primary text-white border-primary shadow-md' 
            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900 shadow-sm hover:shadow-md'"
        >
          {{ category }}
        </button>
      </div>

      <!-- Video Grid -->
      <h2 class="sr-only">Video Gallery</h2>
      <div v-if="filteredVideos.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <VideoCard 
          v-for="(video, index) in filteredVideos" 
          :key="index" 
          :video="video"
          @play="openModal"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20">
        <p class="text-gray-500 text-lg">No videos found for this category.</p>
      </div>

    </div>

    <!-- Video Modal -->
    <div 
      v-if="selectedVideoId" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div class="relative w-full max-w-5xl bg-black rounded-lg shadow-2xl overflow-hidden aspect-video">
        <!-- Close Button -->
        <button 
          @click="closeModal" 
          class="absolute top-4 right-4 z-10 p-2 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-all duration-200"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <!-- YouTube Iframe -->
        <iframe 
          v-if="selectedVideoId"
          :src="`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1`" 
          title="YouTube video player" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen
          class="w-full h-full"
        ></iframe>
      </div>
    </div>
  </div>
</template>
