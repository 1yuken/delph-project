<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import axios from 'axios'
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle, UserPlus } from 'lucide-vue-next'

const email = ref('')
const username = ref('')
const password = ref('')
const passwordConfirm = ref('')
const error = ref('')
const isLoading = ref(false)
const showPassword = ref(false)
const showPasswordConfirm = ref(false)
const registrationSuccess = ref(false)
const acceptTerms = ref(false)

const router = useRouter()

// Валидация email
const isEmailValid = computed(() => {
  if (!email.value) return true
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.value)
})

// Валидация пароля
const passwordStrength = computed(() => {
  if (!password.value) return 0

  let strength = 0

  // Длина пароля
  if (password.value.length >= 8) strength += 1

  // Наличие цифр
  if (/\d/.test(password.value)) strength += 1

  // Наличие строчных букв
  if (/[a-z]/.test(password.value)) strength += 1

  // Наличие заглавных букв
  if (/[A-Z]/.test(password.value)) strength += 1

  // Наличие специальных символов
  if (/[^a-zA-Z0-9]/.test(password.value)) strength += 1

  return strength
})

const passwordStrengthText = computed(() => {
  if (!password.value) return ''

  const strength = passwordStrength.value

  if (strength <= 1) return 'Очень слабый'
  if (strength === 2) return 'Слабый'
  if (strength === 3) return 'Средний'
  if (strength === 4) return 'Хороший'
  return 'Отличный'
})

const passwordStrengthColor = computed(() => {
  if (!password.value) return ''

  const strength = passwordStrength.value

  if (strength <= 1) return 'bg-red-500'
  if (strength === 2) return 'bg-orange-500'
  if (strength === 3) return 'bg-yellow-500'
  if (strength === 4) return 'bg-green-500'
  return 'bg-green-600'
})

// Проверка совпадения паролей
const passwordsMatch = computed(() => {
  if (!passwordConfirm.value) return true
  return password.value === passwordConfirm.value
})

// Валидация формы
const isFormValid = computed(() => {
  return (
    username.value &&
    email.value &&
    isEmailValid.value &&
    password.value &&
    passwordConfirm.value &&
    passwordsMatch.value &&
    passwordStrength.value >= 3 &&
    acceptTerms.value
  )
})

