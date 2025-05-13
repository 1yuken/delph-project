<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted } from 'vue'
import Pencil from '@/icons/Pencil.vue'
import X from '@/icons/X.vue'
import Plus from '@/icons/Plus.vue'
import Trash from '@/icons/Trash.vue'
import { portfoliosApi } from '@/services/api'

const props = defineProps({
  projects: {
    type: Array,
    default: () => [],
  },
  isEditable: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:projects'])

const isEditing = ref(false)
const isLoading = ref(false)
const showModal = ref(false)
const selectedProject = ref(null)

const newProject = ref({
  title: '',
  image: null,
})

const startEditing = () => {
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
  newProject.value = {
    title: '',
    image: null,
  }
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    newProject.value.image = file
  }
}

const formatImagePath = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  // Убираем ведущий слэш, если есть, чтобы не было двойного слэша
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `http://localhost:3000/${cleanPath}`
}

const addProject = async () => {
  if (!newProject.value.title || !newProject.value.image) return

  try {
    isLoading.value = true

    const portfolioData = {
      description: newProject.value.title,
      image: newProject.value.image,
    }

    const response = await portfoliosApi.create(portfolioData)
    console.log('Create portfolio response:', response)

    // Update the projects list
    const updatedProjects = [
      ...props.projects,
      {
        id: response.id,
        description: response.description,
        imageUrl: formatImagePath(response.imagePath),
        views: 0,
      },
    ]

    emit('update:projects', updatedProjects)

    // Reset form
    newProject.value = {
      title: '',
      image: null,
    }
    isEditing.value = false
  } catch (error) {
    console.error('Error adding project:', error)
  } finally {
    isLoading.value = false
  }
}

const deleteProject = async (projectId) => {
  try {
    isLoading.value = true
    await portfoliosApi.delete(projectId)

    // Update the projects list
    const updatedProjects = props.projects.filter((p) => p.id !== projectId)
    emit('update:projects', updatedProjects)
  } catch (error) {
    console.error('Error deleting project:', error)
  } finally {
    isLoading.value = false
  }
}

const openModal = (project) => {
  selectedProject.value = project
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedProject.value = null
}

// Load projects when component is mounted
onMounted(async () => {
  try {
    console.log('Loading portfolios for user ID:', props.userId)
    const response = await portfoliosApi.getByUserId(props.userId)
    console.log('Get portfolios response:', response)

    if (!response || !Array.isArray(response)) {
      console.error('Invalid response format:', response)
      return
    }

    const formattedProjects = response.map((project) => {
      console.log('Processing project:', project)
      return {
        id: project.id,
        description: project.description,
        imageUrl: formatImagePath(project.imagePath),
        views: 0,
      }
    })
    console.log('Formatted projects:', formattedProjects)
    emit('update:projects', formattedProjects)
  } catch (error) {
    console.error('Error loading projects:', error)
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    })
  }
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-xl font-bold text-[#222222]">Портфолио</h2>
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
      <div v-if="isEditing" class="bg-white rounded-lg p-4 border border-[#E5E9F2] mb-4 shadow-sm">
        <h3 class="text-lg font-semibold text-[#222222] mb-3">Добавить новый проект</h3>
        <div class="space-y-3">
          <div>
            <label for="project-title" class="block text-sm text-[#656565] mb-1"
              >Название проекта</label
            >
            <input
              id="project-title"
              v-model="newProject.title"
              type="text"
              placeholder="Название проекта"
              class="w-full p-2 border border-[#E5E9F2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20 focus:border-[#0A65CC]"
              :disabled="isLoading"
            />
          </div>
          <div>
            <label for="project-image" class="block text-sm text-[#656565] mb-1"
              >Изображение проекта</label
            >
            <input
              id="project-image"
              type="file"
              accept="image/*"
              @change="handleImageUpload"
              class="w-full cursor-pointer"
              :disabled="isLoading"
            />
          </div>
          <div class="flex justify-between pt-2">
            <button
              @click="cancelEditing"
              class="px-4 py-2 text-sm text-[#656565] hover:text-[#222222] transition-colors cursor-pointer flex items-center gap-1"
              :disabled="isLoading"
            >
              <X class="w-4 h-4" />
              <span>Отмена</span>
            </button>
            <button
              @click="addProject"
              class="px-4 py-2 bg-[#0A65CC] text-white rounded-lg hover:bg-[#085BBA] transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="isLoading || !newProject.title || !newProject.image"
            >
              <Plus class="w-4 h-4" />
              Добавить проект
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div
          v-for="project in projects"
          :key="project.id"
          class="relative group cursor-pointer overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
          @click="openModal(project)"
        >
          <img
            :src="project.imageUrl"
            :alt="project.description"
            class="w-full h-48 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
            @error="console.error('Image load error:', project.imageUrl)"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-end justify-center"
          >
            <div class="text-white text-center p-4 w-full">
              <h3 class="font-medium mb-1 text-lg">{{ project.description }}</h3>
              <p class="text-sm text-gray-300">{{ project.views || 0 }} просмотров</p>
              <button
                v-if="isEditable"
                @click.stop="deleteProject(project.id)"
                class="mt-2 text-red-400 hover:text-red-300 transition-colors cursor-pointer p-1 rounded-full bg-black/30 hover:bg-black/50"
              >
                <Trash class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <div
          v-if="projects.length === 0"
          class="col-span-full text-center py-10 bg-white rounded-lg border border-dashed border-[#E5E9F2]"
        >
          <div class="flex flex-col items-center justify-center text-[#656565]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-12 w-12 mb-3 text-[#0A65CC]/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p class="text-[#222222] font-medium mb-1">Нет добавленных проектов</p>
            <p class="text-sm">Добавьте свои работы в портфолио</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно для просмотра изображения -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      @click="closeModal"
    >
      <div
        class="relative max-w-4xl w-full bg-white rounded-lg overflow-hidden shadow-2xl"
        @click.stop
      >
        <button
          @click="closeModal"
          class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer bg-white rounded-full p-1 shadow-md z-10"
        >
          <X class="w-5 h-5" />
        </button>
        <div class="relative">
          <img
            :src="selectedProject?.imageUrl"
            :alt="selectedProject?.description"
            class="w-full max-h-[70vh] object-contain"
            @error="console.error('Modal image load error:', selectedProject?.imageUrl)"
          />
        </div>
        <div class="p-4 bg-white">
          <h3 class="text-xl font-medium text-[#222222]">{{ selectedProject?.description }}</h3>
          <p class="text-sm text-[#656565] mt-1">{{ selectedProject?.views || 0 }} просмотров</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
