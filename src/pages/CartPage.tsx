import { useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'

// Cart item type
type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
}

// Get saved cart
function getSavedCart(): CartItem[] {
  const savedCart = localStorage.getItem('cart')

  if (!savedCart) {
    return []
  }

  return JSON.parse(savedCart)
}

// Shopping cart page
function CartPage() {
  // Cart items
  const [cartItems, setCartItems] = useState<CartItem[]>(getSavedCart)

  // Save cart
  const saveCart = (items: CartItem[]) => {
    setCartItems(items)
    localStorage.setItem('cart', JSON.stringify(items))
  }

  // Increase quantity
  const increaseQuantity = (id: string) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    )

    saveCart(updatedCart)
  }

  // Decrease quantity
  const decreaseQuantity = (id: string) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    )

    saveCart(updatedCart)
  }

  // Remove item
  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id)

    saveCart(updatedCart)
  }

  // Total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  return (
    <main>
      <h1>Shopping Cart</h1>

      {/* Empty cart */}
      {cartItems.length === 0 && <EmptyState />}

      {/* Cart items */}
      {cartItems.map((item) => (
        <div key={item.id}>
          <h2>{item.name}</h2>

          <p>{item.price} kr</p>
          <p>Quantity: {item.quantity}</p>

          {/* Quantity buttons */}
          <button onClick={() => increaseQuantity(item.id)}>
            +
          </button>

          <button onClick={() => decreaseQuantity(item.id)}>
            -
          </button>

          {/* Remove button */}
          <button onClick={() => removeItem(item.id)}>
            Remove
          </button>
        </div>
      ))}

      {/* Total and checkout */}
      {cartItems.length > 0 && (
        <>
          <p>Total: {totalPrice} kr</p>

          <Link to="/checkout">
            <button type="button">
              Go to Checkout
            </button>
          </Link>
        </>
      )}
    </main>
  )
}

export default CartPage