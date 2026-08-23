import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import LoadingMessage from '../components/LoadingMessage'
import ErrorMessage from '../components/ErrorMessage'

import { getDishById, type Dish } from '../services/dishes'

// Cart item type
type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
}

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

  // Add dish to cart
  function addToCart() {
    if (!dish) {
      return
    }

    const savedCart = localStorage.getItem('cart')
    const cart: CartItem[] = savedCart
      ? JSON.parse(savedCart)
      : []

    const existingItem = cart.find((item) => item.id === dish.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({
        id: dish.id,
        name: dish.name,
        price: dish.price,
        quantity: 1,
      })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
  }

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

      {/* Add to cart */}
      <button type="button" onClick={addToCart}>
        Add to Cart
      </button>

      {/* Go to cart */}
      <Link to="/cart">
        <button type="button">View Cart</button>
      </Link>
    </main>
  )
}

export default DishDetailsPage