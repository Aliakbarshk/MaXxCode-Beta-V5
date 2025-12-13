import React from 'react';
import { Home, BrainCircuit, Crown, Terminal, Gamepad2, BookOpen, User, Settings, Globe, Code2 } from 'lucide-react';
import { clsx } from 'clsx';
import { Theme, Translation } from '../../types';
import { THEMES } from '../../constants';

interface SidebarProps {
    view: string;
    setView: (view: any) => void;
    t: Translation;
    theme: Theme;
    onLogoClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ view, setView, t, theme, onLogoClick }) => {
    const themeStyles = THEMES[theme];

    const NavButton = ({ target, icon: Icon, label }: { target: string, icon: any, label: string }) => (
        <button 
            onClick={() => setView(target)} 
            className={clsx(
                "flex items-center gap-3 w-full p-3 rounded-xl font-medium transition-all hover:translate-x-1", 
                view === target 
                    ? "bg-[var(--color-primary)] text-white shadow-sm font-bold" 
                    : "text-gray-400 hover:bg-black/5"
            )}
        >
            <Icon size={20} /> {label}
        </button>
    );

    return (
        <div className="hidden md:flex flex-col w-64 p-6 border-r border-black/5 sticky top-0 h-screen shadow-lg z-10" 
             style={{ backgroundColor: themeStyles.sidebar }}>
            <div className="flex items-center gap-2 mb-10 cursor-pointer group" onClick={onLogoClick}>
                <div className="bg-[var(--color-primary)] p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-md">
                    <Code2 className="text-white" size={28}/>
                </div>
                <h1 className="text-2xl font-black tracking-tight text-[var(--color-primary)]">MaXxCode</h1>
            </div>
            
            <div className="space-y-2 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <NavButton target="dashboard" icon={Home} label={t.dashboard} />
                <NavButton target="problems" icon={BrainCircuit} label={t.problems} />
                <NavButton target="leaderboard" icon={Crown} label="Leaderboard" />
                <NavButton target="playground" icon={Terminal} label={t.playground} />
                <NavButton target="arcade" icon={Gamepad2} label={t.arcade} />
                <NavButton target="resources" icon={BookOpen} label="Resources" />
                <NavButton target="profile" icon={User} label={t.profile} />
                <NavButton target="settings" icon={Settings} label={t.settings} />
                
                <a href="https://myfolioali.netlify.app/" target="_blank" rel="noreferrer" className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-black/5 text-gray-400 font-medium transition-colors hover:translate-x-1">
                    <Globe size={20} /> {t.aboutDev}
                </a>
            </div>
            <div className="mt-auto pt-6 border-t border-black/10 text-xs text-gray-500 font-medium">
                {t.developedBy}
            </div>
        </div>
    );
};