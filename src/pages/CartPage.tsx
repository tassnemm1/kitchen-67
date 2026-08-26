import { useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'

// Selected dish option
type SelectedOption = {
  optionId: string
  name: string
  removed: boolean
  extraQuantity: number
  extraPrice: number
}

// Cart item type
type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  options?: SelectedOption[]
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
  const increaseQuantity = (itemIndex: number) => {
    const updatedCart = cartItems.map((item, index) =>
      index === itemIndex
        ? { ...item, quantity: item.quantity + 1 }
        : item
    )

    saveCart(updatedCart)
  }

  // Decrease quantity
  const decreaseQuantity = (itemIndex: number) => {
    if (cartItems[itemIndex].quantity === 1) {
      const updatedCart = cartItems.filter(
        (_, index) => index !== itemIndex,
      )

      saveCart(updatedCart)
      return
    }

    const updatedCart = cartItems.map((item, index) =>
      index === itemIndex
        ? { ...item, quantity: item.quantity - 1 }
        : item
    )

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
      {cartItems.map((item, index) => (
        <div key={`${item.id}-${index}`}>
          <h2>{item.name}</h2>

          <p>{item.price} kr</p>
          <p>Quantity: {item.quantity}</p>

          {/* Selected options */}
          {item.options && item.options.length > 0 && (
            <ul className="cart-options">
              {item.options.map((option) => (
                <li key={option.optionId}>
                  {option.removed
                    ? `No ${option.name}`
                    : `Extra ${option.name} x${option.extraQuantity}`}
                </li>
              ))}
            </ul>
          )}

          {/* Quantity buttons */}
          <button onClick={() => increaseQuantity(index)}>
            +
          </button>

          <button onClick={() => decreaseQuantity(index)}>
            -
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
