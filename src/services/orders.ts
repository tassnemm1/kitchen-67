import { supabase } from '../lib/supabase'

// Cart item
export type OrderCartItem = {
  id: string
  name: string
  price: number
  quantity: number
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

  if (userError) {
    throw userError
  }

  if (!user) {
    throw new Error('You must be logged in to place an order.')
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
