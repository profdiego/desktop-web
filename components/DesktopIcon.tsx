import React from 'react';
import { IconRenderer } from './IconRenderer';
import { Shortcut } from '../types';

interface DesktopIconProps {
  shortcut: Shortcut;
  onDoubleClick: (shortcut: Shortcut) => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ shortcut, onDoubleClick }) => {
  return (
    <div 
      className="flex flex-col items-center justify-center w-24 p-2 rounded hover:bg-white/20 hover:backdrop-blur-sm cursor-pointer transition-all duration-200 group"
      onDoubleClick={() => onDoubleClick(shortcut)}
      // Touch support for mobile double tap simulation could be added here
      onClick={(e) => e.stopPropagation()} 
    >
      <div className="w-12 h-12 flex items-center justify-center text-white drop-shadow-lg mb-1 group-hover:scale-110 transition-transform">
        <IconRenderer name={shortcut.iconName} size={40} />
      </div>
      <span className="text-white text-xs font-medium text-center drop-shadow-md break-words w-full leading-tight select-none">
        {shortcut.name}
      </span>
    </div>
  );
};