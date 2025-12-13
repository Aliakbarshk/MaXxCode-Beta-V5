import React, { useState, useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import { Check, X, Star, Terminal, Smile, Frown, Award, HelpCircle, AlertTriangle, RefreshCw, ChevronRight, BookOpen, Crown, LayoutList, MessageSquare } from 'lucide-react';
import { Theme, QuizQuestion, TestItem } from '../types';
import { THEMES, CHEATSHEETS, LEADERBOARD_DATA } from '../constants';

// --- BUTTONS ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className,
  ...props 
}) => {
  const baseStyles = "font-bold rounded-2xl transition-all duration-200 transform active:scale-95 flex items-center justify-center gap-2 border-b-4 active:border-b-0 active:translate-y-1 relative overflow-hidden group";
  
  // Use arbitrary values with var() to support dynamic theming
  const variants = {
    primary: "bg-[var(--color-primary)] text-white border-black/20 hover:brightness-110 hover:shadow-lg",
    secondary: "bg-[var(--color-secondary)] text-[var(--color-text)] border-black/20 hover:brightness-110 hover:shadow-lg",
    accent: "bg-[var(--color-accent)] text-white border-black/20 hover:brightness-110 hover:shadow-lg",
    success: "bg-green-600 text-white border-green-800 hover:bg-green-500 hover:shadow-lg",
    danger: "bg-red-500 text-white border-red-700 hover:bg-red-600 hover:shadow-lg",
    outline: "bg-transparent border-2 border-current text-inherit hover:bg-black/5 border-b-4",
    ghost: "bg-transparent text-inherit hover:bg-black/5 border-transparent active:border-none shadow-none active:translate-y-0",
  };

  const sizes = {
    sm: "px-3 py-1 text-sm border-b-2",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button 
      className={clsx(
        baseStyles, 
        variants[variant], 
        sizes[size], 
        fullWidth && "w-full",
        className
      )} 
      {...props}
    >
      {/* Shine effect on hover */}
      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out skew-x-12" />
      <div className="relative flex items-center gap-2">
        {children}
      </div>
    </button>
  );
};

// --- PROGRESS BAR ---
export const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
  return (
    <div className="w-full h-4 bg-gray-200/50 rounded-full overflow-hidden relative shadow-inner">
      <div 
        className="h-full bg-[var(--color-secondary)] transition-all duration-500 ease-out rounded-full relative overflow-hidden"
        style={{ width: `${Math.max(5, progress)}%` }} 
      >
        <div className="absolute inset-0 animate-shimmer" />
      </div>
      <div className="absolute top-1 left-2 right-2 h-1 bg-white/20 rounded-full" />
    </div>
  );
};

// --- CARD ---
export const Card: React.FC<{ children: React.ReactNode; className?: string; theme?: Theme }> = ({ children, className, theme = 'light' }) => {
  const themeStyles = THEMES[theme];
  return (
    <div 
        className={clsx("rounded-3xl border-2 p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden", className)}
        style={{ 
            backgroundColor: themeStyles.card, 
            borderColor: 'var(--color-bg)', // Dynamic border based on bg for subtle blend or contrast
            color: themeStyles.text
        }}
    >
       {/* Subtle top highlight for depth */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/10" />
      {children}
    </div>
  );
};

// --- CONSOLE ---
export const Console: React.FC<{ output: string[]; theme?: Theme }> = ({ output, theme = 'light' }) => {
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [output]);

    return (
        <div className="bg-[#1E1E1E] rounded-xl font-mono text-sm h-full overflow-hidden border-2 border-gray-700 shadow-2xl flex flex-col">
            {/* Retro Traffic Light Header */}
            <div className="bg-[#2D2D2D] p-2 flex items-center gap-2 border-b border-gray-700 px-4">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] shadow-sm"></div>
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] shadow-sm"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] shadow-sm"></div>
                </div>
                <div className="ml-auto flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-wider">
                    <Terminal size={12} /> Console
                </div>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
                {output.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-30 text-center text-gray-400">
                        <Terminal size={48} className="mb-2" />
                        <span>Ready to run...</span>
                    </div>
                ) : (
                    <div className="flex flex-col gap-1">
                        {output.map((line, i) => (
                            <div key={i} className="text-[#AAB99A] whitespace-pre-wrap animate-slide-up break-words font-medium">
                                <span className="text-gray-600 mr-2 select-none">$</span>{line}
                            </div>
                        ))}
                         <div className="w-2 h-4 bg-gray-500 animate-pulse mt-1" />
                         <div ref={endRef} />
                    </div>
                )}
            </div>
        </div>
    );
};

