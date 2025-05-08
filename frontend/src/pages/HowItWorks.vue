<script setup>
import { ref } from 'vue'
import { 
  UserPlus, Send, UserCheck, MessageSquare, CreditCard, CheckCircle,
  Briefcase, FileText, Clock, DollarSign, Star
} from 'lucide-vue-next'

const customers = ref([
  { 
    id: 1, 
    icon: UserPlus,
    title: 'Регистрация',
    text: 'Создайте аккаунт, указав email и пароль или войдя через соцсети.' 
  },
  { 
    id: 2, 
    icon: Send,
    title: 'Размещение заказа',
    text: 'Опишите задачу, укажите бюджет и сроки.' 
  },
  { 
    id: 3, 
    icon: UserCheck,
    title: 'Выбор исполнителя',
    text: 'Просматривайте отклики, изучайте профили и отзывы.' 
  },
  { 
    id: 4, 
    icon: MessageSquare,
    title: 'Обсуждение деталей',
    text: 'Общайтесь с фрилансерами в чате, уточняйте нюансы.' 
  },
  {
    id: 5,
    icon: CreditCard,
    title: 'Оплата',
    text: 'Вносите оплату через безопасную систему, средства хранятся на платформе до завершения работы.',
  },
  { 
    id: 6, 
    icon: CheckCircle,
    title: 'Получение результата',
    text: 'Проверяйте выполненный заказ, оставляйте отзыв.' 
  },
])

const freelancers = ref([
  { 
    id: 1, 
    icon: UserPlus,
    title: 'Регистрация и заполнение профиля',
    text: 'Укажите свои навыки, загрузите портфолио.' 
  },
  { 
    id: 2, 
    icon: Briefcase,
    title: 'Отклики на проекты',
    text: 'Находите заказы в своей категории и подавайте заявки.' 
  },
  { 
    id: 3, 
    icon: FileText,
    title: 'Обсуждение заказа',
    text: 'Обсуждайте детали работы с заказчиком.' 
  },
  { 
    id: 4, 
    icon: Clock,
    title: 'Выполнение работы',
    text: 'Выполняйте задачу в срок и загружайте результат.' 
  },
  {
    id: 5,
    icon: DollarSign,
    title: 'Получение оплаты',
    text: 'После подтверждения заказчиком деньги зачисляются на ваш баланс.',
  },
  { 
    id: 6, 
    icon: Star,
    title: 'Отзывы и рейтинг',
    text: 'Чем выше рейтинг, тем больше заказов вы сможете получить!' 
  },
])

// Советы
const tips = ref([
  'Пишите подробные описания заказов или профилей, чтобы избежать недопонимания.',
  'Обращайте внимание на отзывы и рейтинг при выборе партнёров.',
  'Используйте безопасную сделку для защиты ваших интересов.',
  'Соблюдайте сроки и поддерживайте профессиональное общение.',
  'В случае вопросов или спорных ситуаций, сразу обращайтесь в службу поддержки.'
])
</script>

