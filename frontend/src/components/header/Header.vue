<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted, onUnmounted, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

import Logo from "./Logo.vue";
import SearchBar from "./SearchBar.vue";
import HelpMenu from "./HelpMenu.vue";
import AvatarMenu from "./AvatarMenu.vue";
import MobileMenu from "./MobileMenu.vue";

const authStore = useAuthStore();
const isUserAuthenticated = ref(authStore.isAuthenticated);
// const router = useRouter();

const isMobileMenuOpen = ref(false);
watchEffect(() => {
  isUserAuthenticated.value = authStore.isAuthenticated;
});

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  document.body.style.overflow = isMobileMenuOpen.value ? "hidden" : "";
};

onMounted(() => {
  authStore.checkAuth();
});

onUnmounted(() => {
  document.body.style.overflow = "";
});
</script>

<template>
  <!-- Мобильный -->
  <div class="flex md:hidden justify-between items-center px-4 py-3 border-b border-gray-200 bg-white z-40 relative">
    <Logo />
    <button @click="toggleMobileMenu" class="z-50 relative">
      <div class="w-8 h-8 flex items-center justify-center">
        <span class="burger-icon" :class="{ open: isMobileMenuOpen }"></span>
      </div>
    </button>
  </div>
  <MobileMenu :is-open="isMobileMenuOpen" @close="toggleMobileMenu" />

  <!-- Десктопный -->
  <div class="relative hidden md:flex items-center justify-between w-3/5 m-auto py-3 max-xl:w-4/5 max-lg:w-5/5 max-lg:px-4">
    <div class="flex items-center gap-7">
      <Logo />
      <SearchBar />
      <HelpMenu />
      <RouterLink class="text-[#656565] transition hover:text-black text-sm" to="/specialists">Специалисты</RouterLink>
    </div>
    <AvatarMenu v-if="isUserAuthenticated" />
    <div v-else class="flex items-center gap-7">
      <RouterLink class="text-[#656565] transition hover:text-black text-sm" to="/login">Войти</RouterLink>
      <RouterLink class="text-[#656565] transition hover:text-black text-sm" to="/register">Зарегистрироваться</RouterLink>
    </div>
  </div>
</template>
