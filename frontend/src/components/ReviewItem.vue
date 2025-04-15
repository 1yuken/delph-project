<script setup>
import StarIcon from '@/icons/StarIcon.vue'

defineProps({
  review: Object,
})
</script>

<template>
  <div class="flex items-center mt-4 gap-4 border-t border-[#C9C9C9] pt-6">
    <img class="rounded-full" src="/public/avatar-full.jpg" width="40px" height="40px" alt="#" />
    <div>
      <div class="flex gap-2 max-sm:flex-col">
        <p class="text-sm font-bold">{{ review.name }}</p>
        <a
          href="#"
          class="text-sm text-[#0A65CC] font-bold hover:text-[#0A65CC]/80 hover:underline"
        >
          {{ review.order }}
        </a>
        <p class="text-sm">{{ review.date }}</p>
        <div class="flex gap-1">
          <StarIcon v-for="n in review.rating" :key="n" />
        </div>
      </div>
      <p class="text-sm text-[#a6a6a6] font-bold">{{ review.project }}</p>
      <p class="text-sm mt-2">{{ review.comment }}</p>
    </div>
  </div>
</template>
