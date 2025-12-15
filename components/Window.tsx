import React, { useState, useRef, useEffect } from 'react';
import { X, Minus, Maximize2, Minimize2, ExternalLink } from 'lucide-react';
import { WindowData } from '../types';

interface WindowProps {
  data: WindowData;
  isActive: boolean;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({ 
  data, isActive, onClose, onMinimize, onMaximize, onFocus, onMove, children 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Handle Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFocus(data.id);
    if (data.isMaximized) return;

    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - data.position.x,
      y: e.clientY - data.position.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newX = e.clientX - dragOffset.current.x;
      const newY = e.clientY - dragOffset.current.y;
      
      // Boundary checks (basic)
      const boundedY = Math.max(0, newY); // Don't go above top
      
      onMove(data.id, newX, boundedY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, data.id, onMove]);

  if (!data.isOpen || data.isMinimized) return null;

  const style: React.CSSProperties = {
    zIndex: data.zIndex,
    transform: data.isMaximized ? 'none' : `translate(${data.position.x}px, ${data.position.y}px)`,
    width: data.isMaximized ? '100%' : `${data.size.width}px`,
    height: data.isMaximized ? 'calc(100% - 48px)' : `${data.size.height}px`, // -48px for taskbar
    top: data.isMaximized ? 0 : 0,
    left: data.isMaximized ? 0 : 0,
    position: 'absolute',
  };

  return (
    <div 
      style={style}
      className={`flex flex-col bg-slate-900/90 backdrop-blur-xl rounded-lg shadow-2xl border border-white/10 overflow-hidden transition-shadow duration-200 ${isActive ? 'shadow-black/50 border-white/20' : ''}`}
      onMouseDown={() => onFocus(data.id)}
    >
      {/* Title Bar */}
      <div 
        className="h-10 bg-white/5 flex items-center justify-between px-3 select-none cursor-default"
        onMouseDown={handleMouseDown}
        onDoubleClick={() => onMaximize(data.id)}
      >
        <div className="flex items-center gap-2 text-sm text-gray-200 font-medium">
           <span>{data.title}</span>
        </div>
        
        <div className="flex items-center gap-2" onMouseDown={(e) => e.stopPropagation()}>
           {data.url && (
             <a 
               href={data.url} 
               target="_blank" 
               rel="noreferrer"
               className="p-1.5 hover:bg-white/10 rounded-md text-gray-400 hover:text-white transition-colors"
               title="Open in new tab (if site refuses to connect)"
             >
               <ExternalLink size={14} />
             </a>
           )}
           <button 
             onClick={() => onMinimize(data.id)}
             className="p-1.5 hover:bg-white/10 rounded-md text-gray-400 hover:text-white transition-colors"
           >
             <Minimize2 size={14} />
           </button>
           <button 
             onClick={() => onMaximize(data.id)}
             className="p-1.5 hover:bg-white/10 rounded-md text-gray-400 hover:text-white transition-colors"
           >
             {data.isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
           </button>
           <button 
             onClick={() => onClose(data.id)}
             className="p-1.5 hover:bg-red-500/80 rounded-md text-gray-400 hover:text-white transition-colors"
           >
             <X size={14} />
           </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-slate-50 relative">
        {children}
        {/* Overlay to catch clicks while dragging (prevents iframe interference) */}
        {isDragging && <div className="absolute inset-0 bg-transparent z-50" />}
      </div>
    </div>
  );
};