import { Suspense, useMemo } from 'react'
import * as THREE from 'three'
import {
  Float,
  AdaptiveDpr,
  Environment,
  Lightformer,
  Sparkles,
} from '@react-three/drei'
import {
  EffectComposer,
  Bloom,
  LensFlare,
  Vignette,
} from '@react-three/postprocessing'
import Crystal from './Crystal.jsx'

const CRYSTAL_POS = [0, 3.6, 0]

// A soft radial-gradient texture used as the glow disc behind the crystal.
function useGlowTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 256
    const ctx = c.getContext('2d')
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
    g.addColorStop(0.0, 'rgba(255,255,255,1)')
    g.addColorStop(0.25, 'rgba(205,225,255,0.85)')
    g.addColorStop(1.0, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 256, 256)
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])
}

// A bright glow disc sitting just behind the crystal. The transmission
// material refracts it (so the glass body lights up from within) and bloom
// blooms it into a halo — the luminous core seen in the reference.
function BackGlow() {
  const tex = useGlowTexture()
  return (
    <sprite position={[0, 3.9, -3]} scale={[7.5, 8.5, 1]}>
      <spriteMaterial
        map={tex}
        color="#dfeaff"
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        transparent
      />
    </sprite>
  )
}

// A single photoreal glass crystal floating in a black void: real-time
// refraction + dispersion on the crystal, a procedural lightformer studio
// driving its reflections, floating dust, and a bloom + lens-flare post stack.
export default function Experience() {
  return (
    <>
      {/* Pure black void. */}
      <color attach="background" args={['#000000']} />

      {/* A procedural reflection environment built from glowing panels. Glass is
          only visible through what it reflects/refracts, so these bright shapes
          ARE the crystal's highlights — and they bloom into the flares. The env
          is never drawn as a background, so the void stays black. */}
      <Environment resolution={512}>
        <group rotation={[0, 0, 1]}>
          {/* Big soft key behind. */}
          <Lightformer
            form="rect"
            intensity={12}
            position={[0, 5, -9]}
            scale={[12, 12, 1]}
            color="#ffffff"
          />
          {/* Bright vertical rims down each side — these are the crisp
              specular edges that define the crystal's silhouette. */}
          <Lightformer
            form="rect"
            intensity={10}
            position={[-6, 2, 1]}
            scale={[1, 10, 1]}
            color="#bcd6ff"
          />
          <Lightformer
            form="rect"
            intensity={10}
            position={[6, 0, 1]}
            scale={[1, 10, 1]}
            color="#ffe7c4"
          />
          {/* A hot, small backlight right behind the crystal so the glass
              lights up and refracts brightly toward the camera. */}
          <Lightformer
            form="ring"
            intensity={16}
            position={[0, 4, -3]}
            scale={[3, 3, 1]}
            color="#ffffff"
          />
        </group>
      </Environment>

      {/* Key + cool rim so the facets catch crisp, bloomable highlights. */}
      <ambientLight intensity={0.2} />
      <pointLight position={[4, 7, 5]} intensity={45} color="#ffffff" />
      <pointLight position={[-5, 3, -4]} intensity={22} color="#6f8cff" />

      {/* Luminous core behind the crystal — refracted by the glass + bloomed. */}
      <BackGlow />

      {/* The floating crystal — subtle vertical bob + slow idle spin. */}
      <Suspense fallback={null}>
        <Float
          speed={1.2}
          rotationIntensity={0}
          floatIntensity={1}
          floatingRange={[-0.18, 0.18]}
        >
          <Crystal position={CRYSTAL_POS} />
        </Float>
      </Suspense>

      {/* Glittering dust motes drifting around the crystal. */}
      <Sparkles
        count={70}
        scale={[7, 9, 7]}
        position={CRYSTAL_POS}
        size={2.5}
        speed={0.3}
        opacity={0.7}
        color="#ffffff"
      />

      <EffectComposer disableNormalPass multisampling={4}>
        {/* Glow on the bright facets and the flare. */}
        <Bloom
          mipmapBlur
          intensity={1.5}
          luminanceThreshold={0.6}
          luminanceSmoothing={0.2}
        />
        {/* Anamorphic starburst streaks emanating from a highlight near the
            crystal's upper facet — the long crossed rays in the reference. */}
        <LensFlare
          lensPosition={new THREE.Vector3(0.15, 6.1, 1)}
          glareSize={0.5}
          starPoints={6}
          flareSize={0.007}
          flareSpeed={0}
          flareShape={0.5}
          animated={false}
          anamorphic={false}
          colorGain={new THREE.Color(100, 100, 120)}
          haloScale={4.5}
          secondaryGhosts
          aditionalStreaks
          ghostScale={0.1}
          starBurst
          opacity={1}
        />
        <Vignette eskil={false} offset={0.3} darkness={0.8} />
      </EffectComposer>

      <AdaptiveDpr pixelated />
    </>
  )
}
