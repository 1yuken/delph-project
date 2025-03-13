import { ref } from 'vue';

export const useItemsStore = () => {
  const items = ref([]);
  const searchQuery = ref('');

  const searchItems = (query) => {
    searchQuery.value = query;
  };

  return {
    items,
    searchItems,
  };
};