<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChevronLeft, Calendar, DollarSign, AlertCircle, FileText, Upload } from 'lucide-vue-next'
import { itemsApi, ordersApi } from '@/services/api'

const route = useRoute()
const router = useRouter()
const itemId = route.params.id
const selectedCategory = route.query.category || 'Все'

const item = ref(null)
const isLoading = ref(true)
const isSubmitting = ref(false)
const error = ref(null)
const success = ref(false)

// Форма заказа
const orderForm = ref({
  title: '',
  description: '',
  price: '',
  deadline: '',
  category: selectedCategory !== 'Все' ? 'Разработка на Vue.js' : '',
  attachments: [],
})

// Валидация формы
const formErrors = ref({
  title: '',
  description: '',
  price: '',
  deadline: '',
  category: '',
})

// Загрузка данных о категории
const loadItem = async () => {
  isLoading.value = true
  error.value = null

  try {
    // Используем наш API для получения данных о категории
    item.value = await itemsApi.getOne(itemId)
    console.log('Данные навыка:', item.value)

    // Устанавливаем категорию из навыка в форму
    if (item.value && item.value.links && item.value.links.length > 0) {
      console.log('Категории навыка:', item.value.links)
      // Используем первую категорию из списка
      orderForm.value.category = item.value.links[0]
    } else {
      console.warn('Категории не найдены в данных навыка')
      orderForm.value.category = 'Разработка' // Устанавливаем значение по умолчанию
    }
  } catch (err) {
    console.error('Ошибка загрузки данных о навыке:', err)
    error.value = 'Не удалось загрузить информацию о навыке. Пожалуйста, попробуйте позже.'
  } finally {
    isLoading.value = false
  }
}

// Валидация формы
const validateForm = () => {
  let isValid = true
  formErrors.value = {
    title: '',
    description: '',
    price: '',
    deadline: '',
    category: '',
  }

  if (!orderForm.value.title.trim()) {
    formErrors.value.title = 'Введите название заказа'
    isValid = false
  }

  if (!orderForm.value.description.trim()) {
    formErrors.value.description = 'Введите описание заказа'
    isValid = false
  } else if (orderForm.value.description.length < 50) {
    formErrors.value.description = 'Описание должно содержать не менее 50 символов'
    isValid = false
  }

  if (!orderForm.value.price.trim()) {
    formErrors.value.price = 'Укажите бюджет'
    isValid = false
  } else if (isNaN(parseFloat(orderForm.value.price))) {
    formErrors.value.price = 'Бюджет должен быть числом'
    isValid = false
  }

  if (!orderForm.value.deadline.trim()) {
    formErrors.value.deadline = 'Укажите срок выполнения'
    isValid = false
  }

  if (!orderForm.value.category.trim()) {
    formErrors.value.category = 'Выберите категорию'
    isValid = false
  }

  return isValid
}

// Отправка формы
const submitOrder = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  error.value = null

  try {
    // Проверяем наличие данных о навыке
    if (!item.value) {
      throw new Error('Данные о навыке не загружены')
    }

    // Подготовка данных для отправки
    const orderData = {
      title: orderForm.value.title,
      description: orderForm.value.description,
      price: orderForm.value.price + ' ₽',
      categories: item.value.categories || '',
      itemId: itemId,
      status: 'open',
      clientId: localStorage.getItem('userId') || null,
      budget: orderForm.value.price.replace(/[^.-]/g, ''),
      completionDate: new Date(orderForm.value.deadline).toISOString(),
      attachments: orderForm.value.attachments.map((file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file.file),
      })),
    }

    // Отправка данных на сервер через наш API
    await ordersApi.create(orderData)

    // Показываем сообщение об успехе
    success.value = true

    // Перенаправляем на страницу категории через 2 секунды
    setTimeout(() => {
      router.push(`/item/${itemId}`)
    }, 2000)
  } catch (err) {
    console.error('Ошибка при создании заказа:', err)
    if (err.response) {
      error.value = `Ошибка: ${err.response.status} - ${err.response.data.message || 'Не удалось создать заказ'}`
    } else {
      error.value = 'Не удалось создать заказ. Пожалуйста, попробуйте снова.'
    }
  } finally {
    isSubmitting.value = false
  }
}

// Добавление файла
const addFile = (event) => {
  const files = event.target.files
  if (!files.length) return

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (file.size > 10 * 1024 * 1024) {
      // 10MB
      alert('Файл слишком большой. Максимальный размер файла - 10MB')
      continue
    }

    orderForm.value.attachments.push({
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
      file: file,
    })
  }

  // Сбрасываем input, чтобы можно было загрузить тот же файл повторно
  event.target.value = ''
}

// Удаление файла
const removeFile = (index) => {
  orderForm.value.attachments.splice(index, 1)
}

// Форматирование размера файла
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Возврат на предыдущую страницу
const goBack = () => {
  router.go(-1)
}

// Минимальная дата для выбора дедлайна (сегодня)
const today = new Date()
const minDate = computed(() => {
  return today.toISOString().split('T')[0]
})

