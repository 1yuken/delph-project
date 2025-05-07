<script setup>
import CreditCard from '@/icons/CreditCard.vue';
import ShoppingCart from '@/icons/ShoppingCart.vue';
import ArrowDownRight from '@/icons/ArrowDownRight.vue';
import DollarSign from '@/icons/DollarSign.vue';

defineProps({
  operations: {
    type: Array,
    required: true,
  },
  formatAmount: {
    type: Function,
    required: true,
  },
  formatRelativeDate: {
    type: Function,
    required: true,
  },
  sortBy: {
    type: String,
    default: 'date'
  },
  sortDirection: {
    type: String,
    default: 'desc'
  }
})

defineEmits(['select', 'sort'])

// Получение иконки для типа операции
function getOperationIcon(type) {
  switch (type) {
    case 'deposit':
      return CreditCard
    case 'order':
      return ShoppingCart
    case 'withdrawal':
      return ArrowDownRight
    default:
      return DollarSign
  }
}

// Получение цвета для типа операции
function getOperationIconColor(type) {
  switch (type) {
    case 'deposit':
      return 'text-green-500'
    case 'order':
      return 'text-[#0A65CC]'
    case 'withdrawal':
      return 'text-red-500'
    case 'fee':
      return 'text-orange-500'
    default:
      return 'text-gray-500'
  }
}

// Получение цвета фона для типа операции
function getOperationIconBg(type) {
  switch (type) {
    case 'deposit':
      return 'bg-green-50'
    case 'order':
      return 'bg-[#F0F7FF]'
    case 'withdrawal':
      return 'bg-red-50'
    case 'fee':
      return 'bg-orange-50'
    default:
      return 'bg-gray-50'
  }
}
</script>

<template>
  <div class="overflow-x-auto rounded-lg border border-[#E5E9F2] shadow-sm">
    <table class="min-w-full divide-y divide-[#E5E9F2] text-sm">
      <thead class="bg-[#F9F9F9]">
        <tr>
          <th scope="col" class="px-4 py-3 text-left font-medium text-[#656565]">
            <button 
              class="flex items-center gap-1 focus:outline-none" 
              @click="$emit('sort', 'date')"
            >
              Дата
              <span v-if="sortBy === 'date'" class="text-[#0A65CC]">
                {{ sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
            </button>
          </th>
          <th scope="col" class="px-4 py-3 text-left font-medium text-[#656565]">
            <button 
              class="flex items-center gap-1 focus:outline-none" 
              @click="$emit('sort', 'description')"
            >
              Описание
              <span v-if="sortBy === 'description'" class="text-[#0A65CC]">
                {{ sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
            </button>
          </th>
          <th scope="col" class="px-4 py-3 text-left font-medium text-[#656565]">
            <button 
              class="flex items-center gap-1 focus:outline-none" 
              @click="$emit('sort', 'status')"
            >
              Статус
              <span v-if="sortBy === 'status'" class="text-[#0A65CC]">
                {{ sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
            </button>
          </th>
          <th scope="col" class="px-4 py-3 text-left font-medium text-[#656565]">
            <button 
              class="flex items-center gap-1 focus:outline-none" 
              @click="$emit('sort', 'amount')"
            >
              Сумма
              <span v-if="sortBy === 'amount'" class="text-[#0A65CC]">
                {{ sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
            </button>
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-[#E5E9F2] bg-white">
        <tr
          v-for="operation in operations"
          :key="operation.id"
          class="hover:bg-[#F9F9F9] cursor-pointer transition-colors"
          @click="$emit('select', operation)"
        >
          <td class="px-4 py-3 text-[#656565] whitespace-nowrap">
            {{ formatRelativeDate(operation.date) }}
          </td>
          <td class="px-4 py-3 text-[#222222]">
            <div class="flex items-center gap-3">
              <div 
                class="p-1.5 rounded-full" 
                :class="getOperationIconBg(operation.type)"
              >
                <component 
                  :is="getOperationIcon(operation.type)" 
                  class="w-4 h-4" 
                  :class="getOperationIconColor(operation.type)" 
                />
              </div>
              {{ operation.description }}
            </div>
          </td>
          <td class="px-4 py-3 font-medium">
            <span
              class="px-2 py-1 rounded-full text-xs font-medium"
              :class="{
                'bg-green-100 text-green-800': operation.status === 'Завершено',
                'bg-blue-100 text-blue-800': operation.status === 'В процессе',
                'bg-red-100 text-red-800': operation.status === 'Отменено',
              }"
            >
              {{ operation.status }}
            </span>
          </td>
          <td
            class="px-4 py-3 font-medium whitespace-nowrap"
            :class="operation.amount >= 0 ? 'text-green-600' : 'text-red-600'"
          >
            {{ formatAmount(operation.amount) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>