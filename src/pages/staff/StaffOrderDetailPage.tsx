import { Link, useParams } from 'react-router'
import { DataState } from '../../components/DataState'
import { OrderStatusBadge } from '../../components/OrderStatusBadge'
import { useOrder } from '../../hooks/useOrders'
import { formatDateTime } from '../../lib/format'

export function StaffOrderDetailPage() {
  const { orderId } = useParams()
  const { data: order, isLoading, error } = useOrder(orderId)

  return (
    <section className="staff__section">
      <DataState isLoading={isLoading} error={error} loadingMessage="Loading the order…">
        {order && (
          <>
            <div className="staff__intro">
              <h1>Order #{order.order_number}</h1>
              <p>
                {order.profiles?.full_name || 'Unnamed guest'} ·{' '}
                {formatDateTime(order.created_at)}
              </p>
            </div>

            <p>
              Current status: <OrderStatusBadge status={order.status} />
            </p>

            <Link to="/staff/orders">Back to the orders</Link>
          </>
        )}
      </DataState>
    </section>
  )
}
