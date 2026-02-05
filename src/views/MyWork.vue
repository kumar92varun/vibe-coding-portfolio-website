<script setup>
import { ref, computed } from 'vue'
import VideoCard from '../components/VideoCard.vue'
import videosData from '../data/videos.json'

// State
const videos = ref(videosData)
const currentFilter = ref('All')

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
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-6">
      
      <!-- Page Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">My Portfolio</h1>
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
            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900'"
        >
          {{ category }}
        </button>
      </div>

      <!-- Video Grid -->
      <div v-if="filteredVideos.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <VideoCard 
          v-for="video in filteredVideos" 
          :key="video.id" 
          :video="video" 
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20">
        <p class="text-gray-500 text-lg">No videos found for this category.</p>
      </div>

    </div>
  </div>
</template>
