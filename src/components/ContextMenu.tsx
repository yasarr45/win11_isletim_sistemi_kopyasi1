import { useOSStore } from '../store/useOSStore';
import { motion } from 'framer-motion';
import { FolderPlus, RefreshCw, LayoutGrid, Monitor, Settings } from 'lucide-react';

interface Props {
  x: number;
  y: number;
  onClose: () => void;
}

export default function ContextMenu({ x, y, onClose }: Props) {
  const { openApp } = useOSStore();

  // Adjust position if it goes off screen
  const safeX = Math.min(x, window.innerWidth - 250);
  const safeY = Math.min(y, window.innerHeight - 300);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.1 }}
      className="window-glass"
      style={{
        position: 'absolute', left: safeX, top: safeY,
        width: '250px', padding: '5px', borderRadius: '8px',
        zIndex: 100000, display: 'flex', flexDirection: 'column',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <ContextMenuItem icon={<LayoutGrid size={16} />} label="Görünüm" hasSubmenu />
      <ContextMenuItem icon={<RefreshCw size={16} />} label="Yenile" onClick={onClose} />
      
      <div style={{ height: '1px', backgroundColor: 'var(--glass-border)', margin: '4px 0' }} />
      
      <ContextMenuItem icon={<FolderPlus size={16} />} label="Yeni" hasSubmenu />
      
      <div style={{ height: '1px', backgroundColor: 'var(--glass-border)', margin: '4px 0' }} />
      
      <ContextMenuItem icon={<Monitor size={16} />} label="Görüntü ayarları" onClick={() => { openApp('settings'); onClose(); }} />
      <ContextMenuItem icon={<Settings size={16} />} label="Kişiselleştir" onClick={() => { openApp('settings'); onClose(); }} />
    </motion.div>
  );
}

function ContextMenuItem({ icon, label, hasSubmenu, onClick }: any) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 12px', borderRadius: '4px', cursor: 'pointer',
        fontSize: '13px'
      }}
      className="hover:bg-black/10 dark:hover:bg-white/10"
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(150,150,150,0.2)'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ opacity: 0.7 }}>{icon}</span>
        <span>{label}</span>
      </div>
      {hasSubmenu && <span style={{ opacity: 0.5 }}>▶</span>}
    </div>
  );
}
