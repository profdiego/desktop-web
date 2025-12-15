import React from 'react';
import { 
  Globe, Youtube, Mail, HardDrive, Folder, FileText, 
  Image, Music, Video, Github, Twitter, Linkedin, Settings, 
  Trash2, Monitor
} from 'lucide-react';

interface IconRendererProps {
  name: string;
  size?: number;
  className?: string;
}

export const IconRenderer: React.FC<IconRendererProps> = ({ name, size = 24, className = "" }) => {
  const props = { size, className };

  switch (name) {
    case 'Globe': return <Globe {...props} />;
    case 'Youtube': return <Youtube {...props} />;
    case 'Mail': return <Mail {...props} />;
    case 'HardDrive': return <HardDrive {...props} />;
    case 'Folder': return <Folder {...props} />;
    case 'FileText': return <FileText {...props} />;
    case 'Image': return <Image {...props} />;
    case 'Music': return <Music {...props} />;
    case 'Video': return <Video {...props} />;
    case 'Github': return <Github {...props} />;
    case 'Twitter': return <Twitter {...props} />;
    case 'Linkedin': return <Linkedin {...props} />;
    case 'Settings': return <Settings {...props} />;
    case 'Trash': return <Trash2 {...props} />;
    default: return <Monitor {...props} />;
  }
};