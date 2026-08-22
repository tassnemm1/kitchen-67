import { useForm } from 'react-hook-form'

// Form data
type CheckoutForm = {
  name: string
  email: string
  phone: string
}

// Checkout page
function CheckoutPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>()

  // Handle order form
  const onSubmit = (data: CheckoutForm) => {
    console.log(data)
  }

  return (
    <main>
      {/* Page title */}
      <h1>Checkout</h1>

      {/* Pickup information */}
      <p>Your order will be prepared for pickup.</p>

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

        {/* Submit order */}
        <button type="submit">Place order</button>
      </form>
    </main>
  )
}

export default CheckoutPage