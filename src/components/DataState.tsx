import type { ReactNode } from 'react'

interface DataStateProps {
  isLoading: boolean
  error: string | null
  /** Shown instead of the children when the request came back with nothing. */
  isEmpty?: boolean
  emptyMessage?: string
  loadingMessage?: string
  children: ReactNode
}

/**
 * One place for the three states every list and detail view shares: loading,
 * failed and nothing to show.
 */
export function DataState({
  isLoading,
  error,
  isEmpty = false,
  emptyMessage = 'There is nothing here yet.',
  loadingMessage = 'Loading…',
  children,
}: DataStateProps) {
  if (isLoading) {
    return (
      <p className="status" role="status">
        {loadingMessage}
      </p>
    )
  }

  if (error) {
    return (
      <p className="alert" role="alert">
        {error}
      </p>
    )
  }

  if (isEmpty) {
    return <p className="status">{emptyMessage}</p>
  }

  return <>{children}</>
}
