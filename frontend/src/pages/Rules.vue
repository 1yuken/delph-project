<!-- eslint-disable vue/multi-word-component-names -->
<script setup>

</script>

<template>
  <div class="relative flex items-center w-3/5 m-auto py-5 gap-4">
    <div class="flex flex-col gap-4">
      <h2 class="text-[#656565]">Правила платформы</h2>
      <div class="flex flex-col gap-2">
        <p class="text-xl">Основные принципы работы:</p>
        <ul class="flex flex-col gap-2 pl-4">
          <li>Платформа создана для честного и прозрачного сотрудничества.</li>
          <li>Все пользователи обязаны соблюдать законы и правила сервиса.</li>
          <li>Взаимодействие ведется только через платформу.</li>
        </ul>
      </div>
      <div class="flex flex-col gap-2">
        <p class="text-xl">Обязанности пользователей:</p>
        <ul class="flex flex-col gap-2 pl-4">
          <li>Заказчики обязаны своевременно оплачивать выполненную работу.</li>
          <li>Фрилансеры должны выполнять заказы качественно и в срок.</li>
          <li>Оба участника обязаны соблюдать условия договора и деловую этику.</li>
        </ul>
      </div>
      <div class="flex flex-col gap-2">
        <p class="text-xl">Запрещенные действия:</p>
        <ul class="flex flex-col gap-2 pl-4">
          <li>Обман и мошенничество (фальшивые заказы, ложные отзывы).</li>
          <li>Обход системы (предложение оплаты вне платформы).</li>
          <li>Размещение нелегального контента.</li>
          <li>Оскорбления, спам и вредоносные действия.</li>
        </ul>
      </div>
      <p class="font-bold">За нарушение правил аккаунт может быть заблокирован без возможности восстановления.</p>
    </div>
  </div>
</template>

<style scoped>
li {
    list-style-type: disc;
}
</style>