// --- MODAL ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  type?: 'success' | 'info';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, type = 'info' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl transform animate-pop relative overflow-hidden max-h-[90vh] overflow-y-auto border-4 border-white ring-4 ring-black/5">
        {/* Background decoration */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-transparent to-black/5 rounded-full" />
        
        {type === 'success' && (
           <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 to-emerald-400" />
        )}
        <div className="flex justify-between items-center mb-6 relative z-10">
          <h2 className={clsx("text-2xl font-black tracking-tight", type === 'success' ? "text-green-600" : "text-[var(--color-primary)]")}>
            {title}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- BADGE ---
export const BadgeItem: React.FC<{ icon: string; name: string; earned?: boolean; color: string }> = ({ icon, name, earned, color }) => {
    return (
        <div className={clsx(
            "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 relative group overflow-hidden", 
            earned ? "opacity-100 bg-white hover:shadow-lg hover:-translate-y-1" : "opacity-50 grayscale bg-gray-50 border-dashed"
        )}
            style={{ borderColor: earned ? color : '#E5E7EB' }}
        >
            {earned && (
                 <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent opacity-50 pointer-events-none" />
            )}
            <div className={clsx("text-4xl relative z-10", earned && "animate-float")}>{icon}</div>
            <span className="font-bold text-sm text-center text-gray-600 relative z-10">{name}</span>
            {earned && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
            )}
        </div>
    )
}

// --- QUIZ VIEW ---
interface QuizViewProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
  theme: Theme;
}

export const QuizView: React.FC<QuizViewProps> = ({ questions, onComplete, theme }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleSelect = (idx: number) => {
    if (showExplanation) return;
    setSelectedOption(idx);
  };

  const handleCheck = () => {
    if (selectedOption === null) return;
    const isCorrect = selectedOption === questions[currentQ].correctIndex;
    if (isCorrect) setScore(s => s + 1);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(c => c + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
      onComplete(score + (selectedOption === questions[currentQ].correctIndex ? 0 : 0)); 
    }
  };

  const currentQuestion = questions[currentQ];
  const themeStyles = THEMES[theme];

  if (isFinished) {
     return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-pop relative">
           <div className="absolute inset-0 bg-pattern-dots opacity-10 pointer-events-none" />
           <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6 shadow-inner animate-float">
               <Award size={64} className="text-[#FACE68]" />
           </div>
           <h2 className="text-4xl font-black mb-2 text-[var(--color-primary)]">Quiz Finished!</h2>
           <p className="text-xl opacity-70 mb-8 font-medium">You scored <span className="font-bold text-[var(--color-primary)] text-2xl">{score}</span> / {questions.length}</p>
           <Button onClick={() => onComplete(score)} size="lg" className="shadow-xl">Done</Button>
        </div>
     );
  }

  return (
    <div className="max-w-2xl mx-auto w-full h-full flex flex-col justify-center relative z-10">
      <div className="mb-8 flex items-center justify-between">
         <span className="font-bold opacity-50 uppercase tracking-widest text-xs bg-gray-100 px-3 py-1 rounded-full text-black">Question {currentQ + 1} / {questions.length}</span>
         <span className="font-black text-[var(--color-primary)] bg-white px-3 py-1 rounded-full shadow-sm">Score: {score}</span>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold mb-8 leading-tight drop-shadow-sm" style={{ color: themeStyles.text }}>
        {currentQuestion.question}
      </h2>

      <div className="space-y-4">
        {currentQuestion.options.map((opt, idx) => {
          let stateStyles = "border-gray-200 hover:border-[var(--color-primary)] hover:bg-white/50";
          if (showExplanation) {
             if (idx === currentQuestion.correctIndex) stateStyles = "bg-green-100 border-green-500 text-green-900 shadow-md transform scale-[1.02]";
             else if (idx === selectedOption) stateStyles = "bg-red-100 border-red-500 text-red-900";
             else stateStyles = "opacity-50 border-gray-200 grayscale";
          } else if (selectedOption === idx) {
             stateStyles = "bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-md transform scale-[1.02]";
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={clsx(
                "w-full p-5 rounded-2xl border-2 text-left font-medium transition-all duration-300 flex items-center justify-between group relative overflow-hidden",
                stateStyles
              )}
            >
              <span className="relative z-10">{opt}</span>
              {showExplanation && idx === currentQuestion.correctIndex && <Check className="text-green-600 relative z-10"/>}
              {showExplanation && idx === selectedOption && idx !== currentQuestion.correctIndex && <X className="text-red-500 relative z-10"/>}
            </button>
          )
        })}
      </div>

      {showExplanation && (
        <div className="mt-6 p-5 bg-blue-50 border-l-4 border-[var(--color-primary)] rounded-r-2xl animate-slide-up shadow-sm">
           <h4 className="font-bold text-[var(--color-primary)] mb-2 flex items-center gap-2"><HelpCircle size={18}/> Explanation</h4>
           <p className="text-gray-700 text-sm leading-relaxed">{currentQuestion.explanation}</p>
        </div>
      )}

      <div className="mt-8 flex justify-end">
        {!showExplanation ? (
          <Button onClick={handleCheck} disabled={selectedOption === null} fullWidth size="lg">Check Answer</Button>
        ) : (
          <Button onClick={handleNext} variant="success" fullWidth size="lg">Next Question <ChevronRight size={20}/></Button>
        )}
      </div>
    </div>
  );
};

