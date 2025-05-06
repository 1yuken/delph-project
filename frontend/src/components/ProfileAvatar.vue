<script setup>
// import { Calendar } from 'lucide-vue-next'
import Calendar from '@/icons/CalendarIcon.vue'

defineProps({
  fullName: String,
  username: String,
  isOnline: Boolean,
  lastActive: String
})
</script>

<template>
  <div>
    <div class="relative inline-block">
      <img
        class="rounded-full block w-[170px] h-[170px] object-cover border-2 border-[#E5E9F2]"
        src="/public/avatar-full.jpg"
        alt="avatar"
      />
      <div 
        class="absolute -bottom-1 -right-1 rounded-full w-6 h-6 border-2 border-white"
        :class="isOnline ? 'bg-[#4CAF50]' : 'bg-[#656565]'"
      ></div>
    </div>
    
    <h1 class="text-3xl font-bold text-[#222222] mt-4">{{ fullName }}</h1>
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
      <p class="text-sm text-[#222222]">23 февраля 2020, 0:04</p>
      <p class="text-sm text-[#656565]">5 лет назад</p>
    </div>
  </div>
</template>