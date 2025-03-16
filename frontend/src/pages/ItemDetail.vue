<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const item = ref(null)
const selectedLink = ref('Все')
const orders = ref([])

onMounted(async () => {
  try {
    const { data: itemData } = await axios.get(
      `https://51ee8a820928c63e.mokky.dev/items/${route.params.id}`,
    )
    item.value = itemData

    const { data: ordersData } = await axios.get(
      `https://51ee8a820928c63e.mokky.dev/orders?categoryId=${route.params.id}`,
    )
    orders.value = ordersData
  } catch (error) {
    console.error('Ошибка загрузки элемента:', error)
  }
})

const selectLink = (link) => {
  selectedLink.value = link
}

const goToOrderDetail = (orderId) => {
  router.push(`/order/${orderId}`)
}
</script>

<template>
  <div v-if="item" class="relative w-3/5 m-auto py-5 gap-4">
    <div class="flex items-center gap-4">
      <h1 class="text-3xl font-bold text-[#222222]">Заказы {{ item.title }}</h1>
      <img :src="item.imageUrl" alt="#" />
    </div>
    <p class="mt-2 text-gray-600 max-w-[600px]">
      Здесь вы можете с гарантией безопасности выполнить заказ и найти исполнителей для любых задач.
      Все проекты проверяются, и заказчики оплачивают работу только после подтверждения качества. У
      нас вы можете найти фрилансеров с разными навыками — от разработки сайтов до графического
      дизайна.
    </p>

    <!-- Фильтры -->
    <div class="mt-4 flex flex-wrap gap-2">
      <button
        @click="selectLink('Все')"
        :class="[
          'px-4 py-2 border rounded-lg cursor-pointer transition-all',
          selectedLink === 'Все'
            ? 'bg-blue-500 text-white border-blue-500'
            : 'bg-[#f5f5f5] text-black border-gray-300',
        ]"
      >
        Все
      </button>
      <button
        v-for="(link, index) in item.links"
        :key="index"
        @click="selectLink(link)"
        :class="[
          'px-4 py-2 border rounded-lg cursor-pointer transition-all',
          selectedLink === link
            ? 'bg-blue-500 text-white border-blue-500'
            : 'bg-[#f5f5f5] text-black border-gray-300',
        ]"
      >
        {{ link }}
      </button>
    </div>
    <div class="bg-white shadow-md rounded-lg overflow-hidden mt-4">
      <table class="w-full border-collapse">
        <thead class="border-b border-[#C9C9C9]">
          <tr>
            <th class="py-3 px-4 text-left text-black-700 font-normal text-sm">Описание</th>
            <th class="py-3 px-4 text-left text-black-700 font-normal text-sm">Заказчик</th>
            <th class="py-3 px-4 text-left text-black-700 font-normal text-sm">Цена</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="order in orders"
            :key="order.id"
            @click="goToOrderDetail(order.id)"
            class="border-b border-[#C9C9C9] cursor-pointer transition hover:bg-[#f9f9f9]"
          >
            <td class="py-3 px-4">{{ order.description }}</td>
            <td class="py-3 px-4 flex items-center gap-2">
              <img :src="order.avatar" alt="Avatar" class="w-8 h-8 rounded-full" />
              {{ order.customer }}
            </td>
            <td class="py-3 px-4">{{ order.price }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div v-else class="text-center mt-10">Загрузка...</div>
</template>
