import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import LoadingMessage from '../components/LoadingMessage'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'

import {
  getCustomerOrders,
  type CustomerOrder,
} from '../services/orders'

// Customer order history page
function OrderHistoryPage() {
  // Orders
  const [orders, setOrders] = useState<CustomerOrder[]>([])

  // Page states
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  // Load orders
  useEffect(() => {
    async function loadOrders() {
      try {
        setIsLoading(true)
        setIsError(false)

        const data = await getCustomerOrders()
        setOrders(data)
      } catch {
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    void loadOrders()
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
      <h1>My Orders</h1>

      {/* No orders */}
      {orders.length === 0 && <EmptyState />}

      {/* Order list */}
      {orders.map((order) => (
        <div key={order.id}>
          {/* Order link */}
          <h2>
            <Link to={`/orders/${order.id}`}>
              Order #{order.order_number}
            </Link>
          </h2>

          {/* Order information */}
          <p>Status: {order.status}</p>
          <p>Total: {order.total_amount} kr</p>
        </div>
      ))}
    </main>
  )
}

export default OrderHistoryPage