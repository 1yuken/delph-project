<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import api from '@/services/api'
import { CheckCircle, ArrowRight, AlertCircle, XCircle } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const orderId = ref(route.params.id)
const order = ref(null)
const isLoading = ref(true)
const error = ref(null)

// Загрузка информации о заказе
const loadOrder = async () => {
  try {
    isLoading.value = true
    const response = await api.get(`/orders/${orderId.value}`)
    order.value = response.data
  } catch (err) {
    error.value = 'Ошибка при загрузке информации о заказе'
    console.error('Error loading order:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (!authStore.isAuthenticated.value) {
    router.push('/login')
    return
  }
  loadOrder()
})
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-8">
    <div class="bg-white rounded-xl border border-[#E5E9F2] p-8 shadow-sm text-center">
      <div
        class="w-16 h-16 bg-[#E6F4EA] rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle class="w-8 h-8 text-[#4CAF50]" />
      </div>

      <h1 class="text-2xl font-bold text-[#222222] mb-2">Оплата успешно выполнена!</h1>
      <p class="text-[#656565] mb-8">
        Спасибо за оплату. Ваш заказ будет обработан в ближайшее время.
      </p>

      <div v-if="isLoading" class="flex items-center justify-center py-4">
        <div class="relative w-12 h-12">
          <div class="absolute inset-0 rounded-full border-4 border-[#E5E9F2]"></div>
          <div class="absolute inset-0 rounded-full border-4 border-t-[#0A65CC] animate-spin"></div>
        </div>
      </div>

      <div v-else-if="order" class="bg-[#F9F9F9] rounded-lg p-6 mb-8 border border-[#E5E9F2]">
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-[#656565]">Номер заказа:</span>
            <span class="font-medium text-[#222222]">#{{ order.id }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-[#656565]">Название:</span>
            <span class="font-medium text-[#222222]">{{ order.title }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-[#656565]">Сумма оплаты:</span>
            <span class="text-xl font-bold text-[#0A65CC]">{{ order.budget }} ₽</span>
          </div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          @click="router.push('/my-orders')"
          class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-medium bg-[#0A65CC] hover:bg-[#085BBA] transition-colors cursor-pointer"
        >
          К моим заказам
          <ArrowRight class="w-5 h-5" />
        </button>
        <button
          @click="router.push(`/order/${orderId}`)"
          class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-[#0A65CC] font-medium border border-[#0A65CC] hover:bg-[#F0F7FF] transition-colors cursor-pointer"
        >
          Просмотреть заказ
        </button>
      </div>
    </div>

    <!-- Сообщение об ошибке -->
    <div
      v-if="error"
      class="fixed bottom-4 right-4 bg-white border-l-4 border-[#F44336] shadow-lg rounded-lg p-4 max-w-md animate-slide-up"
    >
      <div class="flex items-start gap-3">
        <AlertCircle class="w-5 h-5 text-[#F44336] flex-shrink-0 mt-0.5" />
        <div>
          <p class="font-medium text-[#222222]">Произошла ошибка</p>
          <p class="text-sm text-[#656565]">{{ error }}</p>
        </div>
        <button
          @click="error = null"
          class="text-[#656565] hover:text-[#222222] transition-colors cursor-pointer"
        >
          <XCircle class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out forwards;
}
</style>
