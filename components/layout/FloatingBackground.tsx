import React, { useEffect, useState } from "react";
import { clsx } from "clsx";
import {
  Cloud,
  Database,
  Terminal,
  Cpu,
  Globe,
  Rocket,
  Binary,
} from "lucide-react";
import { playSound } from "../../utils/audio";

// --- COMPONENTS FOR THE WORLD ---

// 2. Interactive Floating Items (Islands/Bubbles)
const FloatingProp = ({
  children,
  top,
  left,
  size,
  duration,
  delay,
  wobble,
}: any) => {
  const [popped, setPopped] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Pass through allowed
    setPopped(true);
    playSound("pop");
    setTimeout(() => setPopped(false), 1000); // Reset
  };

  return (
    <div
      onClick={handleClick}
      className={clsx(
        "absolute cursor-pointer transition-all hover:brightness-110 hover:scale-110",
        popped
          ? "scale-150 opacity-0 duration-300"
          : "animate-float-horizontal opacity-90"
      )}
      style={{
        top: `${top}%`,
        left: `${left}%`,
        transform: `scale(${size})`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        zIndex: 0,
      }}
    >
      <div className={clsx(wobble && "animate-float")}>{children}</div>
    </div>
  );
};

// 3. Code Particle (Small symbols) - Now uses Theme Text Color
const CodeParticle = ({ char, top, left, duration, delay }: any) => (
  <div
    className="absolute font-mono font-bold text-[var(--color-text)] opacity-10 pointer-events-none animate-pulse"
    style={{
      top: `${top}%`,
      left: `${left}%`,
      fontSize: `${Math.random() * 20 + 10}px`,
      animation: `float ${duration}s ease-in-out infinite`,
      animationDelay: `${delay}s`,
    }}
  >
    {char}
  </div>
);

export const FloatingBackground = () => {
  // Inject custom keyframes for the floating animations
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
            @keyframes float-horizontal {
                0% { transform: translateX(-100px) translateY(0); }
                50% { transform: translateX(50px) translateY(-20px); }
                100% { transform: translateX(-100px) translateY(0); }
            }
        `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* 1. UNIVERSAL GRADIENT (Adapts to Theme BG) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary)]/5 to-transparent opacity-80" />

      {/* 2. FLOATING CODE PARTICLES (Background Texture) */}
      {[
        "{ }",
        "if",
        "for",
        "var",
        "</>",
        "&&",
        "||",
        "=>",
        "func",
        "try",
        "catch",
        "[]",
      ].map((char, i) => (
        <CodeParticle
          key={i}
          char={char}
          top={Math.random() * 80}
          left={Math.random() * 100}
          duration={Math.random() * 5 + 3}
          delay={Math.random() * 5}
        />
      ))}

      {/* 3. CLOUDS LAYER (Back) - White in light, faint in dark */}
      <FloatingProp top={10} left={5} size={1.2} duration={60} delay={0}>
        <Cloud
          className="text-[var(--color-text)] opacity-10"
          size={100}
          fill="currentColor"
        />
      </FloatingProp>
      <FloatingProp top={25} left={70} size={0.8} duration={80} delay={5}>
        <Cloud
          className="text-[var(--color-text)] opacity-5"
          size={80}
          fill="currentColor"
        />
      </FloatingProp>

      {/* 4. FLOATING TECH ISLANDS (Interactive) */}
      <div className="absolute inset-0 pointer-events-auto">
        {/* Rocket Ship */}
        <FloatingProp
          top={15}
          left={15}
          size={1}
          duration={40}
          delay={0}
          wobble
        >
          <div className="bg-[var(--color-card)] p-3 rounded-full shadow-lg border-2 border-[var(--color-secondary)]/20 rotate-12">
            <Rocket
              size={32}
              className="text-[var(--color-accent)]"
              fill="currentColor"
            />
          </div>
        </FloatingProp>

        {/* Database Cloud */}
        <FloatingProp
          top={30}
          left={85}
          size={0.9}
          duration={50}
          delay={10}
          wobble
        >
          <div className="bg-[var(--color-card)]/80 backdrop-blur p-4 rounded-2xl shadow-xl border border-[var(--color-primary)]/20">
            <Database size={28} className="text-[var(--color-primary)]" />
          </div>
        </FloatingProp>

        {/* Terminal Window */}
        <FloatingProp
          top={60}
          left={10}
          size={1.1}
          duration={45}
          delay={5}
          wobble
        >
          <div className="bg-gray-800 p-3 rounded-lg shadow-2xl -rotate-6 border border-gray-600">
            <div className="flex gap-1 mb-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
            </div>
            <Terminal size={24} className="text-green-400" />
          </div>
        </FloatingProp>

        {/* CPU Chip */}
        <FloatingProp
          top={50}
          left={80}
          size={0.8}
          duration={55}
          delay={15}
          wobble
        >
          <div className="bg-[var(--color-card)] p-3 rounded-xl shadow-lg border-2 border-[var(--color-primary)] rotate-12">
            <Cpu size={32} className="text-[var(--color-primary)]" />
          </div>
        </FloatingProp>

        {/* Globe */}
        <FloatingProp
          top={80}
          left={20}
          size={0.7}
          duration={65}
          delay={8}
          wobble
        >
          <div className="bg-[var(--color-card)] p-3 rounded-full shadow-lg border-2 border-[var(--color-secondary)]/30">
            <Globe size={32} className="text-[var(--color-secondary)]" />
          </div>
        </FloatingProp>

        {/* Binary Block */}
        <FloatingProp
          top={70}
          left={90}
          size={1}
          duration={35}
          delay={20}
          wobble
        >
          <div className="bg-[var(--color-card)] p-2 rounded-lg shadow-lg border border-[var(--color-primary)]/20 -rotate-3">
            <Binary size={24} className="text-[var(--color-primary)]" />
          </div>
        </FloatingProp>
      </div>
    </div>
  );
};
