<script setup>
// import { Eye, ExternalLink } from 'lucide-vue-next'

defineProps({
  projects: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-[#222222]">Портфолио</h2>
      <button class="text-sm text-[#0A65CC] font-medium hover:underline flex items-center gap-1">
        Все проекты
        <ExternalLink class="w-3.5 h-3.5" />
      </button>
    </div>
    
    <div v-if="projects.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="project in projects"
        :key="project.id"
        class="relative group overflow-hidden rounded-lg border border-[#E5E9F2] shadow-sm"
      >
        <div class="aspect-video overflow-hidden">
          <img 
            :src="project.image" 
            alt="Изображение проекта" 
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
          />
        </div>
        
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div class="absolute bottom-0 left-0 right-0 p-4">
            <h3 class="text-white font-medium mb-1">{{ project.title }}</h3>
            <div class="flex items-center gap-1.5 text-white/80 text-sm">
              <Eye class="w-4 h-4" />
              <span>{{ project.views }}</span>
            </div>
          </div>
        </div>
        
        <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button class="bg-white/90 p-2 rounded-full hover:bg-white transition-colors">
            <ExternalLink class="w-4 h-4 text-[#222222]" />
          </button>
        </div>
      </div>
    </div>
    
    <div v-else class="py-10 text-center bg-[#F9F9F9] rounded-lg border border-[#E5E9F2]">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-3 text-[#656565]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p class="text-[#656565] mb-2">Проектов не добавлено</p>
      <p class="text-sm text-[#656565]">Портфолио находится в разработке</p>
    </div>
  </div>
</template>