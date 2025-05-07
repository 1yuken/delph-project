<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
// import { X, CreditCard, ShoppingCart, ArrowUpRight, ArrowDownRight, DollarSign, Calendar, FileText, AlertCircle } from 'lucide-vue-next'
import X from '@/icons/X.vue'
import CreditCard from '@/icons/CreditCard.vue'
import ShoppingCart from '@/icons/ShoppingCart.vue'
import ArrowDownRight from '@/icons/ArrowDownRight.vue'
import DollarSign from '@/icons/DollarSign.vue'
import AlertCircle from '@/icons/AlertCircle.vue'
import FileText from '@/icons/FileText.vue'
import CalendarIcon from '@/icons/CalendarIcon.vue'

defineProps({
  operation: {
    type: Object,
    required: true,
  },
  formatAmount: {
    type: Function,
    required: true,
  },
  formatRelativeDate: {
    type: Function,
    required: true,
  }
})

const emit = defineEmits(['close'])
const modalRef = ref(null)

function closeModal() {
  emit('close')
}

function onEsc(event) {
  if (event.key === 'Escape') {
    closeModal()
  }
}

// Получение иконки для типа операции
function getOperationIcon(type) {
  switch (type) {
    case 'deposit':
      return CreditCard
    case 'order':
      return ShoppingCart
    case 'withdrawal':
      return ArrowDownRight
    case 'fee':
      return DollarSign
    default:
      return AlertCircle
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

onMounted(() => {
  document.addEventListener('keydown', onEsc)
  document.body.classList.add('overflow-hidden')
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onEsc)
  document.body.classList.remove('overflow-hidden')
})
</script>

<template>
  <div 
    class="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm" 
    @click="closeModal"
  >
    <div 
      ref="modalRef"
      class="bg-white w-11/12 max-w-md rounded-lg shadow-lg p-0 relative animate-modalFade" 
      @click.stop
    >
      <div class="flex justify-between items-center p-4 border-b border-[#E5E9F2]">
        <h2 class="text-lg font-semibold text-[#222222]">Подробности операции</h2>
        <button
          class="text-[#656565] cursor-pointer hover:text-[#222222] transition-colors p-1"
          @click="closeModal"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="p-5">
        <div class="flex items-center gap-3 mb-4">
          <div 
            class="p-2 rounded-full" 
            :class="getOperationIconBg(operation.type)"
          >
            <component 
              :is="getOperationIcon(operation.type)" 
              class="w-5 h-5" 
              :class="getOperationIconColor(operation.type)" 
            />
          </div>
          <div>
            <h3 class="font-medium text-[#222222]">{{ operation.description }}</h3>
            <p class="text-xs text-[#656565] flex items-center gap-1">
              <CalendarIcon class="w-3 h-3" />
              {{ formatRelativeDate(operation.date) }}
            </p>
          </div>
        </div>

        <div class="space-y-3 text-sm">
          <div class="flex justify-between items-center p-3 bg-[#F9F9F9] rounded-md">
            <span class="text-[#656565]">Статус</span>
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
          </div>
          
          <div class="flex justify-between items-center p-3 bg-[#F9F9F9] rounded-md">
            <span class="text-[#656565]">Сумма</span>
            <span
              class="font-medium"
              :class="operation.amount >= 0 ? 'text-green-600' : 'text-red-600'"
            >
              {{ formatAmount(operation.amount) }}
            </span>
          </div>
          
          <div class="p-3 bg-[#F9F9F9] rounded-md">
            <div class="flex items-center gap-1 mb-1 text-[#656565]">
              <FileText class="w-4 h-4" />
              <span>Дополнительная информация</span>
            </div>
            <p class="text-[#222222]">{{ operation.details }}</p>
          </div>
        </div>
      </div>
      
      <div class="border-t border-[#E5E9F2] p-4 flex justify-end">
        <button
          class="px-4 py-2 text-sm rounded-md bg-[#0A65CC] text-white cursor-pointer hover:bg-[#085BBA] transition-colors"
          @click="closeModal"
        >
          Закрыть
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-modalFade {
  animation: modalFade 0.3s ease-out;
}

@keyframes modalFade {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>