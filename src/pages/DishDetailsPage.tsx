import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import LoadingMessage from '../components/LoadingMessage'
import ErrorMessage from '../components/ErrorMessage'

import { getDishById, type Dish } from '../services/dishes'

// Dish details page
function DishDetailsPage() {
  const { id } = useParams()

  // Dish
  const [dish, setDish] = useState<Dish | null>(null)

  // Page states
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  // Load dish
  useEffect(() => {
    async function loadDish() {
      if (!id) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setIsError(false)

        const data = await getDishById(id)
        setDish(data)
      } catch {
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    void loadDish()
  }, [id])

  // Loading
  if (isLoading) {
    return <LoadingMessage />
  }

  // Error
  if (isError) {
    return <ErrorMessage />
  }

  // Dish not found
  if (!dish) {
    return <p>Dish not found</p>
  }

  return (
    <main>
      {/* Dish information */}
      <h1>{dish.name}</h1>
      <p>{dish.description}</p>
      <p>{dish.price} kr</p>
    </main>
  )
}

export default DishDetailsPage