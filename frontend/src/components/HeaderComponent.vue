<script setup>
import { ref, computed, onMounted, onUnmounted, watch, watchEffect } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import {
  Search,
  ChevronDown,
  MessageSquare,
  CreditCard,
  User,
  Settings,
  LogOut,
  HelpCircle,
  Menu,
  X,
  Home,
  Users,
  Shield,
  BookOpen,
  Briefcase,
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/authStore'
import axios from 'axios'

const router = useRouter()

// Initialize authStore outside of conditional block
const authStore = useAuthStore()

const isHelpOpen = ref(false)
const isAvatarMenuOpen = ref(false)
const isMobileMenuOpen = ref(false)

// Initialize refs with values from authStore
const isUserAuthenticated = ref(authStore.isAuthenticated.value)
const currentUsername = ref(authStore.username.value)
const currentAvatarUrl = ref(authStore.avatarUrl.value)

console.log('HeaderComponent - initial state:', {
  isAuthenticated: isUserAuthenticated.value,
  username: currentUsername.value,
  avatarUrl: currentAvatarUrl.value,
})

// Отслеживание изменений в authStore
watchEffect(() => {
  isUserAuthenticated.value = authStore.isAuthenticated.value
  currentUsername.value = authStore.username.value
  currentAvatarUrl.value = authStore.avatarUrl.value

  console.log('HeaderComponent watchEffect - state updated:', {
    isAuthenticated: isUserAuthenticated.value,
    username: currentUsername.value,
    avatarUrl: currentAvatarUrl.value,
  })
})

// Добавляем watch для отслеживания изменений аватара
watch(
  () => authStore.avatarUrl.value,
  (newAvatarUrl) => {
    console.log('HeaderComponent - avatar URL changed:', newAvatarUrl)
    currentAvatarUrl.value = newAvatarUrl
  },
  { immediate: true },
)

// Добавляем watch для отслеживания аутентификации
watch(
  () => authStore.isAuthenticated.value,
  (isAuthenticated) => {
    console.log('HeaderComponent - authentication changed:', isAuthenticated)
    if (isAuthenticated) {
      currentAvatarUrl.value = authStore.avatarUrl.value
      console.log('HeaderComponent - setting avatar after auth:', authStore.avatarUrl.value)
    }
  },
  { immediate: true },
)

// Переключение меню помощи
const toggleHelp = () => {
  if (isAvatarMenuOpen.value) isAvatarMenuOpen.value = false
  isHelpOpen.value = !isHelpOpen.value
}

// Переключение меню профиля
const toggleAvatarMenu = () => {
  if (isHelpOpen.value) isHelpOpen.value = false
  isAvatarMenuOpen.value = !isAvatarMenuOpen.value
}

// Переключение мобильного меню
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  // Блокировка прокрутки при открытом меню
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

// Закрытие меню при клике вне их области
const closeMenus = (event) => {
  if (!event.target.closest('.help-container')) isHelpOpen.value = false
  if (!event.target.closest('.avatar-container')) isAvatarMenuOpen.value = false
}

// Выход из аккаунта
const logout = () => {
  authStore.logout()
  isAvatarMenuOpen.value = false
  isMobileMenuOpen.value = false
  router.push('/')
}

// Поиск
const searchQuery = ref('')
const searchResults = ref([])
const isDropdownVisible = ref(false)
const searchContainer = ref(null)
const isSearchFocused = ref(false)

// Загрузка данных для поиска
const fetchItemsForSearch = async () => {
  try {
    const { data } = await axios.get('https://51ee8a820928c63e.mokky.dev/items')
    searchResults.value = data
  } catch (error) {
    console.error('Ошибка загрузки данных для поиска:', error)
  }
}

// Отслеживание изменений в поисковом запросе
watch(searchQuery, (newValue) => {
  isDropdownVisible.value = newValue.trim() !== ''
})

// Фильтрация результатов поиска
const filteredItems = computed(() => {
  if (!searchQuery.value) return []
  return searchResults.value.filter((item) =>
    item.title?.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

// Переход на страницу найденного элемента
const goToItemPage = (id) => {
  router.push(`/item/${id}`)
  isDropdownVisible.value = false
  searchQuery.value = ''
}

// Обработка клика вне области поиска
const handleOutsideClick = (event) => {
  if (searchContainer.value && !searchContainer.value.contains(event.target)) {
    isDropdownVisible.value = false
    isSearchFocused.value = false
  }
}

// Обработка фокуса на поле поиска
const handleSearchFocus = () => {
  isSearchFocused.value = true
}

// Обработка потери фокуса на поле поиска
const handleSearchBlur = () => {
  // Не скрываем выпадающий список сразу, чтобы можно было кликнуть по результатам
  setTimeout(() => {
    if (!isDropdownVisible.value) {
      isSearchFocused.value = false
    }
  }, 200)
}

// Жизненный цикл компонента
onMounted(() => {
  console.log('HeaderComponent - mounted')
  document.addEventListener('click', closeMenus)
  document.addEventListener('click', handleOutsideClick)
  authStore.checkAuth()
  fetchItemsForSearch()
  currentAvatarUrl.value = authStore.avatarUrl.value
  console.log('HeaderComponent - mounted state:', {
    isAuthenticated: isUserAuthenticated.value,
    username: currentUsername.value,
    avatarUrl: currentAvatarUrl.value,
  })
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenus)
  document.removeEventListener('click', handleOutsideClick)
  // Сброс overflow при размонтировании компонента
  document.body.style.overflow = ''
})

// Сброс поиска при изменении маршрута
router.afterEach(() => {
  isDropdownVisible.value = false
  searchQuery.value = ''
  isSearchFocused.value = false
})

// Активный маршрут
const isActiveRoute = (route) => {
  return router.currentRoute.value.path === route
}
</script>

<template>
  <header class="sticky top-0 z-50 bg-white border-b border-[#E5E9F2] shadow-sm">
    <!-- Мобильный хедер -->
    <div class="flex lg:hidden justify-between items-center px-6 py-4 bg-white">
      <RouterLink to="/" class="flex items-center">
        <h1 class="font-bold text-2xl text-[#0A65CC]">
          Delph<span class="text-[#CCC1D2]">.</span>
        </h1>
      </RouterLink>

      <div class="flex items-center gap-3">
        <!-- Поиск на мобильных устройствах -->
        <div class="relative" ref="searchContainer">
          <button
            @click="isSearchFocused = !isSearchFocused"
            class="p-2 rounded-full hover:bg-[#F0F7FF] transition-colors"
          >
            <Search class="w-5 h-5 text-[#656565]" />
          </button>

          <!-- Поле поиска, появляющееся при нажатии на иконку -->
          <div
            v-if="isSearchFocused"
            class="absolute top-full right-0 mt-2 w-64 bg-white shadow-lg rounded-lg border border-[#E5E9F2] p-2 z-50"
          >
            <div class="relative">
              <input
                v-model="searchQuery"
                class="w-full border rounded-md px-3 py-2 pr-8 text-sm border-[#E5E9F2] focus:border-[#0A65CC] focus:outline-none"
                type="text"
                placeholder="Поиск"
                @focus="handleSearchFocus"
                @blur="handleSearchBlur"
                ref="mobileSearchInput"
              />
              <Search class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#656565]" />
            </div>

            <!-- Результаты поиска -->
            <div
              v-if="isDropdownVisible && filteredItems.length"
              class="mt-2 max-h-60 overflow-y-auto"
            >
              <ul class="divide-y divide-[#E5E9F2]">
                <li
                  v-for="item in filteredItems"
                  :key="item.id"
                  class="px-3 py-2 hover:bg-[#F0F7FF] cursor-pointer text-sm"
                  @click.stop="goToItemPage(item.id)"
                >
                  {{ item.title }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Кнопка мобильного меню -->
        <button
          @click="toggleMobileMenu"
          class="p-2 rounded-full hover:bg-[#F0F7FF] transition-colors relative z-50"
          aria-label="Меню"
        >
          <Menu v-if="!isMobileMenuOpen" class="w-6 h-6 text-[#0A65CC]" />
          <X v-else class="w-6 h-6 text-[#0A65CC]" />
        </button>
      </div>
    </div>

    <!-- Мобильное меню -->
    <div
      class="fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto pt-16"
      :class="isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'"
    >
      <button
        @click="toggleMobileMenu"
        class="absolute top-4 right-6 p-2 rounded-full hover:bg-[#F0F7FF] transition-colors"
        aria-label="Закрыть меню"
      >
        <X class="w-6 h-6 text-[#0A65CC]" />
      </button>

      <div class="px-6 py-4 space-y-6">
        <!-- Основные разделы -->
        <div class="space-y-1">
          <RouterLink
            @click="toggleMobileMenu"
            to="/"
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
            :class="
              isActiveRoute('/')
                ? 'bg-[#F0F7FF] text-[#0A65CC]'
                : 'text-[#656565] hover:bg-[#F9F9F9]'
            "
          >
            <Home class="w-5 h-5" />
            <span class="font-medium">Главная</span>
          </RouterLink>

          <RouterLink
            @click="toggleMobileMenu"
            to="/specialists"
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
            :class="
              isActiveRoute('/specialists')
                ? 'bg-[#F0F7FF] text-[#0A65CC]'
                : 'text-[#656565] hover:bg-[#F9F9F9]'
            "
          >
            <Users class="w-5 h-5" />
            <span class="font-medium">Специалисты</span>
          </RouterLink>
        </div>

        <!-- Информационные разделы -->
        <div class="space-y-1">
          <h3 class="px-4 text-xs font-semibold text-[#656565] uppercase tracking-wider">
            Информация
          </h3>

          <RouterLink
            @click="toggleMobileMenu"
            to="/how-it-works"
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
            :class="
              isActiveRoute('/how-it-works')
                ? 'bg-[#F0F7FF] text-[#0A65CC]'
                : 'text-[#656565] hover:bg-[#F9F9F9]'
            "
          >
            <HelpCircle class="w-5 h-5" />
            <span class="font-medium">Как это работает</span>
          </RouterLink>

          <RouterLink
            @click="toggleMobileMenu"
            to="/guarantees"
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
            :class="
              isActiveRoute('/guarantees')
                ? 'bg-[#F0F7FF] text-[#0A65CC]'
                : 'text-[#656565] hover:bg-[#F9F9F9]'
            "
          >
            <Shield class="w-5 h-5" />
            <span class="font-medium">Гарантии и FAQ</span>
          </RouterLink>

          <RouterLink
            @click="toggleMobileMenu"
            to="/rules"
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
            :class="
              isActiveRoute('/rules')
                ? 'bg-[#F0F7FF] text-[#0A65CC]'
                : 'text-[#656565] hover:bg-[#F9F9F9]'
            "
          >
            <BookOpen class="w-5 h-5" />
            <span class="font-medium">Правила</span>
          </RouterLink>
        </div>

        <!-- Разделы для авторизованных пользователей -->
        <div v-if="isUserAuthenticated" class="space-y-1">
          <h3 class="px-4 text-xs font-semibold text-[#656565] uppercase tracking-wider">
            Личный кабинет
          </h3>

          <RouterLink
            @click="toggleMobileMenu"
            to="/messages"
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
            :class="
              isActiveRoute('/messages')
                ? 'bg-[#F0F7FF] text-[#0A65CC]'
                : 'text-[#656565] hover:bg-[#F9F9F9]'
            "
          >
            <MessageSquare class="w-5 h-5" />
            <span class="font-medium">Сообщения</span>
          </RouterLink>

          <RouterLink
            @click="toggleMobileMenu"
            to="/finances"
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
            :class="
              isActiveRoute('/finances')
                ? 'bg-[#F0F7FF] text-[#0A65CC]'
                : 'text-[#656565] hover:bg-[#F9F9F9]'
            "
          >
            <CreditCard class="w-5 h-5" />
            <span class="font-medium">Финансы</span>
          </RouterLink>

          <RouterLink
            @click="toggleMobileMenu"
            to="/profile"
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
            :class="
              isActiveRoute('/profile')
                ? 'bg-[#F0F7FF] text-[#0A65CC]'
                : 'text-[#656565] hover:bg-[#F9F9F9]'
            "
          >
            <User class="w-5 h-5" />
            <span class="font-medium">Профиль</span>
          </RouterLink>

          <RouterLink
            @click="toggleMobileMenu"
            to="/my-orders"
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
            :class="
              isActiveRoute('/my-orders')
                ? 'bg-[#F0F7FF] text-[#0A65CC]'
                : 'text-[#656565] hover:bg-[#F9F9F9]'
            "
          >
            <Briefcase class="w-5 h-5" />
            <span class="font-medium">Мои заказы</span>
          </RouterLink>

          <RouterLink
            @click="toggleMobileMenu"
            to="/settings"
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
            :class="
              isActiveRoute('/settings')
                ? 'bg-[#F0F7FF] text-[#0A65CC]'
                : 'text-[#656565] hover:bg-[#F9F9F9]'
            "
          >
            <Settings class="w-5 h-5" />
            <span class="font-medium">Настройки</span>
          </RouterLink>

          <button
            @click="logout"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer text-[#656565] hover:bg-[#F9F9F9] transition-colors text-left"
          >
            <LogOut class="w-5 h-5" />
            <span class="font-medium">Выйти</span>
          </button>
        </div>

        <!-- Разделы для неавторизованных пользователей -->
        <div v-else class="space-y-1">
          <h3 class="px-4 text-xs font-semibold text-[#656565] uppercase tracking-wider">
            Аккаунт
          </h3>

          <RouterLink
            @click="toggleMobileMenu"
            to="/login"
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
            :class="
              isActiveRoute('/login')
                ? 'bg-[#F0F7FF] text-[#0A65CC]'
                : 'text-[#656565] hover:bg-[#F9F9F9]'
            "
          >
            <LogOut class="w-5 h-5 transform rotate-180" />
            <span class="font-medium">Войти</span>
          </RouterLink>

          <RouterLink
            @click="toggleMobileMenu"
            to="/register"
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
            :class="
              isActiveRoute('/register')
                ? 'bg-[#F0F7FF] text-[#0A65CC]'
                : 'text-[#656565] hover:bg-[#F9F9F9]'
            "
          >
            <User class="w-5 h-5" />
            <span class="font-medium">Зарегистрироваться</span>
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Десктопный хедер -->
    <div class="hidden lg:block">
      <div class="max-w-6xl mx-auto px-1 py-4">
        <div class="flex items-center justify-between">
          <!-- Левая часть: логотип, поиск и навигация -->
          <div class="flex items-center gap-8">
            <!-- Логотип -->
            <RouterLink to="/" class="flex items-center">
              <h1 class="font-bold text-2xl text-[#0A65CC]">
                Delph<span class="text-[#CCC1D2]">.</span>
              </h1>
            </RouterLink>

            <!-- Поиск -->
            <div class="relative" ref="searchContainer">
              <div class="relative">
                <input
                  v-model="searchQuery"
                  class="w-64 border rounded-lg px-4 py-2 pr-10 text-sm border-[#E5E9F2] focus:border-[#0A65CC] focus:outline-none transition-all duration-200"
                  :class="{ 'border-[#0A65CC] shadow-sm': isSearchFocused }"
                  type="text"
                  placeholder="Поиск"
                  @focus="handleSearchFocus"
                  @blur="handleSearchBlur"
                />
                <Search class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#656565]" />
              </div>

              <!-- Результаты поиска -->
              <div
                v-if="isDropdownVisible && filteredItems.length"
                class="absolute top-full left-0 mt-1 w-full bg-white shadow-lg rounded-lg border border-[#E5E9F2] overflow-hidden z-10"
              >
                <ul class="max-h-60 overflow-y-auto divide-y divide-[#E5E9F2]">
                  <li
                    v-for="item in filteredItems"
                    :key="item.id"
                    class="px-4 py-2 hover:bg-[#F0F7FF] cursor-pointer text-sm"
                    @click.stop="goToItemPage(item.id)"
                  >
                    {{ item.title }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- Навигация -->
            <nav class="flex items-center gap-6">
              <!-- Помощь с выпадающим меню -->
              <div class="relative help-container">
                <button
                  @click.stop="toggleHelp"
                  class="flex items-center gap-1.5 text-sm font-medium transition-colors"
                  :class="isHelpOpen ? 'text-[#0A65CC]' : 'text-[#656565] hover:text-[#222222]'"
                >
                  <HelpCircle class="w-4 h-4" />
                  <span>Помощь</span>
                  <ChevronDown class="w-4 h-4" :class="{ 'transform rotate-180': isHelpOpen }" />
                </button>

                <!-- Выпадающее меню помощи -->
                <div
                  v-if="isHelpOpen"
                  class="absolute top-full left-0 mt-2 w-56 bg-white shadow-lg rounded-lg border border-[#E5E9F2] overflow-hidden z-20 animate-fadeIn"
                >
                  <RouterLink
                    to="/how-it-works"
                    class="flex items-center gap-2 w-full text-sm px-4 py-3 text-[#656565] hover:bg-[#F0F7FF] transition-colors"
                  >
                    <HelpCircle class="w-4 h-4" />
                    <span>Как это работает</span>
                  </RouterLink>

                  <RouterLink
                    to="/guarantees"
                    class="flex items-center gap-2 w-full text-sm px-4 py-3 text-[#656565] hover:bg-[#F0F7FF] transition-colors"
                  >
                    <Shield class="w-4 h-4" />
                    <span>Гарантии и FAQ</span>
                  </RouterLink>

                  <RouterLink
                    to="/rules"
                    class="flex items-center gap-2 w-full text-sm px-4 py-3 text-[#656565] hover:bg-[#F0F7FF] transition-colors"
                  >
                    <BookOpen class="w-4 h-4" />
                    <span>Правила</span>
                  </RouterLink>
                </div>
              </div>

              <!-- Специалисты -->
              <RouterLink
                to="/specialists"
                class="flex items-center gap-1.5 text-sm font-medium transition-colors"
                :class="
                  isActiveRoute('/specialists')
                    ? 'text-[#0A65CC]'
                    : 'text-[#656565] hover:text-[#222222]'
                "
              >
                <Users class="w-4 h-4" />
                <span>Специалисты</span>
              </RouterLink>
            </nav>
          </div>

          <!-- Правая часть: авторизация или профиль -->
          <div>
            <!-- Для авторизованных пользователей -->
            <div v-if="isUserAuthenticated" class="flex items-center gap-6">
              <!-- Сообщения -->
              <RouterLink
                to="/messages"
                class="flex items-center gap-1.5 text-sm font-medium transition-colors"
                :class="
                  isActiveRoute('/messages')
                    ? 'text-[#0A65CC]'
                    : 'text-[#656565] hover:text-[#222222]'
                "
              >
                <MessageSquare class="w-4 h-4" />
                <span>Сообщения</span>
              </RouterLink>

              <!-- Финансы -->
              <RouterLink
                to="/finances"
                class="flex items-center gap-1.5 text-sm font-medium transition-colors"
                :class="
                  isActiveRoute('/finances')
                    ? 'text-[#0A65CC]'
                    : 'text-[#656565] hover:text-[#222222]'
                "
              >
                <CreditCard class="w-4 h-4" />
                <span>Финансы</span>
              </RouterLink>

              <!-- Профиль с выпадающим меню -->
              <div class="relative avatar-container">
                <button @click.stop="toggleAvatarMenu" class="flex items-center gap-2">
                  <div class="relative">
                    <img
                      :src="currentAvatarUrl"
                      :alt="currentUsername"
                      class="w-8 h-8 rounded-full object-cover"
                      @error="$event.target.src = '/avatar-default.jpg'"
                    />
                  </div>
                  <ChevronDown
                    class="w-4 h-4 text-[#656565]"
                    :class="{ 'transform rotate-180 text-[#0A65CC]': isAvatarMenuOpen }"
                  />
                </button>

                <!-- Выпадающее меню профиля -->
                <div
                  v-if="isAvatarMenuOpen"
                  class="absolute top-full right-0 mt-2 w-56 bg-white shadow-lg rounded-lg border border-[#E5E9F2] overflow-hidden z-20 animate-fadeIn"
                >
                  <div class="px-4 py-3 border-b border-[#E5E9F2] bg-[#F9F9F9]">
                    <p class="font-medium text-[#222222]">{{ currentUsername }}</p>
                    <p class="text-xs text-[#656565]">Онлайн</p>
                  </div>

                  <RouterLink
                    to="/profile"
                    class="flex items-center gap-2 w-full text-sm px-4 py-3 text-[#656565] hover:bg-[#F0F7FF] transition-colors"
                  >
                    <User class="w-4 h-4" />
                    <span>Профиль</span>
                  </RouterLink>

                  <RouterLink
                    to="/my-orders"
                    class="flex items-center gap-2 w-full text-sm px-4 py-3 text-[#656565] hover:bg-[#F0F7FF] transition-colors"
                  >
                    <Briefcase class="w-4 h-4" />
                    <span>Мои заказы</span>
                  </RouterLink>

                  <RouterLink
                    to="/settings"
                    class="flex items-center gap-2 w-full text-sm px-4 py-3 text-[#656565] hover:bg-[#F0F7FF] transition-colors"
                  >
                    <Settings class="w-4 h-4" />
                    <span>Настройки</span>
                  </RouterLink>

                  <button
                    @click="logout"
                    class="flex items-center gap-2 w-full text-sm px-4 py-3 text-[#656565] hover:bg-[#F0F7FF] transition-colors text-left"
                  >
                    <LogOut class="w-4 h-4" />
                    <span>Выйти</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Для неавторизованных пользователей -->
            <div v-else class="flex items-center gap-4">
              <RouterLink
                to="/login"
                class="text-sm font-medium text-[#656565] hover:text-[#222222] transition-colors px-4 py-2"
              >
                Войти
              </RouterLink>

              <RouterLink
                to="/register"
                class="text-sm font-medium text-white bg-[#0A65CC] hover:bg-[#085BBA] transition-colors px-4 py-2 rounded-lg"
              >
                Зарегистрироваться
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Анимация для выпадающих меню */
.animate-fadeIn {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Стили для мобильного меню */
.translate-x-full {
  transform: translateX(100%);
}

.translate-x-0 {
  transform: translateX(0);
}

/* Стили для скроллбара в выпадающих списках */
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
</style>
