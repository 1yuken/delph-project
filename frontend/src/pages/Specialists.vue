<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, computed } from 'vue'
import SpecialistCard from '@/components/SpecialistCard.vue'

const sortOption = ref('recomended')

const specialists = ref([
  {
    id: 1,
    image: '/public/avatar-full.jpg',
    title: 'Разработка на Vue.js',
    username: 'yuken',
    rating: 5,
    reviewCount: 21,
    skills: ['Vue', 'JavaScript', 'Vite', 'Nuxt.js', 'TypeScript', 'SCSS', 'Docker'],
  },
  {
    id: 2,
    image: '/public/random2.jpg',
    title: 'Разработка на Vue.js',
    username: 'yuken',
    rating: 5,
    reviewCount: 21,
    skills: ['Vue', 'JavaScript', 'Vite', 'Nuxt.js', 'TypeScript', 'SCSS', 'Docker'],
  },
  {
    id: 3,
    image: '/public/random.jpg',
    title: 'Разработка на Vue.js',
    username: 'yuken',
    rating: 4,
    reviewCount: 23,
    skills: ['Vue', 'JavaScript', 'Vite', 'Nuxt.js', 'TypeScript', 'SCSS', 'Docker'],
  },
])

const sortedSpecialists = computed(() => {
  if (sortOption.value === 'new') {
    return [...specialists.value].reverse()
  }
  return specialists.value
})
</script>

<template>
  <div class="relative flex items-center w-3/5 m-auto py-5 gap-4">
    <div class="flex flex-col w-full">
      <h1 class="text-3xl font-bold text-[#222222] mb-4">Специалисты</h1>
      <div class="mb-2">
        <label class="mr-2 text-[#656565] text-sm">Сортировать:</label>
        <select
          v-model="sortOption"
          class="px-3 py-2 border border-gray-300 rounded-md text-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="recomended">рекомендуемые</option>
          <option value="new">новые</option>
        </select>
      </div>
      <div class="flex flex-col gap-4">
        <SpecialistCard
          v-for="specialist in sortedSpecialists"
          :key="specialist.id"
          :specialist="specialist"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
