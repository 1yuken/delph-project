<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ordersApi } from '@/services/api'
import { useAuthStore } from '@/stores/authStore'
import { itemsApi } from '@/services/api'
import { ChevronLeft, AlertCircle, CheckCircle, XCircle, Clock3 } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const isLoading = ref(true)
const error = ref(null)
const success = ref(null)

const order = ref({
  title: '',
  description: '',
  budget: '',
  category: '',
  deadline: '',
  status: 'open',
  itemId: null,
})

const categories = ref([])

// Статусы заказов и их цвета
const orderStatuses = {
  new: { label: 'Новый', color: '#0A65CC', icon: AlertCircle },
  in_progress: { label: 'В работе', color: '#FF9800', icon: Clock3 },
  completed: { label: 'Выполнен', color: '#4CAF50', icon: CheckCircle },
  cancelled: { label: 'Отменен', color: '#F44336', icon: XCircle },
  open: { label: 'Открыт', color: '#0A65CC', icon: AlertCircle },
}

// Загрузка данных заказа
const fetchOrder = async () => {
  isLoading.value = true
  error.value = null

  try {
    const data = await ordersApi.getById(route.params.id)
    if (!data) {
      throw new Error('Заказ не найден')
    }

    // Проверяем, является ли пользователь владельцем заказа
    console.log(
      'client.id:',
      data.client?.id,
      'userId:',
      authStore.userId.value,
      typeof data.client?.id,
      typeof authStore.userId.value,
    )
    if (String(data.client?.id) !== String(authStore.userId.value)) {
      throw new Error('У вас нет прав на редактирование этого заказа')
    }

    // Преобразуем дату в формат YYYY-MM-DD для input type="date"
    let deadline = ''
    if (data.completionDate) {
      const d = new Date(data.completionDate)
      deadline = d.toISOString().split('T')[0]
    }

    order.value = {
      ...data,
      status: data.status || 'open',
      deadline: deadline,
      itemId: data.itemId || null,
      category: data.categories || '',
    }

    // Загружаем категории по itemId
    if (order.value.itemId) {
      const item = await itemsApi.getOne(order.value.itemId)
      categories.value = item.links || []
      // Если у заказа уже есть категория, и она есть в списке, оставляем её выбранной
      if (order.value.category && !categories.value.includes(order.value.category)) {
        categories.value.push(order.value.category)
      }
    } else {
      categories.value = []
    }
  } catch (err) {
    console.error('Ошибка загрузки заказа:', err)
    error.value = err.message || 'Не удалось загрузить информацию о заказе'
  } finally {
    isLoading.value = false
  }
}

// Сохранение изменений
const saveOrder = async () => {
  error.value = null
  success.value = null
  isLoading.value = true

  try {
    const orderData = {
      ...order.value,
      completionDate: order.value.deadline,
      categories: order.value.category, // отправляем categories
    }

    await ordersApi.update(route.params.id, orderData)
    success.value = 'Заказ успешно обновлен'

    // Перенаправляем на страницу заказа через 1.5 секунды
    setTimeout(() => {
      router.push(`/order/${route.params.id}`)
    }, 1500)
  } catch (err) {
    console.error('Ошибка обновления заказа:', err)
    error.value = err.message || 'Не удалось обновить заказ'
  } finally {
    isLoading.value = false
  }
}

// Возврат на предыдущую страницу
const goBack = () => {
  router.go(-1)
}

onMounted(fetchOrder)
</script>

