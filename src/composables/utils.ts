import { formatDistanceToNowStrict } from 'date-fns'

export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId!: any
  return function(...args: any[]) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

export function getTimeDifference(time: Date): string {
  if (!time) return '-'

  return `${formatDistanceToNowStrict(new Date(time))} ago`
}
