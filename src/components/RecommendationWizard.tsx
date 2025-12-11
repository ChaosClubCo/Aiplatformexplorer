import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Platform } from '../types';
import { Question, UserAnswers, UserAnswer, RecommendationScore } from '../types/recommendation';
import { RECOMMENDATION_QUESTIONS } from '../data/questions';
import { calculateRecommendations } from '../utils/recommendationEngine';
import QuestionCard from './QuestionCard';
import RecommendationResults from './RecommendationResults';

interface RecommendationWizardProps {
  platforms: Platform[];
  onClose?: () => void;
}

export default function RecommendationWizard({ platforms, onClose }: RecommendationWizardProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [isComplete, setIsComplete] = useState(false);
  const [results, setResults] = useState<RecommendationScore[] | null>(null);
  const [showResults, setShowResults] = useState(false);

  const totalQuestions = RECOMMENDATION_QUESTIONS.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleAnswer = (questionId: string, answer: UserAnswer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate recommendations
      const recommendations = calculateRecommendations(platforms, answers);
      setResults(recommendations);
      setIsComplete(true);
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsComplete(false);
    setResults(null);
    setShowResults(false);
  };

  const currentQuestionData = RECOMMENDATION_QUESTIONS[currentQuestion];
  const currentAnswer = answers[currentQuestionData?.id];
  const isAnswered = currentAnswer !== undefined;

  // Auto-scroll to top on question change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentQuestion]);

  if (showResults && results) {
    return (
      <RecommendationResults
        recommendations={results}
        answers={answers}
        onRestart={handleRestart}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFCF8] py-8">
      <div className="max-w-[900px] mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#E88A1D] to-[#D97706] rounded-xl flex items-center justify-center text-white text-2xl">
                🤖
              </div>
              <div>
                <h1 className="text-3xl font-serif">AI Platform Recommendation</h1>
                <p className="text-[#5C524D]">
                  Answer {totalQuestions} questions to get personalized recommendations
                </p>
              </div>
            </div>
            
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 text-[#8B8279] hover:text-[#231C19] hover:bg-[#EDE8E3] rounded-lg transition-all"
                aria-label="Close wizard"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full bg-[#EDE8E3] rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#E88A1D] to-[#D97706]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-[#5C524D]">
              <span>Question {currentQuestion + 1} of {totalQuestions}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
          </div>
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <QuestionCard
              question={currentQuestionData}
              answer={currentAnswer}
              onAnswer={handleAnswer}
              questionNumber={currentQuestion + 1}
              totalQuestions={totalQuestions}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex items-center justify-between gap-4"
        >
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-6 py-3 border border-[#D9D2CC] rounded-lg hover:bg-[#FAFAFA] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="px-6 py-3 text-[#5C524D] hover:text-[#231C19] hover:bg-[#EDE8E3] rounded-lg transition-all"
            >
              Skip
            </button>

            <button
              onClick={handleNext}
              disabled={!isAnswered && currentQuestion < totalQuestions - 1}
              className="px-8 py-3 bg-gradient-to-r from-[#E88A1D] to-[#D97706] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
            >
              {currentQuestion === totalQuestions - 1 ? (
                <>
                  Get Recommendations
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              ) : (
                <>
                  Next Question
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Question Category Indicator */}
        <div className="mt-8 flex justify-center gap-2">
          {RECOMMENDATION_QUESTIONS.map((q, idx) => (
            <div
              key={q.id}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentQuestion
                  ? 'bg-[#E88A1D] w-8'
                  : idx < currentQuestion
                  ? 'bg-[#059669]'
                  : 'bg-[#EDE8E3]'
              }`}
              title={q.text}
            />
          ))}
        </div>

        {/* Category Badge */}
        <div className="mt-6 flex justify-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
            currentQuestionData?.category === 'requirements'
              ? 'bg-[#DBEAFE] text-[#1E40AF]'
              : currentQuestionData?.category === 'constraints'
              ? 'bg-[#FEF3C7] text-[#92400E]'
              : 'bg-[#F3E8FF] text-[#6B21A8]'
          }`}>
            {currentQuestionData?.category === 'requirements' && '📋'}
            {currentQuestionData?.category === 'constraints' && '⚠️'}
            {currentQuestionData?.category === 'priorities' && '⭐'}
            <span className="font-semibold capitalize">{currentQuestionData?.category}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
