import { useOSStore } from '../store/useOSStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export default function CalendarPanel() {
  const { calendarOpen } = useOSStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    if (!calendarOpen) return;
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [calendarOpen]);

  const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <AnimatePresence>
      {calendarOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="window-glass"
          style={{
            position: 'absolute', bottom: '60px', right: '12px',
            width: '360px', borderRadius: '12px',
            zIndex: 10000, display: 'flex', flexDirection: 'column'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{ padding: '20px', borderBottom: '1px solid var(--glass-border)' }}>
            <div style={{ fontSize: '48px', fontWeight: 300, lineHeight: 1 }}>
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div style={{ color: 'var(--primary-color)', fontSize: '14px', marginTop: '8px' }}>
              {time.toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          {/* Calendar Grid */}
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', fontWeight: 600 }}>
              {time.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
              <div style={{ display: 'flex', gap: '8px' }}>
                <ChevronUp size={16} cursor="pointer" />
                <ChevronDown size={16} cursor="pointer" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '8px', fontSize: '12px', fontWeight: 600 }}>
              {days.map(d => <div key={d}>{d}</div>)}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontSize: '14px' }}>
              {/* Fake offsets */}
              <div /><div /><div />
              {dates.map(d => (
                <div 
                  key={d} 
                  style={{ 
                    padding: '8px 0', 
                    borderRadius: '50%',
                    backgroundColor: d === time.getDate() ? 'var(--primary-color)' : 'transparent',
                    color: d === time.getDate() ? '#fff' : 'inherit',
                    cursor: 'pointer'
                  }}
                  className={d !== time.getDate() ? "hover:bg-black/10 dark:hover:bg-white/10" : ""}
                >
                  {d}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