onMounted(loadItem)
</script>

<template>
  <div class="bg-[#F9F9F9] py-6 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Хлебные крошки и кнопка назад -->
      <div class="mb-6">
        <button
          @click="goBack"
          class="flex items-center text-[#656565] hover:text-[#0A65CC] transition-colors text-sm"
        >
          <ChevronLeft class="w-4 h-4 mr-1" />
          Назад
        </button>
      </div>

      <!-- Состояние загрузки -->
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A65CC]"
        ></div>
      </div>

      <!-- Сообщение об ошибке -->
      <div
        v-else-if="error"
        class="bg-white rounded-lg shadow-sm border border-[#E5E9F2] p-8 text-center"
      >
        <AlertCircle class="w-16 h-16 text-[#E5E9F2] mx-auto mb-4" />
        <h2 class="text-xl font-bold text-[#222222] mb-2">Ошибка загрузки</h2>
        <p class="text-[#656565] mb-6">{{ error }}</p>
        <button
          @click="loadItem"
          class="px-4 py-2 bg-[#0A65CC] text-white rounded-md hover:bg-[#085BBA] transition-colors"
        >
          Попробовать снова
        </button>
      </div>

      <!-- Сообщение об успешном создании заказа -->
      <div
        v-else-if="success"
        class="bg-white rounded-lg shadow-sm border border-green-200 p-8 text-center"
      >
        <div
          class="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 6L9 17L4 12"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-[#222222] mb-2">Заказ успешно создан!</h2>
        <p class="text-[#656565] mb-6">
          Ваше предложение было успешно добавлено. Вы будете перенаправлены на страницу категории.
        </p>
        <div class="animate-pulse h-1 bg-[#0A65CC] rounded-full max-w-xs mx-auto"></div>
      </div>

      <!-- Форма создания заказа -->
      <div
        v-else-if="item"
        class="bg-white rounded-lg shadow-sm border border-[#E5E9F2] overflow-hidden"
      >
        <!-- Заголовок -->
        <div class="p-6 border-b border-[#E5E9F2]">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg overflow-hidden border border-[#E5E9F2] flex-shrink-0">
              <img
                :src="item.imageUrl"
                :alt="item.title"
                class="w-full h-full object-cover"
                onerror="this.src='https://via.placeholder.com/48?text=?'"
              />
            </div>
            <div>
              <h1 class="text-xl font-bold text-[#222222]">Добавить предложение</h1>
              <p class="text-[#656565]">Категория: {{ item.title }}</p>
            </div>
          </div>
        </div>

        <!-- Форма -->
        <form @submit.prevent="submitOrder" class="p-6">
          <!-- Название заказа -->
          <div class="mb-6">
            <label for="title" class="block text-sm font-medium text-[#222222] mb-2"
              >Название заказа</label
            >
            <input
              id="title"
              v-model="orderForm.title"
              type="text"
              placeholder="Введите название заказа"
              class="w-full px-4 py-2 border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20"
              :class="
                formErrors.title
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-[#E5E9F2] focus:border-[#0A65CC]'
              "
            />
            <p v-if="formErrors.title" class="mt-1 text-sm text-red-500">{{ formErrors.title }}</p>
          </div>

          <!-- Описание заказа -->
          <div class="mb-6">
            <label for="description" class="block text-sm font-medium text-[#222222] mb-2"
              >Описание заказа</label
            >
            <textarea
              id="description"
              v-model="orderForm.description"
              placeholder="Подробно опишите, что требуется сделать, какие навыки нужны исполнителю и т.д."
              rows="6"
              class="w-full px-4 py-2 border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20"
              :class="
                formErrors.description
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-[#E5E9F2] focus:border-[#0A65CC]'
              "
            ></textarea>
            <p v-if="formErrors.description" class="mt-1 text-sm text-red-500">
              {{ formErrors.description }}
            </p>
            <p class="mt-1 text-xs text-[#656565]">
              Минимум 50 символов. Текущая длина: {{ orderForm.description.length }}
            </p>
          </div>

          <!-- Бюджет и срок -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <!-- Бюджет -->
            <div>
              <label for="price" class="block text-sm font-medium text-[#222222] mb-2"
                >Бюджет (₽)</label
              >
              <div class="relative">
                <input
                  id="price"
                  v-model="orderForm.price"
                  type="text"
                  placeholder="Укажите бюджет"
                  class="w-full pl-9 pr-4 py-2 border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20"
                  :class="
                    formErrors.price
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-[#E5E9F2] focus:border-[#0A65CC]'
                  "
                />
                <svg
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#656565]"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 3V21M6 7H15.5C17.9853 7 20 8.79086 20 11C20 13.2091 17.9853 15 15.5 15H6M6 11H17"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <p v-if="formErrors.price" class="mt-1 text-sm text-red-500">
                {{ formErrors.price }}
              </p>
            </div>

            <!-- Срок выполнения -->
            <div>
              <label for="deadline" class="block text-sm font-medium text-[#222222] mb-2"
                >Срок выполнения</label
              >
              <div class="relative">
                <input
                  id="deadline"
                  v-model="orderForm.deadline"
                  type="date"
                  :min="minDate"
                  class="w-full pl-9 pr-4 py-2 border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20"
                  :class="
                    formErrors.deadline
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-[#E5E9F2] focus:border-[#0A65CC]'
                  "
                />
                <Calendar
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#656565]"
                />
              </div>
              <p v-if="formErrors.deadline" class="mt-1 text-sm text-red-500">
                {{ formErrors.deadline }}
              </p>
            </div>
          </div>

          <!-- Категория -->
          <div class="mb-6">
            <label for="category" class="block text-sm font-medium text-[#222222] mb-2"
              >Категория</label
            >
            <select
              id="category"
              v-model="orderForm.category"
              class="w-full px-4 py-2 border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20 appearance-none bg-white"
              :class="
                formErrors.category
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-[#E5E9F2] focus:border-[#0A65CC]'
              "
            >
              <option value="" disabled>Выберите категорию</option>
              <option v-for="(link, index) in item.links" :key="index" :value="link">
                {{ link }}
              </option>
            </select>
            <p v-if="formErrors.category" class="mt-1 text-sm text-red-500">
              {{ formErrors.category }}
            </p>
          </div>

          <!-- Вложения -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-[#222222] mb-2">Вложения</label>
            <div class="border border-dashed border-[#E5E9F2] rounded-lg p-4 bg-[#F9F9F9]">
              <div class="flex flex-col items-center justify-center py-4">
                <Upload class="w-10 h-10 text-[#656565] mb-2" />
                <p class="text-sm text-[#656565] mb-2">
                  Перетащите файлы сюда или нажмите для выбора
                </p>
                <p class="text-xs text-[#656565] mb-4">Поддерживаются файлы до 10MB</p>
                <input type="file" multiple class="hidden" id="file-upload" @change="addFile" />
                <label
                  for="file-upload"
                  class="px-4 py-2 bg-white border border-[#E5E9F2] text-[#656565] rounded-lg text-sm hover:border-[#0A65CC] hover:text-[#0A65CC] transition-colors cursor-pointer"
                >
                  Выбрать файлы
                </label>
              </div>
            </div>

            <!-- Список загруженных файлов -->
            <div v-if="orderForm.attachments.length > 0" class="mt-4 space-y-2">
              <div
                v-for="(file, index) in orderForm.attachments"
                :key="index"
                class="flex items-center justify-between p-3 bg-white rounded-md border border-[#E5E9F2]"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 bg-[#F0F7FF] rounded-md flex items-center justify-center text-[#0A65CC]"
                  >
                    <FileText class="w-5 h-5" />
                  </div>
                  <div>
                    <p class="font-medium text-[#222222]">{{ file.name }}</p>
                    <p class="text-xs text-[#656565]">{{ file.size }}</p>
                  </div>
                </div>
                <button
                  type="button"
                  @click="removeFile(index)"
                  class="text-[#656565] hover:text-red-500"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18 6L6 18M6 6L18 18"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Кнопки действий -->
          <div class="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="flex-1 py-3 bg-[#0A65CC] text-white rounded-lg font-medium hover:bg-[#085BBA] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span
                v-if="isSubmitting"
                class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"
              ></span>
              <span>{{ isSubmitting ? 'Создание заказа...' : 'Создать заказ' }}</span>
            </button>
            <button
              type="button"
              @click="goBack"
              class="flex-1 py-3 bg-white border border-[#E5E9F2] text-[#656565] rounded-lg font-medium hover:border-[#0A65CC] hover:text-[#0A65CC] transition-colors"
            >
              Отмена
            </button>
          </div>

          <!-- Общая ошибка -->
          <div v-if="error" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p class="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle class="w-4 h-4 flex-shrink-0" />
              {{ error }}
            </p>
          </div>
        </form>
      </div>

      <!-- Если категория не найдена -->
      <div v-else class="bg-white rounded-lg shadow-sm border border-[#E5E9F2] p-12 text-center">
        <AlertCircle class="w-16 h-16 text-[#E5E9F2] mx-auto mb-4" />
        <h2 class="text-xl font-bold text-[#222222] mb-2">Категория не найдена</h2>
        <p class="text-[#656565] mb-6">Запрашиваемая категория не существует или была удалена</p>
        <button
          @click="router.push('/')"
          class="px-4 py-2 bg-[#0A65CC] text-white rounded-md hover:bg-[#085BBA] transition-colors"
        >
          Вернуться на главную
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Стилизация скроллбара */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
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

/* Анимация пульсации */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Стилизация input[type="date"] */
input[type='date'] {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

input[type='date']::-webkit-calendar-picker-indicator {
  background: transparent;
  bottom: 0;
  color: transparent;
  cursor: pointer;
  height: auto;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: auto;
}

/* Стилизация select */
select {
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23656565' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;
}
</style>
