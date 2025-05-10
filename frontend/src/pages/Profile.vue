<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import ProfileAvatar from '@/components/ProfileAvatar.vue'
import ProfileInfo from '@/components/ProfileInfo.vue'
import SkillsList from '@/components/SkillsList.vue'
import PortfolioGallery from '@/components/PortfolioGallery.vue'
import ReviewList from '@/components/ReviewList.vue'
import MessageSquare from '@/icons/MessageSquare.vue'
import CheckIcon from '@/icons/CheckIcon.vue'
import Award from '@/icons/Award.vue'
import { useAuthStore } from '@/stores/authStore'
import axios from 'axios'
import { useRoute } from 'vue-router'

const route = useRoute()
const authStore = useAuthStore()
const fullName = ref('')
const username = ref('')
const isOnline = ref(true)
const lastActive = ref('Онлайн')
const registrationDate = ref(null)
const description = ref('')
const skills = ref([])
const projects = ref([])
const reviews = ref([])
const isOwnProfile = ref(false)
const avatarUrl = ref(null)
const isLoading = ref(true)

// Загрузка данных профиля
const loadProfileData = async () => {
  try {
    isLoading.value = true
    const userId = route.params.id || authStore.userId.value
    const response = await axios.get(`http://localhost:3000/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    console.log('Profile data loaded:', response.data)
    console.log('Current user ID:', authStore.userId.value)
    console.log('Profile ID:', userId)
    console.log('Current avatar URL:', authStore.avatarUrl.value)
    console.log('Avatar URL type:', typeof response.data.avatarUrl)
    console.log('Avatar URL value:', response.data.avatarUrl)

    if (response.data) {
      // Обновляем данные пользователя
      fullName.value = response.data.name || response.data.username || 'Пользователь'
      username.value = `@${response.data.username || 'user'}`
      registrationDate.value = response.data.registrationDate

      // Проверяем, является ли это профилем текущего пользователя
      const currentUserId = Number(authStore.userId.value)
      const profileId = Number(userId)
      isOwnProfile.value = profileId === currentUserId
      console.log(
        'Is own profile:',
        isOwnProfile.value,
        'Profile ID:',
        profileId,
        'User ID:',
        currentUserId,
      )

      // Обновляем аватар
      avatarUrl.value = response.data.avatarUrl || '/avatar-default.jpg'
      // Обновляем аватар в store только если это профиль текущего пользователя
      if (isOwnProfile.value) {
        authStore.updateAvatar(response.data.avatarUrl || '/avatar-default.jpg')
      }

      // Обновляем описание
      description.value = response.data.bio || 'Нет описания'

      // Обновляем статистику
      if (response.data.stats) {
        stats.value = {
          ordersCompleted: response.data.stats.ordersCompleted || 0,
          reviewsReceived: response.data.stats.reviewsReceived || 0,
          successRate: response.data.stats.successRate || 0,
          rating: response.data.stats.rating || 0,
        }
      }

      // Обновляем навыки
      if (response.data.skills) {
        skills.value = response.data.skills
      }

      // Обновляем проекты
      if (response.data.projects) {
        projects.value = response.data.projects
      }

      // Обновляем отзывы
      if (response.data.reviews) {
        reviews.value = response.data.reviews
      }
    }
  } catch (err) {
    console.error('Error loading profile data:', err)
  } finally {
    isLoading.value = false
  }
}

// Добавляем watch для отслеживания изменений аватара
watch(
  () => authStore.avatarUrl.value,
  (newAvatarUrl) => {
    console.log('Avatar URL changed in profile:', newAvatarUrl)
  },
  { immediate: true },
)

// Добавляем watch для отслеживания изменений isOwnProfile
watch(
  () => isOwnProfile.value,
  (newValue) => {
    console.log('isOwnProfile changed:', newValue)
  },
)

onMounted(() => {
  loadProfileData()
})

// Статистика пользователя
const stats = ref({
  ordersCompleted: 0,
  reviewsReceived: 0,
  successRate: 0,
  rating: 0,
})

// Средний рейтинг
const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0
  const sum = reviews.value.reduce((acc, review) => acc + review.rating, 0)
  return (sum / reviews.value.length).toFixed(1)
})

// Фильтр отзывов
const reviewFilter = ref('all')
const filteredReviews = computed(() => {
  if (reviewFilter.value === 'positive') {
    return reviews.value.filter((review) => review.rating >= 4)
  } else if (reviewFilter.value === 'negative') {
    return reviews.value.filter((review) => review.rating < 4)
  }
  return reviews.value
})
</script>

<template>
  <div class="relative flex flex-col w-3/5 mx-auto py-6 max-xl:w-4/5 max-lg:w-full max-lg:px-6">
    <!-- Профиль пользователя -->
    <div class="bg-white rounded-lg border border-[#E5E9F2] p-6 mb-6 shadow-sm">
      <div class="flex gap-8 max-lg:flex-col">
        <ProfileAvatar
          v-if="!isLoading"
          :fullName="fullName"
          :username="username"
          :isOnline="isOnline"
          :lastActive="lastActive"
          :avatarUrl="avatarUrl"
          :registrationDate="registrationDate"
        />
        <div v-else class="animate-pulse">
          <div class="w-[170px] h-[170px] rounded-full bg-gray-200"></div>
          <div class="mt-4 h-6 w-32 bg-gray-200 rounded"></div>
          <div class="mt-2 h-4 w-24 bg-gray-200 rounded"></div>
        </div>

        <div class="flex-1">
          <ProfileInfo
            :description="description"
            :isEditable="isOwnProfile"
            @update:description="description = $event"
          />
        </div>

        <div class="min-w-[200px]">
          <button
            v-if="!isOwnProfile"
            class="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm rounded-md font-medium bg-[#0A65CC] text-white transition-colors hover:bg-[#085BBA] cursor-pointer"
          >
            <MessageSquare class="w-4 h-4" />
            Отправить сообщение
          </button>

          <div class="mt-4 bg-[#F9F9F9] rounded-lg p-4 border border-[#E5E9F2]">
            <div class="flex items-center gap-2 mb-2">
              <CheckIcon class="w-4 h-4 text-[#4CAF50]" />
              <p class="text-sm font-medium text-[#222222]">
                {{ stats.ordersCompleted }} заказов выполнено
              </p>
            </div>
            <div class="flex items-center gap-2 mb-2">
              <Award class="w-4 h-4 text-[#FFB800]" />
              <p class="text-sm font-medium text-[#222222]">
                {{ stats.reviewsReceived }} отзывов получено
              </p>
            </div>
            <div class="flex items-center gap-2">
              <CheckIcon class="w-4 h-4 text-[#4CAF50]" />
              <p class="text-sm font-medium text-[#222222]">
                {{ stats.successRate }}% заказов успешно сдано
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Навыки -->
    <div class="bg-white rounded-lg border border-[#E5E9F2] p-6 mb-6 shadow-sm">
      <SkillsList :skills="skills" :isEditable="isOwnProfile" @update:skills="skills = $event" />
    </div>

    <!-- Портфолио -->
    <div class="bg-white rounded-lg border border-[#E5E9F2] p-6 mb-6 shadow-sm">
      <PortfolioGallery
        :projects="projects"
        :isEditable="isOwnProfile"
        @update:projects="projects = $event"
      />
    </div>

    <!-- Отзывы -->
    <div class="bg-white rounded-lg border border-[#E5E9F2] p-6 shadow-sm">
      <ReviewList
        :reviews="filteredReviews"
        :averageRating="averageRating"
        v-model="reviewFilter"
      />
    </div>
  </div>
</template>
