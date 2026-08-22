/**
 * Shape of the Supabase schema, kept in sync by hand with the SQL files in
 * `supabase/migrations`. Passing it to `createClient` makes every query and
 * mutation fully typed, so no `any` leaks into the app.
 */

export type UserRole = 'customer' | 'staff'

export interface Profile {
  id: string
  full_name: string
  role: UserRole
  created_at: string
}

export interface Database {
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
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      is_staff: {
        Args: Record<string, never>
        Returns: boolean
      }
    }
    Enums: {
      user_role: UserRole
    }
    CompositeTypes: Record<string, never>
  }
}
