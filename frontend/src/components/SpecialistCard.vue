<script setup>
import { ref } from 'vue'
import StarIcon from '@/icons/StarIcon.vue'
import CalendarIcon from '@/icons/CalendarIcon.vue'
import CheckIcon from '@/icons/CheckIcon.vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  specialist: {
    type: Object,
    required: true,
  },
})

const router = useRouter()
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

// Ограничение текста до определенного количества символов
const truncateText = (text) => {
  if (!text) return ''
  const maxLength = 100 // максимальная длина текста
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

const goToProfile = () => {
  router.push(`/profile/${props.specialist.id}`)
}
</script>

<template>
  <div
    class="flex flex-col md:flex-row gap-4 md:gap-5 items-start md:items-center border border-[#E5E9F2] rounded-lg p-4 md:p-5 w-full cursor-pointer transition-all duration-200 hover:border-[#0A65CC] hover:shadow-md bg-white"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @click="goToProfile"
  >
    <!-- Аватар и кнопки (на мобильных вверху) -->
    <div class="flex w-full md:w-auto justify-between md:justify-start items-center md:items-start">
      <div class="relative">
        <img
          class="rounded-full w-16 h-16 md:w-20 md:h-20 object-cover border border-[#E5E9F2]"
          :src="specialist.image"
          alt="Аватар специалиста"
          onerror="this.src='https://via.placeholder.com/80?text=?'"
        />
        <div
          class="absolute -bottom-1 -right-1 bg-[#4CAF50] rounded-full w-4 h-4 md:w-5 md:h-5 border-2 border-white"
        ></div>
      </div>

      <!-- Кнопки на мобильных устройствах -->
      <div class="flex md:hidden gap-2">
        <button
          @click.stop
          class="px-3 py-1.5 text-xs rounded-md font-medium bg-[#0A65CC] text-white transition-colors duration-200 hover:bg-[#085BBA] cursor-pointer"
        >
          Связаться
        </button>
        <button
          @click.stop="goToProfile"
          class="px-3 py-1.5 text-xs rounded-md font-medium border border-[#E5E9F2] text-[#656565] transition-colors cursor-pointer duration-200 hover:border-[#0A65CC] hover:text-[#0A65CC]"
        >
          Профиль
        </button>
      </div>
    </div>

    <!-- Информация о специалисте -->
    <div class="flex-1 w-full">
      <div class="flex flex-col gap-0 md:gap-2 md:flex-row justify-between md:items-start">
        <div>
          <h2
            class="text-lg md:text-xl text-[#222222] font-semibold hover:text-[#0A65CC] transition-colors"
          >
            {{ truncateText(specialist.title) }}
          </h2>
          <div class="flex flex-wrap gap-2 md:gap-4 items-center my-2">
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

        <div class="flex items-center text-xs text-[#656565] mt-1 md:mt-0">
          <CalendarIcon class="w-3.5 h-3.5 mr-1" />
          Активность: {{ formatLastActive(specialist.lastActive) }}
        </div>
      </div>

      <!-- Навыки -->
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

    <!-- Кнопки на десктопе -->
    <div class="hidden md:flex self-start flex-col gap-2">
      <button
        @click.stop
        class="px-4 py-2 text-sm rounded-md font-medium bg-[#0A65CC] text-white transition-colors duration-200 hover:bg-[#085BBA] cursor-pointer"
      >
        Связаться
      </button>
      <button
        @click.stop="goToProfile"
        class="px-4 py-2 text-sm rounded-md font-medium border border-[#E5E9F2] text-[#656565] transition-colors cursor-pointer duration-200 hover:border-[#0A65CC] hover:text-[#0A65CC]"
      >
        Профиль
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Анимация при наведении */
@media (hover: hover) {
  .hover\:border-\[\#0A65CC\]:hover {
    border-color: #0a65cc;
  }

  .hover\:shadow-md:hover {
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
}
</style>
