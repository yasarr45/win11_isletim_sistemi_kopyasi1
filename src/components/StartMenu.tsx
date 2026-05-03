import { useOSStore, APPS } from '../store/useOSStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Power } from 'lucide-react';
import { useState } from 'react';

export default function StartMenu() {
  const { startMenuOpen, openApp, setSystemState } = useOSStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApps = APPS.filter(app => app.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <AnimatePresence>
      {startMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="window-glass"
          style={{
            position: 'absolute', bottom: '60px', left: '50%', transform: 'translateX(-50%)',
            width: '600px', height: '650px', borderRadius: '12px',
            display: 'flex', flexDirection: 'column', zIndex: 10000,
            overflow: 'hidden'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Area */}
          <div style={{ padding: '30px 30px 15px 30px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-color)',
              borderRadius: '20px', padding: '0 16px', height: '40px',
              border: '1px solid var(--glass-border)'
            }}>
              <Search size={18} color="var(--text-color)" style={{ opacity: 0.7 }} />
              <input
                type="text"
                placeholder="Uygulama, dosya ve web'de arayın"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  border: 'none', background: 'transparent', outline: 'none',
                  color: 'var(--text-color)', width: '100%', marginLeft: '12px', fontSize: '14px'
                }}
                autoFocus
              />
            </div>
          </div>

          {/* Pinned Apps */}
          <div style={{ padding: '15px 30px', flex: 1, overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontWeight: 600, fontSize: '14px' }}>Sabitlenmiş</span>
              <span style={{ fontSize: '12px', background: 'rgba(150,150,150,0.2)', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer' }}>Tüm uygulamalar</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '15px' }}>
              {filteredApps.map(app => (
                <motion.div
                  key={app.id}
                  whileHover={{ backgroundColor: 'rgba(150,150,150,0.1)' }}
                  onClick={() => openApp(app.id)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    padding: '8px', borderRadius: '8px', cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: '28px', marginBottom: '8px' }}>
                    {app.id === 'browser' ? '🌐' : 
                     app.id === 'notepad' ? '📝' : 
                     app.id === 'explorer' ? '📁' : 
                     app.id === 'terminal' ? '🖥️' : 
                     app.id === 'discord' ? '💬' : 
                     app.id === 'spotify' ? '🎵' : 
                     app.id === 'pubg' ? '🎮' : '⚙️'}
                  </span>
                  <span style={{ fontSize: '12px', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>{app.name}</span>
                </motion.div>
              ))}
            </div>

            {/* Recommended (Fake Data) */}
            {searchTerm === '' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', marginBottom: '16px' }}>
                  <span style={{ fontWeight: 600, fontSize: '14px' }}>Önerilenler</span>
                  <span style={{ fontSize: '12px', background: 'rgba(150,150,150,0.2)', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer' }}>Daha fazla</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '8px', cursor: 'pointer' }} className="hover:bg-black/5 dark:hover:bg-white/5">
                    <span style={{ fontSize: '24px' }}>📝</span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '13px', fontWeight: 500 }}>Notlar.txt</span>
                      <span style={{ fontSize: '11px', opacity: 0.6 }}>15 dk önce açıldı</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '8px', cursor: 'pointer' }} className="hover:bg-black/5 dark:hover:bg-white/5">
                    <span style={{ fontSize: '24px' }}>🌐</span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '13px', fontWeight: 500 }}>GitHub</span>
                      <span style={{ fontSize: '11px', opacity: 0.6 }}>1 saat önce açıldı</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Bottom Bar */}
          <div style={{
            height: '64px', backgroundColor: 'rgba(0,0,0,0.05)',
            borderTop: '1px solid var(--glass-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 30px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#fff', overflow: 'hidden' }}>
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" alt="Yaşar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500 }}>Yaşar</span>
            </div>
            
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => setSystemState('login')} style={{ cursor: 'pointer', padding: '8px', borderRadius: '4px' }} className="hover:bg-black/10 dark:hover:bg-white/10">
              <Power size={20} color="var(--text-color)" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
