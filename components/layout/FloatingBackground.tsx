import React, { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { Cloud, Database, Terminal, Cpu, Globe, Rocket, Binary } from 'lucide-react';
import { playSound } from '../../utils/audio';

// --- COMPONENTS FOR THE WORLD ---

// 1. Theme-Adaptive Rolling Hills
// We use inline SVGs so we can use `fill="var(--color-primary)"` to match the active theme automatically.
const HillLayer = ({ height, speed, delay, opacity, reverse = false }: { height: string, speed: number, delay: number, opacity: number, reverse?: boolean }) => (
    <div 
        className="absolute bottom-0 left-0 right-0 w-[200%] pointer-events-none flex"
        style={{
            height: height,
            opacity: opacity,
            animation: `scrollHill ${speed}s linear infinite`,
            animationDelay: `${delay}s`,
            transform: 'translate3d(0,0,0)',
        }}
    >
        {/* We repeat the SVG twice to create a seamless loop */}
        {[0, 1].map((i) => (
            <svg key={i} viewBox="0 0 1440 320" preserveAspectRatio="none" className={clsx("w-1/2 h-full", reverse && "scale-x-[-1]")}>
                <path 
                    fill="var(--color-primary)" 
                    d="M0,256L80,245.3C160,235,320,213,480,213.3C640,213,800,235,960,240C1120,245,1280,235,1360,229.3L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
                />
            </svg>
        ))}
    </div>
);

// 2. Interactive Floating Items (Islands/Bubbles)
const FloatingProp = ({ children, top, left, size, duration, delay, wobble }: any) => {
    const [popped, setPopped] = useState(false);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Pass through allowed
        setPopped(true);
        playSound('pop');
        setTimeout(() => setPopped(false), 1000); // Reset
    };

    return (
        <div 
            onClick={handleClick}
            className={clsx(
                "absolute cursor-pointer transition-all hover:brightness-110 hover:scale-110",
                popped ? "scale-150 opacity-0 duration-300" : "animate-float-horizontal opacity-90"
            )}
            style={{
                top: `${top}%`,
                left: `${left}%`,
                transform: `scale(${size})`,
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`,
                zIndex: 0
            }}
        >
            <div className={clsx(wobble && "animate-float")}>
                {children}
            </div>
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
            animationDelay: `${delay}s`
        }}
    >
        {char}
    </div>
);

export const FloatingBackground = () => {
    // Inject custom keyframes for the scrolling hills
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes scrollHill {
                from { transform: translateX(0); }
                to { transform: translateX(-50%); }
            }
            @keyframes float-horizontal {
                0% { transform: translateX(-100px) translateY(0); }
                50% { transform: translateX(50px) translateY(-20px); }
                100% { transform: translateX(-100px) translateY(0); }
            }
            @keyframes orbit {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        return () => { document.head.removeChild(style); };
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* 1. UNIVERSAL GRADIENT (Adapts to Theme BG) */}
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary)]/5 to-transparent opacity-80" />

            {/* 2. COSMIC ORB (Replaces Sun - Fits Dark/Light/Neon) */}
            {/* Uses secondary color (Gold in light, Cyan in Neon, Purple in Midnight) */}
            <div className="absolute top-[-10%] right-[-10%] w-[50vh] h-[50vh] rounded-full blur-[80px] opacity-20 bg-[var(--color-secondary)] animate-pulse" />
            <div className="absolute top-10 right-10 md:right-20 w-32 h-32 md:w-48 md:h-48 rounded-full border-2 border-[var(--color-secondary)]/30 opacity-60 animate-[orbit_60s_linear_infinite]">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[var(--color-secondary)] rounded-full shadow-[0_0_10px_var(--color-secondary)]" />
            </div>
            <div className="absolute top-24 right-24 md:right-36 w-12 h-12 bg-[var(--color-secondary)] rounded-full blur-xl opacity-40 animate-float" />

            {/* 3. FLOATING CODE PARTICLES (Background Texture) */}
            {['{ }', 'if', 'for', 'var', '</>', '&&', '||', '=>', 'func', 'try', 'catch', '[]'].map((char, i) => (
                <CodeParticle 
                    key={i}
                    char={char}
                    top={Math.random() * 80}
                    left={Math.random() * 100}
                    duration={Math.random() * 5 + 3}
                    delay={Math.random() * 5}
                />
            ))}

            {/* 4. CLOUDS LAYER (Back) - White in light, faint in dark */}
            <FloatingProp top={10} left={5} size={1.2} duration={60} delay={0}><Cloud className="text-[var(--color-text)] opacity-10" size={100} fill="currentColor" /></FloatingProp>
            <FloatingProp top={25} left={70} size={0.8} duration={80} delay={5}><Cloud className="text-[var(--color-text)] opacity-5" size={80} fill="currentColor" /></FloatingProp>

            {/* 5. FLOATING TECH ISLANDS (Interactive) */}
            <div className="absolute inset-0 pointer-events-auto">
                {/* Rocket Ship */}
                <FloatingProp top={15} left={15} size={1} duration={40} delay={0} wobble>
                    <div className="bg-[var(--color-card)] p-3 rounded-full shadow-lg border-2 border-[var(--color-secondary)]/20 rotate-12">
                        <Rocket size={32} className="text-[var(--color-accent)]" fill="currentColor" />
                    </div>
                </FloatingProp>

                {/* Database Cloud */}
                <FloatingProp top={30} left={85} size={0.9} duration={50} delay={10} wobble>
                    <div className="bg-[var(--color-card)]/80 backdrop-blur p-4 rounded-2xl shadow-xl border border-[var(--color-primary)]/20">
                        <Database size={28} className="text-[var(--color-primary)]" />
                    </div>
                </FloatingProp>

                {/* Terminal Window */}
                <FloatingProp top={60} left={10} size={1.1} duration={45} delay={5} wobble>
                    <div className="bg-gray-800 p-3 rounded-lg shadow-2xl -rotate-6 border border-gray-600">
                        <div className="flex gap-1 mb-2">
                            <div className="w-2 h-2 rounded-full bg-red-500"/>
                            <div className="w-2 h-2 rounded-full bg-yellow-500"/>
                        </div>
                        <Terminal size={24} className="text-green-400" />
                    </div>
                </FloatingProp>

                {/* CPU Chip */}
                <FloatingProp top={50} left={80} size={0.8} duration={55} delay={15} wobble>
                     <div className="bg-[var(--color-card)] p-3 rounded-xl shadow-lg border-2 border-[var(--color-primary)] rotate-12">
                        <Cpu size={32} className="text-[var(--color-primary)]" />
                    </div>
                </FloatingProp>

                 {/* Globe */}
                <FloatingProp top={80} left={20} size={0.7} duration={65} delay={8} wobble>
                     <div className="bg-[var(--color-card)] p-3 rounded-full shadow-lg border-2 border-[var(--color-secondary)]/30">
                        <Globe size={32} className="text-[var(--color-secondary)]" />
                    </div>
                </FloatingProp>
                
                 {/* Binary Block */}
                <FloatingProp top={70} left={90} size={1} duration={35} delay={20} wobble>
                     <div className="bg-[var(--color-card)] p-2 rounded-lg shadow-lg border border-[var(--color-primary)]/20 -rotate-3">
                        <Binary size={24} className="text-[var(--color-primary)]" />
                    </div>
                </FloatingProp>
            </div>

            {/* 6. THEME-ADAPTIVE HILLS (Inline SVGs with Opacity) */}
            {/* Back Hill - Lowest Opacity */}
            <HillLayer height="35%" speed={120} delay={0} opacity={0.1} /> 
            {/* Middle Hill - Medium Opacity, Reversed for variety */}
            <HillLayer height="25%" speed={90} delay={-20} opacity={0.2} reverse />
            {/* Front Hill - Highest Opacity */}
            <HillLayer height="15%" speed={60} delay={-10} opacity={0.4} />
        </div>
    );
};