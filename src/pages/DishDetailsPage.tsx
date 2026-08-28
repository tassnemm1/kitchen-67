import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import LoadingMessage from '../components/LoadingMessage'
import ErrorMessage from '../components/ErrorMessage'

import { getDishById, type Dish } from '../services/dishes'
import {
  getDishOptions,
  type DishOption,
} from '../services/dishOptions'
import { getDishImageUrl } from '../services/dishImages'

// Selected option type
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

// Dish details page
function DishDetailsPage() {
  const { id } = useParams()

  // Dish data
  const [dish, setDish] = useState<Dish | null>(null)

  // Dish options / ingredients
  const [options, setOptions] = useState<DishOption[]>([])

  // User selected options
  const [selectedOptions, setSelectedOptions] = useState<
    SelectedOption[]
  >([])

  // Page states
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  // Load dish and options
  useEffect(() => {
    async function loadDish() {
      if (!id) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setIsError(false)

        // Get dish
        const dishData = await getDishById(id)

        // Get dish options
        const optionData = await getDishOptions(id)

        setDish(dishData)
        setOptions(optionData)

        // Create default selections
        setSelectedOptions(
          optionData.map((option) => ({
            optionId: option.id,
            name: option.name,
            removed: false,
            extraQuantity: 0,
            extraPrice: option.extra_price,
          })),
        )
      } catch {
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    void loadDish()
  }, [id])

  // Add the ingredient or increase extra
  function increaseOption(option: DishOption) {
    setSelectedOptions((currentOptions) =>
      currentOptions.map((selected) => {
        if (selected.optionId !== option.id) {
          return selected
        }

        if (selected.removed) {
          return {
            ...selected,
            removed: false,
          }
        }

        if (selected.extraQuantity >= option.max_extra) {
          return selected
        }

        return {
          ...selected,
          removed: false,
          extraQuantity: selected.extraQuantity + 1,
        }
      }),
    )
  }

  // Decrease extra or remove the ingredient
  function decreaseOption(option: DishOption) {
    setSelectedOptions((currentOptions) =>
      currentOptions.map((selected) => {
        if (selected.optionId !== option.id) {
          return selected
        }

        if (selected.extraQuantity > 0) {
          return {
            ...selected,
            extraQuantity: selected.extraQuantity - 1,
          }
        }

        if (option.can_remove) {
          return {
            ...selected,
            removed: true,
          }
        }

        return selected
      }),
    )
  }

  // Calculate extra price
  const extrasTotal = selectedOptions.reduce(
    (total, option) =>
      total + option.extraQuantity * option.extraPrice,
    0,
  )

  // Final dish price
  const totalPrice = dish
    ? dish.price + extrasTotal
    : 0

  // Add dish to cart
  function addToCart() {
    if (!dish) {
      return
    }

    const savedCart = localStorage.getItem('cart')

    const cart: CartItem[] = savedCart
      ? JSON.parse(savedCart)
      : []

    // Keep only changed options
    const customizedOptions = selectedOptions.filter(
      (option) =>
        option.removed || option.extraQuantity > 0,
    )

    // Find the same dish with the same options
    const existingItem = cart.find(
      (item) =>
        item.id === dish.id &&
        JSON.stringify(item.options ?? []) ===
          JSON.stringify(customizedOptions),
    )

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({
        id: dish.id,
        name: dish.name,
        price: totalPrice,
        quantity: 1,
        options: customizedOptions,
      })
    }

    localStorage.setItem('cart', JSON.stringify(cart))

    // Show a short message on the button
    setIsAdded(true)
    setTimeout(() => {
      setIsAdded(false)
    }, 1500)
  }

  // Loading
  if (isLoading) {
    return <LoadingMessage />
  }

  // Error
  if (isError) {
    return <ErrorMessage />
  }

  // Dish not found
  if (!dish) {
    return <p>Dish not found</p>
  }

  const imageUrl = getDishImageUrl(dish.image_path)

  return (
    <main>
      {/* Dish image */}
      {imageUrl && (
        <img className="dish-details-image" src={imageUrl} alt={dish.name} />
      )}

      {/* Dish category */}
      <p className="dish-details-category">{dish.category}</p>

      <h1>{dish.name}</h1>

      <p>{dish.description}</p>

      <p>
        <strong>
          {totalPrice} kr
        </strong>
      </p>

      {/* Dish options */}
      {options.length > 0 && (
        <section>
          <h2>Customize your order</h2>

          {options.map((option) => {
            const selected = selectedOptions.find(
              (item) => item.optionId === option.id,
            )

            if (!selected) {
              return null
            }

            return (
              <div
                key={option.id}
                className={
                  selected.removed
                    ? 'dish-option dish-option--removed'
                    : 'dish-option'
                }
              >
                <h3>{option.name}</h3>

                {/* Change ingredient */}
                <div>
                  <button
                    type="button"
                    onClick={() => decreaseOption(option)}
                    disabled={
                      selected.removed ||
                      (!option.can_remove &&
                        selected.extraQuantity === 0)
                    }
                  >
                    -
                  </button>

                  <span>
                    {selected.removed
                      ? 'Not included'
                      : `Extra: ${selected.extraQuantity}`}
                  </span>

                  <button
                    type="button"
                    onClick={() => increaseOption(option)}
                    disabled={
                      !selected.removed &&
                      selected.extraQuantity >=
                      option.max_extra
                    }
                  >
                    +
                  </button>

                  <span>
                    +{option.extra_price} kr each
                  </span>
                </div>
              </div>
            )
          })}
        </section>
      )}

      {/* Add to cart */}
      <button
        className={isAdded ? 'dish-card-button--added' : ''}
        type="button"
        onClick={addToCart}
      >
        {isAdded ? 'Added ✓' : 'Add to Cart'}
      </button>

      {/* Go to cart */}
      <Link to="/cart">
        View Cart
      </Link>
    </main>
  )
}

export default DishDetailsPage
