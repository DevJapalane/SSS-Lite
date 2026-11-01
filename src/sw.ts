/**
 * Minimal service worker (PB12). The app is online-only, so this worker
 * caches nothing and has NO fetch handler: every request goes straight to
 * the network, exactly as if there were no worker. It exists because a
 * registered worker is part of what browsers check before offering
 * "Instalar app".
 *
 * Built separately by vite-plugin-pwa (injectManifest, no precache list).
 */

// The DOM types the project compiles with don't include the worker
// globals; these few lines describe the part this file uses.
interface ExtendableEvent extends Event {
  waitUntil(promise: Promise<unknown>): void
}
interface WorkerScope {
  skipWaiting(): Promise<void>
  clients: { claim(): Promise<void> }
  addEventListener(type: 'install' | 'activate', listener: (event: ExtendableEvent) => void): void
}
const worker = self as unknown as WorkerScope

// A new version takes over at once instead of waiting for every tab to
// close: there is no cached content that could get out of sync with it.
worker.addEventListener('install', () => {
  void worker.skipWaiting()
})

worker.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Earlier builds precached the app shell with Workbox; remove those
      // caches so no old copy of the app is ever served.
      const keys = await caches.keys()
      await Promise.all(keys.map((key) => caches.delete(key)))
      await worker.clients.claim()
    })(),
  )
})
