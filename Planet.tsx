import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Float, Billboard } from "@react-three/drei";
import * as THREE from "three";
import { useStore } from "../../store/useStore";

interface PlanetProps {
  name: string;
  color: string;
  size: number;
  distance: number;
  speed: number;
  description: string;
  temp: string;
  rings?: boolean;
}

export function Planet({ name, color, size, distance, speed, description, temp, rings }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const setSelectedPlanet = useStore((state) => state.setSelectedPlanet);
  const isPinching = useStore((state) => state.isPinching);
  const handPosition = useStore((state) => state.handPosition);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Orbital rotation
    if (orbitRef.current) {
      orbitRef.current.rotation.y = t * speed;
    }
    
    // Self rotation
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      
      // Select logic based on hand proximity (for Phase 3)
      if (isPinching && handPosition) {
        const worldPos = new THREE.Vector3();
        meshRef.current.getWorldPosition(worldPos);
        const handVec = new THREE.Vector3(handPosition.x, handPosition.y, handPosition.z);
        if (worldPos.distanceTo(handVec) < size * 2) {
          setSelectedPlanet({ name, description, distance: `${distance} AU`, temp });
        }
      }
    }
  });

  return (
    <group ref={orbitRef}>
      <group position={[distance, 0, 0]}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh 
            ref={meshRef} 
            onClick={() => setSelectedPlanet({ name, description, distance: `${distance} AU`, temp })}
            onPointerOver={(e) => (document.body.style.cursor = 'pointer')}
            onPointerOut={(e) => (document.body.style.cursor = 'auto')}
          >
            <sphereGeometry args={[size, 64, 64]} />
            <meshStandardMaterial 
              color={color} 
              emissive={color} 
              emissiveIntensity={0.2} 
              metalness={0.4} 
              roughness={0.3} 
            />
          </mesh>
        </Float>

        {rings && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[size * 1.4, size * 2.2, 64]} />
            <meshStandardMaterial 
              color={color} 
              transparent 
              opacity={0.4} 
              side={THREE.DoubleSide} 
            />
          </mesh>
        )}

        <Billboard>
          <Text
            position={[0, size + 0.5, 0]}
            fontSize={0.4}
            color="white"
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
          >
            {name}
          </Text>
        </Billboard>
      </group>
      
      {/* Orbital Path */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[distance - 0.05, distance + 0.05, 128]} />
        <meshBasicMaterial color="white" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
