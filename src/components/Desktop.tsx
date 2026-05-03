import { useState, useRef } from 'react';
import { useOSStore } from '../store/useOSStore';
import Taskbar from './Taskbar';
import WindowEngine from './WindowEngine';
import StartMenu from './StartMenu';
import DesktopIcon from './DesktopIcon';
import ContextMenu from './ContextMenu';
import QuickSettings from './QuickSettings';
import CalendarPanel from './CalendarPanel';

export default function Desktop() {
  const { wallpaper, closeAllMenus } = useOSStore();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const desktopRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    closeAllMenus();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleClick = () => {
    closeAllMenus();
    setContextMenu(null);
  };

  return (
    <div 
      ref={desktopRef}
      style={{
        width: '100%', height: '100%',
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
      onContextMenu={handleContextMenu}
      onClick={handleClick}
    >
      {/* Desktop Icons Container */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: '48px', // space for taskbar
        display: 'flex', flexDirection: 'column', flexWrap: 'wrap', alignContent: 'flex-start',
        padding: '10px', gap: '10px'
      }}>
        <DesktopIcon id="browser" name="Edge" icon="🌐" />
        <DesktopIcon id="notepad" name="Not Defteri" icon="📝" />
        <DesktopIcon id="explorer" name="Dosyalar" icon="📁" />
        <DesktopIcon id="terminal" name="Terminal" icon="🖥️" />
        <DesktopIcon id="settings" name="Ayarlar" icon="⚙️" />
        <DesktopIcon id="discord" name="Discord" icon="💬" />
        <DesktopIcon id="spotify" name="Spotify" icon="🎵" />
        <DesktopIcon id="pubg" name="PUBG" icon="🎮" />
      </div>

      <WindowEngine />
      <StartMenu />
      <QuickSettings />
      <CalendarPanel />
      <Taskbar />

      {contextMenu && (
        <ContextMenu x={contextMenu.x} y={contextMenu.y} onClose={() => setContextMenu(null)} />
      )}
    </div>
  );
}
