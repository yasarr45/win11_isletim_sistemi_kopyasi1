import { useOSStore } from '../store/useOSStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, Bluetooth, Volume2, Battery, Sun, Moon, Settings as SettingsIcon } from 'lucide-react';

export default function QuickSettings() {
  const { quickSettingsOpen, theme, setTheme, openApp, closeAllMenus } = useOSStore();

  return (
    <AnimatePresence>
      {quickSettingsOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="window-glass"
          style={{
            position: 'absolute', bottom: '60px', right: '12px',
            width: '360px', padding: '20px', borderRadius: '12px',
            zIndex: 10000, display: 'flex', flexDirection: 'column', gap: '20px'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Toggles */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '100%', height: '48px', backgroundColor: 'var(--primary-color)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
                <Wifi size={20} />
              </div>
              <span style={{ fontSize: '12px' }}>Wi-Fi</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '100%', height: '48px', backgroundColor: 'rgba(150,150,150,0.2)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} className="hover:bg-white/10">
                <Bluetooth size={20} />
              </div>
              <span style={{ fontSize: '12px' }}>Bluetooth</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                style={{ width: '100%', height: '48px', backgroundColor: theme === 'dark' ? 'var(--primary-color)' : 'rgba(150,150,150,0.2)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: theme === 'dark' ? '#fff' : 'inherit' }} 
              >
                {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <span style={{ fontSize: '12px' }}>Gece Işığı</span>
            </div>
          </div>

          {/* Sliders */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Sun size={20} style={{ opacity: 0.7 }} />
              <input type="range" min="0" max="100" defaultValue="80" style={{ flex: 1, accentColor: 'var(--primary-color)' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Volume2 size={20} style={{ opacity: 0.7 }} />
              <input type="range" min="0" max="100" defaultValue="50" style={{ flex: 1, accentColor: 'var(--primary-color)' }} />
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '16px', marginTop: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', opacity: 0.8 }}>
              <Battery size={16} /> %85 Kalan
            </div>
            <div 
              style={{ cursor: 'pointer', padding: '6px', borderRadius: '4px' }} 
              className="hover:bg-white/10"
              onClick={() => { openApp('settings'); closeAllMenus(); }}
            >
              <SettingsIcon size={18} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
