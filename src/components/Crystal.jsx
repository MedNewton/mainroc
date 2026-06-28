import { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { gsap } from 'gsap'
import { scrollStore } from '../scroll.js'

const MODEL_URL = '/models/enchanted_crystal.glb'

// The model ships tiny (~0.14 units tall after its baked node transforms),
// so scale it up to sit nicely in frame (~5 units tall).
const TARGET_SCALE = 36

export default function Crystal(props) {
  const group = useRef()
  const { scene } = useGLTF(MODEL_URL)

  // Smoothed rotation values so scroll input never feels jumpy.
  const current = useRef({ y: 0, x: 0 })

  // --- Intro reveal -------------------------------------------------------
  useEffect(() => {
    const g = group.current
    if (!g) return

    // Start hidden: scaled to zero and spun back, then animate in.
    g.scale.setScalar(0.0001)
    g.rotation.y = -Math.PI

    const tl = gsap.timeline({ delay: 0.2 })
    tl.to(g.scale, {
      x: TARGET_SCALE,
      y: TARGET_SCALE,
      z: TARGET_SCALE,
      duration: 1.6,
      ease: 'elastic.out(1, 0.6)',
    })
    tl.to(
      g.rotation,
      { y: 0, duration: 1.8, ease: 'power3.out' },
      '<', // start together with the scale tween
    )

    return () => tl.kill()
  }, [])

  // --- Per-frame motion: auto-rotate + scroll-driven rotation -------------
  useFrame((state, delta) => {
    const g = group.current
    if (!g) return

    const t = state.clock.elapsedTime
    const p = scrollStore.progress

    // Target rotation = gentle idle spin + a full turn driven by scroll,
    // plus a subtle floating tilt and a scroll-controlled forward lean.
    const targetY = t * 0.15 + p * Math.PI * 2
    const targetX = Math.sin(t * 0.5) * 0.05 + p * 0.6

    // Ease the current rotation toward the target for buttery motion.
    current.current.y = gsap.utils.interpolate(current.current.y, targetY, 0.08)
    current.current.x = gsap.utils.interpolate(current.current.x, targetX, 0.08)

    g.rotation.y = current.current.y
    g.rotation.x = current.current.x
    // NB: vertical float is handled by the parent <Float>; don't touch
    // position here or it would override the placement prop.
  })

  return (
    <group ref={group} {...props}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload(MODEL_URL)
