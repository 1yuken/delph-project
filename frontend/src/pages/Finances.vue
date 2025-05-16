<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, computed, onMounted } from 'vue'
import OperationsFilter from '../components/OperationsFilter.vue'
import OperationsTable from '../components/OperationsTable.vue'
import OperationModal from '../components/OperationModal.vue'
import FinancialSummary from '../components/FinancialSummary.vue'

import SearchIcon2 from '@/icons/SearchIcon2.vue'
import Download from '@/icons/Download.vue'
import ArrowUpRight from '@/icons/ArrowUpRight.vue'

const countFinances = ref(79.92)
const selectedFilter = ref('all')
const selectedOperation = ref(null)
const searchQuery = ref('')
const sortBy = ref('date')
const sortDirection = ref('desc')
const isLoading = ref(true)

const operations = ref([
  {
    id: 1,
    date: '2025-05-08T00:21:00',
    formattedDate: '8 мая 2024, 0:21',
    description: 'Заказ #XZU21Y3SR',
    status: 'Завершено',
    amount: 22.0,
    currency: '₽',
    details: 'Подробная информация о заказе XZU21Y3SR...',
    type: 'order',
  },
  {
    id: 2,
    date: '2025-05-09T16:22:00',
    formattedDate: '9 мая 2025, 16:22',
    description: 'Пополнение баланса #B799WUJ',
    status: 'В процессе',
    amount: 57.92,
    currency: '₽',
    details: 'Подробнее о пополнении #B799WUJ...',
    type: 'deposit',
  },
  {
    id: 3,
    date: '2025-05-10T12:00:00',
    formattedDate: '10 мая 2024, 12:40',
    description: 'Заказ #XT3LMVU',
    status: 'Отменено',
    amount: -15.0,
    currency: '₽',
    details: 'Подробнее о заказе XT3LMVU...',
    type: 'order',
  },
  {
    id: 4,
    date: '2025-05-07T09:30:00',
    formattedDate: '7 мая 2024, 09:30',
    description: 'Вывод средств #WD78912',
    status: 'Завершено',
    amount: -150.0,
    currency: '₽',
    details: 'Вывод средств на карту **** 4589',
    type: 'withdrawal',
  },
])

// Имитация загрузки данных
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 800)
})

// Фильтрация операций
const filteredOperations = computed(() => {
  let result = operations.value

  // Фильтрация по статусу
  if (selectedFilter.value !== 'all') {
    switch (selectedFilter.value) {
      case 'completed':
        result = result.filter((op) => op.status === 'Завершено')
        break
      case 'pending':
        result = result.filter((op) => op.status === 'В процессе')
        break
      case 'canceled':
        result = result.filter((op) => op.status === 'Отменено')
        break
      case 'deposits':
        result = result.filter((op) => op.type === 'deposit')
        break
      case 'withdrawals':
        result = result.filter((op) => op.type === 'withdrawal')
        break
      case 'orders':
        result = result.filter((op) => op.type === 'order')
        break
    }
  }

  // Поиск по описанию
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (op) =>
        op.description.toLowerCase().includes(query) || op.details.toLowerCase().includes(query),
    )
  }

  return result
})

// Сортировка операций
const sortedOperations = computed(() => {
  const operations = [...filteredOperations.value]

  return operations.sort((a, b) => {
    let comparison = 0

    if (sortBy.value === 'date') {
      comparison = new Date(a.date) - new Date(b.date)
    } else if (sortBy.value === 'amount') {
      comparison = a.amount - b.amount
    } else if (sortBy.value === 'status') {
      comparison = a.status.localeCompare(b.status)
    } else if (sortBy.value === 'description') {
      comparison = a.description.localeCompare(b.description)
    }

    return sortDirection.value === 'asc' ? comparison : -comparison
  })
})

// Форматирование суммы
function formatAmount(amount) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 2,
  }).format(amount)
}

// Форматирование даты с относительным временем
function formatRelativeDate(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  let relativeTime = ''
  if (diffDays < 30) {
    relativeTime = `(${diffDays} дн. назад)`
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    relativeTime = `(${months} мес. назад)`
  } else {
    const years = Math.floor(diffDays / 365)
    relativeTime = `(${years} г. назад)`
  }

  return `${date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}, ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} ${relativeTime}`
}

// Форматированный баланс
const formattedFinances = computed(() => formatAmount(countFinances.value))

