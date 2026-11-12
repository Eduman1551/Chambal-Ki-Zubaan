// The ONLY 3D part of the site (Stop 5). This file is lazy-loaded, so three.js
// is downloaded only when the player gets near the sanctuary.
//
// Everything is low-poly and built from primitives. The scene reads one number,
// the final River Health, and shows it: clear water full of life, or dull and empty.

import { Sparkles } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { SCENE_FISH_MIN_HEALTH, SCENE_MAX_DPR, SCENE_MAX_FISH } from '../../logic/config'
import { getWaterColors } from '../../logic/waterColor'

const GREEN = '#5FA55A'
const GREEN_DARK = '#3F7F4A'
const SAND = '#E9D8B4'
const SAND_DARK = '#C9AE7C'

/** Low-poly water: a plane whose vertices ride two sine waves. */
function WaterSurface({ health }: { health: number }) {
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(22, 14, 30, 20)
    g.rotateX(-Math.PI / 2)
    return g
  }, [])
  const base = useMemo(() => Float32Array.from(geometry.attributes.position.array), [geometry])
  const material = useRef<THREE.MeshStandardMaterial>(null)
  const target = useMemo(() => new THREE.Color(), [])
  const time = useRef(0)

  useFrame((_, delta) => {
    time.current += delta
    const t = time.current
    // lively waves when healthy, sluggish when not
    const amp = 0.05 + (health / 100) * 0.1
    const pos = geometry.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = base[i * 3]
      const z = base[i * 3 + 2]
      pos.setY(i, Math.sin(x * 0.9 + t * 1.3) * amp + Math.cos(z * 1.2 + t * 0.9) * amp * 0.8)
    }
    pos.needsUpdate = true
    // glide towards the colour for the current health
    target.set(getWaterColors(health).water)
    material.current?.color.lerp(target, 1 - Math.exp(-delta * 3))
  })

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial ref={material} color={getWaterColors(health).water} flatShading roughness={0.35} metalness={0.15} transparent opacity={0.93} />
    </mesh>
  )
}

/** A simple gharial built from spheres, boxes and cones. */
function Gharial({ health }: { health: number }) {
  const body = useRef<THREE.Group>(null)
  const tail = useRef<THREE.Group>(null)
  const time = useRef(0)
  const h = health / 100

  useFrame((_, delta) => {
    time.current += delta
    const t = time.current
    if (body.current) {
      // floats high and bobs when the river is healthy, sinks low when it is not
      const targetY = -0.16 + h * 0.34
      body.current.position.y += (targetY + Math.sin(t * 1.6) * (0.02 + h * 0.04) - body.current.position.y) * 0.08
      body.current.rotation.z = Math.sin(t * 0.8) * 0.03 * (0.4 + h)
    }
    if (tail.current) tail.current.rotation.y = Math.sin(t * (1 + h * 5)) * (0.15 + h * 0.4)
  })

  return (
    <group ref={body} position={[-0.6, 0, 1.6]} rotation={[0, 0.35, 0]} scale={0.95}>
      <mesh scale={[1.5, 0.34, 0.52]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color={GREEN} flatShading />
      </mesh>
      {[-0.9, -0.5, -0.1, 0.3, 0.7].map((x) => (
        <mesh key={x} position={[x, 0.36 - Math.abs(x) * 0.08, 0]}>
          <coneGeometry args={[0.1, 0.22, 4]} />
          <meshStandardMaterial color={GREEN_DARK} flatShading />
        </mesh>
      ))}
      {/* head, long snout and the "ghara" bump */}
      <mesh position={[1.5, 0.1, 0]} scale={[0.5, 0.27, 0.38]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color={GREEN} flatShading />
      </mesh>
      <mesh position={[2.4, 0.08, 0]} scale={[1.3, 0.11, 0.13]}>
        <boxGeometry />
        <meshStandardMaterial color={GREEN} flatShading />
      </mesh>
      <mesh position={[3.0, 0.2, 0]}>
        <sphereGeometry args={[0.12, 8, 6]} />
        <meshStandardMaterial color={GREEN_DARK} flatShading />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side} position={[1.55, 0.33, side * 0.2]}>
          <mesh>
            <sphereGeometry args={[0.12, 8, 6]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.07, 0.03, side * 0.05]}>
            <sphereGeometry args={[0.06, 6, 6]} />
            <meshStandardMaterial color="#2B2B2B" />
          </mesh>
        </group>
      ))}
      {/* legs */}
      {[
        [0.8, 0.5], [0.8, -0.5], [-0.8, 0.5], [-0.8, -0.5],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, -0.18, z]} scale={[0.34, 0.12, 0.22]}>
          <boxGeometry />
          <meshStandardMaterial color={GREEN_DARK} flatShading />
        </mesh>
      ))}
      {/* wagging tail */}
      <group ref={tail} position={[-1.3, 0, 0]}>
        <mesh position={[-0.85, 0, 0]} rotation={[0, 0, Math.PI / 2]} scale={[1, 1, 0.55]}>
          <coneGeometry args={[0.3, 1.8, 6]} />
          <meshStandardMaterial color={GREEN_DARK} flatShading />
        </mesh>
      </group>
    </group>
  )
}

