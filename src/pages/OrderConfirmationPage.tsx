// Test order items
const orderItems = [
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
]

// Order confirmation page
function OrderConfirmationPage() {
  return (
    <main>
      {/* Page title */}
      <h1>Order Confirmation</h1>

      {/* Order information */}
      <p>Order number: #1001</p>
      <p>Status: Obehandlad</p>

      {/* Order items */}
      <h2>Your order</h2>

      {orderItems.map((item) => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <p>Quantity: {item.quantity}</p>
          <p>Price: {item.price} kr</p>
        </div>
      ))}

      {/* Order total */}
      <p>
        <strong>Total: 248 kr</strong>
      </p>
    </main>
  )
}

export default OrderConfirmationPage