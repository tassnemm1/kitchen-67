import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import type { UserRole } from '../types/database'

interface ProtectedRouteProps {
  /** When set, the signed in user must also have this role. */
  role?: UserRole
}

/**
 * Guards a group of routes in the interface. This is only about what the user
 * gets to see. The actual protection of data and files lives in the Supabase
 * row level security and storage policies.
 */
export function ProtectedRoute({ role }: ProtectedRouteProps) {
  const { session, profile, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <p role="status">Checking your session…</p>
  }

  if (!session) {
    // Remember where the user was heading so login can send them back.
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (role && profile?.role !== role) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
