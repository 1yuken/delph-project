<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import SettingsSection from '@/components/SettingsSection.vue'
import SettingsButton from '@/components/SettingsButton.vue'
import Mail from '@/icons/Mail.vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const isDisabled = ref(true)
const isLoading = ref(false)
const error = ref('')
const success = ref('')
const avatarInputRef = ref(null)

const userInfo = ref({
  username: '',
  email: '',
  avatarUrl: '',
  bio: '',
  isFreelancer: false,
})

// Загрузка данных пользователя
const loadUserData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/profile', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    console.log('Profile data response:', response.data)
    userInfo.value = {
      ...response.data,
      isFreelancer: response.data.isFreelancer || false,
    }
    if (response.data.avatarUrl) {
      const avatarUrl =
        typeof response.data.avatarUrl === 'string'
          ? response.data.avatarUrl
          : response.data.avatarUrl.toString()
      authStore.updateAvatar(avatarUrl)
    }
  } catch (err) {
    console.error('Error loading user data:', err)
    error.value = 'Ошибка загрузки данных пользователя'
  }
}

// Загрузка аватара
const handleAvatarUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('avatar', file)

  try {
    isLoading.value = true
    const response = await axios.post('http://localhost:3000/users/upload-avatar', formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      },
    })

    console.log('Avatar upload response:', response.data)

    if (response.data.avatarUrl) {
      const avatarUrl =
        typeof response.data.avatarUrl === 'string'
          ? response.data.avatarUrl
          : response.data.avatarUrl.toString()
      userInfo.value.avatarUrl = avatarUrl
      authStore.updateAvatar(avatarUrl)
      success.value = 'Аватар успешно обновлен'
    }
  } catch (err) {
    console.error('Error uploading avatar:', err)
    error.value = 'Ошибка загрузки аватара'
  } finally {
    isLoading.value = false
  }
}

// Изменение пароля
const showChangePasswordModal = ref(false)
const passwordData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const changePassword = async () => {
  if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
    error.value = 'Пароли не совпадают'
    return
  }

  try {
    isLoading.value = true
    await axios.post(
      'http://localhost:3000/auth/change_password',
      {
        currentPassword: passwordData.value.currentPassword,
        newPassword: passwordData.value.newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    )

    success.value = 'Пароль успешно изменен'
    showChangePasswordModal.value = false
    passwordData.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  } catch (err) {
    console.error('Error changing password:', err)
    error.value = err.response?.data?.message || 'Ошибка изменения пароля'
  } finally {
    isLoading.value = false
  }
}

// Переключение статуса фрилансера
const showFreelancerConfirmModal = ref(false)
const isUpdatingFreelancerStatus = ref(false)

const toggleFreelancerStatus = async () => {
  showFreelancerConfirmModal.value = true
}

