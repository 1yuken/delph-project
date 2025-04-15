<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import ArrowDownIcon from "@/icons/ArrowDownIcon.vue";

const isOpen = ref(false);
const authStore = useAuthStore();
const router = useRouter();

const toggle = () => isOpen.value = !isOpen.value;

const logout = () => {
  authStore.logout();
  isOpen.value = false;
  router.push("/");
};

const handleClickOutside = (e) => {
  if (!e.target.closest(".avatar-container")) isOpen.value = false;
};

onMounted(() => document.addEventListener("click", handleClickOutside));
onUnmounted(() => document.removeEventListener("click", handleClickOutside));
</script>

<template>
  <div class="relative avatar-container">
    <div @click.stop="toggle" class="flex items-center gap-1 cursor-pointer">
      <img class="rounded-full" src="/avatar-full.jpg" width="40" height="40" alt="avatar" />
      <ArrowDownIcon />
    </div>
    <div v-if="isOpen" class="absolute top-full right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-[#B1B1B1] z-10">
      <RouterLink to="/profile" class="block px-4 py-2 text-sm hover:bg-gray-100 transition text-[#656565] hover:text-black">Профиль</RouterLink>
      <RouterLink to="/settings" class="block px-4 py-2 text-sm hover:bg-gray-100 transition text-[#656565] hover:text-black">Настройки</RouterLink>
      <button @click="logout" class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition text-[#656565] hover:text-black">Выйти</button>
    </div>
  </div>
</template>
