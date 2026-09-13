import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Trophy, X, Coins, Gamepad2 } from 'lucide-react';
import { cafeAudio } from '../utils/cafeAudio';

interface RetroArcadeGameProps {
  onClose?: () => void;
  onPostScoreToChat?: (score: number) => void;
  isCompact?: boolean;
}

export function RetroArcadeGame({ onClose, onPostScoreToChat, isCompact = false }: RetroArcadeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('cafe_arcade_hiscore') || '1280', 10);
    } catch {
      return 1280;
    }
  });
  const [credits, setCredits] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);

  // Game internal state ref
  const gameStateRef = useRef({
    playerX: 160,
    playerSpeed: 5,
    bullets: [] as { x: number; y: number }[],
    targets: [] as { x: number; y: number; type: number; speed: number; hp: number }[],
    particles: [] as { x: number; y: number; vx: number; vy: number; color: string; life: number }[],
    keys: { left: false, right: false, shoot: false },
    lastShootTime: 0,
    animFrame: 0,
  });

  const insertCoin = () => {
    cafeAudio.playArcadeCoin();
    setCredits((prev) => prev + 1);
  };

  const startGame = () => {
    if (credits <= 0) {
      cafeAudio.playRetroDing();
      return;
    }
    setCredits((prev) => Math.max(0, prev - 1));
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    cafeAudio.playArcadePickup();

    gameStateRef.current.bullets = [];
    gameStateRef.current.targets = [];
    gameStateRef.current.particles = [];
    gameStateRef.current.playerX = 160;
  };

  // Play CRT monitor degauss and power-on hum when arcade powers on
  useEffect(() => {
    if (!soundMuted) {
      cafeAudio.playCrtPowerOn();
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        gameStateRef.current.keys.left = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        gameStateRef.current.keys.right = true;
      }
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        gameStateRef.current.keys.shoot = true;
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        gameStateRef.current.keys.left = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        gameStateRef.current.keys.right = false;
      }
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        gameStateRef.current.keys.shoot = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlaying]);

  // Main game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let targetSpawnTimer = 0;

    const render = () => {
      const state = gameStateRef.current;
      const width = canvas.width;
      const height = canvas.height;

      // Draw Arcade CRT screen backdrop
      ctx.fillStyle = '#0a0a14';
      ctx.fillRect(0, 0, width, height);

      // Stars background parallax
      ctx.fillStyle = '#4f46e5';
      for (let i = 0; i < 25; i++) {
        const sx = (i * 37 + (Date.now() * 0.05 * ((i % 3) + 1))) % width;
        const sy = (i * 53) % height;
        ctx.fillRect(sx, sy, 2, 2);
      }

      if (isPlaying && !gameOver) {
        // Update player
        if (state.keys.left) {
          state.playerX = Math.max(16, state.playerX - state.playerSpeed);
        }
        if (state.keys.right) {
          state.playerX = Math.min(width - 16, state.playerX + state.playerSpeed);
        }

        // Shooting
        const now = Date.now();
        if (state.keys.shoot && now - state.lastShootTime > 180) {
          state.bullets.push({ x: state.playerX, y: height - 28 });
          state.lastShootTime = now;
          if (!soundMuted) cafeAudio.playArcadeZap();
        }

        // Spawn targets (pixel bugs, floppy disks, coffee beans)
        targetSpawnTimer++;
        if (targetSpawnTimer % 45 === 0) {
          state.targets.push({
            x: Math.floor(Math.random() * (width - 40)) + 20,
            y: -10,
            type: Math.floor(Math.random() * 3),
            speed: 1.5 + Math.random() * 1.5,
            hp: 1,
          });
        }

        // Update bullets
        for (let b = state.bullets.length - 1; b >= 0; b--) {
          state.bullets[b].y -= 6;
          if (state.bullets[b].y < 0) {
            state.bullets.splice(b, 1);
          }
        }

        // Update targets
        for (let t = state.targets.length - 1; t >= 0; t--) {
          const target = state.targets[t];
          target.y += target.speed;

          // Check bullet collision
          for (let b = state.bullets.length - 1; b >= 0; b--) {
            const bullet = state.bullets[b];
            if (
              Math.abs(bullet.x - target.x) < 14 &&
              Math.abs(bullet.y - target.y) < 14
            ) {
              // Destroy target
              state.bullets.splice(b, 1);
              state.targets.splice(t, 1);
              setScore((s) => {
                const nextScore = s + 50;
                if (nextScore > highScore) {
                  setHighScore(nextScore);
                  try {
                    localStorage.setItem('cafe_arcade_hiscore', String(nextScore));
                  } catch {}
                }
                return nextScore;
              });

              if (!soundMuted) cafeAudio.playArcadePickup();

              // Explosion particles
              for (let p = 0; p < 8; p++) {
                state.particles.push({
                  x: target.x,
                  y: target.y,
                  vx: (Math.random() - 0.5) * 4,
                  vy: (Math.random() - 0.5) * 4,
                  color: ['#ec4899', '#f59e0b', '#3b82f6', '#10b981'][Math.floor(Math.random() * 4)],
                  life: 20,
                });
              }
              break;
            }
          }

          // Check ground / player hit
          if (target && target.y > height - 30) {
            setGameOver(true);
            setIsPlaying(false);
            if (!soundMuted) cafeAudio.playRetroDing();
            break;
          }
        }

        // Update particles
        for (let p = state.particles.length - 1; p >= 0; p--) {
          const pt = state.particles[p];
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.life--;
          if (pt.life <= 0) {
            state.particles.splice(p, 1);
          }
        }
      }

      // DRAW PARTICLES
      for (const pt of state.particles) {
        ctx.fillStyle = pt.color;
        ctx.fillRect(pt.x, pt.y, 3, 3);
      }

      // DRAW TARGETS
      for (const tg of state.targets) {
        ctx.save();
        ctx.translate(tg.x, tg.y);
        if (tg.type === 0) {
          // Pixel Coffee Bean / Cup
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(-6, -6, 12, 12);
          ctx.fillStyle = '#d97706';
          ctx.fillRect(-4, -4, 8, 8);
          ctx.fillStyle = '#fff';
          ctx.fillRect(-2, -2, 4, 4);
        } else if (tg.type === 1) {
          // Pixel Floppy Disk
          ctx.fillStyle = '#3b82f6';
          ctx.fillRect(-7, -7, 14, 14);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-4, -7, 8, 5);
          ctx.fillStyle = '#1e3a8a';
          ctx.fillRect(-5, 0, 10, 5);
        } else {
          // Retro Space Bug
          ctx.fillStyle = '#ec4899';
          ctx.fillRect(-8, -4, 16, 8);
          ctx.fillRect(-4, -7, 8, 14);
          ctx.fillStyle = '#fdf2f8';
          ctx.fillRect(-5, -2, 2, 2);
          ctx.fillRect(3, -2, 2, 2);
        }
        ctx.restore();
      }

      // DRAW BULLETS
      ctx.fillStyle = '#38bdf8';
      for (const bullet of state.bullets) {
        ctx.fillRect(bullet.x - 1.5, bullet.y, 3, 8);
      }

      // DRAW PLAYER (Retro Arcade Ship / Cyber Coffee Mug)
      ctx.save();
      ctx.translate(state.playerX, height - 22);
      ctx.fillStyle = '#10b981';
      // Ship Base
      ctx.fillRect(-10, 4, 20, 6);
      // Cabin
      ctx.fillStyle = '#34d399';
      ctx.fillRect(-6, -4, 12, 8);
      // Cannon tip
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-2, -8, 4, 6);
      ctx.restore();

      // CRT Scanline raster effect on canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      for (let y = 0; y < height; y += 4) {
        ctx.fillRect(0, y, width, 1.5);
      }

      // Title & Score overlay on canvas if not playing
      if (!isPlaying && !gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(15, 30, width - 30, height - 60);

        ctx.fillStyle = '#fbbf24';
        ctx.font = '11px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('CYBER ARCADE 1999', width / 2, 70);

        ctx.fillStyle = '#38bdf8';
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.fillText('DEFEND THE CHAT CAFÉ', width / 2, 95);

        ctx.fillStyle = '#f43f5e';
        ctx.font = '9px "Press Start 2P", monospace';
        if (Math.floor(Date.now() / 500) % 2 === 0) {
          ctx.fillText(credits > 0 ? 'PRESS START BUTTON' : 'INSERT COIN TO PLAY', width / 2, 130);
        }

        ctx.fillStyle = '#94a3b8';
        ctx.font = '7px "Press Start 2P", monospace';
        ctx.fillText('ARROWS = MOVE | SPACE = FIRE', width / 2, 160);
      }

      if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(20, 40, width - 40, height - 80);

        ctx.fillStyle = '#ef4444';
        ctx.font = '13px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', width / 2, 80);

        ctx.fillStyle = '#fbbf24';
        ctx.font = '9px "Press Start 2P", monospace';
        ctx.fillText(`SCORE: ${score}`, width / 2, 110);

        ctx.fillStyle = '#38bdf8';
        ctx.font = '7px "Press Start 2P", monospace';
        ctx.fillText('TRY AGAIN? INSERT COIN', width / 2, 140);
      }

      state.animFrame = requestAnimationFrame(render);
    };

    gameStateRef.current.animFrame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(gameStateRef.current.animFrame);
    };
  }, [isPlaying, gameOver, credits, soundMuted, highScore, score]);

  return (
    <div
      id="arcade-game-container"
      className={`relative bg-neutral-900 border-4 border-amber-600/80 rounded-2xl shadow-2xl p-3 flex flex-col items-center overflow-hidden animate-flicker-in ${
        isCompact ? 'w-full max-w-sm' : 'w-full max-w-md'
      }`}
      style={{
        boxShadow: '0 0 25px rgba(245, 158, 11, 0.35), inset 0 0 15px rgba(0,0,0,0.9)',
      }}
    >
      {/* Old Monitor Power-On Warm-up Beam Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-40 animate-power-flash bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent"
        aria-hidden="true"
      />

      {/* Top Arcade Marquee */}
      <div className="w-full bg-gradient-to-r from-purple-900 via-amber-600 to-rose-900 p-2 rounded-lg border-2 border-amber-400 text-center mb-2 flex items-center justify-between shadow-inner">
        <div className="flex items-center gap-1.5">
          <Gamepad2 className="w-4 h-4 text-amber-300 animate-pulse" />
          <span className="font-pixel text-[10px] text-amber-200 tracking-wider font-bold">
            CYBER ARCADE '99
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded bg-black/40 hover:bg-black/80 text-amber-300 hover:text-white"
            title="Close Arcade Box"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* LED Score Display */}
      <div className="w-full grid grid-cols-3 gap-1 bg-black p-1.5 rounded border border-neutral-700 mb-2 font-pixel text-[8px]">
        <div className="text-left text-rose-400">
          <div>1UP</div>
          <div className="text-white font-bold">{String(score).padStart(5, '0')}</div>
        </div>
        <div className="text-center text-amber-400">
          <div>HI-SCORE</div>
          <div className="text-amber-200 font-bold">{String(highScore).padStart(5, '0')}</div>
        </div>
        <div className="text-right text-emerald-400">
          <div>CREDITS</div>
          <div className="text-emerald-300 font-bold">{String(credits).padStart(2, '0')}</div>
        </div>
      </div>

      {/* The CRT Arcade Screen */}
      <div className="relative rounded-lg overflow-hidden border-4 border-neutral-800 shadow-inner bg-black">
        <canvas
          ref={canvasRef}
          width={320}
          height={200}
          className="block w-full h-[200px] image-rendering-pixelated cursor-crosshair"
        />
        <div className="absolute inset-0 crt-scanlines pointer-events-none opacity-40" />
      </div>

      {/* Controls / Cabinet Deck */}
      <div className="w-full mt-3 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          {/* Insert Coin Button */}
          <button
            onClick={insertCoin}
            className="flex-1 py-1.5 px-2 rounded bg-amber-600 hover:bg-amber-500 text-amber-950 font-pixel text-[9px] font-bold border-2 border-amber-300 shadow active:translate-y-0.5 flex items-center justify-center gap-1.5 transition-transform"
          >
            <Coins className="w-3.5 h-3.5" /> INSERT COIN [25¢]
          </button>

          {/* Start / Play Button */}
          {!isPlaying ? (
            <button
              onClick={startGame}
              disabled={credits <= 0}
              className={`flex-1 py-1.5 px-2 rounded font-pixel text-[9px] font-bold border-2 shadow transition-all ${
                credits > 0
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-emerald-950 border-emerald-300 cursor-pointer animate-pulse'
                  : 'bg-neutral-800 text-neutral-500 border-neutral-700 cursor-not-allowed'
              }`}
            >
              PRESS 1P START
            </button>
          ) : (
            <button
              onClick={() => {
                setGameOver(true);
                setIsPlaying(false);
              }}
              className="flex-1 py-1.5 px-2 rounded bg-rose-800 hover:bg-rose-700 text-rose-100 font-pixel text-[9px] border-2 border-rose-400 cursor-pointer"
            >
              ABORT
            </button>
          )}
        </div>

        {/* Post High Score to Chat Room */}
        {score > 0 && onPostScoreToChat && (
          <button
            onClick={() => onPostScoreToChat(score)}
            className="w-full py-1 rounded bg-purple-950/80 hover:bg-purple-900 border border-purple-500/50 text-purple-200 font-pixel text-[8px] flex items-center justify-center gap-1.5 transition-colors"
          >
            <Trophy className="w-3 h-3 text-amber-400" /> Share Score ({score} pts) in Chat
          </button>
        )}

        {/* Arcade Action Buttons for Touch/Mobile */}
        <div className="flex items-center justify-between pt-1 border-t border-neutral-800 px-1">
          <div className="flex items-center gap-1">
            <button
              onMouseDown={() => (gameStateRef.current.keys.left = true)}
              onMouseUp={() => (gameStateRef.current.keys.left = false)}
              onTouchStart={() => (gameStateRef.current.keys.left = true)}
              onTouchEnd={() => (gameStateRef.current.keys.left = false)}
              className="w-8 h-8 rounded bg-neutral-800 border border-neutral-600 text-white font-pixel text-xs active:bg-neutral-600 flex items-center justify-center select-none"
            >
              ◀
            </button>
            <button
              onMouseDown={() => (gameStateRef.current.keys.right = true)}
              onMouseUp={() => (gameStateRef.current.keys.right = false)}
              onTouchStart={() => (gameStateRef.current.keys.right = true)}
              onTouchEnd={() => (gameStateRef.current.keys.right = false)}
              className="w-8 h-8 rounded bg-neutral-800 border border-neutral-600 text-white font-pixel text-xs active:bg-neutral-600 flex items-center justify-center select-none"
            >
              ▶
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundMuted(!soundMuted)}
              className="p-1.5 rounded bg-neutral-800 text-neutral-400 hover:text-white"
              title="Toggle Game Audio"
            >
              {soundMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            <button
              onMouseDown={() => {
                gameStateRef.current.keys.shoot = true;
                setTimeout(() => (gameStateRef.current.keys.shoot = false), 150);
              }}
              onTouchStart={() => {
                gameStateRef.current.keys.shoot = true;
                setTimeout(() => (gameStateRef.current.keys.shoot = false), 150);
              }}
              className="px-4 py-1.5 rounded-full bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-pixel text-[9px] shadow-lg border-2 border-rose-300 font-bold select-none"
            >
              FIRE!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
