import { useEffect, useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, RenderTexture, PerspectiveCamera, Text } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'

/* ---------------------------------------------------------------- */
/*  Human figure built from primitives (viewed from behind, suit)    */
/* ---------------------------------------------------------------- */
function HumanFigure() {
  return (
    <group position={[0, -1.2, 0]}>
      <mesh position={[-0.25, -0.7, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.14, 0.8]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.5} metalness={0.1} />
      </mesh>
      <mesh position={[0.25, -0.7, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.14, 0.8]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.5} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.2, 0]} castShadow>
        <capsuleGeometry args={[0.28, 0.6, 8, 16]} />
        <meshStandardMaterial color="#16213e" roughness={0.4} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[0.7, 0.12, 0.3]} />
        <meshStandardMaterial color="#16213e" roughness={0.4} metalness={0.05} />
      </mesh>
      <mesh position={[-0.42, 0.15, 0]} rotation={[0, 0, 0.15]} castShadow>
        <cylinderGeometry args={[0.07, 0.08, 0.55]} />
        <meshStandardMaterial color="#16213e" roughness={0.4} metalness={0.05} />
      </mesh>
      <mesh position={[0.42, 0.15, 0]} rotation={[0, 0, -0.15]} castShadow>
        <cylinderGeometry args={[0.07, 0.08, 0.55]} />
        <meshStandardMaterial color="#16213e" roughness={0.4} metalness={0.05} />
      </mesh>
      <mesh position={[-0.4, -0.18, 0.35]} rotation={[0.6, 0, 0.1]} castShadow>
        <cylinderGeometry args={[0.06, 0.07, 0.35]} />
        <meshStandardMaterial color="#16213e" roughness={0.4} metalness={0.05} />
      </mesh>
      <mesh position={[0.4, -0.18, 0.35]} rotation={[0.6, 0, -0.1]} castShadow>
        <cylinderGeometry args={[0.06, 0.07, 0.35]} />
        <meshStandardMaterial color="#16213e" roughness={0.4} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.62, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 0.1]} />
        <meshStandardMaterial color="#e8c9a0" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.82, 0]} castShadow>
        <sphereGeometry args={[0.15, 24, 24]} />
        <meshStandardMaterial color="#e8c9a0" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.84, -0.12]}>
        <sphereGeometry args={[0.14, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>
    </group>
  )
}

/* ---------------------------------------------------------------- */
/*  Laptop with live screen render                                  */
/* ---------------------------------------------------------------- */
function LaptopScreenContent() {
  return (
    <group>
      <color attach="background" args={['#0a0a0f']} />
      <ambientLight intensity={0.5} />

      {/* Background gradient */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial color="#0a0a0f" />
      </mesh>

      {/* Accent glow */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[0.8, 0.5]} />
        <meshBasicMaterial color="#4f46e5" transparent opacity={0.15} />
      </mesh>

      {/* Name */}
      <Text position={[0, 0.18, 0]} fontSize={0.09} color="#818cf8" anchorX="center" anchorY="middle" letterSpacing={0.05}>
        MOHAMMED FAVAS
      </Text>

      {/* Divider */}
      <mesh position={[0, 0.06, 0]}>
        <planeGeometry args={[0.35, 0.002]} />
        <meshBasicMaterial color="#4f46e5" transparent opacity={0.5} />
      </mesh>

      {/* Tagline */}
      <Text position={[0, -0.02, 0]} fontSize={0.035} color="#a0a0a8" anchorX="center" anchorY="middle">
        Fullstack Web Developer
      </Text>

      {/* Decorative dots */}
      {[[-0.25, -0.14], [0, -0.14], [0.25, -0.14]].map((pos, i) => (
        <mesh key={i} position={[pos[0], pos[1], 0]}>
          <circleGeometry args={[0.012, 12]} />
          <meshBasicMaterial color="#6366f1" transparent opacity={0.4 - i * 0.1} />
        </mesh>
      ))}
    </group>
  )
}

function Laptop() {
  return (
    <group position={[0, -0.1, 0.7]}>
      {/* Desk */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.35, 0]} receiveShadow>
        <planeGeometry args={[2, 1.5]} />
        <meshStandardMaterial color="#0f0f17" roughness={0.9} />
      </mesh>

      {/* Base */}
      <mesh rotation={[-0.2, 0, 0]} position={[0, -0.2, 0.05]} castShadow>
        <boxGeometry args={[0.7, 0.03, 0.5]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Lid */}
      <group position={[0, 0.1, -0.22]}>
        <mesh rotation={[0.5, 0, 0]} castShadow>
          <boxGeometry args={[0.7, 0.48, 0.03]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.3} metalness={0.6} />
        </mesh>

        {/* Screen with live render */}
        <mesh rotation={[0.5, 0, 0]} position={[0, 0, 0.02]}>
          <planeGeometry args={[0.62, 0.4]} />
          <meshBasicMaterial>
            <RenderTexture attach="map" width={1024} height={640}>
              <LaptopScreenContent />
            </RenderTexture>
          </meshBasicMaterial>
        </mesh>
      </group>

      {/* Keyboard glow */}
      <mesh rotation={[-0.2, 0, 0]} position={[0, -0.18, 0.05]}>
        <planeGeometry args={[0.6, 0.35]} />
        <meshBasicMaterial color="#4f46e5" transparent opacity={0.06} />
      </mesh>
    </group>
  )
}

