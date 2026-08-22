import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import './Layout.css'

/** Header and page frame shared by every route. */
export function Layout() {
  const { session, profile, isLoading, signOut } = useAuth()
  const [signOutError, setSignOutError] = useState<string | null>(null)

  async function handleSignOut() {
    setSignOutError(null)

    try {
      await signOut()
    } catch (caught: unknown) {
      setSignOutError(
        caught instanceof Error ? caught.message : 'Could not sign you out.',
      )
    }
  }

  return (
    <div className="layout">
      <header className="layout__header">
        <Link to="/" className="layout__brand">
          I Require Sustenance
        </Link>

        <nav className="layout__nav">
          {isLoading ? (
            <span className="status">Loading…</span>
          ) : session ? (
            <>
              <span className="layout__user">
                {profile?.full_name || session.user.email}
              </span>
              <button
                type="button"
                className="button button--quiet layout__sign-out"
                onClick={() => void handleSignOut()}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Log in</NavLink>
              <NavLink to="/register">Sign up</NavLink>
            </>
          )}
        </nav>
      </header>

      <main className="layout__main">
        {signOutError && <p className="alert" role="alert">{signOutError}</p>}
        <Outlet />
      </main>
    </div>
  )
}
