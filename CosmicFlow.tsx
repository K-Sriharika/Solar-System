import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "../../store/useStore";

const vertexShader = `
  uniform float uTime;
  uniform vec3 uHandPos;
  attribute float aScale;
  varying vec3 vColor;

  void main() {
    vec3 pos = position;
    
    // Smooth flow animation
    float angle = uTime * 0.1 + length(pos) * 0.1;
    pos.x += sin(angle + pos.z) * 2.0;
    pos.z += cos(angle + pos.x) * 2.0;
    
    // React to hand position
    float dist = distance(pos, uHandPos);
    if (dist < 10.0) {
      vec3 dir = normalize(pos - uHandPos);
      pos += dir * (10.0 - dist) * 0.5;
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aScale * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    
    vColor = mix(vec3(0.4, 0.6, 1.0), vec3(1.0, 0.4, 0.8), sin(uTime + length(pos) * 0.05) * 0.5 + 0.5);
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  void main() {
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - strength;
    strength = pow(strength, 10.0);
    gl_FragColor = vec4(vColor, strength);
  }
`;

export function CosmicFlow({ count = 10000 }) {
  const pointsRef = useRef<THREE.Points>(null);
  const handPosition = useStore((state) => state.handPosition);

  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sca = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 50 + Math.random() * 100;
      
      pos[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      
      sca[i] = Math.random() * 2;
    }
    return [pos, sca];
  }, [count]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uHandPos: { value: new THREE.Vector3(1000, 0, 0) }
  }), []);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.getElapsedTime();
    if (handPosition) {
      uniforms.uHandPos.value.lerp(new THREE.Vector3(handPosition.x, handPosition.y, handPosition.z), 0.1);
    } else {
      uniforms.uHandPos.value.set(1000, 0, 0); // Hide away
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={count} 
          array={positions} 
          itemSize={3} 
        />
        <bufferAttribute 
          attach="attributes-aScale" 
          count={count} 
          array={scales} 
          itemSize={1} 
        />
      </bufferGeometry>
      <shaderMaterial 
        vertexShader={vertexShader} 
        fragmentShader={fragmentShader} 
        uniforms={uniforms} 
        transparent 
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
