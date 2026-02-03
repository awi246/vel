"use client";

import { useState, useRef, useEffect, useCallback, PointerEvent } from "react";
import confetti, { CreateTypes } from "canvas-confetti";
import Image from "next/image";

export default function Home() {
  const [accepted, setAccepted] = useState(false);
  const [yesScale, setYesScale] = useState(1);
  const [noPosition, setNoPosition] = useState({
    left: "62%",
    top: "50%",
    transform: "translateY(-50%)",
  });

  const zoneRef = useRef<HTMLElement>(null);
  const noBtnRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const confettiInstance = useRef<CreateTypes | null>(null);

  // Initialize confetti
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const resizeCanvas = () => {
        const dpr = Math.max(1, window.devicePixelRatio || 1);
        canvas.width = Math.floor(window.innerWidth * dpr);
        canvas.height = Math.floor(window.innerHeight * dpr);
      };

      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);
      window.addEventListener("orientationchange", () =>
        setTimeout(resizeCanvas, 150),
      );

      confettiInstance.current = confetti.create(canvas, {
        resize: false,
        useWorker: true,
      });

      return () => {
        window.removeEventListener("resize", resizeCanvas);
      };
    }
  }, []);

  const fireConfetti = useCallback(() => {
    const instance = confettiInstance.current;
    if (!instance) return;

    const end = Date.now() + 1600;

    const frame = () => {
      instance({
        particleCount: 12,
        spread: 90,
        startVelocity: 45,
        ticks: 180,
        origin: { x: Math.random(), y: Math.random() * 0.3 },
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };

    frame();

    setTimeout(() => {
      instance({
        particleCount: 300,
        spread: 140,
        startVelocity: 60,
        ticks: 220,
        origin: { x: 0.5, y: 0.55 },
      });
    }, 300);
  }, []);

  const growYes = () => {
    setYesScale((prev) => Math.min(2.2, prev + 0.1));
  };

  const clamp = (n: number, min: number, max: number): number =>
    Math.max(min, Math.min(max, n));

  const moveNo = useCallback((px: number, py: number) => {
    if (!zoneRef.current || !noBtnRef.current) return;

    const z = zoneRef.current.getBoundingClientRect();
    const b = noBtnRef.current.getBoundingClientRect();

    let dx = b.left + b.width / 2 - px;
    let dy = b.top + b.height / 2 - py;
    const mag = Math.hypot(dx, dy) || 1;
    dx /= mag;
    dy /= mag;

    let newLeft = b.left - z.left + dx * 150;
    let newTop = b.top - z.top + dy * 150;

    newLeft = clamp(newLeft, 0, z.width - b.width);
    newTop = clamp(newTop, 0, z.height - b.height);

    setNoPosition({
      left: `${newLeft}px`,
      top: `${newTop}px`,
      transform: "none",
    });

    growYes();
  }, []);

  const handlePointerMove = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (!noBtnRef.current) return;

      const b = noBtnRef.current.getBoundingClientRect();
      const d = Math.hypot(
        b.left + b.width / 2 - e.clientX,
        b.top + b.height / 2 - e.clientY,
      );

      if (d < 140) {
        moveNo(e.clientX, e.clientY);
      }
    },
    [moveNo],
  );

  const handleYesClick = () => {
    setAccepted(true);
    fireConfetti();
  };

  const handleNoClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  return (
    <>
      <canvas id="confettiCanvas" ref={canvasRef}></canvas>

      <main className="card">
        <CatWithHeart />

        <h1 className="">Madam ji, will you be my Valentine?</h1>

        {!accepted && (
          <>
            <section
              className="button-zone"
              ref={zoneRef}
              onPointerMove={handlePointerMove}
            >
              <button
                className="yes-btn"
                onClick={handleYesClick}
                style={{ transform: `translateY(-50%) scale(${yesScale})` }}
              >
                Yes
              </button>
              <button
                className="no-btn"
                ref={noBtnRef}
                onClick={handleNoClick}
                style={noPosition}
              >
                No
              </button>
            </section>

            <div className="hint">&quot;No&quot; seems a bit shy 😈</div>
          </>
        )}

        {accepted && (
          <section className="result">
            <h2>YAY! 🎉</h2>
            <Image
              className="fireworks"
              src="/hearts.jpg"
              alt="Our Hearts"
              width={380}
              height={500}
              style={{ objectFit: "cover", borderRadius: "12px" }}
            />
          </section>
        )}
      </main>
    </>
  );
}

// SVG Component
function CatWithHeart() {
  return (
    <svg
      className="art"
      viewBox="0 0 320 240"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="fur" x1="0" x2="1">
          <stop offset="0" stopColor="#f7c7a1" />
          <stop offset="1" stopColor="#f2a97b" />
        </linearGradient>
        <linearGradient id="heart" x1="0" x2="1">
          <stop offset="0" stopColor="#ff4d7d" />
          <stop offset="1" stopColor="#ff1f68" />
        </linearGradient>
      </defs>

      <path
        d="M250 50 C250 33 270 25 282 38
           C294 25 314 33 314 50
           C314 78 282 92 282 106
           C282 92 250 78 250 50Z"
        fill="url(#heart)"
      />

      <path
        d="M90 120 C90 70 140 40 190 60
           C240 40 290 70 290 120
           C290 180 240 210 190 210
           C140 210 90 180 90 120Z"
        fill="url(#fur)"
      />

      <path d="M110 92 L95 55 L140 78 Z" fill="#f2a97b" />
      <path d="M270 92 L285 55 L240 78 Z" fill="#f2a97b" />

      <circle cx="160" cy="130" r="8" />
      <circle cx="220" cy="130" r="8" />

      <path
        d="M190 144 C186 144 182 148 182 152
           C182 160 190 164 190 170
           C190 164 198 160 198 152
           C198 148 194 144 190 144Z"
        fill="#ff7aa2"
      />
    </svg>
  );
}
