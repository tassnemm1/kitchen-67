import { useState } from 'react'
import { Link } from 'react-router-dom'

import { supabase } from '../lib/supabase'

// Cart item type
type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
}

// Dish card props
type DishCardProps = {
  id: string
  name: string
  description: string
  price: number
  imagePath: string | null
}

// Dish card
function DishCard({
  id,
  name,
  description,
  price,
  imagePath,
}: DishCardProps) {
  const [isAdded, setIsAdded] = useState(false)

  // Get public image URL
  const imageUrl = imagePath
    ? supabase.storage
        .from('dish-images')
        .getPublicUrl(imagePath).data.publicUrl
    : null

  // Add dish to cart
  function addToCart() {
    const savedCart = localStorage.getItem('cart')

    const cart: CartItem[] = savedCart
      ? JSON.parse(savedCart)
      : []

    const existingItem = cart.find((item) => item.id === id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({
        id,
        name,
        price,
        quantity: 1,
      })
    }

    localStorage.setItem('cart', JSON.stringify(cart))

    setIsAdded(true)

    setTimeout(() => {
      setIsAdded(false)
    }, 1500)
  }

  return (
    <article className="dish-card">
      {/* Dish image */}
      {imageUrl && (
        <div className="dish-card-image-wrapper">
          <img
            className="dish-card-image"
            src={imageUrl}
            alt={name}
          />
        </div>
      )}

      {/* Dish information */}
      <div className="dish-card-content">
        <h3 className="dish-card-title">
          {name}
        </h3>

        <p className="dish-card-description">
          {description}
        </p>

        <p className="dish-card-price">
          {price} kr
        </p>
      </div>

      {/* Dish actions */}
      <div className="dish-card-actions">
        <Link
          className="dish-card-link"
          to={`/dishes/${id}`}
        >
          View details
        </Link>

        <button
          className={`button dish-card-button${
            isAdded ? ' dish-card-button--added' : ''
          }`}
          type="button"
          onClick={addToCart}
          aria-live="polite"
        >
          {isAdded ? 'Added ✓' : 'Add to cart'}
        </button>
      </div>
    </article>
  )
}

export default DishCard
