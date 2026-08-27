import { Link, useParams } from 'react-router-dom'

// Archived dish page
function ArchivedDishPage() {
  const { orderId } = useParams()

  return (
    <main>
      {/* Page title */}
      <h1>Archived Dish</h1>

      {/* Dish information */}
      <h2>Old Pasta</h2>
      <p>This dish was part of a previous order.</p>
      <p>Price at order: 109 kr</p>

      {/* Archived message */}
      <p>This dish is no longer available to order.</p>

      {/* Back to order */}
      <Link to={`/orders/${orderId}`}>
        <button type="button">Back to Order</button>
      </Link>
    </main>
  )
}

export default ArchivedDishPage