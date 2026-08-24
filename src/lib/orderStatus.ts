import type { OrderStatus } from '../types/database'

/** Every status except the one an order starts in. */
export type ForwardOrderStatus = Exclude<OrderStatus, 'pending'>

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Unhandled',
  preparing: 'Preparing',
  ready: 'Ready for pickup',
  picked_up: 'Picked up',
}

/** What the button that moves an order forward should say. */
export const ORDER_STATUS_ACTIONS: Record<ForwardOrderStatus, string> = {
  preparing: 'Confirm order',
  ready: 'Mark as ready for pickup',
  picked_up: 'Mark as picked up',
}

/** Orders the kitchen still has work left on. */
export const OPEN_ORDER_STATUSES: readonly OrderStatus[] = [
  'pending',
  'preparing',
  'ready',
]

/**
 * The single step the database allows from here, or null when the order is
 * finished. A trigger rejects anything that skips ahead, so the interface only
 * ever offers the one move that will actually go through.
 */
export function nextOrderStatus(status: OrderStatus): ForwardOrderStatus | null {
  switch (status) {
    case 'pending':
      return 'preparing'
    case 'preparing':
      return 'ready'
    case 'ready':
      return 'picked_up'
    case 'picked_up':
      return null
  }
}
