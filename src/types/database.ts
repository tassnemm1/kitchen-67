/**
 * The domain types the app is written against.
 *
 * The schema itself is described in `database.generated.types.ts`, which the
 * Supabase CLI writes from the live database. Everything here is derived from
 * that file rather than typed out a second time, so a column that changes in
 * the database turns into a type error here instead of the two quietly drifting
 * apart.
 */

import type { Database } from './database.generated.types'

type Tables = Database['public']['Tables']
type Enums = Database['public']['Enums']

export type UserRole = Enums['user_role']

/** Obehandlad -> Tillagas -> Klar för upphämtning -> Upphämtad. */
export type OrderStatus = Enums['order_status']

/** The only moves the database accepts, in order. */
export const ORDER_STATUS_FLOW: readonly OrderStatus[] = [
  'pending',
  'preparing',
  'ready',
  'picked_up',
]

export type Profile = Tables['profiles']['Row']
export type Dish = Tables['dishes']['Row']
export type Order = Tables['orders']['Row']

/**
 * line_total is a generated column, so the database always fills it in. The
 * generated types still call it nullable, and this is the one place the domain
 * deliberately claims more than the schema does. The services that read it fall
 * back to unit_price * quantity, so the promise holds.
 */
export type OrderItem = Omit<Tables['order_items']['Row'], 'line_total'> & {
  line_total: number
}
