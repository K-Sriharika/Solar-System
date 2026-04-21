import { create } from "zustand";

interface PlanetInfo {
  name: string;
  description: string;
  distance: string;
  temp: string;
}

interface State {
  selectedPlanet: PlanetInfo | null;
  setSelectedPlanet: (planet: PlanetInfo | null) => void;
  handPosition: { x: number; y: number; z: number } | null;
  setHandPosition: (pos: { x: number; y: number; z: number } | null) => void;
  isPinching: boolean;
  setIsPinching: (is: boolean) => void;
  remoteUsers: Record<string, { x: number; y: number; z: number; color: string }>;
  setRemoteUsers: (users: Record<string, { x: number; y: number; z: number; color: string }>) => void;
}

export const useStore = create<State>((set) => ({
  selectedPlanet: null,
  setSelectedPlanet: (planet) => set({ selectedPlanet: planet }),
  handPosition: null,
  setHandPosition: (pos) => set({ handPosition: pos }),
  isPinching: false,
  setIsPinching: (is) => set({ isPinching: is }),
  remoteUsers: {},
  setRemoteUsers: (users) => set({ remoteUsers: users }),
}));
