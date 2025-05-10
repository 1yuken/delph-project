import { reactive, computed } from 'vue'

const state = reactive({
  isAuthenticated: false,
  username: '',
  avatarUrl: '/avatar-default.jpg',
  userId: null,
})

export const useAuthStore = () => {
  const login = (userData) => {
    state.isAuthenticated = true
    state.username = userData.name || 'Пользователь'
    state.avatarUrl =
      typeof userData.avatarUrl === 'string' ? userData.avatarUrl : '/avatar-default.jpg'
    state.userId = userData.id

    // Сохраняем данные в локальное хранилище
    localStorage.setItem('token', userData.token)
    localStorage.setItem('username', state.username)
    localStorage.setItem('avatarUrl', state.avatarUrl)
    localStorage.setItem('userId', state.userId)
    console.log('AuthStore login - avatarUrl:', state.avatarUrl)
  }

  const logout = () => {
    state.isAuthenticated = false
    state.username = ''
    state.avatarUrl = '/avatar-default.jpg'
    state.userId = null
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('avatarUrl')
    localStorage.removeItem('userId')
    console.log('AuthStore logout - avatarUrl:', state.avatarUrl)
  }

  const checkAuth = () => {
    const token = localStorage.getItem('token')
    const storedUsername = localStorage.getItem('username')
    const storedAvatarUrl = localStorage.getItem('avatarUrl')
    const storedUserId = localStorage.getItem('userId')

    state.isAuthenticated = !!token
    state.username = storedUsername || ''
    state.avatarUrl = storedAvatarUrl || '/avatar-default.jpg'
    state.userId = storedUserId || null
    console.log('AuthStore checkAuth - avatarUrl:', state.avatarUrl)
  }

  const updateAvatar = (newAvatarUrl) => {
    console.log('Updating avatar in store:', newAvatarUrl)
    if (newAvatarUrl && typeof newAvatarUrl === 'string') {
      if (state.avatarUrl !== newAvatarUrl) {
        state.avatarUrl = newAvatarUrl
        localStorage.setItem('avatarUrl', newAvatarUrl)
        console.log('AuthStore updateAvatar - new value:', state.avatarUrl)
      }
    } else {
      if (state.avatarUrl !== '/avatar-default.jpg') {
        state.avatarUrl = '/avatar-default.jpg'
        localStorage.setItem('avatarUrl', '/avatar-default.jpg')
        console.log('AuthStore updateAvatar - default value:', state.avatarUrl)
      }
    }
  }

  // Вычисляемые свойства
  const isAuthenticated = computed(() => state.isAuthenticated)
  const username = computed(() => state.username)
  const avatarUrl = computed(() => state.avatarUrl)
  const userId = computed(() => state.userId)

  return {
    isAuthenticated,
    username,
    avatarUrl,
    userId,
    login,
    logout,
    checkAuth,
    updateAvatar,
  }
}
