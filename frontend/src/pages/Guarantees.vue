<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref } from 'vue'
import { 
  Shield, Star, UserCheck, Lock, MessageSquare, 
  DollarSign, HelpCircle, ChevronDown, ChevronUp
} from 'lucide-vue-next'

const guarantees = ref([
  {
    id: 1,
    icon: DollarSign,
    title: 'Безопасные сделки',
    text: 'Деньги резервируются на платформе и переводятся исполнителю только после успешного выполнения заказа.',
  },
  {
    id: 2,
    icon: Star,
    title: 'Рейтинг и отзывы',
    text: 'Изучайте рейтинги и отзывы, чтобы выбирать надежных исполнителей и заказчиков.',
  },
  { 
    id: 3,
    icon: UserCheck,
    title: 'Модерация',
    text: 'Мы проверяем пользователей и блокируем мошенников.' 
  },
  {
    id: 4,
    icon: Lock,
    title: 'Конфиденциальность',
    text: 'Все личные данные защищены, а переписка ведется внутри платформы.',
  },
  {
    id: 5,
    icon: MessageSquare,
    title: 'Разрешение споров',
    text: 'В случае конфликта наша служба поддержки поможет найти решение.',
  },
])

const faqs = ref([
  {
    id: 1,
    question: 'Как работает резервирование денег?',
    answer: 'После оформления заказа сумма блокируется на специальном счёте и списывается только после подтверждения выполнения заказа. Это гарантирует, что исполнитель получит оплату за свою работу, а заказчик - качественный результат.',
    isOpen: true
  },
  {
    id: 2,
    question: 'Что делать, если возник конфликт?',
    answer: 'В случае возникновения спора обращайтесь в службу поддержки – мы оперативно разберём ситуацию и найдем оптимальное решение. Наши специалисты рассмотрят все детали заказа, историю переписки и предложат справедливое решение для обеих сторон.',
    isOpen: false
  },
  {
    id: 3,
    question: 'Как проверяются пользователи на платформе?',
    answer: 'Мы используем многоуровневую систему проверки пользователей, включающую верификацию email, телефона и документов. Также мы анализируем поведение пользователей и отзывы о них, чтобы выявлять потенциальных нарушителей правил.',
    isOpen: false
  },
  {
    id: 4,
    question: 'Как защищены мои личные данные?',
    answer: 'Мы используем современные методы шифрования для защиты ваших данных. Доступ к личной информации строго ограничен, а все платежные операции проводятся через защищенные каналы. Мы никогда не передаем ваши данные третьим лицам без вашего согласия.',
    isOpen: false
  }
])

function toggleFaq(id) {
  const faq = faqs.value.find(item => item.id === id)
  if (faq) {
    faq.isOpen = !faq.isOpen
  }
}
</script>

