// API Service para comunicação com o backend TelaNix
// Substitui o IndexedDB local por chamadas HTTP reais

const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:3001/api'
  : 'https://telanix.onrender.com/api'

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Helper para fazer requisições
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const userId = localStorage.getItem('telanix-user-id')
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    }

    // Adicionar user ID no header se existir
    if (userId && !endpoint.includes('/auth/')) {
      headers['x-user-id'] = userId
    }

    const fullUrl = `${API_BASE_URL}${endpoint}`
    console.log('🔍 Fazendo requisição para:', fullUrl)
    console.log('🔍 Método:', options.method || 'GET')
    console.log('🔍 Body:', options.body)

    const response = await fetch(fullUrl, {
      ...options,
      headers,
    })

    console.log('📡 Status da resposta:', response.status)

    const data = await response.json()
    console.log('📦 Dados recebidos:', data)

    if (!response.ok) {
      throw new Error(data.error || 'Erro na requisição')
    }

    return data
  } catch (error) {
    console.error('❌ API Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}

// AUTENTICAÇÃO
export const authApi = {
  register: async (email: string, password: string, name: string) => {
    return fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    })
  },

  login: async (email: string, password: string) => {
    const response = await fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    // Salvar user ID no localStorage para autenticação
    if (response.success && response.data && typeof response.data === 'object') {
      const data = response.data as any
      if (data.user?.id) {
        localStorage.setItem('telanix-user-id', data.user.id)
      }
    }

    return response
  },
}

// USUÁRIOS
export const usersApi = {
  getById: async (id: string) => {
    return fetchApi(`/users/${id}`)
  },

  getStats: async (id: string) => {
    return fetchApi(`/users/${id}/stats`)
  },

  update: async (id: string, updates: any) => {
    return fetchApi(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  },
}

// REVIEWS
export const reviewsApi = {
  getByMovie: async (movieId: number) => {
    return fetchApi(`/reviews/movie/${movieId}`)
  },

  getByUser: async (userId: string) => {
    return fetchApi(`/reviews/user/${userId}`)
  },

  create: async (reviewData: {
    movie_id: number
    rating: number
    title: string
    content: string
    spoiler?: boolean
  }) => {
    return fetchApi('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    })
  },

  markHelpful: async (reviewId: string) => {
    return fetchApi(`/reviews/${reviewId}/helpful`, {
      method: 'PUT',
    })
  },

  delete: async (reviewId: string) => {
    return fetchApi(`/reviews/${reviewId}`, {
      method: 'DELETE',
    })
  },
}

// RATINGS
export const ratingsApi = {
  getByUser: async (userId: string) => {
    return fetchApi(`/ratings/user/${userId}`)
  },

  getByUserAndMovie: async (userId: string, movieId: number) => {
    return fetchApi(`/ratings/user/${userId}/movie/${movieId}`)
  },

  createOrUpdate: async (movieId: number, rating: number) => {
    return fetchApi('/ratings', {
      method: 'POST',
      body: JSON.stringify({ movie_id: movieId, rating }),
    })
  },

  delete: async (movieId: number) => {
    return fetchApi(`/ratings/movie/${movieId}`, {
      method: 'DELETE',
    })
  },
}

// LIKES
export const likesApi = {
  getByUser: async (userId: string) => {
    return fetchApi<number[]>(`/likes/user/${userId}`)
  },

  create: async (movieId: number) => {
    return fetchApi('/likes', {
      method: 'POST',
      body: JSON.stringify({ movie_id: movieId }),
    })
  },

  delete: async (movieId: number) => {
    return fetchApi(`/likes/movie/${movieId}`, {
      method: 'DELETE',
    })
  },
}

