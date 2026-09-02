import type { ReactNode } from 'react'

interface DataStateProps {
  isLoading: boolean
  error: string | null
  isEmpty?: boolean
  emptyMessage?: string
  loadingMessage?: string
  children: ReactNode
}

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
