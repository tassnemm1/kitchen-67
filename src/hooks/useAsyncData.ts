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

  const current = result?.load === load && result.count === count ? result : null

  return {
    data: current?.data ?? null,
    isLoading: current === null,
    error: current?.message ?? null,
    reload,
  }
}
