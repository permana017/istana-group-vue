import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useModeStore } from '@/stores/mode'
import { authService } from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.username === 'johnd') // Admin check based on username

  // Actions
  const login = async (credentials) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await authService.login(credentials)
      
      if (response.token) {
        token.value = response.token
        localStorage.setItem('token', response.token)
        
        // Get user profile after login
        await getUserProfile()
        
        return { success: true }
      }
    } catch (err) {
      error.value = err.message || 'Login failed'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const getUserProfile = async () => {
    try {
      if (!token.value) return
      
      const userProfile = await authService.getUserProfile()
      user.value = userProfile
    } catch (err) {
      console.error('Failed to get user profile:', err)
      // If getting profile fails, logout user
      logout()
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    // Clear all persisted data for this app (token, cart, orders, locale, mode, etc.)
    localStorage.clear()
    error.value = null
    // also clear visitor mode explicitly
    try {
      const mode = useModeStore()
      mode.clear()
    } catch (_) {}
  }

  const clearError = () => {
    error.value = null
  }

  // Initialize user profile if token exists
  const initializeAuth = async () => {
    if (token.value) {
      await getUserProfile()
    }
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,
    // Getters
    isAuthenticated,
    isAdmin,
    // Actions
    login,
    logout,
    getUserProfile,
    clearError,
    initializeAuth
  }
})