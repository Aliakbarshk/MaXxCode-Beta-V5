import React, { useState } from 'react';
import { ArrowLeft, Terminal, RotateCcw, Play, MonitorPlay, X } from 'lucide-react';
import { clsx } from 'clsx';
import { UserState, Theme, Translation, Language } from '../../types';
import { THEMES } from '../../constants';
import { Button, Console } from '../UIComponents';
import { AIChat } from '../AIChat';
import { playSound } from '../../utils/audio';

interface PlaygroundViewProps {
    user: UserState;
    theme: Theme;
    t: Translation;
    activeLanguage: Language;
    setActiveLanguage: (lang: Language) => void;
    onExit: () => void;
    onUpdateUser: (updates: Partial<UserState>) => void;
}

export const PlaygroundView: React.FC<PlaygroundViewProps> = ({ 
    user, theme, t, activeLanguage, setActiveLanguage, onExit, onUpdateUser 
}) => {
    const [code, setCode] = useState('');
    const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
    const [showMobileConsole, setShowMobileConsole] = useState(false);
    const themeStyles = THEMES[theme];

    const handleRunCode = () => {
        playSound('click');
        setConsoleOutput([]);
        const outputLines: string[] = [];
        const originalLog = console.log;

        try {
            console.log = (...args) => {
                const formatted = args.map(a => Array.isArray(a) ? a.toString() : String(a)).join(' ');
                outputLines.push(formatted);
            };

            if (activeLanguage === 'javascript') {
                // eslint-disable-next-line no-eval
                eval(code);
            } else {
                 // Basic Python Transpilation for Demo
                 let jsCode = code
                    .replace(/#.*/g, '') // remove comments
                    .replace(/print\((.*)\)/g, 'console.log($1)') // print -> console.log
                    .replace(/([a-z_][a-z0-9_]*)\s*=\s*(.+)/gi, 'var $1 = $2'); // basic assignment
                 
                 // eslint-disable-next-line no-eval
                 eval(`{ ${jsCode} }`);
            }
        } catch (e: any) {
            outputLines.push(`Error: ${e.message}`);
            playSound('error');
        } finally {
            console.log = originalLog;
            setConsoleOutput([...outputLines]);
            if (window.innerWidth < 768) setShowMobileConsole(true);
        }
    };

    return (
        <div className="h-[100dvh] flex flex-col md:flex-row overflow-hidden relative" style={{ backgroundColor: themeStyles.bg }}>
             <div className="md:hidden p-4 flex items-center justify-between border-b border-gray-200 shadow-sm" style={{ backgroundColor: themeStyles.card }}>
                <button onClick={onExit}><ArrowLeft className="text-gray-400" /></button>
                <div className="font-bold text-[var(--color-primary)]">Playground</div>
                <div className="w-8"></div>
            </div>

            <div className="w-full md:w-1/4 p-6 md:p-8 overflow-y-auto border-r border-black/5 flex flex-col gap-6" style={{ backgroundColor: themeStyles.card, color: themeStyles.text }}>
                 <div className="hidden md:flex items-center justify-between mb-4">
                     <button onClick={onExit} className="p-2 hover:bg-gray-200/50 rounded-full transition-colors"><ArrowLeft className="text-gray-400" /></button>
                     <div className="text-xs font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-1 rounded">Mode</div>
                 </div>
                 <h1 className="text-2xl font-black text-[var(--color-primary)]">{t.playground}</h1>
                 <p className="opacity-80 leading-relaxed font-medium">Experiment with code freely. No rules, just you and the compiler.</p>
                 
                 <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                     <h4 className="font-bold mb-2 flex items-center gap-2 text-sm uppercase tracking-wide"><Terminal size={14}/> Active Environment</h4>
                     <div className="flex gap-2">
                         <button onClick={() => setActiveLanguage('python')} className={clsx("flex-1 py-2 rounded-lg text-sm font-bold border-2 transition-all", activeLanguage === 'python' ? "bg-white border-[var(--color-primary)] text-[var(--color-primary)] shadow-sm" : "border-transparent hover:bg-gray-200/50")}>Python</button>
                         <button onClick={() => setActiveLanguage('javascript')} className={clsx("flex-1 py-2 rounded-lg text-sm font-bold border-2 transition-all", activeLanguage === 'javascript' ? "bg-white border-[var(--color-secondary)] text-black shadow-sm" : "border-transparent hover:bg-gray-200/50")}>JS</button>
                     </div>
                 </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 flex flex-col relative border-r border-black/5">
                 <div className="bg-[#1E1E1E] p-2 flex items-center justify-between text-gray-400 text-xs border-b border-[#333]">
                     <div className="flex items-center gap-2 ml-2">
                          <span className="font-mono text-gray-300">playground.{activeLanguage === 'python' ? 'py' : 'js'}</span>
                     </div>
                 </div>

                 <textarea
                     value={code}
                     onChange={(e) => setCode(e.target.value)}
                     className="flex-1 w-full bg-[#1E1E1E] text-[#D4D4D4] p-6 font-mono text-base resize-none focus:outline-none leading-relaxed custom-scrollbar"
                     spellCheck={false}
                     placeholder="// Write your code here..."
                 />

                 <div className="hidden md:flex p-4 bg-[#1E1E1E] border-t border-[#333] items-center justify-end gap-3 shadow-[0_-5px_15px_rgba(0,0,0,0.3)] z-10">
                     <Button variant="ghost" onClick={() => { setCode(''); setConsoleOutput([]); }} className="text-gray-400 hover:text-white">
                         <RotateCcw size={16} /> Clear
                     </Button>
                     <Button variant="secondary" onClick={handleRunCode}>
                         <MonitorPlay size={18} /> Run Code
                     </Button>
                 </div>
            </div>

            {/* Console (Desktop) */}
            <div className="hidden md:flex w-1/4 flex-col bg-[#1E1E1E] border-l border-[#333]">
               <div className="flex-1 p-4 overflow-hidden">
                   <Console output={consoleOutput} theme={user.settings.theme} />
               </div>
            </div>

            {/* Mobile Console Drawer */}
            <div className={clsx(
                "fixed inset-x-0 bottom-0 z-30 bg-[#1E1E1E] border-t-2 border-[var(--color-primary)] transition-transform duration-300 flex flex-col h-1/2 md:hidden shadow-2xl rounded-t-3xl pb-safe",
                showMobileConsole ? "translate-y-0" : "translate-y-[120%]"
            )}>
                <div className="flex justify-between items-center p-2 bg-[#1E1E1E] border-b border-gray-700 rounded-t-3xl">
                    <span className="text-xs font-bold text-gray-400 pl-4 tracking-widest">CONSOLE OUTPUT</span>
                    <button onClick={() => setShowMobileConsole(false)} className="p-2 text-gray-400"><X size={20}/></button>
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                    <Console output={consoleOutput} theme={user.settings.theme} />
                </div>
            </div>

            {/* Mobile Actions */}
            <div className="bg-white p-3 border-t border-gray-200 flex justify-between items-center z-10 md:hidden pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => { setCode(''); setConsoleOutput([]); }}><RotateCcw size={18} /></Button>
                    <Button variant="outline" size="sm" onClick={() => setShowMobileConsole(!showMobileConsole)} className={showMobileConsole ? "bg-blue-50 border-blue-200" : ""}><Terminal size={18} /></Button>
                </div>
                <div className="flex gap-2 w-full ml-4">
                     <Button variant="secondary" fullWidth onClick={handleRunCode}><Play size={18} /> Run</Button>
                </div>
            </div>
             
             {/* AI Chat */}
            <AIChat 
                currentCode={code} 
                lessonContext={`Playground Mode. Language: ${activeLanguage}.`} 
                appLanguage={user.settings.appLanguage}
                apiKey={user.apiKey}
                isDevMode={user.adminUnlocked}
                onUnlockDevMode={() => onUpdateUser({ adminUnlocked: true })}
                onSetApiKey={(k) => onUpdateUser({ apiKey: k })}
            />
         </div>
    );
};