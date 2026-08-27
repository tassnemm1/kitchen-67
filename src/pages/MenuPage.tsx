import { useEffect, useState } from 'react'

import DishCard from '../components/DishCard'
import LoadingMessage from '../components/LoadingMessage'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'

import { getActiveDishes, type Dish } from '../services/dishes'

// The order the menu reads best in. It is a preference, not a gate: a category
// the staff invents later is listed after these instead of being left out.
const CATEGORY_ORDER = [
  'Burgers',
  'Bowls',
  'Salads',
  'Sides',
  'Desserts',
  'Drinks',
]

/** Every category that actually has dishes, preferred ones first. */
function categoriesInMenu(dishes: Dish[]): string[] {
  const present = [...new Set(dishes.map((dish) => dish.category))]

  return [
    ...CATEGORY_ORDER.filter((category) => present.includes(category)),
    ...present
      .filter((category) => !CATEGORY_ORDER.includes(category))
      .sort(),
  ]
}

// Menu page
function MenuPage() {
  // Dishes
  const [dishes, setDishes] = useState<Dish[]>([])

  // Page states
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  // Load dishes
  useEffect(() => {
    async function loadDishes() {
      try {
        setIsLoading(true)
        setIsError(false)

        const data = await getActiveDishes()

        setDishes(data)
      } catch {
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    void loadDishes()
  }, [])

  // Loading
  if (isLoading) {
    return <LoadingMessage />
  }

  // Error
  if (isError) {
    return <ErrorMessage />
  }

  return (
    <main className="menu-page">
      {/* Page heading */}
      <section className="menu-hero">
        <p className="menu-kicker">Freshly prepared for pickup</p>

        <h1>Our Menu</h1>

        <p className="menu-intro">
          Choose your favorites and build your perfect order.
        </p>
      </section>

      {/* Empty menu */}
      {dishes.length === 0 && <EmptyState />}

      {/* Menu categories */}
      {categoriesInMenu(dishes).map((category) => {
        const categoryDishes = dishes.filter(
          (dish) => dish.category === category,
        )

        if (categoryDishes.length === 0) {
          return null
        }

        return (
          <section className="menu-section" key={category}>
            <div className="menu-section-heading">
              <h2>{category}</h2>
              <span>{categoryDishes.length} items</span>
            </div>

            <div className="menu-grid">
              {categoryDishes.map((dish) => (
               <DishCard
                 key={dish.id}
                 id={dish.id}
                 name={dish.name}
                 description={dish.description ?? ''}
                 price={dish.price}
                 imagePath={dish.image_path}
               />
              ))}
            </div>
          </section>
        )
      })}
    </main>
  )
}

export default MenuPage