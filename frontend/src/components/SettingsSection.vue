<script setup>
import User from '@/icons/User.vue'
import Bell from '@/icons/Bell.vue'
import Palette from '@/icons/Palette.vue'

defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: '',
  }
})

// Получение иконки по имени
const getIcon = (iconName) => {
  switch (iconName) {
    case 'User':
      return User
    case 'Bell':
      return Bell
    case 'Palette':
      return Palette
    default:
      return null
  }
}
</script>

<template>
  <div class="mb-6 bg-white rounded-lg border border-[#E5E9F2] overflow-hidden shadow-sm">
    <div class="flex items-center gap-3 p-4 border-b border-[#E5E9F2] bg-[#F9F9F9]">
      <component 
        :is="getIcon(icon)" 
        v-if="icon" 
        class="w-5 h-5 text-[#0A65CC]"
      />
      <h3 class="font-semibold text-[#222222]">{{ title }}</h3>
    </div>
    
    <div class="p-5">
      <slot />
    </div>
  </div>
</template>