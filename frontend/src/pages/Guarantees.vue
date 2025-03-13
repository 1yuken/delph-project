<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref } from 'vue'

const guarantees = ref([
  {
    text: 'Безопасные сделки – деньги резервируются на платформе и переводятся исполнителю только после успешного выполнения заказа.',
  },
  {
    text: 'Рейтинг и отзывы – изучайте рейтинги и отзывы, чтобы выбирать надежных исполнителей и заказчиков.',
  },
  { text: 'Модерация – мы проверяем пользователей и блокируем мошенников.' },
  {
    text: 'Конфиденциальность – все личные данные защищены, а переписка ведется внутри платформы.',
  },
  {
    text: 'Разрешение споров – в случае конфликта наша служба поддержки поможет найти решение.',
  },
])
</script>

<template>
  <div class="relative flex items-center w-3/5 m-auto py-5 gap-4">
    <div class="flex flex-col gap-4">
      <h2 class="text-[#656565]">Гарантии и безопасность</h2>
      <div class="flex flex-col gap-2 pl-4">
        <ul class="flex gap-1" v-for="guarantee in guarantees" :key="guarantee.id">
          <li class="list-disc">{{ guarantee.text }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
