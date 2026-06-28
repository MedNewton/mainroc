import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useProgress } from '@react-three/drei'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Experience from './components/Experience.jsx'
import Overlay from './components/Overlay.jsx'
import { scrollStore } from './scroll.js'

gsap.registerPlugin(ScrollTrigger)

// Loader stays until all 3D assets (the model + water texture) have loaded,
// so visitors never see an empty sea while the 7.9 MB model downloads.
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
  const scopeRef = useRef()

  // One page-wide ScrollTrigger writes normalized scroll progress (0→1) into
  // the shared store, which the 3D crystal reads each frame.
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        scrollStore.progress = self.progress
      },
    })
    return () => st.kill()
  }, [])

  return (
    <div className="app" ref={scopeRef}>
      <Loader />

      {/* Fixed full-screen 3D layer sitting behind the scrollable content. */}
      <div className="canvas-wrap">
        <Canvas
          camera={{ position: [0, 2.2, 16], fov: 38 }}
          gl={{ antialias: true, alpha: false }}
          dpr={[1, 2]}
          onCreated={(state) => {
            // Low camera looking slightly up at the floating crystal, so the
            // ocean horizon sits low in frame like the reference.
            state.camera.lookAt(0, 4.4, 0)
            state.gl.toneMappingExposure = 0.8 // cinematic navy grade
          }}
        >
          {/* Haze blends the far ocean into the sky at the horizon. */}
          <fog attach="fog" args={['#4d6e9e', 30, 160]} />
          <Experience />
        </Canvas>
      </div>

      <Overlay />
    </div>
  )
}
