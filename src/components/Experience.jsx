import { Suspense, useMemo } from 'react'
import { Float, Sparkles, AdaptiveDpr } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import Crystal from './Crystal.jsx'
import Ocean from './Ocean.jsx'
import GradientSky from './GradientSky.jsx'

// The 3D scene: a glowing crystal floating above a reflective ocean,
// beneath a moody low-sun sky.
export default function Experience() {
  // Soft "moon" direction used for the ocean's specular highlight and the
  // scene's key light — high and slightly behind, never a blown-out disk.
  const sun = useMemo(() => new THREE.Vector3(0.2, 0.35, -1).normalize(), [])

  return (
    <>
      {/* Dark navy gradient sky. */}
      <GradientSky />

      {/* Reflective sea. */}
      <Suspense fallback={null}>
        <Ocean sunDirection={sun} />
      </Suspense>

      {/* Lighting: cool sky/ground ambient + a soft key light. */}
      <hemisphereLight args={['#7ea0d6', '#04102a', 0.45]} />
      <ambientLight intensity={0.12} />
      <directionalLight
        position={[sun.x * 50, sun.y * 50 + 30, sun.z * 50]}
        intensity={0.9}
        color="#cfe2ff"
      />
      {/* Cyan fill to push the crystal's glow. */}
      <pointLight position={[0, 6, 6]} intensity={40} color="#5fd0ff" />
      <pointLight position={[-5, 4, -3]} intensity={25} color="#2f6df6" />

      {/* The floating crystal. */}
      <Suspense fallback={null}>
        <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.6}>
          <Crystal position={[0, 4.6, 0]} />
        </Float>
      </Suspense>

      {/* Drifting motes of light around the crystal. */}
      <Sparkles
        count={50}
        scale={[10, 8, 10]}
        position={[0, 5, 0]}
        size={2.5}
        speed={0.25}
        color="#bcd6ff"
        opacity={0.5}
      />

      {/* Postprocessing: bloom for the glow, vignette for cinematic framing. */}
      <EffectComposer disableNormalPass>
        <Bloom
          mipmapBlur
          intensity={0.85}
          luminanceThreshold={0.65}
          luminanceSmoothing={0.3}
        />
        <Vignette eskil={false} offset={0.2} darkness={0.8} />
      </EffectComposer>

      <AdaptiveDpr pixelated />
    </>
  )
}
