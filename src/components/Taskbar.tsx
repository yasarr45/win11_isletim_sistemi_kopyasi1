import { useEffect, useState } from 'react';
import { useOSStore } from '../store/useOSStore';
import { motion } from 'framer-motion';
import { Wifi, Volume2, Battery, ChevronUp } from 'lucide-react';

export default function Taskbar() {
  const { windows, activeWindowId, toggleStartMenu, startMenuOpen, focusWindow, openApp, toggleQuickSettings, toggleCalendar } = useOSStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Group windows by appId to show in taskbar
  const uniqueAppIds = Array.from(new Set(windows.map(w => w.appId)));
  const pinnedApps = ['browser', 'explorer', 'settings']; // Default pinned

  const taskbarApps = Array.from(new Set([...pinnedApps, ...uniqueAppIds]));

  return (
    <div className="taskbar-glass" style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: '48px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 12px', zIndex: 9999
    }}>
      {/* Centered Apps Area */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}>
        {/* Start Button */}
        <motion.div
          whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => { e.stopPropagation(); toggleStartMenu(); }}
          style={{
            width: '40px', height: '40px', borderRadius: '4px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', backgroundColor: startMenuOpen ? 'rgba(255,255,255,0.15)' : 'transparent'
          }}
        >
          <div style={{ width: '20px', height: '20px', display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
            <div style={{ width: '9px', height: '9px', backgroundColor: '#00a4ef', borderRadius: '1px' }}></div>
            <div style={{ width: '9px', height: '9px', backgroundColor: '#00a4ef', borderRadius: '1px' }}></div>
            <div style={{ width: '9px', height: '9px', backgroundColor: '#00a4ef', borderRadius: '1px' }}></div>
            <div style={{ width: '9px', height: '9px', backgroundColor: '#00a4ef', borderRadius: '1px' }}></div>
          </div>
        </motion.div>

        {/* App Icons */}
        {taskbarApps.map(appId => {
          const appWindows = windows.filter(w => w.appId === appId);
          const isOpen = appWindows.length > 0;
          const isActive = appWindows.some(w => w.id === activeWindowId && !w.isMinimized);

          return (
            <motion.div
              key={appId}
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (!isOpen) {
                  openApp(appId);
                } else {
                  // If active, minimize. Else focus. (Simplified for single instance assumption)
                  const w = appWindows[0];
                  if (isActive) {
                    useOSStore.getState().minimizeWindow(w.id);
                  } else {
                    focusWindow(w.id);
                  }
                }
              }}
              style={{
                width: '40px', height: '40px', borderRadius: '4px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', position: 'relative',
                backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : (isOpen ? 'rgba(255,255,255,0.05)' : 'transparent')
              }}
            >
              <span style={{ fontSize: '20px' }}>
                {appId === 'browser' ? '🌐' : 
                 appId === 'notepad' ? '📝' : 
                 appId === 'explorer' ? '📁' : 
                 appId === 'terminal' ? '🖥️' : 
                 appId === 'discord' ? '💬' : 
                 appId === 'spotify' ? '🎵' : 
                 appId === 'pubg' ? '🎮' : '⚙️'}
              </span>
              {/* Active indicator dot */}
              {isOpen && (
                <div style={{
                  position: 'absolute', bottom: '2px', width: isActive ? '16px' : '6px', height: '3px',
                  backgroundColor: isActive ? 'var(--primary-color)' : '#999',
                  borderRadius: '2px', transition: 'all 0.2s'
                }} />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* System Tray Area */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 8px', height: '40px', borderRadius: '4px', cursor: 'pointer' }} className="hover:bg-white/10">
          <ChevronUp size={16} />
        </div>
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 8px', height: '40px', borderRadius: '4px', cursor: 'pointer' }} 
          className="hover:bg-black/10 dark:hover:bg-white/10"
          onClick={(e) => { e.stopPropagation(); toggleQuickSettings(); }}
        >
          <Wifi size={16} />
          <Volume2 size={16} />
          <Battery size={16} />
        </div>
        <div 
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', padding: '0 8px', height: '40px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }} 
          className="hover:bg-black/10 dark:hover:bg-white/10"
          onClick={(e) => { e.stopPropagation(); toggleCalendar(); }}
        >
          <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <span>{time.toLocaleDateString()}</span>
        </div>
        <div style={{ width: '4px', height: '40px', borderLeft: '1px solid rgba(150,150,150,0.3)', marginLeft: '4px', cursor: 'pointer' }} 
             onClick={() => {
               // Show desktop: minimize all
               windows.forEach(w => useOSStore.getState().minimizeWindow(w.id));
             }}
        />
      </div>
    </div>
  );
}
