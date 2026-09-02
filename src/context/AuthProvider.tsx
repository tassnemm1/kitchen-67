import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { getSession, logout, onAuthStateChange } from '../services/auth'
import { getProfile } from '../services/profiles'
import type { Profile } from '../types/database'
import { AuthContext } from './auth-context'
import type { AuthContextValue } from './auth-context'

interface AuthProviderProps {
  children: ReactNode
}

interface ProfileResult {
  userId: string
  profile: Profile | null
  message: string | null
}

function toMessage(caught: unknown, fallback: string): string {
  return caught instanceof Error ? caught.message : fallback
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [isSessionLoading, setIsSessionLoading] = useState(true)
  const [sessionError, setSessionError] = useState<string | null>(null)
  const [profileResult, setProfileResult] = useState<ProfileResult | null>(null)

  useEffect(() => {
    let isActive = true

    getSession()
      .then((initialSession) => {
        if (isActive) setSession(initialSession)
      })
      .catch((caught: unknown) => {
        if (isActive) setSessionError(toMessage(caught, 'Could not read the session.'))
      })
      .finally(() => {
        if (isActive) setIsSessionLoading(false)
      })

    const unsubscribe = onAuthStateChange((nextSession) => {
      if (!isActive) return
      setSession(nextSession)
      setIsSessionLoading(false)
    })

    return () => {
      isActive = false
      unsubscribe()
    }
  }, [])

  const userId = session?.user.id ?? null

  useEffect(() => {
    if (!userId) return

    let isActive = true

    getProfile(userId)
      .then((profile) => {
        if (isActive) setProfileResult({ userId, profile, message: null })
      })
      .catch((caught: unknown) => {
        if (!isActive) return
        setProfileResult({
          userId,
          profile: null,
          message: toMessage(caught, 'Could not load your profile.'),
        })
      })

    return () => {
      isActive = false
    }
  }, [userId])

  const refreshProfile = useCallback(async () => {
    if (!userId) return
    const profile = await getProfile(userId)
    setProfileResult({ userId, profile, message: null })
  }, [userId])

  const signOut = useCallback(async () => {
    await logout()
    setSession(null)
  }, [])

  const current = profileResult?.userId === userId ? profileResult : null
  const profile = current?.profile ?? null
  const error = current?.message ?? sessionError

  const isLoading = isSessionLoading || (session !== null && current === null)

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      profile,
      isLoading,
      error,
      isStaff: profile?.role === 'staff',
      refreshProfile,
      signOut,
    }),
    [session, profile, isLoading, error, refreshProfile, signOut],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