// --- CHAPTER TEST VIEW ---
interface ChapterTestProps {
    items: TestItem[];
    passThreshold: number;
    onComplete: (passed: boolean) => void;
    onRetry: () => void;
    theme: Theme;
}

export const ChapterTestView: React.FC<ChapterTestProps> = ({ items, passThreshold, onComplete, onRetry, theme }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, boolean>>({});
    const [userCode, setUserCode] = useState("");
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [finalState, setFinalState] = useState<'playing' | 'passed' | 'failed' | 'checking'>('playing');

    const currentItem = items[currentIndex];
    
    // Robust Code Validation
    const handleCodeSubmit = () => {
        let passed = false;
        
        if (currentItem.solutionCode) {
            // Normalize: remove quotes variation, trim, remove whitespace around symbols
            const normalize = (str: string) => str
                .replace(/["']/g, "'") // Uniform quotes (single)
                .replace(/\s+/g, ' ') // Collapse multiple spaces
                .replace(/\s*([=+\-*/(),:\[\]{}])\s*/g, '$1') // aggressive whitespace stripping around operators
                .trim();

            const userNorm = normalize(userCode);
            const solNorm = normalize(currentItem.solutionCode);
            
            // Check for inclusion or exact match. 
            // We use includes because user might add extra print statements for debugging.
            passed = userNorm.includes(solNorm);
            
            // Fallback: If normalization is too aggressive, check simple quote variation
            if (!passed) {
                 const simpleUser = userCode.trim().replace(/"/g, "'");
                 const simpleSol = currentItem.solutionCode.trim().replace(/"/g, "'");
                 passed = simpleUser.includes(simpleSol);
            }

        } else {
            // Fallback if no solution code provided (rare)
            passed = userCode.trim().length > 5;
        }
        
        setAnswers(prev => ({ ...prev, [currentIndex]: passed }));
        moveToNext();
    };

    const handleMCQSubmit = () => {
        if (selectedOption === null) return;
        const passed = selectedOption === currentItem.correctIndex;
        setAnswers(prev => ({ ...prev, [currentIndex]: passed }));
        setSelectedOption(null);
        moveToNext();
    };

    const moveToNext = () => {
        if (currentIndex < items.length - 1) {
            setCurrentIndex(c => c + 1);
            setUserCode("");
        } else {
            finishTest();
        }
    };

    const finishTest = () => {
        setTimeout(() => {
            setFinalState('checking');
        }, 0);
    };

    if (finalState === 'checking') {
        const correctCount = Object.values(answers).filter(Boolean).length;
        const score = correctCount / items.length;
        const passed = score >= passThreshold;
        setFinalState(passed ? 'passed' : 'failed');
        return null;
    }

    if (finalState === 'passed') {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-pop bg-green-50/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-pattern-grid opacity-5 pointer-events-none" />
                <div className="bg-green-100 p-6 rounded-full mb-6 text-green-600 border-4 border-green-200 shadow-xl animate-float">
                    <Award size={64} />
                </div>
                <h2 className="text-4xl font-black mb-2 text-green-800">Chapter Passed!</h2>
                <p className="text-xl text-green-700 mb-8 max-w-md">You've mastered the concepts. You are ready for the next level.</p>
                <Button onClick={() => onComplete(true)} variant="success" size="lg" className="shadow-xl">Continue Journey</Button>
            </div>
        );
    }

    if (finalState === 'failed') {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-pop bg-red-50/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-pattern-grid opacity-5 pointer-events-none" />
                <div className="bg-red-100 p-6 rounded-full mb-6 text-red-600 border-4 border-red-200 shadow-xl">
                    <AlertTriangle size={64} />
                </div>
                <h2 className="text-4xl font-black mb-2 text-red-800">Test Failed</h2>
                <p className="text-xl text-red-700 mb-8 max-w-md">You need {passThreshold * 100}% to pass. Review the chapter concepts and try again.</p>
                <div className="flex gap-4">
                    <Button onClick={onRetry} variant="outline">Review Chapter</Button>
                    <Button onClick={() => { 
                        setCurrentIndex(0); 
                        setAnswers({}); 
                        setFinalState('playing'); 
                    }} variant="danger">Retry Test</Button>
                </div>
            </div>
        );
    }

    const progress = ((currentIndex) / items.length) * 100;

    return (
        <div className="max-w-3xl mx-auto w-full h-full flex flex-col p-6 relative z-10">
            <div className="mb-6 md:mb-8">
                <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-gray-400 uppercase text-xs tracking-widest flex items-center gap-2"><Terminal size={12}/> Chapter Test</span>
                    <span className="font-bold text-[var(--color-primary)] bg-white px-2 py-1 rounded-lg shadow-sm border border-gray-100">{currentIndex + 1} / {items.length}</span>
                </div>
                <ProgressBar progress={progress} />
            </div>

            <Card className="flex-1 flex flex-col justify-center mb-6 md:mb-8 border-t-8 !border-t-[var(--color-primary)] shadow-xl" theme={theme}>
                <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">{currentItem.question}</h3>
                
                {currentItem.type === 'mcq' && (
                    <div className="space-y-3">
                        {currentItem.options?.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedOption(idx)}
                                className={clsx(
                                    "w-full p-4 md:p-5 rounded-xl border-2 text-left font-medium transition-all hover:bg-gray-50 flex items-center justify-between group",
                                    selectedOption === idx ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white ring-4 ring-black/5" : "border-gray-200"
                                )}
                            >
                                {opt}
                                {selectedOption === idx && <div className="w-4 h-4 rounded-full bg-white animate-pop" />}
                            </button>
                        ))}
                    </div>
                )}

                {currentItem.type === 'code' && (
                    <div className="flex flex-col gap-4 flex-1 min-h-[200px]">
                        <textarea
                            value={userCode}
                            onChange={(e) => setUserCode(e.target.value)}
                            className="flex-1 w-full bg-[#1E1E1E] text-[#D4D4D4] p-6 rounded-xl font-mono text-sm resize-none focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/50 border-2 border-gray-700"
                            placeholder={currentItem.initialCode || "Type your code here..."}
                            spellCheck={false}
                        />
                    </div>
                )}
            </Card>

            <div className="flex justify-end pb-safe">
                {currentItem.type === 'mcq' ? (
                    <Button onClick={handleMCQSubmit} disabled={selectedOption === null} size="lg" fullWidth>Next Question <ChevronRight size={20}/></Button>
                ) : (
                    <Button onClick={handleCodeSubmit} disabled={userCode.length < 2} size="lg" fullWidth>Submit Code <ChevronRight size={20}/></Button>
                )}
            </div>
        </div>
    );
};

