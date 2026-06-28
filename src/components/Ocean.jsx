import { useRef, useMemo } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'

// A real-time Gerstner-wave ocean. The mesh is a finely-subdivided plane whose
// vertices are displaced in the vertex shader by a sum of Gerstner waves
// (rolling swells with sharpened crests). The fragment shader does a Fresnel
// sky reflection, a moonlight specular streak, fine normal-map ripple detail,
// a pool of the crystal's glow on the water, and distance fog that melts the
// plane edge into the horizon. Pure code — a few KB, infinite, animated.

// Each wave: direction (x,z), wavelength, amplitude, speed, steepness.
const WAVES = [
  { dir: [1.0, 0.35], len: 58, amp: 1.1, speed: 3.6, steep: 0.7 },
  { dir: [0.7, 1.0], len: 31, amp: 0.7, speed: 3.0, steep: 0.7 },
  { dir: [1.0, 0.6], len: 17, amp: 0.4, speed: 2.4, steep: 0.75 },
  { dir: [0.35, 1.0], len: 9.5, amp: 0.22, speed: 2.0, steep: 0.8 },
]

const vertex = /* glsl */ `
  uniform float uTime;
  uniform vec2 uDir[4];
  uniform float uAmp[4];
  uniform float uLen[4];
  uniform float uSpeed[4];
  uniform float uSteep[4];
  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying float vCrest;

  void main() {
    vec2 xz = position.xz;          // geometry is pre-rotated into the XZ plane
    vec3 p = vec3(position.x, 0.0, position.z);
    vec3 n = vec3(0.0, 1.0, 0.0);
    float crest = 0.0;

    for (int i = 0; i < 4; i++) {
      vec2 d = normalize(uDir[i]);
      float k = 6.2831853 / uLen[i];
      float w = uSpeed[i] * k;
      float f = k * dot(d, xz) - w * uTime;
      float a = uAmp[i];
      float q = uSteep[i];
      float cosf = cos(f);
      float sinf = sin(f);

      p.x += q * a * d.x * cosf;
      p.z += q * a * d.y * cosf;
      p.y += a * sinf;

      float wa = k * a;
      n.x -= d.x * wa * cosf;
      n.z -= d.y * wa * cosf;
      n.y -= q * wa * sinf;

      crest += sinf;
    }

    vNormal = normalize(n);
    vWorldPos = (modelMatrix * vec4(p, 1.0)).xyz;
    vCrest = crest;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

const fragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec3 uDeep;
  uniform vec3 uShallow;
  uniform vec3 uSkyZenith;
  uniform vec3 uSkyHorizon;
  uniform vec3 uGlow;
  uniform vec3 uMoonDir;
  uniform vec3 uMoonCol;
  uniform vec3 uCrystalPos;
  uniform vec3 uCrystalGlow;
  uniform sampler2D uNormalMap;
  uniform vec3 uFogColor;
  uniform float uFogNear;
  uniform float uFogFar;
  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying float vCrest;

  vec3 skyColor(vec3 dir) {
    float t = smoothstep(-0.08, 0.6, dir.y);
    vec3 col = mix(uSkyHorizon, uSkyZenith, t);
    float g = max(dot(normalize(dir), normalize(uMoonDir)), 0.0);
    col += uGlow * pow(g, 5.0);
    return col;
  }

  void main() {
    vec3 N = normalize(vNormal);

    // Fine ripple detail from two scrolling normal-map samples.
    vec2 uv1 = vWorldPos.xz * 0.06 + vec2(uTime * 0.02, uTime * 0.015);
    vec2 uv2 = vWorldPos.xz * 0.14 - vec2(uTime * 0.018, uTime * 0.022);
    vec3 nm = texture2D(uNormalMap, uv1).rgb + texture2D(uNormalMap, uv2).rgb - 1.0;
    N = normalize(N + vec3(nm.x, 0.0, nm.z) * 0.8);

    vec3 V = normalize(cameraPosition - vWorldPos);
    float fres = pow(1.0 - max(dot(N, V), 0.0), 4.0);
    fres = mix(0.08, 1.0, fres);

    vec3 R = reflect(-V, N);
    vec3 refl = skyColor(R);

    // Sky sheen lights the wave faces even where they don't mirror-reflect.
    vec3 base = mix(uDeep, uShallow, clamp(N.y * 0.5 + 0.5, 0.0, 1.0));
    base += uSkyHorizon * 0.35 * clamp(N.y, 0.0, 1.0);
    vec3 col = mix(base, refl, fres);

    // Broad moonlight glints across the crests.
    vec3 H = normalize(V + normalize(uMoonDir));
    float spec = pow(max(dot(N, H), 0.0), 90.0);
    col += uMoonCol * spec * 3.0;

    // Pool of the crystal's glow on the water beneath it.
    float d = distance(vWorldPos.xz, uCrystalPos.xz);
    col += uCrystalGlow * exp(-d * d * 0.018);

    // Foam on the steepest crests.
    float foam = smoothstep(0.5, 1.0, vCrest * 0.28 + (1.0 - N.y));
    col += vec3(0.6, 0.7, 0.85) * foam * 0.12;

    // Distance fog blends the plane edge into the horizon.
    float dist = length(cameraPosition - vWorldPos);
    col = mix(col, uFogColor, smoothstep(uFogNear, uFogFar, dist));

    gl_FragColor = vec4(col, 1.0);
  }
`

export default function Ocean({ crystalPosition = [0, 0, 0] }) {
  const matRef = useRef()

  const normalMap = useLoader(THREE.TextureLoader, '/textures/waternormals.jpg')
  normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping
  normalMap.colorSpace = THREE.NoColorSpace

  // Pre-rotate the plane into the XZ (horizontal) plane so the shader works in
  // world axes.
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(700, 700, 420, 420)
    g.rotateX(-Math.PI / 2)
    return g
  }, [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDir: { value: WAVES.map((w) => new THREE.Vector2(w.dir[0], w.dir[1])) },
      uAmp: { value: WAVES.map((w) => w.amp) },
      uLen: { value: WAVES.map((w) => w.len) },
      uSpeed: { value: WAVES.map((w) => w.speed) },
      uSteep: { value: WAVES.map((w) => w.steep) },
      uDeep: { value: new THREE.Color('#04141f') },
      uShallow: { value: new THREE.Color('#123e64') },
      uSkyZenith: { value: new THREE.Color('#04111f') },
      uSkyHorizon: { value: new THREE.Color('#1d4e84') },
      uGlow: { value: new THREE.Color('#4f8bc4') },
      uMoonDir: { value: new THREE.Vector3(0, 0.22, -1).normalize() },
      uMoonCol: { value: new THREE.Color('#dcebff') },
      uCrystalPos: { value: new THREE.Vector3(...crystalPosition) },
      uCrystalGlow: { value: new THREE.Color('#246f9c') },
      uNormalMap: { value: normalMap },
      uFogColor: { value: new THREE.Color('#0a2649') },
      uFogNear: { value: 40 },
      uFogFar: { value: 280 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [normalMap],
  )

  useFrame((_, delta) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += delta
  })

  return (
    <mesh geometry={geometry} position={[0, 0, 0]}>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
      />
    </mesh>
  )
}
