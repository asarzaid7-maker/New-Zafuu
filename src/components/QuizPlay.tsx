import React, { useState, useEffect, useRef } from 'react';
import {
  Timer,
  Flame,
  ArrowRight,
  ArrowLeft,
  XCircle,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Clock,
  Shuffle,
  ShieldAlert,
} from 'lucide-react';
import { Question, Language, CategoryId, DifficultyLevel } from '../types/quiz';
import { CATEGORIES_META } from '../data/questions';
import { getTranslation } from '../data/translations';
import { sounds } from '../utils/audio';

interface QuizPlayProps {
  questions: Question[];
  category: CategoryId;
  difficulty: DifficultyLevel;
  language: Language;
  timerEnabled: boolean;
  onFinish: (results: {
    correctCount: number;
    wrongCount: number;
    timeSpentSeconds: number;
    answers: { questionId: string; selectedOptionIndex: number; isCorrect: boolean }[];
  }) => void;
  onQuit: () => void;
}

export const QuizPlay: React.FC<QuizPlayProps> = ({
  questions,
  category,
  difficulty,
  language,
  timerEnabled,
  onFinish,
  onQuit,
}) => {
  const t = getTranslation(language);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [answersRecord, setAnswersRecord] = useState<
    { questionId: string; selectedOptionIndex: number; isCorrect: boolean }[]
  >([]);

  // Lifelines state
  const [usedFiftyFifty, setUsedFiftyFifty] = useState(false);
  const [usedTimeBoost, setUsedTimeBoost] = useState(false);
  const [usedSkip, setUsedSkip] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);

  // Timer & Streaks
  const [timeLeft, setTimeLeft] = useState(25);
  const [streak, setStreak] = useState(0);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const [matchStartTime] = useState(Date.now());

  const currentQ = questions[currentIndex];
  const categoryMeta = CATEGORIES_META.find((c) => c.id === category);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Whistle on kick off
  useEffect(() => {
    sounds.playWhistle();
  }, []);

  // Timer loop for each question
  useEffect(() => {
    if (!timerEnabled || isAnswered) return;

    setTimeLeft(25);
    setHiddenOptions([]);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isAnswered, timerEnabled]);

  const handleTimeExpired = () => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedOption(-1); // timed out
    setStreak(0);
    sounds.playWrong();

    setAnswersRecord((prev) => [
      ...prev,
      {
        questionId: currentQ.id,
        selectedOptionIndex: -1,
        isCorrect: false,
      },
    ]);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;

    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctIndex;

    if (isCorrect) {
      sounds.playCorrect();
      setStreak((s) => s + 1);
    } else {
      sounds.playWrong();
      setStreak(0);
    }

    setAnswersRecord((prev) => [
      ...prev,
      {
        questionId: currentQ.id,
        selectedOptionIndex: idx,
        isCorrect,
      },
    ]);
  };

  const handleNextQuestion = () => {
    sounds.playClick();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setHiddenOptions([]);
      setTimeLeft(25);
    } else {
      // Completed all questions!
      const totalCorrect = answersRecord.filter((a) => a.isCorrect).length;
      const totalWrong = answersRecord.length - totalCorrect;
      const durationSeconds = Math.round((Date.now() - matchStartTime) / 1000);

      onFinish({
        correctCount: totalCorrect,
        wrongCount: totalWrong,
        timeSpentSeconds: durationSeconds,
        answers: answersRecord,
      });
    }
  };

  // Lifeline: 50:50
  const applyFiftyFifty = () => {
    if (usedFiftyFifty || isAnswered) return;
    sounds.playClick();
    setUsedFiftyFifty(true);

    const incorrectIndices = [0, 1, 2, 3].filter((i) => i !== currentQ.correctIndex);
    // Shuffle and pick 2 to hide
    const toHide = incorrectIndices.sort(() => 0.5 - Math.random()).slice(0, 2);
    setHiddenOptions(toHide);
  };

  // Lifeline: Time Boost (+15s)
  const applyTimeBoost = () => {
    if (usedTimeBoost || isAnswered || !timerEnabled) return;
    sounds.playClick();
    setUsedTimeBoost(true);
    setTimeLeft((prev) => prev + 15);
  };

  // Lifeline: Tactical Sub / Skip
  const applySkip = () => {
    if (usedSkip || isAnswered) return;
    sounds.playWhistle();
    setUsedSkip(true);

    // If there is another question next, advance
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setHiddenOptions([]);
      setTimeLeft(25);
    }
  };

  const isRTL = language === 'ar';
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Top Match HUD Bar */}
      <div className="bg-[#0b131e] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between gap-3">
          {/* Category & Difficulty Info */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-sm font-bold text-emerald-300">
              ⚽
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400">
                {categoryMeta?.name[language]}
              </div>
              <div className="text-sm font-extrabold text-white">
                {t.questionProgress} {currentIndex + 1}{' '}
                <span className="text-slate-500 font-normal">/ {questions.length}</span>
              </div>
            </div>
          </div>

          {/* Center Timer / Streak */}
          <div className="flex items-center gap-3">
            {streak >= 2 && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-black animate-bounce">
                <Flame className="w-3.5 h-3.5 fill-current text-amber-400" />
                <span>{streak}x {t.streak}</span>
              </div>
            )}

            {timerEnabled && (
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono font-bold text-sm ${
                  timeLeft <= 5
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse'
                    : timeLeft <= 10
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-slate-800/80 border-slate-700 text-slate-200'
                }`}
              >
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>{timeLeft}s</span>
              </div>
            )}
          </div>

          {/* Abandon match button */}
          <button
            onClick={() => setShowQuitConfirm(true)}
            className="text-xs text-slate-400 hover:text-rose-400 p-2 rounded-lg hover:bg-rose-500/10 transition-colors"
            title={t.quitQuiz}
          >
            <ShieldAlert className="w-4 h-4" />
          </button>
        </div>

        {/* Match Progress Bar */}
        <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Lifelines Bar */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="text-slate-400 font-medium hidden sm:inline">
            {t.lifelines}:
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={applyFiftyFifty}
              disabled={usedFiftyFifty || isAnswered}
              className={`px-3 py-1 rounded-lg border font-bold transition-all text-xs flex items-center gap-1 ${
                usedFiftyFifty
                  ? 'opacity-40 border-slate-800 bg-slate-900 text-slate-500 cursor-not-allowed'
                  : 'border-cyan-500/40 bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25 active:scale-95'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>{t.fiftyFifty}</span>
            </button>

            {timerEnabled && (
              <button
                onClick={applyTimeBoost}
                disabled={usedTimeBoost || isAnswered}
                className={`px-3 py-1 rounded-lg border font-bold transition-all text-xs flex items-center gap-1 ${
                  usedTimeBoost
                    ? 'opacity-40 border-slate-800 bg-slate-900 text-slate-500 cursor-not-allowed'
                    : 'border-amber-500/40 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 active:scale-95'
                }`}
              >
                <Clock className="w-3 h-3" />
                <span>{t.timeBoost}</span>
              </button>
            )}

            <button
              onClick={applySkip}
              disabled={usedSkip || isAnswered || currentIndex + 1 >= questions.length}
              className={`px-3 py-1 rounded-lg border font-bold transition-all text-xs flex items-center gap-1 ${
                usedSkip || currentIndex + 1 >= questions.length
                  ? 'opacity-40 border-slate-800 bg-slate-900 text-slate-500 cursor-not-allowed'
                  : 'border-purple-500/40 bg-purple-500/15 text-purple-300 hover:bg-purple-500/25 active:scale-95'
              }`}
            >
              <Shuffle className="w-3 h-3" />
              <span>{t.skipQuestion}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-[#0e1724] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
        {/* Subtle Pitch Light Gradient */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-60" />

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
            <span>{categoryMeta?.name[language]}</span>
            <span>·</span>
            <span>{t.difficulties[difficulty]}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
            {currentQ.question[language]}
          </h2>
        </div>

        {/* 4 Answer Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {currentQ.options[language].map((optionText, idx) => {
            const isHidden = hiddenOptions.includes(idx);
            if (isHidden) {
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-900/60 bg-slate-950/40 opacity-20 pointer-events-none select-none text-xs text-slate-600"
                >
                  <span className="font-mono">---</span>
                </div>
              );
            }

            const isCorrect = idx === currentQ.correctIndex;
            const isChosen = selectedOption === idx;

            let cardStyle =
              'border-slate-800 bg-[#121c2b] text-slate-200 hover:border-emerald-500/50 hover:bg-[#162336] active:scale-[0.99]';

            if (isAnswered) {
              if (isCorrect) {
                cardStyle =
                  'border-emerald-500 bg-emerald-950/40 text-emerald-200 ring-2 ring-emerald-500/50';
              } else if (isChosen) {
                cardStyle =
                  'border-rose-500 bg-rose-950/40 text-rose-200 ring-2 ring-rose-500/50';
              } else {
                cardStyle = 'border-slate-800/60 bg-slate-900/40 opacity-40 text-slate-500';
              }
            }

            const letters = ['A', 'B', 'C', 'D'];

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`p-4 sm:p-5 rounded-xl border text-left transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 ${cardStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-black/30 border border-white/10 flex items-center justify-center text-xs font-black text-slate-400 shrink-0">
                    {letters[idx]}
                  </span>
                  <span className="font-semibold text-sm sm:text-base leading-snug">
                    {optionText}
                  </span>
                </div>

                {isAnswered && isCorrect && (
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                {isAnswered && isChosen && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation & Tactical Briefing Box */}
        {isAnswered && (
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-2 animate-fadeIn">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <HelpCircle className="w-4 h-4" />
              <span>{t.explanation}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {currentQ.explanation[language]}
            </p>
          </div>
        )}

        {/* Action Button: Next Question or Finish Match */}
        {isAnswered && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleNextQuestion}
              className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-xl text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>
                {currentIndex + 1 < questions.length ? t.nextQuestion : t.finishMatch}
              </span>
              {isRTL ? (
                <ArrowLeft className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Quit Confirmation Dialog */}
      {showQuitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>{t.quitQuiz}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t.quitConfirm}
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowQuitConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                {t.continuePlaying}
              </button>
              <button
                onClick={onQuit}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors"
              >
                {t.yesQuit}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
