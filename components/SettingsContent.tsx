import React from 'react';
import { DEFAULT_WALLPAPERS } from '../types';

interface SettingsContentProps {
  currentWallpaper: string;
  onWallpaperChange: (url: string) => void;
}

export const SettingsContent: React.FC<SettingsContentProps> = ({ currentWallpaper, onWallpaperChange }) => {
  return (
    <div className="p-6 text-gray-800">
      <h2 className="text-2xl font-bold mb-6">Personalization</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-3">Background</h3>
        <p className="text-sm text-gray-500 mb-4">Select a wallpaper for your desktop.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {DEFAULT_WALLPAPERS.map((wp, index) => (
            <button 
              key={index}
              onClick={() => onWallpaperChange(wp)}
              className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${currentWallpaper === wp ? 'border-blue-600 scale-105 shadow-lg' : 'border-transparent hover:border-gray-300'}`}
            >
              <img src={wp} alt={`Wallpaper ${index + 1}`} className="w-full h-full object-cover" />
              {currentWallpaper === wp && (
                <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                  <div className="bg-blue-600 text-white p-1 rounded-full">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-800 text-sm mb-1">Tip</h4>
        <p className="text-sm text-yellow-700">
          This system saves your preferences and shortcuts to your browser's Local Storage. 
          If you clear your cache, your changes will be reset.
        </p>
      </div>
    </div>
  );
};