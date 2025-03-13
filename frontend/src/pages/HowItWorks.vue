<script setup>
import { ref } from 'vue'

const customers = ref([
  { id: 1, text: 'Регистрация – создайте аккаунт, указав email и пароль или войдя через соцсети.' },
  { id: 2, text: 'Размещение заказа – опишите задачу, укажите бюджет и сроки.' },
  { id: 3, text: 'Выбор исполнителя – просматривайте отклики, изучайте профили и отзывы.' },
  { id: 4, text: 'Обсуждение деталей – общайтесь с фрилансерами в чате, уточняйте нюансы.' },
  {
    id: 5,
    text: 'Оплата – вносите оплату через безопасную систему, средства хранятся на платформе до завершения работы.',
  },
  { id: 6, text: 'Получение результата – проверяйте выполненный заказ, оставляйте отзыв.' },
])

const freelancers = ref([
  { id: 1, text: 'Регистрация и заполнение профиля – укажите свои навыки, загрузите портфолио.' },
  { id: 2, text: 'Отклики на проекты – находите заказы в своей категории и подавайте заявки.' },
  { id: 3, text: 'Обсуждение заказа – обсуждайте детали работы с заказчиком.' },
  { id: 4, text: 'Выполнение работы – выполняйте задачу в срок и загружайте результат.' },
  {
    id: 5,
    text: 'Получение оплаты – после подтверждения заказчиком деньги зачисляются на ваш баланс.',
  },
  { id: 6, text: 'Отзывы и рейтинг – чем выше рейтинг, тем больше заказов вы сможете получить!' },
])
</script>

<template>
  <div class="relative flex items-center w-3/5 m-auto py-5 gap-4">
    <div class="flex flex-col gap-4">
      <h2 class="text-[#656565]">Как это работает</h2>
      <div class="flex flex-col gap-2">
        <p class="text-xl">Для заказчиков:</p>
        <ul class="flex gap-1" v-for="customer in customers" :key="customer.id">
          {{
            customer.id
          }}.
          <li>{{ customer.text }}</li>
        </ul>
      </div>
      <div class="flex flex-col gap-2">
        <p class="text-xl">Для фрилансеров:</p>
        <ul class="flex gap-1" v-for="freelancer in freelancers" :key="freelancer.id">
          {{
            freelancer.id
          }}.
          <li>{{ freelancer.text }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
