import { Canvas } from '@react-three/fiber'
import { SolarScene } from './SolarScene'

export function SceneCanvas() {
  return (
    <Canvas
      // Phones report 3x or more, but rendering above 2x costs a lot of GPU
      // for detail the eye barely notices.
      dpr={[1, 2]}
      // alpha keeps the canvas transparent so the CSS background shows through.
      gl={{ alpha: true, antialias: true }}
      // flat = no tone mapping: textures show their real colors instead of
      // the slightly faded cinematic curve.
      flat
      // Starts far out so the first frame flies in to Earth.
      // far: the real-scale system view puts the camera up to ~10 million
      // units out (1 unit = Earth's radius). A huge far plane costs depth
      // precision only far from the camera, where bodies are sub-pixel
      // dots anyway; near the focused body it stays as sharp as before.
      camera={{ fov: 45, near: 0.05, far: 2e7, position: [0, 40, 140] }}
      // Without this the browser would treat pinch/drag as page zoom/scroll.
      style={{ touchAction: 'none' }}
    >
      <SolarScene />
    </Canvas>
  )
}
