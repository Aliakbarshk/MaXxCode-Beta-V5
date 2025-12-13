import React, { useState, useEffect } from 'react';
import { Gamepad2, Bug, BrainCircuit, ArrowLeft, Trophy, AlertTriangle, Code2, ListOrdered } from 'lucide-react';
import { Button, MaxAvatar, Card } from './UIComponents';
import { playSound } from '../utils/audio';
import { BUG_HUNTER_LEVELS, SCRAMBLE_LEVELS } from '../constants';
import { clsx } from 'clsx';

// --- GAME: SYNTAX SPRINT ---
const SyntaxSprint: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
    const [gameState, setGameState] = useState<'playing' | 'over'>('playing');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    const [currentQuestion, setCurrentQuestion] = useState(0);

    const questions = [
        { q: "Print in Python", opts: ["print()", "console.log()"], a: 0 },
        { q: "Variable in JS", opts: ["val x", "let x"], a: 1 },
        { q: "List in Python", opts: ["[]", "{}"], a: 0 },
        { q: "Object in JS", opts: ["[]", "{}"], a: 1 },
        { q: "Function in Python", opts: ["func", "def"], a: 1 },
        { q: "True in Python", opts: ["true", "True"], a: 1 },
        { q: "True in JS", opts: ["true", "True"], a: 0 },
        { q: "Comment in Python", opts: ["//", "#"], a: 1 },
        { q: "String in JS", opts: ["'text'", "text"], a: 0 },
        { q: "Loop in Python", opts: ["for i in range(5)", "for(i=0;i<5)"], a: 0 },
    ];

    useEffect(() => {
        if (gameState !== 'playing') return;
        const interval = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) { setGameState('over'); playSound('error'); return 0; }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [gameState]);

    const handleAnswer = (idx: number) => {
        if (idx === questions[currentQuestion].a) {
            setScore(s => s + 20);
            setTimeLeft(t => Math.min(t + 2, 15));
            setCurrentQuestion(c => (c + 1) % questions.length);
            playSound('click');
        } else {
            setGameState('over');
            playSound('error');
        }
    };

    if (gameState === 'over') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center animate-pop">
                <Trophy size={64} className="text-[#FACE68] mb-4" />
                <h2 className="text-3xl font-black mb-2 text-white">Time's Up!</h2>
                <p className="text-xl opacity-70 mb-8 text-white">Score: {score}</p>
                <Button onClick={onFinish} variant="secondary">Back to Menu</Button>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto w-full">
            <div className="flex justify-between mb-8 text-xl font-bold font-mono">
                <span className="text-[#FACE68]">Score: {score}</span>
                <span className={clsx(timeLeft < 5 ? "text-red-500 animate-pulse" : "text-white")}>Time: {timeLeft}s</span>
            </div>
            <div className="bg-[#1E293B] p-8 rounded-3xl border-4 border-[#5A9CB5] mb-8 shadow-[0_0_20px_rgba(90,156,181,0.3)] text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
                    <div className="h-full bg-[#FACE68] transition-all duration-1000" style={{ width: `${(timeLeft/15)*100}%` }}></div>
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-400 uppercase tracking-widest">Select Syntax</h3>
                <h2 className="text-3xl font-black text-white">{questions[currentQuestion].q}</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {questions[currentQuestion].opts.map((opt, i) => (
                    <button key={i} onClick={() => handleAnswer(i)} className="bg-[#334155] hover:bg-[#475569] p-6 rounded-2xl text-xl font-mono font-bold border-b-4 border-[#0F172A] active:border-none active:translate-y-1 transition-all text-white">
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
};

// --- GAME: BUG HUNTER ---
const BugHunter: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
    const [level, setLevel] = useState(0);
    const [score, setScore] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [completed, setCompleted] = useState(false);

    const currentLevel = BUG_HUNTER_LEVELS[level];

    const handleLineClick = (idx: number) => {
        if (idx === currentLevel.errorLine) {
            playSound('success');
            if (level < BUG_HUNTER_LEVELS.length - 1) {
                setScore(s => s + (showHint ? 5 : 10)); // Less points if hint used
                setLevel(l => l + 1);
                setShowHint(false);
            } else {
                setScore(s => s + 10);
                setCompleted(true);
                playSound('pop'); // Win sound
            }
        } else {
            playSound('error');
        }
    };

    if (completed) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center animate-pop">
                <div className="bg-white/10 p-6 rounded-full mb-6">
                    <Bug size={64} className="text-[#FA6868]" />
                </div>
                <h2 className="text-3xl font-black mb-2 text-white">All Bugs Squashed!</h2>
                <p className="text-xl opacity-70 mb-8 text-white">Final Score: {score}</p>
                <Button onClick={onFinish} variant="secondary">Back to Menu</Button>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto w-full">
            <div className="flex justify-between items-center mb-6">
                <span className="text-[#5A9CB5] font-black uppercase tracking-widest bg-[#1E293B] px-4 py-2 rounded-xl">Level {level + 1}</span>
                <span className="text-[#FACE68] font-bold text-xl">Score: {score}</span>
            </div>

            <div className="bg-[#1E293B] rounded-3xl border-4 border-[#334155] overflow-hidden shadow-2xl relative">
                <div className="bg-[#0F172A] p-3 flex gap-2 items-center border-b border-[#334155]">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-xs text-gray-500 font-mono ml-2">{currentLevel.lang === 'python' ? 'script.py' : 'app.js'}</span>
                </div>
                
                <div className="p-6 font-mono text-lg">
                    {currentLevel.code.map((line, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => handleLineClick(idx)}
                            className="group flex gap-4 p-2 hover:bg-white/5 cursor-pointer rounded transition-colors relative"
                        >
                            <span className="text-gray-600 select-none w-6 text-right">{idx + 1}</span>
                            <span className="text-gray-300 group-hover:text-white transition-colors">{line}</span>
                            {/* Hover Bug Icon */}
                            <Bug className="absolute right-4 text-[#FA6868] opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8 flex justify-center">
                {showHint ? (
                    <div className="bg-[#FA6868]/20 border border-[#FA6868] p-4 rounded-xl text-[#FA6868] animate-slide-up flex items-center gap-2">
                        <AlertTriangle size={20} />
                        {currentLevel.hint}
                    </div>
                ) : (
                    <button onClick={() => setShowHint(true)} className="text-gray-400 hover:text-white text-sm font-bold uppercase tracking-widest flex items-center gap-2 transition-colors">
                        <BrainCircuit size={16} /> Need a hint? (-5 pts)
                    </button>
                )}
            </div>
        </div>
    );
};

// --- GAME: CODE SCRAMBLE ---
const CodeScramble: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
    const [level, setLevel] = useState(0);
    const [lines, setLines] = useState<string[]>([]);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        if (level < SCRAMBLE_LEVELS.length) {
            setLines([...SCRAMBLE_LEVELS[level].display]);
        } else {
            setCompleted(true);
        }
    }, [level]);

    const moveLine = (index: number, direction: -1 | 1) => {
        const newLines = [...lines];
        if (index + direction < 0 || index + direction >= newLines.length) return;
        
        const temp = newLines[index];
        newLines[index] = newLines[index + direction];
        newLines[index + direction] = temp;
        
        setLines(newLines);
        playSound('click');
    };

    const checkOrder = () => {
        const correct = SCRAMBLE_LEVELS[level].correctOrder;
        const isCorrect = lines.every((line, i) => line === correct[i]);
        
        if (isCorrect) {
            playSound('success');
            setLevel(l => l + 1);
        } else {
            playSound('error');
        }
    };

    if (completed) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center animate-pop">
                <ListOrdered size={64} className="text-[#5A9CB5] mb-4" />
                <h2 className="text-3xl font-black mb-2 text-white">Order Restored!</h2>
                <p className="text-xl opacity-70 mb-8 text-white">You fixed all the logic.</p>
                <Button onClick={onFinish} variant="secondary">Back to Menu</Button>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto w-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-white font-bold text-xl flex items-center gap-2"><ListOrdered className="text-[#5A9CB5]" /> Code Scramble</h2>
                <span className="text-[#5A9CB5] bg-[#1E293B] px-3 py-1 rounded-lg text-sm font-bold">Level {level + 1}</span>
            </div>
            
            <p className="text-gray-400 mb-6 text-center text-sm">Rearrange the code blocks to make the program work.</p>

            <div className="space-y-3 mb-8">
                {lines.map((line, idx) => (
                    <div key={idx} className="bg-[#1E293B] p-4 rounded-xl border-2 border-[#334155] flex items-center justify-between font-mono text-white group hover:border-[#5A9CB5] transition-colors">
                        <span>{line}</span>
                        <div className="flex flex-col gap-1 opacity-50 group-hover:opacity-100">
                            <button onClick={() => moveLine(idx, -1)} disabled={idx === 0} className="hover:text-[#FACE68] disabled:opacity-30">▲</button>
                            <button onClick={() => moveLine(idx, 1)} disabled={idx === lines.length - 1} className="hover:text-[#FACE68] disabled:opacity-30">▼</button>
                        </div>
                    </div>
                ))}
            </div>

            <Button onClick={checkOrder} fullWidth variant="primary">Check Order</Button>
        </div>
    );
};

