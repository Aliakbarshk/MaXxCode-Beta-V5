import React from 'react';
import { CheckCircle, Lock, Trophy, Play, Gift, Laptop, Coffee, Zap, TreePine, Rocket, Terminal } from 'lucide-react';
import { clsx } from 'clsx';
import { Lesson, UserState, Theme } from '../../types';
import { THEMES } from '../../constants';
import { playSound } from '../../utils/audio';

interface DashboardViewProps {
    lessons: Lesson[];
    user: UserState;
    theme: Theme;
    onStartLesson: (id: string) => void;
}

// Decorative Props to fill the empty space
const SideProp = ({ type, side, delay }: { type: string, side: 'left' | 'right', delay: number }) => {
    const [wobble, setWobble] = React.useState(false);

    const handleClick = () => {
        setWobble(true);
        playSound('pop');
        setTimeout(() => setWobble(false), 500);
    };

    const Icon = () => {
        switch (type) {
            case 'tree': return <TreePine size={40} className="text-green-600/60" fill="currentColor" />;
            case 'chest': return <Gift size={32} className="text-yellow-600/60" fill="currentColor" />;
            case 'laptop': return <Laptop size={32} className="text-gray-600/60" fill="currentColor" />;
            case 'coffee': return <Coffee size={28} className="text-amber-700/60" fill="currentColor" />;
            case 'rocket': return <Rocket size={32} className="text-red-500/60" fill="currentColor" />;
            case 'code': return <Terminal size={32} className="text-blue-500/60" fill="currentColor" />;
            default: return <Zap size={24} className="text-yellow-400/60" fill="currentColor" />;
        }
    };

    return (
        <div 
            onClick={handleClick}
            className={clsx(
                "absolute top-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110",
                side === 'left' ? "-left-16 md:-left-24" : "-right-16 md:-right-24",
                wobble ? "animate-bounce" : "animate-float"
            )}
            style={{ animationDelay: `${delay}s` }}
        >
            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm border-2 border-white/20 shadow-sm">
                <Icon />
            </div>
        </div>
    );
};

