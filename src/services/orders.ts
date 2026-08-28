import { supabase } from '../lib/supabase'
import type { Order, OrderItem, OrderStatus } from '../types/database'

const ORDER_COLUMNS =
  'id, order_number, customer_id, status, total_amount, note, created_at, updated_at'

const ORDER_ITEM_COLUMNS =
  'id, order_id, dish_id, dish_name, unit_price, quantity, line_total, selected_options'

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

  // line_total is a generated column, so the database always fills it in. The
  // generated types still call it nullable, hence the fallback.
  return {
    ...data,
    order_items: data.order_items.map((item) => ({
      ...item,
      line_total: item.line_total ?? item.unit_price * item.quantity,
    })),
  }
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

// ---------------------------------------------------------------------------
// The guest facing side of ordering.
// ---------------------------------------------------------------------------

// Cart item
export type OrderCartItem = {
  id: string
  name: string
  price: number
  quantity: number
  options?: {
    optionId: string
    name: string
    removed: boolean
    extraQuantity: number
    extraPrice: number
  }[]
}

// Customer order
export type CustomerOrder = {
  id: string
  order_number: number
  status: string
  total_amount: number
  created_at: string
}

// Order item
export type CustomerOrderItem = {
  id: string
  dish_id: string
  dish_name: string
  unit_price: number
  quantity: number
  line_total: number
}

// Order details
export type CustomerOrderDetails = {
  id: string
  order_number: number
  status: string
  total_amount: number
  items: CustomerOrderItem[]
}

// Create order
export async function createOrder(
  cartItems: OrderCartItem[],
  note = '',
) {
  // Get logged in user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  // No session at all is the ordinary case for a guest who never logged in.
  // Supabase reports it as an error, but "Auth session missing!" is not a
  // sentence to put in front of someone who just wants their food.
  if (!user) {
    throw new Error('You must be logged in to place an order.')
  }

  if (userError) {
    throw new Error(userError.message)
  }

  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_id: user.id,
      note,
    })
    .select('id, order_number')
    .single()

  if (orderError) {
    throw orderError
  }

  // Add order items
  const items = cartItems.map((item) => ({
    order_id: order.id,
    dish_id: item.id,
    dish_name: item.name,
    unit_price: item.price,
    quantity: item.quantity,
    selected_options: item.options ?? [],
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(items)

  if (itemsError) {
    throw itemsError
  }

  // Get finished order
  const { data: finishedOrder, error: finishedOrderError } =
    await supabase
      .from('orders')
      .select('id, order_number, status, total_amount')
      .eq('id', order.id)
      .single()

  if (finishedOrderError) {
    throw finishedOrderError
  }

  return finishedOrder
}

// Get customer orders
export async function getCustomerOrders(): Promise<CustomerOrder[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('id, order_number, status, total_amount, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data
}

// Get one customer order
export async function getCustomerOrderById(
  id: string,
): Promise<CustomerOrderDetails | null> {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id, order_number, status, total_amount')
    .eq('id', id)
    .maybeSingle()

  if (orderError) {
    throw orderError
  }

  if (!order) {
    return null
  }

  // Get order items
  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select(
      'id, dish_id, dish_name, unit_price, quantity, line_total',
    )
    .eq('order_id', id)

  if (itemsError) {
    throw itemsError
  }

  return {
    ...order,
    items: items.map((item) => ({
      ...item,
      line_total:
        item.line_total ?? item.unit_price * item.quantity,
    })),
  }
}
