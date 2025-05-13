<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="profile">
      <PortfolioGallery
        :projects="projects"
        @update:projects="projects = $event"
        :is-editable="isOwnProfile"
        :user-id="profile.id"
      />
    </div>
    <div v-else class="text-center py-8">
      <p class="text-gray-500">Загрузка профиля...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import PortfolioGallery from './PortfolioGallery.vue'
import { api } from '@/services/api'

const route = useRoute()
const authStore = useAuthStore()
const profile = ref(null)
const projects = ref([])

const isOwnProfile = computed(() => {
  return profile.value?.id === authStore.user?.id
})

const loadProfile = async () => {
  try {
    const profileId = route.params.id || authStore.user?.id
    if (!profileId) {
      console.error('No profile ID available')
      return
    }

    console.log('Loading profile for ID:', profileId)
    const response = await api.get(`/users/${profileId}`)
    profile.value = response.data
    console.log('Profile loaded:', profile.value)
  } catch (error) {
    console.error('Error loading profile:', error)
  }
}

onMounted(() => {
  loadProfile()
})

watch(
  () => route.params.id,
  () => {
    loadProfile()
  },
)
</script>
