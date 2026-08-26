import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { DataState } from '../../components/DataState'
import { useDishes } from '../../hooks/useDishes'
import { formatPrice } from '../../lib/format'
import { getDishImageUrl } from '../../services/dishImages'
import { setDishActive } from '../../services/dishes'
import type { Dish } from '../../types/database'

type DishFilter = 'active' | 'archived' | 'all'

const FILTERS: { value: DishFilter; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
  { value: 'all', label: 'All' },
]

function parseFilter(value: string | null): DishFilter {
  return value === 'archived' || value === 'all' ? value : 'active'
}

function matchesFilter(dish: Dish, filter: DishFilter): boolean {
  if (filter === 'all') return true
  return filter === 'active' ? dish.is_active : !dish.is_active
}

export function StaffDishesPage() {
  // The filter lives in the URL, so a view can be linked to and the back
  // button steps through the filters.
  const [searchParams, setSearchParams] = useSearchParams()
  const filter = parseFilter(searchParams.get('show'))

  const { data, isLoading, error, reload } = useDishes(true)
  const [actionError, setActionError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const dishes = (data ?? []).filter((dish) => matchesFilter(dish, filter))

  async function toggleArchived(dish: Dish) {
    setActionError(null)
    setBusyId(dish.id)

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
      setBusyId(null)
    }
  }

  return (
    <section className="staff__section">
      <div className="staff__intro">
        <h1>Dishes</h1>
        <p>Dishes are archived, never deleted, so old orders stay readable.</p>
      </div>

      <div className="staff__toolbar">
        <div className="filters" role="group" aria-label="Filter dishes">
          {FILTERS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`filters__item${filter === option.value ? ' filters__item--on' : ''}`}
              aria-pressed={filter === option.value}
              onClick={() => setSearchParams({ show: option.value })}
            >
              {option.label}
            </button>
          ))}
        </div>

        <Link to="/staff/dishes/new" className="button">
          New dish
        </Link>
      </div>

      {actionError && (
        <p className="alert" role="alert">
          {actionError}
        </p>
      )}

      <DataState
        isLoading={isLoading}
        error={error}
        isEmpty={dishes.length === 0}
        emptyMessage="No dishes match this filter."
        loadingMessage="Loading the menu…"
      >
        <ul className="dish-list">
          {dishes.map((dish) => {
            const imageUrl = getDishImageUrl(dish.image_path)

            return (
              <li key={dish.id} className="dish-row">
                {imageUrl ? (
                  <img className="dish-row__image" src={imageUrl} alt="" />
                ) : (
                  <span className="dish-row__image dish-row__image--empty" />
                )}

                <div className="dish-row__body">
                  <Link to={`/staff/dishes/${dish.id}`} className="dish-row__name">
                    {dish.name}
                  </Link>
                  <p className="dish-row__meta">
                    {dish.category} · {formatPrice(dish.price)}
                    {!dish.is_active && ' · Archived'}
                  </p>
                </div>

                <button
                  type="button"
                  className="button button--quiet dish-row__action"
                  disabled={busyId === dish.id}
                  onClick={() => void toggleArchived(dish)}
                >
                  {busyId === dish.id
                    ? 'Saving…'
                    : dish.is_active
                      ? 'Archive'
                      : 'Reactivate'}
                </button>
              </li>
            )
          })}
        </ul>
      </DataState>
    </section>
  )
}
