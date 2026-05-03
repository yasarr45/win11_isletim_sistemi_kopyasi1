import { useOSStore } from '../store/useOSStore';

export default function Settings() {
  const { theme, setTheme, wallpaper, setWallpaper } = useOSStore();

  const wallpapers = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2564&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2564&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2564&auto=format&fit=crop'
  ];

  return (
    <div style={{ display: 'flex', height: '100%', color: 'var(--text-color)' }}>
      {/* Sidebar */}
      <div style={{ width: '200px', borderRight: '1px solid var(--glass-border)', padding: '20px 10px' }}>
        <div style={{ padding: '10px', backgroundColor: 'rgba(150,150,150,0.2)', borderRadius: '4px', cursor: 'pointer', marginBottom: '4px' }}>Kişiselleştirme</div>
        <div style={{ padding: '10px', borderRadius: '4px', cursor: 'pointer', opacity: 0.7 }}>Sistem</div>
        <div style={{ padding: '10px', borderRadius: '4px', cursor: 'pointer', opacity: 0.7 }}>Ağ ve İnternet</div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '30px' }}>Kişiselleştirme</h2>

        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '16px' }}>Tema</h3>
          <div style={{ display: 'flex', gap: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="radio" checked={theme === 'light'} onChange={() => setTheme('light')} />
              Açık (Light)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="radio" checked={theme === 'dark'} onChange={() => setTheme('dark')} />
              Koyu (Dark)
            </label>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '16px' }}>Arka Plan</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {wallpapers.map((wp, i) => (
              <div 
                key={i} 
                onClick={() => setWallpaper(wp)}
                style={{
                  height: '100px', borderRadius: '8px', cursor: 'pointer',
                  backgroundImage: `url(${wp})`, backgroundSize: 'cover', backgroundPosition: 'center',
                  border: wallpaper === wp ? '3px solid var(--primary-color)' : '3px solid transparent'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
