import { Link, useParams } from 'react-router-dom'

// Test order
const order = {
  id: 1001,
  status: 'Obehandlad',
  total: 248,
  items: [
    {
      id: 1,
      name: 'Margherita Pizza',
      quantity: 1,
      price: 119,
    },
    {
      id: 2,
      name: 'Chicken Burger',
      quantity: 1,
      price: 129,
    },
  ],
}

// Order details page
function OrderDetailsPage() {
  const { id } = useParams()

  return (
    <main>
      {/* Page title */}
      <h1>Order #{id}</h1>

      {/* Order status */}
      <p>Status: {order.status}</p>

      {/* Order items */}
      <h2>Order items</h2>

      {order.items.map((item) => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <p>Quantity: {item.quantity}</p>
          <p>Price: {item.price} kr</p>
        </div>
      ))}

      {/* Order total */}
      <p>
        <strong>Total: {order.total} kr</strong>
      </p>

      {/* Back to orders */}
      <Link to="/orders">
        <button type="button">Back to My Orders</button>
      </Link>
    </main>
  )
}

export default OrderDetailsPage