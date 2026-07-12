/**
 * SmartCityScene.tsx — Escena 3D de ciudad inteligente (Smart City).
 *
 * Utiliza Three.js via React Three Fiber (@react-three/fiber) para renderizar
 * una escena interactiva en tiempo real que representa conceptos de IoT,
 * Smart Cities y telecomunicaciones.
 *
 * Elementos de la escena:
 * 1. GroundGrid — Rejilla base con opacidad pulsante (latido tecnológico).
 * 2. Buildings — Edificios dispuestos circularmente con emisión cibernética.
 * 3. IoTSensors — Esferas brillantes que pulsan (sensores IoT).
 * 4. DataFlow — Paquetes de datos viajando entre nodos (líneas + esferas).
 * 5. MovingCars — Vehículos autónomos circulando alrededor de la ciudad.
 * 6. OrbitingSatellites — Satélites orbitando con anillo de comunicaciones.
 *
 * Paleta de colores:
 * - IOT_COLOR (#00d4ff): azul cibernético representando IoT.
 * - DATA_COLOR (#ff3b3b): rojo representando flujo de datos.
 * - CAR_COLORS: variedad para vehículos.
 */

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** Color representativo de IoT / conectividad */
const IOT_COLOR = '#00d4ff';
/** Color representativo de flujo de datos */
const DATA_COLOR = '#ff3b3b';
/** Colores para los vehículos autónomos */
const CAR_COLORS = ['#e8e8e8', '#00d4ff', '#ff3b3b', '#ffd43b'];

// ──────────────────────────────────────────────
// 1. GROUND GRID — Rejilla base con pulsación
// ──────────────────────────────────────────────

/**
 * GroundGrid — Rejilla de suelo con opacidad animada.
 *
 * Dibuja una cuadrícula de 40x40 unidades usando LineSegments.
 * La opacidad pulsa suavemente con el tiempo para dar sensación de
 * "vida tecnológica" al suelo de la ciudad.
 *
 * @returns {JSX.Element} LineSegments con la rejilla
 */