<template>
  <div class="relative flex flex-col w-3/5 mx-auto py-8 max-xl:w-4/5 max-lg:w-full max-lg:px-6">
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-[#222222] mb-2">Гарантии и безопасность</h1>
      <p class="text-[#656565] max-w-2xl mx-auto">
        Мы создали надежную систему безопасности, чтобы вы могли сосредоточиться на работе, 
        не беспокоясь о рисках.
      </p>
    </div>
    
    <div class="bg-[#F0F7FF] rounded-lg p-6 mb-8 border border-[#E5E9F2] shadow-sm">
      <div class="flex items-center gap-4 max-md:flex-col">
        <div class="bg-white rounded-full p-4 shadow-sm">
          <Shield class="w-12 h-12 text-[#0A65CC]" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-[#222222] mb-2">Ваша безопасность — наш приоритет</h2>
          <p class="text-[#656565]">
            Мы разработали комплексную систему защиты для всех пользователей нашей платформы, 
            чтобы сделать сотрудничество максимально безопасным и комфортным.
          </p>
        </div>
      </div>
    </div>
    
    <div class="bg-white rounded-lg border border-[#E5E9F2] p-6 mb-8 shadow-sm">
      <h2 class="text-xl font-bold text-[#222222] mb-6 flex items-center">
        <Shield class="w-5 h-5 text-[#0A65CC] mr-2" />
        Наши гарантии
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          v-for="guarantee in guarantees" 
          :key="guarantee.id"
          class="bg-[#F9F9F9] rounded-lg p-4 border border-[#E5E9F2] hover:shadow-md transition-shadow duration-300"
        >
          <div class="flex items-start">
            <div class="bg-white p-2 rounded-lg shadow-sm mr-3">
              <component :is="guarantee.icon" class="w-5 h-5 text-[#0A65CC]" />
            </div>
            <div>
              <h3 class="font-semibold text-[#222222] mb-1">{{ guarantee.title }}</h3>
              <p class="text-[#656565] text-sm">{{ guarantee.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="bg-white rounded-lg border border-[#E5E9F2] p-6 mb-8 shadow-sm">
      <h2 class="text-xl font-bold text-[#222222] mb-6 flex items-center">
        <HelpCircle class="w-5 h-5 text-[#0A65CC] mr-2" />
        Часто задаваемые вопросы
      </h2>
      
      <div class="space-y-4">
        <div 
          v-for="faq in faqs" 
          :key="faq.id"
          class="border border-[#E5E9F2] rounded-lg overflow-hidden"
        >
          <button 
            @click="toggleFaq(faq.id)"
            class="w-full flex items-center justify-between p-4 text-left bg-[#F9F9F9] hover:bg-[#F0F7FF] transition-colors duration-200"
          >
            <span class="font-semibold text-[#222222]">{{ faq.question }}</span>
            <component :is="faq.isOpen ? ChevronUp : ChevronDown" class="w-5 h-5 text-[#0A65CC]" />
          </button>
          
          <div 
            v-if="faq.isOpen"
            class="p-4 bg-white border-t border-[#E5E9F2]"
          >
            <p class="text-[#656565]">{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="bg-white rounded-lg border border-[#E5E9F2] p-6 shadow-sm">
      <div class="bg-[#F0F7FF] rounded-lg p-5 border border-[#E5E9F2]">
        <h3 class="text-lg font-bold text-[#222222] mb-3">Постоянное совершенствование</h3>
        <p class="text-[#656565] mb-4">
          Наша платформа постоянно совершенствуется, и мы внимательно следим за отзывами пользователей, 
          чтобы улучшить систему гарантий и безопасность. Это позволяет нам оперативно реагировать 
          на любые изменения и обеспечивать максимально комфортное и безопасное взаимодействие 
          для всех участников.
        </p>
        
        <div class="flex items-center justify-center gap-4 mt-6 flex-wrap">
          <a href="#" class="flex items-center gap-2 text-[#0A65CC] font-medium hover:underline">
            <Lock class="w-4 h-4" />
            Политика безопасности
          </a>
          <a href="#" class="flex items-center gap-2 text-[#0A65CC] font-medium hover:underline">
            <Shield class="w-4 h-4" />
            Правила безопасной сделки
          </a>
          <a href="#" class="flex items-center gap-2 text-[#0A65CC] font-medium hover:underline">
            <MessageSquare class="w-4 h-4" />
            Связаться с поддержкой
          </a>
        </div>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      <div class="bg-white rounded-lg border border-[#E5E9F2] p-4 text-center shadow-sm">
        <div class="text-3xl font-bold text-[#0A65CC] mb-2">99.8%</div>
        <p class="text-[#656565]">успешных сделок</p>
      </div>
      <div class="bg-white rounded-lg border border-[#E5E9F2] p-4 text-center shadow-sm">
        <div class="text-3xl font-bold text-[#0A65CC] mb-2">24/7</div>
        <p class="text-[#656565]">поддержка пользователей</p>
      </div>
      <div class="bg-white rounded-lg border border-[#E5E9F2] p-4 text-center shadow-sm">
        <div class="text-3xl font-bold text-[#0A65CC] mb-2">100%</div>
        <p class="text-[#656565]">защита платежей</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
button {
  transition: background-color 0.3s ease;
}

[v-if] {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>