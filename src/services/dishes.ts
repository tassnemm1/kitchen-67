import { supabase } from '../lib/supabase'
import type { Dish } from '../types/database'

/** Re-exported so the customer pages can keep importing the type from here. */
export type { Dish }

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

/** The menu the guests see, in plain alphabetical order. */
export async function getActiveDishes(): Promise<Dish[]> {
  const { data, error } = await supabase
    .from('dishes')
    .select(DISH_COLUMNS)
    .eq('is_active', true)
    .order('name')

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

/**
 * The guest facing lookup. An archived dish is treated as missing here, which
 * is why it returns null instead of throwing.
 */
export async function getDishById(id: string): Promise<Dish | null> {
  const { data, error } = await supabase
    .from('dishes')
    .select(DISH_COLUMNS)
    .eq('id', id)
    .eq('is_active', true)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function createDish(input: DishInput): Promise<Dish> {
  const { data, error } = await supabase
    .from('dishes')
    .insert({ ...input, is_active: false })
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
  // An active dish must have an image
  if (isActive) {
    const dish = await getDish(id)

    if (!dish.image_path) {
      throw new Error('Add an image before activating the dish.')
    }
  }

  return updateDish(id, { is_active: isActive })
}
