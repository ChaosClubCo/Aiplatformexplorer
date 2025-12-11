import { Platform } from '../types';

export interface Question {
  id: string;
  text: string;
  helpText?: string;
  type: 'single' | 'multi' | 'range' | 'priority' | 'boolean';
  options?: QuestionOption[];
  category: 'requirements' | 'constraints' | 'priorities';
  weight: number;
  rangeConfig?: {
    min: number;
    max: number;
    step: number;
    unit: string;
  };
}

export interface QuestionOption {
  value: string | number;
  label: string;
  score: number;
  description?: string;
}

export interface UserAnswer {
  questionId: string;
  value: any;
  selectedOptions?: QuestionOption[];
}

export interface UserAnswers {
  [questionId: string]: UserAnswer;
}

export interface RecommendationScore {
  platform: Platform;
  totalScore: number;
  confidence: number;
  matchBreakdown: {
    requirements: number;
    constraints: number;
    priorities: number;
  };
  reasons: {
    strengths: string[];
    concerns: string[];
    differentiators: string[];
  };
  rank: number;
}

export interface RecommendationState {
  currentQuestion: number;
  answers: UserAnswers;
  isComplete: boolean;
  results: RecommendationScore[] | null;
}
