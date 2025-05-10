<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { 
  Search, ArrowUp, ArrowDown, Clock, 
  Calendar, DollarSign, ChevronLeft, ChevronRight,
  AlertCircle, CheckCircle, XCircle, Clock3
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const item = ref(null)
const selectedLink = ref('Все')
const orders = ref([])
const isLoading = ref(true)
const searchQuery = ref('')
const sortField = ref('date')
const sortDirection = ref('desc')
const currentPage = ref(1)
const itemsPerPage = 10

// Статусы заказов и их цвета
const orderStatuses = {
  'new': { label: 'Новый', color: '#0A65CC', icon: AlertCircle },
  'in_progress': { label: 'В работе', color: '#FF9800', icon: Clock3 },
  'completed': { label: 'Выполнен', color: '#4CAF50', icon: CheckCircle },
  'cancelled': { label: 'Отменен', color: '#F44336', icon: XCircle }
}

const loadData = async () => {
  try {
    isLoading.value = true
    
    // Загрузка данных о товаре
    const { data: itemData } = await axios.get(
      `https://51ee8a820928c63e.mokky.dev/items/${route.params.id}`,
    )
    item.value = itemData

    // Загрузка заказов
    const { data: ordersData } = await axios.get(
      `https://51ee8a820928c63e.mokky.dev/orders?categoryId=${route.params.id}`,
    )
    
    // Добавляем статусы к заказам для демонстрации
    orders.value = ordersData.map(order => ({
      ...order,
      status: getRandomStatus(),
      date: getRandomDate(),
      deadline: getRandomDeadline()
    }))
  } catch (error) {
    console.error('Ошибка загрузки данных:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(loadData)

// Получение случайного статуса для демонстрации
const getRandomStatus = () => {
  const statuses = Object.keys(orderStatuses)
  return statuses[Math.floor(Math.random() * statuses.length)]
}

// Получение случайной даты для демонстрации
const getRandomDate = () => {
  const now = new Date()
  const daysAgo = Math.floor(Math.random() * 30)
  const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
  return date.toISOString()
}

// Получение случайного дедлайна для демонстрации
const getRandomDeadline = () => {
  const now = new Date()
  const daysAhead = Math.floor(Math.random() * 30) + 1
  const date = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000)
  return date.toISOString()
}

// Форматирование даты
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// Выбор фильтра
const selectLink = (link) => {
  selectedLink.value = link
  currentPage.value = 1 // Сброс на первую страницу при изменении фильтра
}

// Переход на страницу заказа
const goToOrderDetail = (orderId) => {
  router.push(`/order/${orderId}`)
}

// Изменение сортировки
const toggleSort = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'desc'
  }
}

// Фильтрация и сортировка заказов
const filteredOrders = computed(() => {
  let result = [...orders.value]
  
  // Фильтрация по выбранной категории
  if (selectedLink.value !== 'Все') {
    result = result.filter(order => order.category === selectedLink.value)
  }
  
  // Фильтрация по поисковому запросу
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(order => 
      order.description.toLowerCase().includes(query) || 
      order.customer.toLowerCase().includes(query)
    )
  }
  
  // Сортировка
  result.sort((a, b) => {
    let comparison = 0
    
    switch (sortField.value) {
      case 'description':
        comparison = a.description.localeCompare(b.description)
        break
      case 'customer':
        comparison = a.customer.localeCompare(b.customer)
        break
      case 'price':
        comparison = parseFloat(a.price.replace(/[^\d.-]/g, '')) - parseFloat(b.price.replace(/[^\d.-]/g, ''))
        break
      case 'date':
        comparison = new Date(a.date) - new Date(b.date)
        break
      case 'deadline':
        comparison = new Date(a.deadline) - new Date(b.deadline)
        break
      default:
        comparison = 0
    }
    
    return sortDirection.value === 'asc' ? comparison : -comparison
  })
  
  return result
})

// Пагинация
const paginatedOrders = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return filteredOrders.value.slice(startIndex, endIndex)
})

const totalPages = computed(() => Math.ceil(filteredOrders.value.length / itemsPerPage))

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// Получение иконки статуса
const getStatusIcon = (status) => {
  return orderStatuses[status]?.icon || AlertCircle
}

