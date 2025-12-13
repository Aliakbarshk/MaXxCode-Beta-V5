import React, { useState } from 'react';
import { X, RotateCcw, MonitorPlay, CheckCircle, ChevronRight, BrainCircuit, Volume2, Terminal, Play, FileText, Target } from 'lucide-react';
import { clsx } from 'clsx';
import { Lesson, UserState, Theme, Translation, Language } from '../../types';
import { THEMES } from '../../constants';
import { playSound, speakText } from '../../utils/audio';
import { Button, Card, Console, Modal, MaxAvatar, QuizView, ChapterTestView } from '../UIComponents';
import { AIChat } from '../AIChat';

interface LessonViewProps {
    lesson: Lesson;
    user: UserState;
    theme: Theme;
    t: Translation;
    activeLanguage: Language;
    onExit: () => void;
    onComplete: (score?: number, showModal?: boolean) => void;
    onNextLesson: () => void;
    onUpdateUser: (updates: Partial<UserState>) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({ 
    lesson, user, theme, t, activeLanguage, onExit, onComplete, onNextLesson, onUpdateUser 
}) => {
    const [code, setCode] = useState(lesson.content.initialCode || '');
    const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
    const [lessonFeedback, setLessonFeedback] = useState<'none' | 'success' | 'error'>('none');
    const [showMobileConsole, setShowMobileConsole] = useState(false);
    const [lessonContentLang, setLessonContentLang] = useState<'en' | 'hi' | 'hinglish'>('en');
    const [showCompletionModal, setShowCompletionModal] = useState(false);

    const themeStyles = THEMES[theme];

    // Handlers
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

    const checkCode = () => {
        setLessonFeedback('success');
        playSound('success');
    };

    const handleLessonCompletion = () => {
        onComplete(25, true);
        setShowCompletionModal(true);
    };

    if (lesson.type === 'quiz') {
        return <QuizView questions={lesson.content.questions || []} onComplete={() => onComplete(50)} theme={theme} />;
    }

    if (lesson.type === 'test') {
        return (
            <div className="h-[100dvh] flex flex-col" style={{ backgroundColor: themeStyles.bg, color: themeStyles.text }}>
                <div className="p-4 flex items-center justify-between border-b border-black/5 bg-opacity-90 backdrop-blur z-10" style={{backgroundColor:themeStyles.bg}}>
                    <button onClick={onExit} className="p-2 hover:bg-black/5 rounded-full"><X className="opacity-60" /></button>
                    <div className="font-bold text-[var(--color-primary)] uppercase tracking-wider text-sm">{lesson.title}</div>
                    <div className="w-8"></div>
                </div>
                
                <ChapterTestView 
                    items={lesson.content.testItems || []} 
                    passThreshold={lesson.content.passThreshold || 0.8}
                    onComplete={(passed) => { if(passed) onComplete(50, false); }}
                    onRetry={() => {}}
                    theme={theme}
                />
            </div>
        );
    }

    // Standard Code Lesson
    const content = lesson.content;
    const getLocalizedText = (en?: string, hi?: string, hinglish?: string) => {
        if (lessonContentLang === 'hi' && hi) return hi;
        if (lessonContentLang === 'hinglish' && hinglish) return hinglish;
        return en || "";
    };

    const intro = getLocalizedText(content.intro, content.intro_hi, content.intro_hinglish);
    const instructions = getLocalizedText(content.instructions, content.instructions_hi, content.instructions_hinglish);

    return (
        <div className="h-[100dvh] flex flex-col md:flex-row overflow-hidden relative" style={{ backgroundColor: themeStyles.bg }}>
                {/* Mobile Header */}
                <div className="md:hidden p-4 flex items-center justify-between border-b border-gray-200 shadow-sm" style={{ backgroundColor: themeStyles.card }}>
                <button onClick={onExit}><X className="text-gray-400" /></button>
                <div className="font-bold text-[var(--color-primary)]">Lesson {lesson.order}</div>
                <div className="w-8"></div>
            </div>

            {/* Left Panel: Instructions */}
            <div className="w-full md:w-1/4 p-6 md:p-8 overflow-y-auto border-r border-black/5 flex flex-col gap-6" style={{ backgroundColor: themeStyles.card, color: themeStyles.text }}>
                <div className="hidden md:flex items-center justify-between mb-4">
                        <button onClick={onExit} className="p-2 hover:bg-gray-200/50 rounded-full transition-colors"><X className="text-gray-400" /></button>
                        <div className="text-xs font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-1 rounded">Lesson {lesson.order}</div>
                </div>
                
                <div className="relative flex flex-col gap-6">
                        <div className="flex gap-1 mb-4 p-1 bg-gray-100/50 rounded-lg w-max border border-gray-200 shadow-sm">
                        <button onClick={() => setLessonContentLang('en')} className={clsx("px-2 py-1 text-xs font-bold rounded transition-all", lessonContentLang === 'en' ? "bg-white shadow text-[var(--color-primary)]" : "text-gray-400 hover:text-gray-600")}>EN</button>
                        <button onClick={() => setLessonContentLang('hi')} className={clsx("px-2 py-1 text-xs font-bold rounded transition-all", lessonContentLang === 'hi' ? "bg-white shadow text-[var(--color-primary)]" : "text-gray-400 hover:text-gray-600")}>HI</button>
                        <button onClick={() => setLessonContentLang('hinglish')} className={clsx("px-2 py-1 text-xs font-bold rounded transition-all", lessonContentLang === 'hinglish' ? "bg-white shadow text-[var(--color-primary)]" : "text-gray-400 hover:text-gray-600")}>HING</button>
                        </div>

                    <div>
                        <h1 className="text-2xl font-black text-[var(--color-primary)] mb-2">{lesson.title}</h1>
                        <p className="opacity-80 leading-relaxed font-medium">{lesson.description}</p>
                    </div>
                    
                    {/* SECTION 1: CONCEPT */}
                    <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><BrainCircuit size={64}/></div>
                            <div className="flex justify-between items-start mb-2 relative z-10">
                            <h3 className="font-bold text-[var(--color-primary)] flex items-center gap-2">
                                <MaxAvatar mood="happy" /> Concept
                            </h3>
                            <button onClick={() => speakText(intro, lessonContentLang === 'hi' ? 'hi' : 'en')} className="text-gray-400 hover:text-[var(--color-primary)] transition-colors">
                                <Volume2 size={18} />
                            </button>
                            </div>
                            <p className="text-gray-700 leading-relaxed text-sm relative z-10">
                            {intro}
                            </p>
                    </div>

                    {/* SECTION 2: QUICK SUMMARY */}
                    {content.summary && content.summary.length > 0 && (
                        <div className="bg-yellow-50/50 p-5 rounded-2xl border border-yellow-100 shadow-sm relative overflow-hidden group">
                            <h3 className="font-bold text-[var(--color-secondary)] flex items-center gap-2 mb-3">
                                <FileText size={20} /> Quick Summary
                            </h3>
                            <ul className="list-disc list-inside space-y-1 text-sm font-medium text-gray-700">
                                {content.summary.map((point, i) => (
                                    <li key={i} className="leading-relaxed">{point}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* SECTION 3: MISSION / TASK */}
                    <Card theme={theme} className="!p-5 border-l-4 !border-l-[var(--color-secondary)] relative group hover:bg-[#FFFDF5]">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold flex items-center gap-2 text-[var(--color-secondary)]">
                                 <Target size={20} /> Mission
                            </h3>
                            <button onClick={() => speakText(instructions, lessonContentLang === 'hi' ? 'hi' : 'en')} className="text-gray-400 hover:text-[var(--color-secondary)] transition-colors">
                                <Volume2 size={18} />
                            </button>
                        </div>
                        <p className="opacity-90 font-medium">
                            {instructions}
                        </p>
                    </Card>
                </div>
            </div>

            {/* Center: Editor */}
            <div className="flex-1 flex flex-col relative border-r border-black/5">
                <div className="bg-[#1E1E1E] p-2 flex items-center justify-between text-gray-400 text-xs border-b border-[#333]">
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1.5 ml-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-gray-600"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-gray-600"></div>
                            </div>
                            <span className="ml-4 font-mono text-gray-300">{activeLanguage === 'python' ? 'main.py' : 'script.js'}</span>
                        </div>
                </div>

                <textarea
                    value={code}
                    onChange={(e) => {
                        setCode(e.target.value);
                        setLessonFeedback('none');
                    }}
                    className="flex-1 w-full bg-[#1E1E1E] text-[#D4D4D4] p-6 font-mono text-base resize-none focus:outline-none leading-relaxed custom-scrollbar"
                    spellCheck={false}
                />
                
                <div className="hidden md:flex p-4 bg-[#1E1E1E] border-t border-[#333] items-center justify-end gap-3 shadow-[0_-5px_15px_rgba(0,0,0,0.3)] z-10">
                    <Button variant="ghost" onClick={() => setCode(content.initialCode || '')} className="text-gray-400 hover:text-white">
                        <RotateCcw size={16} /> {t.reset}
                    </Button>
                    <Button variant="secondary" onClick={handleRunCode}>
                        <MonitorPlay size={18} /> {t.run}
                    </Button>
                    <Button variant="primary" onClick={checkCode}>
                        <CheckCircle size={18} /> {t.check}
                    </Button>
                </div>
            </div>

            {/* Right: Console (Desktop) */}
            <div className="hidden md:flex w-1/4 flex-col bg-[#1E1E1E] border-l border-[#333]">
                <div className="flex-1 p-4 overflow-hidden">
                    <Console output={consoleOutput} theme={theme} />
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
                    <Console output={consoleOutput} theme={theme} />
                </div>
            </div>

            {/* Mobile Actions */}
            <div className="bg-white p-3 border-t border-gray-200 flex justify-between items-center z-10 md:hidden pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setCode(content.initialCode || '')}><RotateCcw size={18} /></Button>
                    <Button variant="outline" size="sm" onClick={() => setShowMobileConsole(!showMobileConsole)} className={showMobileConsole ? "bg-blue-50 border-blue-200" : ""}><Terminal size={18} /></Button>
                </div>
                <div className="flex gap-2 w-full ml-4">
                        <Button variant="secondary" className="flex-1" onClick={handleRunCode}><Play size={18} /></Button>
                        <Button variant="primary" className="flex-[2]" onClick={checkCode}>{t.check}</Button>
                </div>
            </div>

            {/* Feedback Toast */}
            <div className={clsx(
                "fixed bottom-20 md:bottom-24 left-4 right-4 md:left-auto md:right-8 md:w-96 p-4 transition-all duration-300 z-50",
                lessonFeedback === 'none' ? "translate-y-[150%] opacity-0" : "translate-y-0 opacity-100"
            )}>
                <div className={clsx(
                    "rounded-2xl p-4 shadow-2xl flex items-center justify-between border-l-8 backdrop-blur-md animate-pop",
                    lessonFeedback === 'success' ? "bg-green-50/95 border-green-500 text-green-800" : "bg-red-50/95 border-red-500 text-red-800"
                )}>
                    <div className="flex items-center gap-4">
                        <div className={clsx("w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-md")}>
                            {lessonFeedback === 'success' ? <CheckCircle className="text-green-600" size={28} /> : <X className="text-red-500" size={28} />}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">
                                {lessonFeedback === 'success' ? t.successMsg : t.errorMsg}
                            </h3>
                            {lessonFeedback === 'error' && <p className="text-xs opacity-70">Check the console for hints.</p>}
                        </div>
                    </div>
                    {lessonFeedback === 'success' && (
                            <Button onClick={handleLessonCompletion} variant="success" size="sm" className="ml-4 shadow-lg">
                            Next <ChevronRight size={16} />
                            </Button>
                    )}
                </div>
            </div>

            {/* AI Chat */}
            <AIChat 
                currentCode={code} 
                lessonContext={`Lesson: ${lesson.title}. Concept: ${intro}. Task: ${instructions}.`} 
                appLanguage={user.settings.appLanguage}
                apiKey={user.apiKey}
                isDevMode={user.adminUnlocked}
                onUnlockDevMode={() => onUpdateUser({ adminUnlocked: true })}
                onSetApiKey={(k) => onUpdateUser({ apiKey: k })}
                onTranslateReq={() => setLessonContentLang('hi')}
            />

            {/* Success Modal with Solution and Explanation */}
            <Modal isOpen={showCompletionModal} onClose={onExit} title={t.completedTitle} type="success">
                <div className="flex flex-col items-center text-center gap-4 relative w-full">
                    <div className="scale-125 animate-bounce-slow mb-4">
                        <MaxAvatar mood="excited" />
                    </div>
                    
                    <div className="mb-4">
                            <h3 className="text-2xl font-black text-gray-700">Awesome!</h3>
                            <p className="text-lg text-gray-500 mt-1">You earned <span className="font-bold text-[var(--color-secondary)] bg-yellow-50 px-2 py-1 rounded">+25 XP</span></p>
                    </div>

                    {/* SECTION 4: SOLUTION */}
                    {content.solutionCode && (
                        <div className="w-full text-left bg-gray-900 rounded-xl p-4 border-2 border-gray-700 shadow-inner mb-4">
                            <div className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2 border-b border-gray-700 pb-1">Solution</div>
                            <code className="font-mono text-green-400 text-sm">{content.solutionCode}</code>
                        </div>
                    )}

                    {/* SECTION 5: EXPLANATION */}
                    {content.codeExplanation && (
                        <div className="w-full text-left bg-blue-50 rounded-xl p-4 border border-blue-100 mb-6">
                             <div className="text-xs text-blue-400 uppercase font-bold tracking-wider mb-2 flex items-center gap-1"><BrainCircuit size={12}/> Code Explanation</div>
                             <p className="text-sm text-gray-700 leading-relaxed">{content.codeExplanation}</p>
                        </div>
                    )}

                    <div className="flex gap-2 w-full">
                        <Button fullWidth onClick={onNextLesson} variant="primary" size="lg" className="shadow-xl">{t.nextLesson}</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};