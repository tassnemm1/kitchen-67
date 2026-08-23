/**
 * Shape of the Supabase schema, kept in sync by hand with the SQL files in
 * `supabase/migrations`. Passing it to `createClient` makes every query and
 * mutation fully typed, so no `any` leaks into the app.
 *
 * The row types are written as type aliases rather than interfaces on purpose.
 * Supabase requires every row to be assignable to `Record<string, unknown>`,
 * and an interface never is, which quietly turns every query result into
 * `never`.
 */

export type UserRole = 'customer' | 'staff'

/** Obehandlad -> Tillagas -> Klar för upphämtning -> Upphämtad. */
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'picked_up'

/** The only moves the database accepts, in order. */
export const ORDER_STATUS_FLOW: readonly OrderStatus[] = [
  'pending',
  'preparing',
  'ready',
  'picked_up',
]

export type Profile = {
  id: string
  full_name: string
  role: UserRole
  created_at: string
}

export type Dish = {
  id: string
  name: string
  description: string
  category: string
  price: number
  /** Path inside the storage bucket, or null while no image is uploaded. */
  image_path: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export type Order = {
  id: string
  order_number: number
  customer_id: string
  status: OrderStatus
  total_amount: number
  note: string
  created_at: string
  updated_at: string
}

export type OrderItem = {
  id: string
  order_id: string
  dish_id: string
  /** Copied from the dish when the order was placed. */
  dish_name: string
  /** The price that applied when the order was placed. */
  unit_price: number
  quantity: number
  line_total: number
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: {
          id: string
          full_name?: string
          role?: UserRole
          created_at?: string
        }
        Update: {
          full_name?: string
          role?: UserRole
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      dishes: {
        Row: Dish
        Insert: {
          id?: string
          name: string
          description?: string
          category: string
          price: number
          image_path?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          description?: string
          category?: string
          price?: number
          image_path?: string | null
          is_active?: boolean
        }
        Relationships: []
      }
      orders: {
        Row: Order
        Insert: {
          id?: string
          customer_id: string
          note?: string
          created_at?: string
          // status and total_amount are forced by the database on insert.
        }
        Update: {
          status?: OrderStatus
          note?: string
        }
        Relationships: [
          {
            foreignKeyName: 'orders_customer_id_fkey'
            columns: ['customer_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      order_items: {
        Row: OrderItem
        Insert: {
          id?: string
          order_id: string
          dish_id: string
          quantity: number
          // dish_name and unit_price are copied from the menu by the database.
        }
        Update: {
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: 'order_items_order_id_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'order_items_dish_id_fkey'
            columns: ['dish_id']
            isOneToOne: false
            referencedRelation: 'dishes'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_staff: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      user_role: UserRole
      order_status: OrderStatus
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
