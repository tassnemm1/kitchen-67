import { Link, useNavigate } from 'react-router'
import { DishForm } from '../../components/DishForm'
import { createDish } from '../../services/dishes'
import type { DishInput } from '../../services/dishes'

export function StaffCreateDishPage() {
  const navigate = useNavigate()

  async function handleCreate(input: DishInput) {
    const dish = await createDish(input)
    // Straight on to the edit view, so the dish can be adjusted right away.
    await navigate(`/staff/dishes/${dish.id}`, { replace: true })
  }

  return (
    <section className="staff__section">
      <div className="staff__intro">
        <h1>New dish</h1>
        <p>The dish goes onto the menu as soon as it is created.</p>
      </div>

      <DishForm submitLabel="Create dish" onSubmit={handleCreate} />

      <Link to="/staff/dishes">Back to the menu</Link>
    </section>
  )
}
