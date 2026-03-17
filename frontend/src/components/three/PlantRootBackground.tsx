import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * 3D Plant Root animation that grows in the background.
 * Uses procedural geometry to create organic, root-like tendrils
 * that slowly grow and branch across the scene.
 */

interface RootBranchProps {
  startPoint: THREE.Vector3;
  direction: THREE.Vector3;
  length: number;
  thickness: number;
  color: string;
  speed: number;
  delay: number;
}

function RootBranch({ startPoint, direction, length, thickness, color, speed, delay }: RootBranchProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef(0);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  const curve = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 20;
    let currentPoint = startPoint.clone();
    const currentDir = direction.clone().normalize();

    for (let i = 0; i <= segments; i++) {
      points.push(currentPoint.clone());
      // Add organic randomness to the growth direction
      currentDir.x += (Math.random() - 0.5) * 0.3;
      currentDir.y += (Math.random() - 0.5) * 0.15 - 0.02; // Slight downward bias (roots grow down)
      currentDir.z += (Math.random() - 0.5) * 0.3;
      currentDir.normalize();
      currentPoint = currentPoint.clone().add(currentDir.clone().multiplyScalar(length / segments));
    }

    return new THREE.CatmullRomCurve3(points);
  }, [startPoint, direction, length]);

  const geometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 64, thickness, 8, false);
  }, [curve, thickness]);

  useFrame((_, delta) => {
    if (!meshRef.current || !materialRef.current) return;

    if (progressRef.current < delay) {
      progressRef.current += delta;
      materialRef.current.opacity = 0;
      return;
    }

    const growthProgress = Math.min(
      (progressRef.current - delay) * speed,
      1
    );
    progressRef.current += delta;

    // Animate the material opacity based on growth
    materialRef.current.opacity = growthProgress * 0.6;

    // Scale to simulate growth
    meshRef.current.scale.setScalar(Math.min(growthProgress * 1.2, 1));
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        ref={materialRef}
        color={color}
        transparent
        opacity={0}
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
}

function RootSystem() {
  const roots = useMemo(() => {
    const rootConfigs: RootBranchProps[] = [];
    const goldColors = ['#D4A843', '#B8860B', '#8B7355', '#6B5B3A', '#4A3C28'];

    // Create main roots from the top center
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const spread = 0.5 + Math.random() * 1.5;

      rootConfigs.push({
        startPoint: new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          3 + Math.random() * 2,
          -5 + Math.random() * 2
        ),
        direction: new THREE.Vector3(
          Math.cos(angle) * spread,
          -1 - Math.random() * 0.5,
          Math.sin(angle) * 0.3 - 0.5
        ),
        length: 4 + Math.random() * 6,
        thickness: 0.02 + Math.random() * 0.04,
        color: goldColors[Math.floor(Math.random() * goldColors.length)],
        speed: 0.15 + Math.random() * 0.1,
        delay: i * 0.3 + Math.random() * 0.5,
      });
    }

    // Secondary thinner branches
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      rootConfigs.push({
        startPoint: new THREE.Vector3(
          (Math.random() - 0.5) * 6,
          Math.random() * 4,
          -5 + Math.random() * 3
        ),
        direction: new THREE.Vector3(
          Math.cos(angle) * 0.8,
          -0.5 - Math.random() * 1,
          Math.sin(angle) * 0.3 - 0.3
        ),
        length: 2 + Math.random() * 4,
        thickness: 0.005 + Math.random() * 0.015,
        color: goldColors[Math.floor(Math.random() * goldColors.length)],
        speed: 0.1 + Math.random() * 0.15,
        delay: 2 + i * 0.2 + Math.random() * 1,
      });
    }

    return rootConfigs;
  }, []);

  return (
    <group>
      {roots.map((root, i) => (
        <RootBranch key={i} {...root} />
      ))}
    </group>
  );
}

function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);

  const { positions, opacities } = useMemo(() => {
    const count = 200;
    const pos = new Float32Array(count * 3);
    const ops = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
      ops[i] = Math.random();
    }

    return { positions: pos, opacities: ops };
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;
    particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#D4A843"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

export default function PlantRootBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 5, 5]} intensity={0.8} color="#D4A843" />
        <pointLight position={[-3, -3, 3]} intensity={0.3} color="#FFD700" />
        <RootSystem />
        <ParticleField />
      </Canvas>
    </div>
  );
}
