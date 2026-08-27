import { Link, useLocation } from 'react-router-dom'

// Order type
type Order = {
  id: string
  order_number: number
  status: string
  total_amount: number
}

// Order item type
type OrderItem = {
  id: string
  name: string
  price: number
  quantity: number
}

// Navigation state
type ConfirmationState = {
  order: Order
  items: OrderItem[]
}

// Order confirmation page
function OrderConfirmationPage() {
  const location = useLocation() as {
    state: ConfirmationState | null
  }

  // Get order and items from checkout
  const state = location.state
  const order = state?.order
  const items = state?.items ?? []

  // No order data
  if (!order) {
    return (
      <main>
        <h1>Order Confirmation</h1>

        <p>No order information found.</p>

        <Link to="/menu">Back to Menu</Link>
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

      {/* Order items */}
      <h2>Your order</h2>

      {items.map((item) => (
        <div key={item.id}>
          <p>
            {item.quantity} × {item.name}
          </p>

          <p>{item.price * item.quantity} kr</p>
        </div>
      ))}

      {/* Order total */}
      <p>
        <strong>Total: {order.total_amount} kr</strong>
      </p>

      {/* Navigation */}
      <Link to="/menu">Back to Menu</Link>

      <br />

      <Link to="/orders">My Orders</Link>
    </main>
  )
}

export default OrderConfirmationPage