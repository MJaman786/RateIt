import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "../../types/Auth"

interface AuthStoreTypes {
  user: User | null
  token: string | null
  isLoggedIn: boolean
  _hasHydrated: boolean          // ✅ add this

  login: (user: User, token: string) => void
  logout: () => void
  setHasHydrated: (state: boolean) => void  // ✅ add this
}

export const useAuthStore = create<AuthStoreTypes>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      _hasHydrated: false,        // ✅ false until localStorage is read

      login: (user, token) => set({ user, token, isLoggedIn: true }),
      logout: () => set({ user: null, token: null, isLoggedIn: false }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),  // ✅
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        // ✅ called once localStorage hydration is done
        state?.setHasHydrated(true);
      },
    }
  )
)