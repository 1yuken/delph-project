<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const order = ref(null)

onMounted(async () => {
  try {
    const { data } = await axios.get(`https://51ee8a820928c63e.mokky.dev/orders/${route.params.id}`)
    order.value = data
  } catch (error) {
    console.error('Ошибка загрузки заказа:', error)
  }
})
</script>

<template>
  <div class="relative flex flex-col w-3/5 mx-auto gap-4">
    <div v-if="order">
      <h1 class="text-2xl font-bold">Детали заказа: {{ order.title }}</h1>
      <p>{{ order.description }}</p>
    </div>
    <div v-else class="text-center mt-10">Загрузка...</div>
  </div>
</template>
