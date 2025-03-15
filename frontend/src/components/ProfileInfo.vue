<script setup>
defineProps({
  description: String,
})
</script>

<template>
  <div>
    <h2 class="text-xl font-bold text-[#222222]">Обо мне</h2>
    <p class="max-w-[600px] w-full mt-2 description">{{ description }}</p>
  </div>
</template>
