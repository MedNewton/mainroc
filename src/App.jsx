import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useProgress } from '@react-three/drei'
import Experience from './components/Experience.jsx'

// Loader stays until all 3D assets (model, water texture, HDRI) have loaded,
// so visitors never see an empty sea while the model downloads.
function Loader() {
  const { progress, active } = useProgress()
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!active && progress >= 100) {
      const t = setTimeout(() => setDone(true), 400)
      return () => clearTimeout(t)
    }
  }, [active, progress])

  return (
    <div className={`loader ${done ? 'loader--hidden' : ''}`}>
      <div className="loader-crystal" />
      <span>{Math.round(progress)}%</span>
    </div>
  )
}

export default function App() {
  return (
    <div className="app">
      <Loader />
      <div className="canvas-wrap">
        <Canvas
          camera={{ position: [0, 1.6, 13], fov: 45, near: 0.1, far: 20000 }}
          gl={{ antialias: true, alpha: false }}
          dpr={[1, 2]}
          onCreated={(state) => {
            // Low camera near the water, horizon a touch below centre so the
            // starry sky fills the upper frame.
            state.camera.lookAt(0, 2.8, 0)
          }}
        >
          <Experience />
        </Canvas>
      </div>
    </div>
  )
}
