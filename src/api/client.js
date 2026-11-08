import axios from 'axios'

// 1. Resolve base URL (checks VITE_API_URL, VITE_API_BASE_URL, or defaults to your Django port 4360)
const rawBaseUrl =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://127.0.0.1:4360'

// Strip trailing slash if present so endpoints attach cleanly
const BASE_URL = rawBaseUrl.replace(/\/+$/, '')

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 2. Attach JWT access token on every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ql_access')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 3. Auto-refresh on 401 Unauthorized
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config

    // If 401 occurs and this request has not already been retried
    // Also avoid retrying auth endpoints like login/register itself
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/register')
    ) {
      originalRequest._retry = true
      const refresh = localStorage.getItem('ql_refresh')

      if (refresh) {
        try {
          // Request new access token from Django SimpleJWT endpoint
          const { data } = await axios.post(`${BASE_URL}/api/v1/auth/token/refresh/`, {
            refresh,
          })

          localStorage.setItem('ql_access', data.access)
          originalRequest.headers.Authorization = `Bearer ${data.access}`

          // Re-run original request with new token
          return api(originalRequest)
        } catch (refreshErr) {
          // If refresh token is expired or blacklisted, log user out
          localStorage.removeItem('ql_access')
          localStorage.removeItem('ql_refresh')
          localStorage.removeItem('ql_user')
          window.location.href = '/login'
        }
      }
    }

    return Promise.reject(error)
  }
)

export default api