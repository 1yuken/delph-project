<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <button
    :disabled="disabled"
    class="px-4 py-2 text-sm rounded-md font-semibold"
    :class="
      disabled
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
        : 'bg-[#f5f5f5] text-[#222222] hover:bg-[#ebebeb] cursor-pointer'
    "
  >
    {{ label }}
  </button>
</template>

<style scoped></style>
