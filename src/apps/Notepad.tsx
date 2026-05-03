import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

export default function Notepad() {
  const [content, setContent] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('notepad_content');
    if (saved) setContent(saved);
  }, []);

  const handleSave = () => {
    localStorage.setItem('notepad_content', content);
    alert('Kaydedildi!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--window-bg)' }}>
      {/* Menu Bar */}
      <div style={{ display: 'flex', gap: '16px', padding: '4px 16px', borderBottom: '1px solid var(--glass-border)', fontSize: '13px' }}>
        <span style={{ cursor: 'pointer' }} onClick={handleSave}>Dosya</span>
        <span style={{ cursor: 'pointer' }}>Düzen</span>
        <span style={{ cursor: 'pointer' }}>Görünüm</span>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', padding: '8px 16px', borderBottom: '1px solid var(--glass-border)' }}>
        <div 
          onClick={handleSave}
          style={{ padding: '4px', cursor: 'pointer', borderRadius: '4px' }}
          className="hover:bg-black/10 dark:hover:bg-white/10"
          title="Kaydet"
        >
          <Save size={18} />
        </div>
      </div>

      {/* Text Area */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{
          flex: 1, border: 'none', outline: 'none', padding: '16px',
          backgroundColor: 'transparent', color: 'var(--text-color)',
          fontFamily: 'Consolas, monospace', fontSize: '14px', resize: 'none'
        }}
        spellCheck={false}
      />
    </div>
  );
}
