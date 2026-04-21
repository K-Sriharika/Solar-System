import { useStore } from "../../store/useStore";
import { X, MapPin, Thermometer } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function PlanetInfo() {
  const selectedPlanet = useStore((state) => state.selectedPlanet);
  const setSelectedPlanet = useStore((state) => state.setSelectedPlanet);

  return (
    <AnimatePresence>
      {selectedPlanet && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="hud-panel w-full h-full border-blue-500/30 overflow-hidden flex flex-col justify-between"
          style={{ gridColumn: 'span 1', gridRow: 'span 4' }}
        >
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Object Selected</div>
              <button 
                onClick={() => setSelectedPlanet(null)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/40"
              >
                <X size={14} />
              </button>
            </div>
            
            <h2 className="text-4xl font-extrabold tracking-tighter mb-4">{selectedPlanet.name.toUpperCase()}</h2>

            <div className="w-full h-32 rounded-xl mb-4 flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900/40 to-black/40">
               <div 
                 className="w-16 h-16 rounded-full shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.5)]"
                 style={{ backgroundColor: selectedPlanet.name === 'Mars' ? '#ef4444' : '#3b82f6' }}
               />
            </div>

            <p className="text-sm leading-relaxed text-white/80 mb-6">
              {selectedPlanet.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-auto">
            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
              <div className="flex items-center gap-2 mb-1">
                <MapPin size={10} className="text-blue-400 opacity-50" />
                <p className="text-[9px] uppercase tracking-widest text-white/40">Distance</p>
              </div>
              <p className="text-sm font-bold tracking-tight">{selectedPlanet.distance}</p>
            </div>

            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
              <div className="flex items-center gap-2 mb-1">
                <Thermometer size={10} className="text-orange-400 opacity-50" />
                <p className="text-[9px] uppercase tracking-widest text-white/40">Gravity</p>
              </div>
              <p className="text-sm font-bold tracking-tight">{selectedPlanet.temp}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

