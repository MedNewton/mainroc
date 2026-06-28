import { useEffect, useMemo, useRef } from 'react'
import { useGLTF, MeshTransmissionMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { mergeBufferGeometries } from 'three-stdlib'
import { gsap } from 'gsap'

const MODEL_URL = '/models/enchanted_crystal_02.glb'

// The model bakes ~0.019 units tall after its node transforms, so scale the
// whole group up to sit nicely in frame (~4.5 units tall).
const TARGET_SCALE = 246

export default function Crystal(props) {
  const group = useRef()
  const { scene } = useGLTF(MODEL_URL)

  // Bake the GLB's mesh(es) into one clean geometry so a single glass
  // transmission material drapes over the entire crystal (the GLB's own baked
  // texture is discarded — we want real refracting glass, not a painted look).
  const geometry = useMemo(() => {
    scene.updateWorldMatrix(true, true)
    const geos = []
    scene.traverse((o) => {
      if (!o.isMesh) return
      const g = o.geometry.clone()
      g.applyMatrix4(o.matrixWorld)
      // Keep only position+normal so meshes with differing attribute sets
      // (uv2, color, tangents…) still merge cleanly.
      for (const key of Object.keys(g.attributes)) {
        if (key !== 'position' && key !== 'normal') g.deleteAttribute(key)
      }
      g.morphAttributes = {}
      geos.push(g)
    })
    const merged =
      geos.length > 1 ? mergeBufferGeometries(geos, false) : geos[0]
    merged.computeVertexNormals()
    merged.center()
    return merged
  }, [scene])

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
      <mesh geometry={geometry}>
        {/* Real-time refracting glass with rainbow dispersion. */}
        <MeshTransmissionMaterial
          transmission={1}
          thickness={1.2}
          roughness={0.06}
          ior={1.7}
          chromaticAberration={0.9}
          anisotropicBlur={0.35}
          distortion={0.35}
          distortionScale={0.4}
          temporalDistortion={0.1}
          samples={10}
          resolution={1024}
          clearcoat={1}
          clearcoatRoughness={0.05}
          iridescence={1}
          iridescenceIOR={1.3}
          iridescenceThicknessRange={[100, 900]}
          attenuationColor="#a9c6ff"
          attenuationDistance={6}
          color="#f2f7ff"
        />
      </mesh>
    </group>
  )
}

useGLTF.preload(MODEL_URL)
