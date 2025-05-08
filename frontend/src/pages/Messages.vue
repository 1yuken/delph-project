<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { 
  Search, Paperclip, Send, MoreVertical, 
  Image, File, Smile, ChevronLeft, Check, CheckCheck, 
  Filter, Bell
} from 'lucide-vue-next';

// Данные о чатах
const chats = ref([
  {
    id: 1,
    name: 'Элвин Николаенко',
    avatar: '/random.jpg',
    lastMessage: 'Да, я могу выполнить этот заказ в срок. Когда нужно сдать работу?',
    time: '10:23',
    unread: 2,
    online: true,
    isTyping: false
  },
  {
    id: 2,
    name: 'Эмран Минзатов',
    avatar: '/random2.jpg',
    lastMessage: 'Спасибо за оплату! Приступаю к работе.',
    time: '09:45',
    unread: 0,
    online: true,
    isTyping: true
  },
  {
    id: 3,
    name: 'Эдем Сейтумеров',
    avatar: '/avatar-full.jpg',
    lastMessage: 'Проект завершен. Жду ваших комментариев.',
    time: 'Вчера',
    unread: 0,
    online: false,
    isTyping: false
  },
  {
    id: 4,
    name: 'Илья Рудов',
    avatar: '/random.jpg',
    lastMessage: 'Можем обсудить детали проекта завтра в 15:00?',
    time: 'Вчера',
    unread: 0,
    online: false,
    isTyping: false
  },
  {
    id: 5,
    name: 'Эдем Асанов',
    avatar: '/random2.jpg',
    lastMessage: 'Отправил вам финальную версию дизайна.',
    time: '21 мая',
    unread: 0,
    online: false,
    isTyping: false
  }
]);

// Данные о сообщениях в текущем чате
const messages = ref([
  {
    id: 1,
    senderId: 1,
    text: 'Здравствуйте! Я заинтересован в вашем предложении по разработке сайта. Можете рассказать подробнее о сроках и стоимости?',
    time: '10:05',
    status: 'read'
  },
  {
    id: 2,
    senderId: 'me',
    text: 'Добрый день! Конечно, я могу разработать сайт в течение 2-3 недель. Стоимость будет зависеть от сложности и требуемого функционала. Какой тип сайта вам нужен?',
    time: '10:10',
    status: 'read'
  },
  {
    id: 3,
    senderId: 1,
    text: 'Мне нужен интернет-магазин с каталогом товаров, корзиной и личным кабинетом пользователя. Также нужна интеграция с платежной системой.',
    time: '10:15',
    status: 'read'
  },
  {
    id: 4,
    senderId: 'me',
    text: 'Понятно. Для такого проекта потребуется около 3 недель работы. Стоимость составит примерно 80,000 рублей. Я могу предоставить подробную смету с разбивкой по задачам.',
    time: '10:18',
    status: 'read'
  },
  {
    id: 5,
    senderId: 1,
    text: 'Это звучит разумно. Можете ли вы начать работу уже на следующей неделе?',
    time: '10:20',
    status: 'read'
  },
  {
    id: 6,
    senderId: 'me',
    text: 'Да, я могу начать в понедельник. Предлагаю сначала обсудить детали проекта и составить техническое задание. Это поможет избежать недопонимания и обеспечит точное соответствие результата вашим ожиданиям.',
    time: '10:22',
    status: 'read'
  },
  {
    id: 7,
    senderId: 1,
    text: 'Да, я могу выполнить этот заказ в срок. Когда нужно сдать работу?',
    time: '10:23',
    status: 'delivered'
  }
]);

// Активный чат
const activeChat = ref(chats.value[0]);

// Текст нового сообщения
const newMessage = ref('');

// Поисковый запрос
const searchQuery = ref('');

// Мобильное представление
const isMobileView = ref(false);
const showChatList = ref(true);

