import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { getProfile, getSession, logout, onAuthStateChange } from '../services/auth'
import type { Profile } from '../types/database'
import { AuthContext } from './auth-context'
import type { AuthContextValue } from './auth-context'

interface AuthProviderProps {
  children: ReactNode
}

/** The profile and the error are tagged with the user they belong to, so a
 * stale result from a previous user is never shown after a sign out. */
interface ProfileResult {
  userId: string
  profile: Profile | null
  message: string | null
}

function toMessage(caught: unknown, fallback: string): string {
  return caught instanceof Error ? caught.message : fallback
}

/**
 * Keeps the Supabase session and the matching profile row in React state and
 * shares them with the rest of the app.
 */
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

    // Do not call other Supabase methods from inside this callback, it runs
    // while the auth client holds its internal lock.
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

  const signOut = useCallback(async () => {
    await logout()
    setSession(null)
  }, [])

  // Results belonging to another user are ignored rather than cleared, which
  // keeps the effect above free of synchronous state updates.
  const current = profileResult?.userId === userId ? profileResult : null
  const profile = current?.profile ?? null
  const error = current?.message ?? sessionError

  // A signed in user is only ready once the profile has been resolved,
  // otherwise a role check could run against a profile that is still missing.
  const isLoading = isSessionLoading || (session !== null && current === null)

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      profile,
      isLoading,
      error,
      isStaff: profile?.role === 'staff',
      signOut,
    }),
    [session, profile, isLoading, error, signOut],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
