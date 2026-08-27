import { useState } from 'react'
import { ORDER_STATUS_ACTIONS, nextOrderStatus } from '../lib/orderStatus'
import { setOrderStatus } from '../services/orders'
import type { OrderStatus } from '../types/database'

interface AdvanceOrderButtonProps {
  orderId: string
  status: OrderStatus
  /** Called after the status changed, so the view can reload. */
  onAdvanced: () => void
}

/**
 * Offers the one step forward the database will accept. There is no way to
 * skip a step from here, and the trigger would refuse it anyway.
 */
export function AdvanceOrderButton({
  orderId,
  status,
  onAdvanced,
}: AdvanceOrderButtonProps) {
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const next = nextOrderStatus(status)

  if (!next) {
    return <p className="status">This order is finished.</p>
  }

  async function advance(target: OrderStatus) {
    setError(null)
    setIsSaving(true)

    try {
      await setOrderStatus(orderId, target)
      onAdvanced()
    } catch (caught: unknown) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'Could not change the status. Please try again.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}
      <button
        type="button"
        className="button"
        disabled={isSaving}
        onClick={() => void advance(next)}
      >
        {isSaving ? 'Saving…' : ORDER_STATUS_ACTIONS[next]}
      </button>
    </>
  )
}
