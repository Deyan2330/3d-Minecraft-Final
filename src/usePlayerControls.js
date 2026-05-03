// usePlayerControls.js listens to keyboard buttons.
// It does not move the player directly. It only remembers which keys are held.
import { useState, useEffect } from 'react';

// Each keyboard key points to the movement flag it controls.
const MOVEMENT_BY_KEY = {
  KeyW: 'moveForward',
  ArrowUp: 'moveForward',
  w: 'moveForward',
  W: 'moveForward',
  KeyS: 'moveBackward',
  ArrowDown: 'moveBackward',
  s: 'moveBackward',
  S: 'moveBackward',
  KeyA: 'moveLeft',
  ArrowLeft: 'moveLeft',
  a: 'moveLeft',
  A: 'moveLeft',
  KeyD: 'moveRight',
  ArrowRight: 'moveRight',
  d: 'moveRight',
  D: 'moveRight',
  Space: 'jump',
  ' ': 'jump',
  ShiftLeft: 'sprint',
  ShiftRight: 'sprint',
  Shift: 'sprint',
};

const getMovementByEvent = event =>
  MOVEMENT_BY_KEY[event.code] || MOVEMENT_BY_KEY[event.key];

export const usePlayerControls = () => {
  // This remembers which buttons are currently held down.
  const [movement, setMovement] = useState({
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    jump: false,
    sprint: false,
  });

  useEffect(() => {
    const handleKeyDown = e => {
      // Key down means the player started holding this movement button.
      const field = getMovementByEvent(e);
      if (!field) {
        return;
      }

      e.preventDefault();
      setMovement(m => ({
        ...m,
        [field]: true
      }));
    };
    const handleKeyUp = e => {
      // Key up means the player stopped holding this movement button.
      const field = getMovementByEvent(e);
      if (!field) {
        return;
      }

      e.preventDefault();
      setMovement(m => ({
        ...m,
        [field]: false
      }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return movement;
};
