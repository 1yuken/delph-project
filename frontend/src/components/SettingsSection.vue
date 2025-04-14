<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="mt-8 border-t border-[#C9C9C9] w-full pt-4 flex max-sm:flex-col max-sm:gap-4">
    <h3 class="font-bold max-w-44 w-full max-sm:w-auto">{{ title }}</h3>
    <slot />
  </div>
</template>

<style scoped></style>
