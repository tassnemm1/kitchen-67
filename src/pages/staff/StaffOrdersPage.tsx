import { DataState } from '../../components/DataState'
import { OrderStatusBadge } from '../../components/OrderStatusBadge'
import { useOrders } from '../../hooks/useOrders'
import { formatDateTime, formatPrice } from '../../lib/format'
import { OPEN_ORDER_STATUSES } from '../../lib/orderStatus'

const OPEN_STATUSES = OPEN_ORDER_STATUSES

export function StaffOrdersPage() {
  const { data, isLoading, error } = useOrders(OPEN_STATUSES)
  const orders = data ?? []

  return (
    <section className="staff__section">
      <div className="staff__intro">
        <h1>Orders</h1>
        <p>Oldest first, so nothing is left waiting.</p>
      </div>

      <DataState
        isLoading={isLoading}
        error={error}
        isEmpty={orders.length === 0}
        emptyMessage="No open orders right now."
        loadingMessage="Loading the orders…"
      >
        <ul className="order-list">
          {orders.map((order) => (
            <li key={order.id} className="order-row">
              <div className="order-row__head">
                <span className="order-row__number">Order #{order.order_number}</span>
                <OrderStatusBadge status={order.status} />
              </div>

              <p className="order-row__meta">
                {order.profiles?.full_name || 'Unnamed guest'} ·{' '}
                {formatDateTime(order.created_at)} · {formatPrice(order.total_amount)}
              </p>
            </li>
          ))}
        </ul>
      </DataState>
    </section>
  )
}
