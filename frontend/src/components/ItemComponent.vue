<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, ExternalLink } from 'lucide-vue-next'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  links: {
    type: Array,
    required: true,
  },
})

const router = useRouter()
const isHovered = ref(false)

const goToItemPage = () => {
  router.push(`/item/${props.id}`)
}

// Обработка ошибки загрузки изображения
const handleImageError = (event) => {
  event.target.src = `https://via.placeholder.com/120x120/f0f7ff/0A65CC?text=${props.title.charAt(0)}`
}
</script>

<template>
  <div
    class="bg-white rounded-lg border border-[#E5E9F2] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full cursor-pointer hover:border-[#0A65CC]"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @click="goToItemPage"
  >
    <!-- Изображение -->
    <div class="relative overflow-hidden h-[160px] bg-[#F9F9F9] flex items-center justify-center">
      <img
        :src="imageUrl"
        :alt="title"
        class="max-w-[80%] max-h-[80%] object-contain transition-transform duration-300"
        :class="{ 'scale-105': isHovered }"
        @error="handleImageError"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300"
        :class="{ 'opacity-100': isHovered }"
      ></div>
      <button
        @click.stop="goToItemPage"
        class="absolute bottom-3 right-3 bg-white/90 text-[#0A65CC] p-2 rounded-full transform translate-y-10 opacity-0 transition-all duration-300 hover:bg-white"
        :class="{ 'translate-y-0 opacity-100': isHovered }"
      >
        <ExternalLink class="w-4 h-4" />
      </button>
    </div>
    <div class="flex flex-col gap-2 px-4 py-3 min-h-[120px]">
      <h3
        class="font-semibold text-[#222222] mb-2 hover:text-[#0A65CC] transition-colors duration-200"
      >
        {{ title }}
      </h3>
      <div class="mb-3 flex-1">
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="(cat, idx) in links.slice(0, 3)"
            :key="idx"
            class="text-xs px-2 py-1 bg-[#F0F7FF] text-[#0A65CC] rounded-md"
          >
            {{ cat }}
          </span>
          <span
            v-if="links.length > 3"
            class="text-xs px-2 py-1 bg-[#F9F9F9] text-[#656565] rounded-md"
          >
            +{{ links.length - 3 }}
          </span>
        </div>
      </div>
    </div>
    <button
      @click.stop="goToItemPage"
      class="flex items-center gap-1.5 text-sm text-[#656565] hover:text-[#0A65CC] transition-colors duration-200 mt-auto group cursor-pointer px-4 py-3 hover:bg-[#F0F7FF] w-full"
    >
      <span>Смотреть все</span>
      <ArrowRight
        class="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200"
      />
    </button>
  </div>
</template>

<style scoped>
/* Плавные переходы */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.duration-200 {
  transition-duration: 200ms;
}

.duration-300 {
  transition-duration: 300ms;
}

/* Трансформации */
.scale-105 {
  transform: scale(1.05);
}

.group:hover .group-hover\:translate-x-1 {
  transform: translateX(0.25rem);
}

.transform {
  transform: translateY(0) scale(1);
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}
</style>