// Статистика по операциям
const financialStats = computed(() => {
  const income = operations.value
    .filter((op) => op.amount > 0)
    .reduce((sum, op) => sum + op.amount, 0)

  const expenses = operations.value
    .filter((op) => op.amount < 0)
    .reduce((sum, op) => sum + op.amount, 0)

  const lastMonthOperations = operations.value.filter((op) => {
    const opDate = new Date(op.date)
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
    return opDate >= oneMonthAgo
  })

  const lastMonthIncome = lastMonthOperations
    .filter((op) => op.amount > 0)
    .reduce((sum, op) => sum + op.amount, 0)

  return {
    totalIncome: income,
    totalExpenses: Math.abs(expenses),
    lastMonthIncome,
    completedOrders: operations.value.filter(
      (op) => op.type === 'order' && op.status === 'Завершено',
    ).length,
  }
})

// Переключение сортировки
function toggleSort(column) {
  if (sortBy.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortDirection.value = 'desc'
  }
}

// Экспорт операций в CSV
function exportOperations() {
  const headers = ['Дата', 'Описание', 'Статус', 'Сумма']
  const csvContent = [
    headers.join(','),
    ...sortedOperations.value.map((op) =>
      [op.formattedDate, `"${op.description}"`, op.status, op.amount].join(','),
    ),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', 'operations.csv')
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<template>
  <div class="relative flex flex-col w-3/5 mx-auto py-6 max-xl:w-4/5 max-lg:w-full max-lg:px-6">
    <div class="w-full">
      <div class="flex justify-between items-start mb-6 flex-wrap gap-4">
        <h1 class="text-3xl font-bold text-[#222222] max-sm:text-2xl">
          Финансы
          <span class="text-2xl font-semibold text-[#0A65CC]">{{ formattedFinances }}</span>
        </h1>
        <div class="flex gap-3">
          <button
            type="button"
            class="flex items-center gap-1.5 px-4 py-2 text-sm rounded-md border border-[#E5E9F2] hover:border-[#0A65CC] transition-colors cursor-pointer"
            @click="exportOperations"
          >
            <Download class="w-4 h-4" />
            Экспорт
          </button>
          <button
            type="button"
            class="flex items-center gap-1.5 bg-[#0A65CC] text-sm text-white px-4 py-2 rounded-md cursor-pointer hover:bg-[#085BBA] transition-colors"
          >
            <ArrowUpRight class="w-4 h-4" />
            Вывести деньги
          </button>
        </div>
      </div>

      <!-- Финансовая сводка -->
      <FinancialSummary :stats="financialStats" :formatAmount="formatAmount" />

      <div class="flex flex-wrap justify-between items-center gap-4 my-6">
        <div class="flex items-center gap-3 flex-wrap">
          <OperationsFilter v-model="selectedFilter" />

          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Поиск по операциям"
              class="pl-9 pr-4 py-2 border border-[#E5E9F2] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#0A65CC] focus:border-[#0A65CC] w-64 max-sm:w-full"
            />
            <SearchIcon2
              class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#656565]"
            />
          </div>
        </div>
      </div>

      <!-- Состояние загрузки -->
      <div v-if="isLoading" class="py-8">
        <div class="animate-pulse space-y-4">
          <div class="h-10 bg-slate-200 rounded w-full"></div>
          <div class="h-10 bg-slate-200 rounded w-full"></div>
          <div class="h-10 bg-slate-200 rounded w-full"></div>
          <div class="h-10 bg-slate-200 rounded w-full"></div>
        </div>
      </div>

      <!-- Если операций нет, отображаем сообщение -->
      <div
        v-else-if="sortedOperations.length === 0"
        class="text-center py-10 bg-[#F9F9F9] rounded-lg border border-[#E5E9F2]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-12 w-12 mx-auto mb-3 text-[#656565]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
        <p class="text-[#656565] mb-2">У вас пока нет операций</p>
        <p class="text-sm text-[#656565]">
          Попробуйте изменить параметры фильтрации или выполнить операцию
        </p>
      </div>

      <!-- Иначе, отображаем таблицу операций -->
      <OperationsTable
        v-else
        :operations="sortedOperations"
        :formatAmount="formatAmount"
        :formatRelativeDate="formatRelativeDate"
        :sortBy="sortBy"
        :sortDirection="sortDirection"
        @select="selectedOperation = $event"
        @sort="toggleSort"
      />
    </div>

    <OperationModal
      v-if="selectedOperation"
      :operation="selectedOperation"
      :formatAmount="formatAmount"
      :formatRelativeDate="formatRelativeDate"
      @close="selectedOperation = null"
    />
  </div>
</template>
