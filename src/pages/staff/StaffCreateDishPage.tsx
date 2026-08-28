import { Link, useNavigate } from 'react-router-dom'
import { DishForm } from '../../components/DishForm'
import { createDish } from '../../services/dishes'
import type { DishInput } from '../../services/dishes'

export function StaffCreateDishPage() {
  const navigate = useNavigate()

  async function handleCreate(input: DishInput) {
    const dish = await createDish(input)
    await navigate(`/staff/dishes/${dish.id}`, { replace: true })
  }

  return (
    <section className="staff__section">
      <div className="staff__intro">
        <h1>New dish</h1>
        <p>Add the dish information first, then upload an image and activate it.</p>
      </div>

      <DishForm submitLabel="Create dish" onSubmit={handleCreate} />

      <Link to="/staff/dishes">Back to the menu</Link>
    </section>
  )
}
