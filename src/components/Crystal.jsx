import { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { gsap } from 'gsap'

const MODEL_URL = '/models/enchanted_crystal_02.glb'

// The model ships tiny (~0.019 units tall after its baked node transforms),
// so scale it up to sit nicely in frame (~4.5 units tall).
const TARGET_SCALE = 246

export default function Crystal(props) {
  const group = useRef()
  const { scene } = useGLTF(MODEL_URL)

  // --- Intro reveal -------------------------------------------------------
  useEffect(() => {
    const g = group.current
    if (!g) return

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
    tl.to(g.rotation, { y: 0, duration: 1.8, ease: 'power3.out' }, '<')

    return () => tl.kill()
  }, [])

  // --- Gentle, continuous idle spin --------------------------------------
  useFrame((_, delta) => {
    const g = group.current
    if (g) g.rotation.y += delta * 0.12
    // NB: vertical bob is handled by the parent <Float>.
  })

  return (
    <group ref={group} {...props}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload(MODEL_URL)
