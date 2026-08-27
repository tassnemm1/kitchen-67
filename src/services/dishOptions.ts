import { supabase } from '../lib/supabase'

// Type for a dish option/ingredient
export type DishOption = {
  id: string
  dish_id: string
  name: string
  extra_price: number
  can_remove: boolean
  max_extra: number
}

// Get all options for one dish
export async function getDishOptions(
  dishId: string,
): Promise<DishOption[]> {

  // Get options from Supabase
  const { data, error } = await supabase
    .from('dish_options')
    .select(
      'id, dish_id, name, extra_price, can_remove, max_extra',
    )
    // Only get options for the selected dish
    .eq('dish_id', dishId)
    // Sort options by name
    .order('name')

  // Stop if Supabase returns an error
  if (error) {
    throw error
  }

  // Return the dish options
  return data.map((option) => ({
    id: option.id,
    dish_id: option.dish_id ?? dishId,
    name: option.name ?? '',
    extra_price: option.extra_price ?? 0,
    can_remove: option.can_remove,
    max_extra: option.max_extra,
  }))
}
