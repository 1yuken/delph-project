<script setup>
import ReviewItem from './ReviewItem.vue'

defineProps({
  reviews: Array,
})
</script>

<template>
  <div class="mt-12">
    <h3 class="text-xl font-bold text-[#222222] mb-2">Отзывы</h3>
    <div class="inline-flex max-w-[600px] w-full flex-col gap-2 border border-[#C9C9C9] p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-[#222222]">Рейтинг продавца</p>
          <span class="font-bold text-[#222222]"><span class="text-5xl">?</span> из 5</span>
        </div>
        <div>
          <div>
            <label class="sr-only">Фильтр отзывов</label>
            <select
              class="px-3 py-2 border border-gray-300 rounded-md text-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Все отзывы</option>
              <option value="completed">Только положительные</option>
              <option value="pending">Только отрицательные</option>
            </select>
          </div>
        </div>
      </div>
      <ReviewItem v-for="review in reviews" :key="review.id" :review="review" />
    </div>
  </div>
</template>
