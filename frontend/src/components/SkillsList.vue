<script setup>
defineProps({
  skills: Array,
})
</script>

<template>
  <div>
    <h2 class="text-xl font-bold text-[#222222] mt-4">Навыки</h2>
    <ul class="flex flex-wrap gap-2 mt-2">
      <li
        v-for="skill in skills"
        :key="skill.name"
        class="text-sm border border-[#C9C9C9] px-3 py-1 rounded-full"
      >
        {{ skill.name }}
      </li>
    </ul>
  </div>
</template>
