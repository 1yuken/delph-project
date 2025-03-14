<script setup>
defineProps({
  operations: {
    type: Array,
    required: true,
  },
  formatAmount: {
    type: Function,
    required: true,
  },
})
defineEmits(['select'])
</script>

<template>
  <div class="overflow-x-auto">
    <table class="min-w-full border border-gray-200 divide-y divide-gray-200 text-sm">
      <thead class="bg-[#F9F9F9]">
        <tr>
          <th scope="col" class="px-4 py-2 text-left font-semibold text-gray-700">Дата</th>
          <th scope="col" class="px-4 py-2 text-left font-semibold text-gray-700">Описание</th>
          <th scope="col" class="px-4 py-2 text-left font-semibold text-gray-700">Статус</th>
          <th scope="col" class="px-4 py-2 text-left font-semibold text-gray-700">Сумма</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr
          v-for="operation in operations"
          :key="operation.id"
          class="hover:bg-gray-50 cursor-pointer"
          @click="$emit('select', operation)"
        >
          <td class="px-4 py-2 text-gray-700 whitespace-nowrap">
            {{ operation.date }}
          </td>
          <td class="px-4 py-2 text-gray-700">
            {{ operation.description }}
          </td>
          <td
            class="px-4 py-2 font-medium"
            :class="{
              'text-green-600': operation.status === 'Завершено',
              'text-blue-600': operation.status === 'В процессе',
              'text-red-600': operation.status === 'Отменено',
            }"
          >
            {{ operation.status }}
          </td>
          <td
            class="px-4 py-2 font-medium"
            :class="operation.amount >= 0 ? 'text-green-600' : 'text-red-600'"
          >
            {{ formatAmount(operation.amount) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
