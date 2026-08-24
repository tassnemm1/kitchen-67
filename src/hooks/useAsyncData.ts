import { useCallback, useEffect, useState } from 'react'

interface LoadResult<T> {
  load: () => Promise<T>
  count: number
  data: T | null
  message: string | null
}

export interface AsyncData<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  reload: () => void
}

/**
 * Runs a loader and keeps track of its result, its error and whether it is
 * still running, so every view gets the same loading and error handling.
 *
 * `load` has to keep its identity between renders. Wrap it in `useCallback` at
 * the call site, with the query parameters as dependencies.
 */
export function useAsyncData<T>(
  load: () => Promise<T>,
  fallbackMessage: string,
): AsyncData<T> {
  const [result, setResult] = useState<LoadResult<T> | null>(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    let isActive = true

    load()
      .then((data) => {
        if (isActive) setResult({ load, count, data, message: null })
      })
      .catch((caught: unknown) => {
        if (!isActive) return
        setResult({
          load,
          count,
          data: null,
          message: caught instanceof Error ? caught.message : fallbackMessage,
        })
      })

    return () => {
      isActive = false
    }
  }, [load, count, fallbackMessage])

  const reload = useCallback(() => {
    setCount((current) => current + 1)
  }, [])

  // A result from an older loader or an older reload is ignored rather than
  // cleared, which keeps the effect above free of synchronous state updates.
  const current = result?.load === load && result.count === count ? result : null

  return {
    data: current?.data ?? null,
    isLoading: current === null,
    error: current?.message ?? null,
    reload,
  }
}