// Фильтрованные чаты
const filteredChats = computed(() => {
  if (!searchQuery.value) return chats.value;
  
  const query = searchQuery.value.toLowerCase();
  return chats.value.filter(chat => 
    chat.name.toLowerCase().includes(query) || 
    chat.lastMessage.toLowerCase().includes(query)
  );
});

// Общее количество непрочитанных сообщений
const totalUnread = computed(() => {
  return chats.value.reduce((sum, chat) => sum + chat.unread, 0);
});

// Выбор чата
const selectChat = (chat) => {
  activeChat.value = chat;
  // Сбрасываем счетчик непрочитанных сообщений
  chat.unread = 0;
  
  // На мобильных устройствах переключаемся на чат
  if (isMobileView.value) {
    showChatList.value = false;
  }
};

// Отправка сообщения
const sendMessage = () => {
  if (!newMessage.value.trim()) return;
  
  // Добавляем новое сообщение
  messages.value.push({
    id: messages.value.length + 1,
    senderId: 'me',
    text: newMessage.value,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'sent'
  });
  
  // Обновляем последнее сообщение в чате
  activeChat.value.lastMessage = newMessage.value;
  activeChat.value.time = 'Сейчас';
  
  // Очищаем поле ввода
  newMessage.value = '';
  
  // Имитация ответа (для демонстрации)
  setTimeout(() => {
    // Обновляем статус отправленного сообщения
    messages.value[messages.value.length - 1].status = 'delivered';
    
    // Через некоторое время собеседник печатает
    activeChat.value.isTyping = true;
    
    // Через некоторое время приходит ответ
    setTimeout(() => {
      activeChat.value.isTyping = false;
      messages.value.push({
        id: messages.value.length + 1,
        senderId: activeChat.value.id,
        text: 'Спасибо за информацию! Я рассмотрю ваше предложение и свяжусь с вами в ближайшее время.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'delivered'
      });
      
      // Обновляем последнее сообщение в чате
      activeChat.value.lastMessage = 'Спасибо за информацию! Я рассмотрю ваше предложение и свяжусь с вами в ближайшее время.';
      activeChat.value.time = 'Сейчас';
      
      // Если чат не активен, увеличиваем счетчик непрочитанных
      if (activeChat.value.id !== chats.value[0].id) {
        chats.value[0].unread += 1;
      }
    }, 3000);
  }, 1000);
};

// Возврат к списку чатов на мобильных устройствах
const backToList = () => {
  showChatList.value = true;
};

// Проверка размера экрана при загрузке и изменении
const checkScreenSize = () => {
  isMobileView.value = window.innerWidth < 768;
  showChatList.value = isMobileView.value ? true : true;
};

// Инициализация при монтировании компонента
const initComponent = () => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
};

// Очистка при размонтировании компонента
const cleanupComponent = () => {
  window.removeEventListener('resize', checkScreenSize);
};

// Хуки жизненного цикла
onMounted(initComponent);
onUnmounted(cleanupComponent);
</script>

