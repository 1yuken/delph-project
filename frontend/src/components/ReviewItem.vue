<script setup>
import StarIcon from '@/icons/StarIcon.vue'
// import { Calendar } from 'lucide-vue-next'
import Calendar from '@/icons/CalendarIcon.vue'

defineProps({
  review: Object,
})
</script>

<template>
  <div class="p-4 hover:bg-[#F9F9F9] transition-colors">
    <div class="flex gap-4 max-sm:flex-col">
      <img 
        class="rounded-full w-12 h-12 object-cover border border-[#E5E9F2]" 
        src="/public/avatar-full.jpg" 
        alt="Аватар пользователя" 
      />
      
      <div class="flex-1">
        <div class="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
          <p class="text-sm font-semibold text-[#222222]">{{ review.name }}</p>
          <a
            href="#"
            class="text-sm text-[#0A65CC] font-medium hover:underline"
          >
            {{ review.order }}
          </a>
          <p class="text-xs text-[#656565] flex items-center gap-1">
            <Calendar class="w-3.5 h-3.5" />
            {{ review.date }}
          </p>
        </div>
        
        <div class="flex items-center gap-2 mb-2">
          <div class="flex">
            <StarIcon 
              v-for="i in 5" 
              :key="i" 
              :class="i <= review.rating ? 'text-[#FFB800]' : 'text-[#E5E9F2]'" 
              class="w-4 h-4"
            />
          </div>
          <span class="text-xs font-medium px-2 py-0.5 rounded-full bg-[#F0F7FF] text-[#0A65CC]">
            {{ review.project }}
          </span>
        </div>
        
        <p class="text-sm text-[#222222]">{{ review.comment }}</p>
      </div>
    </div>
  </div>
</template>