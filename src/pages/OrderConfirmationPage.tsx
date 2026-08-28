import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import LoadingMessage from '../components/LoadingMessage'
import {
  getCustomerOrderById,
  type CustomerOrderDetails,
} from '../services/orders'

function OrderConfirmationPage() {
  const { id } = useParams()
  const [order, setOrder] = useState<CustomerOrderDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    async function loadOrder() {
      if (!id) {
        setIsLoading(false)
        return
      }

      try {
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

  if (isLoading) return <LoadingMessage />
  if (isError) return <ErrorMessage />
  if (!order) return <p>Order not found.</p>

  return (
    <main>
      <h1>Order Confirmation</h1>
      <p>Your order has been placed successfully.</p>
      <p>Order number: #{order.order_number}</p>
      <p>Status: {order.status}</p>

      <h2>Your order</h2>

      {order.items.map((item) => (
        <div key={item.id}>
          <p>
            {item.quantity} × {item.dish_name}
          </p>
          <p>{item.line_total} kr</p>
        </div>
      ))}

      <p>
        <strong>Total: {order.total_amount} kr</strong>
      </p>

      <Link to="/menu">Back to Menu</Link>
      <br />
      <Link to="/orders">My Orders</Link>
    </main>
  )
}

export default OrderConfirmationPage
