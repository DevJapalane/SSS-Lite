import { Html } from '@react-three/drei'
import { useEffect, useState, type ComponentProps } from 'react'

/**
 * drei's <Html>, mounted one animation frame after its parent.
 *
 * <Html> renders its content into a separate React root. When it is part
 * of the app's very first render (the Moon's tag is there from the start,
 * in body view), React's development StrictMode mounts, unmounts and
 * remounts it inside that render; the unmount of the first root can't run
 * synchronously there, finishes late, and wipes the content the second root
 * had just drawn: an empty label. Mounting a frame later keeps it out of
 * that first render, at no visible cost.
 */
export function StableHtml(props: ComponentProps<typeof Html>) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  return ready ? <Html {...props} /> : null
}
