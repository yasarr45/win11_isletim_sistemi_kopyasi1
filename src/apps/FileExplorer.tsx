import { useState } from 'react';
import { useOSStore } from '../store/useOSStore';
import { Folder, FileText, Image as ImageIcon, ArrowLeft, ArrowUp, RefreshCw } from 'lucide-react';

const FAKE_FS: Record<string, string[]> = {
  "Belgeler": ["not1.txt", "proje.doc", "todo.md"],
  "Resimler": ["tatil.png", "profil.jpg"],
  "İndirilenler": ["setup.exe", "fatura.pdf"]
};

export default function FileExplorer() {
  const [currentPath, setCurrentPath] = useState<string>('Bu Bilgisayar');
  const { openApp } = useOSStore();

  const handleFolderClick = (folder: string) => {
    setCurrentPath(`Bu Bilgisayar > ${folder}`);
  };

  const handleBack = () => {
    setCurrentPath('Bu Bilgisayar');
  };

  const handleFileClick = (file: string) => {
    if (file.endsWith('.txt') || file.endsWith('.md')) {
      openApp('notepad');
    }
  };

  const renderContent = () => {
    if (currentPath === 'Bu Bilgisayar') {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '20px', padding: '20px' }}>
          {Object.keys(FAKE_FS).map(folder => (
            <div 
              key={folder}
              onClick={() => handleFolderClick(folder)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', padding: '10px', borderRadius: '4px' }}
              className="hover:bg-black/5 dark:hover:bg-white/5"
            >
              <Folder size={48} color="#facc15" strokeWidth={1} fill="#fef08a" />
              <span style={{ marginTop: '8px', fontSize: '13px', textAlign: 'center' }}>{folder}</span>
            </div>
          ))}
        </div>
      );
    }

    const folderName = currentPath.split(' > ')[1];
    const files = FAKE_FS[folderName] || [];

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '20px', padding: '20px' }}>
        {files.length === 0 && <div style={{ opacity: 0.5, gridColumn: '1 / -1' }}>Bu klasör boş.</div>}
        {files.map(file => {
          const isImage = file.endsWith('.png') || file.endsWith('.jpg');
          return (
            <div 
              key={file}
              onDoubleClick={() => handleFileClick(file)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', padding: '10px', borderRadius: '4px' }}
              className="hover:bg-black/5 dark:hover:bg-white/5"
            >
              {isImage ? <ImageIcon size={48} color="#3b82f6" strokeWidth={1} /> : <FileText size={48} color="#64748b" strokeWidth={1} />}
              <span style={{ marginTop: '8px', fontSize: '13px', textAlign: 'center', wordBreak: 'break-all' }}>{file}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', color: 'var(--text-color)' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', gap: '16px', borderBottom: '1px solid var(--glass-border)' }}>
        <div style={{ display: 'flex', gap: '8px', opacity: 0.7 }}>
          <ArrowLeft size={18} cursor={currentPath !== 'Bu Bilgisayar' ? "pointer" : "default"} onClick={handleBack} />
          <ArrowUp size={18} cursor={currentPath !== 'Bu Bilgisayar' ? "pointer" : "default"} onClick={handleBack} />
          <RefreshCw size={18} cursor="pointer" />
        </div>
        
        <div style={{
          flex: 1, padding: '6px 16px', borderRadius: '4px', border: '1px solid var(--glass-border)',
          backgroundColor: 'rgba(0,0,0,0.05)', fontSize: '13px'
        }}>
          {currentPath}
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <div style={{ width: '180px', borderRight: '1px solid var(--glass-border)', padding: '10px', overflowY: 'auto' }}>
          <div 
            onClick={handleBack}
            style={{ padding: '6px 10px', cursor: 'pointer', borderRadius: '4px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}
            className="hover:bg-black/5 dark:hover:bg-white/5"
          >
            <Monitor size={16} /> Bu Bilgisayar
          </div>
          {Object.keys(FAKE_FS).map(folder => (
            <div 
              key={folder}
              onClick={() => handleFolderClick(folder)}
              style={{ padding: '6px 10px', cursor: 'pointer', borderRadius: '4px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '24px' }}
              className="hover:bg-black/5 dark:hover:bg-white/5"
            >
              <Folder size={16} color="#facc15" fill="#fef08a" /> {folder}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, overflowY: 'auto', backgroundColor: 'var(--window-bg)' }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

const Monitor = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
    <line x1="8" y1="21" x2="16" y2="21"></line>
    <line x1="12" y1="17" x2="12" y2="21"></line>
  </svg>
);
