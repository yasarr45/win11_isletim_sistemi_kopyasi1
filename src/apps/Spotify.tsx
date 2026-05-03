export default function Spotify() {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#121212' }}>
      <iframe 
        style={{ borderRadius: '0' }} 
        src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator&theme=0" 
        width="100%" 
        height="100%" 
        frameBorder="0" 
        allowFullScreen={false} 
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
        loading="lazy"
        title="Spotify Player"
      />
    </div>
  );
}
