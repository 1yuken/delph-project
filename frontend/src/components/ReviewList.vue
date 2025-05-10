<script setup>
import { ref, computed } from 'vue'
import ReviewItem from './ReviewItem.vue'
import StarIcon from '@/icons/StarIcon.vue'

const props = defineProps({
  reviews: Array,
  averageRating: {
    type: [Number, String],
    default: 0,
  },
})

const emit = defineEmits(['update:filter'])

const filter = ref('all')

function updateFilter(event) {
  filter.value = event.target.value
  emit('update:filter', filter.value)
}

// Распределение рейтингов
const ratingDistribution = computed(() => {
  const distribution = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  }

  if (props.reviews.length === 0) return distribution

  props.reviews.forEach((review) => {
    distribution[review.rating]++
  })

  return distribution
})

// Процент для каждого рейтинга
const ratingPercentages = computed(() => {
  const result = {}
  const total = props.reviews.length

  if (total === 0) return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }

  for (const rating in ratingDistribution.value) {
    result[rating] = Math.round((ratingDistribution.value[rating] / total) * 100)
  }

  return result
})
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-[#222222]">Отзывы</h2>
      <div class="relative">
        <select
          :value="filter"
          @input="updateFilter"
          class="px-3 py-2 pr-8 border border-[#E5E9F2] rounded-md text-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0A65CC] focus:border-[#0A65CC] appearance-none bg-white"
        >
          <option value="all">Все отзывы</option>
          <option value="positive">Только положительные</option>
          <option value="negative">Только отрицательные</option>
        </select>
        <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L5 5L9 1"
              stroke="#656565"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <!-- Средний рейтинг -->
      <div
        class="bg-[#F9F9F9] rounded-lg p-4 border border-[#E5E9F2] flex flex-col items-center justify-center"
      >
        <p class="text-sm text-[#656565] mb-1">Средний рейтинг</p>
        <div class="flex items-baseline">
          <span class="text-5xl font-bold text-[#222222]">{{ averageRating }}</span>
          <span class="text-lg font-medium text-[#656565] ml-1">из 5</span>
        </div>
        <div class="flex mt-2">
          <StarIcon
            v-for="i in 5"
            :key="i"
            :class="i <= Math.round(averageRating) ? 'text-[#FFB800]' : 'text-[#E5E9F2]'"
          />
        </div>
        <p class="text-sm text-[#656565] mt-2">На основе {{ reviews.length }} отзывов</p>
      </div>

      <!-- Распределение рейтингов -->
      <div class="md:col-span-2 bg-[#F9F9F9] rounded-lg p-4 border border-[#E5E9F2]">
        <p class="text-sm text-[#656565] mb-3">Распределение оценок</p>
        <div class="space-y-2">
          <div v-for="i in 5" :key="i" class="flex items-center gap-2">
            <div class="flex items-center gap-1 w-12">
              <span class="text-sm font-medium">{{ i }}</span>
              <StarIcon class="w-4 h-4 text-[#FFB800]" />
            </div>
            <div class="flex-1 h-2 bg-[#E5E9F2] rounded-full overflow-hidden">
              <div
                class="h-full bg-[#FFB800] rounded-full"
                :style="{ width: `${ratingPercentages[i]}%` }"
              ></div>
            </div>
            <span class="text-xs text-[#656565] w-12 text-right">{{ ratingPercentages[i] }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Список отзывов -->
    <div v-if="reviews.length > 0" class="border border-[#E5E9F2] rounded-lg overflow-hidden">
      <div class="divide-y divide-[#E5E9F2]">
        <ReviewItem v-for="review in reviews" :key="review.id" :review="review" />
      </div>
    </div>

    <div v-else class="py-10 text-center bg-[#F9F9F9] rounded-lg border border-[#E5E9F2]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-12 w-12 mx-auto mb-3 text-[#656565]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
      <p class="text-[#656565] mb-2">Отзывов пока нет</p>
      <p class="text-sm text-[#656565]">Будьте первым, кто оставит отзыв</p>
    </div>
  </div>
</template>
