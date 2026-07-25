import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
}

export function FloatingBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const spawnParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(Math.random() * 0.4 + 0.15),
      size: Math.random() * 1.5 + 0.5,
      opacity: 0,
      life: 0,
      maxLife: Math.random() * 300 + 200,
    });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn particles occasionally
      if (Math.random() < 0.12 && particles.length < 35) {
        particles.push(spawnParticle());
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        const progress = p.life / p.maxLife;
        p.opacity = progress < 0.1
          ? progress / 0.1
          : progress > 0.8
          ? 1 - (progress - 0.8) / 0.2
          : 1;

        ctx.save();
        ctx.globalAlpha = p.opacity * 0.35;
        ctx.fillStyle = "#8B5CF6";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Base radial glow — hero center */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "900px",
          height: "700px",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(124,58,237,0.12) 0%, rgba(124,58,237,0.04) 45%, transparent 70%)",
          animation: "glow-breathe 6s ease-in-out infinite",
          willChange: "opacity",
        }}
      />

      {/* Secondary warm glow — bottom right */}
      <div
        style={{
          position: "absolute",
          bottom: "5%",
          right: "-5%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(99,102,241,0.06) 0%, transparent 65%)",
        }}
      />

      {/* Noise texture overlay */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.025,
        }}
      >
        <filter id="noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>

      {/* Floating particles canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />
    </div>
  );
}
