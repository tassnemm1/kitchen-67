import { createContext } from 'react'
import type { Session } from '@supabase/supabase-js'
import type { Profile } from '../types/database'

export interface AuthContextValue {
  /** The current Supabase session, or null when nobody is signed in. */
  session: Session | null
  /** The profile row of the signed in user, or null when signed out. */
  profile: Profile | null
  /** True while the session or the profile is still being resolved. */
  isLoading: boolean
  /** Message to show when the profile could not be loaded. */
  error: string | null
  /** Convenience flag for the staff only parts of the app. */
  isStaff: boolean
  /** Reads the profile again, after it has been changed somewhere else. */
  refreshProfile: () => Promise<void>
  signOut: () => Promise<void>
}

/**
 * Lives in its own file so `AuthProvider.tsx` only exports components and stays
 * compatible with fast refresh.
 */
export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
