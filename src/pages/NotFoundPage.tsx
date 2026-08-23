import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <section className="auth-page">
      <div className="auth-page__intro">
        <h1>Page not found</h1>
        <p>The page you were looking for does not exist.</p>
      </div>
      <Link to="/">Back to the start page</Link>
    </section>
  )
}
