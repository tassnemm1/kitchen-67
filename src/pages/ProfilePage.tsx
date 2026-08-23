import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../hooks/useAuth'
import { updateProfile } from '../services/profiles'
import './ProfilePage.css'

interface ProfileFormValues {
  fullName: string
}

export function ProfilePage() {
  const { session, profile, isStaff, refreshProfile } = useAuth()
  const [formError, setFormError] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormValues>({
    // `values` rather than `defaultValues`, so the field fills in as soon as
    // the profile arrives instead of staying empty on a direct page load.
    values: { fullName: profile?.full_name ?? '' },
  })

  if (!session || !profile) {
    return (
      <p className="status" role="status">
        Loading your profile…
      </p>
    )
  }

  async function onSubmit({ fullName }: ProfileFormValues) {
    if (!session) return

    setFormError(null)
    setIsSaved(false)
    const trimmed = fullName.trim()

    try {
      await updateProfile(session.user.id, { full_name: trimmed })
      await refreshProfile()
      reset({ fullName: trimmed })
      setIsSaved(true)
    } catch (caught: unknown) {
      setFormError(
        caught instanceof Error
          ? caught.message
          : 'Could not save your profile. Please try again.',
      )
    }
  }

  return (
    <section className="profile">
      <div className="profile__intro">
        <h1>My profile</h1>
        <p>Change the name the restaurant sees on your orders.</p>
      </div>

      <dl className="profile__facts">
        <dt>Email</dt>
        <dd>{session.user.email}</dd>
        <dt>Account</dt>
        <dd>{isStaff ? 'Restaurant staff' : 'Customer'}</dd>
      </dl>

      {formError && (
        <p className="alert" role="alert">
          {formError}
        </p>
      )}

      {isSaved && (
        <p className="profile__saved" role="status">
          Your profile has been saved.
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

        <button type="submit" className="button" disabled={isSubmitting || !isDirty}>
          {isSubmitting ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </section>
  )
}
