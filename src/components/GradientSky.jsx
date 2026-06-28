import { useMemo } from 'react'
import * as THREE from 'three'

// A controllable navy gradient sky dome (deep navy overhead → hazy blue at the
// horizon). Unlike three's physical Sky it has no blown-out sun disk, which
// gives the dark, cinematic mood from the reference. fog is disabled so the
// dome keeps its full gradient while the ocean still hazes into the horizon.
const vertex = /* glsl */ `
  varying vec3 vWorldPosition;
  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragment = /* glsl */ `
  varying vec3 vWorldPosition;
  uniform vec3 uTop;
  uniform vec3 uHorizon;
  uniform vec3 uGlow;
  void main() {
    float h = normalize(vWorldPosition).y;
    // Sky: horizon -> top.
    float t = smoothstep(-0.02, 0.55, h);
    vec3 color = mix(uHorizon, uTop, t);
    // Soft luminous band right at the horizon.
    float band = exp(-pow(h * 9.0, 2.0));
    color = mix(color, uGlow, band * 0.6);
    gl_FragColor = vec4(color, 1.0);
  }
`

export default function GradientSky() {
  const uniforms = useMemo(
    () => ({
      uTop: { value: new THREE.Color('#0f2a55') },
      uHorizon: { value: new THREE.Color('#4f76ad') },
      uGlow: { value: new THREE.Color('#b9cee9') },
    }),
    [],
  )

  return (
    <mesh scale={[1, 1, 1]}>
      <sphereGeometry args={[4000, 32, 16]} />
      <shaderMaterial
        side={THREE.BackSide}
        depthWrite={false}
        fog={false}
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
      />
    </mesh>
  )
}
