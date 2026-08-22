import DishCard from '../components/DishCard'

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
  return (
    <main>
      {/* Page title */}
      <h1>Menu</h1>

      {/* Dish list */}
      {dishes
         .filter((dish) => dish.isActive)
         .map((dish) => (
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