export type CategoryId =
  | 'champions_league'
  | 'laliga'
  | 'premier_league'
  | 'serie_a'
  | 'ligue_1'
  | 'world_cup'
  | 'trophy_room';

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'trophy_cup';

export type Language = 'en' | 'ar';

export interface Question {
  id: string;
  category: CategoryId;
  difficulty: DifficultyLevel;
  question: {
    en: string;
    ar: string;
  };
  options: {
    en: [string, string, string, string];
    ar: [string, string, string, string];
  };
  correctIndex: number; // 0, 1, 2, or 3
  explanation: {
    en: string;
    ar: string;
  };
}

export interface UserProfile {
  id: string;
  username: string;
  avatar: string;
  coins: number;
  quizzesPlayed: number;
  quizzesWon: number;
  questionsAnswered: number;
  correctAnswers: number;
  trophies: string[]; // List of unlocked trophy IDs
  lastDailyBonusDate?: string;
  createdDate: string;
}

export interface GameSettings {
  language: Language;
  soundEnabled: boolean;
  timerEnabled: boolean;
  timerSeconds: number;
}

export interface QuizResult {
  categoryId: CategoryId;
  difficulty: DifficultyLevel;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  isWin: boolean;
  coinsEarned: number;
  timeSpentSeconds: number;
  answers: {
    questionId: string;
    selectedOptionIndex: number;
    isCorrect: boolean;
  }[];
}

export interface Trophy {
  id: string;
  icon: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  unlocked: boolean;
}
