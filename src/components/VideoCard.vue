<script setup>
import { computed } from 'vue'

const props = defineProps({
  video: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['play'])

const getYoutubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const videoId = computed(() => getYoutubeId(props.video.videoUrl));
const thumbnailUrl = computed(() => videoId.value ? `https://i.ytimg.com/vi/${videoId.value}/hqdefault.jpg` : '');
</script>

<template>
  <div class="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col cursor-pointer" @click="emit('play', { ...video, videoId: videoId })">
    <!-- Video Player -->
    <div class="block aspect-video bg-gray-200 relative overflow-hidden w-full">
      <img 
        v-if="thumbnailUrl"
        :src="thumbnailUrl" 
        :alt="video.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        onerror="this.src=this.src.replace('maxresdefault', 'hqdefault')"
      />
      <div v-else class="flex items-center justify-center w-full h-full text-gray-500">
        Invalid Video URL
      </div>
      
      <!-- Overlay Play Button -->
      <div v-if="videoId" class="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center pl-1.5 text-black shadow-lg transform scale-90 group-hover:scale-110 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8">
            <path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
      
      <!-- Category Badge -->
      <div class="absolute top-3 left-3 z-20 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-800 shadow-sm pointer-events-none">
        {{ video.category }}
      </div>
    </div>

    <!-- Content -->
    <div class="p-5 flex-1 flex flex-col">
      <div class="flex items-center gap-2 mb-2">
         <span v-for="tag in video.tags" :key="tag" class="text-xs font-medium text-primary bg-sky-50 px-2 py-0.5 rounded">
           #{{ tag }}
         </span>
      </div>
      <h3 class="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-primary transition-colors">
        {{ video.title }}
      </h3>
      <p class="text-sm text-gray-500 line-clamp-2">{{ video.description }}</p>
    </div>
  </div>
</template>
