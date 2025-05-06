<script setup>
defineProps({
  modelValue: {
    type: String,
    default: 'all',
  },
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div>
    <label for="filter" class="sr-only">Фильтр операций</label>
    <div class="relative">
      <select
        id="filter"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="px-3 py-2 pr-8 border border-[#E5E9F2] rounded-md text-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0A65CC] focus:border-[#0A65CC] appearance-none bg-white"
      >
        <option value="all">Все операции</option>
        <option value="completed">Завершённые</option>
        <option value="pending">В процессе</option>
        <option value="canceled">Отменённые</option>
        <option value="deposits">Пополнения</option>
        <option value="withdrawals">Выводы</option>
        <option value="orders">Заказы</option>
      </select>
      <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L5 5L9 1" stroke="#656565" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
  </div>
</template>