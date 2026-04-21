/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { SolarSystem } from "./components/SolarSystem/SolarSystem";
import { PlanetInfo } from "./components/UI/PlanetInfo";
import { HandTracker } from "./components/Interaction/HandTracker";
import { CosmicFlow } from "./components/VFX/CosmicFlow";
import { MultiplayerCursors } from "./components/UI/MultiplayerCursors";
import { Loader } from "@react-three/drei";
import { useStore } from "./store/useStore";

export default function App() {
  const isPinching = useStore((state) => state.isPinching);
  const handPosition = useStore((state) => state.handPosition);
  const remoteUsers = useStore((state) => state.remoteUsers);

  return (
    <div className="relative w-full h-screen bg-[#02040a] overflow-hidden font-sans text-[#e2e8f0]">
      {/* Space Background Layer */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] bg-[size:100px_100px]" />
        <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(63,94,251,0.15)_0%,rgba(252,70,107,0.05)_100%)] blur-[80px] rounded-full" />
      </div>

      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas
          shadows
          gl={{ antialias: true, alpha: true }}
          camera={{ position: [0, 30, 60], fov: 50 }}
        >
          <Suspense fallback={null}>
            <SolarSystem />
            <CosmicFlow count={30000} />
            <MultiplayerCursors />
          </Suspense>
        </Canvas>
      </div>

      {/* Bento HUD Grid */}
      <div className="relative z-10 w-full h-full p-6 grid grid-cols-4 grid-rows-6 gap-3 pointer-events-none">
        
        {/* Top Left: Tracking Status */}
        <div className="hud-panel pointer-events-auto flex items-center gap-3 col-span-1 row-span-1">
          <div className={`w-10 h-10 border-2 rounded-full flex items-center justify-center bg-white/5 ${handPosition ? 'border-green-500/50' : 'border-white/10'}`}>
            <div className={`w-2 h-2 rounded-full ${handPosition ? 'bg-green-500' : 'bg-white/20'}`} />
          </div>
          <div>
            <div className="text-[10px] opacity-50 uppercase tracking-widest">Tracking</div>
            <div className={`text-sm font-bold ${handPosition ? 'text-green-400' : 'text-white/20'}`}>
              {handPosition ? 'ACTIVE' : 'AWAITING'}
            </div>
          </div>
        </div>

        {/* Top Middle: App Branding */}
        <div className="hud-panel pointer-events-auto flex justify-between items-center col-span-2 row-span-1">
          <div>
            <div className="text-2xl font-black tracking-tighter uppercase leading-none">
              Solar System <span className="text-blue-500">Explorer</span>
            </div>
            <div className="text-[9px] opacity-40 tracking-widest mt-1">
              v4.2.0 | REAL-TIME MULTIPLAYER SIMULATION
            </div>
          </div>
          <div className="text-right">
            <div className="text-[9px] opacity-50 uppercase tracking-widest">Explorers</div>
            <div className="text-lg font-bold text-green-500">
              ● {Object.keys(remoteUsers).length + 1} ACTIVE
            </div>
          </div>
        </div>

        {/* Top Right: Gesture Status */}
        <div className="hud-panel pointer-events-auto flex items-center gap-3 col-span-1 row-span-1">
          <div className={`w-10 h-10 border-2 rounded-full flex items-center justify-center bg-white/5 ${isPinching ? 'border-red-500/50' : 'border-white/10'}`}>
            <div className={`w-4 h-4 border-2 rounded-full ${isPinching ? 'border-red-500 opacity-80' : 'border-white/10'}`} />
          </div>
          <div>
            <div className="text-[10px] opacity-50 uppercase tracking-widest">Hand Interaction</div>
            <div className={`text-sm font-bold ${isPinching ? 'text-red-400' : 'text-white/20'}`}>
              {isPinching ? 'PINCHING' : 'IDLE'}
            </div>
          </div>
        </div>

        {/* Left Side: Activity Feed */}
        <div className="hud-panel pointer-events-auto col-span-1 row-span-3 mt-3 overflow-hidden">
          <div className="text-[10px] font-bold border-b border-white/5 pb-2 mb-3 uppercase tracking-widest text-white/40">Explorer Feed</div>
          <div className="flex flex-col gap-3">
            <div className="text-[11px] leading-tight"><span className="text-blue-400">User_09</span> inspected Jupiter</div>
            <div className="text-[11px] leading-tight"><span className="text-pink-400">S. Tanaka</span> moved to Kuiper Belt</div>
            <div className="text-[11px] leading-tight opacity-40">System ready...</div>
          </div>
        </div>

        {/* Center: Main Scene Area (Empty in grid, filled by absolute Canvas) */}
        <div className="col-span-2 row-span-3" />

        {/* Right Side: Planet Details (Dynamic) */}
        <div className="col-span-1 row-span-4 mt-3 flex flex-col pointer-events-auto">
          <PlanetInfo />
        </div>

        {/* Bottom Left: Diagnostics */}
        <div className="hud-panel pointer-events-auto col-span-1 row-span-2 mt-3 flex flex-col justify-center">
          <div className="text-[10px] opacity-40 uppercase tracking-widest mb-3">Diagnostics</div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="opacity-60">Sync Latency</span>
                <span className="text-green-400 font-mono">24ms</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[20%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="opacity-60">Renderer Load</span>
                <span className="font-mono">42%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[42%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Center: Controls Hint */}
        <div className="hud-panel pointer-events-auto col-span-2 row-span-1 mt-3 flex items-center justify-center gap-8 border-dashed border-white/20 bg-transparent backdrop-blur-none shadow-none">
          <div className="text-[10px] opacity-40 font-bold uppercase tracking-[0.2em]">Pinch to Select</div>
          <div className="text-[10px] opacity-40 font-bold uppercase tracking-[0.2em]">Swipe to Rotate</div>
          <div className="text-[10px] opacity-40 font-bold uppercase tracking-[0.2em]">Spread to Zoom</div>
        </div>

      </div>

      <HandTracker />
      <Loader />
    </div>
  );
}


