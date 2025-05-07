<script setup>
import { ref } from 'vue'
import StarIcon from '@/icons/StarIcon.vue'
import CalendarIcon from '@/icons/CalendarIcon.vue'
import CheckIcon from '@/icons/CheckIcon.vue'
// import { Calendar, CheckCircle } from 'lucide-vue-next'

defineProps({
  specialist: {
    type: Object,
    required: true,
  },
})

const isHovered = ref(false)

// Форматирование даты последней активности
const formatLastActive = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return 'Сегодня'
  } else if (diffDays === 1) {
    return 'Вчера'
  } else if (diffDays < 7) {
    return `${diffDays} дн. назад`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} нед. назад`
  } else {
    const months = Math.floor(diffDays / 30)
    return `${months} мес. назад`
  }
}
</script>

<template>
  <div
    class="flex gap-5 items-center border border-[#E5E9F2] rounded-lg p-5 w-full cursor-pointer transition-all duration-200 hover:border-[#0A65CC] hover:shadow-md bg-white"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="relative">
      <img
        class="rounded-full w-20 h-20 object-cover border border-[#E5E9F2]"
        :src="specialist.image"
        alt="Аватар специалиста"
        onerror="this.src='https://via.placeholder.com/80?text=?'"
      />
      <div class="absolute -bottom-1 -right-1 bg-[#4CAF50] rounded-full w-5 h-5 border-2 border-white"></div>
    </div>
    
    <div class="flex-1">
      <div class="flex justify-between items-start">
        <div>
          <h2 class="text-xl text-[#222222] font-semibold hover:text-[#0A65CC] transition-colors">
            {{ specialist.title }}
          </h2>
          <div class="flex gap-4 items-center my-2">
            <p class="text-[#656565] text-sm">@{{ specialist.username }}</p>
            <div class="flex items-center">
              <span class="flex items-center text-[#656565] text-sm">
                {{ specialist.rating.toFixed(1) }}
                <StarIcon class="w-4 h-4 text-[#FFB800] ml-1" />
                <span class="text-xs ml-1 text-[#656565]">({{ specialist.reviewCount }})</span>
              </span>
            </div>
            <div class="flex items-center text-xs text-[#656565]">
              <CheckIcon class="w-3.5 h-3.5 mr-1 text-[#4CAF50]" />
              {{ specialist.completedProjects }} выполненных проектов
            </div>
          </div>
        </div>
        
        <div class="flex items-center text-xs text-[#656565]">
          <CalendarIcon class="w-3.5 h-3.5 mr-1" />
          Активность: {{ formatLastActive(specialist.lastActive) }}
        </div>
      </div>
      
      <div>
        <p class="text-sm text-[#656565] mb-1.5">Навыки:</p>
        <ul class="flex flex-wrap gap-2">
          <li
            v-for="skill in specialist.skills"
            :key="skill"
            class="px-2.5 py-1 bg-[#F0F7FF] text-[#0A65CC] text-xs rounded-md transition-all duration-200"
            :class="{ 'bg-[#E1EFFF]': isHovered }"
          >
            {{ skill }}
          </li>
        </ul>
      </div>
    </div>
    
    <div class="self-start flex flex-col gap-2">
      <button class="px-4 py-2 text-sm rounded-md font-medium bg-[#0A65CC] text-white transition-colors duration-200 hover:bg-[#085BBA] cursor-pointer">
        Связаться
      </button>
      <button class="px-4 py-2 text-sm rounded-md font-medium border border-[#E5E9F2] text-[#656565] transition-colors cursor-pointer duration-200 hover:border-[#0A65CC] hover:text-[#0A65CC]">
        Профиль
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Дополнительные стили при необходимости */
</style>