// --- MAIN ARCADE VIEW ---
export const ArcadeView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [game, setGame] = useState<'menu' | 'sprint' | 'bugs' | 'scramble'>('menu');

    const renderMenu = () => (
        <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
            <button onClick={() => { setGame('sprint'); playSound('click'); }} className="bg-[#1E293B] p-8 rounded-3xl border-4 border-[#334155] hover:border-[#FACE68] hover:scale-105 transition-all text-left group relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#FACE68]/10 rounded-full group-hover:bg-[#FACE68]/20 transition-colors"></div>
                <Gamepad2 size={40} className="text-[#FACE68] mb-4" />
                <h3 className="text-2xl font-black text-white mb-2">Syntax Sprint</h3>
                <p className="text-gray-400 text-sm">Race against time to choose the correct code syntax.</p>
            </button>

            <button onClick={() => { setGame('bugs'); playSound('click'); }} className="bg-[#1E293B] p-8 rounded-3xl border-4 border-[#334155] hover:border-[#FA6868] hover:scale-105 transition-all text-left group relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#FA6868]/10 rounded-full group-hover:bg-[#FA6868]/20 transition-colors"></div>
                <Bug size={40} className="text-[#FA6868] mb-4" />
                <h3 className="text-2xl font-black text-white mb-2">Bug Hunter</h3>
                <p className="text-gray-400 text-sm">Spot the errors in code snippets before they crash the system!</p>
            </button>

            <button onClick={() => { setGame('scramble'); playSound('click'); }} className="bg-[#1E293B] p-8 rounded-3xl border-4 border-[#334155] hover:border-[#5A9CB5] hover:scale-105 transition-all text-left group relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#5A9CB5]/10 rounded-full group-hover:bg-[#5A9CB5]/20 transition-colors"></div>
                <ListOrdered size={40} className="text-[#5A9CB5] mb-4" />
                <h3 className="text-2xl font-black text-white mb-2">Code Scramble</h3>
                <p className="text-gray-400 text-sm">Rearrange lines of code to fix the program structure.</p>
            </button>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-[#0F172A] text-white">
            <div className="p-6 flex items-center justify-between">
                <button onClick={game === 'menu' ? onBack : () => setGame('menu')} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    <ArrowLeft className="text-white" />
                </button>
                <h1 className="text-xl font-black text-[#FACE68] tracking-widest uppercase">
                    {game === 'menu' ? 'Max Arcade' : game === 'sprint' ? 'Syntax Sprint' : game === 'bugs' ? 'Bug Hunter' : 'Code Scramble'}
                </h1>
                <div className="w-8">
                    <MaxAvatar mood={game === 'menu' ? 'happy' : 'excited'} />
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 w-full">
                {game === 'menu' && renderMenu()}
                {game === 'sprint' && <SyntaxSprint onFinish={() => setGame('menu')} />}
                {game === 'bugs' && <BugHunter onFinish={() => setGame('menu')} />}
                {game === 'scramble' && <CodeScramble onFinish={() => setGame('menu')} />}
            </div>
        </div>
    );
};