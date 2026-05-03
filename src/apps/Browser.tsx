import { useState } from 'react';
import { RefreshCw, ArrowLeft, ArrowRight, Home } from 'lucide-react';

export default function Browser() {
  const [url, setUrl] = useState('https://www.wikipedia.org');
  const [inputUrl, setInputUrl] = useState(url);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let finalUrl = inputUrl;
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }
    setUrl(finalUrl);
    setInputUrl(finalUrl);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#fff' }}>
      {/* Address Bar */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: '8px 16px', gap: '16px',
        borderBottom: '1px solid var(--glass-border)', backgroundColor: 'var(--window-bg)'
      }}>
        <div style={{ display: 'flex', gap: '8px', opacity: 0.7 }}>
          <ArrowLeft size={18} cursor="pointer" />
          <ArrowRight size={18} cursor="pointer" />
          <RefreshCw size={18} cursor="pointer" onClick={() => setUrl(url + '?')} />
          <Home size={18} cursor="pointer" onClick={() => { setUrl('https://www.wikipedia.org'); setInputUrl('https://www.wikipedia.org'); }} />
        </div>
        
        <form onSubmit={handleNavigate} style={{ flex: 1, display: 'flex' }}>
          <input 
            type="text" 
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            style={{
              flex: 1, padding: '6px 16px', borderRadius: '20px', border: '1px solid var(--glass-border)',
              backgroundColor: 'rgba(255,255,255,0.5)', outline: 'none', fontSize: '13px'
            }}
          />
        </form>
      </div>

      {/* Content */}
      <div style={{ flex: 1, backgroundColor: '#fff' }}>
        <iframe 
          src={url} 
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Browser Content"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </div>
  );
}
