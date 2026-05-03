import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Pubg() {
  const [gameState, setGameState] = useState<'menu' | 'matchmaking' | 'playing' | 'gameover'>('menu');
  const [matchTimer, setMatchTimer] = useState(0);
  const [score, setScore] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (gameState === 'matchmaking') {
      const interval = setInterval(() => setMatchTimer(t => t + 1), 1000);
      const timeout = setTimeout(() => {
        setGameState('playing');
        setMatchTimer(0);
      }, 2000 + Math.random() * 2000);
      
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing' || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    let animationFrameId: number;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = canvas.parentElement?.clientHeight || 600;
    };
    window.addEventListener('resize', resize);
    resize();

    const player = { x: canvas.width / 2, y: canvas.height / 2, radius: 15, speed: 4, muzzleFlash: 0 };
    const mousePos = { x: canvas.width / 2, y: canvas.height / 2 };
    let bullets: {x: number, y: number, dx: number, dy: number}[] = [];
    let enemies: {x: number, y: number, radius: number, speed: number, hp: number}[] = [];
    
    // Generate some static trees
    const trees: {x: number, y: number, size: number}[] = [];
    for(let i = 0; i < 20; i++) {
      trees.push({
        x: Math.random() * canvas.width * 2 - canvas.width/2,
        y: Math.random() * canvas.height * 2 - canvas.height/2,
        size: 30 + Math.random() * 40
      });
    }

    let zoneRadius = Math.max(canvas.width, canvas.height);
    let frames = 0;
    let currentScore = 0;

    const keys: Record<string, boolean> = {};
    const handleKeyDown = (e: KeyboardEvent) => keys[e.key.toLowerCase()] = true;
    const handleKeyUp = (e: KeyboardEvent) => keys[e.key.toLowerCase()] = false;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.x = e.clientX - rect.left;
      mousePos.y = e.clientY - rect.top;
    };

    const handleMouseDown = () => {
      const angle = Math.atan2(mousePos.y - player.y, mousePos.x - player.x);
      const velocity = 20;
      // Spawn bullet from gun barrel offset
      const barrelX = player.x + Math.cos(angle) * 45;
      const barrelY = player.y + Math.sin(angle) * 45 + Math.sin(angle + Math.PI/2) * 8;
      
      bullets.push({
        x: barrelX,
        y: barrelY,
        dx: Math.cos(angle) * velocity,
        dy: Math.sin(angle) * velocity
      });
      player.muzzleFlash = 3;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);

    const update = () => {
      if (keys['w'] && player.y - player.radius > 0) player.y -= player.speed;
      if (keys['s'] && player.y + player.radius < canvas.height) player.y += player.speed;
      if (keys['a'] && player.x - player.radius > 0) player.x -= player.speed;
      if (keys['d'] && player.x + player.radius < canvas.width) player.x += player.speed;

      if (zoneRadius > 50) zoneRadius -= 0.15;

      // Spawn Enemies dynamically
      if (frames % Math.max(30, 120 - Math.floor(frames/10)) === 0) { 
        const angle = Math.random() * Math.PI * 2;
        const dist = zoneRadius + 50;
        enemies.push({
          x: canvas.width/2 + Math.cos(angle) * dist,
          y: canvas.height/2 + Math.sin(angle) * dist,
          radius: 12,
          speed: 1.5 + Math.random() * 2,
          hp: 3
        });
      }

      bullets.forEach(b => { b.x += b.dx; b.y += b.dy; });
      bullets = bullets.filter(b => b.x > -500 && b.x < canvas.width + 500 && b.y > -500 && b.y < canvas.height + 500);

      enemies.forEach((enemy, eIndex) => {
        const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
        enemy.x += Math.cos(angle) * enemy.speed;
        enemy.y += Math.sin(angle) * enemy.speed;

        if (Math.hypot(player.x - enemy.x, player.y - enemy.y) - enemy.radius - player.radius < 0) {
          setGameState('gameover');
        }

        bullets.forEach((b, bIndex) => {
          if (Math.hypot(b.x - enemy.x, b.y - enemy.y) - enemy.radius - 5 < 0) {
            enemy.hp -= 1;
            bullets.splice(bIndex, 1);
            if (enemy.hp <= 0) {
              enemies.splice(eIndex, 1);
              currentScore += 1;
              setScore(currentScore);
            }
          }
        });
      });

      if (Math.hypot(player.x - canvas.width/2, player.y - canvas.height/2) > zoneRadius) {
        setGameState('gameover');
      }

      if (player.muzzleFlash > 0) player.muzzleFlash--;
      frames++;
    };

    const draw = () => {
      ctx.fillStyle = '#7cb342';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(0,0,0,0.05)';
      ctx.lineWidth = 2;
      for (let i = 0; i < canvas.width; i += 100) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke(); }
      for (let i = 0; i < canvas.height; i += 100) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke(); }

      // Draw Trees
      trees.forEach(t => {
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath(); ctx.arc(t.x + 5, t.y + 5, t.size, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#33691e';
        ctx.beginPath(); ctx.arc(t.x, t.y, t.size, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#558b2f';
        ctx.beginPath(); ctx.arc(t.x, t.y, t.size - 5, 0, Math.PI*2); ctx.fill();
      });

      // Safe Zone
      ctx.fillStyle = 'rgba(0, 100, 255, 0.15)';
      ctx.beginPath();
      ctx.arc(canvas.width/2, canvas.height/2, Math.max(zoneRadius, 0), 0, Math.PI * 2, false);
      ctx.rect(canvas.width, 0, -canvas.width, canvas.height);
      ctx.fill('evenodd');

      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(canvas.width/2, canvas.height/2, Math.max(zoneRadius, 0), 0, Math.PI * 2);
      ctx.stroke();

      // Bullets
      ctx.strokeStyle = '#f1c40f';
      ctx.lineWidth = 4;
      bullets.forEach(b => {
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(b.x - b.dx, b.y - b.dy);
        ctx.stroke();
      });

      // Draw Enemies
      enemies.forEach(e => {
        ctx.save();
        ctx.translate(e.x, e.y);
        const eAngle = Math.atan2(player.y - e.y, player.x - e.x);
        ctx.rotate(eAngle);
        
        ctx.fillStyle = '#c0392b';
        ctx.beginPath(); ctx.arc(12, -10, 6, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(12, 10, 6, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath(); ctx.ellipse(0, 0, 10, 16, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#c0392b';
        ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI*2); ctx.fill();
        ctx.restore();
      });

      // Draw Player
      ctx.save();
      ctx.translate(player.x, player.y);
      const angle = Math.atan2(mousePos.y - player.y, mousePos.x - player.x);
      ctx.rotate(angle);

      // Backpack
      ctx.fillStyle = '#333';
      ctx.beginPath(); ctx.roundRect(-20, -12, 12, 24, 4); ctx.fill();
      
      // Gun
      ctx.fillStyle = '#111';
      ctx.fillRect(5, 5, 40, 6);
      
      // Muzzle Flash
      if (player.muzzleFlash > 0) {
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath(); ctx.arc(48, 8, player.muzzleFlash * 4, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(48, 8, player.muzzleFlash * 2, 0, Math.PI*2); ctx.fill();
      }
      
      // Hands
      ctx.fillStyle = '#f1c27d';
      ctx.beginPath(); ctx.arc(12, -10, 5, 0, Math.PI*2); ctx.fill(); // left hand
      ctx.beginPath(); ctx.arc(15, 8, 5, 0, Math.PI*2); ctx.fill();  // right hand on gun

      // Body
      ctx.fillStyle = '#2980b9'; // Blue shirt
      ctx.beginPath(); ctx.ellipse(0, 0, 12, 18, 0, 0, Math.PI*2); ctx.fill();

      // Helmet (Level 3)
      ctx.fillStyle = '#2c3e50';
      ctx.beginPath(); ctx.arc(0, 0, 13, 0, Math.PI*2); ctx.fill();
      // Visor
      ctx.fillStyle = '#111';
      ctx.beginPath(); ctx.roundRect(2, -8, 12, 16, 2); ctx.fill();
      
      ctx.restore();

      // UI
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 24px "Inter", sans-serif';
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 4;
      ctx.fillText(`LEŞ: ${currentScore}`, 30, 40);
      ctx.fillText(`HAYATTA KALAN: ${100 - Math.floor(frames/180)}`, canvas.width - 250, 40);
      ctx.shadowBlur = 0;
    };

    const loop = () => {
      update();
      draw();
      if (gameState === 'playing') animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
    };
  }, [gameState]);

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#000', position: 'relative', overflow: 'hidden', fontFamily: '"Inter", sans-serif' }}>
      <AnimatePresence>
        
        {(gameState === 'menu' || gameState === 'matchmaking') && (
          <motion.div 
            exit={{ opacity: 0 }}
            style={{ 
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              backgroundImage: 'url("https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2560&auto=format&fit=crop")',
              backgroundSize: 'cover', backgroundPosition: 'center',
              display: 'flex', flexDirection: 'column'
            }}
          >
            <div style={{ height: '60px', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', padding: '0 30px', gap: '30px' }}>
              <span style={{ color: '#f39c12', fontWeight: 800, fontSize: '24px', letterSpacing: '2px' }}>PUBG LITE</span>
              <div style={{ display: 'flex', gap: '20px', color: '#fff', fontSize: '14px', fontWeight: 600 }}>
                <span style={{ color: '#f39c12', borderBottom: '2px solid #f39c12', paddingBottom: '18px' }}>OYNA</span>
                <span style={{ cursor: 'pointer', opacity: 0.7 }}>ÖZELLEŞTİR</span>
                <span style={{ cursor: 'pointer', opacity: 0.7 }}>DÜKKAN</span>
              </div>
            </div>

            <div style={{ position: 'absolute', bottom: '100px', left: '50px', display: 'flex', alignItems: 'center', gap: '15px' }}>
               <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#fff', overflow: 'hidden', border: '3px solid #f39c12' }}>
                  <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" alt="Player" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               </div>
               <div>
                  <div style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Yaşar_Pro</div>
                  <div style={{ color: '#f39c12', fontSize: '14px', fontWeight: 'bold' }}>SEVİYE 99</div>
               </div>
            </div>

            <div style={{ position: 'absolute', bottom: '50px', right: '50px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
              {gameState === 'matchmaking' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.8)', marginBottom: '10px' }}>
                  EŞLEŞTİRİLİYOR... {matchTimer}s
                </motion.div>
              )}
              
              <motion.button 
                whileHover={{ scale: gameState === 'menu' ? 1.05 : 1 }}
                whileTap={{ scale: gameState === 'menu' ? 0.95 : 1 }}
                onClick={() => { if (gameState === 'menu') setGameState('matchmaking'); }}
                style={{
                  backgroundColor: gameState === 'menu' ? '#f39c12' : '#7f8c8d',
                  color: '#fff', border: 'none', padding: '15px 60px',
                  fontSize: '24px', fontWeight: 900, letterSpacing: '2px',
                  borderRadius: '4px', cursor: gameState === 'menu' ? 'pointer' : 'default',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.5)', textTransform: 'uppercase'
                }}
              >
                {gameState === 'menu' ? 'BAŞLA' : 'İPTAL ET'}
              </motion.button>
              <div style={{ color: '#fff', opacity: 0.8, fontSize: '12px', fontWeight: 'bold', marginTop: '5px' }}>
                ASYA - ERANGEL - TPP
              </div>
            </div>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <motion.canvas 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            ref={canvasRef} 
            style={{ width: '100%', height: '100%', display: 'block', cursor: 'crosshair' }} 
          />
        )}

        {gameState === 'gameover' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', color: '#fff'
            }}
          >
            <div style={{ color: '#e74c3c', fontSize: '48px', fontWeight: 900, letterSpacing: '4px', marginBottom: '20px' }}>
              ÖLDÜN!
            </div>
            <div style={{ fontSize: '24px', marginBottom: '40px', color: '#f39c12', fontWeight: 'bold' }}>
              TOPLAM LEŞ: {score}
            </div>
            <button 
              onClick={() => { setScore(0); setGameState('menu'); }}
              style={{
                backgroundColor: '#f39c12', color: '#fff', border: 'none', padding: '15px 40px',
                fontSize: '20px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer'
              }}
            >
              LOBİYE DÖN
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

