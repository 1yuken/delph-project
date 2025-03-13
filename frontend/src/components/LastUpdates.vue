<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ItemComponent from '@/components/ItemComponent.vue'

const recentItems = ref([])

const fetchRecentItems = async () => {
  try {
    const { data } = await axios.get('https://51ee8a820928c63e.mokky.dev/items')
    recentItems.value = data.reverse().slice(0, 5)
  } catch (error) {
    console.error('Ошибка загрузки данных:', error)
  }
}

onMounted(fetchRecentItems)
</script>

<template>
  <div class="bg-[#F9F9F9] py-4">
    <div class="w-3/5 m-auto flex gap-11.5">
      <article class="max-w-[70px] w-full">
        <p class="text-[#656565] text-xs">Последние<br />обновления</p>
      </article>
      <div class="flex gap-5 flex-wrap">
        <ItemComponent
          v-for="item in recentItems"
          :key="item.title"
          :id="item.id"
          :imageUrl="item.imageUrl"
          :title="item.title"
          :links="item.links || []"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
