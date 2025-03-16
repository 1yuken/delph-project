<script setup>
import StarIcon from '@/icons/StarIcon.vue'

defineProps({
  specialist: {
    type: Object,
    required: true,
  },
})
</script>

<template>
    <div
      class="flex gap-4 items-center border border-[#C9C9C9] p-4 max-w-[900px] w-full cursor-pointer transition hover:bg-[#F9F9F9] hover:shadow-md hover:scale-102"
    >
      <img
        class="rounded-full w-25 h-25 object-cover"
        :src="specialist.image"
        alt="Аватар специалиста"
      />
      <div>
        <h2 class="text-xl text-[#222222]">{{ specialist.title }}</h2>
        <div class="flex gap-2">
          <p class="text-[#656565] text-sm">{{ specialist.username }}</p>
          <div>
            <span class="flex items-center text-[#656565] text-sm">
              {{ specialist.rating }}
              <StarIcon class="w-4 h-4" />
              <span class="text-xs">({{ specialist.reviewCount }})</span>
            </span>
          </div>
        </div>
        <div>
          <p>Стек:</p>
          <ul class="flex flex-wrap gap-2 mt-2">
            <li
              v-for="skill in specialist.skills"
              :key="skill"
              class="text-sm border border-[#C9C9C9] px-3 py-1 rounded-full"
            >
              {{ skill }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>