<template>
  <div class="bg-[#F9F9F9] py-6 px-4">
    <div class="max-w-3xl mx-auto">
      <!-- Хлебные крошки и кнопка назад -->
      <div class="mb-6">
        <button
          @click="goBack"
          class="flex items-center text-[#656565] hover:text-[#0A65CC] transition-colors text-sm cursor-pointer"
        >
          <ChevronLeft class="w-4 h-4 mr-1" />
          Назад
        </button>
      </div>

      <!-- Состояние загрузки -->
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A65CC]"
        ></div>
      </div>

      <!-- Сообщение об ошибке -->
      <div
        v-else-if="error"
        class="bg-white rounded-lg shadow-sm border border-[#E5E9F2] p-8 text-center"
      >
        <AlertCircle class="w-16 h-16 text-[#E5E9F2] mx-auto mb-4" />
        <h2 class="text-xl font-bold text-[#222222] mb-2">Ошибка</h2>
        <p class="text-[#656565] mb-6">{{ error }}</p>
        <button
          @click="goBack"
          class="px-4 py-2 bg-[#0A65CC] text-white rounded-md cursor-pointer hover:bg-[#085BBA] transition-colors"
        >
          Вернуться назад
        </button>
      </div>

      <!-- Форма редактирования -->
      <div v-else class="bg-white rounded-lg shadow-sm border border-[#E5E9F2] overflow-hidden">
        <div class="p-6 border-b border-[#E5E9F2]">
          <h1 class="text-2xl font-bold text-[#222222]">Редактирование заказа</h1>
        </div>

        <div class="p-6">
          <!-- Сообщение об успехе -->
          <div
            v-if="success"
            class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700"
          >
            {{ success }}
          </div>

          <form @submit.prevent="saveOrder" class="space-y-6">
            <!-- Название -->
            <div>
              <label for="title" class="block text-sm font-medium text-[#222222] mb-2">
                Название заказа
              </label>
              <input
                id="title"
                v-model="order.title"
                type="text"
                required
                class="w-full px-4 py-2 border border-[#E5E9F2] rounded-lg focus:outline-none focus:border-[#0A65CC]"
                placeholder="Введите название заказа"
              />
            </div>

            <!-- Описание -->
            <div>
              <label for="description" class="block text-sm font-medium text-[#222222] mb-2">
                Описание
              </label>
              <textarea
                id="description"
                v-model="order.description"
                required
                rows="6"
                class="w-full px-4 py-2 border border-[#E5E9F2] rounded-lg focus:outline-none focus:border-[#0A65CC] resize-none"
                placeholder="Опишите ваш заказ"
              ></textarea>
            </div>

            <!-- Бюджет -->
            <div>
              <label for="budget" class="block text-sm font-medium text-[#222222] mb-2">
                Бюджет
              </label>
              <input
                id="budget"
                v-model="order.budget"
                type="number"
                min="0"
                class="w-full px-4 py-2 border border-[#E5E9F2] rounded-lg focus:outline-none focus:border-[#0A65CC]"
                placeholder="Укажите бюджет в рублях"
              />
            </div>

            <!-- Категория -->
            <div>
              <label for="category" class="block text-sm font-medium text-[#222222] mb-2">
                Категория
              </label>
              <select
                id="category"
                v-model="order.category"
                required
                class="w-full px-4 py-2 border border-[#E5E9F2] cursor-pointer rounded-lg focus:outline-none focus:border-[#0A65CC]"
              >
                <option value="">Выберите категорию</option>
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>

            <!-- Срок выполнения -->
            <div>
              <label for="deadline" class="block text-sm font-medium text-[#222222] mb-2">
                Срок выполнения
              </label>
              <input
                id="deadline"
                v-model="order.deadline"
                type="date"
                required
                class="w-full px-4 py-2 border border-[#E5E9F2] rounded-lg cursor-pointer focus:outline-none focus:border-[#0A65CC]"
              />
            </div>

            <!-- Статус -->
            <div>
              <label for="status" class="block text-sm font-medium text-[#222222] mb-2">
                Статус
              </label>
              <select
                id="status"
                v-model="order.status"
                required
                class="w-full px-4 py-2 border border-[#E5E9F2] rounded-lg cursor-pointer focus:outline-none focus:border-[#0A65CC]"
              >
                <option
                  v-for="(status, key) in orderStatuses"
                  :key="key"
                  :value="key"
                  class="flex items-center gap-2"
                >
                  {{ status.label }}
                </option>
              </select>
            </div>

            <!-- Кнопки действий -->
            <div class="flex gap-4">
              <button
                type="submit"
                :disabled="isLoading"
                class="flex-1 cursor-pointer py-3 bg-[#0A65CC] text-white rounded-lg font-medium hover:bg-[#085BBA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isLoading ? 'Сохранение...' : 'Сохранить изменения' }}
              </button>
              <button
                type="button"
                @click="goBack"
                class="px-6 cursor-pointer py-3 border border-[#E5E9F2] text-[#656565] rounded-lg font-medium hover:border-[#0A65CC] hover:text-[#0A65CC] transition-colors"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Стилизация скроллбара */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
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
</style>
