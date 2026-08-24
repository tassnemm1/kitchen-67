import { useCallback } from 'react'
import { getDish, listDishes } from '../services/dishes'
import type { Dish } from '../types/database'
import { useAsyncData } from './useAsyncData'
import type { AsyncData } from './useAsyncData'

export function useDishes(includeArchived = false): AsyncData<Dish[]> {
  const load = useCallback(() => listDishes(includeArchived), [includeArchived])
  return useAsyncData(load, 'Could not load the menu.')
}

export function useDish(id: string | undefined): AsyncData<Dish> {
  const load = useCallback(() => {
    if (!id) {
      return Promise.reject(new Error('No dish was asked for.'))
    }
    return getDish(id)
  }, [id])

  return useAsyncData(load, 'Could not load the dish.')
}
