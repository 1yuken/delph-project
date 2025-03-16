<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, computed } from 'vue'
import OperationsFilter from '../components/OperationsFilter.vue'
import OperationsTable from '../components/OperationsTable.vue'
import OperationModal from '../components/OperationModal.vue'

const countFinances = ref(1234)

const selectedFilter = ref('all')
const selectedOperation = ref(null)

const operations = ref([
  {
    id: 1,
    date: '25 января 2024, 0:21 (1 месяц назад)',
    description: 'Заказ #XZU21Y3SR',
    status: 'Завершено',
    amount: 22.0,
    currency: '₽',
    details: 'Подробная информация о заказе XZU21Y3SR...',
  },
  {
    id: 2,
    date: '15 января 2024, 1:05 (2 месяца назад)',
    description: 'Пополнение баланса #3E65828',
    status: 'Завершено',
    amount: 220.0,
    currency: '₽',
    details: 'Подробнее о пополнении #3E65828...',
  },
  {
    id: 3,
    date: '27 октября 2023, 00:17 (4 месяца назад)',
    description: 'Пополнение баланса #MK9ZDTE',
    status: 'Завершено',
    amount: 540.59,
    currency: '₽',
    details: 'Подробнее о пополнении #MK9ZDTE...',
  },
  {
    id: 4,
    date: '10 сентября 2023, 16:22 (5 месяцев назад)',
    description: 'Пополнение баланса #B799WUJ',
    status: 'В процессе',
    amount: 57.92,
    currency: '₽',
    details: 'Подробнее о пополнении #B799WUJ...',
  },
  {
    id: 5,
    date: '1 марта 2024, 16:01 (6 месяцев назад)',
    description: 'Заказ #RB85FHLK',
    status: 'Завершено',
    amount: 78.52,
    currency: '₽',
    details: 'Подробнее о заказе RB85FHLK...',
  },
  {
    id: 6,
    date: '10 марта 2024, 12:00 (8 месяцев назад)',
    description: 'Заказ #XT3LMVU',
    status: 'Отменено',
    amount: -15.0,
    currency: '₽',
    details: 'Подробнее о заказе XT3LMVU...',
  },
])

const filteredOperations = computed(() => {
  switch (selectedFilter.value) {
    case 'completed':
      return operations.value.filter((op) => op.status === 'Завершено')
    case 'pending':
      return operations.value.filter((op) => op.status === 'В процессе')
    case 'canceled':
      return operations.value.filter((op) => op.status === 'Отменено')
    default:
      return operations.value
  }
})

function formatAmount(amount) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 2,
  }).format(amount)
}

const formattedFinances = computed(() => formatAmount(countFinances.value))
</script>

<template>
  <div class="relative flex flex-col items-center w-3/5 mx-auto py-5 gap-4">
    <div class="w-full">
      <h1 class="text-3xl font-bold text-[#222222]">
        Финансы
        <span class="text-2xl"> • {{ formattedFinances }}</span>
      </h1>
      <div class="flex flex-wrap justify-between items-center gap-4 my-4">
        <OperationsFilter v-model="selectedFilter" />
        <button
          type="button"
          class="bg-blue-600 text-sm text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Вывести деньги
        </button>
      </div>

      <!-- Если операций нет, отображаем сообщение -->
      <div v-if="filteredOperations.length === 0" class="text-center py-10 text-gray-500">
        <p>У вас пока нет операций :(</p>
      </div>
      <!-- Иначе, отображаем таблицу операций -->
      <OperationsTable
        v-else
        :operations="filteredOperations"
        :formatAmount="formatAmount"
        @select="selectedOperation = $event"
      />
    </div>

    <OperationModal
      v-if="selectedOperation"
      :operation="selectedOperation"
      :formatAmount="formatAmount"
      @close="selectedOperation = null"
    />
  </div>
</template>

<style scoped></style>
