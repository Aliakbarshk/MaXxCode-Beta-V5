import React from 'react';
import { Home, BrainCircuit, Terminal, Gamepad2, User, Settings } from 'lucide-react';
import { clsx } from 'clsx';

interface MobileNavProps {
    view: string;
    setView: (view: any) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ view, setView }) => {
    const NavItem = ({ target, icon: Icon }: { target: string, icon: any }) => (
        <button 
            onClick={() => setView(target)} 
            className={clsx(
                "p-3 rounded-2xl shrink-0 transition-all active:scale-95", 
                view === target 
                    ? "bg-[var(--color-primary)] text-white shadow-inner" 
                    : "text-gray-400"
            )}
        >
            <Icon size={28} />
        </button>
    );

    return (
        <div className="md:hidden bg-white/90 backdrop-blur-md border-t border-gray-200 p-2 flex justify-around items-center sticky bottom-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] overflow-x-auto no-scrollbar">
             <NavItem target="dashboard" icon={Home} />
             <NavItem target="problems" icon={BrainCircuit} />
             <NavItem target="playground" icon={Terminal} />
             <NavItem target="arcade" icon={Gamepad2} />
             <NavItem target="profile" icon={User} />
             <NavItem target="settings" icon={Settings} />
        </div>
    );
};