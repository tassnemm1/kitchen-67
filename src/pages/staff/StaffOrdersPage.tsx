import { Link, useSearchParams } from 'react-router-dom'
import { AdvanceOrderButton } from '../../components/AdvanceOrderButton'
import { DataState } from '../../components/DataState'
import { OrderStatusBadge } from '../../components/OrderStatusBadge'
import { useOrders } from '../../hooks/useOrders'
import { formatDateTime, formatPrice } from '../../lib/format'
import { OPEN_ORDER_STATUSES } from '../../lib/orderStatus'

const OPEN_STATUSES = OPEN_ORDER_STATUSES

export function StaffOrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const showAll = searchParams.get('show') === 'all'

  // Both branches are stable values, which is what the hook needs to tell one
  // query from another.
  const { data, isLoading, error, reload } = useOrders(
    showAll ? undefined : OPEN_STATUSES,
  )
  const orders = data ?? []

  return (
    <section className="staff__section">
      <div className="staff__intro">
        <h1>Orders</h1>
        <p>Oldest first, so nothing is left waiting.</p>
      </div>

      <div className="filters" role="group" aria-label="Filter orders">
        <button
          type="button"
          className={`filters__item${showAll ? '' : ' filters__item--on'}`}
          aria-pressed={!showAll}
          onClick={() => setSearchParams({})}
        >
          Open
        </button>
        <button
          type="button"
          className={`filters__item${showAll ? ' filters__item--on' : ''}`}
          aria-pressed={showAll}
          onClick={() => setSearchParams({ show: 'all' })}
        >
          All
        </button>
      </div>

      <DataState
        isLoading={isLoading}
        error={error}
        isEmpty={orders.length === 0}
        emptyMessage={showAll ? 'No orders yet.' : 'No open orders right now.'}
        loadingMessage="Loading the orders…"
      >
        <ul className="order-list">
          {orders.map((order) => (
            <li key={order.id} className="order-row">
              <div className="order-row__head">
                <Link to={`/staff/orders/${order.id}`} className="order-row__number">
                  Order #{order.order_number}
                </Link>
                <OrderStatusBadge status={order.status} />
              </div>

              <p className="order-row__meta">
                {order.profiles?.full_name || 'Unnamed guest'} ·{' '}
                {formatDateTime(order.created_at)} · {formatPrice(order.total_amount)}
              </p>

              <AdvanceOrderButton
                orderId={order.id}
                status={order.status}
                onAdvanced={reload}
              />
            </li>
          ))}
        </ul>
      </DataState>
    </section>
  )
}
