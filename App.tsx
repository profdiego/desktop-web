import React, { useState, useEffect } from 'react';
import { Monitor, Grid } from 'lucide-react';
import { Window } from './components/Window';
import { DesktopIcon } from './components/DesktopIcon';
import { Clock } from './components/Clock';
import { StartMenu } from './components/StartMenu';
import { SettingsContent } from './components/SettingsContent';
import { IconRenderer } from './components/IconRenderer';
import { Shortcut, WindowData, DEFAULT_WALLPAPERS } from './types';

// Initial Shortcuts
const DEFAULT_SHORTCUTS: Shortcut[] = [
  { id: '1', name: 'GitHub', url: 'https://github.com', iconName: 'Github', type: 'link' },
  { id: '2', name: 'YouTube', url: 'https://youtube.com', iconName: 'Youtube', type: 'link' },
  { id: '3', name: 'Documentation', url: 'https://react.dev', iconName: 'FileText', type: 'link' },
  { id: '4', name: 'Settings', url: '', iconName: 'Settings', type: 'system' }
];

export default function App() {
  // State
  const [wallpaper, setWallpaper] = useState(DEFAULT_WALLPAPERS[0]);
  const [shortcuts, setShortcuts] = useState<Shortcut[]>(DEFAULT_SHORTCUTS);
  const [windows, setWindows] = useState<WindowData[]>([]);
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = useState(10);

  // Load from LocalStorage
  useEffect(() => {
    const savedWallpaper = localStorage.getItem('webos-wallpaper');
    const savedShortcuts = localStorage.getItem('webos-shortcuts');
    
    if (savedWallpaper) setWallpaper(savedWallpaper);
    if (savedShortcuts) setShortcuts(JSON.parse(savedShortcuts));
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('webos-wallpaper', wallpaper);
    localStorage.setItem('webos-shortcuts', JSON.stringify(shortcuts));
  }, [wallpaper, shortcuts]);

  // Window Management Actions
  const openWindow = (shortcut: Shortcut) => {
    if (shortcut.type === 'system' && shortcut.iconName === 'Settings') {
      // Check if settings already open
      const existing = windows.find(w => w.component === 'settings');
      if (existing) {
        bringToFront(existing.id);
        return;
      }
      
      createWindow({
        id: 'settings-' + Date.now(),
        title: 'Settings',
        component: 'settings',
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        position: { x: 100, y: 50 },
        size: { width: 800, height: 600 },
        zIndex: nextZIndex
      });
      return;
    }

    createWindow({
      id: `win-${Date.now()}`,
      title: shortcut.name,
      url: shortcut.url,
      component: 'browser',
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      position: { x: 50 + (windows.length * 20), y: 50 + (windows.length * 20) },
      size: { width: 900, height: 600 },
      zIndex: nextZIndex
    });
  };

  const createWindow = (win: WindowData) => {
    setWindows([...windows, win]);
    setNextZIndex(prev => prev + 1);
    setActiveWindowId(win.id);
  };

  const closeWindow = (id: string) => {
    setWindows(windows.filter(w => w.id !== id));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const toggleMinimize = (id: string) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, isMinimized: !w.isMinimized } : w
    ));
  };

  const toggleMaximize = (id: string) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
    ));
    bringToFront(id);
  };

  const bringToFront = (id: string) => {
    const win = windows.find(w => w.id === id);
    if (!win) return;
    
    // Only update if it's not already top
    if (win.zIndex !== nextZIndex - 1) {
      setWindows(windows.map(w => 
        w.id === id ? { ...w, zIndex: nextZIndex, isMinimized: false } : w
      ));
      setNextZIndex(prev => prev + 1);
    }
    setActiveWindowId(id);
  };

  const updateWindowPosition = (id: string, x: number, y: number) => {
    setWindows(windows.map(w => w.id === id ? { ...w, position: { x, y } } : w));
  };

  const addShortcut = (newShortcut: Omit<Shortcut, 'id'>) => {
    const s: Shortcut = { ...newShortcut, id: Date.now().toString() };
    setShortcuts([...shortcuts, s]);
  };

  return (
    <div 
      className="h-screen w-screen overflow-hidden bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${wallpaper})` }}
      onClick={() => setIsStartOpen(false)}
    >
      {/* Desktop Icons Area */}
      <div className="absolute top-0 left-0 bottom-12 right-0 p-4 flex flex-col flex-wrap content-start gap-2 z-0">
        {shortcuts.map(shortcut => (
          <DesktopIcon 
            key={shortcut.id} 
            shortcut={shortcut} 
            onDoubleClick={openWindow} 
          />
        ))}
      </div>

      {/* Windows Layer */}
      {windows.map(win => (
        <Window
          key={win.id}
          data={win}
          isActive={activeWindowId === win.id}
          onClose={closeWindow}
          onMinimize={toggleMinimize}
          onMaximize={toggleMaximize}
          onFocus={bringToFront}
          onMove={updateWindowPosition}
        >
          {win.component === 'settings' ? (
            <SettingsContent 
              currentWallpaper={wallpaper} 
              onWallpaperChange={setWallpaper} 
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
               {win.url ? (
                 <iframe 
                   src={win.url} 
                   className="w-full h-full border-none"
                   title={win.title}
                   sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                   onLoad={(e) => {
                     // Simple error handling visual not possible directly with cross-origin iframe
                     // but we provided an 'open in new tab' button in Window frame
                   }}
                 />
               ) : (
                 <div className="text-gray-400">No content</div>
               )}
            </div>
          )}
        </Window>
      ))}

      {/* Taskbar */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-12 bg-slate-900/80 backdrop-blur-md border-t border-white/10 flex items-center justify-between px-2 z-[9999]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 h-full">
          {/* Start Button */}
          <button 
            onClick={() => setIsStartOpen(!isStartOpen)}
            className={`h-9 w-9 flex items-center justify-center rounded transition-all duration-200 ${isStartOpen ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.5)]' : 'hover:bg-white/10 text-gray-100'}`}
          >
            <Grid size={20} />
          </button>

          {/* Search Placeholder */}
          <div className="hidden sm:flex items-center bg-white/10 h-8 rounded px-3 w-48 ml-2 hover:bg-white/20 transition-colors cursor-text">
            <span className="text-xs text-gray-300">Type here to search</span>
          </div>

          <div className="w-[1px] h-6 bg-white/10 mx-2" />

          {/* Open Windows */}
          <div className="flex items-center gap-1">
            {windows.map(win => (
              <button
                key={win.id}
                onClick={() => win.isMinimized ? bringToFront(win.id) : toggleMinimize(win.id)}
                className={`h-9 px-3 rounded flex items-center gap-2 transition-all max-w-[160px] ${
                  activeWindowId === win.id && !win.isMinimized 
                  ? 'bg-white/10 shadow-inner border-b-2 border-blue-400' 
                  : 'hover:bg-white/5 border-b-2 border-transparent'
                }`}
                title={win.title}
              >
                <div className="min-w-[16px]">
                    {win.component === 'settings' ? <IconRenderer name="Settings" size={16} /> : <IconRenderer name="Globe" size={16} />}
                </div>
                <span className="text-xs text-white truncate">{win.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* System Tray */}
        <div className="flex items-center h-full gap-2">
          <Clock />
          <button className="w-1 h-full border-l border-white/10 ml-2 hover:bg-white/20" title="Show Desktop" onClick={() => {
              // Minimize all
              const allMinimized = windows.every(w => w.isMinimized);
              setWindows(windows.map(w => ({ ...w, isMinimized: !allMinimized })));
          }} />
        </div>
      </div>

      {/* Start Menu */}
      <StartMenu 
        isOpen={isStartOpen} 
        onClose={() => setIsStartOpen(false)} 
        onAddShortcut={addShortcut}
        onOpenSettings={() => openWindow({ id: 'set', name: 'Settings', url: '', iconName: 'Settings', type: 'system' })}
        shortcuts={shortcuts}
        onOpenShortcut={openWindow}
      />
    </div>
  );
}