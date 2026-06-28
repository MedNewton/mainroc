import { useMemo } from 'react'
import * as THREE from 'three'

// A dark night-blue sky dome: near-black navy overhead, deep blue at the
// horizon, with a soft glow behind the crystal (a faint "moonlight" so the
// scene isn't flat). No clouds — clean night sky. fog disabled so the dome
// keeps its full gradient.
const vertex = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragment = /* glsl */ `
  varying vec3 vDir;
  uniform vec3 uZenith;
  uniform vec3 uHorizon;
  uniform vec3 uGlow;
  uniform vec3 uGlowDir;
  void main() {
    vec3 dir = normalize(vDir);
    // Slow gradient so the visible sky stays clearly blue rather than going
    // black near the top of the frame.
    float t = smoothstep(-0.1, 1.1, dir.y);
    vec3 color = mix(uHorizon, uZenith, t);
    // Broad soft glow toward the moonlight direction (behind the crystal).
    float g = max(dot(dir, normalize(uGlowDir)), 0.0);
    color += uGlow * pow(g, 3.0);
    gl_FragColor = vec4(color, 1.0);
  }
`

export default function GradientSky() {
  const uniforms = useMemo(
    () => ({
      uZenith: { value: new THREE.Color('#081530') },
      uHorizon: { value: new THREE.Color('#1d4474') },
      uGlow: { value: new THREE.Color('#3f6fa6') },
      uGlowDir: { value: new THREE.Vector3(0, 0.1, -1) },
    }),
    [],
  )

  return (
    <mesh>
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
