import { Link } from 'react-router-dom'

// Test orders
const orders = [
  {
    id: 1001,
    status: 'Obehandlad',
    total: 248,
  },
  {
    id: 1002,
    status: 'Upphämtad',
    total: 129,
  },
]

// Customer order history page
function OrderHistoryPage() {
  return (
    <main>
      {/* Page title */}
      <h1>My Orders</h1>

      {/* Order list */}
      {orders.map((order) => (
        <div key={order.id}>
          {/* Link to order details */}
          <h2>
            <Link to={`/orders/${order.id}`}>
              Order #{order.id}
            </Link>
          </h2>

          {/* Order information */}
          <p>Status: {order.status}</p>
          <p>Total: {order.total} kr</p>
        </div>
      ))}
    </main>
  )
}

export default OrderHistoryPage