// useBlockSelection.js - Manages which block type is currently selected
import { useState, useEffect, useCallback } from 'react';
import { BLOCK_ORDER } from './textures';

export const useBlockSelection = () => {
  const [selectedBlock, setSelectedBlock] = useState(0);

  const selectBlock = useCallback((index) => {
    if (index >= 0 && index < BLOCK_ORDER.length) {
      setSelectedBlock(index);
    }
  }, []);

  const selectNextBlock = useCallback(() => {
    setSelectedBlock((prev) => (prev + 1) % BLOCK_ORDER.length);
  }, []);

  const selectPrevBlock = useCallback(() => {
    setSelectedBlock((prev) => (prev - 1 + BLOCK_ORDER.length) % BLOCK_ORDER.length);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Number keys 1-5 for block selection
      const num = parseInt(e.key);
      if (num >= 1 && num <= BLOCK_ORDER.length) {
        selectBlock(num - 1);
      }
    };

    const handleWheel = (e) => {
      if (e.deltaY > 0) {
        selectNextBlock();
      } else {
        selectPrevBlock();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [selectBlock, selectNextBlock, selectPrevBlock]);

  return {
    selectedBlock,
    selectedBlockType: BLOCK_ORDER[selectedBlock],
    selectBlock,
    selectNextBlock,
    selectPrevBlock,
  };
};