<template>
  <div class="bg-[#F9F9F9] py-6 px-4 min-h-screen">
    <div class="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden border border-[#E5E9F2]">
      <div class="flex h-[calc(100vh-120px)] min-h-[500px]">
        <!-- Список чатов (скрывается на мобильных при просмотре чата) -->
        <div 
          v-if="showChatList || !isMobileView" 
          class="w-full md:w-1/3 lg:w-1/4 border-r border-[#E5E9F2] flex flex-col"
        >
          <!-- Заголовок и поиск -->
          <div class="p-4 border-b border-[#E5E9F2]">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <h1 class="text-xl font-bold text-[#222222]">Сообщения</h1>
                <span 
                  v-if="totalUnread > 0" 
                  class="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-medium text-white bg-[#0A65CC] rounded-full"
                >
                  {{ totalUnread }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <button class="p-1.5 rounded-full hover:bg-[#F0F7FF] transition-colors">
                  <Filter class="w-5 h-5 text-[#656565]" />
                </button>
                <button class="p-1.5 rounded-full hover:bg-[#F0F7FF] transition-colors">
                  <Bell class="w-5 h-5 text-[#656565]" />
                </button>
              </div>
            </div>
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Поиск сообщений"
                class="w-full pl-9 pr-4 py-2 text-sm border border-[#E5E9F2] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0A65CC] focus:border-[#0A65CC]"
              />
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#656565]" />
            </div>
          </div>
          
          <!-- Список чатов -->
          <div class="flex-1 overflow-y-auto">
            <div v-if="filteredChats.length === 0" class="p-4 text-center text-[#656565]">
              Чаты не найдены
            </div>
            <div 
              v-for="chat in filteredChats" 
              :key="chat.id"
              @click="selectChat(chat)"
              class="p-3 border-b border-[#E5E9F2] cursor-pointer transition-colors hover:bg-[#F9F9F9]"
              :class="{ 'bg-[#F0F7FF]': activeChat.id === chat.id }"
            >
              <div class="flex items-center gap-3">
                <!-- Аватар с индикатором онлайн -->
                <div class="relative">
                  <img 
                    :src="chat.avatar" 
                    :alt="chat.name"
                    class="w-12 h-12 rounded-full object-cover border border-[#E5E9F2]"
                    onerror="this.src='https://via.placeholder.com/48?text=?'"
                  />
                  <div 
                    v-if="chat.online" 
                    class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                  ></div>
                </div>
                
                <!-- Информация о чате -->
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-start">
                    <h3 class="font-medium text-[#222222] truncate">{{ chat.name }}</h3>
                    <span class="text-xs text-[#656565] whitespace-nowrap ml-2">{{ chat.time }}</span>
                  </div>
                  <div class="flex justify-between items-center mt-1">
                    <p v-if="chat.isTyping" class="text-sm text-[#0A65CC] italic">печатает...</p>
                    <p v-else class="text-sm text-[#656565] truncate">{{ chat.lastMessage }}</p>
                    <span 
                      v-if="chat.unread > 0" 
                      class="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-medium text-white bg-[#0A65CC] rounded-full ml-2"
                    >
                      {{ chat.unread }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Область чата -->
        <div 
          v-if="!showChatList || !isMobileView" 
          class="w-full md:w-2/3 lg:w-3/4 flex flex-col"
        >
          <!-- Заголовок чата -->
          <div class="p-4 border-b border-[#E5E9F2] flex items-center justify-between">
            <div class="flex items-center gap-3">
              <!-- Кнопка возврата на мобильных -->
              <button 
                v-if="isMobileView" 
                @click="backToList"
                class="p-1.5 rounded-full hover:bg-[#F0F7FF] transition-colors"
              >
                <ChevronLeft class="w-5 h-5 text-[#656565]" />
              </button>
              
              <!-- Информация о собеседнике -->
              <div class="flex items-center gap-3">
                <div class="relative">
                  <img 
                    :src="activeChat.avatar" 
                    :alt="activeChat.name"
                    class="w-10 h-10 rounded-full object-cover border border-[#E5E9F2]"
                    onerror="this.src='https://via.placeholder.com/40?text=?'"
                  />
                  <div 
                    v-if="activeChat.online" 
                    class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"
                  ></div>
                </div>
                <div>
                  <h3 class="font-medium text-[#222222]">{{ activeChat.name }}</h3>
                  <p v-if="activeChat.online" class="text-xs text-green-500">Онлайн</p>
                  <p v-else class="text-xs text-[#656565]">Был(а) недавно</p>
                </div>
              </div>
            </div>
            
            <!-- Действия с чатом -->
            <div class="flex items-center gap-2">
              <button class="p-1.5 rounded-full hover:bg-[#F0F7FF] transition-colors">
                <MoreVertical class="w-5 h-5 text-[#656565]" />
              </button>
            </div>
          </div>
          
          <!-- История сообщений -->
          <div class="flex-1 p-4 overflow-y-auto bg-[#F9F9F9]">
            <div v-for="message in messages" :key="message.id" class="mb-4">
              <!-- Входящее сообщение -->
              <div 
                v-if="message.senderId !== 'me'" 
                class="flex items-start gap-2 max-w-[80%]"
              >
                <img 
                  :src="activeChat.avatar" 
                  :alt="activeChat.name"
                  class="w-8 h-8 rounded-full object-cover mt-1"
                  onerror="this.src='https://via.placeholder.com/32?text=?'"
                />
                <div>
                  <div class="bg-white p-3 rounded-lg rounded-tl-none shadow-sm border border-[#E5E9F2]">
                    <p class="text-[#222222]">{{ message.text }}</p>
                  </div>
                  <div class="flex items-center mt-1 ml-1">
                    <span class="text-xs text-[#656565]">{{ message.time }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Исходящее сообщение -->
              <div 
                v-else 
                class="flex items-start gap-2 max-w-[80%] ml-auto flex-row-reverse"
              >
                <div>
                  <div class="bg-[#F0F7FF] p-3 rounded-lg rounded-tr-none shadow-sm">
                    <p class="text-[#222222]">{{ message.text }}</p>
                  </div>
                  <div class="flex items-center justify-end gap-1 mt-1 mr-1">
                    <span class="text-xs text-[#656565]">{{ message.time }}</span>
                    <!-- Статус сообщения -->
                    <Check v-if="message.status === 'sent'" class="w-3 h-3 text-[#656565]" />
                    <CheckCheck v-else-if="message.status === 'delivered'" class="w-3 h-3 text-[#656565]" />
                    <CheckCheck v-else-if="message.status === 'read'" class="w-3 h-3 text-[#0A65CC]" />
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Индикатор печати -->
            <div v-if="activeChat.isTyping" class="flex items-start gap-2 max-w-[80%] mb-4">
              <img 
                :src="activeChat.avatar" 
                :alt="activeChat.name"
                class="w-8 h-8 rounded-full object-cover mt-1"
                onerror="this.src='https://via.placeholder.com/32?text=?'"
              />
              <div class="bg-white p-3 rounded-lg rounded-tl-none shadow-sm border border-[#E5E9F2] min-w-[60px]">
                <div class="flex gap-1">
                  <div class="w-2 h-2 bg-[#656565] rounded-full animate-bounce"></div>
                  <div class="w-2 h-2 bg-[#656565] rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                  <div class="w-2 h-2 bg-[#656565] rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Поле ввода сообщения -->
          <div class="p-3 border-t border-[#E5E9F2] bg-white">
            <div class="flex items-center gap-2">
              <div class="flex items-center gap-1">
                <button class="p-2 rounded-full hover:bg-[#F0F7FF] transition-colors">
                  <Paperclip class="w-5 h-5 text-[#656565]" />
                </button>
                <button class="p-2 rounded-full hover:bg-[#F0F7FF] transition-colors hidden sm:block">
                  <Image class="w-5 h-5 text-[#656565]" />
                </button>
                <button class="p-2 rounded-full hover:bg-[#F0F7FF] transition-colors hidden sm:block">
                  <File class="w-5 h-5 text-[#656565]" />
                </button>
              </div>
              
              <div class="flex-1 relative">
                <input
                  v-model="newMessage"
                  type="text"
                  placeholder="Введите сообщение..."
                  class="w-full px-4 py-2 text-sm border border-[#E5E9F2] rounded-full focus:outline-none focus:ring-1 focus:ring-[#0A65CC] focus:border-[#0A65CC]"
                  @keyup.enter="sendMessage"
                />
                <button class="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-[#F0F7FF] transition-colors">
                  <Smile class="w-5 h-5 text-[#656565]" />
                </button>
              </div>
              
              <button 
                @click="sendMessage"
                class="p-2 rounded-full bg-[#0A65CC] hover:bg-[#085BBA] transition-colors"
              >
                <Send class="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
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

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}
</style>
