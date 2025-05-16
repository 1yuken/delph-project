<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import api from '@/services/api'
import {
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock3,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  CreditCard,
  Briefcase,
  ArrowRight,
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const orders = ref([])
const isLoading = ref(true)
const error = ref(null)
const currentPage = ref(1)
const totalPages = ref(1)
const itemsPerPage = 10
const searchQuery = ref('')
const statusFilter = ref('')

// Статусы заказов и их цвета
const orderStatuses = {
  open: { label: 'Открыт', color: '#0A65CC', icon: AlertCircle },
  in_progress: { label: 'В работе', color: '#FF9800', icon: Clock3 },
  completed: { label: 'Выполнен', color: '#4CAF50', icon: CheckCircle },
  cancelled: { label: 'Отменен', color: '#F44336', icon: XCircle },
}

// Форматирование даты
const formatDate = (date) => {
  if (!date) return 'Не указано'
  return new Date(date).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

// Получение иконки статуса
const getStatusIcon = (status) => {
  return orderStatuses[status]?.icon || AlertCircle
}

// Загрузка заказов
const loadOrders = async () => {
  try {
    isLoading.value = true
    const response = await api.get('/orders/my/client', {
      params: {
        page: currentPage.value,
        limit: itemsPerPage,
        search: searchQuery.value || undefined,
        status: statusFilter.value || undefined,
      },
    })
    orders.value = response.data.orders
    totalPages.value = Math.ceil(response.data.total / itemsPerPage)
  } catch (err) {
    error.value = 'Ошибка при загрузке заказов'
    console.error('Error loading orders:', err)
  } finally {
    isLoading.value = false
  }
}

// Обработчики пагинации
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    loadOrders()
  }
}

// Обработчик поиска
const handleSearch = () => {
  currentPage.value = 1
  loadOrders()
}

// Обработчик фильтра по статусу
const handleStatusFilter = (status) => {
  statusFilter.value = status
  currentPage.value = 1
  loadOrders()
}

// Сброс фильтров
const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  currentPage.value = 1
  loadOrders()
}

// Добавляем новые методы для работы с платежами и подтверждением
const handlePayment = async (orderId) => {
  try {
    const response = await api.post(`/orders/${orderId}/payment`)
    // Здесь можно добавить редирект на страницу оплаты или открыть модальное окно
    window.location.href = response.data.paymentUrl
  } catch (err) {
    error.value = 'Ошибка при создании платежа'
    console.error('Error creating payment:', err)
  }
}

const confirmOrder = async (orderId) => {
  try {
    await api.post(`/orders/${orderId}/complete`)
    await loadOrders() // Перезагружаем список заказов
  } catch (err) {
    error.value = 'Ошибка при подтверждении заказа'
    console.error('Error confirming order:', err)
  }
}

// Добавляем метод для проверки владельца заказа
const isOrderOwner = (order) => {
  if (!order || !order.clientId || !authStore.userId.value) return false
  return String(order.clientId) === String(authStore.userId.value)
}

// Модальные окна для подтверждения действий
const showConfirmModal = ref(false)
const showDeleteModal = ref(false)
const showPaymentModal = ref(false)
const selectedOrder = ref(null)
const pendingAction = ref('')

const openModal = (order, action) => {
  selectedOrder.value = order
  pendingAction.value = action
  if (action === 'confirm') showConfirmModal.value = true
  if (action === 'delete') showDeleteModal.value = true
  if (action === 'pay') showPaymentModal.value = true
}
const closeModal = () => {
  showConfirmModal.value = false
  showDeleteModal.value = false
  showPaymentModal.value = false
  selectedOrder.value = null
  pendingAction.value = ''
}

const handleConfirmedAction = async () => {
  if (!selectedOrder.value) return
  if (pendingAction.value === 'confirm') {
    await confirmOrder(selectedOrder.value.id)
  } else if (pendingAction.value === 'delete') {
    await deleteOrder(selectedOrder.value.id)
  } else if (pendingAction.value === 'pay') {
    await handlePayment(selectedOrder.value.id)
  }
  closeModal()
}

