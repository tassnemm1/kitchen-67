import { supabase } from '../lib/supabase'

const BUCKET = 'dish-images'

/** Files the bucket accepts, checked again by the form before uploading. */
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024

/**
 * Uploads a new file and returns the path to store on the dish. Each upload
 * gets its own name, so a replaced image never sits in a browser cache under
 * the old URL.
 */
export async function uploadDishImage(dishId: string, file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const path = `${dishId}/${crypto.randomUUID()}.${extension}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  })

  if (error) {
    throw new Error(error.message)
  }

  return path
}

export function getDishImageUrl(path: string | null): string | null {
  if (!path) {
    return null
  }

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

export async function removeDishImage(path: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).remove([path])

  if (error) {
    throw new Error(error.message)
  }
}
