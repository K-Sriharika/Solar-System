import { Suspense } from "react";
import { Stars, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Planet } from "./Planet";
import { PLANETS } from "../../constants";
import { AsteroidBelt } from "./AsteroidBelt";

export function SolarSystem() {
  return (
    <>
      <color attach="background" args={["#000308"]} />
      
      <PerspectiveCamera makeDefault position={[0, 30, 60]} fov={50} />
      <OrbitControls 
        enablePan={false} 
        maxDistance={100} 
        minDistance={10} 
        dampingFactor={0.05}
      />

      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={2000} color="#FFCC33" />

      {/* Sun */}
      <mesh>
        <sphereGeometry args={[3, 64, 64]} />
        <meshStandardMaterial 
          emissive="#FFCC33" 
          emissiveIntensity={2} 
          color="#FFCC33" 
        />
        {/* Sun Glow */}
        <pointLight intensity={500} distance={100} color="#FFCC33" />
      </mesh>

      <Suspense fallback={null}>
        {PLANETS.map((planet) => (
          <Planet key={planet.name} {...planet} />
        ))}
        
        <AsteroidBelt count={2000} innerRadius={15} outerRadius={18} />
        <AsteroidBelt count={3000} innerRadius={42} outerRadius={48} opacity={0.15} /> {/* Kuiper Belt */}
        
        <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade speed={1} />
      </Suspense>
    </>
  );
}
