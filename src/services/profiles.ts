import { supabase } from '../lib/supabase'
import type { Profile } from '../types/database'

const PROFILE_COLUMNS = 'id, full_name, role, created_at'

export async function getProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_COLUMNS)
    .eq('id', userId)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

/**
 * Updates the parts of a profile the owner is allowed to change. The role is
 * deliberately not part of this, and the database blocks it as well.
 */
export async function updateProfile(
  userId: string,
  changes: { full_name: string },
): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update(changes)
    .eq('id', userId)
    .select(PROFILE_COLUMNS)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}
