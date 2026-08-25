import { supabase } from '../lib/supabase'

// Dish type
export interface Dish {
  id: string
  name: string
  description: string | null
  category: string
  price: number
  image_path: string | null
  is_active: boolean
}

// Get active dishes
export async function getActiveDishes(): Promise<Dish[]> {
  const { data, error } = await supabase
    .from('dishes')
    .select(
      'id, name, description, category, price, image_path, is_active',
    )
    .eq('is_active', true)
    .order('name')

  if (error) {
    throw error
  }

  return data
}

// Get one active dish
export async function getDishById(
  id: string,
): Promise<Dish | null> {
  const { data, error } = await supabase
    .from('dishes')
    .select(
      'id, name, description, category, price, image_path, is_active',
    )
    .eq('id', id)
    .eq('is_active', true)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data
}