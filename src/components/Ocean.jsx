import { useRef, useMemo, useEffect } from 'react'
import { extend, useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { Water } from 'three/examples/jsm/objects/Water.js'

// three.js's Water: a flat reflective sea with scrolling normal-map ripples.
// It renders a live reflection of the scene (sky, stars and the crystal), which
// is what gives the realistic, mirror-like night-ocean look from the reference.
extend({ Water })

export default function Ocean({ sunDirection, position = [0, 0, 0] }) {
  const ref = useRef()

  const waterNormals = useLoader(
    THREE.TextureLoader,
    '/textures/waternormals.jpg',
  )
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping

  const geometry = useMemo(() => new THREE.PlaneGeometry(10000, 10000), [])

  const config = useMemo(
    () => ({
      textureWidth: 1024,
      textureHeight: 1024,
      waterNormals,
      sunDirection: sunDirection.clone().normalize(),
      sunColor: 0x8fb4e6,
      waterColor: 0x081a30,
      distortionScale: 2.6,
      fog: true,
    }),
    [waterNormals, sunDirection],
  )

  // Smaller normal tiling → finer, choppier ripples than the default.
  useEffect(() => {
    const w = ref.current
    if (w) w.material.uniforms.size.value = 6.0
  }, [])

  useFrame((_, delta) => {
    const w = ref.current
    if (w) w.material.uniforms.time.value += delta * 0.6
  })

  return (
    <water
      ref={ref}
      args={[geometry, config]}
      rotation-x={-Math.PI / 2}
      position={position}
    />
  )
}
