/**
 * Reads the path a guarded route stored in the location state before sending
 * the visitor to the login page. Anything else falls back to the start page.
 */
export function getRedirectTarget(state: unknown): string {
  if (
    typeof state === 'object' &&
    state !== null &&
    'from' in state &&
    typeof state.from === 'string' &&
    state.from.startsWith('/')
  ) {
    return state.from
  }

  return '/'
}
