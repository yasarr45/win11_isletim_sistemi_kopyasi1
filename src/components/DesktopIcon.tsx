import { useState } from 'react';
import { useOSStore } from '../store/useOSStore';
import { motion } from 'framer-motion';

interface Props {
  id: string;
  name: string;
  icon: string;
}

export default function DesktopIcon({ id, name, icon }: Props) {
  const openApp = useOSStore(state => state.openApp);
  const [isSelected, setIsSelected] = useState(false);

  return (
    <motion.div
      drag
      dragMomentum={false}
      onPointerDown={(e) => {
        e.stopPropagation();
        setIsSelected(true);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        openApp(id);
        setIsSelected(false);
      }}
      style={{
        width: '74px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '8px 4px',
        borderRadius: '4px',
        backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
        border: isSelected ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent',
        cursor: 'default',
        zIndex: isSelected ? 10 : 1
      }}
      whileHover={{ backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)' }}
    >
      <div style={{ fontSize: '32px', marginBottom: '4px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
        {icon}
      </div>
      <span style={{
        color: '#fff', fontSize: '12px', textAlign: 'center',
        textShadow: '0 1px 2px rgba(0,0,0,0.8)', wordBreak: 'break-word',
        lineHeight: '1.2'
      }}>
        {name}
      </span>
    </motion.div>
  );
}
