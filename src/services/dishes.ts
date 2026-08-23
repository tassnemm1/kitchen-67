import { supabase } from '../lib/supabase'

// Dish type
export interface Dish {
  id: string
  name: string
  description: string | null
  price: number
  is_active: boolean
}

// Get active dishes
export async function getActiveDishes(): Promise<Dish[]> {
  const { data, error } = await supabase
    .from('dishes')
    .select('id, name, description, price, is_active')
    .eq('is_active', true)
    .order('name')

  if (error) {
    throw error
  }

  return data
}