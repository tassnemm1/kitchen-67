import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DataState } from '../../components/DataState'
import { DishForm } from '../../components/DishForm'
import { DishImageUploader } from '../../components/DishImageUploader'
import { useDish } from '../../hooks/useDishes'
import { setDishActive, updateDish } from '../../services/dishes'
import type { DishInput } from '../../services/dishes'

export function StaffEditDishPage() {
  const { dishId } = useParams()
  const { data: dish, isLoading, error, reload } = useDish(dishId)

  const [isSaved, setIsSaved] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [isArchiving, setIsArchiving] = useState(false)

  async function handleSave(input: DishInput) {
    if (!dish) return

    setIsSaved(false)
    await updateDish(dish.id, input)
    reload()
    setIsSaved(true)
  }

  async function toggleArchived() {
    if (!dish) return

    setActionError(null)
    setIsArchiving(true)

    try {
      await setDishActive(dish.id, !dish.is_active)
      reload()
    } catch (caught: unknown) {
      setActionError(
        caught instanceof Error
          ? caught.message
          : 'Could not change the dish. Please try again.',
      )
    } finally {
      setIsArchiving(false)
    }
  }

  return (
    <section className="staff__section">
      <DataState isLoading={isLoading} error={error} loadingMessage="Loading the dish…">
        {dish && (
          <>
            <div className="staff__intro">
              <h1>{dish.name}</h1>
              <p>
                {dish.is_active
                  ? 'On the menu and orderable.'
                  : 'Archived. Guests cannot order it, but it stays in old orders.'}
              </p>
            </div>

            {actionError && (
              <p className="alert" role="alert">
                {actionError}
              </p>
            )}

            {isSaved && (
              <p className="staff__saved" role="status">
                The dish has been saved.
              </p>
            )}

            <DishForm dish={dish} submitLabel="Save changes" onSubmit={handleSave} />

            <DishImageUploader dish={dish} onChanged={reload} />

            <div className="staff__danger">
              <h2>{dish.is_active ? 'Archive' : 'Reactivate'}</h2>
              <p>
                {dish.is_active
                  ? 'Hides the dish from the menu. Nothing is deleted, and old orders keep working.'
                  : 'Puts the dish back on the menu so guests can order it again.'}
              </p>
              <button
                type="button"
                className="button button--quiet"
                disabled={isArchiving}
                onClick={() => void toggleArchived()}
              >
                {isArchiving
                  ? 'Saving…'
                  : dish.is_active
                    ? 'Archive dish'
                    : 'Reactivate dish'}
              </button>
            </div>

            <Link to="/staff/dishes">Back to the menu</Link>
          </>
        )}
      </DataState>
    </section>
  )
}
