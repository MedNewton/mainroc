import { Suspense, useMemo } from 'react'
import { Float, Stars, AdaptiveDpr } from '@react-three/drei'
import {
  EffectComposer,
  Bloom,
  Vignette,
  HueSaturation,
} from '@react-three/postprocessing'
import * as THREE from 'three'
import Crystal from './Crystal.jsx'
import Ocean from './Ocean.jsx'
import GradientSky from './GradientSky.jsx'

const CRYSTAL_POS = [0, 2.8, 0]

// A single, calm scene: a glowing crystal floating gently above a realistic
// reflective ocean, beneath a deep-blue starry night sky.
export default function Experience() {
  // Moonlight direction — drives the ocean's specular glint.
  const sun = useMemo(() => new THREE.Vector3(0, 0.16, -1).normalize(), [])

  return (
    <>
      <GradientSky />

      {/* Starfield for night realism. */}
      <Stars radius={400} depth={80} count={2500} factor={8} saturation={0} fade speed={0.4} />

      {/* Realistic reflective ocean (reflects the sky, stars and crystal). */}
      <Suspense fallback={null}>
        <Ocean sunDirection={sun} position={[0, -0.6, 0]} />
      </Suspense>

      {/* Dim night ambience + cool fills so the crystal's facets read. */}
      <hemisphereLight args={['#3a5f93', '#040b16', 0.4]} />
      <ambientLight intensity={0.12} />
      <pointLight position={[0, 7, 5]} intensity={50} color="#7fdcff" />
      <pointLight position={[-5, 4, -3]} intensity={25} color="#2f6df6" />

      {/* The floating crystal — subtle vertical bob only. */}
      <Suspense fallback={null}>
        <Float
          speed={1.4}
          rotationIntensity={0}
          floatIntensity={1}
          floatingRange={[-0.18, 0.18]}
        >
          <Crystal position={CRYSTAL_POS} />
        </Float>
      </Suspense>

      {/* Bloom for the glow; light vignette (no longer crushing the sky). */}
      <EffectComposer disableNormalPass>
        <Bloom
          mipmapBlur
          intensity={0.85}
          luminanceThreshold={0.6}
          luminanceSmoothing={0.3}
        />
        <HueSaturation saturation={0.12} />
        <Vignette eskil={false} offset={0.35} darkness={0.5} />
      </EffectComposer>

      <AdaptiveDpr pixelated />
    </>
  )
}
