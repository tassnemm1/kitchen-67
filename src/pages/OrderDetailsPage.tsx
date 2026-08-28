import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import LoadingMessage from '../components/LoadingMessage'
import ErrorMessage from '../components/ErrorMessage'

import {
  getCustomerOrderById,
  type CustomerOrderDetails,
} from '../services/orders'

// Order details page
function OrderDetailsPage() {
  const { id } = useParams()

  // Order
  const [order, setOrder] = useState<CustomerOrderDetails | null>(null)

  // Page states
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  // Load order
  useEffect(() => {
    async function loadOrder() {
      if (!id) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setIsError(false)

        const data = await getCustomerOrderById(id)
        setOrder(data)
      } catch {
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    void loadOrder()
  }, [id])

  // Loading
  if (isLoading) {
    return <LoadingMessage />
  }

  // Error
  if (isError) {
    return <ErrorMessage />
  }

  // Order not found
  if (!order) {
    return <p>Order not found.</p>
  }

  return (
    <main>
      {/* Page title */}
      <h1>Order #{order.order_number}</h1>

      {/* Order status */}
      <p>Status: {order.status}</p>

      {/* Order items */}
      <h2>Order items</h2>

      {order.items.map((item) => (
        <div key={item.id}>
          {/* The dish as it was ordered. It may since have left the menu, which
              is why this leads to the order's own copy of it. */}
          <h3>
            <Link to={`/orders/${order.id}/dishes/${item.dish_id}`}>
              {item.dish_name}
            </Link>
          </h3>
          <p>Quantity: {item.quantity}</p>
          <p>Price: {item.unit_price} kr</p>
          <p>Line total: {item.line_total} kr</p>
        </div>
      ))}

      {/* Order total */}
      <p>
        <strong>Total: {order.total_amount} kr</strong>
      </p>

      {/* Back to orders */}
      <Link to="/orders">
        <button type="button">Back to My Orders</button>
      </Link>
    </main>
  )
}

export default OrderDetailsPage