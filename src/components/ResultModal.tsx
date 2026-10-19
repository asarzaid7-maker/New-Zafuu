import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle,
  XCircle,
  Clock,
  RotateCcw,
  Home,
  ChevronDown,
  ChevronUp,
  Coins,
  Award,
} from 'lucide-react';
import { Language, QuizResult, Question } from '../types/quiz';
import { CATEGORIES_META } from '../data/questions';
import { getTranslation } from '../data/translations';
import { sounds } from '../utils/audio';

interface ResultModalProps {
  result: QuizResult;
  questions: Question[];
  language: Language;
  onPlayAgain: () => void;
  onBackToLobby: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  result,
  questions,
  language,
  onPlayAgain,
  onBackToLobby,
}) => {
  const t = getTranslation(language);
  const [showReview, setShowReview] = useState(false);
  const categoryMeta = CATEGORIES_META.find((c) => c.id === result.categoryId);

  const accuracy = Math.round((result.correctCount / result.totalQuestions) * 100);

  useEffect(() => {
    if (result.isWin) {
      sounds.playVictory();
      // Fire confetti bursts
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#fbbf24', '#38bdf8', '#ffffff'],
        });
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#10b981', '#fbbf24'],
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#10b981', '#fbbf24'],
          });
        }, 300);
      } catch {
        // Fallback gracefully if canvas is blocked
      }
    } else {
      sounds.playWrong();
    }
  }, [result.isWin]);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-fadeIn">
      {/* Result Hero Header */}
      <div
        className={`rounded-2xl border p-6 sm:p-8 text-center relative overflow-hidden shadow-2xl ${
          result.isWin
            ? 'bg-gradient-to-b from-[#063321] via-[#092218] to-[#070d14] border-emerald-500/40'
            : 'bg-gradient-to-b from-[#2b1016] via-[#1a0c10] to-[#070d14] border-rose-500/40'
        }`}
      >
        {/* Victory Trophy Asset Display */}
        {result.isWin && (
          <div className="w-24 h-24 mx-auto mb-3 rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-lg shadow-amber-500/20">
            <img
              src="/src/assets/images/zafoot_trophy_cup_1792423866211.jpg"
              alt="Champions Trophy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-black/40 border border-white/10 text-slate-300">
            <span>{categoryMeta?.name[language]}</span>
            <span>·</span>
            <span>{t.difficulties[result.difficulty]}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white">
            {result.isWin ? t.victory : t.defeat}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            {result.isWin ? t.victoryDesc : t.defeatDesc}
          </p>
        </div>

        {/* Coin Bounty Ribbon */}
        {result.isWin && (
          <div className="mt-5 inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-sm font-extrabold shadow-lg">
            <Coins className="w-5 h-5 text-amber-400" />
            <span>
              {language === 'ar' ? 'مكافأة الفوز المكتسبة:' : 'Victory Bounty:'}
            </span>
            <span className="text-white text-base font-black">+20 {t.coins}!</span>
          </div>
        )}
      </div>

      {/* Match Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Final Score */}
        <div className="bg-[#0e1724] border border-slate-800 p-4 rounded-xl text-center space-y-1">
          <div className="text-xs font-bold text-slate-400">{t.score}</div>
          <div className="text-2xl font-black tabular-nums text-white">
            {result.correctCount}{' '}
            <span className="text-sm font-normal text-slate-500">
              / {result.totalQuestions}
            </span>
          </div>
        </div>

        {/* Accuracy */}
        <div className="bg-[#0e1724] border border-slate-800 p-4 rounded-xl text-center space-y-1">
          <div className="text-xs font-bold text-slate-400">{t.accuracy}</div>
          <div
            className={`text-2xl font-black tabular-nums ${
              accuracy >= 70
                ? 'text-emerald-400'
                : accuracy >= 50
                ? 'text-amber-400'
                : 'text-rose-400'
            }`}
          >
            {accuracy}%
          </div>
        </div>

        {/* Time Spent */}
        <div className="bg-[#0e1724] border border-slate-800 p-4 rounded-xl text-center space-y-1">
          <div className="text-xs font-bold text-slate-400">{t.timeTaken}</div>
          <div className="text-2xl font-black tabular-nums text-white flex items-center justify-center gap-1">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>{result.timeSpentSeconds}s</span>
          </div>
        </div>

        {/* Net Coins */}
        <div className="bg-[#0e1724] border border-slate-800 p-4 rounded-xl text-center space-y-1">
          <div className="text-xs font-bold text-slate-400">
            {result.isWin ? t.coinsWon : t.coinsLost}
          </div>
          <div
            className={`text-2xl font-black tabular-nums ${
              result.isWin ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            {result.isWin ? '+20' : '-10'} 🪙
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <button
          onClick={onPlayAgain}
          className="w-full sm:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t.playAgain} (10 🪙)</span>
        </button>

        <button
          onClick={onBackToLobby}
          className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm border border-slate-700 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>{t.backToLobby}</span>
        </button>
      </div>

      {/* Detailed Tactical Review Accordion */}
      <div className="bg-[#0e1724] border border-slate-800 rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowReview(!showReview)}
          className="w-full p-4 flex items-center justify-between text-left font-bold text-sm text-slate-200 hover:bg-slate-800/50 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>{t.reviewAnswers}</span>
          </span>
          {showReview ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {showReview && (
          <div className="p-4 sm:p-6 border-t border-slate-800 space-y-4 divide-y divide-slate-800/80">
            {questions.map((q, idx) => {
              const record = result.answers.find((a) => a.questionId === q.id);
              const isCorrect = record?.isCorrect ?? false;
              const chosenIdx = record?.selectedOptionIndex ?? -1;

              return (
                <div key={q.id} className="pt-4 first:pt-0 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-bold text-slate-400">
                      {idx + 1}. {q.question[language]}
                    </span>
                    {isCorrect ? (
                      <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold shrink-0">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'صحيح' : 'Correct'}</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-rose-400 text-xs font-bold shrink-0">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'خاطئ' : 'Missed'}</span>
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-300">
                      <span className="text-[10px] text-emerald-400/80 block uppercase font-bold">
                        {t.correctAnswer}:
                      </span>
                      {q.options[language][q.correctIndex]}
                    </div>
                    {chosenIdx >= 0 && chosenIdx !== q.correctIndex && (
                      <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-500/30 text-rose-300">
                        <span className="text-[10px] text-rose-400/80 block uppercase font-bold">
                          {t.yourAnswer}:
                        </span>
                        {q.options[language][chosenIdx]}
                      </div>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 italic pt-1">
                    {q.explanation[language]}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
