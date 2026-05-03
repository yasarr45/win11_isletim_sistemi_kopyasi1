import { useOSStore } from '../store/useOSStore';
import Window from './Window';
import { AnimatePresence } from 'framer-motion';

export default function WindowEngine() {
  const windows = useOSStore(state => state.windows);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: '48px', pointerEvents: 'none', zIndex: 10 }}>
      <AnimatePresence>
        {windows.map(win => (
          <Window key={win.id} windowData={win} />
        ))}
      </AnimatePresence>
    </div>
  );
}
