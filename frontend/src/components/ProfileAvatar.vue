<script setup>
// import { Calendar } from 'lucide-vue-next'
import Calendar from '@/icons/CalendarIcon.vue'
import { computed } from 'vue'

const props = defineProps({
  fullName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  lastActive: {
    type: String,
    default: 'Онлайн',
  },
  avatarUrl: {
    type: String,
    default: '/avatar-default.jpg',
  },
  registrationDate: {
    type: String,
    default: null,
  },
})

// Вычисляемое свойство для URL аватара
const avatarSrc = computed(() => {
  console.log('ProfileAvatar - received avatarUrl:', props.avatarUrl)
  try {
    if (!props.avatarUrl || typeof props.avatarUrl !== 'string') {
      console.log('ProfileAvatar - invalid avatarUrl, using default')
      return '/avatar-default.jpg'
    }
    // Проверяем, является ли URL валидным
    const url = new URL(props.avatarUrl)
    console.log('ProfileAvatar - valid URL:', url.toString())
    return url.toString()
  } catch (error) {
    console.error('ProfileAvatar - error processing avatarUrl:', error)
    return '/avatar-default.jpg'
  }
})

// Форматирование даты регистрации
const formattedRegistrationDate = computed(() => {
  if (!props.registrationDate) return null

  const date = new Date(props.registrationDate)
  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  return date.toLocaleDateString('ru-RU', options)
})

// Вычисление времени с момента регистрации
const timeSinceRegistration = computed(() => {
  if (!props.registrationDate) return null

  const now = new Date()
  const registration = new Date(props.registrationDate)
  const diffYears = now.getFullYear() - registration.getFullYear()

  if (diffYears === 0) {
    const diffMonths = now.getMonth() - registration.getMonth()
    return `${diffMonths} ${getMonthWord(diffMonths)} назад`
  }

  return `${diffYears} ${getYearWord(diffYears)} назад`
})

// Вспомогательная функция для склонения слова "месяц"
function getMonthWord(months) {
  if (months === 1) return 'месяц'
  if (months >= 2 && months <= 4) return 'месяца'
  return 'месяцев'
}

// Вспомогательная функция для склонения слова "год"
function getYearWord(years) {
  if (years === 1) return 'год'
  if (years >= 2 && years <= 4) return 'года'
  return 'лет'
}
</script>

<template>
  <div>
    <div class="relative inline-block">
      <img
        :src="avatarSrc"
        :alt="fullName"
        class="rounded-full block w-[170px] h-[170px] object-cover border-2 border-[#E5E9F2]"
        @error="$event.target.src = '/avatar-default.jpg'"
      />
      <div
        v-if="isOnline"
        class="absolute -bottom-1 -right-1 rounded-full w-6 h-6 border-2 border-white bg-[#4CAF50]"
      ></div>
    </div>

    <h1 class="text-xl font-bold text-[#222222] mt-4">{{ fullName }}</h1>
    <p class="text-[#656565] text-sm">{{ username }}</p>

    <div class="mt-3 flex items-center gap-1.5 text-[#656565]">
      <div class="w-2 h-2 rounded-full" :class="isOnline ? 'bg-[#4CAF50]' : 'bg-[#656565]'"></div>
      <span class="text-sm">{{ lastActive }}</span>
    </div>

    <div class="mt-4 flex flex-col gap-1">
      <p class="text-[#656565] text-sm flex items-center gap-1.5">
        <Calendar class="w-4 h-4" />
        Дата регистрации
      </p>
      <p v-if="formattedRegistrationDate" class="text-sm text-[#222222]">
        {{ formattedRegistrationDate }}
      </p>
      <p v-if="timeSinceRegistration" class="text-sm text-[#656565]">{{ timeSinceRegistration }}</p>
    </div>
  </div>
</template>
