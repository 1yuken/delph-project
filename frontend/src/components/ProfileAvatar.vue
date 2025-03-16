<script setup>
defineProps({
  fullName: String,
})
</script>

<template>
  <div>
    <div class="relative inline-block">
      <img
        class="rounded-full block"
        src="/public/avatar-full.jpg"
        width="170"
        height="170"
        alt="avatar"
      />
      <!-- <img
        class="absolute top-0 right-0 bg-[#0A65CC] p-2 rounded-full cursor-pointer transition hover:bg-[#085BBA]"
        src="/public/edit-small.png"
        alt="edit avatar button"
      /> -->
    </div>
    <h1 class="text-3xl font-bold text-[#222222] mt-4">{{ fullName }}</h1>
    <div class="mt-2">
      <p class="text-[#656565] text-sm mb-1">Дата регистрации</p>
      <p class="text-sm">23 февраля 2020, 0:04</p>
      <p class="text-sm">5 лет назад</p>
    </div>
  </div>
</template>
