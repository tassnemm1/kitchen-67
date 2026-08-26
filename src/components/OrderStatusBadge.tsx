import { ORDER_STATUS_LABELS } from '../lib/orderStatus'
import type { OrderStatus } from '../types/database'
import './OrderStatusBadge.css'

interface OrderStatusBadgeProps {
  status: OrderStatus
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span className={`status-badge status-badge--${status}`}>
      {ORDER_STATUS_LABELS[status]}
    </span>
  )
}
