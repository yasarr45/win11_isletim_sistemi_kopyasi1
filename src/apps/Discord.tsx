import { useState, useRef, useEffect } from 'react';

export default function Discord() {
  const [messages, setMessages] = useState([
    { user: 'Sistem', time: '10:00', text: 'Genel sohbete hoş geldin!' },
    { user: 'Yaşar', time: '10:05', text: 'Merhabalar, Windows 11 simülatörü nasıl olmuş?' }
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = { user: 'Yaşar', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), text: input };
    setMessages(prev => [...prev, newMsg]);
    setInput('');

    // Fake bot reply
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        user: 'W11 Bot', 
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), 
        text: 'Gerçekten muazzam görünüyor! PUBG de eklersen efsane olur. 🎮' 
      }]);
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: '#36393f', color: '#dcddde', fontFamily: 'sans-serif' }}>
      
      {/* Servers Bar */}
      <div style={{ width: '72px', backgroundColor: '#202225', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '12px', gap: '8px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#5865F2', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'border-radius 0.2s' }} className="hover:rounded-2xl">
          <span style={{ color: 'white', fontSize: '24px' }}>💬</span>
        </div>
        <div style={{ width: '32px', height: '2px', backgroundColor: '#36393f' }} />
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#36393f', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden' }}>
          <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=100&auto=format&fit=crop" alt="server" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>

      {/* Channels Bar */}
      <div style={{ width: '240px', backgroundColor: '#2f3136', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px', fontWeight: 'bold', borderBottom: '1px solid #202225', color: 'white' }}>Yazılım Topluluğu</div>
        <div style={{ padding: '16px 8px', flex: 1, overflowY: 'auto' }}>
          <div style={{ color: '#8e9297', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', paddingLeft: '8px' }}>METİN KANALLARI</div>
          <div style={{ padding: '6px 8px', backgroundColor: 'rgba(79,84,92,0.32)', color: 'white', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
            <span style={{ color: '#8e9297' }}>#</span> genel
          </div>
          <div style={{ padding: '6px 8px', color: '#8e9297', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} className="hover:bg-white/5 hover:text-gray-300">
            <span style={{ color: '#8e9297' }}>#</span> react-yardım
          </div>
        </div>
        
        {/* User Panel */}
        <div style={{ height: '52px', backgroundColor: '#292b2f', display: 'flex', alignItems: 'center', padding: '0 8px', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#fff', overflow: 'hidden' }}>
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" alt="Yaşar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>Yaşar</span>
            <span style={{ color: '#b9bbbe', fontSize: '12px' }}>#1337</span>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#36393f' }}>
        {/* Top Header */}
        <div style={{ height: '48px', borderBottom: '1px solid #202225', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '8px' }}>
          <span style={{ color: '#8e9297', fontSize: '20px' }}>#</span>
          <span style={{ color: 'white', fontWeight: 'bold' }}>genel</span>
        </div>

        {/* Chat Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: m.user === 'Sistem' ? '#ed4245' : (m.user === 'W11 Bot' ? '#5865F2' : '#3ba55c'), flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {m.user[0]}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ color: m.user === 'W11 Bot' ? '#5865F2' : 'white', fontWeight: 500 }}>{m.user}</span>
                  <span style={{ color: '#72767d', fontSize: '12px' }}>{m.time}</span>
                </div>
                <div style={{ color: '#dcddde', marginTop: '4px', lineHeight: '1.4' }}>{m.text}</div>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: '0 16px 24px 16px' }}>
          <form onSubmit={handleSend} style={{ backgroundColor: '#40444b', borderRadius: '8px', padding: '12px 16px', display: 'flex' }}>
            <input 
              type="text" 
              placeholder="#genel kanalına mesaj gönder" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ flex: 1, backgroundColor: 'transparent', border: 'none', color: '#dcddde', outline: 'none', fontSize: '15px' }}
            />
          </form>
        </div>
      </div>

    </div>
  );
}
