import { useState } from 'react'
import type { ChangeEvent } from 'react'
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  getDishImageUrl,
  removeDishImage,
  uploadDishImage,
} from '../services/dishImages'
import { updateDish } from '../services/dishes'
import type { Dish } from '../types/database'
import './DishImageUploader.css'

interface DishImageUploaderProps {
  dish: Dish
  /** Called once the dish points at the new file, so the view can reload. */
  onChanged: () => void
}

export function DishImageUploader({ dish, onChanged }: DishImageUploaderProps) {
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const imageUrl = getDishImageUrl(dish.image_path)

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    // Clear the input so picking the same file twice still fires a change.
    event.target.value = ''

    if (!file) return

    setError(null)

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError('Pick a JPG, PNG or WebP image.')
      return
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setError('The image is larger than 5 MB.')
      return
    }

    setIsUploading(true)
    const previousPath = dish.image_path

    try {
      const path = await uploadDishImage(dish.id, file)
      await updateDish(dish.id, { image_path: path })

      if (previousPath) {
        // A leftover file is harmless, the dish already points at the new one.
        await removeDishImage(previousPath).catch(() => undefined)
      }

      onChanged()
    } catch (caught: unknown) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'Could not upload the image. Please try again.',
      )
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="dish-image">
      <h2>Main image</h2>

      {imageUrl ? (
        <img className="dish-image__preview" src={imageUrl} alt={dish.name} />
      ) : (
        <p className="dish-image__empty status">No image uploaded yet.</p>
      )}

      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}

      <label className="dish-image__picker">
        <span className="button button--quiet">
          {isUploading
            ? 'Uploading…'
            : imageUrl
              ? 'Change image'
              : 'Upload image'}
        </span>
        <input
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(',')}
          disabled={isUploading}
          onChange={(event) => void handleFile(event)}
        />
      </label>

      <p className="dish-image__hint">JPG, PNG or WebP. Up to 5 MB.</p>
    </div>
  )
}
