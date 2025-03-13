<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref } from 'vue'

const countMessages = ref(2)
</script>

<template>
  <div class="bg-[#F9F9F9] p-4">
    <div class="relative flex items-center w-3/5 m-auto gap-4 bg-white border border-[#C9C9C9] p-2">
      <div class="flex flex-col border-r border-[#C9C9C9] pr-2">
        <div class="flex items-center gap-1">
          <h1 class="text-3xl font-bold text-[#222222]">Сообщения</h1>
          <p class="text-xs text-white bg-[#0A65CC] rounded-full pt-1 px-2 pb-0.5 mt-1">
            {{ countMessages }}
          </p>
        </div>
        <div>Вот тут список всех чатов</div>
      </div>
      <div>Вот тут сам чат</div>
    </div>
  </div>
</template>

<style scoped></style>
