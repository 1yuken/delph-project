<script setup>
import { ref, onMounted } from 'vue'
import { itemsApi } from '@/services/api'
import ItemComponent from '@/components/ItemComponent.vue'
import { Clock, RefreshCw } from 'lucide-vue-next'

const recentItems = ref([])
const isLoading = ref(true)
const error = ref(null)

const fetchRecentItems = async () => {
  isLoading.value = true
  error.value = null

  try {
    const { items } = await itemsApi.getAll(1, 1000)
    recentItems.value = items.slice(-5)
  } catch (err) {
    console.error('Ошибка загрузки данных:', err)
    error.value = 'Не удалось загрузить последние обновления'
  } finally {
    isLoading.value = false
  }
}

const refreshItems = () => {
  fetchRecentItems()
}

onMounted(fetchRecentItems)
</script>

<template>
  <section class="py-8 bg-[#F9F9F9]">
    <div class="w-3/5 mx-auto max-xl:w-4/5 max-lg:w-full max-lg:px-4">
      <div
        class="flex flex-col gap-4 md:flex-row items-start justify-between mb-8 animate-on-scroll"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-[#F0F7FF] flex items-center justify-center">
            <Clock class="w-5 h-5 text-[#0A65CC]" />
          </div>
          <div>
            <h2 class="text-lg font-semibold text-[#222222]">Последние обновления</h2>
            <p class="text-sm text-[#656565]">Недавно добавленные категории</p>
          </div>
        </div>

        <button
          @click="refreshItems"
          class="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E5E9F2] rounded-lg text-sm text-[#656565] cursor-pointer hover:border-[#0A65CC] hover:text-[#0A65CC] transition-colors duration-200"
          :disabled="isLoading"
        >
          <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': isLoading }" />
          <span>{{ isLoading ? 'Обновление...' : 'Обновить' }}</span>
        </button>
      </div>

      <!-- Состояние загрузки -->
      <div v-if="isLoading && !recentItems.length" class="flex justify-center py-6">
        <div class="animate-pulse flex space-x-4">
          <div class="flex-1 space-y-4 py-1">
            <div class="h-4 bg-[#F0F7FF] rounded w-3/4"></div>
            <div class="space-y-2">
              <div class="h-4 bg-[#F0F7FF] rounded"></div>
              <div class="h-4 bg-[#F0F7FF] rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Сообщение об ошибке -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p class="text-red-600 mb-2">{{ error }}</p>
        <button
          @click="refreshItems"
          class="px-4 py-2 bg-white text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors duration-200"
        >
          Попробовать снова
        </button>
      </div>

      <!-- Список элементов -->
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 animate-on-scroll"
      >
        <ItemComponent
          v-for="item in recentItems"
          :key="item.id"
          :id="item.id"
          :imageUrl="item.imageUrl"
          :title="item.title"
          :links="item.links || []"
        />
      </div>

      <!-- Если нет элементов -->
      <div v-if="!isLoading && !error && recentItems.length === 0" class="text-center py-6">
        <p class="text-[#656565] mb-2">Нет доступных обновлений</p>
        <button
          @click="refreshItems"
          class="px-4 py-2 bg-white border border-[#E5E9F2] text-[#656565] rounded-lg hover:border-[#0A65CC] hover:text-[#0A65CC] transition-colors duration-200"
        >
          Обновить
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Анимация для загрузки */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Анимация пульсации */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Анимации при прокрутке */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s ease forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Добавить задержку для элементов, чтобы они появлялись последовательно */
.animate-on-scroll:nth-child(1) {
  animation-delay: 0.1s;
}
.animate-on-scroll:nth-child(2) {
  animation-delay: 0.2s;
}
.animate-on-scroll:nth-child(3) {
  animation-delay: 0.3s;
}
.animate-on-scroll:nth-child(4) {
  animation-delay: 0.4s;
}
.animate-on-scroll:nth-child(5) {
  animation-delay: 0.5s;
}
</style>
