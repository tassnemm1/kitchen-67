import { useCallback } from 'react'
import { getOrder, listOrders } from '../services/orders'
import type { OrderDetail, OrderListItem } from '../services/orders'
import type { OrderStatus } from '../types/database'
import { useAsyncData } from './useAsyncData'
import type { AsyncData } from './useAsyncData'

/**
 * `statuses` has to keep its identity between renders, so pass a constant
 * declared outside the component rather than a fresh array literal.
 */
export function useOrders(
  statuses?: readonly OrderStatus[],
): AsyncData<OrderListItem[]> {
  const load = useCallback(() => listOrders(statuses), [statuses])
  return useAsyncData(load, 'Could not load the orders.')
}

export function useOrder(id: string | undefined): AsyncData<OrderDetail> {
  const load = useCallback(() => {
    if (!id) {
      return Promise.reject(new Error('No order was asked for.'))
    }
    return getOrder(id)
  }, [id])

  return useAsyncData(load, 'Could not load the order.')
}
