import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuthUser {
  id?: number
  email: string
  nickname?: string
}

interface AuthState {
  isLoggedIn: boolean
  accessToken: string | null
  refreshToken: string | null
  user: AuthUser | null

  login: (payload: { accessToken: string; refreshToken: string; user: AuthUser }) => void
  logout: () => void
  setUser: (user: AuthUser | null) => void
  setTokens: (tokens: { accessToken: string | null; refreshToken: string | null }) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      isLoggedIn: false,
      accessToken: null,
      refreshToken: null,
      user: null,

      login: ({ accessToken, refreshToken, user }) =>
        set({
          isLoggedIn: true,
          accessToken,
          refreshToken,
          user,
        }),

      logout: () =>
        set({
          isLoggedIn: false,
          accessToken: null,
          refreshToken: null,
          user: null,
        }),

      setUser: user => set({ user }),
      setTokens: ({ accessToken, refreshToken }) => set({ accessToken, refreshToken }),
    }),
    {
      name: 'bready-auth',
      partialize: state => ({
        isLoggedIn: state.isLoggedIn,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    },
  ),
)
