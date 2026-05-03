// BlockTargetRegistry.js keeps a private list of things the crosshair can hit.
// Cube and Ground add themselves to this list when they appear.
// CenterBlockControls reads this list when the player clicks.
import React, { createContext, useCallback, useContext, useMemo, useRef } from 'react';

const BlockTargetRegistryContext = createContext(null);

export const BlockTargetProvider = ({ children }) => {
  const targets = useRef(new Map());

  const registerTarget = useCallback((object, target) => {
    targets.current.set(object, target);

    return () => {
      targets.current.delete(object);
    };
  }, []);

  const getTargets = useCallback(() => Array.from(targets.current.values()), []);

  const findTargetByObject = useCallback(
    object => targets.current.get(object) || null,
    []
  );

  const value = useMemo(
    () => ({
      findTargetByObject,
      getTargets,
      registerTarget
    }),
    [findTargetByObject, getTargets, registerTarget]
  );

  return (
    <BlockTargetRegistryContext.Provider value={value}>
      {children}
    </BlockTargetRegistryContext.Provider>
  );
};

export const useBlockTargetRegistry = () => {
  const registry = useContext(BlockTargetRegistryContext);

  if (!registry) {
    throw new Error('useBlockTargetRegistry must be used inside BlockTargetProvider');
  }

  return registry;
};