const confirmFreelancerStatusChange = async () => {
  try {
    isUpdatingFreelancerStatus.value = true
    const response = await axios.patch(
      'http://localhost:3000/users',
      {
        isFreelancer: !userInfo.value.isFreelancer,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    )
    if (response.data) {
      userInfo.value.isFreelancer = !userInfo.value.isFreelancer
      success.value = `Статус успешно изменен на ${userInfo.value.isFreelancer ? 'фрилансер' : 'обычный пользователь'}`
    }
  } catch (err) {
    console.error('Error updating freelancer status:', err)
    error.value = 'Ошибка изменения статуса'
  } finally {
    isUpdatingFreelancerStatus.value = false
    showFreelancerConfirmModal.value = false
  }
}

onMounted(() => {
  loadUserData()
})
</script>

<template>
  <div class="relative flex flex-col w-3/5 mx-auto py-6 max-xl:w-4/5 max-lg:w-full max-lg:px-6">
    <div class="w-full">
      <h1 class="text-3xl font-bold text-[#222222] mb-6 max-sm:text-2xl">Настройки</h1>

      <!-- Сообщения об ошибках и успехе -->
      <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-600">{{ error }}</p>
      </div>
      <div v-if="success" class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <p class="text-green-600">{{ success }}</p>
      </div>

      <!-- Профиль пользователя -->
      <div class="bg-white rounded-lg border border-[#E5E9F2] p-6 mb-6 shadow-sm">
        <div class="flex items-center gap-5 max-sm:flex-col">
          <div class="relative">
            <img
              class="rounded-full w-24 h-24 object-cover border-2 border-[#E5E9F2]"
              :src="String(userInfo.avatarUrl)"
              :alt="userInfo.username"
            />
            <label
              class="absolute bottom-0 right-0 bg-[#0A65CC] rounded-full p-2 border-2 border-white cursor-pointer hover:bg-[#085BBA] transition-colors group"
            >
              <input
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleAvatarUpload"
                :disabled="isLoading"
              />
              <div
                v-if="isLoading"
                class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></div>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-white group-hover:scale-110 transition-transform"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </label>
          </div>

          <div class="flex-1">
            <h2 class="text-xl font-semibold text-[#222222]">{{ userInfo.username }}</h2>
            <div class="flex flex-wrap gap-4 max-sm:flex-col max-sm:gap-2">
              <div class="flex items-center gap-1.5 text-sm text-[#656565]">
                <Mail class="w-4 h-4" />
                {{ userInfo.email }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <SettingsSection title="Личное" icon="User">
        <div class="flex flex-col gap-3">
          <div
            class="flex items-center justify-between p-4 bg-[#F9F9F9] rounded-lg border border-[#E5E9F2]"
          >
            <div>
              <h3 class="font-medium text-[#222222]">Статус фрилансера</h3>
              <p class="text-sm text-[#656565] mt-1">
                {{
                  userInfo.isFreelancer
                    ? 'Вы можете принимать заказы'
                    : 'Вы можете размещать заказы'
                }}
              </p>
            </div>
            <button
              @click="toggleFreelancerStatus"
              class="relative inline-flex h-6 w-11 items-center cursor-pointer rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0A65CC] focus:ring-offset-2"
              :class="userInfo.isFreelancer ? 'bg-[#0A65CC]' : 'bg-[#E5E9F2]'"
              :disabled="isUpdatingFreelancerStatus"
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                :class="userInfo.isFreelancer ? 'translate-x-6' : 'translate-x-1'"
              ></span>
            </button>
          </div>
          <SettingsButton label="Сменить аватар" icon="User" @click="avatarInputRef.click()" />
          <input
            ref="avatarInputRef"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleAvatarUpload"
            :disabled="isLoading"
          />
          <SettingsButton
            label="Изменить пароль"
            icon="Lock"
            @click="showChangePasswordModal = true"
          />
        </div>
      </SettingsSection>

      <SettingsSection title="Оповещения" icon="Bell">
        <div class="flex flex-col gap-3">
          <SettingsButton
            label="Push-уведомления"
            icon="Bell"
            :disabled="isDisabled"
            tooltip="Функция в разработке"
          />
          <SettingsButton
            label="Email-уведомления"
            icon="Mail"
            :disabled="isDisabled"
            tooltip="Функция в разработке"
          />
          <SettingsButton
            label="SMS-уведомления"
            icon="Smartphone"
            :disabled="isDisabled"
            tooltip="Функция в разработке"
          />
        </div>
      </SettingsSection>

      <SettingsSection title="Тема и внешний вид" icon="Palette">
        <div class="flex flex-col gap-3">
          <SettingsButton
            label="Выбор темы"
            icon="Palette"
            :disabled="isDisabled"
            tooltip="Функция в разработке"
          />
          <SettingsButton
            label="Размер шрифта"
            icon="Type"
            :disabled="isDisabled"
            tooltip="Функция в разработке"
          />
          <SettingsButton
            label="Анимации"
            icon="Zap"
            :disabled="isDisabled"
            tooltip="Функция в разработке"
          />
        </div>
      </SettingsSection>

      <div class="mt-8 text-center text-sm text-[#656565]">
        <p>Версия приложения: 1.0.0</p>
      </div>
    </div>

    <!-- Модальное окно изменения пароля -->
    <div
      v-if="showChangePasswordModal"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md animate-scaleIn">
        <h3 class="text-xl font-semibold mb-4">Изменение пароля</h3>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-[#222222] mb-1">Текущий пароль</label>
            <input
              type="password"
              v-model="passwordData.currentPassword"
              class="w-full px-3 py-2 border border-[#E5E9F2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20 focus:border-[#0A65CC]"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-[#222222] mb-1">Новый пароль</label>
            <input
              type="password"
              v-model="passwordData.newPassword"
              class="w-full px-3 py-2 border border-[#E5E9F2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20 focus:border-[#0A65CC]"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-[#222222] mb-1"
              >Подтвердите новый пароль</label
            >
            <input
              type="password"
              v-model="passwordData.confirmPassword"
              class="w-full px-3 py-2 border border-[#E5E9F2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20 focus:border-[#0A65CC]"
            />
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="showChangePasswordModal = false"
            class="px-4 py-2 text-[#656565] cursor-pointer hover:text-[#222222] transition-colors"
          >
            Отмена
          </button>
          <button
            @click="changePassword"
            :disabled="isLoading"
            class="px-4 py-2 bg-[#0A65CC] cursor-pointer text-white rounded-lg hover:bg-[#085BBA] transition-colors disabled:opacity-50"
          >
            {{ isLoading ? 'Сохранение...' : 'Сохранить' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Модальное окно подтверждения изменения статуса фрилансера -->
    <div
      v-if="showFreelancerConfirmModal"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md animate-scaleIn">
        <h3 class="text-xl font-semibold mb-4">Подтверждение изменения статуса</h3>
        <p class="text-[#656565] mb-6">
          {{
            userInfo.isFreelancer
              ? 'Вы уверены, что хотите стать обычным пользователем? Вы больше не сможете принимать заказы.'
              : 'Вы уверены, что хотите стать фрилансером? Вы сможете принимать заказы от других пользователей.'
          }}
        </p>

        <div class="flex justify-end gap-3">
          <button
            @click="showFreelancerConfirmModal = false"
            class="px-4 py-2 text-[#656565] cursor-pointer hover:text-[#222222] transition-colors"
            :disabled="isUpdatingFreelancerStatus"
          >
            Отмена
          </button>
          <button
            @click="confirmFreelancerStatusChange"
            :disabled="isUpdatingFreelancerStatus"
            class="px-4 py-2 bg-[#0A65CC] cursor-pointer text-white rounded-lg hover:bg-[#085BBA] transition-colors disabled:opacity-50"
          >
            {{ isUpdatingFreelancerStatus ? 'Сохранение...' : 'Подтвердить' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Анимация для загрузки */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Плавное появление элементов */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}

/* Анимация масштабирования для модальных окон */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scaleIn {
  animation: scaleIn 0.2s ease-out;
}
</style>
