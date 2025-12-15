import React, { useState } from 'react';
import { Search, Power, Settings, Plus, ArrowLeft } from 'lucide-react';
import { AVAILABLE_ICONS, Shortcut } from '../types';
import { IconRenderer } from './IconRenderer';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onAddShortcut: (s: Omit<Shortcut, 'id'>) => void;
  onOpenSettings: () => void;
  shortcuts: Shortcut[];
  onOpenShortcut: (s: Shortcut) => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ 
  isOpen, onClose, onAddShortcut, onOpenSettings, shortcuts, onOpenShortcut
}) => {
  const [view, setView] = useState<'main' | 'add'>('main');
  const [newShortcut, setNewShortcut] = useState({ name: '', url: '', iconName: 'Globe' });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newShortcut.name && newShortcut.url) {
      // Ensure URL has protocol
      let formattedUrl = newShortcut.url;
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = 'https://' + formattedUrl;
      }
      onAddShortcut({ ...newShortcut, url: formattedUrl, type: 'link' });
      setNewShortcut({ name: '', url: '', iconName: 'Globe' });
      setView('main');
      onClose();
    }
  };

  return (
    <>
      {/* Overlay to close menu when clicking outside (on desktop area explicitly covered by this invisible layer) */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }} 
      />
      
      {/* Menu Container */}
      <div 
        className="absolute bottom-14 left-2 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-2xl border border-white/20 rounded-xl shadow-2xl p-4 z-50 text-white animate-in slide-in-from-bottom-5 fade-in duration-200 origin-bottom-left flex flex-col h-[500px]"
        onClick={(e) => e.stopPropagation()} // Prevent click from bubbling to App's background click handler
      >
        
        {view === 'main' ? (
          <>
            {/* Search Bar (Visual only for now) */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search apps..." 
                className="w-full bg-white/10 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            {/* Pinned / All Apps */}
            <div className="flex-1 overflow-y-auto pr-1">
              <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider px-2">Pinned</h3>
              <div className="grid grid-cols-4 gap-2 mb-6">
                {shortcuts.map(s => (
                  <button 
                    key={s.id}
                    onClick={() => { onOpenShortcut(s); onClose(); }}
                    className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mb-1">
                      <IconRenderer name={s.iconName} size={20} />
                    </div>
                    <span className="text-[10px] text-center truncate w-full">{s.name}</span>
                  </button>
                ))}
                
                {/* Add Button */}
                <button 
                  onClick={() => setView('add')}
                  className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-white/10 transition-colors group"
                >
                  <div className="w-10 h-10 bg-white/5 border border-dashed border-gray-500 rounded-full flex items-center justify-center mb-1 group-hover:border-white">
                    <Plus size={20} className="text-gray-400 group-hover:text-white" />
                  </div>
                  <span className="text-[10px] text-center truncate w-full text-gray-400 group-hover:text-white">Add New</span>
                </button>
              </div>

              <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider px-2">System</h3>
              <button 
                onClick={() => { onOpenSettings(); onClose(); }}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors text-left"
              >
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <Settings size={18} />
                </div>
                <span className="text-sm">Settings & Wallpaper</span>
              </button>
            </div>

            {/* Bottom Bar */}
            <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center px-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500" />
                <span className="text-sm font-medium">Guest User</span>
              </div>
              <button className="p-2 hover:bg-white/10 rounded-full text-red-400 hover:text-red-300 transition-colors" title="Shut Down">
                <Power size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-6">
              <button onClick={() => setView('main')} className="p-1 hover:bg-white/10 rounded">
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-lg font-semibold">Add Shortcut</h2>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Name</label>
                <input 
                  type="text" 
                  required
                  value={newShortcut.name}
                  onChange={(e) => setNewShortcut({...newShortcut, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded p-2 text-sm focus:outline-none focus:border-blue-500"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 mb-1">URL (https://...)</label>
                <input 
                  type="text" 
                  required
                  value={newShortcut.url}
                  onChange={(e) => setNewShortcut({...newShortcut, url: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded p-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Icon</label>
                <div className="grid grid-cols-6 gap-2 bg-white/5 p-2 rounded border border-white/10 max-h-40 overflow-y-auto">
                  {AVAILABLE_ICONS.map(icon => (
                    <button
                      type="button"
                      key={icon}
                      onClick={() => setNewShortcut({...newShortcut, iconName: icon})}
                      className={`p-2 rounded flex justify-center items-center hover:bg-white/20 transition-colors ${newShortcut.iconName === icon ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                    >
                      <IconRenderer name={icon} size={20} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-auto">
                <button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  Create Shortcut
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};