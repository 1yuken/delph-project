<script setup>
import { ref, onMounted, watchEffect, onUnmounted, computed } from 'vue';
import axios from 'axios';
import ItemComponent from '@/components/ItemComponent.vue';
import { Search, AlertCircle } from 'lucide-vue-next';

const items = ref([]);
const groupedItems = ref({});
const activeLetter = ref(null);
const isLoading = ref(true);
const error = ref(null);
const searchQuery = ref('');

// Добавить после searchQuery
const selectedCategory = ref('all');
const categories = [
  { id: 'all', name: 'Все категории' },
  { id: 'design', name: 'Дизайн' },
  { id: 'development', name: 'Разработка' },
  { id: 'marketing', name: 'Маркетинг' },
  { id: 'writing', name: 'Копирайтинг' },
  { id: 'other', name: 'Другое' }
];

const fetchItems = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    const { data } = await axios.get('https://51ee8a820928c63e.mokky.dev/items');
    items.value = data;
  } catch (err) {
    console.error('Ошибка загрузки данных:', err);
    error.value = 'Не удалось загрузить категории';
  } finally {
    isLoading.value = false;
  }
};

// Изменить вычисляемое свойство filteredItems
const filteredItems = computed(() => {
  let result = items.value;
  
  // Фильтрация по категории
  if (selectedCategory.value !== 'all') {
    result = result.filter(item => {
      // Предполагаем, что у элемента есть свойство category или можно определить категорию по ссылкам
      const itemCategories = item.links || [];
      return itemCategories.some(link => {
        const linkLower = link.toLowerCase();
        switch (selectedCategory.value) {
          case 'design':
            return ['дизайн', 'ui', 'ux', 'figma', 'photoshop'].some(term => linkLower.includes(term));
          case 'development':
            return ['разработка', 'программирование', 'код', 'web', 'vue', 'react', 'javascript'].some(term => linkLower.includes(term));
          case 'marketing':
            return ['маркетинг', 'реклама', 'seo', 'smm'].some(term => linkLower.includes(term));
          case 'writing':
            return ['копирайтинг', 'текст', 'статьи', 'контент'].some(term => linkLower.includes(term));
          default:
            return false;
        }
      });
    });
  }
  
  // Фильтрация по поисковому запросу
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(item => 
      item.title.toLowerCase().includes(query) || 
      (item.links && item.links.some(link => link.toLowerCase().includes(query)))
    );
  }
  
  return result;
});

// Добавить метод для выбора категории
const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId;
};

// Группировка элементов по первой букве
watchEffect(() => {
  if (filteredItems.value.length > 0) {
    groupedItems.value = filteredItems.value.reduce((acc, item) => {
      const firstLetter = item.title?.[0]?.toUpperCase();
      if (firstLetter) {
        if (!acc[firstLetter]) acc[firstLetter] = [];
        acc[firstLetter].push(item);
      }
      return acc;
    }, {});
  }
});

// Обработка прокрутки для активной буквы
const handleScroll = () => {
  const letters = Object.keys(groupedItems.value);
  let currentLetter = null;

  letters.forEach((letter) => {
    const section = document.getElementById(`section-${letter}`);
    if (section) {
      const rect = section.getBoundingClientRect();
      
      if (rect.top < 100 && rect.bottom > 0) {
        currentLetter = letter;
      }
    }
  });

  activeLetter.value = currentLetter;
};

// Прокрутка к разделу по букве
const scrollToSection = (letter) => {
  const section = document.getElementById(`section-${letter}`);
  if (section) {
    const offset = 95;
    const top = section.getBoundingClientRect().top + window.scrollY - offset;
    
    window.scrollTo({ top, behavior: 'smooth' });
  }
};

// Очистка поискового запроса
const clearSearch = () => {
  searchQuery.value = '';
};

