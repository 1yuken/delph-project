<script setup>
import ArrowUpRight from '@/icons/ArrowUpRight.vue';
import ArrowDownRight from '@/icons/ArrowDownRight.vue';
import CreditCard from '@/icons/CreditCard.vue';
import CheckIcon from '@/icons/CheckIcon.vue';

defineProps({
  stats: {
    type: Object,
    required: true,
  },
  formatAmount: {
    type: Function,
    required: true,
  },
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <!-- Доходы -->
    <div class="bg-white rounded-lg border border-[#E5E9F2] p-4 shadow-sm">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-sm font-medium text-[#656565]">Всего получено</h3>
        <div class="p-2 bg-green-50 rounded-full">
          <ArrowUpRight class="w-4 h-4 text-green-500" />
        </div>
      </div>
      <p class="text-2xl font-semibold text-[#222222]">{{ formatAmount(stats.totalIncome) }}</p>
      <p class="text-xs text-[#656565] mt-1">За все время</p>
    </div>

    <!-- Расходы -->
    <div class="bg-white rounded-lg border border-[#E5E9F2] p-4 shadow-sm">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-sm font-medium text-[#656565]">Всего потрачено</h3>
        <div class="p-2 bg-red-50 rounded-full">
          <ArrowDownRight class="w-4 h-4 text-red-500" />
        </div>
      </div>
      <p class="text-2xl font-semibold text-[#222222]">{{ formatAmount(stats.totalExpenses) }}</p>
      <p class="text-xs text-[#656565] mt-1">За все время</p>
    </div>

    <!-- Доход за последний месяц -->
    <div class="bg-white rounded-lg border border-[#E5E9F2] p-4 shadow-sm">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-sm font-medium text-[#656565]">Доход за месяц</h3>
        <div class="p-2 bg-[#F0F7FF] rounded-full">
          <CreditCard class="w-4 h-4 text-[#0A65CC]" />
        </div>
      </div>
      <p class="text-2xl font-semibold text-[#222222]">{{ formatAmount(stats.lastMonthIncome) }}</p>
      <p class="text-xs text-[#656565] mt-1">За последние 30 дней</p>
    </div>

    <!-- Выполненные заказы -->
    <div class="bg-white rounded-lg border border-[#E5E9F2] p-4 shadow-sm">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-sm font-medium text-[#656565]">Выполнено заказов</h3>
        <div class="p-2 bg-[#F0F7FF] rounded-full">
          <CheckIcon class="w-4 h-4 text-[#0A65CC]" />
        </div>
      </div>
      <p class="text-2xl font-semibold text-[#222222]">{{ stats.completedOrders }}</p>
      <p class="text-xs text-[#656565] mt-1">Успешно завершенных</p>
    </div>
  </div>
</template>
