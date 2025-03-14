<script setup>
import { onMounted, onBeforeUnmount } from 'vue'

defineProps({
  operation: {
    type: Object,
    required: true,
  },
  formatAmount: {
    type: Function,
    required: true,
  },
})
const emit = defineEmits(['close'])

function closeModal() {
  emit('close')
}

function onEsc(event) {
  if (event.key === 'Escape') {
    closeModal()
  }
}

onMounted(() => {
  document.addEventListener('keydown', onEsc)
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onEsc)
})
</script>

<template>
  <div class="fixed inset-0 flex items-center justify-center z-50 bg-black/50" @click="closeModal">
    <div class="bg-white w-11/12 max-w-md rounded-lg shadow-lg p-6 relative" @click.stop>
      <button
        class="absolute top-2 right-2 text-gray-400 cursor-pointer hover:text-gray-600"
        @click="closeModal"
      >
        <span class="sr-only">Закрыть</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <h2 class="text-xl font-semibold mb-4">Подробности операции</h2>
      <div class="space-y-2 text-sm text-gray-700">
        <p><strong>Дата:</strong> {{ operation.date }}</p>
        <p><strong>Описание:</strong> {{ operation.description }}</p>
        <p>
          <strong>Статус: </strong>
          <span
            :class="{
              'text-green-600': operation.status === 'Завершено',
              'text-blue-600': operation.status === 'В процессе',
              'text-red-600': operation.status === 'Отменено',
            }"
          >
            {{ operation.status }}
          </span>
        </p>
        <p>
          <strong>Сумма: </strong>
          <span :class="operation.amount >= 0 ? 'text-green-600' : 'text-red-600'">
            {{ formatAmount(operation.amount) }}
          </span>
        </p>
        <p><strong>Дополнительно:</strong> {{ operation.details }}</p>
      </div>
      <div class="mt-6 flex justify-end">
        <button
          class="px-4 py-2 text-sm rounded-md bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
          @click="closeModal"
        >
          Закрыть
        </button>
      </div>
    </div>
  </div>
</template>
