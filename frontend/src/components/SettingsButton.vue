<script setup>
import { ref } from 'vue'
// import { User, Lock, Mail, Bell, Smartphone, Palette, Type, Zap } from 'lucide-vue-next'
import User from '@/icons/User.vue'
import Lock from '@/icons/Lock.vue'
import Mail from '@/icons/Mail.vue'
import Bell from '@/icons/Bell.vue'
import Smartphone from '@/icons/Smartphone.vue'
import Palette from '@/icons/Palette.vue'
import Type from '@/icons/Type.vue'
import Zap from '@/icons/Zap.vue'

defineProps({
  label: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  tooltip: {
    type: String,
    default: '',
  }
})

const showTooltip = ref(false)

// Получение иконки по имени
const getIcon = (iconName) => {
  switch (iconName) {
    case 'User':
      return User
    case 'Lock':
      return Lock
    case 'Mail':
      return Mail
    case 'Bell':
      return Bell
    case 'Smartphone':
      return Smartphone
    case 'Palette':
      return Palette
    case 'Type':
      return Type
    case 'Zap':
      return Zap
    default:
      return null
  }
}
</script>

<template>
  <div class="relative">
    <button
      :disabled="disabled"
      class="w-full flex items-center gap-2 px-4 py-2.5 text-sm rounded-md font-medium transition-all duration-200"
      :class="
        disabled
          ? 'bg-[#F5F5F5] text-[#A0A0A0] cursor-not-allowed border border-[#E5E9F2]'
          : 'bg-[#F0F7FF] text-[#0A65CC] hover:bg-[#E1EFFF] cursor-pointer border border-[#E5E9F2]'
      "
      @mouseenter="showTooltip = disabled && tooltip"
      @mouseleave="showTooltip = false"
    >
      <component 
        :is="getIcon(icon)" 
        v-if="icon" 
        class="w-4 h-4"
        :class="disabled ? 'text-[#A0A0A0]' : 'text-[#0A65CC]'"
      />
      {{ label }}
    </button>
    
    <!-- Tooltip -->
    <div 
      v-if="showTooltip" 
      class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1.5 bg-[#222222] text-white text-xs rounded-md whitespace-nowrap z-10 animate-fadeIn"
    >
      {{ tooltip }}
      <div class="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-[#222222] rotate-45"></div>
    </div>
  </div>
</template>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, 5px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}
</style>