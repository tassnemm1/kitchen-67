import { Link } from 'react-router-dom'
import { DataState } from '../../components/DataState'
import { useDishes } from '../../hooks/useDishes'
import { useOrders } from '../../hooks/useOrders'
import { ORDER_STATUS_LABELS, OPEN_ORDER_STATUSES } from '../../lib/orderStatus'
import type { OrderStatus } from '../../types/database'

const OPEN_STATUSES = OPEN_ORDER_STATUSES

export function StaffDashboardPage() {
  const dishes = useDishes(true)
  const orders = useOrders(OPEN_STATUSES)

  const allDishes = dishes.data ?? []
  const openOrders = orders.data ?? []

  const activeDishes = allDishes.filter((dish) => dish.is_active).length
  const archivedDishes = allDishes.length - activeDishes

  function countByStatus(status: OrderStatus) {
    return openOrders.filter((order) => order.status === status).length
  }

  return (
    <section className="staff__section">
      <div className="staff__intro">
        <h1>Staff dashboard</h1>
        <p>Everything waiting for the kitchen right now.</p>
      </div>

      <h2>Orders</h2>
      <DataState isLoading={orders.isLoading} error={orders.error}>
        <ul className="tiles">
          {OPEN_STATUSES.map((status) => (
            <li key={status} className="tile">
              <span className="tile__value">{countByStatus(status)}</span>
              <span className="tile__label">{ORDER_STATUS_LABELS[status]}</span>
            </li>
          ))}
        </ul>
        <Link to="/staff/orders">Go to the order overview</Link>
      </DataState>

      <h2>Menu</h2>
      <DataState isLoading={dishes.isLoading} error={dishes.error}>
        <ul className="tiles">
          <li className="tile">
            <span className="tile__value">{activeDishes}</span>
            <span className="tile__label">Active dishes</span>
          </li>
          <li className="tile">
            <span className="tile__value">{archivedDishes}</span>
            <span className="tile__label">Archived dishes</span>
          </li>
        </ul>
        <Link to="/staff/dishes">Manage the menu</Link>
      </DataState>
    </section>
  )
}
