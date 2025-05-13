<script setup>
import { ref, computed } from 'vue'
import StarIcon from '@/icons/StarIcon.vue'
// import { Calendar } from 'lucide-vue-next'
import Calendar from '@/icons/CalendarIcon.vue'
import { addResponse } from '@/services/reviewsApi'

const props = defineProps({
  review: Object,
  isOwnProfile: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['add-response'])

const showResponseForm = ref(false)
const responseText = ref('')
const isSubmitting = ref(false)
const error = ref(null)

const canRespond = computed(() => {
  return props.isOwnProfile && !props.review.response
})

const submitResponse = async () => {
  if (!responseText.value.trim()) {
    error.value = 'Пожалуйста, напишите ответ'
    return
  }

  isSubmitting.value = true
  error.value = null

  try {
    const responseData = {
      reviewId: props.review.id,
      text: responseText.value,
    }

    const response = await addResponse(responseData)
    emit('add-response', {
      reviewId: props.review.id,
      text: response.response,
      date: response.responseDate,
    })

    // Reset form
    responseText.value = ''
    showResponseForm.value = false
  } catch (err) {
    error.value = 'Не удалось отправить ответ. Пожалуйста, попробуйте позже.'
    console.error('Error submitting response:', err)
  } finally {
    isSubmitting.value = false
  }
}

// Форматирование даты
function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="p-4 hover:bg-[#F9F9F9] transition-colors rounded-lg">
    <div class="flex gap-4 max-sm:flex-col">
      <img
        class="rounded-full w-12 h-12 object-cover border border-[#E5E9F2]"
        :src="review.avatar || '/public/avatar-full.jpg'"
        :alt="review.name"
      />

      <div class="flex-1">
        <div class="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
          <p class="text-sm font-semibold text-[#222222]">{{ review.name }}</p>
          <a href="#" class="text-sm text-[#0A65CC] font-medium hover:underline cursor-pointer">
            {{ review.order }}
          </a>
          <p class="text-xs text-[#656565] flex items-center gap-1">
            <Calendar class="w-3.5 h-3.5" />
            {{ formatDate(review.date) }}
          </p>
        </div>

        <div class="flex items-center gap-2 mb-2">
          <div class="flex">
            <StarIcon
              v-for="i in 5"
              :key="i"
              :class="i <= Math.round(review.rating) ? 'text-[#FFB800]' : 'text-[#E5E9F2]'"
              class="w-4 h-4 transition-colors duration-200"
            />
          </div>
          <span class="text-xs font-medium px-2 py-0.5 rounded-full bg-[#F0F7FF] text-[#0A65CC]">
            {{ review.project }}
          </span>
        </div>

        <p class="text-sm text-[#222222]">{{ review.comment }}</p>

        <!-- Ответ на отзыв -->
        <div v-if="review.response" class="mt-4 pl-4 border-l-2 border-[#E5E9F2]">
          <p class="text-sm text-[#656565] mb-1">Ответ:</p>
          <p class="text-sm text-[#222222]">{{ review.response }}</p>
          <p class="text-xs text-[#656565] mt-1">{{ formatDate(review.responseDate) }}</p>
        </div>

        <!-- Кнопка ответа -->
        <div v-if="canRespond" class="mt-4">
          <button
            v-if="!showResponseForm"
            @click="showResponseForm = true"
            class="text-sm text-[#0A65CC] hover:underline cursor-pointer transition-colors"
          >
            Ответить на отзыв
          </button>

          <!-- Форма ответа -->
          <div v-else class="mt-2">
            <textarea
              v-model="responseText"
              rows="3"
              placeholder="Напишите ваш ответ..."
              class="w-full px-3 py-2 border border-[#E5E9F2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20 focus:border-[#0A65CC]"
            ></textarea>

            <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>

            <div class="mt-2 flex gap-2">
              <button
                @click="submitResponse"
                :disabled="isSubmitting"
                class="px-4 py-2 bg-[#0A65CC] text-white rounded-lg text-sm font-medium hover:bg-[#085BBA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {{ isSubmitting ? 'Отправка...' : 'Отправить' }}
              </button>
              <button
                @click="showResponseForm = false"
                class="px-4 py-2 border border-[#E5E9F2] text-[#656565] rounded-lg text-sm font-medium hover:border-[#0A65CC] hover:text-[#0A65CC] transition-colors cursor-pointer"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
