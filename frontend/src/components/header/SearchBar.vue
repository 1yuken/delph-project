<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import SearchIcon from "@/icons/SearchIcon.vue";
import axios from "axios";

const searchQuery = ref("");
const searchResults = ref([]);
const isDropdownVisible = ref(false);
const searchContainer = ref(null);
const router = useRouter();

onMounted(() => {
  fetchItems();
  document.addEventListener("click", handleOutsideClick);
});

const fetchItems = async () => {
  try {
    const { data } = await axios.get("https://51ee8a820928c63e.mokky.dev/items");
    searchResults.value = data;
  } catch (error) {
    console.error("Ошибка поиска:", error);
  }
};

const filteredItems = computed(() => {
  if (!searchQuery.value) return [];
  return searchResults.value.filter(item =>
    item.title?.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

watch(searchQuery, (value) => {
  isDropdownVisible.value = value.trim() !== "";
});

const goToItemPage = (id) => {
  router.push(`/item/${id}`);
  searchQuery.value = "";
  isDropdownVisible.value = false;
};

const handleOutsideClick = (e) => {
  if (searchContainer.value && !searchContainer.value.contains(e.target)) {
    isDropdownVisible.value = false;
  }
};
</script>

<template>
  <div class="relative" ref="searchContainer">
    <input
      v-model="searchQuery"
      class="border rounded-lg px-3 py-2 max-w-[200px] w-full border-[#B1B1B1] border-opacity-50 outline-none text-sm pr-10 focus:border-[#0A65CC]"
      type="text"
      placeholder="Поиск"
    />
    <SearchIcon class="absolute right-3 top-1/2 -translate-y-1/2" />
    <div v-if="isDropdownVisible && filteredItems.length" class="absolute top-full left-0 mt-1 w-full bg-white shadow-md rounded z-10">
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
</template>
