import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Environment } from '@react-three/drei'
import * as THREE from 'three'

function MouseTracker({ children }: { children: (mouse: { x: number; y: number }) => React.ReactNode }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return <>{children(mouse)}</>
}

function FloatingShape({ position, color, mouse, ...props }: {
  position: [number, number, number]
  color: string
  mouse: { x: number; y: number }
  [key: string]: unknown
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const targetPos = useRef(new THREE.Vector3(...position))

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.1 + mouse.y * 0.3
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.15 + mouse.x * 0.3

    targetPos.current.x = position[0] + mouse.x * 0.8
    targetPos.current.y = position[1] + mouse.y * 0.8
    meshRef.current.position.lerp(targetPos.current, 0.05)
  })

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position} {...props}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color={color}
          roughness={0.2}
          metalness={0.8}
          distort={0.15}
          speed={2}
          transparent
          opacity={0.85}
        />
      </mesh>
    </Float>
  )
}

function FloatingRing({ mouse }: { mouse: { x: number; y: number } }) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2 + mouse.y * 0.2
    ref.current.rotation.y += 0.005 + mouse.x * 0.01
  })

  return (
    <mesh ref={ref} position={[0, 0, -3]}>
      <torusGeometry args={[2.5, 0.03, 16, 64]} />
      <meshBasicMaterial color="#6366f1" transparent opacity={0.3} />
    </mesh>
  )
}

function Particles({ mouse }: { mouse: { x: number; y: number } }) {
  const ref = useRef<THREE.Points>(null!)
  const count = 200
  const positions = new Float32Array(count * 3)
  const initialPositions = new Float32Array(count * 3)

  for (let i = 0; i < count * 3; i++) {
    const pos = (Math.random() - 0.5) * 20
    positions[i] = pos
    initialPositions[i] = pos
  }

  useFrame(() => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      pos[i * 3] = initialPositions[i * 3] + mouse.x * 1.5
      pos[i * 3 + 1] = initialPositions[i * 3 + 1] + mouse.y * 1.5
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#818cf8"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  )
}

function SceneContent() {
  return (
    <MouseTracker>
      {(mouse) => (
        <>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <directionalLight position={[-5, -5, -5]} intensity={0.3} color="#818cf8" />

          <FloatingShape position={[-3, 1.5, -2]} color="#6366f1" mouse={mouse} />
          <FloatingShape position={[3, -1, -1.5]} color="#8b5cf6" mouse={mouse} />
          <FloatingShape position={[-2, -2, -3]} color="#4f46e5" scale={0.6} mouse={mouse} />
          <FloatingShape position={[2.5, 2, -2.5]} color="#a78bfa" scale={0.7} mouse={mouse} />

          <FloatingRing mouse={mouse} />
          <Particles mouse={mouse} />

          <Environment preset="night" />
        </>
      )}
    </MouseTracker>
  )
}

export default function Scene3D() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  )
}