export const DashboardView: React.FC<DashboardViewProps> = ({ lessons, user, theme, onStartLesson }) => {
    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-12 relative scroll-smooth pb-32 bg-transparent z-10 custom-scrollbar">
            <div className="max-w-md mx-auto space-y-8 relative">
                
                {lessons.map((lesson, index) => {
                    const isCompleted = user.completedLessons.includes(lesson.id);
                    const isLocked = !user.adminUnlocked && index > 0 && !user.completedLessons.includes(lessons[index - 1].id);
                    const isCurrent = !isLocked && !isCompleted;
                    const prevLesson = lessons[index-1];
                    const isNewChapter = index === 0 || (prevLesson && prevLesson.chapter !== lesson.chapter);
                    
                    // Determine zig-zag position (-1, 0, 1) for visual variety
                    // We use a sine wave pattern for the path: Center -> Right -> Center -> Left
                    const offsetMap = [0, 20, 0, -20]; 
                    const xOffset = offsetMap[index % 4];
                    const isRight = xOffset > 0;
                    const isLeft = xOffset < 0;

                    // Decoration logic: Add a prop every few items on the empty side
                    const showDecor = index % 2 === 0;
                    const decorType = ['tree', 'code', 'laptop', 'rocket', 'coffee', 'chest'][index % 6];
                    const decorSide = isRight ? 'left' : 'right'; // Place opposite to the node

                    return (
                        <div key={lesson.id} className="relative flex flex-col items-center">
                            
                            {/* Chapter Heading */}
                            {isNewChapter && (
                                <div className="text-center mb-12 mt-8 animate-slide-up w-full relative">
                                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                        <div className="w-full border-t-2 border-[var(--color-text)] opacity-10"></div>
                                    </div>
                                    <h3 className="relative text-sm font-black uppercase tracking-widest text-[var(--color-primary)] bg-white px-6 py-2 rounded-2xl border-b-4 border-[var(--color-primary)]/20 shadow-sm inline-block mx-auto z-10">
                                        {lesson.chapter}
                                    </h3>
                                </div>
                            )}

                            {/* Connection Line (The Path) */}
                            {index < lessons.length - 1 && (
                                <div 
                                    className="absolute top-1/2 left-1/2 w-4 bg-[#E5E7EB] -z-10 origin-top rounded-full"
                                    style={{ 
                                        height: '140px', // connect to next
                                        transform: `
                                            translateX(${xOffset}px) 
                                            rotate(${offsetMap[(index+1)%4] - xOffset > 0 ? '-15deg' : offsetMap[(index+1)%4] - xOffset < 0 ? '15deg' : '0deg'}) 
                                            translateY(20px)
                                        `,
                                        border: '2px solid rgba(0,0,0,0.05)'
                                    }} 
                                />
                            )}

                            {/* The Lesson Node */}
                            <div 
                                className={clsx("relative group transition-transform duration-500", isCurrent && "scale-105")} 
                                style={{ transform: `translateX(${xOffset}px)` }}
                            >
                                {/* Interactive Side Prop (Decoration) */}
                                {showDecor && <SideProp type={decorType} side={decorSide} delay={index * 0.2} />}

                                {/* Bounce animation wrapper for current item */}
                                <div className={clsx("relative", isCurrent && "animate-bounce-slow")}>
                                    
                                    {/* The Button */}
                                    <button 
                                        onClick={() => !isLocked && onStartLesson(lesson.id)}
                                        disabled={isLocked}
                                        className={clsx(
                                            "w-20 h-20 md:w-24 md:h-24 rounded-[2rem] flex items-center justify-center border-b-[6px] transition-all duration-200 relative transform shadow-xl z-10",
                                            isCompleted ? "bg-[var(--color-secondary)] border-[#D4A017]" : 
                                            isLocked ? "bg-gray-200 border-gray-300 cursor-not-allowed opacity-80" : 
                                            (lesson.type === 'quiz' || lesson.type === 'test') ? "bg-[var(--color-accent)] border-[#C03535] hover:brightness-110" :
                                            "bg-[var(--color-primary)] border-[#3A7C95] hover:translate-y-1 hover:border-b-0 active:scale-95"
                                        )}
                                    >
                                        {/* Shine effect */}
                                        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
                                        
                                        {/* Icon */}
                                        <div className="relative z-10 transform transition-transform group-hover:scale-110">
                                            {isCompleted ? <CheckCircle size={36} className="text-white drop-shadow-md" strokeWidth={3} /> : 
                                            isLocked ? <Lock size={28} className="text-gray-400 drop-shadow-sm" /> :
                                            (lesson.type === 'quiz' || lesson.type === 'test') ? <Trophy size={36} className="text-white drop-shadow-md animate-pulse" /> :
                                            <Play size={36} fill="white" className="text-white ml-1 drop-shadow-md" />}
                                        </div>

                                        {/* Stars for completed */}
                                        {isCompleted && (
                                            <div className="absolute -top-1 -right-1 bg-white text-[var(--color-secondary)] rounded-full p-1 shadow-sm border border-gray-100">
                                                <div className="w-3 h-3 bg-current rounded-full animate-ping" />
                                            </div>
                                        )}
                                    </button>
                                    
                                    {/* Pop-up Tooltip */}
                                    <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-xl shadow-xl border border-gray-100 text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0 z-20 text-gray-700 pointer-events-none">
                                        {lesson.title}
                                        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white transform rotate-45 border-t border-l border-gray-100"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                
                {/* End of Path Mascot */}
                <div className="flex justify-center mt-12 mb-24 opacity-50 grayscale hover:grayscale-0 transition-all">
                    <div className="text-center">
                        <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-gray-300 border-dashed">
                             <Lock size={32} className="text-gray-400" />
                        </div>
                        <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">More coming soon</p>
                    </div>
                </div>
            </div>
        </div>
    );
};