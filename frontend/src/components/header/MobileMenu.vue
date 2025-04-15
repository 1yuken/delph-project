<script setup>
import { RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
defineProps({ isOpen: Boolean });
const emit = defineEmits(["close"]);
const authStore = useAuthStore();
</script>

<template>
  <div
    class="fixed inset-0 bg-white z-30 transform transition-transform duration-300 ease-in-out md:hidden"
    :class="isOpen ? 'translate-x-0' : 'translate-x-full'"
  >
    <div class="pt-16 px-4 h-full overflow-y-auto">
      <div class="space-y-4">
        <RouterLink @click="emit('close')" to="/">Главная</RouterLink>
        <RouterLink @click="emit('close')" to="/specialists">Специалисты</RouterLink>
        <RouterLink @click="emit('close')" to="/how-it-works">Как это работает</RouterLink>
        <RouterLink @click="emit('close')" to="/guarantees">Гарантии и FAQ</RouterLink>
        <RouterLink @click="emit('close')" to="/rules">Правила</RouterLink>
        <div class="pt-4 border-t border-gray-100">
          <template v-if="authStore.isAuthenticated">
            <RouterLink @click="emit('close')" to="/messages">Сообщения</RouterLink>
            <RouterLink @click="emit('close')" to="/finances">Финансы</RouterLink>
            <RouterLink @click="emit('close')" to="/profile">Профиль</RouterLink>
            <RouterLink @click="emit('close')" to="/settings">Настройки</RouterLink>
            <button @click="authStore.logout(); emit('close')">Выйти</button>
          </template>
          <template v-else>
            <RouterLink @click="emit('close')" to="/login">Войти</RouterLink>
            <RouterLink @click="emit('close')" to="/register">Зарегистрироваться</RouterLink>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
