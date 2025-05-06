<script setup>
defineProps({
  skills: Array,
})

// Функция для определения цвета навыка в зависимости от уровня
function getSkillColor(level) {
  switch(level) {
    case 'expert':
      return 'bg-[#F0F7FF] text-[#0A65CC] border-[#0A65CC]'
    case 'intermediate':
      return 'bg-[#F0F7FF] text-[#0A65CC] border-[#E5E9F2]'
    case 'beginner':
      return 'bg-white text-[#656565] border-[#E5E9F2]'
    default:
      return 'bg-white text-[#656565] border-[#E5E9F2]'
  }
}
</script>

<template>
  <div>
    <h2 class="text-xl font-bold text-[#222222] mb-4">Навыки</h2>
    <ul class="flex flex-wrap gap-2">
      <li
        v-for="skill in skills"
        :key="skill.name"
        class="text-sm px-3 py-1.5 rounded-md border transition-colors duration-200 hover:border-[#0A65CC]"
        :class="getSkillColor(skill.level)"
      >
        {{ skill.name }}
      </li>
    </ul>
  </div>
</template>