const register = async () => {
  if (!isFormValid.value) return

  error.value = ''
  isLoading.value = true

  try {
    await axios.post(
      'http://localhost:3000/users',
      {
        username: username.value,
        email: email.value,
        password: password.value,
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )

    registrationSuccess.value = true

    // Перенаправление на страницу входа через 2 секунды
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message
    } else {
      error.value = 'Ошибка регистрации'
    }
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const togglePasswordVisibility = (field) => {
  if (field === 'password') {
    showPassword.value = !showPassword.value
  } else {
    showPasswordConfirm.value = !showPasswordConfirm.value
  }
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
          class="relative flex-1 py-4 text-center text-lg font-semibold transition-colors duration-200 text-[#656565] hover:text-[#222222]"
          to="/login"
        >
          <span>Войти</span>
        </RouterLink>
        <RouterLink
          class="relative flex-1 py-4 text-center text-lg font-semibold transition-colors duration-200 text-[#222222]"
          to="/register"
        >
          <span class="relative z-10">Зарегистрироваться</span>
          <span class="absolute bottom-0 left-0 w-full h-0.5 bg-[#0A65CC]"></span>
        </RouterLink>
      </div>

      <!-- Форма регистрации -->
      <div class="p-6 sm:p-8">
        <h2 class="text-xl font-bold text-[#222222] mb-2 text-center">Создайте аккаунт</h2>
        <p class="text-[#656565] text-sm text-center mb-6">Присоединяйтесь к нашему сообществу</p>

        <!-- Сообщение об успешной регистрации -->
        <div
          v-if="registrationSuccess"
          class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-fadeIn"
        >
          <div class="flex items-center">
            <CheckCircle class="h-5 w-5 text-green-500 mr-2" />
            <p class="text-green-700">Регистрация успешна! Перенаправление на страницу входа...</p>
          </div>
        </div>

        <form v-else class="space-y-4" @submit.prevent="register">
          <!-- Поле username -->
          <div class="space-y-1">
            <label for="username" class="block text-sm font-medium text-[#222222]"
              >Имя пользователя</label
            >
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User class="h-5 w-5 text-[#656565]" />
              </div>
              <input
                id="username"
                v-model="username"
                type="text"
                placeholder="Введите имя пользователя"
                class="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E9F2] rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20 focus:border-[#0A65CC]"
                required
              />
            </div>
          </div>

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
                placeholder="Создайте пароль"
                class="w-full pl-10 pr-10 py-2.5 bg-white border border-[#E5E9F2] rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20 focus:border-[#0A65CC]"
                required
              />
              <button
                type="button"
                @click="togglePasswordVisibility('password')"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <Eye
                  v-if="!showPassword"
                  class="h-5 w-5 cursor-pointer text-[#656565] hover:text-[#222222]"
                />
                <EyeOff v-else class="h-5 w-5 cursor-pointer text-[#656565] hover:text-[#222222]" />
              </button>
            </div>

            <!-- Индикатор силы пароля -->
            <div v-if="password" class="mt-2">
              <div class="flex justify-between items-center mb-1">
                <div class="text-xs text-[#656565]">Надежность пароля:</div>
                <div
                  class="text-xs font-medium"
                  :class="{
                    'text-red-500': passwordStrength <= 1,
                    'text-orange-500': passwordStrength === 2,
                    'text-yellow-500': passwordStrength === 3,
                    'text-green-500': passwordStrength === 4,
                    'text-green-600': passwordStrength === 5,
                  }"
                >
                  {{ passwordStrengthText }}
                </div>
              </div>
              <div class="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  class="h-full transition-all duration-300"
                  :class="passwordStrengthColor"
                  :style="{ width: `${passwordStrength * 20}%` }"
                ></div>
              </div>
              <ul class="mt-2 text-xs text-[#656565] space-y-1">
                <li class="flex items-center gap-1">
                  <div class="w-1 h-1 rounded-full bg-[#656565]"></div>
                  Минимум 8 символов
                </li>
                <li class="flex items-center gap-1">
                  <div class="w-1 h-1 rounded-full bg-[#656565]"></div>
                  Содержит цифры и буквы
                </li>
                <li class="flex items-center gap-1">
                  <div class="w-1 h-1 rounded-full bg-[#656565]"></div>
                  Содержит специальные символы
                </li>
              </ul>
            </div>
          </div>

          <!-- Поле подтверждения пароля -->
          <div class="space-y-1">
            <label for="passwordConfirm" class="block text-sm font-medium text-[#222222]"
              >Подтверждение пароля</label
            >
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock class="h-5 w-5 text-[#656565]" />
              </div>
              <input
                id="passwordConfirm"
                v-model="passwordConfirm"
                :type="showPasswordConfirm ? 'text' : 'password'"
                placeholder="Повторите пароль"
                class="w-full pl-10 pr-10 py-2.5 bg-white border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20"
                :class="[
                  passwordsMatch
                    ? 'border-[#E5E9F2] focus:border-[#0A65CC]'
                    : 'border-red-500 focus:border-red-500',
                ]"
                required
              />
              <button
                type="button"
                @click="togglePasswordVisibility('confirm')"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <Eye
                  v-if="!showPasswordConfirm"
                  class="h-5 w-5 cursor-pointer text-[#656565] hover:text-[#222222]"
                />
                <EyeOff v-else class="h-5 w-5 cursor-pointer text-[#656565] hover:text-[#222222]" />
              </button>
            </div>
            <p v-if="!passwordsMatch && passwordConfirm" class="text-red-500 text-xs mt-1">
              Пароли не совпадают
            </p>
          </div>

          <!-- Согласие с условиями -->
          <div class="flex items-start mt-4 cursor-pointer">
            <div class="flex items-center h-5">
              <input
                id="terms"
                v-model="acceptTerms"
                type="checkbox"
                class="h-4 w-4 text-[#0A65CC] border-[#E5E9F2] rounded focus:ring-[#0A65CC]"
                required
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="terms" class="text-[#656565]">
                Регистрируясь, вы соглашаетесь с
                <a
                  href="#"
                  class="text-[#0A65CC] hover:text-[#085BBA] transition-colors duration-200"
                >
                  правилами обработки персональных данных
                </a>
              </label>
            </div>
          </div>

          <!-- Кнопка регистрации -->
          <button
            type="submit"
            :disabled="!isFormValid || isLoading"
            class="w-full flex cursor-pointer items-center justify-center gap-2 py-2.5 px-4 bg-[#0A65CC] text-white rounded-lg font-medium transition-all duration-200 hover:bg-[#085BBA] focus:outline-none focus:ring-2 focus:ring-[#0A65CC] focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
          >
            <span
              v-if="isLoading"
              class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"
            ></span>
            <span v-else><UserPlus class="h-4 w-4" /></span>
            {{ isLoading ? 'Регистрация...' : 'Зарегистрироваться' }}
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
              <span class="px-4 bg-white text-sm text-[#656565]">или зарегистрируйтесь через</span>
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

/* Плавное появление элементов */
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

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>
