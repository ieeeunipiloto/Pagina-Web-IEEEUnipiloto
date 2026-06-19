import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Componente de Smart City 3D
 * Implementa nodos IoT animados y partículas de datos
 * Optimizado con useMemo para evitar re-cálculos innecesarios
 */

interface NodesProps {
  count: number;
}

function IoTNodes({ count }: NodesProps) {
  const ref = useRef<THREE.Points>(null);

  // Generar posiciones de nodos una sola vez
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 60;
      pos[i3 + 1] = (Math.random() - 0.5) * 30;
      pos[i3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, [count]);

  // Animación de rotación suave
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.0008;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00d4ff"
        size={0.3}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

interface DataParticlesProps {
  count: number;
}

function DataParticles({ count }: DataParticlesProps) {
  const ref = useRef<THREE.Points>(null);

  // Generar posiciones iniciales y velocidades
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 60;
      pos[i3 + 1] = (Math.random() - 0.5) * 30;
      pos[i3 + 2] = (Math.random() - 0.5) * 20;

      vel[i3] = (Math.random() - 0.5) * 0.03;
      vel[i3 + 1] = (Math.random() - 0.5) * 0.03;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.03;
    }

    return [pos, vel];
  }, [count]);

  // Animación de partículas con rebote en los bordes
  useFrame(() => {
    if (ref.current) {
      const pos = ref.current.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        // Actualizar posiciones
        pos[i3] += velocities[i3];
        pos[i3 + 1] += velocities[i3 + 1];
        pos[i3 + 2] += velocities[i3 + 2];

        // Rebotar en los bordes
        if (Math.abs(pos[i3]) > 30) velocities[i3] *= -1;
        if (Math.abs(pos[i3 + 1]) > 15) velocities[i3 + 1] *= -1;
        if (Math.abs(pos[i3 + 2]) > 10) velocities[i3 + 2] *= -1;
      }

      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ff3b3b"
        size={0.15}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

/**
 * Conexiones entre nodos (opcional, puede afectar el rendimiento)
 */
function Connections() {
  const linesRef = useRef<THREE.LineSegments>(null);

  // Generar conexiones aleatorias entre nodos cercanos
  const geometry = useMemo(() => {
    const positions: number[] = [];
    const nodeCount = 40;
    const nodes: THREE.Vector3[] = [];

    // Crear nodos
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 20
        )
      );
    }

    // Conectar nodos cercanos
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const distance = nodes[i].distanceTo(nodes[j]);
        if (distance < 12) {
          positions.push(nodes[i].x, nodes[i].y, nodes[i].z);
          positions.push(nodes[j].x, nodes[j].y, nodes[j].z);
        }
      }
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geom;
  }, []);

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial
        color="#0066ff"
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

/**
 * Escena completa de Smart City
 */
export default function SmartCityScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 30], fov: 75 }}
      className="absolute top-0 left-0 w-full h-full z-0"
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
      gl={{ 
        antialias: true, 
        alpha: true,
        powerPreference: 'high-performance'
      }}
    >
      <color attach="background" args={['#030d38']} />
      <fog attach="fog" args={['#030d38', 20, 60]} />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      <IoTNodes count={60} />
      <DataParticles count={100} />
      <Connections />
    </Canvas>
  );
}
