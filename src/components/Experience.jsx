import { Suspense } from 'react'
import { Float, AdaptiveDpr } from '@react-three/drei'
import {
  EffectComposer,
  Bloom,
  Vignette,
  HueSaturation,
} from '@react-three/postprocessing'
import Crystal from './Crystal.jsx'
import Ocean from './Ocean.jsx'
import GradientSky from './GradientSky.jsx'

const CRYSTAL_POS = [0, 3.6, 0]

// A single, calm scene: a glowing crystal floating gently above an animated
// Gerstner-wave ocean, beneath a dark night-blue sky.
export default function Experience() {
  return (
    <>
      <GradientSky />

      {/* Animated shader ocean. */}
      <Suspense fallback={null}>
        <Ocean crystalPosition={CRYSTAL_POS} />
      </Suspense>

      {/* Dim night ambience + cool fills so the crystal's facets read. */}
      <hemisphereLight args={['#3a5f93', '#02060f', 0.35]} />
      <ambientLight intensity={0.1} />
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

      {/* Bloom for the glow, a touch of saturation for richer blues, vignette. */}
      <EffectComposer disableNormalPass>
        <Bloom
          mipmapBlur
          intensity={1.0}
          luminanceThreshold={0.55}
          luminanceSmoothing={0.3}
        />
        <HueSaturation saturation={0.15} />
        <Vignette eskil={false} offset={0.15} darkness={0.9} />
      </EffectComposer>

      <AdaptiveDpr pixelated />
    </>
  )
}
