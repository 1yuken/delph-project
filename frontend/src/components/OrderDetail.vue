<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { 
  ChevronLeft, Calendar, Clock, DollarSign, User, 
  AlertCircle, CheckCircle, XCircle, Clock3, 
  MessageSquare, Bookmark, Share2, Flag, 
  FileText, MapPin, Briefcase, Award, Shield
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const order = ref(null)
const isLoading = ref(true)
const error = ref(null)
const similarOrders = ref([])
const isBookmarked = ref(false)
const isLiked = ref(false)

// Статусы заказов и их цвета
const orderStatuses = {
  'new': { label: 'Новый', color: '#0A65CC', icon: AlertCircle },
  'in_progress': { label: 'В работе', color: '#FF9800', icon: Clock3 },
  'completed': { label: 'Выполнен', color: '#4CAF50', icon: CheckCircle },
  'cancelled': { label: 'Отменен', color: '#F44336', icon: XCircle }
}

// Загрузка данных заказа
const fetchOrder = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    const { data } = await axios.get(`https://51ee8a820928c63e.mokky.dev/orders/${route.params.id}`)
    order.value = data
    
    // Добавляем дополнительные данные для демонстрации
    order.value.status = getRandomStatus()
    order.value.date = getRandomDate()
    order.value.deadline = getRandomDeadline()
    order.value.views = Math.floor(Math.random() * 500) + 50
    order.value.responses = Math.floor(Math.random() * 20)
    order.value.customerRating = (Math.random() * 2 + 3).toFixed(1)
    order.value.customerReviews = Math.floor(Math.random() * 50) + 5
    order.value.customerCompletedProjects = Math.floor(Math.random() * 100) + 10
    order.value.location = 'Москва, Россия'
    order.value.skills = ['JavaScript', 'Vue.js', 'HTML/CSS', 'Адаптивный дизайн', 'API интеграция']
    order.value.attachments = Math.floor(Math.random() * 5)
    
    // Загрузка похожих заказов
    fetchSimilarOrders()
  } catch (err) {
    console.error('Ошибка загрузки заказа:', err)
    error.value = 'Не удалось загрузить информацию о заказе'
  } finally {
    isLoading.value = false
  }
}

