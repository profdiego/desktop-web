export interface Shortcut {
  id: string;
  name: string;
  url: string;
  iconName: string; // Mapping to Lucide icon names
  type: 'link' | 'system'; // 'system' for settings, etc.
}

export interface WindowData {
  id: string;
  title: string;
  url?: string;
  component?: 'settings' | 'browser' | 'explorer'; // Internal component type
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

export interface SystemSettings {
  wallpaper: string;
  theme: 'dark' | 'light';
}

// Helper to define available icons for the user to pick
export const AVAILABLE_ICONS = [
  'Globe', 'Youtube', 'Mail', 'HardDrive', 'Folder', 'FileText', 'Image', 'Music', 'Video', 'Github', 'Twitter', 'Linkedin'
];

export const DEFAULT_WALLPAPERS = [
  "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2070&auto=format&fit=crop"
];