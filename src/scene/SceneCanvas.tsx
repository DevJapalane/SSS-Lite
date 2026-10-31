import { Canvas } from '@react-three/fiber'

export function SceneCanvas() {
  return (
    // dpr [1, 2]: phones report 3x or more, but rendering above 2x costs a lot
    // of GPU for detail the eye barely notices.
    // alpha keeps the canvas transparent so the CSS star field shows through.
    <Canvas dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
      {/* Bodies, lights and controls arrive in later backlog items. */}
    </Canvas>
  )
}
