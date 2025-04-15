<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { RouterLink } from "vue-router";
import ArrowDownIcon from "@/icons/ArrowDownIcon.vue";

const isOpen = ref(false);

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const handleClickOutside = (e) => {
  if (!e.target.closest(".help-container")) isOpen.value = false;
};

onMounted(() => document.addEventListener("click", handleClickOutside));
onUnmounted(() => document.removeEventListener("click", handleClickOutside));
</script>

<template>
  <div class="relative help-container">
    <div @click.stop="toggle" class="flex items-center gap-1 cursor-pointer">
      <span class="text-[#656565] text-sm">Помощь</span>
      <ArrowDownIcon />
    </div>
    <div v-if="isOpen" class="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-[#B1B1B1] z-10">
      <RouterLink to="/how-it-works" class="block w-full px-4 py-2 text-sm hover:bg-gray-100 transition text-[#656565] hover:text-black">Как это работает</RouterLink>
      <RouterLink to="/guarantees" class="block w-full px-4 py-2 text-sm hover:bg-gray-100 transition text-[#656565] hover:text-black">Гарантии и FAQ</RouterLink>
      <RouterLink to="/rules" class="block w-full px-4 py-2 text-sm hover:bg-gray-100 transition text-[#656565] hover:text-black">Правила</RouterLink>
    </div>
  </div>
</template>
