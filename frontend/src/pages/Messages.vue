<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import {
  Search,
  Paperclip,
  Send,
  MoreVertical,
  Smile,
  ChevronLeft,
  Check,
  CheckCheck,
  Filter,
  Bell,
  X,
  MessageCircle,
  Phone,
  Mic
} from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { io } from 'socket.io-client'

const route = useRoute()
const authStore = useAuthStore()
const myUserId = computed(() => authStore.userId.value)

// Данные о чатах
const chats = ref([])
const selectedUserId = ref(null)

// Данные о сообщениях в текущем чате
const messages = ref([])

// Текст нового сообщения
const newMessage = ref('')

// Поисковый запрос
const searchQuery = ref('')

// Мобильное представление
const isMobileView = ref(false)
const showChatList = ref(true)

// Фильтрованные чаты
const filteredChats = computed(() => {
  if (!searchQuery.value) return chats.value
  const query = searchQuery.value.toLowerCase()
  return chats.value.filter((chat) => {
    const name = chat.name || ''
    const lastMessage = chat.lastMessage || ''
    return name.toLowerCase().includes(query) || lastMessage.toLowerCase().includes(query)
  })
})

// Общее количество непрочитанных сообщений
const totalUnread = computed(() => {
  return chats.value.reduce((sum, chat) => sum + (chat.unread || 0), 0)
})

// Получить данные пользователя для заглушки, если чата нет
const userInfo = ref(null)

