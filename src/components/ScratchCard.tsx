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
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.font = "bold 24px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Raspe aqui", rect.width / 2, rect.height / 2);
    ctx.font = "16px sans-serif";
    ctx.fillText("👆", rect.width / 2, rect.height / 2 + 30);
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
    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Seu Amigo Secreto é...
        </h2>
        <p className="text-gray-600 text-sm">Raspe o cartão para descobrir</p>
      </div>

      <div className="relative">
        {/* Hidden name underneath */}
        <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-yellow-100 to-yellow-200 rounded-xl border-4 border-yellow-400 p-8">
          <div className="text-center">
            <div className="text-5xl mb-4">🎉</div>
            <div className="text-3xl font-bold text-gray-800 text-balance">
              {name}
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
          className="relative w-full h-80 rounded-xl cursor-pointer touch-none"
          style={{ touchAction: "none" }}
        />
      </div>

      {/* Reveal button */}
      {scratchPercentage < 80 && (
        <button
          type="button"
          onClick={revealAll}
          className="mt-4 w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition"
        >
          Revelar automaticamente
        </button>
      )}

      {scratchPercentage >= 80 && (
        <div className="mt-4 text-center">
          <p className="text-green-600 font-medium">✓ Revelado!</p>
          <p className="text-sm text-gray-600 mt-2">
            Agora você já sabe quem presentear 🎁
          </p>
        </div>
      )}
    </div>
  );
}
