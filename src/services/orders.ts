import { supabase } from '../lib/supabase'
import type { Order, OrderItem, OrderStatus } from '../types/database'

const ORDER_COLUMNS =
  'id, order_number, customer_id, status, total_amount, note, created_at, updated_at'

const ORDER_ITEM_COLUMNS =
  'id, order_id, dish_id, dish_name, unit_price, quantity, line_total'

/** The customer name is embedded through orders.customer_id -> profiles.id. */
export interface OrderListItem extends Order {
  profiles: { full_name: string } | null
}

export interface OrderDetail extends OrderListItem {
  order_items: OrderItem[]
}

/**
 * Staff see every order, a customer only their own. That split lives in the
 * row level security policies, not here, so the same function serves both.
 */
export async function listOrders(
  statuses?: readonly OrderStatus[],
): Promise<OrderListItem[]> {
  const query = supabase
    .from('orders')
    .select(`${ORDER_COLUMNS}, profiles(full_name)`)
    .order('created_at', { ascending: true })

  const { data, error } = statuses
    ? await query.in('status', statuses)
    : await query

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function getOrder(id: string): Promise<OrderDetail> {
  const { data, error } = await supabase
    .from('orders')
    .select(
      `${ORDER_COLUMNS}, profiles(full_name), order_items(${ORDER_ITEM_COLUMNS})`,
    )
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

/**
 * Moves an order one step forward. The database rejects anything that skips a
 * step or comes from someone who is not staff, so this is only the request.
 */
export async function setOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select(ORDER_COLUMNS)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}