function GroundGrid() {
  const gridRef = useRef<THREE.LineSegments>(null);
  const size = 40;
  const divs = 20;

  /** Genera geometría de la rejilla (calculada una sola vez con useMemo) */
  const geom = useMemo(() => {
    const positions: number[] = [];
    const half = size / 2;
    const step = size / divs;
    for (let i = 0; i <= divs; i++) {
      const p = -half + i * step;
      positions.push(-half, 0, p, half, 0, p);
      positions.push(p, 0, -half, p, 0, half);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return g;
  }, []);

  /** Animación: opacidad pulsante en cada frame */
  useFrame(({ clock }) => {
    if (gridRef.current) {
      (gridRef.current.material as THREE.LineBasicMaterial).opacity =
        0.15 + Math.sin(clock.elapsedTime * 0.3) * 0.08;
    }
  });

  return (
    <lineSegments ref={gridRef} geometry={geom}>
      <lineBasicMaterial color={IOT_COLOR} transparent opacity={0.15} />
    </lineSegments>
  );
}

// ──────────────────────────────────────────────
// 2. BUILDINGS — Edificios de la ciudad
// ──────────────────────────────────────────────

/**
 * Buildings — Conjunto de edificios dispuestos en círculo.
 *
 * 14 edificios de alturas variables, colores oscuros con emisión cibernética.
 * Dispuestos en un radio de ~14 unidades con variación aleatoria.
 *
 * @returns {JSX.Element} Grupo de edificios
 */
function Buildings() {
  const count = 14;
  const radius = 14;

  /** Genera posiciones y alturas aleatorias (una vez, con useMemo) */
  const data = useMemo(() => {
    const result: { pos: [number, number, number]; h: number; color: string }[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const dist = radius + (Math.random() - 0.5) * 4;
      const h = 1.5 + Math.random() * 5;
      result.push({
        pos: [Math.cos(angle) * dist, h / 2, Math.sin(angle) * dist],
        h,
        color: Math.random() > 0.4 ? '#142049' : '#0c1230',
      });
    }
    return result;
  }, []);

  return (
    <group>
      {data.map((d, i) => (
        <mesh key={i} position={d.pos}>
          <boxGeometry args={[1.2, d.h, 1.2]} />
          <meshStandardMaterial color={d.color} emissive={IOT_COLOR} emissiveIntensity={0.1} roughness={0.6} metalness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

// ──────────────────────────────────────────────
// 3. IOT SENSORS — Sensores con pulso luminoso
// ──────────────────────────────────────────────

/**
 * IoTSensors — Esferas brillantes que representan sensores IoT.
 *
 * Cada sensor pulsa en intensidad y escala con una onda senoidal,
 * simulando transmisión de datos desde dispositivos IoT.
 *
 * @returns {JSX.Element} Grupo de esferas sensoras
 */
function IoTSensors() {
  const count = 8;
  const refs = useRef<(THREE.Mesh | null)[]>([]);

  /** Posiciones sobre los edificios (una vez) */
  const positions = useMemo(() => {
    const pos: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const dist = 14 + (Math.random() - 0.5) * 4;
      const h = 1.5 + Math.random() * 5;
      pos.push([Math.cos(angle) * dist, h + 0.3, Math.sin(angle) * dist]);
    }
    return pos;
  }, []);

  /** Animación: pulso de escala e intensidad lumínica */
  useFrame(({ clock }) => {
    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const pulse = 0.5 + Math.sin(clock.elapsedTime * 2.5 + i * 1.2) * 0.5;
      mesh.scale.setScalar(0.5 + pulse * 0.5);
      (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 + pulse;
    });
  });

  return (
    <group>
      {positions.map((p, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el; }} position={p}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color={IOT_COLOR} emissive={IOT_COLOR} emissiveIntensity={1} />
        </mesh>
      ))}
    </group>
  );
}

// ──────────────────────────────────────────────
// 4. DATA FLOW — Paquetes de datos viajando
// ──────────────────────────────────────────────

/**
 * DataFlow — Simulación de tráfico de datos en la ciudad.
 *
 * Crea líneas de conexión entre nodos aleatorios y esferas rojas
 * (paquetes) que viajan a lo largo de esas líneas, representando
 * comunicaciones IoT, fibra óptica o transmisión inalámbrica.
 *
 * @returns {JSX.Element} Líneas + partículas en movimiento
 */
function DataFlow() {
  const count = 12;
  const packetRefs = useRef<(THREE.Mesh | null)[]>([]);
  const progress = useRef<number[]>(Array.from({ length: count }, (_, i) => i / count));

  /** Rutas aleatorias entre puntos de la ciudad */
  const paths = useMemo(() => {
    const result: { from: THREE.Vector3; to: THREE.Vector3 }[] = [];
    for (let i = 0; i < count; i++) {
      const a1 = Math.random() * Math.PI * 2;
      const a2 = Math.random() * Math.PI * 2;
      const d1 = 12 + Math.random() * 6;
      const d2 = 12 + Math.random() * 6;
      result.push({
        from: new THREE.Vector3(Math.cos(a1) * d1, 0.5 + Math.random() * 4, Math.sin(a1) * d1),
        to: new THREE.Vector3(Math.cos(a2) * d2, 0.5 + Math.random() * 4, Math.sin(a2) * d2),
      });
    }
    return result;
  }, []);

  /** Líneas visuales entre origen y destino */
  const lines = useMemo(
    () => paths.map((p) => {
      const geom = new THREE.BufferGeometry().setFromPoints([p.from, p.to]);
      const mat = new THREE.LineBasicMaterial({ color: IOT_COLOR, transparent: true, opacity: 0.2 });
      return new THREE.Line(geom, mat);
    }),
    [paths]
  );

  /** Animación: mover paquetes a lo largo de las rutas */
  useFrame((_state, delta) => {
    paths.forEach((p, i) => {
      progress.current[i] = (progress.current[i] + delta * 0.3 * (0.5 + (i % 3) * 0.25)) % 1;
      const mesh = packetRefs.current[i];
      if (mesh) {
        mesh.position.lerpVectors(p.from, p.to, progress.current[i]);
      }
    });
  });

  return (
    <group>
      {/* Líneas de conexión */}
      {lines.map((line, i) => (
        <primitive key={`l-${i}`} object={line} />
      ))}
      {/* Paquetes de datos viajando */}
      {paths.map((_, i) => (
        <mesh key={`p-${i}`} ref={(el) => { packetRefs.current[i] = el; }}>
          <sphereGeometry args={[0.08, 6, 6]} />
          <meshStandardMaterial color={DATA_COLOR} emissive={DATA_COLOR} emissiveIntensity={2} />
        </mesh>
      ))}
    </group>
  );
}

// ──────────────────────────────────────────────
// 5. MOVING CARS — Vehículos autónomos
// ──────────────────────────────────────────────

/**
 * MovingCars — Vehículos circulando alrededor de la ciudad.
 *
 * 6 vehículos con colores variados que se mueven tangencialmente
 * a su posición orbital, simulando tráfico urbano autónomo.
 * Cada vehículo tiene luces delanteras (blancas) y traseras (rojas).
 *
 * @returns {JSX.Element} Grupo de vehículos en movimiento
 */
function MovingCars() {
  const count = 6;
  const refs = useRef<(THREE.Group | null)[]>([]);
  const offsets = useRef<number[]>(Array.from({ length: count }, () => (Math.random() - 0.5) * 30));
  const speeds = useRef<number[]>(Array.from({ length: count }, () => 2 + Math.random() * 3));

  /** Animación: actualizar posición y rotación de cada vehículo */
  useFrame((_state, delta) => {
    refs.current.forEach((group, i) => {
      if (!group) return;
      offsets.current[i] += speeds.current[i] * delta;
      if (offsets.current[i] > 16) offsets.current[i] = -16;
      if (offsets.current[i] < -16) offsets.current[i] = 16;

      const angle = (i / count) * Math.PI * 2 + 0.3;
      const radius = 8 + (i % 3) * 2;
      const cx = Math.cos(angle) * radius;
      const cz = Math.sin(angle) * radius;
      const tangent = angle + Math.PI / 2;
      group.position.set(
        cx + Math.cos(tangent) * offsets.current[i],
        0.25,
        cz + Math.sin(tangent) * offsets.current[i]
      );
      group.rotation.y = -tangent;
    });
  });

  return (
    <group>
      {Array.from({ length: count }).map((_, i) => (
        <group key={i} ref={(el) => { refs.current[i] = el; }}>
          {/* Carrocería */}
          <mesh>
            <boxGeometry args={[0.7, 0.3, 1.3]} />
            <meshStandardMaterial color={CAR_COLORS[i % CAR_COLORS.length]} roughness={0.4} metalness={0.5} />
          </mesh>
          {/* Luz delantera */}
          <mesh position={[0, 0.05, 0.7]}>
            <sphereGeometry args={[0.06, 6, 6]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
          </mesh>
          {/* Luz trasera */}
          <mesh position={[0, 0.05, -0.7]}>
            <sphereGeometry args={[0.06, 6, 6]} />
            <meshStandardMaterial color="#ff3b3b" emissive="#ff3b3b" emissiveIntensity={2} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ──────────────────────────────────────────────
// 6. ORBITING SATELLITES — Satélites en órbita
// ──────────────────────────────────────────────

/**
 * OrbitingSatellites — Satélites orbitando con anillo de comunicaciones.
 *
 * Renderiza una estación base central con 3 satélites en órbita
 * y un anillo de comunicaciones. Simula infraestructura de
 * telecomunicaciones satelital (conectividad global IoT).
 *
 * @returns {JSX.Element} Grupo orbital
 */
function OrbitingSatellites() {
  const orbitRef = useRef<THREE.Group>(null);
  const satRefs = useRef<(THREE.Mesh | null)[]>([]);

  /** Animación: rotación orbital de satélites */
  useFrame(({ clock }) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y += 0.003;
    }
    satRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const angle = clock.elapsedTime * 0.5 + i * 2.1;
      mesh.position.set(Math.cos(angle) * 1.2, Math.sin(angle * 0.7) * 0.3 + 0.5, Math.sin(angle) * 1.2);
    });
  });

  return (
    <group ref={orbitRef} position={[0, 6, 0]}>
      {/* Base central */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.25, 0.1, 6]} />
        <meshStandardMaterial color="#0c1230" emissive={IOT_COLOR} emissiveIntensity={0.3} metalness={0.6} />
      </mesh>
      {/* 3 satélites en órbita */}
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh key={i} ref={(el) => { satRefs.current[i] = el; }}>
          <boxGeometry args={[0.2, 0.05, 0.3]} />
          <meshStandardMaterial color="#e8e8e8" emissive={IOT_COLOR} emissiveIntensity={0.2} metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
      {/* Anillo orbital decorativo */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.8, 2, 32]} />
        <meshStandardMaterial color={IOT_COLOR} emissive={IOT_COLOR} emissiveIntensity={0.15} side={THREE.DoubleSide} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// ──────────────────────────────────────────────
// COMPONENTE PRINCIPAL — SmartCityScene
// ──────────────────────────────────────────────

/**
 * SmartCityScene — Escena completa de ciudad inteligente 3D.
 *
 * Configura el Canvas de Three.js con:
 * - Cámara posicionada en [0, 14, 24] con FOV 55°.
 * - Fondo azul oscuro (#030d38) con niebla gradual (20-45 unidades).
 * - Iluminación ambiental, direccional y puntual (color cibernético).
 * - Rendering con antialiasing, alpha y alta performance.
 *
 * Composición de elementos:
 * 1. GroundGrid    → Rejilla base pulsante
 * 2. Buildings     → Edificios de la ciudad
 * 3. IoTSensors    → Sensores IoT con pulso
 * 4. DataFlow      → Tráfico de datos
 * 5. MovingCars    → Vehículos autónomos
 * 6. OrbitingSatellites → Comunicación satelital
 *
 * @returns {JSX.Element} Canvas 3D con la escena completa
 */
export default function SmartCityScene() {
  return (
    <Canvas
      camera={{ position: [0, 14, 24], fov: 55 }}
      className="absolute top-0 left-0 w-full h-full z-0"
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      {/* Configuración de ambiente */}
      <color attach="background" args={['#030d38']} />
      <fog attach="fog" args={['#030d38', 20, 45]} />
      
      {/* Iluminación */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 15, 10]} intensity={0.6} />
      <pointLight position={[0, 8, 0]} color={IOT_COLOR} intensity={0.4} distance={30} />

      {/* Elementos de la escena */}
      <GroundGrid />
      <Buildings />
      <IoTSensors />
      <DataFlow />
      <MovingCars />
      <OrbitingSatellites />
    </Canvas>
  );
}
