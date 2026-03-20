import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthUser {
  id:        number
  username:  string
  email:     string
  full_name: string
  role:      'admin' | 'accountant' | 'cashier'
}

interface AuthState {
  user:        AuthUser | null
  accessToken: string | null
  setAuth:     (user: AuthUser, token: string) => void
  setAccessToken: (token: string) => void
  logout:      () => void
  isAuthenticated: boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user:        null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (user, token) =>
        set({ user, accessToken: token, isAuthenticated: true }),

      setAccessToken: (token) =>
        set({ accessToken: token }),

      logout: () =>
        set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    {
      name: 'mr-sehi-auth',
      partialize: (state) => ({ user: state.user }),  // Don't persist token
    }
  )
)
