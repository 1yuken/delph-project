<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import Pencil from '@/icons/Pencil.vue'
import Check from '@/icons/Check.vue'
import X from '@/icons/X.vue'

const props = defineProps({
  description: String,
  isEditable: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:description'])

const isExpanded = ref(false)
const isEditing = ref(false)
const editedDescription = ref('')
const isLoading = ref(false)
const maxLength = 300

const shouldTruncate = computed(() => {
  return props.description?.length > maxLength
})

const truncatedDescription = computed(() => {
  if (!shouldTruncate.value || isExpanded.value) {
    return props.description
  }
  return props.description?.substring(0, maxLength) + '...'
})

const startEditing = () => {
  editedDescription.value = props.description || ''
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
  editedDescription.value = props.description || ''
}

const saveDescription = async () => {
  if (!editedDescription.value.trim()) {
    editedDescription.value = 'Нет описания'
  }

  try {
    isLoading.value = true
    const response = await axios.patch(
      'http://localhost:3000/users',
      {
        bio: editedDescription.value,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    )
    if (response.data) {
      emit('update:description', editedDescription.value)
      isEditing.value = false
    }
  } catch (error) {
    console.error('Error updating description:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-xl font-bold text-[#222222]">Обо мне</h2>
      <button
        v-if="isEditable && !isEditing"
        @click="startEditing"
        class="flex items-center gap-1 text-[#0A65CC] hover:text-[#085BBA] transition-colors cursor-pointer"
      >
        <Pencil class="w-4 h-4" />
        <span class="text-sm">Редактировать</span>
      </button>
    </div>

    <div class="bg-[#F9F9F9] rounded-lg p-4 border border-[#E5E9F2]">
      <div v-if="isEditing">
        <textarea
          v-model="editedDescription"
          class="w-full h-32 p-2 border border-[#E5E9F2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20 focus:border-[#0A65CC]"
          :disabled="isLoading"
          placeholder="Расскажите о себе..."
        ></textarea>
        <div class="flex justify-end gap-2 mt-2">
          <button
            @click="cancelEditing"
            class="px-4 py-2 text-sm text-[#656565] hover:text-[#222222] transition-colors flex items-center gap-1 cursor-pointer"
            :disabled="isLoading"
          >
            <X class="w-4 h-4" />
            <span>Отмена</span>
          </button>
          <button
            @click="saveDescription"
            class="px-4 py-2 text-sm text-white bg-[#0A65CC] hover:bg-[#085BBA] transition-colors rounded-md flex items-center gap-1 cursor-pointer"
            :disabled="isLoading"
          >
            <Check class="w-4 h-4" />
            <span>Сохранить</span>
          </button>
        </div>
      </div>
      <template v-else>
        <p v-if="description" class="text-[#222222] whitespace-pre-line">
          {{ truncatedDescription }}
        </p>
        <p v-else class="text-[#656565]">Нет описания</p>
        <button
          v-if="shouldTruncate"
          @click="isExpanded = !isExpanded"
          class="mt-2 text-[#0A65CC] text-sm font-medium cursor-pointer hover:underline focus:outline-none"
        >
          {{ isExpanded ? 'Свернуть' : 'Читать полностью' }}
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped>
textarea {
  resize: none;
  font-family: inherit;
  font-size: 0.875rem;
  line-height: 1.5;
}

textarea::placeholder {
  color: #a0a0a0;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
