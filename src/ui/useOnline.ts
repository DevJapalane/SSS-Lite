import { useSyncExternalStore } from 'react'

function subscribe(onChange: () => void) {
  window.addEventListener('online', onChange)
  window.addEventListener('offline', onChange)
  return () => {
    window.removeEventListener('online', onChange)
    window.removeEventListener('offline', onChange)
  }
}

/**
 * Whether the browser believes it has a network connection.
 *
 * useSyncExternalStore is React's way to read a value that lives outside
 * React (here, the browser): it re-renders only when the events fire.
 * `navigator.onLine` can't detect "Wi-Fi without internet", but it does
 * catch the common cases: airplane mode, tunnels, Wi-Fi turned off.
 */
export function useOnline(): boolean {
  return useSyncExternalStore(subscribe, () => navigator.onLine)
}