watch(selectedUserId, async (newId) => {
  if (!newId) {
    userInfo.value = null
    return
  }
  const chat = chats.value.find((c) => c.userId === newId)
  if (!chat) {
    try {
      const response = await axios.get(`http://localhost:3000/users/${newId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      userInfo.value = {
        name: response.data.name || response.data.username || 'Пользователь',
        avatar: response.data.avatarUrl || 'https://via.placeholder.com/48?text=?',
        online: false,
      }
    } catch {
      userInfo.value = {
        name: 'Пользователь',
        avatar: 'https://via.placeholder.com/48?text=?',
        online: false,
      }
    }
  } else {
    userInfo.value = null
  }
})

function getCompanionId(chat) {
  return String(chat.user1Id) === String(myUserId.value) ? chat.user2Id : chat.user1Id
}

const userPlaceholder = computed(() => {
  if (!selectedUserId.value) return null
  const chat = chats.value.find((c) => getCompanionId(c) == selectedUserId.value)
  if (chat) return chat
  if (userInfo.value) return { ...userInfo.value, userId: selectedUserId.value }
  return {
    userId: selectedUserId.value,
    name: 'Пользователь',
    avatar: 'https://via.placeholder.com/48?text=?',
    online: false,
  }
})

const isMyMessage = (message) => String(message.senderId) === String(myUserId.value)

const messagesContainer = ref(null)

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

function formatTime(date) {
  const d = new Date(date)
  d.setHours(d.getHours() + 3) // Москва = UTC+3
  return d.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Получить сообщения с выбранным пользователем
async function fetchMessages() {
  if (!selectedUserId.value) return
  try {
    const response = await axios.get(
      `http://localhost:3000/messages?userId=${selectedUserId.value}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    )
    // Преобразуем сообщения в нужный формат
    messages.value = (response.data || []).map((message) => ({
      ...message,
      time: formatTime(message.createdAt),
      status: 'sent',
    }))
    scrollToBottom()
  } catch (error) {
    console.error('Error fetching messages:', error)
    messages.value = []
  }
}

// Отправить сообщение
async function sendMessage() {
  if (!newMessage.value.trim() || !selectedUserId.value) return

  try {
    console.log('Sending message to:', selectedUserId.value)

    // Отправляем сообщение через WebSocket
    socket.value.emit('send_message', {
      content: newMessage.value,
      receiverId: selectedUserId.value,
    })

    // Очищаем поле ввода
    newMessage.value = ''
    nextTick(() => scrollToBottom())
  } catch (error) {
    console.error('Error sending message:', error)
  }
}

// Выбрать чат
function selectChat(companionId) {
  selectedUserId.value = companionId
}

// Возврат к списку чатов на мобильных устройствах
const backToList = () => {
  showChatList.value = true
}

const socket = ref(null)

// Функция для обогащения данных чатов информацией о пользователях
async function enrichChatsWithUserInfo() {
  for (const chat of chats.value) {
    const companionId = getCompanionId(chat)
    try {
      const response = await axios.get(`http://localhost:3000/users/${companionId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      chat.name = response.data.name || response.data.username || 'Пользователь'
      chat.avatar = response.data.avatarUrl || 'https://via.placeholder.com/48?text=?'
      chat.userId = companionId
      chat.lastMessage = chat.lastMessageContent || ''
      chat.time = formatTime(chat.updatedAt)
      chat.unread = chat.unreadCount || 0
    } catch (error) {
      console.error(`Error fetching user info for ${companionId}:`, error)
      chat.name = 'Пользователь'
      chat.avatar = 'https://via.placeholder.com/48?text=?'
      chat.userId = companionId
      chat.lastMessage = chat.lastMessageContent || ''
      chat.time = formatTime(chat.updatedAt)
      chat.unread = chat.unreadCount || 0
    }
  }
}

// Добавляем функцию для загрузки чатов
async function fetchChats() {
  try {
    const token = localStorage.getItem('token')
    console.log('Fetching chats with token:', token ? 'exists' : 'missing')

    const response = await axios.get('http://localhost:3000/messages/chats', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log('Chats response:', response.data)
    chats.value = response.data || []
    await enrichChatsWithUserInfo()
  } catch (error) {
    console.error('Error fetching chats:', error.response?.data || error.message)
    chats.value = []
  }
}

// Инициализация сокета
const initializeSocket = () => {
  try {
    const token = localStorage.getItem('token')
    console.log('Token from localStorage:', token ? 'exists' : 'missing')

    if (!token) {
      console.error('No token found in localStorage')
      return
    }

    console.log('Initializing socket connection...')
    socket.value = io('http://localhost:3000', {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    socket.value.on('connect', () => {
      console.log('Socket connected successfully')
    })

    socket.value.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message)
    })

    socket.value.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason)
    })

    // Обработка отправленного сообщения
    socket.value.on('message_sent', (message) => {
      console.log('Message sent event received:', message)
      if (!message || !message.id) {
        console.error('Invalid message data received:', message)
        return
      }

      // Проверяем, относится ли сообщение к текущему чату
      const isRelevantMessage =
        selectedUserId.value &&
        ((String(message.senderId) === String(selectedUserId.value) &&
          String(message.receiverId) === String(myUserId.value)) ||
          (String(message.senderId) === String(myUserId.value) &&
            String(message.receiverId) === String(selectedUserId.value)))

      if (isRelevantMessage) {
        console.log('Adding sent message to current chat:', message)
        // Проверяем, нет ли уже такого сообщения
        const messageExists = messages.value.some((m) => m.id === message.id)
        if (!messageExists) {
          // Форматируем сообщение перед добавлением
          const formattedMessage = {
            ...message,
            time: formatTime(message.createdAt),
            status: 'sent',
          }
          messages.value = [...messages.value, formattedMessage]
          nextTick(() => scrollToBottom())
        }
      }
    })

    // Обработка нового сообщения
    socket.value.on('new_message', (message) => {
      console.log('New message event received:', message)
      if (!message || !message.id) {
        console.error('Invalid message data received:', message)
        return
      }

      // Проверяем, относится ли сообщение к текущему чату
      const isRelevantMessage =
        selectedUserId.value &&
        ((String(message.senderId) === String(selectedUserId.value) &&
          String(message.receiverId) === String(myUserId.value)) ||
          (String(message.senderId) === String(myUserId.value) &&
            String(message.receiverId) === String(selectedUserId.value)))

      if (isRelevantMessage) {
        console.log('Adding new message to current chat:', message)
        // Проверяем, нет ли уже такого сообщения
        const messageExists = messages.value.some((m) => m.id === message.id)
        if (!messageExists) {
          // Форматируем сообщение перед добавлением
          const formattedMessage = {
            ...message,
            time: formatTime(message.createdAt),
            status: 'sent',
          }
          messages.value = [...messages.value, formattedMessage]
          nextTick(() => scrollToBottom())
        }
        // Если чат открыт — сразу сбрасываем счетчик
        if (socket.value && selectedUserId.value) {
          socket.value.emit('mark_as_read', { userId: selectedUserId.value })
        }
      }
    })

    // Обработка обновления непрочитанных сообщений
    socket.value.on('unread_count_updated', (data) => {
      console.log('Unread count updated event received:', data)
      if (data && typeof data.unreadCount === 'number') {
        // Обновляем счетчик непрочитанных сообщений в соответствующем чате
        const chatIndex = chats.value.findIndex(
          (chat) => String(getCompanionId(chat)) === String(selectedUserId.value),
        )
        if (chatIndex !== -1) {
          chats.value[chatIndex].unread = data.unreadCount
          // Обновляем общее количество непрочитанных сообщений
          totalUnread.value = chats.value.reduce((sum, chat) => sum + (chat.unread || 0), 0)
        }
      }
    })

    // Обработка обновления списка чатов
    socket.value.on('chats_updated', (updatedChats) => {
      console.log('Chats updated event received:', updatedChats)
      if (Array.isArray(updatedChats)) {
        // Сохраняем текущие значения unread перед обновлением
        const currentUnreadValues = new Map(
          chats.value.map((chat) => [String(getCompanionId(chat)), chat.unread || 0]),
        )

        chats.value = updatedChats

        // Восстанавливаем значения unread из обновленных чатов
        chats.value.forEach((chat) => {
          const companionId = String(getCompanionId(chat))
          chat.unread = currentUnreadValues.get(companionId) || 0
        })

        // Обновляем общее количество непрочитанных сообщений
        totalUnread.value = chats.value.reduce((sum, chat) => sum + (chat.unread || 0), 0)
        enrichChatsWithUserInfo()
      }
    })

    // Обработка сброса непрочитанных сообщений после прочтения
    socket.value.on('messages_marked_read', (data) => {
      if (data && data.otherUserId) {
        const chatIndex = chats.value.findIndex(
          (chat) => String(getCompanionId(chat)) === String(data.otherUserId),
        )
        if (chatIndex !== -1) {
          chats.value[chatIndex].unread = 0
          totalUnread.value = chats.value.reduce((sum, chat) => sum + (chat.unread || 0), 0)
        }
      }
    })
  } catch (error) {
    console.error('Error initializing socket:', error)
  }
}

// При монтировании компонента
onMounted(() => {
  // Загружаем чаты при монтировании компонента
  fetchChats()

  // Инициализируем сокет
  initializeSocket()
})

// При размонтировании компонента
onUnmounted(() => {
  if (socket.value) {
    socket.value.disconnect()
  }
})

// Загружаем сообщения при смене выбранного чата
watch(selectedUserId, (newId) => {
  fetchMessages()
  if (socket.value && newId) {
    socket.value.emit('mark_as_read', { userId: newId })
  }
})

// Функция для выбора чата или начала нового диалога
async function selectOrStartChat(userId) {
  selectedUserId.value = userId
  await fetchMessages()
}

// Следим за изменениями query параметров
watch(
  () => route.query.userId,
  async (newUserId) => {
    if (newUserId) {
      await selectOrStartChat(Number(newUserId))

      // Если есть начальное сообщение, отправляем его
      if (route.query.initialMessage) {
        newMessage.value = route.query.initialMessage
        await sendMessage()
      }
    }
  },
  { immediate: true },
)

watch(
  chats,
  () => {
    enrichChatsWithUserInfo()
  },
  { immediate: true },
)

// Для сообщений: новые внизу
const orderedMessages = computed(() => {
  return [...messages.value].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
})
</script>

<template>
  <div class="bg-[#F9F9F9] py-6 px-4 min-h-screen">
    <div
      class="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-[#E5E9F2]"
    >
      <div class="flex h-[calc(100vh-120px)] min-h-[500px]">
        <!-- Список чатов (скрывается на мобильных при просмотре чата) -->
        <div
          v-if="showChatList || !isMobileView"
          class="w-full md:w-1/3 lg:w-1/4 border-r border-[#E5E9F2] flex flex-col"
        >
          <!-- Заголовок и поиск -->
          <div class="p-5 border-b border-[#E5E9F2] bg-white">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="bg-[#F0F7FF] p-2 rounded-lg">
                  <MessageCircle class="w-5 h-5 text-[#0A65CC]" />
                </div>
                <div class="flex items-center gap-2">
                  <h1 class="text-xl font-bold text-[#222222]">Сообщения</h1>
                  <span
                    v-if="totalUnread > 0"
                    class="inline-flex items-center justify-center min-w-[22px] h-6 px-1.5 text-xs font-medium text-white bg-[#0A65CC] rounded-full shadow-sm"
                  >
                    {{ totalUnread }}
                  </span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button class="p-2 rounded-lg hover:bg-[#F0F7FF] transition-colors cursor-pointer">
                  <Filter class="w-5 h-5 text-[#656565]" />
                </button>
                <button class="p-2 rounded-lg hover:bg-[#F0F7FF] transition-colors cursor-pointer">
                  <Bell class="w-5 h-5 text-[#656565]" />
                </button>
              </div>
            </div>
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Поиск сообщений"
                class="w-full pl-10 pr-4 py-2.5 text-sm border border-[#E5E9F2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20 focus:border-[#0A65CC] transition-all"
              />
              <Search
                class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#656565]"
              />
              <button 
                v-if="searchQuery" 
                @click="searchQuery = ''" 
                class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#656565] hover:text-[#222222] cursor-pointer"
              >
                <X class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Список чатов -->
          <div class="flex-1 overflow-y-auto">
            <div v-if="filteredChats.length === 0" class="p-8 text-center">
              <div class="bg-[#F0F7FF] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search class="w-8 h-8 text-[#0A65CC]" />
              </div>
              <p class="text-[#222222] font-medium mb-1">Чаты не найдены</p>
              <p class="text-sm text-[#656565]">Попробуйте изменить запрос</p>
            </div>
            <div
              v-for="chat in filteredChats"
              :key="getCompanionId(chat)"
              @click="selectChat(getCompanionId(chat))"
              class="p-4 border-b border-[#E5E9F2] cursor-pointer transition-all hover:bg-[#F0F7FF]/50"
              :class="{ 'bg-[#F0F7FF] border-l-4 border-l-[#0A65CC]': selectedUserId == getCompanionId(chat) }"
            >
              <div class="flex items-center gap-3">
                <!-- Аватар с индикатором онлайн -->
                <div class="relative">
                  <img
                    :src="chat.avatar || 'https://via.placeholder.com/48?text=?'"
                    :alt="chat.name || 'Пользователь'"
                    class="w-12 h-12 rounded-full object-cover border border-[#E5E9F2] transition-all"
                    :class="{ 'ring-2 ring-[#0A65CC] ring-offset-2': selectedUserId == getCompanionId(chat) }"
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
                    <h3 class="font-medium text-[#222222] truncate">
                      {{ chat.name || 'Пользователь' }}
                    </h3>
                    <span class="text-xs text-[#656565] whitespace-nowrap ml-2 bg-[#F9F9F9] px-1.5 py-0.5 rounded">{{
                      chat.time
                    }}</span>
                  </div>
                  <div class="flex justify-between items-center mt-1">
                    <p v-if="chat.isTyping" class="text-sm text-[#0A65CC] italic flex items-center gap-1">
                      <span class="flex gap-0.5">
                        <span class="w-1.5 h-1.5 bg-[#0A65CC] rounded-full animate-typing" style="animation-delay: 0s"></span>
                        <span class="w-1.5 h-1.5 bg-[#0A65CC] rounded-full animate-typing" style="animation-delay: 0.2s"></span>
                        <span class="w-1.5 h-1.5 bg-[#0A65CC] rounded-full animate-typing" style="animation-delay: 0.4s"></span>
                      </span>
                      печатает...
                    </p>
                    <p v-else class="text-sm text-[#656565] truncate">{{ chat.lastMessage }}</p>
                    <span
                      v-if="chat.unread > 0"
                      class="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-medium text-white bg-[#0A65CC] rounded-full shadow-sm ml-2"
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
        <div v-if="selectedUserId" class="w-full md:w-2/3 lg:w-3/4 flex flex-col">
          <!-- Заголовок чата -->
          <div class="p-4 border-b border-[#E5E9F2] bg-white flex items-center justify-between shadow-sm">
            <div class="flex items-center gap-3">
              <!-- Кнопка возврата на мобильных -->
              <button
                v-if="isMobileView"
                @click="backToList"
                class="p-2 rounded-lg hover:bg-[#F0F7FF] transition-colors cursor-pointer"
              >
                <ChevronLeft class="w-5 h-5 text-[#656565]" />
              </button>

              <!-- Информация о собеседнике -->
              <div class="flex items-center gap-3">
                <div class="relative">
                  <img
                    :src="userPlaceholder.avatar"
                    :alt="userPlaceholder.name"
                    class="w-12 h-12 rounded-full object-cover border border-[#E5E9F2]"
                    onerror="this.src='https://via.placeholder.com/40?text=?'"
                  />
                  <div
                    v-if="userPlaceholder.online"
                    class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                  ></div>
                </div>
                <div>
                  <h3 class="font-medium text-[#222222]">
                    {{ userPlaceholder.name }}
                  </h3>
                  <p v-if="userPlaceholder.online" class="text-xs text-green-500 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Онлайн
                  </p>
                  <p v-else class="text-xs text-[#656565]">Был(а) недавно</p>
                </div>
              </div>
            </div>

            <!-- Действия с чатом -->
            <div class="flex items-center gap-2">
              <button class="p-2 rounded-lg hover:bg-[#F0F7FF] transition-colors cursor-pointer">
                <Phone class="w-5 h-5 text-[#656565]" />
              </button>
              <button class="p-2 rounded-lg hover:bg-[#F0F7FF] transition-colors cursor-pointer">
                <MoreVertical class="w-5 h-5 text-[#656565]" />
              </button>
            </div>
          </div>

          <!-- История сообщений -->
          <div class="flex-1 p-5 overflow-y-auto bg-gradient-to-b from-[#F9F9F9] to-[#F0F7FF]/30" ref="messagesContainer">
            <div class="max-w-3xl mx-auto">
              <div class="text-center mb-6">
                <div class="inline-block bg-white px-3 py-1 rounded-full text-xs text-[#656565] shadow-sm">
                  Сегодня
                </div>
              </div>
              
              <div v-for="message in orderedMessages" :key="message.id" class="mb-4">
                <!-- Входящее сообщение -->
                <div v-if="!isMyMessage(message)" class="flex items-start gap-2 max-w-[80%]">
                  <img
                    :src="
                      chats.find((c) => c.userId === message.senderId)?.avatar ||
                      userPlaceholder.avatar
                    "
                    :alt="
                      chats.find((c) => c.userId === message.senderId)?.name || userPlaceholder.name
                    "
                    class="w-8 h-8 rounded-full object-cover mt-1"
                    onerror="this.src='https://via.placeholder.com/32?text=?'"
                  />
                  <div>
                    <div
                      class="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-[#E5E9F2]"
                    >
                      <p class="text-[#222222]">{{ message.content }}</p>
                    </div>
                    <div class="flex items-center mt-1 ml-1">
                      <span class="text-xs text-[#656565]">{{ message.time }}</span>
                    </div>
                  </div>
                </div>

                <!-- Исходящее сообщение -->
                <div v-else class="flex items-start gap-2 max-w-[80%] ml-auto flex-row-reverse">
                  <div>
                    <div class="bg-[#0A65CC] p-3 rounded-2xl rounded-tr-none shadow-sm">
                      <p class="text-white">{{ message.content }}</p>
                    </div>
                    <div class="flex items-center justify-end gap-1 mt-1 mr-1">
                      <span class="text-xs text-[#656565]">{{ message.time }}</span>
                      <!-- Статус сообщения -->
                      <Check v-if="message.status === 'sent'" class="w-3 h-3 text-[#656565]" />
                      <CheckCheck
                        v-else-if="message.status === 'delivered'"
                        class="w-3 h-3 text-[#656565]"
                      />
                      <CheckCheck
                        v-else-if="message.status === 'read'"
                        class="w-3 h-3 text-[#0A65CC]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Индикатор печати -->
              <div
                v-if="chats.find((c) => c.userId === selectedUserId)?.isTyping"
                class="flex items-start gap-2 max-w-[80%] mb-4"
              >
                <img
                  :src="chats.find((c) => c.userId === selectedUserId)?.avatar"
                  :alt="chats.find((c) => c.userId === selectedUserId)?.name"
                  class="w-8 h-8 rounded-full object-cover mt-1"
                  onerror="this.src='https://via.placeholder.com/32?text=?'"
                />
                <div
                  class="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-[#E5E9F2] min-w-[60px]"
                >
                  <div class="flex gap-1.5">
                    <div class="w-2 h-2 bg-[#0A65CC] rounded-full animate-typing"></div>
                    <div
                      class="w-2 h-2 bg-[#0A65CC] rounded-full animate-typing"
                      style="animation-delay: 0.2s"
                    ></div>
                    <div
                      class="w-2 h-2 bg-[#0A65CC] rounded-full animate-typing"
                      style="animation-delay: 0.4s"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Поле ввода сообщения -->
          <div class="p-4 border-t border-[#E5E9F2] bg-white shadow-sm">
            <div class="flex items-center gap-3">
              <div class="flex items-center">
                <button class="p-2 rounded-lg hover:bg-[#F0F7FF] transition-colors cursor-pointer">
                  <Paperclip class="w-5 h-5 text-[#656565]" />
                </button>
              </div>

              <div class="flex-1 relative">
                <input
                  v-model="newMessage"
                  type="text"
                  placeholder="Введите сообщение..."
                  class="w-full px-4 py-3 text-sm border border-[#E5E9F2] rounded-full focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20 focus:border-[#0A65CC] bg-[#F9F9F9]"
                  @keyup.enter="sendMessage"
                />
                <div class="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  <button
                    class="p-1.5 rounded-full hover:bg-[#F0F7FF] transition-colors cursor-pointer"
                  >
                    <Smile class="w-5 h-5 text-[#656565]" />
                  </button>
                  <button
                    class="p-1.5 rounded-full hover:bg-[#F0F7FF] transition-colors cursor-pointer"
                  >
                    <Mic class="w-5 h-5 text-[#656565]" />
                  </button>
                </div>
              </div>

              <button
                @click="sendMessage"
                class="p-3 rounded-full bg-[#0A65CC] hover:bg-[#085BBA] transition-colors cursor-pointer shadow-sm hover:shadow"
              >
                <Send class="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
        
        <!-- Пустое состояние чата -->
        <div v-if="!selectedUserId && !isMobileView" class="w-full md:w-2/3 lg:w-3/4 flex flex-col items-center justify-center bg-gradient-to-b from-[#F9F9F9] to-[#F0F7FF]/30">
          <div class="text-center max-w-md p-6">
            <div class="bg-[#F0F7FF] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle class="w-10 h-10 text-[#0A65CC]" />
            </div>
            <h2 class="text-2xl font-bold text-[#222222] mb-2">Выберите чат</h2>
            <p class="text-[#656565]">Выберите чат из списка слева для начала общения</p>
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

@keyframes typing {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

.animate-typing {
  animation: typing 1.2s infinite;
}
</style>