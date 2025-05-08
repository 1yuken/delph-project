<script setup>
import { ref, onMounted, watchEffect, onUnmounted } from 'vue';
import axios from 'axios';
import ItemComponent from '@/components/ItemComponent.vue';

const items = ref([]);
const groupedItems = ref({});
const activeLetter = ref(null);


const fetchItems = async () => {
  try {
    const { data } = await axios.get('https://51ee8a820928c63e.mokky.dev/items');
    items.value = data;
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
  }
};

onMounted(fetchItems);

watchEffect(() => {
  if (items.value.length > 0) {
    groupedItems.value = items.value.reduce((acc, item) => {
      const firstLetter = item.title?.[0]?.toUpperCase();
      if (firstLetter) {
        if (!acc[firstLetter]) acc[firstLetter] = [];
        acc[firstLetter].push(item);
      }
      return acc;
    }, {});
  }
});

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

  if (currentLetter === 'S' && letters[letters.length - 1] === 'Z') {
    currentLetter = 'Z';
  }

  activeLetter.value = currentLetter;
};

const scrollToSection = (letter) => {
  const section = document.getElementById(`section-${letter}`);
  if (section) {
    const offset = 95;
    const top = section.getBoundingClientRect().top + window.scrollY - offset;
    
    window.scrollTo({ top, behavior: 'smooth' });
  }
};


onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

</script>

<template>
  <div class="py-4">
    <div class="w-3/5 m-auto flex gap-11.5 max-xl:w-4/5 max-lg:w-5/5 max-lg:px-4">
      <aside v-auto-animate class="text-[#656565] text-xs flex flex-col gap-2 max-w-[70px] w-full h-screen sticky top-[95px]">
        <span 
          v-for="letter in Object.keys(groupedItems)" 
          :key="letter" 
          :class="{ 'font-bold text-[#0A65CC]': activeLetter === letter }"
          class="cursor-pointer"
          @click="scrollToSection(letter)"
        >
          {{ letter }}
        </span>
      </aside>

      <div class="flex flex-col gap-6 mt-2">
        <div v-for="(items, letter) in groupedItems" :key="letter" :id="`section-${letter}`">
          <h2 class="text-[#656565] text-xs mb-2">{{ letter }}</h2>
          <div class="flex gap-5 flex-wrap">
            <ItemComponent 
              v-for="item in items" 
              :key="item.title" 
              :imageUrl="item.imageUrl"
              :id="item.id"
              :title="item.title" 
              :links="item.links || []"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
aside {
  position: sticky;
  top: 95px;
  height: 100vh;
  overflow-y: auto;
}
</style>
