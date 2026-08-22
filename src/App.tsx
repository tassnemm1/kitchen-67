import { Routes, Route } from 'react-router-dom'
import MenuPage from './pages/MenuPage'
import DishDetailsPage from './pages/DishDetailsPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import OrderDetailsPage from './pages/OrderDetailsPage'
import ArchivedDishPage from './pages/ArchivedDishPage'
import './App.css'

// Main application routes
function App() {
  return (
    <Routes>
      {/* Menu */}
      <Route path="/" element={<MenuPage />} />

      {/* Dish details */}
      <Route path="/dishes/:id" element={<DishDetailsPage />} />

      {/* Shopping cart */}
      <Route path="/cart" element={<CartPage />} />

      {/* Checkout */}
      <Route path="/checkout" element={<CheckoutPage />} />

      {/* Order confirmation */}
      <Route
        path="/order-confirmation"
        element={<OrderConfirmationPage />}
      />

      {/* Customer order history */}
      <Route path="/orders" element={<OrderHistoryPage />} />

      {/* Customer order details */}
      <Route path="/orders/:id" element={<OrderDetailsPage />} />

      {/* Archived dish from order history */}
      <Route
        path="/orders/:orderId/dishes/:dishId"
        element={<ArchivedDishPage />}
      />
    </Routes>
  )
}

export default App