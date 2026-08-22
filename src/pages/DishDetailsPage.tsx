import { useParams } from 'react-router-dom'

// Test dishes
const dishes = [
  {
    id: 1,
    name: 'Margherita Pizza',
    description: 'Tomato sauce, mozzarella and basil',
    price: 119,
  },
  {
    id: 2,
    name: 'Chicken Burger',
    description: 'Chicken, salad and dressing',
    price: 129,
  },
]

// Dish details page
function DishDetailsPage() {
  const { id } = useParams()

  // Find selected dish
  const dish = dishes.find((dish) => dish.id === Number(id))

  // Show message if dish does not exist
  if (!dish) {
    return <p>Dish not found</p>
  }

  return (
    <main>
      {/* Dish information */}
      <h1>{dish.name}</h1>
      <p>{dish.description}</p>
      <p>{dish.price} kr</p>
    </main>
  )
}

export default DishDetailsPage