import { useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'

// Shopping cart page
function CartPage() {
  // Cart items
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Margherita Pizza',
      price: 119,
      quantity: 1,
    },
    {
      id: 2,
      name: 'Chicken Burger',
      price: 129,
      quantity: 1,
    },
  ])

  // Increase quantity
  const increaseQuantity = (id: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    )
  }

  // Decrease quantity
  const decreaseQuantity = (id: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    )
  }

  // Remove item
  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
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