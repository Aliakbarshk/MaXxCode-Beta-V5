export type Language = 'python' | 'javascript';
export type AppLanguage = 'en' | 'hi' | 'hinglish';
export type Theme = 'light' | 'dark' | 'midnight' | 'candy' | 'orange' | 'forest' | 'coffee' | 'golden' | 'neon' | 'berry' | 'lemon' | 'cosmic' | 'aqua';
export type LessonType = 'code' | 'quiz' | 'test';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TestItem {
  id: string;
  type: 'mcq' | 'code';
  question: string;
  // For MCQ
  options?: string[];
  correctIndex?: number;
  // For Code
  initialCode?: string;
  expectedOutput?: string;
  solutionCode?: string; // For loose checking
  hint?: string;
}

export interface Lesson {
  id: string;
  type: LessonType;
  title: string;
  description: string;
  language: Language;
  order: number;
  chapter: string;
  // Content is now a union type based on LessonType
  content: {
    // 1. Concept Explanation (In-Depth)
    intro?: string;
    intro_hi?: string;
    intro_hinglish?: string;
    
    // 2. Quick Summary (Short & Simple)
    summary?: string[]; 
    
    // 3. Mission / Task
    instructions?: string;
    instructions_hi?: string;
    instructions_hinglish?: string;
    
    // 4. Solution (Code)
    solutionCode?: string;
    
    // 5. Code Explanation
    codeExplanation?: string;

    // Execution Fields
    initialCode?: string;
    expectedOutput?: string;
    hints?: string[];
    
    // Quiz Lesson Fields
    questions?: QuizQuestion[];

    // Chapter Test Fields
    testItems?: TestItem[];
    passThreshold?: number; // Percentage needed to pass (e.g., 0.8)
  };
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  language: Language;
  difficulty: 'easy' | 'medium' | 'hard';
  instructions: string;
  initialCode: string;
  expectedOutput: string;
  solutionCode: string;
}

export interface UserState {
  completedLessons: string[]; // IDs of completed lessons
  completedProblems: string[]; // IDs of completed problems
  currentStreak: number;
  lastLoginDate: string | null; // ISO Date string
  xp: number;
  badges: string[]; // IDs of earned badges
  adminUnlocked: boolean; // Renamed conceptually to Developer Mode
  apiKey: string | null; // User provided API Key
  lastActiveLanguage?: Language; // Persist the selected language
  settings: {
    appLanguage: AppLanguage;
    theme: Theme;
  }
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export interface Translation {
  welcome: string;
  continue: string;
  check: string;
  run: string;
  nextLesson: string;
  reset: string;
  dashboard: string;
  profile: string;
  lessons: string;
  settings: string;
  problems: string;
  playground: string;
  arcade: string;
  aboutDev: string;
  streak: string;
  xp: string;
  developedBy: string;
  loading: string;
  successMsg: string;
  errorMsg: string;
  consoleOutput: string;
  selectLanguage: string;
  selectTheme: string;
  completedTitle: string;
  comingSoon: string;
  locked: string;
  start: string;
  quizTitle: string;
  submitQuiz: string;
  quizPassed: string;
  quizFailed: string;
  back: string;
  translateLesson: string;
  lessonLanguage: string;
  solve: string;
  difficulty: string;
  unlockAll: string;
  unlockMsg: string;
  confirmUnlock: string;
}