// Загрузка похожих заказов
const fetchSimilarOrders = async () => {
  try {
    const { data } = await axios.get('https://51ee8a820928c63e.mokky.dev/orders')
    // Фильтруем и берем только 3 случайных заказа
    similarOrders.value = data
      .filter(item => item.id !== order.value.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(order => ({
        ...order,
        status: getRandomStatus(),
        date: getRandomDate(),
        deadline: getRandomDeadline()
      }))
  } catch (err) {
    console.error('Ошибка загрузки похожих заказов:', err)
  }
}

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

// Вычисляемое свойство для определения, истекает ли срок
const isDeadlineApproaching = computed(() => {
  if (!order.value?.deadline) return false
  
  const deadline = new Date(order.value.deadline)
  const now = new Date()
  const diffTime = deadline - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays <= 3 && diffDays > 0
})

// Вычисляемое свойство для определения, просрочен ли заказ
const isDeadlinePassed = computed(() => {
  if (!order.value?.deadline) return false
  
  const deadline = new Date(order.value.deadline)
  const now = new Date()
  
  return deadline < now
})

// Переключение закладки
const toggleBookmark = () => {
  isBookmarked.value = !isBookmarked.value
}

// Переключение лайка
const toggleLike = () => {
  isLiked.value = !isLiked.value
}

// Переход на страницу заказа
const goToOrder = (orderId) => {
  router.push(`/order/${orderId}`)
}

// Возврат на предыдущую страницу
const goBack = () => {
  router.go(-1)
}

// Отклик на заказ
const respondToOrder = () => {
  // Здесь будет логика отклика на заказ
  alert('Функция отклика на заказ будет реализована в будущем')
}

// Поделиться заказом
const shareOrder = () => {
  // Здесь будет логика для шаринга заказа
  alert('Функция шаринга заказа будет реализована в будущем')
}

// Пожаловаться на заказ
const reportOrder = () => {
  // Здесь будет логика для жалобы на заказ
  alert('Функция жалобы на заказ будет реализована в будущем')
}

onMounted(fetchOrder)
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
      
      <!-- Состояние загрузки -->
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A65CC]"></div>
      </div>
      
      <!-- Сообщение об ошибке -->
      <div v-else-if="error" class="bg-white rounded-lg shadow-sm border border-[#E5E9F2] p-8 text-center">
        <AlertCircle class="w-16 h-16 text-[#E5E9F2] mx-auto mb-4" />
        <h2 class="text-xl font-bold text-[#222222] mb-2">Ошибка загрузки</h2>
        <p class="text-[#656565] mb-6">{{ error }}</p>
        <button 
          @click="fetchOrder" 
          class="px-4 py-2 bg-[#0A65CC] text-white rounded-md hover:bg-[#085BBA] transition-colors"
        >
          Попробовать снова
        </button>
      </div>
      
      <!-- Основной контент -->
      <div v-else-if="order" class="flex flex-col lg:flex-row gap-6">
        <!-- Левая колонка (детали заказа) -->
        <div class="w-full lg:w-2/3">
          <!-- Карточка с основной информацией -->
          <div class="bg-white rounded-lg shadow-sm border border-[#E5E9F2] overflow-hidden mb-6">
            <!-- Заголовок и статус -->
            <div class="p-6 border-b border-[#E5E9F2]">
              <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <div class="flex items-center gap-3 mb-2">
                    <span 
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                      :style="{ 
                        backgroundColor: orderStatuses[order.status]?.color + '15', 
                        color: orderStatuses[order.status]?.color 
                      }"
                    >
                      <component :is="orderStatuses[order.status]?.icon" class="w-3 h-3" />
                      {{ orderStatuses[order.status]?.label }}
                    </span>
                    <span class="text-xs text-[#656565] flex items-center gap-1">
                      <Calendar class="w-3 h-3" />
                      Опубликовано: {{ formatDate(order.date) }}
                    </span>
                    <span class="text-xs text-[#656565] flex items-center gap-1">
                      <User class="w-3 h-3" />
                      {{ order.views }} просмотров
                    </span>
                  </div>
                  <h1 class="text-2xl font-bold text-[#222222] mb-1">{{ order.title }}</h1>
                  <div class="flex items-center gap-3 flex-wrap">
                    <div class="flex items-center gap-1 text-[#656565]">
                      <Clock class="w-4 h-4" />
                      <span 
                        :class="{
                          'text-[#FF9800] font-medium': isDeadlineApproaching,
                          'text-[#F44336] font-medium': isDeadlinePassed
                        }"
                      >
                        Срок: {{ formatDate(order.deadline) }}
                      </span>
                    </div>
                    <div class="flex items-center gap-1 font-medium">
                      <DollarSign class="w-4 h-4 text-[#0A65CC]" />
                      <span>{{ order.price }}</span>
                    </div>
                    <div class="flex items-center gap-1 text-[#656565]">
                      <MapPin class="w-4 h-4" />
                      <span>{{ order.location }}</span>
                    </div>
                  </div>
                </div>
                
                <!-- Кнопки действий -->
                <div class="flex flex-wrap gap-2">
                  <button 
                    @click="toggleBookmark" 
                    class="flex items-center gap-1 px-3 py-1.5 border rounded-md text-sm transition-colors cursor-pointer"
                    :class="isBookmarked 
                      ? 'bg-[#F0F7FF] text-[#0A65CC] border-[#0A65CC]' 
                      : 'border-[#E5E9F2] text-[#656565] hover:border-[#0A65CC] hover:text-[#0A65CC]'"
                  >
                    <Bookmark class="w-4 h-4" :fill="isBookmarked ? '#0A65CC' : 'none'" />
                    <span>{{ isBookmarked ? 'В закладках' : 'В закладки' }}</span>
                  </button>
                  <button 
                    @click="shareOrder" 
                    class="flex items-center gap-1 px-3 py-1.5 border border-[#E5E9F2] cursor-pointer rounded-md text-sm text-[#656565] hover:border-[#0A65CC] hover:text-[#0A65CC] transition-colors"
                  >
                    <Share2 class="w-4 h-4" />
                    <span>Поделиться</span>
                  </button>
                  <button 
                    @click="reportOrder" 
                    class="flex items-center gap-1 px-3 py-1.5 border border-[#E5E9F2] cursor-pointer rounded-md text-sm text-[#656565] hover:border-[#F44336] hover:text-[#F44336] transition-colors"
                  >
                    <Flag class="w-4 h-4" />
                    <span>Пожаловаться</span>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Описание заказа -->
            <div class="p-6">
              <h2 class="text-lg font-semibold text-[#222222] mb-4">Описание проекта</h2>
              <div class="prose max-w-none text-[#222222]">
                <p class="mb-4">{{ order.description }}</p>
                <p class="mb-4">
                  Мы ищем опытного разработчика для создания современного веб-приложения с использованием Vue.js. 
                  Проект включает в себя разработку пользовательского интерфейса, интеграцию с API и оптимизацию 
                  производительности.
                </p>
                <h3 class="text-base font-semibold mt-6 mb-2">Требования:</h3>
                <ul class="list-disc pl-5 mb-4 space-y-1">
                  <li>Опыт работы с Vue.js от 2 лет</li>
                  <li>Знание HTML5, CSS3, JavaScript (ES6+)</li>
                  <li>Опыт работы с REST API</li>
                  <li>Понимание принципов адаптивного дизайна</li>
                  <li>Умение работать с системами контроля версий (Git)</li>
                </ul>
                <h3 class="text-base font-semibold mt-6 mb-2">Ожидаемый результат:</h3>
                <ul class="list-disc pl-5 mb-4 space-y-1">
                  <li>Полностью функциональное веб-приложение</li>
                  <li>Чистый, хорошо структурированный код</li>
                  <li>Адаптивный дизайн для всех устройств</li>
                  <li>Оптимизированная производительность</li>
                </ul>
                <p class="mt-6 text-[#656565]">
                  <span class="font-medium text-[#222222]">Примечание:</span> Проект должен быть выполнен в соответствии с 
                  предоставленными макетами и техническим заданием. Все вопросы можно обсудить в процессе работы.
                </p>
              </div>
              
              <!-- Навыки -->
              <div class="mt-6">
                <h3 class="text-base font-semibold mb-3">Требуемые навыки:</h3>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="(skill, index) in order.skills" 
                    :key="index"
                    class="px-3 py-1.5 bg-[#F0F7FF] text-[#0A65CC] text-sm rounded-md"
                  >
                    {{ skill }}
                  </span>
                </div>
              </div>
              
              <!-- Вложения -->
              <div v-if="order.attachments > 0" class="mt-6 p-4 bg-[#F9F9F9] rounded-lg">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="text-base font-semibold">Вложения ({{ order.attachments }})</h3>
                  <button class="text-sm text-[#0A65CC] hover:underline">Скачать все</button>
                </div>
                <div class="space-y-2">
                  <div 
                    v-for="i in order.attachments" 
                    :key="i"
                    class="flex items-center justify-between p-3 bg-white rounded-md border border-[#E5E9F2]"
                  >
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-[#F0F7FF] rounded-md flex items-center justify-center text-[#0A65CC]">
                        <FileText class="w-5 h-5" />
                      </div>
                      <div>
                        <p class="font-medium text-[#222222]">Техническое задание {{ i }}.pdf</p>
                        <p class="text-xs text-[#656565]">PDF, 2.3 МБ</p>
                      </div>
                    </div>
                    <button class="text-[#0A65CC] hover:text-[#085BBA]">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Похожие заказы -->
          <div class="bg-white rounded-lg shadow-sm border border-[#E5E9F2] overflow-hidden">
            <div class="p-6 border-b border-[#E5E9F2]">
              <h2 class="text-lg font-semibold text-[#222222]">Похожие заказы</h2>
            </div>
            <div class="divide-y divide-[#E5E9F2]">
              <div 
                v-for="similarOrder in similarOrders" 
                :key="similarOrder.id"
                @click="goToOrder(similarOrder.id)"
                class="p-4 hover:bg-[#F0F7FF] cursor-pointer transition-colors"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <span 
                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                        :style="{ 
                          backgroundColor: orderStatuses[similarOrder.status]?.color + '15', 
                          color: orderStatuses[similarOrder.status]?.color 
                        }"
                      >
                        {{ orderStatuses[similarOrder.status]?.label }}
                      </span>
                      <span class="text-xs text-[#656565]">
                        {{ formatDate(similarOrder.date) }}
                      </span>
                    </div>
                    <h3 class="font-medium text-[#222222] hover:text-[#0A65CC] transition-colors">
                      {{ similarOrder.title }}
                    </h3>
                    <p class="text-sm text-[#656565] mt-1 line-clamp-2">
                      {{ similarOrder.description }}
                    </p>
                  </div>
                  <div class="flex items-center gap-1 font-medium whitespace-nowrap ml-4">
                    <DollarSign class="w-4 h-4 text-[#0A65CC]" />
                    <span>{{ similarOrder.price }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Правая колонка (информация о заказчике и действия) -->
        <div class="w-full lg:w-1/3 space-y-6">
          <!-- Кнопка отклика -->
          <div class="bg-white rounded-lg shadow-sm border border-[#E5E9F2] overflow-hidden p-6">
            <button 
              @click="respondToOrder"
              class="w-full py-3 bg-[#0A65CC] text-white rounded-lg font-medium hover:bg-[#085BBA] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare class="w-5 h-5" />
              <span>Откликнуться на заказ</span>
            </button>
            <p class="text-center text-sm text-[#656565] mt-3">
              Уже {{ order.responses }} откликов на этот заказ
            </p>
          </div>
          
          <!-- Информация о заказчике -->
          <div class="bg-white rounded-lg shadow-sm border border-[#E5E9F2] overflow-hidden">
            <div class="p-6 border-b border-[#E5E9F2]">
              <h2 class="text-lg font-semibold text-[#222222]">Информация о заказчике</h2>
            </div>
            <div class="p-6">
              <div class="flex items-center gap-4 mb-4">
                <div class="relative">
                  <img 
                    :src="order.avatar" 
                    alt="Аватар заказчика"
                    class="w-16 h-16 rounded-full object-cover border border-[#E5E9F2]"
                    onerror="this.src='https://via.placeholder.com/64?text=?'"
                  />
                  <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h3 class="font-semibold text-[#222222]">{{ order.customer }}</h3>
                  <div class="flex items-center gap-1 text-[#656565] text-sm">
                    <span class="flex items-center">
                      {{ order.customerRating }}
                      <svg class="w-4 h-4 text-[#FFB800]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                    </span>
                    <span>({{ order.customerReviews }} отзывов)</span>
                  </div>
                  <p class="text-sm text-[#656565] mt-1">На сайте с 2022 года</p>
                </div>
              </div>
              
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-[#656565]">Выполнено проектов:</span>
                  <span class="font-medium">{{ order.customerCompletedProjects }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-[#656565]">Активных заказов:</span>
                  <span class="font-medium">{{ Math.floor(Math.random() * 5) + 1 }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-[#656565]">Среднее время ответа:</span>
                  <span class="font-medium">~2 часа</span>
                </div>
              </div>
              
              <div class="mt-6 flex flex-col gap-3">
                <button class="w-full py-2.5 bg-white cursor-pointer border border-[#0A65CC] text-[#0A65CC] rounded-lg font-medium hover:bg-[#F0F7FF] transition-colors">
                  Посмотреть профиль
                </button>
                <button class="w-full py-2.5 bg-white cursor-pointer border border-[#E5E9F2] text-[#656565] rounded-lg font-medium hover:border-[#0A65CC] hover:text-[#0A65CC] transition-colors">
                  Написать сообщение
                </button>
              </div>
            </div>
          </div>
          
          <!-- Гарантии -->
          <div class="bg-white rounded-lg shadow-sm border border-[#E5E9F2] overflow-hidden">
            <div class="p-6 border-b border-[#E5E9F2]">
              <h2 class="text-lg font-semibold text-[#222222]">Гарантии сервиса</h2>
            </div>
            <div class="p-6 space-y-4">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-lg bg-[#F0F7FF] flex items-center justify-center flex-shrink-0">
                  <Shield class="w-5 h-5 text-[#0A65CC]" />
                </div>
                <div>
                  <h3 class="font-medium text-[#222222]">Безопасная сделка</h3>
                  <p class="text-sm text-[#656565]">Деньги будут переведены исполнителю только после вашего подтверждения выполненной работы</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-lg bg-[#F0F7FF] flex items-center justify-center flex-shrink-0">
                  <Briefcase class="w-5 h-5 text-[#0A65CC]" />
                </div>
                <div>
                  <h3 class="font-medium text-[#222222]">Проверенные исполнители</h3>
                  <p class="text-sm text-[#656565]">Все исполнители проходят проверку документов и подтверждают свои навыки</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-lg bg-[#F0F7FF] flex items-center justify-center flex-shrink-0">
                  <Award class="w-5 h-5 text-[#0A65CC]" />
                </div>
                <div>
                  <h3 class="font-medium text-[#222222]">Гарантия качества</h3>
                  <p class="text-sm text-[#656565]">Если качество работы вас не устроит, мы поможем найти другого исполнителя</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Если заказ не найден -->
      <div v-else class="bg-white rounded-lg shadow-sm border border-[#E5E9F2] p-12 text-center">
        <AlertCircle class="w-16 h-16 text-[#E5E9F2] mx-auto mb-4" />
        <h2 class="text-xl font-bold text-[#222222] mb-2">Заказ не найден</h2>
        <p class="text-[#656565] mb-6">Запрашиваемый заказ не существует или был удален</p>
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

/* Ограничение количества строк текста */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Стили для текстового контента */
.prose {
  color: #222222;
  max-width: 65ch;
  line-height: 1.6;
}

.prose p {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
}

.prose h3 {
  color: #222222;
  font-weight: 600;
  margin-top: 1.6em;
  margin-bottom: 0.6em;
  line-height: 1.3;
}

.prose ul {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
  padding-left: 1.625em;
}

.prose li {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.prose > :first-child {
  margin-top: 0;
}

.prose > :last-child {
  margin-bottom: 0;
}
</style>
