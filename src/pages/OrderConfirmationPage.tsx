import { Link, useLocation } from 'react-router-dom'

// Order type
type Order = {
  id: string
  order_number: number
  status: string
  total_amount: number
}

// Navigation state
type ConfirmationState = {
  order: Order
}

// Order confirmation page
function OrderConfirmationPage() {
  const location = useLocation() as {
    state: ConfirmationState | null
  }

  // Get order from checkout
  const state = location.state
  const order = state?.order

  // No order data
  if (!order) {
    return (
      <main>
        <h1>Order Confirmation</h1>

        <p>No order information found.</p>

        <Link to="/">Back to Menu</Link>
      </main>
    )
  }

  return (
    <main>
      {/* Page title */}
      <h1>Order Confirmation</h1>

      {/* Success message */}
      <p>Your order has been placed successfully.</p>

      {/* Order information */}
      <p>Order number: #{order.order_number}</p>
      <p>Status: {order.status}</p>

      {/* Order total */}
      <p>
        <strong>Total: {order.total_amount} kr</strong>
      </p>

      {/* Navigation */}
      <Link to="/">Back to Menu</Link>

      <br />

      <Link to="/orders">My Orders</Link>
    </main>
  )
}

export default OrderConfirmationPage