import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { register as registerAccount } from '../services/auth'
import './AuthPage.css'

interface RegisterFormValues {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

const MIN_PASSWORD_LENGTH = 8

export function RegisterPage() {
  const { session, isLoading } = useAuth()
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)
  const [needsConfirmation, setNeedsConfirmation] = useState(false)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  if (isLoading) {
    return <p className="status" role="status">Loading…</p>
  }

  if (session) {
    return <Navigate to="/" replace />
  }

  async function onSubmit({ fullName, email, password }: RegisterFormValues) {
    setFormError(null)

    try {
      const { needsEmailConfirmation } = await registerAccount({
        fullName: fullName.trim(),
        email,
        password,
      })

      if (needsEmailConfirmation) {
        setNeedsConfirmation(true)
        return
      }

      await navigate('/', { replace: true })
    } catch (caught: unknown) {
      setFormError(
        caught instanceof Error
          ? caught.message
          : 'Could not create your account. Please try again.',
      )
    }
  }

  if (needsConfirmation) {
    return (
      <div className="auth-page">
        <div className="auth-page__intro">
          <h1>Check your inbox</h1>
          <p>
            We sent you a confirmation link. Open it to activate your account,
            then come back and log in.
          </p>
        </div>
        <Link to="/login">Go to login</Link>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-page__intro">
        <h1>Sign up</h1>
        <p>Create an account to order food for pickup.</p>
      </div>

      {formError && (
        <p className="alert" role="alert">
          {formError}
        </p>
      )}

      <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="field">
          <label htmlFor="fullName">Name</label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            aria-invalid={errors.fullName ? true : undefined}
            {...register('fullName', {
              required: 'Enter your name.',
              validate: (value) =>
                value.trim().length >= 2 || 'Your name is a little too short.',
            })}
          />
          {errors.fullName && (
            <p className="field-error" role="alert">
              {errors.fullName.message}
            </p>
          )}
        </div>

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
            autoComplete="new-password"
            aria-invalid={errors.password ? true : undefined}
            {...register('password', {
              required: 'Choose a password.',
              minLength: {
                value: MIN_PASSWORD_LENGTH,
                message: `Use at least ${MIN_PASSWORD_LENGTH} characters.`,
              },
            })}
          />
          {errors.password && (
            <p className="field-error" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="confirmPassword">Repeat password</label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            aria-invalid={errors.confirmPassword ? true : undefined}
            {...register('confirmPassword', {
              required: 'Repeat your password.',
              validate: (value) =>
                value === getValues('password') || 'The passwords do not match.',
            })}
          />
          {errors.confirmPassword && (
            <p className="field-error" role="alert">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button type="submit" className="button" disabled={isSubmitting}>
          {isSubmitting ? 'Creating your account…' : 'Sign up'}
        </button>
      </form>

      <p className="auth-page__switch">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  )
}
