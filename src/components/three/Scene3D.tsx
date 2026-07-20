import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Environment } from '@react-three/drei'
import * as THREE from 'three'

function FloatingShape({ position, color, ...props }: {
  position: [number, number, number]
  color: string
  [key: string]: unknown
}) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.1
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.15
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

function FloatingRing() {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2
    ref.current.rotation.y += 0.005
  })

  return (
    <mesh ref={ref} position={[0, 0, -3]}>
      <torusGeometry args={[2.5, 0.03, 16, 64]} />
      <meshBasicMaterial color="#6366f1" transparent opacity={0.3} />
    </mesh>
  )
}

function Particles() {
  const count = 200
  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 20
  }

  return (
    <points>
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

export default function Scene3D() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <directionalLight position={[-5, -5, -5]} intensity={0.3} color="#818cf8" />

          <FloatingShape position={[-3, 1.5, -2]} color="#6366f1" />
          <FloatingShape position={[3, -1, -1.5]} color="#8b5cf6" />
          <FloatingShape position={[-2, -2, -3]} color="#4f46e5" scale={0.6} />
          <FloatingShape position={[2.5, 2, -2.5]} color="#a78bfa" scale={0.7} />

          <FloatingRing />
          <Particles />

          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  )
}
