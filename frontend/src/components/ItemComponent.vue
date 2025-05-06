<script setup>
import ArrowRightIcon from '@/icons/ArrowRightIcon.vue'
import { useRouter } from 'vue-router';

const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  links: {
    type: Array,
    required: true
  }
});

const router = useRouter();

const goToItemPage = () => {
  if (!props.id) {
    console.error('Ошибка: ID отсутствует');
    return;
  }
  router.push(`/item/${props.id}`);
};
</script>

<template>
  <div class="py-3 px-4 border border-[#D6DDEB] max-w-[260px] w-full rounded shadow-sm hover:shadow transition-shadow duration-200">
    <div class="flex items-center gap-2 mb-2">
      <div class="flex items-center justify-center overflow-hidden">
        <img :src="imageUrl" alt="#" class="w-full h-full object-cover" />
      </div>
      <a
        @click.prevent="goToItemPage"
        class="font-bold hover:text-[#0A65CC] hover:underline cursor-pointer transition-colors duration-200"
      >
        {{ title }}
      </a>
    </div>
    <p class="text-xs text-[#656565]">
      <template v-for="(item, index) in links" :key="index">
        <a href="#" class="transition-colors duration-200 hover:text-[#0A65CC] hover:underline">{{ item }}</a>
        <span v-if="index !== links.length - 1" class="text-[#D6DDEB] mx-1">·</span>
      </template>
    </p>
    <div class="flex items-center gap-1 mt-2 cursor-pointer group">
      <a class="text-xs text-[#656565] transition-colors duration-200 group-hover:text-[#0A65CC]" @click.prevent="goToItemPage">Смотреть все</a>
      <ArrowRightIcon class="text-[#656565] transition-colors duration-200 group-hover:text-[#0A65CC]" />
    </div>
  </div>
</template>