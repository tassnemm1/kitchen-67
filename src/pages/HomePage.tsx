import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'

export function HomePage() {
  const { session, profile, isLoading, error } = useAuth()

  return (
    <section className="auth-page">
      <div className="auth-page__intro">
        <h1>I Require Sustenance</h1>
        <p>Order food from the restaurant and pick it up when it is ready.</p>
      </div>

      {isLoading ? (
        <p className="status" role="status">Loading…</p>
      ) : error ? (
        <p className="alert" role="alert">{error}</p>
      ) : session ? (
        <p>Welcome back, {profile?.full_name || session.user.email}.</p>
      ) : (
        <p>
          <Link to="/login">Log in</Link> or{' '}
          <Link to="/register">sign up</Link> to place an order.
        </p>
      )}
    </section>
  )
}
