// state.js stores shared game data.
// Recoil lets many components read and change the same data safely.
import { atom } from 'recoil';

// This list is the world. If a cube is here, it is drawn and has physics.
export const $cubes = atom({
  key: 'cubes',
  // The starter cube gives the player one block to place blocks from or destroy.
  default: [
    { id: 'starter-cube', position: [0, 0.5, -10], blockType: 'dirt' },
    { id: 'starter-cube-2', position: [1, 0.5, -10], blockType: 'grass' },
    { id: 'starter-cube-3', position: [2, 0.5, -10], blockType: 'stone' },
  ]
});

// Currently selected block type
export const $selectedBlockType = atom({
  key: 'selectedBlockType',
  default: 'dirt',
});