/* ---------------------------------------------------------------- */
/*  Ambient Particles                                                */
/* ---------------------------------------------------------------- */
function Particles() {
  const ref = useRef<THREE.Points>(null!)
  const count = 120

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const siz = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 6
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4 - 1
      siz[i] = Math.random() * 0.025 + 0.005
    }
    return [pos, siz]
  }, [])

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.01
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} count={count} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#818cf8" transparent opacity={0.25} sizeAttenuation depthWrite={false} />
    </points>
  )
}

/* ---------------------------------------------------------------- */
/*  Lights                                                           */
/* ---------------------------------------------------------------- */
function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.12} />
      <spotLight position={[0, 0.3, 0.5]} angle={0.6} penumbra={0.8} intensity={4} color="#818cf8" distance={4} decay={2} castShadow />
      <directionalLight position={[0, 3, -1]} intensity={0.25} color="#4f46e5" />
      <directionalLight position={[-2, 1, -2]} intensity={0.15} color="#a78bfa" />
      <pointLight position={[0, 0, -2]} intensity={0.3} color="#6366f1" />
    </>
  )
}

/* ---------------------------------------------------------------- */
/*  Floating orbs                                                    */
/* ---------------------------------------------------------------- */
function FloatingOrbs() {
  const ref = useRef<THREE.Group>(null!)

  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.001
  })

  const orbs = [
    { pos: [-0.8, 0.5, -0.5] as [number, number, number], color: '#6366f1', size: 0.06 },
    { pos: [0.9, -0.3, -0.3] as [number, number, number], color: '#8b5cf6', size: 0.04 },
    { pos: [-0.5, -0.6, -0.8] as [number, number, number], color: '#4f46e5', size: 0.05 },
    { pos: [0.6, 0.7, -0.6] as [number, number, number], color: '#a78bfa', size: 0.03 },
  ]

  return (
    <group ref={ref}>
      {orbs.map((orb, i) => (
        <Float key={i} speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <mesh position={orb.pos}>
            <sphereGeometry args={[orb.size, 16, 16]} />
            <meshBasicMaterial color={orb.color} transparent opacity={0.3} />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

/* ---------------------------------------------------------------- */
/*  Camera animation with GSAP (tween plain object, apply in useFrame)*/
/* ---------------------------------------------------------------- */
function CameraAnimator({ onComplete }: { onComplete: () => void }) {
  const { camera } = useThree()
  const p = useRef({ z: 2.5, y: 1.5 })
  const done = useRef(false)

  useEffect(() => {
    camera.position.set(0, 1.5, 2.5)
    camera.lookAt(0, 0, 0)

    gsap.to(p.current, {
      z: 0.45,
      y: 0.3,
      duration: 3.5,
      ease: 'power2.inOut',
      delay: 0.3,
    })

    gsap.to(p.current, {
      z: -0.6,
      y: 0.05,
      duration: 3,
      ease: 'power2.in',
      delay: 2.8,
      onComplete: () => {
        done.current = true
        onComplete()
      },
    })

    return () => { gsap.killTweensOf(p.current) }
  }, [camera, onComplete])

  useFrame(() => {
    camera.position.set(0, p.current.y, p.current.z)
    camera.lookAt(0, 0, 0)
  })

  return null
}

/* ---------------------------------------------------------------- */
/*  Main Cinematic Intro                                             */
/* ---------------------------------------------------------------- */
interface CinematicIntroProps {
  onComplete: () => void
}

export default function CinematicIntro({ onComplete }: CinematicIntroProps) {
  return (
    <div className="fixed inset-0 z-[650]">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
        style={{ background: '#0a0a0f' }}
      >
        <PerspectiveCamera makeDefault position={[0, 1.5, 2.5]} fov={38} />
        <SceneLights />
        <HumanFigure />
        <Laptop />
        <FloatingOrbs />
        <Particles />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]} receiveShadow>
          <planeGeometry args={[4, 4]} />
          <shadowMaterial transparent opacity={0.25} />
        </mesh>

        <CameraAnimator onComplete={onComplete} />
      </Canvas>
    </div>
  )
}
