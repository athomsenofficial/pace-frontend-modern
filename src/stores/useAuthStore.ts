import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'viewer' | 'editor' | 'admin' | 'super_admin'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  rank: string
  unit: string
  role: UserRole
  avatar?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User) => void
  logout: () => void
  hasPermission: (requiredRole: UserRole) => boolean
}

const roleHierarchy: Record<UserRole, number> = {
  viewer: 1,
  editor: 2,
  admin: 3,
  super_admin: 4,
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: true }),

      logout: () => set({ user: null, isAuthenticated: false }),

      hasPermission: (requiredRole) => {
        const { user } = get()
        if (!user) return false

        const userRoleLevel = roleHierarchy[user.role]
        const requiredRoleLevel = roleHierarchy[requiredRole]

        return userRoleLevel >= requiredRoleLevel
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)

// Mock login function for development
export const mockLogin = (role: UserRole = 'editor') => {
  const mockUser: User = {
    id: '1',
    email: 'john.doe@us.af.mil',
    firstName: 'John',
    lastName: 'Doe',
    rank: 'MSgt',
    unit: '1st Information Systems Squadron',
    role,
  }

  useAuthStore.getState().setUser(mockUser)
}
