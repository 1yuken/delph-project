import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log('Получен ответ:', {
      status: response.status,
      data: response.data,
    })
    return response
  },
  (error) => {
    console.error('Ошибка ответа:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    })
    return Promise.reject(error)
  },
)

// Универсальное преобразование categories
const transformItem = (item) => {
  let links = []
  if (item.categories) {
    if (item.categories.trim().startsWith('[')) {
      try {
        links = JSON.parse(item.categories)
      } catch {
        links = []
      }
    } else {
      links = item.categories.split(',').map((cat) => cat.trim())
    }
  }
  return {
    id: item.id,
    title: item.name,
    imageUrl: item.image,
    links,
  }
}

export const itemsApi = {
  getAll: async (page = 1, limit = 100) => {
    const response = await api.get('/items', {
      params: { page, limit },
    })
    return {
      items: response.data.items.map(transformItem),
      total: response.data.total,
    }
  },

  getRecent: async () => {
    const response = await api.get('/items', {
      params: { page: 1, limit: 5 },
    })
    return response.data.items.map(transformItem)
  },

  getByCategory: async (category) => {
    const response = await api.get(`/items/category/${category}`)
    return response.data.map(transformItem)
  },

  getOne: async (id) => {
    const response = await api.get(`/items/${id}`)
    return transformItem(response.data)
  },
}

export const ordersApi = {
  getByItemId: async (itemId) => {
    const response = await api.get(`/orders/item/${itemId}`)
    return response.data
  },

  create: async (orderData) => {
    try {
      // Преобразуем данные в формат, соответствующий структуре БД
      const requestData = {
        title: orderData.title,
        description: orderData.description,
        categories: orderData.categories,
        itemId: orderData.itemId,
        clientId: orderData.clientId || null,
        status: orderData.status || 'open',
        budget: orderData.price.replace(/[^\d.-]/g, ''),
        creationDate: new Date().toISOString(),
        completitionDate: orderData.deadline,
      }

      // Удаляем id из данных, если он есть
      delete requestData.id

      const response = await api.post('/orders', requestData)
      return response.data
    } catch (error) {
      console.error('Ошибка при создании заказа:', error)
      throw error
    }
  },

  getById: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`)
      return response.data
    } catch (error) {
      console.error('Ошибка при получении заказа:', error)
      throw error
    }
  },

  updateStatus: async (orderId, status) => {
    try {
      const response = await api.patch(`/orders/${orderId}/status`, { status })
      return response.data
    } catch (error) {
      console.error('Ошибка при обновлении статуса заказа:', error)
      throw error
    }
  },
}

export default api
