// useCubeStore.js contains helper hooks for reading and changing the cube list.
// Keeping these helpers here means Cube.js does not need to know Recoil details.
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { nanoid } from 'nanoid';

import { $cubes } from './state';
import { playPlaceSound, playBreakSound } from './useSounds';

// Components call this when they need to know which cubes exist right now.
export const useCube = () => useRecoilValue($cubes);

// Two blocks should not sit in the exact same grid spot.
const hasSamePosition = (cube, position) =>
  cube.position.every((value, index) => value === position[index]);

export const useSetCube = () => {
  const setCubes = useSetRecoilState($cubes);
  return (x, y, z, blockType = 'dirt') => {
    const position = [x, y, z];

    setCubes(cubes => {
      if (cubes.some(cube => hasSamePosition(cube, position))) {
        return cubes;
      }

      playPlaceSound();
      return [...cubes, { id: nanoid(), position, blockType }];
    });
  };
};

export const useRemoveCube = () => {
  const setCubes = useSetRecoilState($cubes);
  return id =>
    setCubes(cubes => {
      // Right click can trigger more than one browser event. If the cube is
      // already gone, return the old list so React does not do extra work.
      if (!cubes.some(cube => cube.id === id)) {
        return cubes;
      }

      playBreakSound();
      return cubes.filter(cube => cube.id !== id);
    });
};
