import DishCard from '../components/DishCard'
import LoadingMessage from '../components/LoadingMessage'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'

// Test dishes
const dishes = [
  {
    id: 1,
    name: 'Margherita Pizza',
    description: 'Tomato sauce, mozzarella and basil',
    price: 119,
    isActive: true,
  },
  {
    id: 2,
    name: 'Chicken Burger',
    description: 'Chicken, salad and dressing',
    price: 129,
    isActive: true,
  },
  {
    id: 3,
    name: 'Pasta',
    description: 'Pasta with creamy sauce',
    price: 109,
    isActive: false,
  },
]

// Menu page
function MenuPage() {
  // Temporary states until Supabase is connected
  const isLoading = false
  const isError = false

  // Show only active dishes
  const activeDishes = dishes.filter((dish) => dish.isActive)

  // Loading state
  if (isLoading) {
    return <LoadingMessage />
  }

  // Error state
  if (isError) {
    return <ErrorMessage />
  }

  return (
    <main>
      {/* Page title */}
      <h1>Menu</h1>

      {/* Empty state */}
      {activeDishes.length === 0 && <EmptyState />}

      {/* Dish list */}
      {activeDishes.map((dish) => (
        <DishCard
          key={dish.id}
          id={dish.id}
          name={dish.name}
          description={dish.description}
          price={dish.price}
        />
      ))}
    </main>
  )
}

export default MenuPage
