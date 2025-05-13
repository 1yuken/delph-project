import { reactive, computed } from 'vue'

const state = reactive({
  isAuthenticated: false,
  username: '',
  avatarUrl: '',
  userId: null,
})

export const useAuthStore = () => {
  const login = (userData) => {
    console.log('AuthStore login - received userData:', userData)
    
    state.isAuthenticated = true
    state.username = userData.name || 'Пользователь'
    state.avatarUrl = userData.avatarUrl || '/avatar-default.jpg'
    state.userId = userData.id

    // Сохраняем данные в локальное хранилище
    localStorage.setItem('token', userData.token)
    localStorage.setItem('username', state.username)
    localStorage.setItem('avatarUrl', state.avatarUrl)
    localStorage.setItem('userId', state.userId)
    
    console.log('AuthStore login - state after update:', {
      isAuthenticated: state.isAuthenticated,
      username: state.username,
      avatarUrl: state.avatarUrl,
      userId: state.userId
    })
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
  }

  const checkAuth = () => {
    const token = localStorage.getItem('token')
    const storedUsername = localStorage.getItem('username')
    const storedAvatarUrl = localStorage.getItem('avatarUrl')
    const storedUserId = localStorage.getItem('userId')

    console.log('AuthStore checkAuth - stored data:', {
      token,
      storedUsername,
      storedAvatarUrl,
      storedUserId
    })

    state.isAuthenticated = !!token
    state.username = storedUsername || ''
    state.avatarUrl = storedAvatarUrl || '/avatar-default.jpg'
    state.userId = storedUserId || null

    console.log('AuthStore checkAuth - state after update:', {
      isAuthenticated: state.isAuthenticated,
      username: state.username,
      avatarUrl: state.avatarUrl,
      userId: state.userId
    })
  }

  const updateAvatar = (newAvatarUrl) => {
    console.log('AuthStore updateAvatar - new value:', newAvatarUrl)
    if (newAvatarUrl && typeof newAvatarUrl === 'string' && newAvatarUrl.trim() !== '') {
      state.avatarUrl = newAvatarUrl
      localStorage.setItem('avatarUrl', newAvatarUrl)
    } else {
      state.avatarUrl = '/avatar-default.jpg'
      localStorage.setItem('avatarUrl', '/avatar-default.jpg')
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
