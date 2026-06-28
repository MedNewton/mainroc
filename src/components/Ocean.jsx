import { useRef, useMemo } from 'react'
import { extend, useThree, useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { Water } from 'three/examples/jsm/objects/Water.js'

// Make three's Water object usable as a JSX element: <water />
extend({ Water })

// A large reflective ocean plane. Reflects the sky + scene and ripples over
// time, giving the hero that "crystal floating above the sea" look.
export default function Ocean({ sunDirection, position = [0, -2.6, 0] }) {
  const ref = useRef()
  const gl = useThree((s) => s.gl)

  const waterNormals = useLoader(
    THREE.TextureLoader,
    '/textures/waternormals.jpg',
  )
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping

  const geometry = useMemo(() => new THREE.PlaneGeometry(10000, 10000), [])

  const config = useMemo(
    () => ({
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: sunDirection.clone().normalize(),
      sunColor: 0xbcd6ff,
      waterColor: 0x0a2a4f,
      distortionScale: 3.4,
      fog: true,
    }),
    [waterNormals, sunDirection],
  )

  useFrame((_, delta) => {
    const w = ref.current
    if (w) w.material.uniforms.time.value += delta * 0.55
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
