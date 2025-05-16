<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import api from '@/services/api'
import {
  CreditCard,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Lock,
  Shield,
  Clock,
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const orderId = ref(route.params.id)
const order = ref(null)
const isLoading = ref(true)
const error = ref(null)
const paymentMethod = ref('card')
const cardNumber = ref('')
const cardExpiry = ref('')
const cardCVC = ref('')
const cardholderName = ref('')
const isProcessing = ref(false)

// Форматирование номера карты
const formatCardNumber = (value) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
  const matches = v.match(/\d{4,16}/g)
  const match = (matches && matches[0]) || ''
  const parts = []
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4))
  }
  if (parts.length) {
    return parts.join(' ')
  } else {
    return value
  }
}

// Форматирование срока действия карты
const formatExpiry = (value) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
  if (v.length >= 3) {
    return `${v.substring(0, 2)}/${v.substring(2, 4)}`
  }
  return v
}

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

// Обработка платежа
const handlePayment = async () => {
  if (!validateForm()) return

  try {
    isProcessing.value = true
    const response = await api.post(`/orders/${orderId.value}/payment`, {
      paymentMethod: paymentMethod.value,
      cardDetails: {
        number: cardNumber.value.replace(/\s/g, ''),
        expiry: cardExpiry.value,
        cvc: cardCVC.value,
        name: cardholderName.value,
      },
    })

    // Перенаправление на страницу успешной оплаты
    router.push(`/payment/success/${orderId.value}`)
  } catch (err) {
    error.value = 'Ошибка при обработке платежа'
    console.error('Error processing payment:', err)
  } finally {
    isProcessing.value = false
  }
}

// Валидация формы
const validateForm = () => {
  if (paymentMethod.value === 'card') {
    if (!cardNumber.value || cardNumber.value.replace(/\s/g, '').length !== 16) {
      error.value = 'Введите корректный номер карты'
      return false
    }
    if (!cardExpiry.value || cardExpiry.value.length !== 5) {
      error.value = 'Введите корректный срок действия карты'
      return false
    }
    if (!cardCVC.value || cardCVC.value.length !== 3) {
      error.value = 'Введите корректный CVC код'
      return false
    }
    if (!cardholderName.value) {
      error.value = 'Введите имя владельца карты'
      return false
    }
  }
  return true
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
  <div class="max-w-4xl mx-auto px-4 py-8">
    <!-- Заголовок -->
    <div class="flex items-center gap-3 mb-6">
      <button
        @click="router.push('/my-orders')"
        class="p-2 rounded-lg hover:bg-[#F0F7FF] transition-colors cursor-pointer"
      >
        <ArrowLeft class="w-6 h-6 text-[#0A65CC]" />
      </button>
      <h1 class="text-2xl font-bold text-[#222222]">Оплата заказа</h1>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Основная информация о заказе -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-xl border border-[#E5E9F2] p-6 shadow-sm">
          <h2 class="text-lg font-bold text-[#222222] mb-4">Информация о заказе</h2>

          <div v-if="isLoading" class="flex items-center justify-center py-8">
            <div class="relative w-12 h-12">
              <div class="absolute inset-0 rounded-full border-4 border-[#E5E9F2]"></div>
              <div
                class="absolute inset-0 rounded-full border-4 border-t-[#0A65CC] animate-spin"
              ></div>
            </div>
          </div>

          <div v-else-if="order" class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-[#656565]">Номер заказа:</span>
              <span class="font-medium text-[#222222]">#{{ order.id }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-[#656565]">Название:</span>
              <span class="font-medium text-[#222222]">{{ order.title }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-[#656565]">Сумма к оплате:</span>
              <span class="text-xl font-bold text-[#0A65CC]">{{ order.budget }} ₽</span>
            </div>
          </div>
        </div>

        <!-- Форма оплаты -->
        <div class="bg-white rounded-xl border border-[#E5E9F2] p-6 mt-6 shadow-sm">
          <h2 class="text-lg font-bold text-[#222222] mb-4">Способ оплаты</h2>

          <div class="space-y-6">
            <!-- Выбор способа оплаты -->
            <div class="flex gap-4">
              <button
                @click="paymentMethod = 'card'"
                class="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors cursor-pointer"
                :class="
                  paymentMethod === 'card'
                    ? 'border-[#0A65CC] bg-[#F0F7FF] text-[#0A65CC]'
                    : 'border-[#E5E9F2] hover:border-[#0A65CC] text-[#656565]'
                "
              >
                <CreditCard class="w-5 h-5" />
                <span class="font-medium">Банковская карта</span>
              </button>
            </div>

            <!-- Форма для карты -->
            <div v-if="paymentMethod === 'card'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-[#656565] mb-1.5"> Номер карты </label>
                <input
                  v-model="cardNumber"
                  type="text"
                  maxlength="19"
                  placeholder="0000 0000 0000 0000"
                  class="w-full px-4 py-2.5 border border-[#E5E9F2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20 focus:border-[#0A65CC] transition-all"
                  @input="cardNumber = formatCardNumber($event.target.value)"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-[#656565] mb-1.5">
                    Срок действия
                  </label>
                  <input
                    v-model="cardExpiry"
                    type="text"
                    maxlength="5"
                    placeholder="ММ/ГГ"
                    class="w-full px-4 py-2.5 border border-[#E5E9F2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20 focus:border-[#0A65CC] transition-all"
                    @input="cardExpiry = formatExpiry($event.target.value)"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-[#656565] mb-1.5"> CVC код </label>
                  <input
                    v-model="cardCVC"
                    type="text"
                    maxlength="3"
                    placeholder="000"
                    class="w-full px-4 py-2.5 border border-[#E5E9F2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20 focus:border-[#0A65CC] transition-all"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-[#656565] mb-1.5">
                  Имя владельца карты
                </label>
                <input
                  v-model="cardholderName"
                  type="text"
                  placeholder="IVAN IVANOV"
                  class="w-full px-4 py-2.5 border border-[#E5E9F2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20 focus:border-[#0A65CC] transition-all uppercase"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Боковая панель -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-xl border border-[#E5E9F2] p-6 shadow-sm sticky top-6">
          <h2 class="text-lg font-bold text-[#222222] mb-4">Безопасность</h2>

          <div class="space-y-4">
            <div class="flex items-start gap-3">
              <Lock class="w-5 h-5 text-[#4CAF50] flex-shrink-0 mt-0.5" />
              <div>
                <p class="font-medium text-[#222222]">Безопасная оплата</p>
                <p class="text-sm text-[#656565]">Все платежи защищены SSL-шифрованием</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <Shield class="w-5 h-5 text-[#4CAF50] flex-shrink-0 mt-0.5" />
              <div>
                <p class="font-medium text-[#222222]">Защита данных</p>
                <p class="text-sm text-[#656565]">Ваши данные никогда не сохраняются</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <Clock class="w-5 h-5 text-[#4CAF50] flex-shrink-0 mt-0.5" />
              <div>
                <p class="font-medium text-[#222222]">Мгновенная оплата</p>
                <p class="text-sm text-[#656565]">Заказ будет доступен сразу после оплаты</p>
              </div>
            </div>
          </div>

          <button
            @click="handlePayment"
            :disabled="isProcessing"
            class="w-full mt-6 px-4 py-3 rounded-lg text-white font-medium bg-[#0A65CC] hover:bg-[#085BBA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            <template v-if="isProcessing">
              <div
                class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></div>
              Обработка...
            </template>
            <template v-else>
              <CreditCard class="w-5 h-5" />
              Оплатить {{ order?.budget }} ₽
            </template>
          </button>
        </div>
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
