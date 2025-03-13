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
const isUserAuthenticated = ref(authStore.isAuthenticated);
const currentUsername = ref(authStore.username);
const router = useRouter();

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

const closeMenus = (event) => {
  if (!event.target.closest(".help-container")) isHelpOpen.value = false;
  if (!event.target.closest(".avatar-container")) isAvatarMenuOpen.value = false;
};

const logout = () => {
  authStore.logout();
  isAvatarMenuOpen.value = false;
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
  <div class="relative flex items-center justify-between w-3/5 m-auto py-3">
    <div class="flex items-center gap-7">
      <RouterLink to="/">
        <h1 class="font-semibold text-3xl text-[#0A65CC]">
          Delph<span class="text-[#CCC1D2]">.</span>
        </h1>
      </RouterLink>

      <!-- Блок поиска -->
      <div class="relative" ref="searchContainer">
        <input
          v-model="searchQuery"
          class="border rounded-lg px-3 py-2 max-w-[200px] w-full border-[#B1B1B1] border-opacity-50 outline-none text-sm pr-10 focus:border-[#0A65CC]"
          type="text"
          placeholder="Поиск"
        />
        <SearchIcon class="absolute right-3 top-1/2 -translate-y-1/2" />

        <!-- Блок с результатами поиска -->
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

      <div class="relative help-container">
        <div @click.stop="toggleHelp" class="flex items-center gap-1 cursor-pointer">
          <span class="text-[#656565] text-sm">Помощь</span>
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
            Гарантии
          </RouterLink>
          <RouterLink to='/rules' class="block w-full text-sm text-left px-4 py-2 text-[#656565] hover:bg-gray-100 hover:rounded-b-lg transition hover:text-black cursor-pointer">
            Правила
          </RouterLink>
        </div>
      </div>
      <RouterLink class="text-[#656565] transition hover:text-black text-sm" to="/specialists">Специалисты</RouterLink>
    </div>
    
    <!-- Авторизованный пользователь -->
    <div v-if="isUserAuthenticated" class="flex items-center gap-7">
      <RouterLink class="text-[#656565] transition hover:text-black text-sm" to="/messages">
        Сообщения
      </RouterLink>
      <RouterLink class="text-[#656565] transition hover:text-black text-sm" to="/finances">
        Финансы
      </RouterLink>
      <div class="relative avatar-container">
        <div @click.stop="toggleAvatarMenu" class="flex items-center gap-1 cursor-pointer">
          <a href="#">
            <img class="rounded-full" src="/avatar-full.jpg" width="40px" height="40px" alt="#" />
          </a>
          <ArrowDownIcon />
        </div>
        <div
          v-if="isAvatarMenuOpen"
          class="absolute top-full right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-[#B1B1B1] z-5"
        >
          <RouterLink class="block w-full text-sm text-left px-4 py-2 text-[#656565] hover:bg-gray-100 hover:rounded-t-lg transition hover:text-black cursor-pointer" to="/profile">
            Профиль
          </RouterLink>
          <RouterLink class="block w-full text-sm text-left px-4 py-2 text-[#656565] hover:bg-gray-100 transition hover:text-black cursor-pointer" to="/settings">
            Настройки
          </RouterLink>
          <button @click="logout" class="block w-full text-sm text-left px-4 py-2 text-[#656565] hover:bg-gray-100 hover:rounded-b-lg transition hover:text-black cursor-pointer">
            Выйти
          </button>
        </div>
      </div>
    </div>

    <!-- Неавторизованный пользователь -->
    <div v-else class="flex items-center gap-7">
      <RouterLink class="text-[#656565] transition hover:text-black text-sm" to="/login">
        Войти
      </RouterLink>
      <RouterLink class="text-[#656565] transition hover:text-black text-sm" to="/register">
        Зарегистрироваться
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.relative > div.absolute {
  max-height: 300px;
  overflow-y: auto;
}
</style>
