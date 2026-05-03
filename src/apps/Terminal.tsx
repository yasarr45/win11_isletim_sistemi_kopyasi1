import { useState, useRef, useEffect } from 'react';

export default function Terminal() {
  const [history, setHistory] = useState<{ command: string, output: string }[]>([
    { command: '', output: 'Windows PowerShell\nTelif Hakkı (C) Microsoft Corporation. Tüm hakları saklıdır.\n\nYeni özellikleri ve iyileştirmeleri deneyin! https://aka.ms/PSWindows\n' }
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase();
      let output = '';

      if (cmd === 'help') {
        output = 'Kullanılabilir komutlar:\n- help: Bu mesajı gösterir\n- dir: Dizinleri listeler\n- date: Geçerli tarihi gösterir\n- echo [text]: Metni yazdırır\n- clear / cls: Ekranı temizler\n- exit: Terminali kapatır';
      } else if (cmd === 'dir') {
        output = ' Directory of C:\\Users\\Yaşar\n\n01.05.2026  12:00    <DIR>          .\n01.05.2026  12:00    <DIR>          ..\n01.05.2026  12:00    <DIR>          Belgeler\n01.05.2026  12:00    <DIR>          İndirilenler\n01.05.2026  12:00    <DIR>          Masaüstü';
      } else if (cmd === 'date') {
        output = new Date().toString();
      } else if (cmd.startsWith('echo ')) {
        output = cmd.replace('echo ', '');
      } else if (cmd === 'clear' || cmd === 'cls') {
        setHistory([]);
        setInput('');
        return;
      } else if (cmd === 'exit') {
        // We could call closeWindow but need ID, omit for simplicity or handle via props
        output = 'Terminal kapatılıyor...';
      } else if (cmd === '') {
        output = '';
      } else {
        output = `'${cmd}' iç ya da dış komut, çalıştırılabilir\nprogram ya da toplu iş dosyası olarak tanınmıyor.`;
      }

      setHistory([...history, { command: input, output }]);
      setInput('');
    }
  };

  return (
    <div 
      style={{ 
        width: '100%', height: '100%', backgroundColor: '#0c0c0c', color: '#cccccc', 
        fontFamily: 'Consolas, monospace', fontSize: '14px', padding: '10px', 
        overflowY: 'auto', display: 'flex', flexDirection: 'column'
      }}
      onClick={() => document.getElementById('terminal-input')?.focus()}
    >
      {history.map((item, i) => (
        <div key={i} style={{ marginBottom: '8px', whiteSpace: 'pre-wrap' }}>
          {item.command && <div><span style={{ color: '#00ff00' }}>C:\Users\Yaşar&gt;</span> {item.command}</div>}
          {item.output && <div>{item.output}</div>}
        </div>
      ))}

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ color: '#00ff00', marginRight: '8px' }}>C:\Users\Yaşar&gt;</span>
        <input 
          id="terminal-input"
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          style={{ 
            flex: 1, background: 'transparent', border: 'none', color: '#cccccc', 
            outline: 'none', fontFamily: 'Consolas, monospace', fontSize: '14px' 
          }}
          autoFocus
          autoComplete="off"
          spellCheck="false"
        />
      </div>
      <div ref={endRef} />
    </div>
  );
}
