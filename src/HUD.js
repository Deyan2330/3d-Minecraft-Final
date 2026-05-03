// HUD.js - Heads-up display showing controls and block selection
import React, { useState, useEffect } from 'react';
import { BLOCK_TYPES, BLOCK_ORDER } from './textures';

export const HUD = ({ selectedBlock }) => {
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    // Hide controls help after 8 seconds
    const timer = setTimeout(() => setShowControls(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Controls help - fades out after 8 seconds */}
      <div
        style={{
          position: 'fixed',
          top: 20,
          left: 20,
          color: 'white',
          fontFamily: 'monospace',
          fontSize: 14,
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          opacity: showControls ? 1 : 0,
          transition: 'opacity 1s ease-out',
          pointerEvents: 'none',
          zIndex: 100,
        }}
      >
        <div style={{ marginBottom: 8, fontWeight: 'bold', fontSize: 16 }}>Controls</div>
        <div>WASD - Move</div>
        <div>Space - Jump</div>
        <div>Shift - Sprint</div>
        <div>Mouse - Look around</div>
        <div>Left Click - Place block</div>
        <div>Right Click - Break block</div>
        <div>1-5 / Scroll - Select block</div>
        <div style={{ marginTop: 8, opacity: 0.7, fontSize: 12 }}>
          Click anywhere to start
        </div>
      </div>

      {/* Hotbar */}
      <div
        style={{
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 4,
          padding: 4,
          background: 'rgba(0, 0, 0, 0.5)',
          borderRadius: 4,
          zIndex: 100,
        }}
      >
        {BLOCK_ORDER.map((blockType, index) => {
          const block = BLOCK_TYPES[blockType];
          const isSelected = index === selectedBlock;
          
          return (
            <div
              key={blockType}
              style={{
                width: 48,
                height: 48,
                background: block.color,
                border: isSelected ? '3px solid white' : '3px solid rgba(255,255,255,0.3)',
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                padding: 2,
                boxShadow: isSelected ? '0 0 10px rgba(255,255,255,0.5)' : 'none',
                transition: 'all 0.1s ease',
                position: 'relative',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: 2,
                  left: 4,
                  color: 'white',
                  fontSize: 10,
                  fontWeight: 'bold',
                  textShadow: '1px 1px 2px black',
                }}
              >
                {index + 1}
              </span>
              <span
                style={{
                  color: 'white',
                  fontSize: 8,
                  textShadow: '1px 1px 2px black',
                  fontWeight: 'bold',
                }}
              >
                {block.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Position indicator - top right */}
      <div
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          color: 'white',
          fontFamily: 'monospace',
          fontSize: 12,
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          pointerEvents: 'none',
          zIndex: 100,
          textAlign: 'right',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>3D Minecraft</div>
        <div style={{ opacity: 0.7 }}>Build freely!</div>
      </div>
    </>
  );
};
