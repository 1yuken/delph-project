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
  <div class="py-3 px-4 border border-[#D6DDEB] max-w-[260px] w-full">
    <div class="flex items-center gap-2 mb-2">
      <img :src="imageUrl" alt="#" />
      <a
        @click.prevent="goToItemPage"
        class="font-bold hover:text-[#0A65CC] hover:underline cursor-pointer"
      >
        {{ title }}
      </a>
    </div>
    <p class="text-xs">
      <template v-for="(item, index) in links" :key="index">
        <a href="#" class="transition hover:text-[#0A65CC] hover:underline">{{ item }}</a>
        <span v-if="index !== links.length - 1"> · </span>
      </template>
    </p>
    <div class="flex items-center gap-1 mt-2 cursor-pointer group">
      <a class="text-xs text-[#656565] transition group-hover:text-black" @click.prevent="goToItemPage">Смотреть все</a>
      <ArrowRightIcon class="transition group-hover:text-black" />
    </div>
  </div>
</template>

<style scoped></style>
