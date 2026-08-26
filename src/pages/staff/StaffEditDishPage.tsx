import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { DataState } from '../../components/DataState'
import { DishForm } from '../../components/DishForm'
import { useDish } from '../../hooks/useDishes'
import { updateDish } from '../../services/dishes'
import type { DishInput } from '../../services/dishes'

export function StaffEditDishPage() {
  const { dishId } = useParams()
  const { data: dish, isLoading, error, reload } = useDish(dishId)
  const [isSaved, setIsSaved] = useState(false)

  async function handleSave(input: DishInput) {
    if (!dish) return

    setIsSaved(false)
    await updateDish(dish.id, input)
    reload()
    setIsSaved(true)
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

            {isSaved && (
              <p className="staff__saved" role="status">
                The dish has been saved.
              </p>
            )}

            <DishForm dish={dish} submitLabel="Save changes" onSubmit={handleSave} />

            <Link to="/staff/dishes">Back to the menu</Link>
          </>
        )}
      </DataState>
    </section>
  )
}
