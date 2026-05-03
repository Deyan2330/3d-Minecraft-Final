// state.js stores shared game data.
// Recoil lets many components read and change the same data safely.
import { atom } from 'recoil';
import { generateTerrain } from './terrainGenerator';

// Generate initial terrain - larger area for proper Minecraft feel
const initialTerrain = generateTerrain(40, 0, 0);

// This list is the world. If a cube is here, it is drawn and has physics.
export const $cubes = atom({
  key: 'cubes',
  default: initialTerrain,
});

// Currently selected block type
export const $selectedBlockType = atom({
  key: 'selectedBlockType',
  default: 'dirt',
});
