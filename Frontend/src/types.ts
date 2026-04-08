export interface ChatMessage {
  role: 'mentor' | 'student';
  text: string;
}

export interface AnalogyData {
  metaphor: string;
  explanation: string;
  emoji: string;
}

export interface FlipCardData {
  front: string;
  back: string;
}

export interface PredictRevealData {
  scenario: string;
  options: string[];
  correctAnswer: number;
  revealText: string;
}

export interface BuildUpStep {
  label: string;
  description: string;
}

export interface LessonSection {
  title: string;
  subtitle: string;
  content: string;
  interactiveType?: 'chat' | 'analogy' | 'flip' | 'predict' | 'buildup';
  interactiveData?: any;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export type ScreenState = 'LOADING' | 'LOGIN' | 'SIGN_IN' | 'REGISTER' | 'HUB' | 'LESSON' | 'PRE_QUIZ' | 'QUIZ' | 'SCORE' | 'DOUBT_SUMMARY' | 'LEADERBOARD' | 'PROFILE' | 'QUESTS' | 'SETTINGS';

export interface LeaderboardEntry {
  id: string;
  name: string;
  xp: number;
  streak: number;
  avatar?: string;
  isCurrentUser?: boolean;
}

export interface ProgressState {
  currentSection: number;
  totalSections: number;
  isComplete: boolean;
}
