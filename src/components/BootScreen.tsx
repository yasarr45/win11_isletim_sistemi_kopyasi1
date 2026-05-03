import { useEffect, useState } from 'react';
import { useOSStore } from '../store/useOSStore';
import { motion } from 'framer-motion';

export default function BootScreen() {
  const setSystemState = useOSStore(state => state.setSystemState);
  const [, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setSystemState('login'), 500);
          return 100;
        }
        return p + Math.floor(Math.random() * 15) + 5;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [setSystemState]);

  return (
    <div style={{
      width: '100%', height: '100%', backgroundColor: '#000', color: '#fff',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
    }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <div style={{
          width: '80px', height: '80px', display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '40px'
        }}>
          {/* Fake Windows Logo */}
          <div style={{ width: '38px', height: '38px', backgroundColor: '#00a4ef' }}></div>
          <div style={{ width: '38px', height: '38px', backgroundColor: '#00a4ef' }}></div>
          <div style={{ width: '38px', height: '38px', backgroundColor: '#00a4ef' }}></div>
          <div style={{ width: '38px', height: '38px', backgroundColor: '#00a4ef' }}></div>
        </div>

        {/* Loading Spinner / Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            style={{
              width: '24px', height: '24px',
              border: '3px solid rgba(255,255,255,0.3)',
              borderTop: '3px solid #fff',
              borderRadius: '50%'
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