<template>
  <div class="relative flex flex-col w-3/5 mx-auto py-8 max-xl:w-4/5 max-lg:w-full max-lg:px-6">
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-[#222222] mb-2">Как это работает</h1>
      <p class="text-[#656565] max-w-2xl mx-auto">
        Наша платформа соединяет талантливых фрилансеров и заказчиков для успешного сотрудничества. 
        Узнайте, как начать работу уже сегодня.
      </p>
    </div>
    
    <!-- Для заказчиков -->
    <div class="bg-white rounded-lg border border-[#E5E9F2] p-6 mb-8 shadow-sm">
      <h2 class="text-2xl font-bold text-[#222222] mb-6 flex items-center">
        <span class="inline-block w-8 h-8 text-[#0A65CC] rounded-full mr-3 flex items-center justify-center text-sm font-bold"></span>
        Для заказчиков
      </h2>
      
      <div class="relative">
        <div class="absolute left-6 top-8 bottom-8 w-0.5 bg-[#E5E9F2]"></div>
        
        <div class="space-y-6">
          <div 
            v-for="step in customers" 
            :key="step.id"
            class="flex items-start relative pl-14"
          >
            <!-- Номер шага с иконкой -->
            <div class="absolute left-0 w-12 h-12 rounded-full bg-[#F0F7FF] flex items-center justify-center border-2 border-white z-10">
              <component :is="step.icon" class="w-5 h-5 text-[#0A65CC]" />
            </div>
            
            <!-- Содержимое шага -->
            <div class="bg-[#F9F9F9] rounded-lg p-4 w-full hover:shadow-md transition-shadow duration-300 border border-[#E5E9F2]">
              <h3 class="font-semibold text-[#222222] mb-1 flex items-center">
                <span class="text-[#0A65CC] mr-2">{{ step.id }}.</span>
                {{ step.title }}
              </h3>
              <p class="text-[#656565]">{{ step.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="bg-white rounded-lg border border-[#E5E9F2] p-6 mb-8 shadow-sm">
      <h2 class="text-2xl font-bold text-[#222222] mb-6 flex items-center">
        <span class="inline-block w-8 h-8 text-[#0A65CC] rounded-full mr-3 flex items-center justify-center text-sm font-bold"></span>
        Для фрилансеров
      </h2>
      
      <div class="relative">
        <div class="absolute left-6 top-8 bottom-8 w-0.5 bg-[#E5E9F2]"></div>
        
        <div class="space-y-6">
          <div 
            v-for="step in freelancers" 
            :key="step.id"
            class="flex items-start relative pl-14"
          >
            <div class="absolute left-0 w-12 h-12 rounded-full bg-[#F0F7FF] flex items-center justify-center border-2 border-white z-10">
              <component :is="step.icon" class="w-5 h-5 text-[#0A65CC]" />
            </div>

            <div class="bg-[#F9F9F9] rounded-lg p-4 w-full hover:shadow-md transition-shadow duration-300 border border-[#E5E9F2]">
              <h3 class="font-semibold text-[#222222] mb-1 flex items-center">
                <span class="text-[#0A65CC] mr-2">{{ step.id }}.</span>
                {{ step.title }}
              </h3>
              <p class="text-[#656565]">{{ step.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="bg-white rounded-lg border border-[#E5E9F2] p-6 shadow-sm">
      <div class="bg-[#F0F7FF] rounded-lg p-5 border border-[#E5E9F2]">
        <h3 class="text-xl font-bold text-[#222222] mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#0A65CC] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Советы по успешному использованию платформы
        </h3>
        
        <ul class="space-y-3">
          <li 
            v-for="(tip, index) in tips" 
            :key="index"
            class="flex items-start"
          >
            <div class="min-w-6 h-6 rounded-full bg-white text-[#0A65CC] flex items-center justify-center mr-3 border border-[#0A65CC]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p class="text-[#222222]">{{ tip }}</p>
          </li>
        </ul>
        
        <div class="mt-6 p-4 bg-white rounded-lg border border-[#E5E9F2]">
          <p class="text-center text-[#656565]">
            Остались вопросы? 
            <a href="#" class="text-[#0A65CC] font-medium hover:underline">Свяжитесь с нашей службой поддержки</a>
          </p>
        </div>
      </div>
    </div>
    
    <div class="mt-8 text-center">
      <h3 class="text-xl font-bold text-[#222222] mb-4">Готовы начать?</h3>
      <div class="flex justify-center gap-4 flex-wrap">
        <button class="px-6 py-3 bg-[#0A65CC] text-white rounded-md font-medium hover:bg-[#085BBA] transition-colors cursor-pointer">
          Разместить заказ
        </button>
        <button class="px-6 py-3 bg-white text-[#0A65CC] border border-[#0A65CC] rounded-md font-medium cursor-pointer hover:bg-[#F0F7FF] transition-colors">
          Стать фрилансером
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Анимация при наведении на шаги */
.flex.items-start:hover .absolute.left-0 {
  transform: scale(1.1);
  transition: transform 0.3s ease;
}
</style>