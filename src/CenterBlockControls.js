// CenterBlockControls.js handles building and breaking with the center crosshair.
// The real mouse is locked by the browser, so this file shoots an invisible ray
// straight out from the camera center and sees what it hits.
import { useCallback, useEffect, useMemo } from 'react';
import { Raycaster, Vector2, Vector3 } from 'three';
import { useThree } from 'react-three-fiber';

import { useBlockTargetRegistry } from './BlockTargetRegistry';
import { useRemoveCube, useSetCube } from './useCubeStore';

const SCREEN_CENTER = new Vector2(0, 0);
const CUBE_CENTER_Y = 0.5;

// Blocks sit on a grid, like squares on graph paper.
const snapToBlockGrid = value => Math.round(value);

// Cube centers are at 0.5, 1.5, 2.5, and so on.
const snapToCubeHeight = value =>
  Math.round(value - CUBE_CENTER_Y) + CUBE_CENTER_Y;

export const CenterBlockControls = () => {
  const { camera, gl } = useThree();
  const addCube = useSetCube();
  const removeCube = useRemoveCube();
  const { findTargetByObject, getTargets } = useBlockTargetRegistry();
  const raycaster = useMemo(() => new Raycaster(), []);
  const cubePosition = useMemo(() => new Vector3(), []);

  const findCenteredBlockTarget = useCallback(() => {
    // This ray starts at the camera and goes through the center of the screen.
    raycaster.setFromCamera(SCREEN_CENTER, camera);

    const hits = raycaster.intersectObjects(
      getTargets().map(target => target.object),
      false
    );
    for (const hit of hits) {
      const target = findTargetByObject(hit.object);

      if (target) {
        return { hit, target };
      }
    }

    return null;
  }, [camera, findTargetByObject, getTargets, raycaster]);

  const placeCubeOnGround = useCallback(
    hit => {
      // hit.point is the exact 3D spot where the center ray touched the floor.
      addCube(
        snapToBlockGrid(hit.point.x),
        CUBE_CENTER_Y,
        snapToBlockGrid(hit.point.z)
      );
    },
    [addCube]
  );

  const placeCubeNextToBlock = useCallback(
    (hit, target) => {
      if (!hit.face) {
        return;
      }

      target.object.getWorldPosition(cubePosition);

      // The face normal points away from the side we hit.
      // Adding it moves the new cube to the neighboring grid spot.
      addCube(
        snapToBlockGrid(cubePosition.x + hit.face.normal.x),
        snapToCubeHeight(cubePosition.y + hit.face.normal.y),
        snapToBlockGrid(cubePosition.z + hit.face.normal.z)
      );
    },
    [addCube, cubePosition]
  );

  const handleMouseDown = useCallback(
    event => {
      const centeredTarget = findCenteredBlockTarget();

      if (!centeredTarget) {
        return;
      }

      const { hit, target } = centeredTarget;

      if (event.button === 0) {
        if (target.type === 'ground') {
          placeCubeOnGround(hit);
          return;
        }

        placeCubeNextToBlock(hit, target);
        return;
      }

      if (event.button === 2 && target.type === 'cube') {
        removeCube(target.id);
      }
    },
    [findCenteredBlockTarget, placeCubeNextToBlock, placeCubeOnGround, removeCube]
  );

  useEffect(() => {
    const preventContextMenu = event => event.preventDefault();

    gl.domElement.addEventListener('mousedown', handleMouseDown);
    gl.domElement.addEventListener('contextmenu', preventContextMenu);

    return () => {
      gl.domElement.removeEventListener('mousedown', handleMouseDown);
      gl.domElement.removeEventListener('contextmenu', preventContextMenu);
    };
  }, [gl.domElement, handleMouseDown]);

  return null;
};