// --- LEADERBOARD VIEW ---
export const LeaderboardView: React.FC<{ theme: Theme }> = ({ theme }) => {
    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-black mb-8 text-[var(--color-primary)] flex items-center gap-2 drop-shadow-sm">
                <Crown className="text-[var(--color-secondary)]" size={32} /> Leaderboard
            </h1>
            <div className="space-y-4">
                {LEADERBOARD_DATA.map((user, idx) => (
                    <div key={user.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-200 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md relative overflow-hidden group">
                        {/* Gradient Flash */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700" />
                        
                        <div className="font-black text-2xl text-gray-300 w-8">{idx + 1}</div>
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl shadow-inner border border-gray-200">
                            {user.badge}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-black">{user.name}</h3>
                            <div className="h-1.5 w-24 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                <div className="h-full bg-[var(--color-primary)]" style={{width: `${Math.random() * 100}%`}}></div>
                            </div>
                        </div>
                        <div className="font-black text-[var(--color-primary)] bg-gray-50 px-3 py-1 rounded-full">{user.xp} XP</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- CHEATSHEET VIEW ---
export const CheatsheetView: React.FC<{ theme: Theme }> = ({ theme }) => {
    const [lang, setLang] = useState<'python' | 'javascript'>('python');
    return (
        <div className="p-6 max-w-4xl mx-auto pb-24">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-black text-[var(--color-primary)] flex items-center gap-2 drop-shadow-sm">
                    <BookOpen size={32} /> Resources
                </h1>
                <div className="flex bg-white/50 rounded-xl p-1 shadow-sm border border-gray-200">
                    <button onClick={() => setLang('python')} className={clsx("px-4 py-2 rounded-lg font-bold text-sm transition-all", lang === 'python' ? "bg-[var(--color-primary)] text-white shadow-sm" : "text-gray-500 hover:text-gray-700")}>Python</button>
                    <button onClick={() => setLang('javascript')} className={clsx("px-4 py-2 rounded-lg font-bold text-sm transition-all", lang === 'javascript' ? "bg-[var(--color-secondary)] text-black shadow-sm" : "text-gray-500 hover:text-gray-700")}>JS</button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {CHEATSHEETS[lang].map((sheet, idx) => (
                    <Card key={idx} theme={theme} className="hover:shadow-xl transition-all border-t-4 !border-t-[var(--color-primary)]">
                        <h3 className="font-bold text-xl mb-4 text-[var(--color-primary)] border-b pb-2 flex items-center justify-between">
                            {sheet.title}
                            <Terminal size={16} className="opacity-30"/>
                        </h3>
                        <pre className="bg-[#1E1E1E] text-[#AAB99A] p-4 rounded-xl font-mono text-sm overflow-x-auto shadow-inner border border-gray-700">
                            {sheet.content}
                        </pre>
                    </Card>
                ))}
            </div>
        </div>
    );
};

// --- MAX AVATAR ---
export const MaxAvatar: React.FC<{ mood: 'happy' | 'neutral' | 'thinking' | 'excited' }> = ({ mood }) => {
   // Revised cleaner robot design with hover float animation
   return (
      <div className="w-24 h-24 relative transition-transform hover:scale-110 cursor-pointer animate-float">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg filter hover:brightness-110 transition-all">
             {/* Robot Head */}
             <rect x="20" y="20" width="60" height="50" rx="10" fill="var(--color-primary, #5A9CB5)" />
             {/* Screen/Face Area */}
             <rect x="25" y="30" width="50" height="30" rx="5" fill="#1F2937" />
             
             {/* Eyes */}
             {mood === 'thinking' ? (
                 <>
                    <rect x="35" y="40" width="10" height="4" rx="2" fill="var(--color-secondary, #FACE68)" className="animate-pulse" />
                    <rect x="55" y="40" width="10" height="4" rx="2" fill="var(--color-secondary, #FACE68)" className="animate-pulse" />
                 </>
             ) : mood === 'excited' || mood === 'happy' ? (
                 <>
                    <circle cx="40" cy="42" r="4" fill="var(--color-secondary, #FACE68)" />
                    <circle cx="60" cy="42" r="4" fill="var(--color-secondary, #FACE68)" />
                    {/* Happy curve */}
                    <path d="M 40 50 Q 50 55 60 50" stroke="var(--color-secondary, #FACE68)" strokeWidth="2" fill="none" />
                 </>
             ) : (
                 <>
                    <circle cx="40" cy="42" r="3" fill="var(--color-secondary, #FACE68)" />
                    <circle cx="60" cy="42" r="3" fill="var(--color-secondary, #FACE68)" />
                 </>
             )}

             {/* Antenna */}
             <line x1="50" y1="20" x2="50" y2="10" stroke="#1F2937" strokeWidth="3" />
             <circle cx="50" cy="8" r="4" fill="var(--color-accent, #FA6868)" className={mood === 'thinking' ? 'animate-ping' : ''} />
             
             {/* Neck/Body Hint */}
             <path d="M 35 70 L 35 75 Q 50 80 65 75 L 65 70" fill="#727D73" />
          </svg>
      </div>
   );
};