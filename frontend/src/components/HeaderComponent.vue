<script setup>
import { ref, computed, onMounted, onUnmounted, watch, watchEffect } from "vue";
import { useRouter, RouterLink } from "vue-router";
import ArrowDownIcon from "@/icons/ArrowDownIcon.vue";
import SearchIcon from "@/icons/SearchIcon.vue";
import { useAuthStore } from "@/stores/authStore";
import axios from "axios";

const authStore = useAuthStore();
const isHelpOpen = ref(false);
const isAvatarMenuOpen = ref(false);
const isMobileMenuOpen = ref(false);
const router = useRouter();

// Initialize refs with values from authStore
const isUserAuthenticated = ref(authStore.isAuthenticated);
const currentUsername = ref(authStore.username);

watchEffect(() => {
  isUserAuthenticated.value = authStore.isAuthenticated;
  currentUsername.value = authStore.username;
});

const toggleHelp = () => {
  if (isAvatarMenuOpen.value) isAvatarMenuOpen.value = false;
  isHelpOpen.value = !isHelpOpen.value;
};

const toggleAvatarMenu = () => {
  if (isHelpOpen.value) isHelpOpen.value = false;
  isAvatarMenuOpen.value = !isAvatarMenuOpen.value;
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  // Prevent scrolling when menu is open
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

const closeMenus = (event) => {
  if (!event.target.closest(".help-container")) isHelpOpen.value = false;
  if (!event.target.closest(".avatar-container")) isAvatarMenuOpen.value = false;
};

const logout = () => {
  authStore.logout();
  isAvatarMenuOpen.value = false;
  isMobileMenuOpen.value = false;
  router.push("/");
};

onMounted(() => {
  document.addEventListener("click", closeMenus);
  authStore.checkAuth();
  fetchItemsForSearch();
  document.addEventListener("click", handleOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener("click", closeMenus);
  document.removeEventListener("click", handleOutsideClick);
  // Reset overflow when component is unmounted
  document.body.style.overflow = '';
});

// Поиск
const searchQuery = ref("");
const searchResults = ref([]);
const isDropdownVisible = ref(false);
const searchContainer = ref(null);

const fetchItemsForSearch = async () => {
  try {
    const { data } = await axios.get("https://51ee8a820928c63e.mokky.dev/items");
    searchResults.value = data;
  } catch (error) {
    console.error("Ошибка загрузки данных для поиска:", error);
  }
};

watch(searchQuery, (newValue) => {
  isDropdownVisible.value = newValue.trim() !== "";
});

const filteredItems = computed(() => {
  if (!searchQuery.value) return [];
  return searchResults.value.filter(item =>
    item.title?.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const goToItemPage = (id) => {
  router.push(`/item/${id}`);
  isDropdownVisible.value = false;
  searchQuery.value = "";
};

const handleOutsideClick = (event) => {
  if (searchContainer.value && !searchContainer.value.contains(event.target)) {
    isDropdownVisible.value = false;
  }
};

router.afterEach(() => {
  isDropdownVisible.value = false;
  searchQuery.value = "";
});
</script>

<template>
  <!-- Мобильный хедер -->
  <div class="flex md:hidden justify-between items-center px-4 py-3 border-b border-gray-200 bg-white z-40 relative">
    <RouterLink to="/">
      <h1 class="font-semibold text-2xl text-[#0A65CC]">
        Delph<span class="text-[#CCC1D2]">.</span>
      </h1>
    </RouterLink>
    <button @click="toggleMobileMenu" class="z-50 relative ">
      <div class="w-8 h-8 flex items-center justify-center">
        <span class="burger-icon" :class="{ 'open': isMobileMenuOpen }"></span>
      </div>
    </button>
  </div>

  <!-- Мобильное меню -->
  <div 
    class="mobile-menu fixed inset-0 bg-white z-30 transform transition-transform duration-300 ease-in-out md:hidden"
    :class="isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'"
  >
    <div class="pt-16 px-4 h-full overflow-y-auto">
      <div class="space-y-4">
        <RouterLink @click="toggleMobileMenu" to="/" class="block text-lg text-[#0A65CC] font-semibold">Главная</RouterLink>
        <RouterLink @click="toggleMobileMenu" to="/specialists" class="block text-lg text-[#656565]">Специалисты</RouterLink>
        <RouterLink @click="toggleMobileMenu" to="/how-it-works" class="block text-lg text-[#656565]">Как это работает</RouterLink>
        <RouterLink @click="toggleMobileMenu" to="/guarantees" class="block text-lg text-[#656565]">Гарантии и FAQ</RouterLink>
        <RouterLink @click="toggleMobileMenu" to="/rules" class="block text-lg text-[#656565]">Правила</RouterLink>
        
        <div v-if="isUserAuthenticated" class="space-y-4 pt-4 border-t border-gray-100">
          <RouterLink @click="toggleMobileMenu" to="/messages" class="block text-lg text-[#656565]">Сообщения</RouterLink>
          <RouterLink @click="toggleMobileMenu" to="/finances" class="block text-lg text-[#656565]">Финансы</RouterLink>
          <RouterLink @click="toggleMobileMenu" to="/profile" class="block text-lg text-[#656565]">Профиль</RouterLink>
          <RouterLink @click="toggleMobileMenu" to="/settings" class="block text-lg text-[#656565]">Настройки</RouterLink>
          <button @click="logout" class="block text-left w-full text-lg text-[#656565]">Выйти</button>
        </div>
        <div v-else class="space-y-4 pt-4 border-t border-gray-100">
          <RouterLink @click="toggleMobileMenu" to="/login" class="block text-lg text-[#656565]">Войти</RouterLink>
          <RouterLink @click="toggleMobileMenu" to="/register" class="block text-lg text-[#656565]">Зарегистрироваться</RouterLink>
        </div>
      </div>
    </div>
  </div>

  <!-- Десктопный хедер -->
  <div class="relative hidden md:flex items-center justify-between w-3/5 m-auto py-3 max-xl:w-4/5 max-lg:w-5/5 max-lg:px-4">
    <div class="flex items-center gap-7">
      <RouterLink to="/">
        <h1 class="font-semibold text-3xl text-[#0A65CC]">
          Delph<span class="text-[#CCC1D2]">.</span>
        </h1>
      </RouterLink>

      <!-- Поиск -->
      <div class="relative" ref="searchContainer">
        <input
          v-model="searchQuery"
          class="border rounded-lg px-3 py-2 max-w-[200px] w-full border-[#B1B1B1] border-opacity-50 outline-none text-sm pr-10 focus:border-[#0A65CC]"
          type="text"
          placeholder="Поиск"
        />
        <SearchIcon class="absolute right-3 top-1/2 -translate-y-1/2" />

        <!-- Результаты поиска -->
        <div 
          v-if="isDropdownVisible && filteredItems.length" 
          class="absolute top-full left-0 mt-1 w-full bg-white shadow-md rounded z-10"
        >
          <ul>
            <li 
              v-for="item in filteredItems" 
              :key="item.id" 
              class="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              @click.stop="goToItemPage(item.id)"
            >
              {{ item.title }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Помощь -->
      <div class="relative help-container">
        <div @click.stop="toggleHelp" class="flex items-center gap-1 cursor-pointer">
          <span class="text-[#656565] text-sm max-md:none">Помощь</span>
          <ArrowDownIcon />
        </div>
        <div
          v-if="isHelpOpen"
          class="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-[#B1B1B1] z-5"
        >
          <RouterLink to="/how-it-works" class="block w-full text-sm text-left px-4 py-2 text-[#656565] hover:bg-gray-100 hover:rounded-t-lg transition hover:text-black cursor-pointer">
            Как это работает
          </RouterLink>
          <RouterLink to='/guarantees' class="block w-full text-sm text-left px-4 py-2 text-[#656565] hover:bg-gray-100 transition hover:text-black cursor-pointer">
            Гарантии и FAQ
          </RouterLink>
          <RouterLink to='/rules' class="block w-full text-sm text-left px-4 py-2 text-[#656565] hover:bg-gray-100 hover:rounded-b-lg transition hover:text-black cursor-pointer">
            Правила
          </RouterLink>
        </div>
      </div>
      <RouterLink class="text-[#656565] transition hover:text-black text-sm" to="/specialists">Специалисты</RouterLink>
    </div>
    
    <!-- Авторизованный -->
    <div v-if="isUserAuthenticated" class="flex items-center gap-7">
      <RouterLink class="text-[#656565] transition hover:text-black text-sm" to="/messages">Сообщения</RouterLink>
      <RouterLink class="text-[#656565] transition hover:text-black text-sm" to="/finances">Финансы</RouterLink>
      <div class="relative avatar-container">
        <div @click.stop="toggleAvatarMenu" class="flex items-center gap-1 cursor-pointer">
          <a href="#"><img class="rounded-full" src="/avatar-full.jpg" width="40px" height="40px" alt="avatar" /></a>
          <ArrowDownIcon />
        </div>
        <div v-if="isAvatarMenuOpen" class="absolute top-full right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-[#B1B1B1] z-5">
          <RouterLink class="block w-full text-sm text-left px-4 py-2 text-[#656565] hover:bg-gray-100 hover:rounded-t-lg transition hover:text-black cursor-pointer" to="/profile">Профиль</RouterLink>
          <RouterLink class="block w-full text-sm text-left px-4 py-2 text-[#656565] hover:bg-gray-100 transition hover:text-black cursor-pointer" to="/settings">Настройки</RouterLink>
          <button @click="logout" class="block w-full text-sm text-left px-4 py-2 text-[#656565] hover:bg-gray-100 hover:rounded-b-lg transition hover:text-black cursor-pointer">Выйти</button>
        </div>
      </div>
    </div>

    <!-- Неавторизованный -->
    <div v-else class="flex items-center gap-7">
      <RouterLink class="text-[#656565] transition hover:text-black text-sm" to="/login">Войти</RouterLink>
      <RouterLink class="text-[#656565] transition hover:text-black text-sm" to="/register">Зарегистрироваться</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.relative > div.absolute {
  max-height: 300px;
  overflow-y: auto;
}

/* Анимация для мобильного меню */
.mobile-menu {
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

/* Стили для иконки бургер-меню */
.burger-icon {
  position: relative;
  width: 24px;
  height: 2px;
  background-color: #0A65CC;
  transition: all 0.3s ease-in-out;
}

.burger-icon::before,
.burger-icon::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 2px;
  background-color: #0A65CC;
  transition: all 0.3s ease-in-out;
}

.burger-icon::before {
  transform: translateY(-8px);
}

.burger-icon::after {
  transform: translateY(8px);
}

/* Анимация иконки бургер-меню */
.burger-icon.open {
  background-color: transparent;
}

.burger-icon.open::before {
  transform: rotate(45deg);
}

.burger-icon.open::after {
  transform: rotate(-45deg);
}

/* Анимация для ссылок в мобильном меню */
.mobile-menu a, 
.mobile-menu button {
  transition: color 0.2s ease;
}

.mobile-menu a:active, 
.mobile-menu button:active {
  transform: scale(0.98);
}
</style>