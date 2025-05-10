<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref } from 'vue'
import { Pencil, Check, X } from 'lucide-vue-next'
import axios from 'axios'

const props = defineProps({
  skills: {
    type: Array,
    default: () => [],
  },
  isEditable: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:skills'])

const isEditing = ref(false)
const editedSkills = ref('')
const isLoading = ref(false)

const startEditing = () => {
  editedSkills.value = props.skills.join(', ')
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
  editedSkills.value = ''
}

const saveSkills = async () => {
  try {
    isLoading.value = true
    // Разбиваем строку на массив навыков, удаляем лишние пробелы и пустые значения
    const skillsArray = editedSkills.value
      .split(',')
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0)

    const response = await axios.patch(
      'http://localhost:3000/users/skills',
      { skillsString: editedSkills.value },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    )

    if (response.data) {
      emit('update:skills', skillsArray)
      isEditing.value = false
    }
  } catch (error) {
    console.error('Error saving skills:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-[#222222]">Навыки</h3>
      <button
        v-if="isEditable && !isEditing"
        @click="startEditing"
        class="flex items-center gap-1 px-3 py-1.5 text-sm text-[#0A65CC] hover:text-[#085BBA] transition-colors duration-200 cursor-pointer"
      >
        <Pencil class="w-4 h-4" />
        Редактировать
      </button>
    </div>

    <div v-if="isEditing" class="space-y-4">
      <textarea
        v-model="editedSkills"
        placeholder="Введите навыки через запятую"
        class="w-full p-3 border border-[#E5E9F2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20 focus:border-[#0A65CC]"
        rows="3"
      ></textarea>
      <div class="flex justify-end gap-2">
        <button
          @click="cancelEditing"
          class="px-4 py-2 text-sm text-[#656565] hover:text-[#222222] transition-colors duration-200 cursor-pointer"
        >
          <X class="w-4 h-4" />
        </button>
        <button
          @click="saveSkills"
          :disabled="isLoading"
          class="px-4 py-2 text-sm text-white bg-[#0A65CC] hover:bg-[#085BBA] transition-colors duration-200 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Check class="w-4 h-4" />
        </button>
      </div>
    </div>

    <div v-else class="flex flex-wrap gap-2">
      <span
        v-for="skill in skills"
        :key="skill"
        class="px-3 py-1.5 bg-[#F0F7FF] text-[#0A65CC] text-sm rounded-full transition-colors hover:bg-[#E1EFFF]"
      >
        {{ skill }}
      </span>
      <span v-if="skills.length === 0" class="text-[#656565] text-sm"> Нет указанных навыков </span>
    </div>
  </div>
</template>