const FISH_COLORS = ['#F28C38', '#F5C542', '#E9F6F8']

/** Fish circling and leaping. More fish the healthier the river. */
function FishSchool({ count }: { count: number }) {
  const fish = useRef<(THREE.Group | null)[]>([])
  const time = useRef(0)

  useFrame((_, delta) => {
    time.current += delta
    const t = time.current
    fish.current.forEach((f, i) => {
      if (!f) return
      const angle = t * (0.5 + (i % 3) * 0.15) + i * 1.9
      const radius = 2.2 + (i % 4) * 0.8
      const hop = Math.sin(t * 1.8 + i * 2.3)
      f.position.set(1.2 + Math.cos(angle) * radius, -0.12 + Math.max(0, hop) * 0.6, -0.4 + Math.sin(angle) * radius * 0.55)
      f.rotation.y = -angle - Math.PI / 2
      f.rotation.z = hop > 0 ? Math.cos(t * 1.8 + i * 2.3) * 0.7 : 0
    })
  })

  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <group key={i} ref={(el) => void (fish.current[i] = el)}>
          <mesh rotation={[0, 0, -Math.PI / 2]} scale={[0.6, 1, 1]}>
            <coneGeometry args={[0.13, 0.42, 5]} />
            <meshStandardMaterial color={FISH_COLORS[i % FISH_COLORS.length]} flatShading />
          </mesh>
          <mesh position={[-0.27, 0, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.5, 1, 1]}>
            <coneGeometry args={[0.11, 0.18, 4]} />
            <meshStandardMaterial color={FISH_COLORS[i % FISH_COLORS.length]} flatShading />
          </mesh>
        </group>
      ))}
    </>
  )
}

const TRASH = [
  { p: [-3.2, 0.9], c: '#F4F4F0', s: [0.34, 0.12, 0.26] },
  { p: [2.6, 2.4], c: '#BFE9F5', s: [0.16, 0.16, 0.42] },
  { p: [3.8, -0.6], c: '#E2447B', s: [0.24, 0.1, 0.24] },
  { p: [-1.8, -1.6], c: '#F4F4F0', s: [0.3, 0.1, 0.3] },
  { p: [0.9, 3.0], c: '#BFE9F5', s: [0.16, 0.16, 0.4] },
  { p: [5.0, 1.4], c: '#D9D2C0', s: [0.3, 0.12, 0.2] },
] as const

/** Litter bobbing on the surface when the river still needs help. */
function Trash({ count }: { count: number }) {
  const items = useRef<(THREE.Mesh | null)[]>([])
  const time = useRef(0)
  useFrame((_, delta) => {
    time.current += delta
    items.current.forEach((m, i) => {
      if (!m) return
      m.position.y = 0.04 + Math.sin(time.current * 1.1 + i * 1.7) * 0.05
      m.rotation.y += delta * 0.15
    })
  })
  return (
    <>
      {TRASH.slice(0, count).map((item, i) => (
        <mesh key={i} ref={(el) => void (items.current[i] = el)} position={[item.p[0], 0.04, item.p[1]]} scale={item.s as unknown as [number, number, number]} rotation={[0.2, i, 0.1]}>
          <boxGeometry />
          <meshStandardMaterial color={item.c} flatShading />
        </mesh>
      ))}
    </>
  )
}

function LilyPad({ position, flower }: { position: [number, number, number]; flower?: boolean }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.42, 0.42, 0.04, 7]} />
        <meshStandardMaterial color={GREEN} flatShading />
      </mesh>
      {flower && (
        <mesh position={[0, 0.16, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.17, 0.26, 6]} />
          <meshStandardMaterial color="#E2447B" flatShading />
        </mesh>
      )}
    </group>
  )
}

