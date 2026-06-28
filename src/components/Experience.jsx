import { Suspense, useMemo } from 'react'
import { Environment, Float, AdaptiveDpr } from '@react-three/drei'
import {
  EffectComposer,
  Bloom,
  Vignette,
  HueSaturation,
} from '@react-three/postprocessing'
import * as THREE from 'three'
import sky from '@pmndrs/assets/hdri/sky.exr'
import Crystal from './Crystal.jsx'
import Ocean from './Ocean.jsx'

// A single, calm scene: a glowing crystal floating gently above the ocean,
// beneath a deep-blue night sky (HDRI, bundled locally — no CDN fetch).
export default function Experience() {
  // Direction of the brightest part of the sky, used for the ocean's
  // specular highlight.
  const sun = useMemo(() => new THREE.Vector3(0.3, 0.25, -1).normalize(), [])

  return (
    <>
      {/* A clean open-ocean sky HDRI, dimmed into a deep-blue twilight via a
          low backgroundIntensity (this darkens the visible sky AND its
          reflection in the water, while leaving the emissive crystal bright).
          Bundled locally — no runtime CDN fetch. */}
      <Environment
        files={sky}
        background
        backgroundIntensity={0.32}
        environmentIntensity={0.5}
      />

      {/* Reflective sea. */}
      <Suspense fallback={null}>
        <Ocean sunDirection={sun} />
      </Suspense>

      {/* Subtle fill lighting on top of the HDRI to make the crystal read. */}
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 6, 6]} intensity={45} color="#7fdcff" />
      <pointLight position={[-5, 3, -3]} intensity={25} color="#2f6df6" />

      {/* The floating crystal — gentle vertical bob only. */}
      <Suspense fallback={null}>
        <Float
          speed={1.4}
          rotationIntensity={0}
          floatIntensity={1}
          floatingRange={[-0.18, 0.18]}
        >
          <Crystal position={[0, 1.6, 0]} />
        </Float>
      </Suspense>

      {/* Bloom for the glow, a touch of saturation for richer blues, and a
          vignette for cinematic framing. */}
      <EffectComposer disableNormalPass>
        <Bloom
          mipmapBlur
          intensity={0.9}
          luminanceThreshold={0.6}
          luminanceSmoothing={0.3}
        />
        <HueSaturation saturation={0.18} />
        <Vignette eskil={false} offset={0.2} darkness={0.85} />
      </EffectComposer>

      <AdaptiveDpr pixelated />
    </>
  )
}
