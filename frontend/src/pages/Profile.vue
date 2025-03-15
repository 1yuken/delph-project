<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref } from 'vue'
import ProfileAvatar from '@/components/ProfileAvatar.vue'
import ProfileInfo from '@/components/ProfileInfo.vue'
import SkillsList from '@/components/SkillsList.vue'
import PortfolioGallery from '@/components/PortfolioGallery.vue'
import ReviewList from '@/components/ReviewList.vue'

const fullName = ref('yuken')

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
  { name: 'Vue' },
  { name: 'JavaScript' },
  { name: 'Vite' },
  { name: 'Nuxt.js' },
  { name: 'TypeScript' },
  { name: 'SCSS' },
  { name: 'Docker' },
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
    id: 2,
    name: 'yuken',
    order: 'Заказ #G6TXYXGE',
    date: '23 февраля 2023',
    rating: 5,
    project: 'React, 4000 руб',
    comment: 'Все отлично, отзывчивый продавец',
  },
])
</script>

<template>
  <div class="relative flex flex-col w-3/5 m-auto py-5 gap-4">
    <div class="flex gap-8">
      <ProfileAvatar :fullName="fullName" />
      <ProfileInfo :description="description" />
      <div>
        <button
          class="px-4 py-2 text-sm rounded-md font-semibold bg-[#0A65CC] text-white transition hover:bg-[#085BBA] cursor-pointer"
        >
          Отправить сообщение
        </button>
        <p class="text-sm text-[#656565] mt-4">324 заказов выполнено</p>
        <p class="text-sm text-[#656565] mt-1">11 отзывов получено</p>
        <p class="text-sm text-[#656565] mt-1">100% заказов успешно сдано</p>
      </div>
    </div>
    <SkillsList :skills="skills" />
    <PortfolioGallery :projects="projects" />
    <ReviewList :reviews="reviews" />
  </div>
</template>
