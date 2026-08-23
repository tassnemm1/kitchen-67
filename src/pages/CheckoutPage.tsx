import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { createOrder } from '../services/orders'

// Form data
type CheckoutForm = {
  name: string
  email: string
  phone: string
}

// Cart item
type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
}

// Checkout page
function CheckoutPage() {
  const navigate = useNavigate()

  // Order error
  const [orderError, setOrderError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutForm>()

  // Submit order
  const onSubmit = async (data: CheckoutForm) => {
    setOrderError(null)

    try {
      // Get saved cart
      const savedCart = localStorage.getItem('cart')

      if (!savedCart) {
        throw new Error('Your cart is empty.')
      }

      const cartItems: CartItem[] = JSON.parse(savedCart)

      if (cartItems.length === 0) {
        throw new Error('Your cart is empty.')
      }

      // Create order in Supabase
      const order = await createOrder(
        cartItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
      )

      // Clear cart
      localStorage.removeItem('cart')

      // Go to confirmation page
      navigate('/order-confirmation', {
        state: {
          order,
          customer: data,
        },
      })
    } catch (caught: unknown) {
      setOrderError(
        caught instanceof Error
          ? caught.message
          : 'Could not place order.',
      )
    }
  }

  return (
    <main>
      <h1>Checkout</h1>

      {/* Pickup information */}
      <p>Your order will be prepared for pickup.</p>

      {/* Order error */}
      {orderError && (
        <p role="alert">
          {orderError}
        </p>
      )}

      {/* Order form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Name */}
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          {...register('name', {
            required: 'Name is required',
          })}
        />
        {errors.name && <p>{errors.name.message}</p>}

        {/* Email */}
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register('email', {
            required: 'Email is required',
          })}
        />
        {errors.email && <p>{errors.email.message}</p>}

        {/* Phone */}
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          type="tel"
          {...register('phone', {
            required: 'Phone is required',
          })}
        />
        {errors.phone && <p>{errors.phone.message}</p>}

        {/* Place order */}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Placing order...' : 'Place order'}
        </button>
      </form>
    </main>
  )
}

export default CheckoutPage