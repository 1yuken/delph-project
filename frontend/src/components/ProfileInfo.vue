<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  description: String,
})

const isExpanded = ref(false)
const maxLength = 300

const shouldTruncate = computed(() => {
  return props.description.length > maxLength
})

const truncatedDescription = computed(() => {
  if (!shouldTruncate.value || isExpanded.value) {
    return props.description
  }
  return props.description.substring(0, maxLength) + '...'
})
</script>

<template>
  <div>
    <h2 class="text-xl font-bold text-[#222222] mb-3">Обо мне</h2>
    <div class="bg-[#F9F9F9] rounded-lg p-4 border border-[#E5E9F2]">
      <p class="text-[#222222] whitespace-pre-line">{{ truncatedDescription }}</p>
      
      <button 
        v-if="shouldTruncate" 
        @click="isExpanded = !isExpanded"
        class="mt-2 text-[#0A65CC] text-sm font-medium hover:underline focus:outline-none"
      >
        {{ isExpanded ? 'Свернуть' : 'Читать полностью' }}
      </button>
    </div>
  </div>
</template>