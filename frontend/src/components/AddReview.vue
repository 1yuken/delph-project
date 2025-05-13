<script setup>
import { ref, computed } from 'vue'
import StarIcon from '@/icons/StarIcon.vue'
import { useAuthStore } from '@/stores/authStore'
import { createReview } from '@/services/reviewsApi'

const props = defineProps({
  profileId: {
    type: String,
    required: true,
  },
  projects: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['review-added'])

const authStore = useAuthStore()
const rating = ref(0)
const comment = ref('')
const selectedProject = ref('')
const isSubmitting = ref(false)
const error = ref(null)

const hoveredRating = ref(0)

const ratingLabels = {
  1: 'Ужасно',
  2: 'Плохо',
  3: 'Нормально',
  4: 'Хорошо',
  5: 'Отлично',
}

const currentRatingLabel = computed(() => {
  const value = hoveredRating.value || rating.value
  return value ? ratingLabels[value] : 'Выберите оценку'
})

const handleRatingClick = (value) => {
  rating.value = value
}

const handleRatingHover = (value) => {
  hoveredRating.value = value
}

const handleRatingLeave = () => {
  hoveredRating.value = 0
}

const validateForm = () => {
  if (rating.value === 0) {
    error.value = 'Пожалуйста, выберите оценку'
    return false
  }
  if (!comment.value.trim()) {
    error.value = 'Пожалуйста, напишите комментарий'
    return false
  }
  if (!selectedProject.value) {
    error.value = 'Пожалуйста, выберите проект'
    return false
  }
  return true
}

const submitReview = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  error.value = null

  try {
    const reviewData = {
      rating: rating.value,
      msg: comment.value,
      job_id: selectedProject.value,
      receiver_id: props.profileId,
    }
    console.log('Submitting review data:', reviewData)

    const savedReview = await createReview(reviewData)
    console.log('Review saved successfully:', savedReview)

    emit('review-added', savedReview)
    console.log('Review added event emitted')

    // Reset form
    rating.value = 0
    comment.value = ''
    selectedProject.value = ''
  } catch (err) {
    console.error('Error submitting review:', err)
    error.value = 'Не удалось отправить отзыв. Пожалуйста, попробуйте позже.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="bg-white rounded-lg border border-[#E5E9F2] p-6">
    <h3 class="text-lg font-semibold text-[#222222] mb-4">Оставить отзыв</h3>

    <form @submit.prevent="submitReview" class="space-y-4">
      <!-- Рейтинг -->
      <div>
        <label class="block text-sm font-medium text-[#222222] mb-2">Оценка</label>
        <div class="flex flex-col items-center">
          <div class="flex gap-1 mb-2">
            <button
              v-for="i in 5"
              :key="i"
              type="button"
              @click="handleRatingClick(i)"
              @mouseenter="handleRatingHover(i)"
              @mouseleave="handleRatingLeave"
              class="focus:outline-none group cursor-pointer"
            >
              <div class="relative">
                <StarIcon
                  class="w-8 h-8 transition-colors"
                  :class="i <= (hoveredRating || rating) ? 'text-[#FFB800]' : 'text-[#E5E9F2]'"
                />
                <span
                  class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#222222] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                >
                  {{ ratingLabels[i] }}
                </span>
              </div>
            </button>
          </div>
          <p
            class="text-sm font-medium transition-colors"
            :class="currentRatingLabel === 'Выберите оценку' ? 'text-[#656565]' : 'text-[#FFB800]'"
          >
            {{ currentRatingLabel }}
          </p>
        </div>
      </div>

      <!-- Проект -->
      <div>
        <label for="project" class="block text-sm font-medium text-[#222222] mb-2">Проект</label>
        <select
          id="project"
          v-model="selectedProject"
          class="w-full cursor-pointer px-4 py-2 border border-[#E5E9F2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20 focus:border-[#0A65CC]"
        >
          <option value="" disabled>Выберите проект</option>
          <option v-for="project in projects" :key="project.id" :value="project.id">
            {{ project.title }}
          </option>
        </select>
      </div>

      <!-- Комментарий -->
      <div>
        <label for="comment" class="block text-sm font-medium text-[#222222] mb-2"
          >Комментарий</label
        >
        <textarea
          id="comment"
          v-model="comment"
          rows="4"
          placeholder="Напишите ваш отзыв..."
          class="w-full px-4 py-2 border border-[#E5E9F2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20 focus:border-[#0A65CC]"
        ></textarea>
      </div>

      <!-- Ошибка -->
      <p v-if="error" class="text-sm text-red-500">{{ error }}</p>

      <!-- Кнопка отправки -->
      <button
        type="submit"
        :disabled="isSubmitting"
        class="w-full cursor-pointer px-4 py-2 bg-[#0A65CC] text-white rounded-lg text-sm font-medium hover:bg-[#085BBA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isSubmitting ? 'Отправка...' : 'Отправить отзыв' }}
      </button>
    </form>
  </div>
</template>