function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.08, 0.11, 0.8, 5]} />
        <meshStandardMaterial color="#8A6A45" flatShading />
      </mesh>
      <mesh position={[0, 1.15, 0]}>
        <icosahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial color={GREEN_DARK} flatShading />
      </mesh>
    </group>
  )
}

/** Sandbanks, ravine cliffs, rocks, trees and a sunbathing turtle. */
function Banks({ showTurtle }: { showTurtle: boolean }) {
  return (
    <>
      {/* ravine cliffs at the back */}
      {[
        [-8.5, 0.5, 2.2], [-5.4, 0.3, 1.5], [-2.6, 0.6, 2.4], [0.4, 0.3, 1.4], [3.1, 0.55, 2.2], [6, 0.3, 1.4], [8.8, 0.5, 2],
      ].map(([x, y, h], i) => (
        <mesh key={i} position={[x, y - 0.4, -6.4 - (i % 2) * 0.7]} scale={[2.4, h, 1.6]} rotation={[0, i * 0.9, 0]}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={i % 2 ? SAND_DARK : '#D4BC8A'} flatShading />
        </mesh>
      ))}
      {/* sandbanks */}
      <mesh position={[-5.4, -0.2, -2.6]} scale={[4, 0.55, 2.4]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color={SAND} flatShading />
      </mesh>
      <mesh position={[5.6, -0.25, -3.4]} scale={[3.6, 0.5, 2]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color={SAND} flatShading />
      </mesh>
      <Tree position={[-6.4, 0.2, -3]} scale={1.2} />
      <Tree position={[-4.6, 0.25, -3.6]} scale={0.9} />
      <Tree position={[6.4, 0.15, -3.8]} scale={1.1} />
      {/* rock + turtle */}
      <mesh position={[4.3, 0.05, -1.3]} scale={[0.8, 0.45, 0.6]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#9A9488" flatShading />
      </mesh>
      {showTurtle && (
        <group position={[4.3, 0.52, -1.3]} rotation={[0, -0.6, 0]}>
          <mesh scale={[0.36, 0.2, 0.3]}>
            <sphereGeometry args={[1, 7, 5, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#4E7A3A" flatShading />
          </mesh>
          <mesh position={[0.4, 0.06, 0]}>
            <sphereGeometry args={[0.1, 6, 5]} />
            <meshStandardMaterial color="#8DB36A" flatShading />
          </mesh>
        </group>
      )}
    </>
  )
}

interface Props {
  /** Final River Health, 0-100. */
  health: number
  /** false = pause rendering (scene is off-screen). */
  active: boolean
  /** true = render a still frame instead of animating. */
  still: boolean
}

export default function SanctuaryScene({ health, active, still }: Props) {
  const fishCount =
    health > SCENE_FISH_MIN_HEALTH
      ? Math.round(((health - SCENE_FISH_MIN_HEALTH) / (100 - SCENE_FISH_MIN_HEALTH)) * SCENE_MAX_FISH)
      : 0
  const trashCount = health < 45 ? 6 : health < 55 ? 4 : health < 70 ? 2 : 0

  return (
    <Canvas
      // pause the render loop when off-screen; one still frame for reduced motion
      frameloop={!active ? 'never' : still ? 'demand' : 'always'}
      dpr={[1, SCENE_MAX_DPR]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 3.3, 8.4], fov: 38 }}
      onCreated={({ camera }) => camera.lookAt(0, 0.2, 0)}
    >
      <ambientLight intensity={0.55 + (health / 100) * 0.45} />
      <directionalLight position={[5, 8, 4]} intensity={1.1 + (health / 100) * 0.9} color="#FFF3D6" />
      <WaterSurface health={health} />
      <Banks showTurtle={health >= 55} />
      <Gharial health={health} />
      <FishSchool count={fishCount} />
      <Trash count={trashCount} />
      {health >= 70 && (
        <>
          <LilyPad position={[-3.4, 0.08, 0.6]} flower />
          <LilyPad position={[-2.5, 0.08, 1.2]} />
          <LilyPad position={[3.2, 0.08, 2.2]} flower />
        </>
      )}
      {health >= 80 && <Sparkles count={36} scale={[12, 2.5, 7]} position={[0, 1.2, 0]} size={4} speed={0.4} color="#FFF7C2" />}
    </Canvas>
  )
}
