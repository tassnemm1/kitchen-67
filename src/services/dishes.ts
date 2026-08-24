import { supabase } from '../lib/supabase'
import type { Dish } from '../types/database'

const DISH_COLUMNS =
  'id, name, description, category, price, image_path, is_active, created_at, updated_at'

export interface DishInput {
  name: string
  description: string
  category: string
  price: number
}

/**
 * Archived dishes are only returned when asked for. Row level security means a
 * customer gets nothing back even if they ask, apart from dishes that appear in
 * one of their own orders.
 */
export async function listDishes(includeArchived = false): Promise<Dish[]> {
  const query = supabase
    .from('dishes')
    .select(DISH_COLUMNS)
    .order('category')
    .order('name')

  const { data, error } = includeArchived
    ? await query
    : await query.eq('is_active', true)

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function getDish(id: string): Promise<Dish> {
  const { data, error } = await supabase
    .from('dishes')
    .select(DISH_COLUMNS)
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function createDish(input: DishInput): Promise<Dish> {
  const { data, error } = await supabase
    .from('dishes')
    .insert(input)
    .select(DISH_COLUMNS)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function updateDish(
  id: string,
  changes: Partial<DishInput> & { image_path?: string | null; is_active?: boolean },
): Promise<Dish> {
  const { data, error } = await supabase
    .from('dishes')
    .update(changes)
    .eq('id', id)
    .select(DISH_COLUMNS)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

/** Dishes are archived and brought back, never deleted. */
export async function setDishActive(id: string, isActive: boolean): Promise<Dish> {
  return updateDish(id, { is_active: isActive })
}
