"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";

interface ScratchCardProps {
  readonly name: string;
}

export default function ScratchCard({ name }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchPercentage, setScratchPercentage] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Draw scratch surface
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, "#c084fc");
    gradient.addColorStop(1, "#f472b6");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Add texture
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;
      ctx.fillRect(x, y, 2, 2);
    }

    // Add text
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🎄 QUEM É SEU", rect.width / 2, rect.height / 2 - 20);
    ctx.fillText("AMIGO SECRETO? 🎁", rect.width / 2, rect.height / 2 + 20);
  }, []);

  const scratch = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas || !isScratching) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x: number, y: number;

    if ("touches" in e) {
      const touch = e.touches[0];
      x = touch.clientX - rect.left;
      y = touch.clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();

    // Calculate scratch percentage
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparent = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) transparent++;
    }
    const percentage = (transparent / (imageData.data.length / 4)) * 100;
    setScratchPercentage(percentage);
  };

  const revealAll = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setScratchPercentage(100);
  };

  return (
    <div className="h-[360px] md:h-[400px] rounded-xl overflow-hidden border-2 border-blue-500/30 bg-gray-50 shadow-inner relative">
      {/* Hidden content underneath */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 p-4 md:p-6">
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
          style={{ animation: "shimmer 3s infinite" }}
        />

        {/* Prize content */}
        <div className="text-center space-y-3 md:space-y-4 relative max-w-full">
          <div className="text-5xl md:text-7xl animate-bounce">🎅</div>
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg">
              SEU AMIGO SECRETO É
            </h2>
          </div>
          <div className="px-4 md:px-8 py-4 md:py-6 bg-white rounded-xl border-2 border-dashed border-white/30 shadow-2xl max-w-full">
            <p className="text-xs md:text-sm text-gray-600 mb-1 md:mb-2 font-mono">
              🎁 Nome Revelado
            </p>
            <p className="text-2xl md:text-3xl font-bold text-blue-600 break-words">
              {name}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-white bg-white/20 rounded-lg px-3 py-2">
            <span className="text-lg">🎄</span>
            <p className="text-xs md:text-sm font-semibold">
              Não conte para ninguém!
            </p>
            <span className="text-lg">🎄</span>
          </div>
        </div>
      </div>

      {/* Scratch canvas overlay */}
      <canvas
        ref={canvasRef}
        onMouseDown={() => setIsScratching(true)}
        onMouseUp={() => setIsScratching(false)}
        onMouseLeave={() => setIsScratching(false)}
        onMouseMove={scratch}
        onTouchStart={() => setIsScratching(true)}
        onTouchEnd={() => setIsScratching(false)}
        onTouchMove={scratch}
        className="absolute inset-0 w-full h-full cursor-pointer touch-none z-20"
        style={{ touchAction: "none" }}
      />

      {/* Reveal button overlay */}
      {scratchPercentage < 60 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30">
          <button
            type="button"
            onClick={revealAll}
            className="py-2 px-6 bg-white/90 backdrop-blur-sm text-blue-600 rounded-full text-sm font-semibold shadow-lg hover:bg-white transition-all duration-200 flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            Revelar agora
          </button>
        </div>
      )}
    </div>
  );
}
