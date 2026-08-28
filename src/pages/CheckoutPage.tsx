import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'
import { createOrder } from '../services/orders'

// Form data
type CheckoutForm = {
  note: string
}

// A change the guest made to a dish
type SelectedOption = {
  optionId: string
  name: string
  removed: boolean
  extraQuantity: number
  extraPrice: number
}

// Cart item
type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  options?: SelectedOption[]
}

/**
 * Turns the choices the guest made on the dish pages into something the
 * kitchen can read. Order items have no room of their own for this, so it
 * travels with the order note.
 */
function describeChoices(items: CartItem[]): string {
  return items
    .filter((item) => item.options && item.options.length > 0)
    .map((item) => {
      const changes = (item.options ?? []).map((option) =>
        option.removed
          ? `no ${option.name}`
          : `extra ${option.name} x${option.extraQuantity}`,
      )

      return `${item.name}: ${changes.join(', ')}`
    })
    .join('\n')
}

// Checkout page
function CheckoutPage() {
  const navigate = useNavigate()
  const { session, profile } = useAuth()

  // Order error
  const [orderError, setOrderError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CheckoutForm>({
    defaultValues: { note: '' },
  })

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

      // What the guest changed, followed by anything they wrote themselves
      const note = [describeChoices(cartItems), data.note.trim()]
        .filter(Boolean)
        .join('\n')

      // Create order in Supabase
      const order = await createOrder(
        cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          options: item.options,
        })),
        note,
      )

      // Clear cart
      localStorage.removeItem('cart')

      // Go to confirmation page
      navigate(`/order-confirmation/${order.id}`)
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

      {/* Who the order is for. It follows the account, so there is nothing
          here to fill in. */}
      {session && (
        <p className="checkout-customer">
          Ordering as {profile?.full_name || session.user.email}
        </p>
      )}

      {/* Order error */}
      {orderError && (
        <p role="alert">
          {orderError}
        </p>
      )}

      {/* Order form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Message to the kitchen */}
        <div className="field">
          <label htmlFor="note">Anything the kitchen should know?</label>
          <textarea
            id="note"
            rows={3}
            placeholder="Allergies, or how you want it done. Optional."
            {...register('note')}
          />
        </div>

        {/* Place order */}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Placing order...' : 'Place order'}
        </button>
      </form>
    </main>
  )
}

export default CheckoutPage
