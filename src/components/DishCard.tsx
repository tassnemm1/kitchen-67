import { Link } from 'react-router-dom'

// Dish card properties
type DishCardProps = {
  id: number
  name: string
  description: string
  price: number
}

// Dish card
function DishCard({ id, name, description, price }: DishCardProps) {
  return (
    <article>
      {/* Dish name */}
      <h2>
        <Link to={`/dishes/${id}`}>{name}</Link>
      </h2>

      {/* Dish information */}
      <p>{description}</p>
      <p>{price} kr</p>
    </article>
  )
}

export default DishCard