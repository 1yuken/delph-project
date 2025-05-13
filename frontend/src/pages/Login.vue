<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { Mail, Lock, Eye, EyeOff, AlertCircle, LogIn } from 'lucide-vue-next'

const email = ref('')
// const login = ref('');
const password = ref('')
const error = ref('')
const isLoading = ref(false)
const rememberMe = ref(false)
const showPassword = ref(false)

const router = useRouter()
const authStore = useAuthStore()

const isEmailValid = computed(() => {
  if (!email.value) return true
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.value)
})

const isFormValid = computed(() => {
  return email.value && password.value && isEmailValid.value
})

const login = async () => {
  if (!isFormValid.value) return

  error.value = ''
  isLoading.value = true

  try {
    const response = await axios.post(
      'http://localhost:3000/auth/login',
      {
        // login: login.value,
        login: email.value,
        password: password.value,
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )

    console.log('Server response:', response.data)

    // Проверяем структуру ответа и извлекаем нужные данные
    const userData = {
      token: response.data.access_token,
      name: response.data.user?.name || email.value,
      email: email.value,
      id: response.data.user?.id,
      avatarUrl: response.data.user?.avatarUrl || null,
    }

    console.log('User data before login:', userData)

    // Сохраняем данные пользователя
    authStore.login(userData)

    console.log('After authStore.login - localStorage:', {
      token: localStorage.getItem('token'),
      username: localStorage.getItem('username'),
      avatarUrl: localStorage.getItem('avatarUrl'),
      userId: localStorage.getItem('userId'),
    })

    // Перенаправляем пользователя на домашнюю страницу или личный кабинет
    router.push('/')
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message
    } else {
      error.value = 'Ошибка авторизации. Проверьте введённые данные.'
    }
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="flex flex-col items-center justify-center w-full bg-[#F9F9F9] py-12 px-4">
    <div
      class="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
    >
      <!-- Вкладки навигации -->
      <div class="flex items-center justify-center border-b border-[#E5E9F2]">
        <RouterLink
          class="relative flex-1 py-4 text-center text-lg font-semibold transition-colors duration-200 text-[#222222]"
          to="/login"
        >
          <span class="relative z-10">Войти</span>
          <span class="absolute bottom-0 left-0 w-full h-0.5 bg-[#0A65CC]"></span>
        </RouterLink>
        <RouterLink
          class="relative flex-1 py-4 text-center text-lg font-semibold transition-colors duration-200 text-[#656565] hover:text-[#222222]"
          to="/register"
        >
          <span>Зарегистрироваться</span>
        </RouterLink>
      </div>

      <!-- Форма входа -->
      <div class="p-6 sm:p-8">
        <h2 class="text-xl font-bold text-[#222222] mb-2 text-center">Добро пожаловать!</h2>
        <p class="text-[#656565] text-sm text-center mb-6">Войдите в аккаунт, чтобы продолжить</p>

        <form class="space-y-4" @submit.prevent="login">
          <!-- Поле email -->
          <div class="space-y-1">
            <label for="email" class="block text-sm font-medium text-[#222222]"
              >Электронная почта</label
            >
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail class="h-5 w-5 text-[#656565]" />
              </div>
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="Введите вашу почту"
                class="w-full pl-10 pr-4 py-2.5 bg-white border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20"
                :class="[
                  isEmailValid
                    ? 'border-[#E5E9F2] focus:border-[#0A65CC]'
                    : 'border-red-500 focus:border-red-500',
                ]"
                required
              />
              <div
                v-if="!isEmailValid && email"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <AlertCircle class="h-5 w-5 text-red-500" />
              </div>
            </div>
            <p v-if="!isEmailValid && email" class="text-red-500 text-xs mt-1">
              Пожалуйста, введите корректный email
            </p>
          </div>

          <!-- Поле пароля -->
          <div class="space-y-1">
            <label for="password" class="block text-sm font-medium text-[#222222]">Пароль</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock class="h-5 w-5 text-[#656565]" />
              </div>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Введите ваш пароль"
                class="w-full pl-10 pr-10 py-2.5 bg-white border border-[#E5E9F2] rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20 focus:border-[#0A65CC]"
                required
              />
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              >
                <Eye v-if="!showPassword" class="h-5 w-5 text-[#656565] hover:text-[#222222]" />
                <EyeOff v-else class="h-5 w-5 text-[#656565] hover:text-[#222222]" />
              </button>
            </div>
          </div>

          <!-- Дополнительные опции -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="rememberMe"
                type="checkbox"
                class="h-4 w-4 text-[#0A65CC] border-[#E5E9F2] rounded cursor-pointer focus:ring-[#0A65CC]"
              />
              <label for="remember-me" class="ml-2 block text-sm text-[#656565]">
                Запомнить меня
              </label>
            </div>
            <a
              href="#"
              class="text-sm font-medium text-[#0A65CC] hover:text-[#085BBA] transition-colors duration-200"
            >
              Забыли пароль?
            </a>
          </div>

          <!-- Кнопка входа -->
          <button
            type="submit"
            :disabled="!isFormValid || isLoading"
            class="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#0A65CC] text-white cursor-pointer rounded-lg font-medium transition-all duration-200 hover:bg-[#085BBA] focus:outline-none focus:ring-2 focus:ring-[#0A65CC] focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span
              v-if="isLoading"
              class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"
            ></span>
            <span v-else><LogIn class="h-4 w-4" /></span>
            {{ isLoading ? 'Вход...' : 'Войти' }}
          </button>

          <!-- Сообщение об ошибке -->
          <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle class="h-4 w-4 flex-shrink-0" />
              {{ error }}
            </p>
          </div>

          <!-- Разделитель -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-[#E5E9F2]"></div>
            </div>
            <div class="relative flex justify-center">
              <span class="px-4 bg-white text-sm text-[#656565]">или войдите через</span>
            </div>
          </div>

          <!-- Социальные кнопки -->
          <div class="grid grid-cols-3 gap-3">
            <button
              type="button"
              class="flex justify-center items-center cursor-pointer py-2 px-4 border border-[#E5E9F2] rounded-lg shadow-sm bg-white hover:bg-[#F9F9F9] transition-colors duration-200"
            >
              <svg
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.5 12.5C22.5 10.7761 22.0311 9.0228 21.1328 7.42664C20.2344 5.83048 18.9323 4.42923 17.364 3.37368C15.7957 2.31814 13.9867 1.6343 12.0788 1.38408C10.1709 1.13385 8.2272 1.32825 6.42048 1.95065C4.61375 2.57305 2.99658 3.60248 1.70736 4.94339C0.418133 6.28429 0.49989 7.88743 0.0385323 9.62178C-0.422825 11.3561 0.0428931 13.1643 0.498893 14.8099C0.954892 16.4555 2.68414 17.8565 4.00001 19"
                  stroke="#1877F2"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8 12H16M16 12L12 8M16 12L12 16"
                  stroke="#1877F2"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              class="flex justify-center items-center cursor-pointer py-2 px-4 border border-[#E5E9F2] rounded-lg shadow-sm bg-white hover:bg-[#F9F9F9] transition-colors duration-200"
            >
              <svg
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="#0088CC"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8 12L11 15L16 9"
                  stroke="#0088CC"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              class="flex justify-center items-center cursor-pointer py-2 px-4 border border-[#E5E9F2] rounded-lg shadow-sm bg-white hover:bg-[#F9F9F9] transition-colors duration-200"
            >
              <svg
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="#EA4335"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                  stroke="#EA4335"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
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

/* Плавное появление ошибки */
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

.p-3 {
  animation: fadeIn 0.3s ease-out;
}
</style>
