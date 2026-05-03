// Player.js controls the invisible player body and the camera attached to it.
// The player is a physics sphere, but the user sees through the camera.
import React, { useEffect, useRef } from 'react';
import { useSphere } from '@react-three/cannon';
import { useThree, useFrame } from 'react-three-fiber';
import { PointerLockControls } from './PointerLockControls';
import { usePlayerControls } from './usePlayerControls';
import { Vector3 } from 'three';

const WALK_SPEED = 5;
const SPRINT_SPEED = 10;
const JUMP_FORCE = 10;
const UP = new Vector3(0, 1, 0);

// Reuse these vectors each frame so walking does not create new objects nonstop.
const forward = new Vector3();
const right = new Vector3();
const direction = new Vector3();

export const Player = props => {
  const { camera } = useThree();
  const {
    moveForward,
    moveBackward,
    moveLeft,
    moveRight,
    jump,
    sprint,
  } = usePlayerControls();
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    position: [0, 10, 0], // Spawn above terrain, will fall down
    ...props
  }));

  const velocity = useRef([0, 0, 0]);
  useEffect(() => {
    // The physics engine owns the real velocity. Subscribe keeps our ref updated.
    api.velocity.subscribe(v => (velocity.current = v));
  }, [api.velocity]);

  useFrame(() => {
    if (!ref.current) {
      return;
    }

    // The physics body is the player. Put the camera where the body is,
    // so the view moves with the player like their eyes.
    ref.current.getWorldPosition(camera.position);

    // Look direction includes up/down. Walking should stay flat on the ground,
    // so looking at the sky still moves you forward across the floor.
    camera.getWorldDirection(forward);
    forward.y = 0;

    if (forward.lengthSq() === 0) {
      forward.set(0, 0, -1).applyAxisAngle(UP, camera.rotation.y);
    } else {
      forward.normalize();
    }

    right.crossVectors(forward, UP).normalize();

    // Start with no movement, then add directions for the keys being held down.
    direction.set(0, 0, 0);
    if (moveForward) direction.add(forward);
    if (moveBackward) direction.sub(forward);
    if (moveRight) direction.add(right);
    if (moveLeft) direction.sub(right);

    if (direction.lengthSq() > 0) {
      const speed = sprint ? SPRINT_SPEED : WALK_SPEED;
      direction.normalize().multiplyScalar(speed);
    }

    // Keep the falling/jumping speed from physics, but replace floor movement.
    api.velocity.set(direction.x, velocity.current[1], direction.z);

    // Jump only when vertical speed is almost zero, which means the player is on something.
    if (jump && Math.abs(velocity.current[1]) < 0.05) {
      api.velocity.set(velocity.current[0], JUMP_FORCE, velocity.current[2]);
    }
  });

  return (
    <>
      <PointerLockControls />
      <mesh ref={ref} />
    </>
  );
};