// Возврат на предыдущую страницу
const goBack = () => {
  router.go(-1)
}
</script>

<template>
  <div class="bg-[#F9F9F9] py-6 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Хлебные крошки и кнопка назад -->
      <div class="mb-6">
        <button @click="goBack" class="flex items-center text-[#656565] hover:text-[#0A65CC] transition-colors text-sm cursor-pointer">
          <ChevronLeft class="w-4 h-4 mr-1" />
          Назад
        </button>
      </div>
      
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A65CC]"></div>
      </div>
      
      <div v-else-if="item" class="bg-white rounded-lg shadow-sm border border-[#E5E9F2] overflow-hidden">
        <!-- Заголовок и информация о товаре -->
        <div class="p-6 border-b border-[#E5E9F2]">
          <div class="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <div class="w-16 h-16 p-1 md:w-20 md:h-20 flex-shrink-0 rounded-lg overflow-hidden border border-[#E5E9F2]">
              <img 
                :src="item.imageUrl" 
                :alt="item.title" 
                class="w-full h-full object-cover"
                onerror="this.src='https://via.placeholder.com/80?text=?'"
              />
            </div>
            
            <div class="flex-1">
              <h1 class="text-2xl md:text-3xl font-bold text-[#222222]">{{ item.title }}</h1>
              <p class="mt-2 text-[#656565] max-w-[800px]">
                Здесь вы можете с гарантией безопасности выполнить заказ и найти исполнителей для любых задач.
                Все проекты проверяются, и заказчики оплачивают работу только после подтверждения качества. У
                нас вы можете найти фрилансеров с разными навыками — от разработки сайтов до графического
                дизайна.
              </p>
            </div>
          </div>
        </div>
        
        <!-- Фильтры и поиск -->
        <div class="p-6 border-b border-[#E5E9F2] bg-[#F9F9F9]">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <!-- Фильтры по категориям -->
            <div class="flex flex-wrap gap-2">
              <button
                @click="selectLink('Все')"
                class="px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer"
                :class="selectedLink === 'Все' 
                  ? 'bg-[#0A65CC] text-white' 
                  : 'bg-white text-[#656565] border border-[#E5E9F2] hover:border-[#0A65CC] hover:text-[#0A65CC]'"
              >
                Все
              </button>
              <button
                v-for="(link, index) in item.links"
                :key="index"
                @click="selectLink(link)"
                class="px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer"
                :class="selectedLink === link 
                  ? 'bg-[#0A65CC] text-white' 
                  : 'bg-white text-[#656565] border border-[#E5E9F2] hover:border-[#0A65CC] hover:text-[#0A65CC]'"
              >
                {{ link }}
              </button>
            </div>
            
            <!-- Поиск -->
            <div class="relative w-full md:w-64">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Поиск заказов"
                class="w-full pl-9 pr-4 py-2 text-sm border border-[#E5E9F2] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0A65CC] focus:border-[#0A65CC] bg-white"
              />
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#656565]" />
            </div>
          </div>
        </div>
        
        <!-- Таблица заказов -->
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead class="bg-white">
              <tr class="border-b border-[#E5E9F2]">
                <th class="py-4 px-6 text-left">
                  <button 
                    @click="toggleSort('description')" 
                    class="flex items-center text-sm font-medium text-[#222222] cursor-pointer"
                  >
                    Описание
                    <span class="ml-1">
                      <ArrowUp 
                        v-if="sortField === 'description' && sortDirection === 'asc'" 
                        class="w-3 h-3 text-[#0A65CC]" 
                      />
                      <ArrowDown 
                        v-else-if="sortField === 'description' && sortDirection === 'desc'" 
                        class="w-3 h-3 text-[#0A65CC]" 
                      />
                      <div v-else class="w-3 h-3"></div>
                    </span>
                  </button>
                </th>
                <th class="py-4 px-6 text-left">
                  <button 
                    @click="toggleSort('customer')" 
                    class="flex items-center text-sm font-medium text-[#222222] cursor-pointer"
                  >
                    Заказчик
                    <span class="ml-1">
                      <ArrowUp 
                        v-if="sortField === 'customer' && sortDirection === 'asc'" 
                        class="w-3 h-3 text-[#0A65CC]" 
                      />
                      <ArrowDown 
                        v-else-if="sortField === 'customer' && sortDirection === 'desc'" 
                        class="w-3 h-3 text-[#0A65CC]" 
                      />
                      <div v-else class="w-3 h-3"></div>
                    </span>
                  </button>
                </th>
                <th class="py-4 px-6 text-left">
                  <button 
                    @click="toggleSort('status')" 
                    class="flex items-center text-sm font-medium text-[#222222] cursor-pointer"
                  >
                    Статус
                    <span class="ml-1">
                      <ArrowUp 
                        v-if="sortField === 'status' && sortDirection === 'asc'" 
                        class="w-3 h-3 text-[#0A65CC]" 
                      />
                      <ArrowDown 
                        v-else-if="sortField === 'status' && sortDirection === 'desc'" 
                        class="w-3 h-3 text-[#0A65CC]" 
                      />
                      <div v-else class="w-3 h-3"></div>
                    </span>
                  </button>
                </th>
                <th class="py-4 px-6 text-left">
                  <button 
                    @click="toggleSort('date')" 
                    class="flex items-center text-sm font-medium text-[#222222] cursor-pointer"
                  >
                    Дата
                    <span class="ml-1">
                      <ArrowUp 
                        v-if="sortField === 'date' && sortDirection === 'asc'" 
                        class="w-3 h-3 text-[#0A65CC]" 
                      />
                      <ArrowDown 
                        v-else-if="sortField === 'date' && sortDirection === 'desc'" 
                        class="w-3 h-3 text-[#0A65CC]" 
                      />
                      <div v-else class="w-3 h-3"></div>
                    </span>
                  </button>
                </th>
                <th class="py-4 px-6 text-left">
                  <button 
                    @click="toggleSort('deadline')" 
                    class="flex items-center text-sm font-medium text-[#222222] cursor-pointer"
                  >
                    Срок
                    <span class="ml-1">
                      <ArrowUp 
                        v-if="sortField === 'deadline' && sortDirection === 'asc'" 
                        class="w-3 h-3 text-[#0A65CC]" 
                      />
                      <ArrowDown 
                        v-else-if="sortField === 'deadline' && sortDirection === 'desc'" 
                        class="w-3 h-3 text-[#0A65CC]" 
                      />
                      <div v-else class="w-3 h-3"></div>
                    </span>
                  </button>
                </th>
                <th class="py-4 px-6 text-left">
                  <button 
                    @click="toggleSort('price')" 
                    class="flex items-center text-sm font-medium text-[#222222] cursor-pointer"
                  >
                    Цена
                    <span class="ml-1">
                      <ArrowUp 
                        v-if="sortField === 'price' && sortDirection === 'asc'" 
                        class="w-3 h-3 text-[#0A65CC]" 
                      />
                      <ArrowDown 
                        v-else-if="sortField === 'price' && sortDirection === 'desc'" 
                        class="w-3 h-3 text-[#0A65CC]" 
                      />
                      <div v-else class="w-3 h-3"></div>
                    </span>
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="order in paginatedOrders" 
                :key="order.id"
                @click="goToOrderDetail(order.id)"
                class="border-b border-[#E5E9F2] cursor-pointer transition-colors hover:bg-[#F0F7FF]"
              >
                <td class="py-4 px-6">
                  <div class="max-w-xs truncate">{{ order.description }}</div>
                </td>
                <td class="py-4 px-6">
                  <div class="flex items-center gap-3">
                    <div class="relative">
                      <img 
                        :src="order.avatar" 
                        :alt="order.customer" 
                        class="w-8 h-8 rounded-full object-cover border border-[#E5E9F2]"
                        onerror="this.src='https://via.placeholder.com/32?text=?'"
                      />
                      <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                    </div>
                    <span>{{ order.customer }}</span>
                  </div>
                </td>
                <td class="py-4 px-6">
                  <div class="flex items-center">
                    <span 
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                      :style="{ 
                        backgroundColor: orderStatuses[order.status]?.color + '15', 
                        color: orderStatuses[order.status]?.color 
                      }"
                    >
                      <component :is="getStatusIcon(order.status)" class="w-3 h-3" />
                      {{ orderStatuses[order.status]?.label }}
                    </span>
                  </div>
                </td>
                <td class="py-4 px-6">
                  <div class="flex items-center gap-1 text-[#656565]">
                    <Calendar class="w-4 h-4" />
                    <span>{{ formatDate(order.date) }}</span>
                  </div>
                </td>
                <td class="py-4 px-6">
                  <div class="flex items-center gap-1 text-[#656565]">
                    <Clock class="w-4 h-4" />
                    <span>{{ formatDate(order.deadline) }}</span>
                  </div>
                </td>
                <td class="py-4 px-6">
                  <div class="flex items-center gap-1 font-medium">
                    <DollarSign class="w-4 h-4 text-[#0A65CC]" />
                    <span>{{ order.price }}</span>
                  </div>
                </td>
              </tr>
              
              <!-- Если нет заказов -->
              <tr v-if="paginatedOrders.length === 0">
                <td colspan="6" class="py-12 text-center text-[#656565]">
                  <div class="flex flex-col items-center">
                    <AlertCircle class="w-12 h-12 text-[#E5E9F2] mb-3" />
                    <p class="text-lg font-medium mb-1">Заказы не найдены</p>
                    <p class="text-sm">Попробуйте изменить параметры поиска или фильтры</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Пагинация -->
        <div v-if="filteredOrders.length > 0" class="p-4 flex justify-between items-center border-t border-[#E5E9F2]">
          <div class="text-sm text-[#656565]">
            Показано {{ (currentPage - 1) * itemsPerPage + 1 }}-{{ Math.min(currentPage * itemsPerPage, filteredOrders.length) }} из {{ filteredOrders.length }} заказов
          </div>
          
          <div class="flex items-center gap-2">
            <button 
              @click="goToPage(currentPage - 1)" 
              class="p-2 rounded-md border border-[#E5E9F2] hover:border-[#0A65CC] transition-colors"
              :disabled="currentPage === 1"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
            >
              <ChevronLeft class="w-4 h-4 text-[#656565]" />
            </button>
            
            <div v-for="page in totalPages" :key="page" class="hidden md:block">
              <button 
                v-if="page === currentPage || page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)"
                @click="goToPage(page)"
                class="w-8 h-8 flex items-center justify-center rounded-md text-sm transition-colors"
                :class="currentPage === page 
                  ? 'bg-[#0A65CC] text-white' 
                  : 'text-[#656565] hover:bg-[#F0F7FF]'"
              >
                {{ page }}
              </button>
              <span 
                v-else-if="page === currentPage - 2 || page === currentPage + 2"
                class="w-8 h-8 flex items-center justify-center text-[#656565]"
              >
                ...
              </span>
            </div>
            
            <div class="md:hidden">
              <span class="text-sm text-[#656565]">{{ currentPage }} из {{ totalPages }}</span>
            </div>
            
            <button 
              @click="goToPage(currentPage + 1)" 
              class="p-2 rounded-md border border-[#E5E9F2] hover:border-[#0A65CC] transition-colors"
              :disabled="currentPage === totalPages"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
            >
              <ChevronRight class="w-4 h-4 text-[#656565]" />
            </button>
          </div>
        </div>
      </div>
      
      <div v-else class="bg-white rounded-lg shadow-sm border border-[#E5E9F2] p-12 text-center">
        <AlertCircle class="w-16 h-16 text-[#E5E9F2] mx-auto mb-4" />
        <h2 class="text-xl font-bold text-[#222222] mb-2">Товар не найден</h2>
        <p class="text-[#656565] mb-6">Запрашиваемый товар не существует или был удален</p>
        <button 
          @click="router.push('/')" 
          class="px-4 py-2 bg-[#0A65CC] text-white rounded-md hover:bg-[#085BBA] transition-colors"
        >
          Вернуться на главную
        </button>
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
