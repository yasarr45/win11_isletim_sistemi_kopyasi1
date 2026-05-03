import { useState } from 'react';
import { useOSStore } from '../store/useOSStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function LoginScreen() {
  const { setSystemState, wallpaper } = useOSStore();
  const [password, setPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoggingIn(true);
    // Fake login delay
    setTimeout(() => {
      setSystemState('desktop');
    }, 1500);
  };

  return (
    <div style={{
      width: '100%', height: '100%',
      backgroundImage: `url(${wallpaper})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
    }}>
      {/* Blurred overlay */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(10px)',
        zIndex: 0
      }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <div style={{
          width: '120px', height: '120px', borderRadius: '50%',
          backgroundColor: '#fff', overflow: 'hidden', marginBottom: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
        }}>
          <img 
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" 
            alt="Profile" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        
        <h1 style={{ color: '#fff', fontSize: '36px', marginBottom: '30px', fontWeight: 600, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Yaşar</h1>

        <AnimatePresence>
          {!loggingIn ? (
            <motion.form 
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleLogin}
              style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
            >
              <input 
                type="password" 
                placeholder="PIN" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  padding: '12px 40px 12px 16px', borderRadius: '4px',
                  border: 'none', backgroundColor: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(10px)', width: '250px',
                  fontSize: '16px', outline: 'none'
                }}
                autoFocus
              />
              <button 
                type="submit"
                style={{
                  position: 'absolute', right: '4px', top: '50%', transform: 'translateY(-50%)',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '32px', height: '32px', borderRadius: '4px'
                }}
              >
                <ArrowRight size={20} color="#333" />
              </button>
            </motion.form>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              style={{ color: '#fff', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                style={{
                  width: '20px', height: '20px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid #fff',
                  borderRadius: '50%'
                }}
              />
              Hoş geldiniz...
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
