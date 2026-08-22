import { use } from 'react'
import { AuthContext } from '../context/auth-context'
import type { AuthContextValue } from '../context/auth-context'

/** Reads the auth state. Throws when used outside of `AuthProvider`. */
export function useAuth(): AuthContextValue {
  const context = use(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider')
  }

  return context
}
