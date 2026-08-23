import { Link } from 'react-router-dom'

// Dish card props
type DishCardProps = {
  id: string
  name: string
  description: string
  price: number
}

// Dish card
function DishCard({
  id,
  name,
  description,
  price,
}: DishCardProps) {
  return (
    <div>
      {/* Dish name */}
      <h2>
        <Link to={`/dishes/${id}`}>{name}</Link>
      </h2>

      {/* Dish description */}
      <p>{description}</p>

      {/* Dish price */}
      <p>{price} kr</p>
    </div>
  )
}

export default DishCard