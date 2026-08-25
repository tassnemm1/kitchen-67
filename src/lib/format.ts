const priceFormatter = new Intl.NumberFormat('sv-SE', {
  style: 'currency',
  currency: 'SEK',
  maximumFractionDigits: 0,
})

const dateTimeFormatter = new Intl.DateTimeFormat('sv-SE', {
  dateStyle: 'short',
  timeStyle: 'short',
})

export function formatPrice(value: number): string {
  return priceFormatter.format(value)
}

export function formatDateTime(isoString: string): string {
  return dateTimeFormatter.format(new Date(isoString))
}
