import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuthData {
    id: number
    tipo_registro: number
}

interface AuthStore {
    authData: AuthData | null
    setAuthData: (data: AuthData) => void
    clearAuthData: () => void
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            authData: null,
            setAuthData: (data) => set({ authData: data }),
            clearAuthData: () => set({ authData: null }),
        }),
        {
            name: 'auth-storage',
        }
    )
)
