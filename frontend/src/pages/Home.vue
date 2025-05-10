<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import LastUpdates from '@/components/LastUpdates.vue';
import AllItems from '@/components/AllItems.vue';
import { ArrowUp } from 'lucide-vue-next';

// Состояние для кнопки "вернуться наверх"
const showScrollTop = ref(false);

// Проверка положения прокрутки
const checkScroll = () => {
  showScrollTop.value = window.scrollY > 500;
};

// Прокрутка наверх
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Жизненный цикл компонента
onMounted(() => {
  window.addEventListener('scroll', checkScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll);
});
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Основной контент -->
    <LastUpdates />
    <AllItems />
    
    <!-- Кнопка "вернуться наверх" -->
    <transition name="fade">
      <button 
        v-show="showScrollTop" 
        @click="scrollToTop"
        class="fixed bottom-6 right-6 p-3 bg-white shadow-md rounded-full text-[#0A65CC] cursor-pointer hover:bg-[#F0F7FF] transition-all duration-300 z-50 hover:shadow-lg"
        aria-label="Вернуться наверх"
      >
        <ArrowUp class="w-5 h-5" />
      </button>
    </transition>
  </div>
</template>

<style scoped>
/* Анимация появления/исчезновения кнопки */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
