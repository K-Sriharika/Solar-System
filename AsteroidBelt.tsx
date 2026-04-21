import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface AsteroidBeltProps {
  count: number;
  innerRadius: number;
  outerRadius: number;
  opacity?: number;
}

export function AsteroidBelt({ count, innerRadius, outerRadius, opacity = 0.3 }: AsteroidBeltProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const asteroids = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * 1.5;
      
      const scale = 0.05 + Math.random() * 0.1;
      const rotation = [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI];
      
      temp.push({ position: [x, y, z], scale, rotation, speed: 0.001 + Math.random() * 0.002 });
    }
    return temp;
  }, [count, innerRadius, outerRadius]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      asteroids.forEach((asteroid, i) => {
        const matrix = new THREE.Matrix4();
        const position = new THREE.Vector3(...asteroid.position);
        
        // Circular motion
        const angle = t * asteroid.speed + (i * 0.1);
        const radius = new THREE.Vector3(position.x, 0, position.z).length();
        position.x = Math.cos(angle) * radius;
        position.z = Math.sin(angle) * radius;

        matrix.makeRotationFromEuler(new THREE.Euler(...asteroid.rotation));
        matrix.scale(new THREE.Vector3(asteroid.scale, asteroid.scale, asteroid.scale));
        matrix.setPosition(position);
        
        meshRef.current?.setMatrixAt(i, matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[new THREE.IcosahedronGeometry(1, 0), new THREE.MeshStandardMaterial({ color: "#888", transparent: true, opacity }), count]} />
  );
}
