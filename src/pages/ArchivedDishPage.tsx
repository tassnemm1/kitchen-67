import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import LoadingMessage from '../components/LoadingMessage'
import ErrorMessage from '../components/ErrorMessage'

import { getDish, type Dish } from '../services/dishes'
import {
  getCustomerOrderById,
  type CustomerOrderItem,
} from '../services/orders'

/**
 * A dish as it was when it was ordered.
 *
 * The menu drops a dish once it is archived, but an old order still names it.
 * Row level security lets a customer read a dish they have ordered, archived or
 * not, which is what makes this page possible at all.
 *
 * The price comes from the order line rather than the dish, because the dish
 * may have been repriced since.
 */
function ArchivedDishPage() {
  const { orderId, dishId } = useParams()

  // Dish and the line it was ordered on
  const [dish, setDish] = useState<Dish | null>(null)
  const [item, setItem] = useState<CustomerOrderItem | null>(null)

  // Page states
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  // Load the dish and the order line
  useEffect(() => {
    async function load() {
      if (!orderId || !dishId) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setIsError(false)

        const [loadedDish, order] = await Promise.all([
          getDish(dishId),
          getCustomerOrderById(orderId),
        ])

        setDish(loadedDish)
        setItem(order?.items.find((line) => line.dish_id === dishId) ?? null)
      } catch {
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    void load()
  }, [orderId, dishId])

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
    return <p>This dish could not be found.</p>
  }

  return (
    <main>
      {/* Page title */}
      <h1>{dish.name}</h1>

      {/* Dish information */}
      <p>{dish.description}</p>

      {/* What it cost on this order */}
      {item && (
        <>
          <p>Price at order: {item.unit_price} kr</p>
          <p>Quantity: {item.quantity}</p>
        </>
      )}

      {/* Whether it is still on the menu */}
      {dish.is_active ? (
        <p>This dish is still on the menu.</p>
      ) : (
        <p>This dish is no longer available to order.</p>
      )}

      {/* Back to order */}
      <Link to={`/orders/${orderId}`}>
        <button type="button">Back to Order</button>
      </Link>
    </main>
  )
}

export default ArchivedDishPage