const deleteOrder = async (orderId) => {
  try {
    await api.delete(`/orders/${orderId}`)
    await loadOrders()
  } catch (err) {
    error.value = 'Ошибка при удалении заказа'
    console.error('Error deleting order:', err)
  }
}

onMounted(() => {
  if (!authStore.isAuthenticated.value) {
    router.push('/login')
    return
  }
  loadOrders()
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <!-- Заголовок и фильтры -->
    <div class="bg-white rounded-xl border border-[#E5E9F2] p-6 mb-6 shadow-sm">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div class="flex items-center gap-3">
          <div class="bg-[#F0F7FF] p-2 rounded-lg">
            <Briefcase class="w-6 h-6 text-[#0A65CC]" />
          </div>
          <h1 class="text-2xl font-bold text-[#222222]">Мои заказы</h1>
        </div>

        <!-- Поиск -->
        <div class="relative w-full md:w-64">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Поиск заказов..."
            class="w-full pl-10 pr-4 py-2.5 border border-[#E5E9F2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20 focus:border-[#0A65CC] transition-all"
            @keyup.enter="handleSearch"
          />
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#656565]" />
          <button 
            v-if="searchQuery" 
            @click="resetFilters" 
            class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#656565] hover:text-[#222222] cursor-pointer"
          >
            <XCircle class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Фильтры по статусу -->
      <div class="flex flex-wrap gap-2">
        <button
          v-for="(status, key) in orderStatuses"
          :key="key"
          @click="handleStatusFilter(key)"
          class="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
          :class="
            statusFilter === key
              ? 'bg-[#0A65CC] text-white shadow-sm'
              : 'bg-[#F9F9F9] text-[#656565] hover:bg-[#F0F7FF]'
          "
        >
          <component :is="status.icon" class="w-4 h-4" />
          {{ status.label }}
        </button>
        <button
          v-if="statusFilter || searchQuery"
          @click="resetFilters"
          class="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-[#F9F9F9] text-[#656565] hover:bg-[#F0F7FF] transition-colors cursor-pointer"
        >
          <Filter class="w-4 h-4" />
          Сбросить фильтры
        </button>
      </div>
    </div>

    <!-- Карточки заказов -->
    <div class="space-y-4">
      <div
        v-for="order in orders"
        :key="order.id"
        class="bg-white rounded-xl shadow-sm border border-[#E5E9F2] overflow-hidden group hover:shadow-md transition-all duration-300 cursor-pointer relative"
        @click="router.push(`/order/${order.id}`)"
      >
        <div class="absolute top-0 left-0 h-full w-1.5" :style="{ backgroundColor: orderStatuses[order.status]?.color }"></div>
        <div class="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex-1 min-w-0 pl-2">
            <div class="flex flex-col md:flex-row md:items-center md:gap-4 mb-3">
              <div class="text-lg font-bold text-[#222222] truncate">{{ order.title }}</div>
              <div class="flex flex-wrap gap-1.5 mt-2 md:mt-0">
                <template v-if="Array.isArray(order.categories)">
                  <span
                    v-for="category in order.categories"
                    :key="category"
                    class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#F0F7FF] text-[#0A65CC] border border-[#E1EFFF]"
                  >
                    {{ category }}
                  </span>
                </template>
                <template v-else>
                  <span
                    class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#F0F7FF] text-[#0A65CC] border border-[#E1EFFF]"
                  >
                    {{ order.categories }}
                  </span>
                </template>
              </div>
            </div>
            <div class="flex flex-wrap gap-4 text-sm text-[#656565] mb-2">
              <div class="flex items-center gap-1.5">
                <component :is="getStatusIcon(order.status)" class="w-4 h-4" />
                <span :style="{ color: orderStatuses[order.status]?.color }" class="font-medium">{{
                  orderStatuses[order.status]?.label
                }}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <Calendar class="w-4 h-4" />
                <span>Создан: {{ formatDate(order.creationDate) }}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <Clock class="w-4 h-4" />
                <span>Срок: {{ formatDate(order.completionDate) }}</span>
              </div>
              <div class="flex items-center gap-1.5 font-medium text-[#222222]">
                <svg
                  class="w-4 h-4 text-[#0A65CC]"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 3V21M6 7H15.5C17.9853 7 20 8.79086 20 11C20 13.2091 17.9853 15 15.5 15H6M6 11H17"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span>{{ order.budget }} ₽</span>
              </div>
            </div>
          </div>
          <div
            class="flex flex-col gap-2 md:items-end md:justify-center min-w-[180px] z-10"
            @click.stop
          >
            <button
              v-if="isOrderOwner(order) && order.status === 'in_progress'"
              @click.stop="openModal(order, 'confirm')"
              class="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-[#4CAF50] text-white hover:bg-[#43A047] transition-colors cursor-pointer shadow-sm hover:shadow"
            >
              <CheckCircle class="w-4 h-4" />
              Подтвердить
            </button>
            <button
              v-if="isOrderOwner(order) && order.status === 'open'"
              @click.stop="openModal(order, 'pay')"
              class="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-[#0A65CC] text-white hover:bg-[#085BBA] transition-colors cursor-pointer shadow-sm hover:shadow"
            >
              <CreditCard class="w-4 h-4" />
              Оплатить
            </button>
            <button
              v-if="isOrderOwner(order) && (order.status === 'open' || order.status === 'cancelled')"
              @click.stop="openModal(order, 'delete')"
              class="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-white text-[#F44336] border border-[#F44336] hover:bg-[#FEE2E2] transition-colors cursor-pointer"
            >
              <XCircle class="w-4 h-4" />
              Удалить
            </button>
          </div>
        </div>
        <div class="px-6 py-2 bg-[#F9F9F9] border-t border-[#E5E9F2] flex justify-end">
          <button class="text-sm text-[#0A65CC] font-medium flex items-center gap-1 cursor-pointer group-hover:text-[#085BBA] transition-colors">
            Подробнее
            <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
      
      <!-- Если нет заказов -->
      <div
        v-if="orders.length === 0 && !isLoading"
        class="bg-white rounded-xl shadow-sm border border-[#E5E9F2] p-8 text-center"
      >
        <div class="bg-[#F0F7FF] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle class="w-8 h-8 text-[#0A65CC]" />
        </div>
        <p class="text-lg font-medium text-[#222222] mb-2">Заказы не найдены</p>
        <p class="text-sm text-[#656565] mb-4">Попробуйте изменить параметры поиска или фильтры</p>
        <button 
          @click="resetFilters" 
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-[#0A65CC] text-white hover:bg-[#085BBA] transition-colors cursor-pointer"
        >
          <Filter class="w-4 h-4" />
          Сбросить фильтры
        </button>
      </div>
      
      <!-- Загрузка -->
      <div
        v-if="isLoading"
        class="bg-white rounded-xl shadow-sm border border-[#E5E9F2] p-8 text-center"
      >
        <div class="relative w-16 h-16 mx-auto mb-4">
          <div class="absolute inset-0 rounded-full border-4 border-[#E5E9F2]"></div>
          <div class="absolute inset-0 rounded-full border-4 border-t-[#0A65CC] animate-spin"></div>
        </div>
        <p class="text-lg font-medium text-[#222222]">Загрузка заказов...</p>
        <p class="text-sm text-[#656565] mt-1">Пожалуйста, подождите</p>
      </div>
    </div>

    <!-- Пагинация -->
    <div
      v-if="totalPages > 1 && !isLoading"
      class="flex items-center justify-between mt-6 bg-white rounded-xl shadow-sm border border-[#E5E9F2] px-6 py-4"
    >
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        :class="
          currentPage === 1
            ? 'bg-[#F9F9F9] text-[#656565]'
            : 'bg-[#F9F9F9] text-[#656565] hover:bg-[#F0F7FF]'
        "
      >
        <ChevronLeft class="w-4 h-4" />
        Назад
      </button>

      <div class="hidden md:flex items-center gap-2">
        <button
          v-for="page in totalPages"
          :key="page"
          @click="goToPage(page)"
          class="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer"
          :class="
            currentPage === page
              ? 'bg-[#0A65CC] text-white shadow-sm'
              : 'bg-[#F9F9F9] text-[#656565] hover:bg-[#F0F7FF]'
          "
        >
          {{ page }}
        </button>
      </div>
      
      <div class="md:hidden text-sm text-[#656565]">
        Страница {{ currentPage }} из {{ totalPages }}
      </div>

      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        :class="
          currentPage === totalPages
            ? 'bg-[#F9F9F9] text-[#656565]'
            : 'bg-[#F9F9F9] text-[#656565] hover:bg-[#F0F7FF]'
        "
      >
        Вперед
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>

    <!-- Модальные окна -->
    <template v-if="showConfirmModal">
      <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
          <div class="flex items-center gap-3 mb-4">
            <div class="bg-[#E6F4EA] p-2 rounded-full">
              <CheckCircle class="w-6 h-6 text-[#4CAF50]" />
            </div>
            <h2 class="text-xl font-bold text-[#222222]">Подтвердить выполнение</h2>
          </div>
          <p class="mb-6 text-[#656565]">
            Вы уверены, что хотите подтвердить выполнение заказа "{{ selectedOrder?.title }}"?
          </p>
          <div class="flex justify-end gap-3">
            <button 
              @click="closeModal" 
              class="px-4 py-2 rounded-lg text-sm font-medium border border-[#E5E9F2] text-[#656565] hover:bg-[#F9F9F9] transition-colors cursor-pointer"
            >
              Отмена
            </button>
            <button
              @click="handleConfirmedAction"
              class="px-4 py-2 rounded-lg text-sm font-medium bg-[#4CAF50] text-white hover:bg-[#43A047] transition-colors cursor-pointer shadow-sm"
            >
              Подтвердить
            </button>
          </div>
        </div>
      </div>
    </template>
    
    <template v-if="showDeleteModal">
      <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
          <div class="flex items-center gap-3 mb-4">
            <div class="bg-[#FEECEB] p-2 rounded-full">
              <XCircle class="w-6 h-6 text-[#F44336]" />
            </div>
            <h2 class="text-xl font-bold text-[#222222]">Удалить заказ</h2>
          </div>
          <p class="mb-6 text-[#656565]">
            Вы уверены, что хотите удалить заказ "{{ selectedOrder?.title }}"? Это действие
            необратимо.
          </p>
          <div class="flex justify-end gap-3">
            <button 
              @click="closeModal" 
              class="px-4 py-2 rounded-lg text-sm font-medium border border-[#E5E9F2] text-[#656565] hover:bg-[#F9F9F9] transition-colors cursor-pointer"
            >
              Отмена
            </button>
            <button
              @click="handleConfirmedAction"
              class="px-4 py-2 rounded-lg text-sm font-medium bg-[#F44336] text-white hover:bg-[#C62828] transition-colors cursor-pointer shadow-sm"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </template>
    
    <template v-if="showPaymentModal">
      <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
          <div class="flex items-center gap-3 mb-4">
            <div class="bg-[#F0F7FF] p-2 rounded-full">
              <CreditCard class="w-6 h-6 text-[#0A65CC]" />
            </div>
            <h2 class="text-xl font-bold text-[#222222]">Оплатить заказ</h2>
          </div>
          <p class="mb-2 text-[#656565]">
            Вы собираетесь оплатить заказ:
          </p>
          <div class="bg-[#F9F9F9] p-4 rounded-lg mb-4 border border-[#E5E9F2]">
            <p class="font-medium text-[#222222] mb-1">{{ selectedOrder?.title }}</p>
            <div class="flex justify-between items-center">
              <span class="text-sm text-[#656565]">Сумма к оплате:</span>
              <span class="font-bold text-[#0A65CC]">{{ selectedOrder?.budget }} ₽</span>
            </div>
          </div>
          <div class="flex justify-end gap-3">
            <button 
              @click="closeModal" 
              class="px-4 py-2 rounded-lg text-sm font-medium border border-[#E5E9F2] text-[#656565] hover:bg-[#F9F9F9] transition-colors cursor-pointer"
            >
              Отмена
            </button>
            <button
              @click="handleConfirmedAction"
              class="px-4 py-2 rounded-lg text-sm font-medium bg-[#0A65CC] text-white hover:bg-[#085BBA] transition-colors cursor-pointer shadow-sm"
            >
              Перейти к оплате
            </button>
          </div>
        </div>
      </div>
    </template>
    
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