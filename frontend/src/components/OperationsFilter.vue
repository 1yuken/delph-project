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
      <select
        id="filter"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="px-3 py-2 border border-gray-300 rounded-md text-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="all">Все операции</option>
        <option value="completed">Только завершённые</option>
        <option value="pending">Только в процессе</option>
        <option value="canceled">Только отменённые</option>
      </select>
    </div>
  </template>