import { useEffect, useState } from 'react'

import DishCard from '../components/DishCard'
import LoadingMessage from '../components/LoadingMessage'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'

import { getActiveDishes, type Dish } from '../services/dishes'

// Menu page
function MenuPage() {
  // Dishes
  const [dishes, setDishes] = useState<Dish[]>([])

  // Page states
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  // Load dishes
  useEffect(() => {
    async function loadDishes() {
      try {
        setIsLoading(true)
        setIsError(false)

        const data = await getActiveDishes()

        setDishes(data)
      } catch {
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    void loadDishes()
  }, [])

  // Loading
  if (isLoading) {
    return <LoadingMessage />
  }

  // Error
  if (isError) {
    return <ErrorMessage />
  }

  return (
    <main>
      {/* Page title */}
      <h1>Menu</h1>

      {/* Empty menu */}
      {dishes.length === 0 && <EmptyState />}

      {/* Dish list */}
      {dishes.map((dish) => (
        <DishCard
          key={dish.id}
          id={dish.id}
          name={dish.name}
          description={dish.description ?? ''}
          price={dish.price}
        />
      ))}
    </main>
  )
}

export default MenuPage