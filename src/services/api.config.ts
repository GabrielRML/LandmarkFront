const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5131/api'

export const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
}

export default apiConfig
