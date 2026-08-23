import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { getRedirectTarget } from '../lib/redirect'
import { login } from '../services/auth'
import './AuthPage.css'

interface LoginFormValues {
  email: string
  password: string
}

export function LoginPage() {
  const { session, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: { email: '', password: '' },
  })

  const redirectTo = getRedirectTarget(location.state)

  if (isLoading) {
    return <p className="status" role="status">Loading…</p>
  }

  if (session) {
    return <Navigate to={redirectTo} replace />
  }

  async function onSubmit(values: LoginFormValues) {
    setFormError(null)

    try {
      await login(values)
      await navigate(redirectTo, { replace: true })
    } catch (caught: unknown) {
      setFormError(
        caught instanceof Error
          ? caught.message
          : 'Could not log you in. Please try again.',
      )
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-page__intro">
        <h1>Log in</h1>
        <p>Log in to place an order and follow it from the kitchen to pickup.</p>
      </div>

      {formError && (
        <p className="alert" role="alert">
          {formError}
        </p>
      )}

      <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={errors.email ? true : undefined}
            {...register('email', {
              required: 'Enter your email address.',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email address.',
              },
            })}
          />
          {errors.email && (
            <p className="field-error" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={errors.password ? true : undefined}
            {...register('password', { required: 'Enter your password.' })}
          />
          {errors.password && (
            <p className="field-error" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        <button type="submit" className="button" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p className="auth-page__switch">
        No account yet? <Link to="/register">Sign up</Link>
      </p>
    </div>
  )
}
