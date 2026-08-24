import { NavLink, Outlet } from 'react-router'
import './staff.css'

/** Frame and sub navigation shared by every staff view. */
export function StaffLayout() {
  return (
    <div className="staff">
      <nav className="staff__nav" aria-label="Staff area">
        <NavLink to="/staff" end>
          Dashboard
        </NavLink>
        <NavLink to="/staff/dishes">Dishes</NavLink>
        <NavLink to="/staff/orders">Orders</NavLink>
      </nav>

      <Outlet />
    </div>
  )
}
