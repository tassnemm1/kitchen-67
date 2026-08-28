import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './Layout.css'

/** Header and page frame shared by every route. */
export function Layout() {
  const { session, profile, isLoading, isStaff, signOut } = useAuth()
  const [signOutError, setSignOutError] = useState<string | null>(null)

  async function handleSignOut() {
    setSignOutError(null)

    try {
      await signOut()
      localStorage.removeItem('cart')
    } catch (caught: unknown) {
      setSignOutError(
        caught instanceof Error ? caught.message : 'Could not sign you out.',
      )
    }
  }

  return (
    <div className="layout">
      <header className="layout__header">
        {/* Brand */}
        <Link to="/" className="layout__brand">
           Kitchen 67
        </Link>

        {/* Main navigation */}
        <nav className="layout__nav">
          <NavLink to="/menu">Menu</NavLink>
          <NavLink to="/cart">Cart</NavLink>

          {session && <NavLink to="/orders">My Orders</NavLink>}

          {isLoading ? (
            <span className="status">Loading…</span>
          ) : session ? (
            <>
              {isStaff && <NavLink to="/staff">Staff</NavLink>}
              <NavLink to="/profile" className="layout__user">
                {profile?.full_name || session.user.email}
              </NavLink>

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
        {/* Sign out error */}
        {signOutError && (
          <p className="alert" role="alert">
            {signOutError}
          </p>
        )}

        {/* Current page */}
        <Outlet />
      </main>
    </div>
  )
}
