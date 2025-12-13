import React from 'react';
import { Code2, Zap, Star, LockOpen, Lock } from 'lucide-react';
import { clsx } from 'clsx';
import { Theme, Translation, Language, UserState } from '../../types';
import { THEMES } from '../../constants';
import { playSound } from '../../utils/audio';

interface TopBarProps {
    user: UserState;
    t: Translation;
    theme: Theme;
    activeLanguage: Language;
    setActiveLanguage: (lang: Language) => void;
    onLogoClick: () => void;
    onUnlockClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ 
    user, 
    t, 
    theme, 
    activeLanguage, 
    setActiveLanguage, 
    onLogoClick,
    onUnlockClick
}) => {
    const themeStyles = THEMES[theme];

    return (
        <div className="p-4 flex justify-between items-center border-b border-black/5 sticky top-0 z-10 shadow-sm backdrop-blur-md" 
             style={{ backgroundColor: themeStyles.sidebar + 'E6' }}>
            <div className="md:hidden flex items-center gap-2" onClick={onLogoClick}>
                <Code2 className="text-[var(--color-primary)]" size={24}/>
                <span className="font-black text-[var(--color-primary)]">MaXxCode</span>
            </div>

            <div className="flex items-center gap-2 md:gap-4 ml-auto md:ml-0">
                 <div className="flex p-1 bg-gray-100/50 rounded-xl border border-black/5 backdrop-blur-sm">
                    <button onClick={() => {setActiveLanguage('python'); playSound('click');}} className={clsx("px-3 py-1 rounded-lg text-sm font-bold transition-all", activeLanguage === 'python' ? "bg-[var(--color-primary)] text-white shadow-sm" : "text-gray-400")}>
                        Python
                    </button>
                    <button onClick={() => {setActiveLanguage('javascript'); playSound('click');}} className={clsx("px-3 py-1 rounded-lg text-sm font-bold transition-all", activeLanguage === 'javascript' ? "bg-[var(--color-secondary)] text-black shadow-sm" : "text-gray-400")}>
                        JS
                    </button>
                 </div>
                 
                 <button 
                    onClick={onUnlockClick} 
                    className="p-2 text-gray-400 hover:text-[var(--color-secondary)] transition-colors rounded-xl border border-gray-200 hover:border-[var(--color-secondary)]"
                    title={t.unlockAll}
                 >
                     {user.adminUnlocked ? <LockOpen size={20}/> : <Lock size={20}/>}
                 </button>
            </div>

            <div className="flex gap-4 items-center ml-4">
                <div className="hidden md:flex items-center gap-1 text-[var(--color-secondary)]">
                    <Zap fill="currentColor" size={20} className="animate-pulse" />
                    <span className="font-bold">{user.currentStreak}</span>
                </div>
                <div className="flex items-center gap-1 text-[var(--color-primary)]">
                    <Star fill="currentColor" size={20} className="animate-bounce-slow" />
                    <span className="font-bold">{user.xp}</span>
                </div>
            </div>
        </div>
    );
};