import { Route, Routes } from 'react-router'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProfilePage } from './pages/ProfilePage'
import { RegisterPage } from './pages/RegisterPage'
import { StaffCreateDishPage } from './pages/staff/StaffCreateDishPage'
import { StaffDashboardPage } from './pages/staff/StaffDashboardPage'
import { StaffDishesPage } from './pages/staff/StaffDishesPage'
import { StaffEditDishPage } from './pages/staff/StaffEditDishPage'
import { StaffLayout } from './pages/staff/StaffLayout'
import { StaffOrderDetailPage } from './pages/staff/StaffOrderDetailPage'
import { StaffOrdersPage } from './pages/staff/StaffOrdersPage'

/**
 * Every view has its own URL, so the browser back and forward buttons work and
 * a route can be opened directly.
 */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Guarding the route only hides the views. What actually protects
            the data is the row level security in Supabase. */}
        <Route element={<ProtectedRoute role="staff" />}>
          <Route path="staff" element={<StaffLayout />}>
            <Route index element={<StaffDashboardPage />} />
            <Route path="dishes" element={<StaffDishesPage />} />
            <Route path="dishes/new" element={<StaffCreateDishPage />} />
            <Route path="dishes/:dishId" element={<StaffEditDishPage />} />
            <Route path="orders" element={<StaffOrdersPage />} />
            <Route path="orders/:orderId" element={<StaffOrderDetailPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
