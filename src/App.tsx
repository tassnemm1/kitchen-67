import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'

import { HomePage } from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import DishDetailsPage from './pages/DishDetailsPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import OrderDetailsPage from './pages/OrderDetailsPage'
import ArchivedDishPage from './pages/ArchivedDishPage'

import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProfilePage } from './pages/ProfilePage'
import { RegisterPage } from './pages/RegisterPage'

import './App.css'

// Main application routes
function App() {
  return (
    <Routes>
      {/* Welcome page */}
      <Route index element={<HomePage />} />

      {/* Main application */}
      <Route element={<Layout />}>
        {/* Menu */}
        <Route path="menu" element={<MenuPage />} />

        {/* Authentication */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Dish details */}
        <Route path="dishes/:id" element={<DishDetailsPage />} />

        {/* Shopping cart */}
        <Route path="cart" element={<CartPage />} />

        {/* Checkout */}
        <Route path="checkout" element={<CheckoutPage />} />

        {/* Order confirmation */}
        <Route
          path="order-confirmation"
          element={<OrderConfirmationPage />}
        />

        {/* Customer order history */}
        <Route path="orders" element={<OrderHistoryPage />} />

        {/* Customer order details */}
        <Route path="orders/:id" element={<OrderDetailsPage />} />

        {/* Archived dish from order history */}
        <Route
          path="orders/:orderId/dishes/:dishId"
          element={<ArchivedDishPage />}
        />

        {/* Protected pages */}
        <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Not found */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App