onMounted(() => {
  fetchItems();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <section class="py-8 bg-white">
    <div class="w-3/5 mx-auto max-xl:w-4/5 max-lg:w-full max-lg:px-4">
      <!-- Фильтры категорий -->
      <div class="flex flex-wrap gap-2 mb-6 animate-on-scroll">
        <button 
          v-for="category in categories" 
          :key="category.id"
          @click="selectCategory(category.id)"
          class="px-3 py-1.5 rounded-md text-sm transition-colors duration-200 cursor-pointer"
          :class="selectedCategory === category.id 
            ? 'bg-[#0A65CC] text-white' 
            : 'border border-[#E5E9F2] text-[#656565] hover:border-[#0A65CC] hover:text-[#0A65CC]'"
        >
          {{ category.name }}
        </button>
      </div>
      <!-- Поиск -->
      <div class="mb-6 relative max-w-md">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Поиск категорий"
          class="w-full pl-10 pr-10 py-2.5 bg-white border border-[#E5E9F2] rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20 focus:border-[#0A65CC]"
        />
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search class="h-5 w-5 text-[#656565]" />
        </div>
        <button 
          v-if="searchQuery" 
          @click="clearSearch"
          class="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <span class="text-[#656565] hover:text-[#222222] text-xl">&times;</span>
        </button>
      </div>
      
      <!-- Состояние загрузки -->
      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="animate-pulse flex flex-col items-center">
          <div class="rounded-full bg-[#F0F7FF] h-12 w-12 flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-[#0A65CC] animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <div class="h-4 bg-[#F0F7FF] rounded w-48 mb-2"></div>
          <div class="h-3 bg-[#F0F7FF] rounded w-32"></div>
        </div>
      </div>
      
      <!-- Сообщение об ошибке -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p class="text-red-600 mb-2">{{ error }}</p>
        <button 
          @click="fetchItems" 
          class="px-4 py-2 bg-white text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors duration-200"
        >
          Попробовать снова
        </button>
      </div>
      
      <!-- Основной контент -->
      <div v-else class="flex gap-11.5 max-md:gap-8">
        <!-- Боковая навигация по буквам -->
        <aside class="text-[#656565] text-xs flex flex-col gap-2 max-w-[70px] w-full h-screen sticky top-[95px]">
          <span 
            v-for="letter in Object.keys(groupedItems)" 
            :key="letter" 
            :class="{ 'font-bold text-[#0A65CC]': activeLetter === letter }"
            class="cursor-pointer transition-colors duration-200 hover:text-[#0A65CC] px-2 py-1 rounded-md"
            :style="activeLetter === letter ? 'background-color: rgba(10, 101, 204, 0.1)' : ''"
            @click="scrollToSection(letter)"
          >
            {{ letter }}
          </span>
        </aside>
        
        <!-- Если нет результатов поиска -->
        <div v-if="Object.keys(groupedItems).length === 0" class="flex-1 flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle class="w-12 h-12 text-[#E5E9F2] mb-4" />
          <h3 class="text-lg font-medium text-[#222222] mb-2">Ничего не найдено</h3>
          <p class="text-[#656565] mb-4">По вашему запросу не найдено категорий</p>
          <button 
            @click="clearSearch" 
            class="px-4 py-2 bg-[#0A65CC] text-white rounded-lg hover:bg-[#085BBA] transition-colors duration-200"
          >
            Сбросить поиск
          </button>
        </div>
        
        <!-- Группы категорий по буквам -->
        <div v-else class="flex flex-col gap-6 mt-2 flex-1">
          <div 
            v-for="(items, letter) in groupedItems" 
            :key="letter" 
            :id="`section-${letter}`"
            class="mb-10 animate-on-scroll"
          >
            <h2 class="text-[#656565] text-xs mb-2 font-medium">{{ letter }}</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <ItemComponent 
                v-for="item in items" 
                :key="item.id" 
                :id="item.id"
                :imageUrl="item.imageUrl"
                :title="item.title" 
                :links="item.links || []"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Плавные переходы */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.duration-200 {
  transition-duration: 200ms;
}

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
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Стили для прокрутки в боковой панели */
aside {
  position: sticky;
  top: 95px;
  height: 100vh;
  overflow-y: auto;
  scrollbar-width: thin;
}

aside::-webkit-scrollbar {
  width: 4px;
}

aside::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

aside::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

aside::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
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
.animate-on-scroll:nth-child(1) { animation-delay: 0.1s; }
.animate-on-scroll:nth-child(2) { animation-delay: 0.2s; }
.animate-on-scroll:nth-child(3) { animation-delay: 0.3s; }
.animate-on-scroll:nth-child(4) { animation-delay: 0.4s; }
.animate-on-scroll:nth-child(5) { animation-delay: 0.5s; }
.animate-on-scroll:nth-child(6) { animation-delay: 0.6s; }

/* Фиксированный размер карточек */
:deep(.grid) {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

:deep(.grid > div) {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
