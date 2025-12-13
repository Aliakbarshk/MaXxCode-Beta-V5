// Simple audio synthesizer to avoid external assets

let audioCtx: AudioContext | null = null;

const initAudio = () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
};

export const playSound = (type: 'success' | 'error' | 'click' | 'pop') => {
    const ctx = initAudio();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'success') {
        // High pitched cheerful arpeggio
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6
        
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        
        osc.start(now);
        osc.stop(now + 0.5);
    } 
    else if (type === 'error') {
        // Low buzzing sound
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.3);
        
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        
        osc.start(now);
        osc.stop(now + 0.3);
    }
    else if (type === 'click') {
        // Short high blip
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        
        gainNode.gain.setValueAtTime(0.05, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        
        osc.start(now);
        osc.stop(now + 0.05);
    }
    else if (type === 'pop') {
       // Bubble pop
       osc.type = 'sine';
       osc.frequency.setValueAtTime(400, now);
       osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
       
       gainNode.gain.setValueAtTime(0.1, now);
       gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
       
       osc.start(now);
       osc.stop(now + 0.1);
    }
};

// Native Text-to-Speech
export const speakText = (text: string, lang: 'en' | 'hi' = 'en') => {
    // Cancel any current speaking
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set language
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
};