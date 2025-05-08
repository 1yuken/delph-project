<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { 
  Shield, Users, AlertTriangle, CheckCircle, XCircle, 
  Clock, Award, FileText, DollarSign, AlertOctagon
} from 'lucide-vue-next'

const principles = [
  {
    text: 'Платформа создана для честного и прозрачного сотрудничества.',
    icon: Shield
  },
  {
    text: 'Все пользователи обязаны соблюдать законы и правила сервиса.',
    icon: FileText
  },
  {
    text: 'Взаимодействие ведется только через платформу.',
    icon: Users
  }
]

const responsibilities = [
  {
    text: 'Заказчики обязаны своевременно оплачивать выполненную работу.',
    icon: DollarSign
  },
  {
    text: 'Фрилансеры должны выполнять заказы качественно и в срок.',
    icon: Clock
  },
  {
    text: 'Оба участника обязаны соблюдать условия договора и деловую этику.',
    icon: Award
  }
]

const prohibitedActions = [
  {
    text: 'Обман и мошенничество (фальшивые заказы, ложные отзывы).',
    icon: AlertTriangle
  },
  {
    text: 'Обход системы (предложение оплаты вне платформы).',
    icon: XCircle
  },
  {
    text: 'Размещение нелегального контента.',
    icon: AlertOctagon
  },
  {
    text: 'Оскорбления, спам и вредоносные действия.',
    icon: AlertOctagon
  }
]
</script>

<template>
  <div class="relative flex flex-col w-3/5 mx-auto py-8 max-xl:w-4/5 max-lg:w-full max-lg:px-6">
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-[#222222] mb-2">Правила платформы</h1>
      <p class="text-[#656565] max-w-2xl mx-auto">
        Ознакомьтесь с основными правилами и принципами работы нашей платформы для комфортного и безопасного сотрудничества.
      </p>
    </div>
    
    <div class="bg-white rounded-lg border border-[#E5E9F2] p-6 mb-6 shadow-sm">
      <h2 class="text-xl font-bold text-[#222222] mb-4 flex items-center">
        <Shield class="w-5 h-5 text-[#0A65CC] mr-2" />
        Основные принципы работы
      </h2>
      
      <ul class="space-y-3">
        <li 
          v-for="(principle, index) in principles" 
          :key="index"
          class="flex items-start bg-[#F9F9F9] p-4 rounded-lg border border-[#E5E9F2] hover:shadow-md transition-shadow duration-300"
        >
          <component 
            :is="principle.icon" 
            class="w-5 h-5 text-[#0A65CC] mr-3 mt-0.5 flex-shrink-0" 
          />
          <span class="text-[#222222]">{{ principle.text }}</span>
        </li>
      </ul>
    </div>
    
    <div class="bg-white rounded-lg border border-[#E5E9F2] p-6 mb-6 shadow-sm">
      <h2 class="text-xl font-bold text-[#222222] mb-4 flex items-center">
        <CheckCircle class="w-5 h-5 text-[#0A65CC] mr-2" />
        Обязанности пользователей
      </h2>
      
      <ul class="space-y-3">
        <li 
          v-for="(responsibility, index) in responsibilities" 
          :key="index"
          class="flex items-start bg-[#F9F9F9] p-4 rounded-lg border border-[#E5E9F2] hover:shadow-md transition-shadow duration-300"
        >
          <component 
            :is="responsibility.icon" 
            class="w-5 h-5 text-[#0A65CC] mr-3 mt-0.5 flex-shrink-0" 
          />
          <span class="text-[#222222]">{{ responsibility.text }}</span>
        </li>
      </ul>
    </div>
    
    <div class="bg-white rounded-lg border border-[#E5E9F2] p-6 mb-6 shadow-sm">
      <h2 class="text-xl font-bold text-[#222222] mb-4 flex items-center">
        <XCircle class="w-5 h-5 text-[#FF3B30] mr-2" />
        Запрещенные действия
      </h2>
      
      <ul class="space-y-3">
        <li 
          v-for="(action, index) in prohibitedActions" 
          :key="index"
          class="flex items-start bg-[#FFF5F5] p-4 rounded-lg border border-[#FFDDDD] hover:shadow-md transition-shadow duration-300"
        >
          <component 
            :is="action.icon" 
            class="w-5 h-5 text-[#FF3B30] mr-3 mt-0.5 flex-shrink-0" 
          />
          <span class="text-[#222222]">{{ action.text }}</span>
        </li>
      </ul>
    </div>
    
    <div class="bg-[#FFF5F5] border border-[#FFDDDD] rounded-lg p-5 mb-6 shadow-sm">
      <div class="flex items-start">
        <AlertTriangle class="w-6 h-6 text-[#FF3B30] mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <h3 class="font-bold text-[#222222] mb-1">Внимание!</h3>
          <p class="text-[#222222]">
            За нарушение правил аккаунт может быть заблокирован без возможности восстановления.
          </p>
        </div>
      </div>
    </div>
    
    <div class="bg-white rounded-lg border border-[#E5E9F2] p-6 shadow-sm">
      <h2 class="text-xl font-bold text-[#222222] mb-4 flex items-center">
        <FileText class="w-5 h-5 text-[#0A65CC] mr-2" />
        Дополнительная информация
      </h2>
      
      <div class="bg-[#F0F7FF] rounded-lg p-4 border border-[#E5E9F2] mb-4">
        <p class="text-[#222222]">
          Полную версию правил и условий использования платформы вы можете найти в соответствующих документах:
        </p>
        <ul class="mt-3 space-y-2">
          <li class="flex items-center">
            <div class="w-1.5 h-1.5 rounded-full bg-[#0A65CC] mr-2"></div>
            <a href="#" class="text-[#0A65CC] hover:underline">Пользовательское соглашение</a>
          </li>
          <li class="flex items-center">
            <div class="w-1.5 h-1.5 rounded-full bg-[#0A65CC] mr-2"></div>
            <a href="#" class="text-[#0A65CC] hover:underline">Политика конфиденциальности</a>
          </li>
          <li class="flex items-center">
            <div class="w-1.5 h-1.5 rounded-full bg-[#0A65CC] mr-2"></div>
            <a href="#" class="text-[#0A65CC] hover:underline">Правила безопасной сделки</a>
          </li>
        </ul>
      </div>
      
      <div class="text-center p-4 bg-[#F9F9F9] rounded-lg border border-[#E5E9F2]">
        <p class="text-[#656565]">
          Если у вас возникли вопросы по правилам платформы, обратитесь в 
          <a href="#" class="text-[#0A65CC] font-medium hover:underline">службу поддержки</a>
        </p>
      </div>
    </div>
  </div>
</template>