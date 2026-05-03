import { useEffect } from 'react';
import { useOSStore } from './store/useOSStore';
import BootScreen from './components/BootScreen';
import LoginScreen from './components/LoginScreen';
import Desktop from './components/Desktop';

function App() {
  const { systemState, theme } = useOSStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Disable right click globally
  useEffect(() => {
    const handleContext = () => {
      // e.preventDefault(); // We might handle custom context menu later
    };
    document.addEventListener('contextmenu', handleContext);
    return () => document.removeEventListener('contextmenu', handleContext);
  }, []);

  return (
    <div className="app-container" style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {systemState === 'booting' && <BootScreen />}
      {systemState === 'login' && <LoginScreen />}
      {systemState === 'desktop' && <Desktop />}
    </div>
  );
}

export default App;
