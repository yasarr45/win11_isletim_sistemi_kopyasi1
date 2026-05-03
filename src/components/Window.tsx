import { useRef, lazy, Suspense } from 'react';
import { useOSStore } from '../store/useOSStore';
import type { WindowState } from '../store/useOSStore';
import { motion, useDragControls } from 'framer-motion';
import { Minus, Square, X, Maximize2 } from 'lucide-react';

// Lazy load apps
const Browser = lazy(() => import('../apps/Browser'));
const Notepad = lazy(() => import('../apps/Notepad'));
const Settings = lazy(() => import('../apps/Settings'));
const FileExplorer = lazy(() => import('../apps/FileExplorer'));
const Terminal = lazy(() => import('../apps/Terminal'));
const Discord = lazy(() => import('../apps/Discord'));
const Spotify = lazy(() => import('../apps/Spotify'));
const Pubg = lazy(() => import('../apps/Pubg'));

const AppRegistry: Record<string, React.ElementType> = {
  browser: Browser,
  notepad: Notepad,
  settings: Settings,
  explorer: FileExplorer,
  terminal: Terminal,
  discord: Discord,
  spotify: Spotify,
  pubg: Pubg,
};

interface Props {
  windowData: WindowState;
}

export default function Window({ windowData }: Props) {
  const { id, appId, title, isMinimized, isMaximized, zIndex, position, size } = windowData;
  const { closeWindow, minimizeWindow, maximizeWindow, restoreWindow, focusWindow, updateWindowPosition, activeWindowId } = useOSStore();
  const isActive = activeWindowId === id;

  const dragControls = useDragControls();
  const windowRef = useRef<HTMLDivElement>(null);
  
  const AppComponent = AppRegistry[appId];

  // If minimized, don't render visually but keep mounted for state if needed, but here we can just scale down to 0 or display none
  if (isMinimized) return null;

  const handlePointerDown = () => {
    focusWindow(id);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeWindow(id);
  };

  const handleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMaximized) restoreWindow(id);
    else maximizeWindow(id);
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    minimizeWindow(id);
  };

  return (
    <motion.div
      ref={windowRef}
      drag={!isMaximized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      onDragEnd={(_, info) => {
        if (!isMaximized) {
          updateWindowPosition(id, position.x + info.offset.x, position.y + info.offset.y);
        }
      }}
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        x: isMaximized ? 0 : position.x,
        y: isMaximized ? 0 : position.y,
        width: isMaximized ? '100%' : size.width,
        height: isMaximized ? '100%' : size.height,
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300, mass: 0.5, opacity: { duration: 0.15 } }}
      onPointerDown={handlePointerDown}
      className={`window-glass ${isActive ? 'active-window' : ''}`}
      style={{
        position: 'absolute',
        zIndex,
        borderRadius: isMaximized ? 0 : '8px',
        overflow: 'hidden',
        pointerEvents: 'auto',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isActive ? '0 12px 40px rgba(0,0,0,0.3)' : '0 8px 24px rgba(0,0,0,0.15)',
        border: isActive ? '1px solid rgba(255,255,255,0.4)' : '1px solid var(--glass-border)'
      }}
    >
      {/* Title Bar */}
      <div
        onPointerDown={(e) => {
          if (!isMaximized) dragControls.start(e);
        }}
        onDoubleClick={handleMaximize}
        style={{
          height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px', userSelect: 'none',
          backgroundColor: isActive ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.02)',
          borderBottom: '1px solid var(--glass-border)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 500 }}>
          <span>
            {appId === 'browser' ? '🌐' : 
             appId === 'notepad' ? '📝' : 
             appId === 'explorer' ? '📁' : 
             appId === 'terminal' ? '🖥️' : 
             appId === 'discord' ? '💬' : 
             appId === 'spotify' ? '🎵' : 
             appId === 'pubg' ? '🎮' : '⚙️'}
          </span>
          {title}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div onClick={handleMinimize} style={btnStyle} className="window-btn hover:bg-black/10 dark:hover:bg-white/10">
            <Minus size={14} />
          </div>
          <div onClick={handleMaximize} style={btnStyle} className="window-btn hover:bg-black/10 dark:hover:bg-white/10">
            {isMaximized ? <Maximize2 size={12} /> : <Square size={12} />}
          </div>
          <div onClick={handleClose} style={{...btnStyle}} className="window-btn close-btn hover:bg-red-500 hover:text-white" onMouseEnter={(e) => {e.currentTarget.style.backgroundColor='#e81123'; e.currentTarget.style.color='#fff'}} onMouseLeave={(e) => {e.currentTarget.style.backgroundColor='transparent'; e.currentTarget.style.color='inherit'}}>
            <X size={14} />
          </div>
        </div>
      </div>

      {/* App Content */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: 'var(--window-bg)' }}>
        <Suspense fallback={<div style={{ padding: '20px' }}>Yükleniyor...</div>}>
          {AppComponent && <AppComponent windowId={id} />}
        </Suspense>
      </div>
      
      {/* Fake resize handle for demo */}
      {!isMaximized && (
        <div 
          style={{
            position: 'absolute', right: 0, bottom: 0, width: '15px', height: '15px',
            cursor: 'nwse-resize'
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
            // simple implement custom resize here or ignore for simple demo
            // A real app would use a resize observer or react-rnd
          }}
        />
      )}
    </motion.div>
  );
}

const btnStyle = {
  width: '46px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', transition: 'background 0.1s'
};
