import { Link, useParams } from 'react-router'
import { DataState } from '../../components/DataState'
import { OrderStatusBadge } from '../../components/OrderStatusBadge'
import { useOrder } from '../../hooks/useOrders'
import { formatDateTime, formatPrice } from '../../lib/format'
import { ORDER_STATUS_LABELS } from '../../lib/orderStatus'
import { ORDER_STATUS_FLOW } from '../../types/database'

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

            {/* The order walks this flow one step at a time, which a trigger
                in the database enforces. */}
            <ol className="flow">
              {ORDER_STATUS_FLOW.map((status) => (
                <li
                  key={status}
                  className={`flow__step${status === order.status ? ' flow__step--on' : ''}`}
                >
                  {ORDER_STATUS_LABELS[status]}
                </li>
              ))}
            </ol>

            <p>
              Current status: <OrderStatusBadge status={order.status} />
            </p>

            <h2>What was ordered</h2>
            <table className="order-table">
              <thead>
                <tr>
                  <th scope="col">Dish</th>
                  <th scope="col">Qty</th>
                  <th scope="col">Price</th>
                  <th scope="col">Sum</th>
                </tr>
              </thead>
              <tbody>
                {order.order_items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.dish_name}</td>
                    <td>{item.quantity}</td>
                    <td>{formatPrice(item.unit_price)}</td>
                    <td>{formatPrice(item.line_total)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row" colSpan={3}>
                    Total
                  </th>
                  <td>{formatPrice(order.total_amount)}</td>
                </tr>
              </tfoot>
            </table>

            {order.note && (
              <div className="staff__note">
                <h2>Note from the guest</h2>
                <p>{order.note}</p>
              </div>
            )}

            <Link to="/staff/orders">Back to the orders</Link>
          </>
        )}
      </DataState>
    </section>
  )
}
