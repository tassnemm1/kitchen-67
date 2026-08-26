import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { DishInput } from '../services/dishes'
import type { Dish } from '../types/database'

interface DishFormValues {
  name: string
  description: string
  category: string
  price: number
}

interface DishFormProps {
  /** Left out when creating a new dish. */
  dish?: Dish
  submitLabel: string
  onSubmit: (input: DishInput) => Promise<void>
}

/** Shared by the create and the edit view, so both validate the same way. */
export function DishForm({ dish, submitLabel, onSubmit }: DishFormProps) {
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DishFormValues>({
    values: {
      name: dish?.name ?? '',
      description: dish?.description ?? '',
      category: dish?.category ?? '',
      price: dish?.price ?? 0,
    },
  })

  async function submit(values: DishFormValues) {
    setFormError(null)

    try {
      await onSubmit({
        name: values.name.trim(),
        description: values.description.trim(),
        category: values.category.trim(),
        price: values.price,
      })
    } catch (caught: unknown) {
      setFormError(
        caught instanceof Error
          ? caught.message
          : 'Could not save the dish. Please try again.',
      )
    }
  }

  return (
    <>
      {formError && (
        <p className="alert" role="alert">
          {formError}
        </p>
      )}

      <form className="form" onSubmit={handleSubmit(submit)} noValidate>
        <div className="field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            aria-invalid={errors.name ? true : undefined}
            {...register('name', {
              required: 'Give the dish a name.',
              validate: (value) =>
                value.trim().length > 0 || 'Give the dish a name.',
            })}
          />
          {errors.name && (
            <p className="field-error" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="category">Category</label>
          <input
            id="category"
            type="text"
            placeholder="Burgers, Bowls, Sides…"
            aria-invalid={errors.category ? true : undefined}
            {...register('category', {
              required: 'Pick a category.',
              validate: (value) => value.trim().length > 0 || 'Pick a category.',
            })}
          />
          {errors.category && (
            <p className="field-error" role="alert">
              {errors.category.message}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            rows={4}
            aria-invalid={errors.description ? true : undefined}
            {...register('description', {
              required: 'Describe the dish so guests know what they get.',
            })}
          />
          {errors.description && (
            <p className="field-error" role="alert">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="price">Price (SEK)</label>
          <input
            id="price"
            type="number"
            min={0}
            step={1}
            aria-invalid={errors.price ? true : undefined}
            {...register('price', {
              required: 'Set a price.',
              valueAsNumber: true,
              min: { value: 0, message: 'The price cannot be negative.' },
            })}
          />
          {errors.price && (
            <p className="field-error" role="alert">
              {errors.price.message}
            </p>
          )}
        </div>

        <button type="submit" className="button" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : submitLabel}
        </button>
      </form>
    </>
  )
}
