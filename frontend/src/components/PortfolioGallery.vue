<script setup>
import ViewIcon from '@/icons/ViewIcon.vue'

defineProps({
  projects: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <div>
    <h2 class="text-xl font-bold text-[#222222] mt-4">Портфолио</h2>
    <div v-if="projects.length" class="flex flex-wrap gap-4 mt-2">
      <div
        v-for="project in projects"
        :key="project.id"
        class="relative group w-[293px] h-[195px] overflow-hidden"
      >
        <img :src="project.image" alt="#" class="w-full h-full object-cover" />
        <div
          class="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer"
        >
          <p class="absolute bottom-4 left-4 text-white text-sm">{{ project.title }}</p>
          <span class="absolute bottom-4 right-4 text-white text-sm flex gap-2">
            <ViewIcon /> {{ project.views }}
          </span>
        </div>
      </div>
    </div>
    <div v-else class="mt-4 text-gray-500 text-center">Проектов не добавлено :(</div>
  </div>
</template>
