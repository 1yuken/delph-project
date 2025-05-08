<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, computed } from 'vue'
import ProfileAvatar from '@/components/ProfileAvatar.vue'
import ProfileInfo from '@/components/ProfileInfo.vue'
import SkillsList from '@/components/SkillsList.vue'
import PortfolioGallery from '@/components/PortfolioGallery.vue'
import ReviewList from '@/components/ReviewList.vue'
// import { MessageSquare, Calendar, CheckCircle, Award } from 'lucide-vue-next'
import MessageSquare from '@/icons/MessageSquare.vue'
import CalendarIcon from '@/icons/CalendarIcon.vue'
import CheckIcon from '@/icons/CheckIcon.vue'
import Award from '@/icons/Award.vue'

const fullName = ref('yuken')
const username = ref('@yuken')
const isOnline = ref(true)
const lastActive = ref('Онлайн')

const description =
  ref(`Я — опытный фронтенд-разработчик, страстно увлечённый созданием интуитивно понятных и
            высокопроизводительных веб-интерфейсов, которые не только решают бизнес-задачи, но и
            делают пользовательский опыт незабываемым. Мой крепкий технический бэкграунд и глубокое
            знание Vue.js и смежных технологий позволяют мне разрабатывать решения, где оптимальное
            сочетание производительности, качества кода и удобства поддержки становится нормой. 
            Я постоянно изучаю актуальные тренды в UI/UX, интеграции API и тестировании, что
            помогает мне создавать масштабируемые и легко адаптируемые продукты. Готов к новым
            профессиональным вызовам и с энтузиазмом жду возможности внести свой вклад в развитие
            амбициозных проектов.
            
            Связаться со мной можно в Telegram: @yuken1`)

const skills = ref([
  { name: 'Vue', level: 'expert' },
  { name: 'JavaScript', level: 'expert' },
  { name: 'Vite', level: 'intermediate' },
  { name: 'Nuxt.js', level: 'intermediate' },
  { name: 'TypeScript', level: 'intermediate' },
  { name: 'SCSS', level: 'expert' },
  { name: 'Docker', level: 'beginner' },
])

const projects = ref([
  { id: 1, title: 'Вёрстка', image: '/public/random.jpg', views: 123 },
  { id: 2, title: 'Создание сайта', image: '/public/random2.jpg', views: 123 },
  { id: 3, title: 'Создание сайта', image: '/public/portfolio.png', views: 123 },
])

const reviews = ref([
  {
    id: 1,
    name: 'yuken',
    order: 'Заказ #G6TXYXGE',
    date: '23 февраля 2023',
    rating: 5,
    project: 'React, 4000 руб',
    comment: 'Все отлично, отзывчивый продавец',
  },
  {
    id: 2,
    name: 'yuken',
    order: 'Заказ #G6TXYXGE',
    date: '23 февраля 2023',
    rating: 4,
    project: 'React, 4000 руб',
    comment: 'Все отлично, отзывчивый продавец',
  },
  {
    id: 3,
    name: 'yuken',
    order: 'Заказ #G6TXYXGE',
    date: '23 февраля 2023',
    rating: 5,
    project: 'React, 4000 руб',
    comment: 'Все отлично, отзывчивый продавец',
  },
])

// Статистика пользователя
const stats = {
  ordersCompleted: 324,
  reviewsReceived: 11,
  successRate: 100,
  rating: 4.8
}

// Средний рейтинг
const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0
  const sum = reviews.value.reduce((acc, review) => acc + review.rating, 0)
  return (sum / reviews.value.length).toFixed(1)
})

// Фильтр отзывов
const reviewFilter = ref('all')
const filteredReviews = computed(() => {
  if (reviewFilter.value === 'positive') {
    return reviews.value.filter(review => review.rating >= 4)
  } else if (reviewFilter.value === 'negative') {
    return reviews.value.filter(review => review.rating < 4)
  }
  return reviews.value
})
</script>

<template>
  <div class="relative flex flex-col w-3/5 mx-auto py-6 max-xl:w-4/5 max-lg:w-full max-lg:px-6">
    <!-- Профиль пользователя -->
    <div class="bg-white rounded-lg border border-[#E5E9F2] p-6 mb-6 shadow-sm">
      <div class="flex gap-8 max-lg:flex-col">
        <ProfileAvatar 
          :fullName="fullName" 
          :username="username"
          :isOnline="isOnline"
          :lastActive="lastActive"
        />
        
        <div class="flex-1">
          <ProfileInfo :description="description" />
        </div>
        
        <div class="min-w-[200px]">
          <button
            class="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm rounded-md font-medium bg-[#0A65CC] text-white transition-colors hover:bg-[#085BBA] cursor-pointer"
          >
            <MessageSquare class="w-4 h-4" />
            Отправить сообщение
          </button>
          
          <div class="mt-4 bg-[#F9F9F9] rounded-lg p-4 border border-[#E5E9F2]">
            <div class="flex items-center gap-2 mb-2">
              <CheckIcon class="w-4 h-4 text-[#4CAF50]" />
              <p class="text-sm font-medium text-[#222222]">{{ stats.ordersCompleted }} заказов выполнено</p>
            </div>
            <div class="flex items-center gap-2 mb-2">
              <Award class="w-4 h-4 text-[#FFB800]" />
              <p class="text-sm font-medium text-[#222222]">{{ stats.reviewsReceived }} отзывов получено</p>
            </div>
            <div class="flex items-center gap-2">
              <CheckIcon class="w-4 h-4 text-[#4CAF50]" />
              <p class="text-sm font-medium text-[#222222]">{{ stats.successRate }}% заказов успешно сдано</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Навыки -->
    <div class="bg-white rounded-lg border border-[#E5E9F2] p-6 mb-6 shadow-sm">
      <SkillsList :skills="skills" />
    </div>
    
    <!-- Портфолио -->
    <div class="bg-white rounded-lg border border-[#E5E9F2] p-6 mb-6 shadow-sm">
      <PortfolioGallery :projects="projects" />
    </div>
    
    <!-- Отзывы -->
    <div class="bg-white rounded-lg border border-[#E5E9F2] p-6 shadow-sm">
      <ReviewList 
        :reviews="filteredReviews" 
        :averageRating="averageRating" 
        v-model:filter="reviewFilter"
      />
    </div>
  </div>
</template>