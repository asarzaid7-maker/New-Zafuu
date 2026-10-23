import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Users,
  Copy,
  Check,
  Play,
  ArrowRight,
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  Trophy,
  Swords,
  Share2,
  RotateCcw,
  AlertCircle,
  Sparkles,
  Zap,
  Shield,
  Flame,
  LogIn,
  Crown,
} from 'lucide-react';
import { Language, UserProfile } from '../types/quiz';
import { sounds } from '../utils/audio';
import { AVATAR_OPTIONS } from '../data/avatars';
import { Scoreboard1v1, FootballAvatar, PlayerInfo } from './Scoreboard1v1';

interface CurrentQuestionView {
  id?: string;
  category?: string;
  difficulty?: string;
  question?: {
    en: string;
    ar: string;
  };
  options?: {
    en: [string, string, string, string];
    ar: [string, string, string, string];
  };
  correctIndex?: number;
  explanation?: {
    en: string;
    ar: string;
  };
}

interface RoomState {
  code: string;
  status: 'waiting' | 'ready' | 'playing' | 'round_end' | 'finished';
  creatorId: string;
  totalQuestions: number;
  currentQuestionIndex: number;
  questionStartTime: number;
  questionDurationSec: number;
  player1: PlayerInfo;
  player2?: PlayerInfo;
  currentQuestion?: CurrentQuestionView;
  rematchRequestedBy?: string;
}

interface OneVsOneChallengeProps {
  language: Language;
  user: UserProfile;
  onBackToLobby: () => void;
  onOpenCoinShop?: () => void;
}

export const OneVsOneChallenge: React.FC<OneVsOneChallengeProps> = ({
  language,
  user,
  onBackToLobby,
}) => {
  // Navigation screen
  const [screen, setScreen] = useState<'lobby' | 'room' | 'match' | 'results'>('lobby');

  // Input code state for join room
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedResult, setCopiedResult] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  // Active room data
  const [room, setRoom] = useState<RoomState | null>(null);

  // Answering & round state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [roundResult, setRoundResult] = useState<{
    correctIndex: number;
    explanation?: { en: string; ar: string };
    player1Result: { selectedIndex: number | null; isCorrect: boolean; scoreDelta: number; totalScore: number };
    player2Result: { selectedIndex: number | null; isCorrect: boolean; scoreDelta: number; totalScore: number } | null;
  } | null>(null);

  // Countdown timer for 15s round
  const [timeLeft, setTimeLeft] = useState<number>(15);

  // Match final results
  const [finalResults, setFinalResults] = useState<{
    winnerId: string | 'draw';
    totalQuestions: number;
    player1: PlayerInfo & { accuracy: number };
    player2: (PlayerInfo & { accuracy: number }) | null;
  } | null>(null);

  // WebSocket reference
  const wsRef = useRef<WebSocket | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to render player avatar (custom photo or stylized emoji avatar)
  const renderAvatar = (
    p: PlayerInfo | null | undefined,
    size: 'sm' | 'md' | 'lg' = 'md',
    borderColor: string = 'border-slate-700',
    badge?: string,
    answeredIndicator?: boolean
  ) => {
    if (!p) {
      return (
        <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
          <Users className="w-6 h-6" />
        </div>
      );
    }
    const av = AVATAR_OPTIONS.find((a) => a.id === p.avatar) || AVATAR_OPTIONS[0];
    const dims =
      size === 'sm'
        ? 'w-10 h-10 text-xl rounded-xl'
        : size === 'md'
        ? 'w-12 h-12 text-2xl rounded-xl'
        : 'w-16 h-16 text-3xl rounded-2xl';

    return (
      <div className="relative shrink-0 select-none">
        {p.customPhoto ? (
          <img
            src={p.customPhoto}
            alt={p.name}
            className={`${dims} object-cover border-2 ${borderColor} shadow-md`}
          />
        ) : (
          <div
            className={`${dims} bg-gradient-to-br ${av.bgGradient} flex items-center justify-center border-2 ${borderColor} shadow-md`}
          >
            <span>{av.emoji}</span>
          </div>
        )}
        {badge && (
          <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] shadow">
            {badge}
          </span>
        )}
        {answeredIndicator && p.hasAnsweredCurrent && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-slate-950 font-black shadow">
            ✓
          </span>
        )}
      </div>
    );
  };

  // Connect WebSocket helper
  const connectWs = (): Promise<WebSocket> => {
    return new Promise((resolve, reject) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        resolve(wsRef.current);
        return;
      }

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/1v1`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        wsRef.current = ws;
        resolve(ws);
      };

      ws.onerror = (err) => {
        console.error('1v1 WebSocket error:', err);
        reject(err);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleServerMessage(data);
        } catch (e) {
          console.error('Failed to parse WS message:', e);
        }
      };

      ws.onclose = () => {
        wsRef.current = null;
      };
    });
  };

  // Disconnect WebSocket on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Handle incoming server events
  const handleServerMessage = (data: Record<string, any>) => {
    const { type } = data;

    // Room Created
    if (type === 'room_created') {
      setRoom(data.room);
      setScreen('room');
      setConnecting(false);
      sounds.playClick();
      return;
    }

    // Player Joined Room
    if (type === 'player_joined') {
      setRoom(data.room);
      setScreen('room');
      setConnecting(false);
      sounds.playWhistle();
      return;
    }

    // Match Starting countdown
    if (type === 'match_starting') {
      sounds.playWhistle();
      return;
    }

    // Question Start (New Round)
    // Live Scoreboard update (real-time points & goals update)
    if (type === 'live_score_update') {
      setRoom((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          player1: {
            ...prev.player1,
            score: data.player1Score ?? prev.player1.score,
            correctCount: data.player1CorrectCount ?? prev.player1.correctCount,
          },
          player2: prev.player2
            ? {
                ...prev.player2,
                score: data.player2Score ?? prev.player2.score,
                correctCount: data.player2CorrectCount ?? prev.player2.correctCount,
              }
            : undefined,
        };
      });
      return;
    }

    // Answer Confirmation with instant score update
    if (type === 'answer_received') {
      if (data.score !== undefined) {
        setRoom((prev) => {
          if (!prev) return prev;
          const isP1 = prev.player1.id === user.id;
          if (isP1) {
            return {
              ...prev,
              player1: {
                ...prev.player1,
                score: data.score,
                correctCount: data.correctCount ?? prev.player1.correctCount,
                hasAnsweredCurrent: true,
              },
            };
          } else if (prev.player2) {
            return {
              ...prev,
              player2: {
                ...prev.player2,
                score: data.score,
                correctCount: data.correctCount ?? prev.player2.correctCount,
                hasAnsweredCurrent: true,
              },
            };
          }
          return prev;
        });
      }
      return;
    }

    // Question Start (New Round)
    if (type === 'question_start') {
      setSelectedOption(null);
      setRoundResult(null);
      setTimeLeft(data.durationSec || 15);

      setRoom((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          status: 'playing',
          currentQuestionIndex: data.questionIndex,
          currentQuestion: data.question,
          player1: {
            ...prev.player1,
            score: data.player1Score ?? prev.player1.score,
            correctCount: data.player1CorrectCount ?? prev.player1.correctCount,
            hasAnsweredCurrent: false,
          },
          player2: prev.player2
            ? {
                ...prev.player2,
                score: data.player2Score ?? prev.player2.score,
                correctCount: data.player2CorrectCount ?? prev.player2.correctCount,
                hasAnsweredCurrent: false,
              }
            : undefined,
        };
      });

      setScreen('match');
      sounds.playClick();

      // Start client timer countdown
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      const startTime = Date.now();
      const duration = (data.durationSec || 15) * 1000;

      timerIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, Math.ceil((duration - elapsed) / 1000));
        setTimeLeft(remaining);
        if (remaining <= 0) {
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        }
      }, 250);
      return;
    }

    // Opponent answered
    if (type === 'opponent_answered') {
      const answeringPlayerId = data.playerId;
      setRoom((prev) => {
        if (!prev) return prev;
        if (prev.player1.id === answeringPlayerId) {
          return {
            ...prev,
            player1: { ...prev.player1, hasAnsweredCurrent: true },
          };
        } else if (prev.player2 && prev.player2.id === answeringPlayerId) {
          return {
            ...prev,
            player2: { ...prev.player2, hasAnsweredCurrent: true },
          };
        }
        return prev;
      });
      return;
    }

    // Round End (Reveals answers and explanation)
    if (type === 'round_end') {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

      setRoundResult({
        correctIndex: data.correctIndex,
        explanation: data.explanation,
        player1Result: data.player1Result,
        player2Result: data.player2Result,
      });

      setRoom((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          status: 'round_end',
          currentQuestion: {
            ...prev.currentQuestion,
            correctIndex: data.correctIndex,
            explanation: data.explanation,
          },
          player1: {
            ...prev.player1,
            score: data.player1Score ?? data.player1Result?.totalScore ?? prev.player1.score,
            correctCount: data.player1CorrectCount ?? data.player1Result?.correctCount ?? prev.player1.correctCount,
          },
          player2: prev.player2
            ? {
                ...prev.player2,
                score: data.player2Score ?? data.player2Result?.totalScore ?? prev.player2.score,
                correctCount: data.player2CorrectCount ?? data.player2Result?.correctCount ?? prev.player2.correctCount,
              }
            : undefined,
        };
      });

      // Play audio feedback for local player
      const isPlayer1 = room?.player1.id === user.id;
      const myResult = isPlayer1 ? data.player1Result : data.player2Result;
      if (myResult?.isCorrect) {
        sounds.playCorrect();
      } else {
        sounds.playWrong();
      }
      return;
    }

    // Match Finished
    if (type === 'match_finished') {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

      setFinalResults({
        winnerId: data.winnerId,
        totalQuestions: data.totalQuestions,
        player1: data.player1,
        player2: data.player2,
      });
      setScreen('results');

      if (data.winnerId === user.id) {
        sounds.playVictory();
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      } else {
        sounds.playWhistle();
      }
      return;
    }

    // Sync State after reconnect
    if (type === 'sync_state') {
      setRoom(data.room);
      if (data.room.status === 'playing' || data.room.status === 'round_end') {
        setScreen('match');
      } else if (data.room.status === 'finished') {
        setScreen('results');
      } else {
        setScreen('room');
      }
      return;
    }

    // Rematch events
    if (type === 'rematch_requested') {
      setRoom((prev) => (prev ? { ...prev, rematchRequestedBy: data.requesterId } : prev));
      return;
    }

    if (type === 'rematch_started') {
      setRoom(data.room);
      setFinalResults(null);
      setRoundResult(null);
      setSelectedOption(null);
      setScreen('match');
      sounds.playWhistle();
      return;
    }

    // Player Connection status
    if (type === 'player_connection_change') {
      const { playerId, connected } = data;
      setRoom((prev) => {
        if (!prev) return prev;
        if (prev.player1.id === playerId) {
          return {
            ...prev,
            player1: { ...prev.player1, connected },
          };
        } else if (prev.player2 && prev.player2.id === playerId) {
          return {
            ...prev,
            player2: { ...prev.player2, connected },
          };
        }
        return prev;
      });
      return;
    }

    // Errors
    if (type === 'error') {
      setConnecting(false);
      setErrorMessage(
        language === 'ar' ? data.message_ar || data.message : data.message || 'Error occurred.'
      );
      sounds.playWrong();
      return;
    }
  };

  // 1. Action: Create Room
  const handleCreateRoom = async () => {
    setErrorMessage(null);
    setConnecting(true);
    sounds.playClick();

    try {
      const ws = await connectWs();
      ws.send(
        JSON.stringify({
          type: 'create_room',
          user: {
            id: user.id,
            name: user.username,
            avatar: user.avatar,
            customPhoto: user.customPhoto,
          },
        })
      );
    } catch {
      setConnecting(false);
      setErrorMessage(
        language === 'ar'
          ? 'تعذر الاتصال بخادم التحدي المباشر. تأكد من اتصال الإنترنت.'
          : 'Failed to connect to multiplayer server. Check your connection.'
      );
    }
  };

  // 2. Action: Join Room
  const handleJoinRoom = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanCode = joinCodeInput.trim().toUpperCase();
    if (!cleanCode) {
      setErrorMessage(language === 'ar' ? 'يرجى كتابة رمز الغرفة.' : 'Please enter a room code.');
      return;
    }

    setErrorMessage(null);
    setConnecting(true);
    sounds.playClick();

    try {
      const ws = await connectWs();
      ws.send(
        JSON.stringify({
          type: 'join_room',
          roomCode: cleanCode,
          user: {
            id: user.id,
            name: user.username,
            avatar: user.avatar,
            customPhoto: user.customPhoto,
          },
        })
      );
    } catch {
      setConnecting(false);
      setErrorMessage(
        language === 'ar'
          ? 'تعذر الاتصال بخادم التحدي المباشر.'
          : 'Failed to connect to multiplayer server.'
      );
    }
  };

  // 3. Action: Start Match (Creator only)
  const handleStartMatch = () => {
    if (!room || !wsRef.current) return;
    sounds.playClick();
    wsRef.current.send(
      JSON.stringify({
        type: 'start_match',
        roomCode: room.code,
        playerId: user.id,
      })
    );
  };

  // 4. Action: Submit Answer for current question
  const handleSubmitOption = (optionIndex: number) => {
    if (!room || room.status !== 'playing' || selectedOption !== null || !wsRef.current) return;

    setSelectedOption(optionIndex);
    sounds.playClick();

    wsRef.current.send(
      JSON.stringify({
        type: 'submit_answer',
        roomCode: room.code,
        playerId: user.id,
        questionIndex: room.currentQuestionIndex,
        selectedIndex: optionIndex,
      })
    );
  };

  // 5. Action: Rematch
  const handleRequestRematch = () => {
    if (!room || !wsRef.current) return;
    sounds.playClick();
    wsRef.current.send(
      JSON.stringify({
        type: 'request_rematch',
        roomCode: room.code,
        playerId: user.id,
      })
    );
  };

  const handleAcceptRematch = () => {
    if (!room || !wsRef.current) return;
    sounds.playClick();
    wsRef.current.send(
      JSON.stringify({
        type: 'accept_rematch',
        roomCode: room.code,
        playerId: user.id,
      })
    );
  };

  // Copy Room Code Helper
  const handleCopyCode = () => {
    if (!room?.code) return;
    navigator.clipboard.writeText(room.code);
    setCopiedCode(true);
    sounds.playClick();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Copy Match Result Helper
  const handleCopyResult = () => {
    if (!finalResults || !room) return;
    const isMeWinner = finalResults.winnerId === user.id;
    const resultText =
      language === 'ar'
        ? `⚽ نتيجة تحدي 1 ضد 1 في زافوت!\n${
            isMeWinner ? '🏆 حققت الفوز على خصمي!' : '🔥 مباراة حماسية رائعة!'
          }\nاللاعب 1: ${finalResults.player1.name} (${finalResults.player1.score} نقطة)\nاللاعب 2: ${
            finalResults.player2?.name
          } (${finalResults.player2?.score} نقطة)\nالعب وتحدى الآن في ZaFoot!`
        : `⚽ ZaFoot 1v1 Football Quiz Result!\n${
            isMeWinner ? '🏆 I won the football trivia battle!' : '🔥 Intense match on the pitch!'
          }\n${finalResults.player1.name}: ${finalResults.player1.score} pts\n${
            finalResults.player2?.name
          }: ${finalResults.player2?.score} pts\nPlay now on ZaFoot!`;

    navigator.clipboard.writeText(resultText);
    setCopiedResult(true);
    sounds.playClick();
    setTimeout(() => setCopiedResult(false), 2000);
  };

  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  // =========================================================================
  // SCREEN 1: LOBBY (Create Room or Join Room)
  // =========================================================================
  if (screen === 'lobby') {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 animate-fadeIn">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <button
              onClick={onBackToLobby}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer group mb-1"
            >
              <ArrowIcon className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'العودة للرئيسية' : 'Back to Lobby'}</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400">
                <Swords className="w-6 h-6" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {language === 'ar' ? 'تحدي 1 ضد 1 المباشر' : '1v1 Football Challenge'}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              {language === 'ar'
                ? 'تحدَّ أصدقاءك في معركة كروية مباشرة عبر الإنترنت! 30 سؤالاً حقيقياً في نفس اللحظة مع مؤقت 15 ثانية لكل سؤال.'
                : 'Challenge your friends to a live real-time football battle! 30 synchronized questions, 15 seconds per round, and head-to-head live scoring.'}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl text-emerald-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{language === 'ar' ? 'خادم التحدي متصل ومباشر' : 'Multiplayer Server Live'}</span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm animate-shake">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
            <div className="flex-1">{errorMessage}</div>
          </div>
        )}

        {/* 1v1 Highlights Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black shrink-0">
              30
            </div>
            <div>
              <div className="font-bold text-white">
                {language === 'ar' ? '30 سؤالاً للمباراة' : '30 Questions Per Match'}
              </div>
              <div className="text-slate-400 text-[11px]">
                {language === 'ar' ? 'نفس الأسئلة والترتيب لكلا اللاعبين' : 'Same questions in identical order'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-black shrink-0">
              15s
            </div>
            <div>
              <div className="font-bold text-white">
                {language === 'ar' ? '15 ثانية لكل سؤال' : '15s Countdown Timer'}
              </div>
              <div className="text-slate-400 text-[11px]">
                {language === 'ar' ? 'إجابات مستقلة وسرعة حاسمة' : 'Synchronized real-time round clock'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black shrink-0">
              +100
            </div>
            <div>
              <div className="font-bold text-white">
                {language === 'ar' ? '100 نقطة لكل إجابة' : '100 Pts Per Correct Answer'}
              </div>
              <div className="text-slate-400 text-[11px]">
                {language === 'ar' ? 'نقاط فورية وسجل مبارزة تفاعلي' : 'Authoritative live scoring & rematch'}
              </div>
            </div>
          </div>
        </div>

        {/* Main 2 Action Cards: Create Room or Join Room */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {/* CARD 1: CREATE ROOM */}
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-[#0c1828] via-[#09121e] to-[#060c14] p-6 sm:p-8 flex flex-col justify-between hover:border-amber-500/50 transition-all shadow-xl space-y-6 group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
                <Sparkles className="w-7 h-7" />
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-black uppercase tracking-wider text-amber-400">
                  {language === 'ar' ? 'الخيار الأول · المضيف' : 'Option 1 · Host Match'}
                </div>
                <h2 className="text-2xl font-black text-white">
                  {language === 'ar' ? 'إنشاء غرفة تحدي جديدة' : 'Create a New Room'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {language === 'ar'
                    ? 'أنشئ غرفة واحصل على رمز فريد (مثل ZF7K29). شارك الرمز مع صديقك، وعندما ينضم اضغط ابدأ التحدي!'
                    : 'Create a room to get a unique code (e.g. ZF7K29). Share it with your rival and start when both are connected!'}
                </p>
              </div>

              {/* Creator preview slot */}
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center gap-3">
                {renderAvatar(
                  {
                    id: user.id,
                    name: user.username,
                    avatar: user.avatar,
                    customPhoto: user.customPhoto,
                    connected: true,
                    score: 0,
                    correctCount: 0,
                  },
                  'sm',
                  'border-amber-500/40'
                )}
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{user.username}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-black">
                      {language === 'ar' ? 'المضيف (اللاعب 1)' : 'Host (P1)'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {language === 'ar' ? 'جاهز لإنشاء المعركة' : 'Ready to create room'}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleCreateRoom}
              disabled={connecting}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black rounded-xl text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Swords className="w-4 h-4" />
              <span>
                {connecting
                  ? (language === 'ar' ? 'جارٍ إنشاء الغرفة...' : 'Creating Room...')
                  : (language === 'ar' ? 'إنشاء الغرفة الآن ➔' : 'Create Room Now ➔')}
              </span>
            </button>
          </div>

          {/* CARD 2: JOIN ROOM */}
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-[#091522] via-[#07111c] to-[#050b12] p-6 sm:p-8 flex flex-col justify-between hover:border-cyan-500/50 transition-all shadow-xl space-y-6 group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform">
                <LogIn className="w-7 h-7" />
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-black uppercase tracking-wider text-cyan-400">
                  {language === 'ar' ? 'الخيار الثاني · الضيف' : 'Option 2 · Guest Match'}
                </div>
                <h2 className="text-2xl font-black text-white">
                  {language === 'ar' ? 'الانضمام إلى غرفة صديق' : 'Join a Friend\x27s Room'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {language === 'ar'
                    ? 'هل شارك صديقك معك رمز غرفة؟ أدخل الرمز أدناه وانضم إليه فوراً لتصبح اللاعب 2 في نفس المباراة.'
                    : 'Got a room code from a friend? Enter the 6-character code below to join as Player 2 instantly.'}
                </p>
              </div>

              <form onSubmit={handleJoinRoom} className="space-y-3">
                <label className="block text-xs font-bold text-slate-300">
                  {language === 'ar' ? 'رمز الغرفة (مثال: ZF7K29):' : 'Room Code (e.g. ZF7K29):'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={8}
                    placeholder="ZF7K29"
                    value={joinCodeInput}
                    onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                    className="w-full bg-[#050b12] border border-slate-700 rounded-xl px-4 py-3 text-lg font-black tracking-widest text-center text-cyan-300 uppercase focus:outline-none focus:border-cyan-400 font-mono shadow-inner"
                  />
                </div>
              </form>
            </div>

            <button
              onClick={() => handleJoinRoom()}
              disabled={connecting || !joinCodeInput.trim()}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black rounded-xl text-sm shadow-lg shadow-cyan-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>
                {connecting
                  ? (language === 'ar' ? 'جارٍ الانضمام...' : 'Joining Room...')
                  : (language === 'ar' ? 'انضم إلى المباراة ➔' : 'Join Room ➔')}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SCREEN 2: WAITING ROOM / LOCKER ROOM TUNNEL
  // =========================================================================
  if (screen === 'room' && room) {
    const isHost = room.creatorId === user.id;
    const isPlayer2Joined = !!room.player2 && room.player2.connected;

    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 animate-fadeIn">
        {/* Top bar with back button */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <button
            onClick={() => {
              if (window.confirm(language === 'ar' ? 'هل تريد مغادرة الغرفة؟' : 'Leave this room?')) {
                setScreen('lobby');
                setRoom(null);
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowIcon className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'مغادرة الغرفة' : 'Leave Room'}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-300">
              {language === 'ar' ? 'غرفة حية ومباشرة' : 'Live Room Connected'}
            </span>
          </div>
        </div>

        {/* Professional Live Scoreboard displayed as soon as both players enter the room */}
        {isPlayer2Joined && (
          <div className="space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Trophy className="w-3.5 h-3.5" />
                {language === 'ar' ? 'لوحة المباراة المباشرة (البداية 0 - 0)' : 'Live Match Scoreboard (Kickoff 0 - 0)'}
              </span>
              <span className="text-emerald-400 font-mono text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                {language === 'ar' ? 'صافرة البداية قريباً (30 سؤالاً)' : 'Kickoff Ready (30 Questions)'}
              </span>
            </div>
            <Scoreboard1v1
              player1={room.player1}
              player2={room.player2}
              currentUserId={user.id}
              language={language}
              totalQuestions={room.totalQuestions}
            />
          </div>
        )}

        {/* Room Code Display Card */}
        <div className="bg-gradient-to-br from-[#0c1a29] via-[#08121d] to-[#040a10] border border-amber-500/40 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-2xl relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'رمز الغرفة للمشاركة' : 'Room Code to Share'}</span>
          </div>

          <div className="space-y-1">
            <div className="text-4xl sm:text-6xl font-black text-white tracking-widest font-mono py-1 select-all drop-shadow-md">
              {room.code}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              {language === 'ar'
                ? 'انسخ الرمز وشاركه مع منافسك عبر واتساب أو أي تطبيق للانضمام فوراً للمباراة.'
                : 'Share this code with your friend so they can join this head-to-head match!'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleCopyCode}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
            >
              {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCode ? (language === 'ar' ? 'تم النسخ بنجاح!' : 'Copied!') : (language === 'ar' ? 'نسخ الرمز' : 'Copy Room Code')}</span>
            </button>
          </div>
        </div>

        {/* Versus Players Tunnel Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
          {/* PLAYER 1 (Host) */}
          <div className="rounded-2xl border border-slate-700 bg-[#09121f] p-5 sm:p-6 flex items-center gap-4 relative shadow-lg">
            {renderAvatar(room.player1, 'lg', 'border-amber-400', 'P1')}

            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black text-white">{room.player1.name}</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                  {language === 'ar' ? 'المضيف' : 'Host'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{language === 'ar' ? 'متصل وجاهز' : 'Connected'}</span>
              </div>
            </div>
          </div>

          {/* PLAYER 2 (Opponent) */}
          <div
            className={`rounded-2xl border p-5 sm:p-6 flex items-center gap-4 relative shadow-lg transition-all ${
              isPlayer2Joined
                ? 'border-slate-700 bg-[#09121f]'
                : 'border-dashed border-slate-700 bg-slate-900/30'
            }`}
          >
            {isPlayer2Joined && room.player2 ? (
              <>
                {renderAvatar(room.player2, 'lg', 'border-cyan-400', 'P2')}

                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-black text-white">{room.player2.name}</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                      {language === 'ar' ? 'المنافس' : 'Challenger'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>{language === 'ar' ? 'متصل وجاهز' : 'Connected'}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-4 text-center w-full space-y-2">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                  <Users className="w-5 h-5 animate-pulse" />
                </div>
                <div className="text-sm font-bold text-slate-300">
                  {language === 'ar' ? 'بانتظار انضمام اللاعب الثاني...' : 'Waiting for Player 2 to join...'}
                </div>
                <p className="text-xs text-slate-500">
                  {language === 'ar' ? 'أعطِ رمز الغرفة لصديقك للدخول' : 'Share room code with your friend'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Start Game Action Box */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0a1523] to-slate-900 border border-slate-800 text-center space-y-4 shadow-xl">
          {isPlayer2Joined ? (
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'كلا اللاعبين متصلان الآن! جاهزون لانطلاق صافرة البداية' : 'Both players connected! Ready for kickoff'}</span>
              </div>

              <div>
                {isHost ? (
                  <button
                    onClick={handleStartMatch}
                    className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-base shadow-xl shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mx-auto"
                  >
                    <Play className="w-5 h-5 fill-slate-950" />
                    <span>{language === 'ar' ? 'ابدأ تحدي الـ 30 سؤالاً الآن! 🚀' : 'Start 30-Question Challenge! 🚀'}</span>
                  </button>
                ) : (
                  <div className="text-sm font-bold text-amber-300 animate-pulse py-2">
                    {language === 'ar' ? 'بانتظار المضيف لإطلاق صافرة بداية المباراة...' : 'Waiting for host to kick off the match...'}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-xs sm:text-sm text-slate-400 py-2">
              {language === 'ar'
                ? 'لا يمكنك بدء المباراة حتى ينضم اللاعب الثاني باستخدام رمز الغرفة أعلاه.'
                : 'Match will become available as soon as Player 2 enters the room code above.'}
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // SCREEN 3: LIVE 1V1 MATCH HUD
  // =========================================================================
  if (screen === 'match' && room && room.currentQuestion) {
    const q = room.currentQuestion;
    const isP1 = room.player1.id === user.id;
    const opponent = isP1 ? room.player2 : room.player1;
    const me = isP1 ? room.player1 : room.player2;

    const progressPct = ((room.currentQuestionIndex + 1) / room.totalQuestions) * 100;
    const isRoundEnd = room.status === 'round_end' && roundResult !== null;

    // Timer visual coloring
    const isUrgent = timeLeft <= 4;
    const isWarning = timeLeft <= 7 && timeLeft > 4;
    const timerColorClass = isUrgent
      ? 'text-rose-400 border-rose-500/60 bg-rose-500/20 animate-pulse'
      : isWarning
      ? 'text-amber-400 border-amber-500/60 bg-amber-500/20'
      : 'text-emerald-400 border-emerald-500/60 bg-emerald-500/20';

    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-6 animate-fadeIn">
        {/* Dedicated Professional Live Scoreboard - visible throughout all 30 questions */}
        <Scoreboard1v1
          player1={room.player1}
          player2={room.player2}
          currentUserId={user.id}
          language={language}
          timeLeft={timeLeft}
          showTimer={true}
          questionNumber={room.currentQuestionIndex + 1}
          totalQuestions={room.totalQuestions}
        />

        {/* Match Progress Bar */}
        <div className="bg-[#09111c]/90 border border-slate-800 rounded-xl p-3 sm:p-4 space-y-1.5 shadow-md">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span className="text-emerald-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              {language === 'ar'
                ? `التقدم في المعركة: السؤال ${room.currentQuestionIndex + 1} من ${room.totalQuestions}`
                : `Match Progress: Question ${room.currentQuestionIndex + 1} of ${room.totalQuestions}`}
            </span>
            <span className="font-mono text-slate-300">{Math.round(progressPct)}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Live Question Card */}
        <div className="bg-gradient-to-br from-[#0c1828] via-[#09121f] to-[#060c14] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-slate-800 pb-3">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
              {q.category ? q.category.replace('_', ' ').toUpperCase() : 'FOOTBALL TRIVIA'}
            </span>
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <span>+100</span> {language === 'ar' ? 'نقطة' : 'Pts'}
            </span>
          </div>

          <h2 className="text-lg sm:text-2xl font-black text-white leading-relaxed text-balance">
            {language === 'ar' ? q.question?.ar : q.question?.en}
          </h2>

          {/* 4 Interactive Option Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
            {q.options &&
              q.options[language]?.map((optionText, idx) => {
                const isSelected = selectedOption === idx;
                let optionStyle =
                  'border-slate-800 bg-[#0d1622] hover:border-slate-600 hover:bg-[#121f30] text-slate-200';

                if (isSelected && !isRoundEnd) {
                  optionStyle =
                    'border-amber-400 bg-amber-500/20 text-white ring-2 ring-amber-400/50 shadow-md';
                }

                if (isRoundEnd && roundResult) {
                  const isCorrectAnswer = idx === roundResult.correctIndex;
                  if (isCorrectAnswer) {
                    optionStyle =
                      'border-emerald-400 bg-emerald-950/60 text-white ring-2 ring-emerald-500 shadow-lg shadow-emerald-500/20';
                  } else if (isSelected && !isCorrectAnswer) {
                    optionStyle =
                      'border-rose-500 bg-rose-950/60 text-rose-200 ring-2 ring-rose-500/60 opacity-80';
                  } else {
                    optionStyle = 'border-slate-800/40 bg-slate-900/40 text-slate-500 opacity-40';
                  }
                }

                // Check if opponent chose this option (shown on round end)
                const opponentResult = isP1 ? roundResult?.player2Result : roundResult?.player1Result;
                const opponentChoseThis = isRoundEnd && opponentResult?.selectedIndex === idx;

                return (
                  <button
                    key={idx}
                    onClick={() => handleSubmitOption(idx)}
                    disabled={selectedOption !== null || isRoundEnd}
                    className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer relative flex items-center justify-between group ${optionStyle} ${
                      selectedOption === null && !isRoundEnd ? 'active:scale-98' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center text-xs font-black shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-sm sm:text-base font-bold">{optionText}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isRoundEnd && idx === roundResult?.correctIndex && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-bounce" />
                      )}
                      {isRoundEnd && isSelected && idx !== roundResult?.correctIndex && (
                        <XCircle className="w-5 h-5 text-rose-400" />
                      )}
                      {opponentChoseThis && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold uppercase">
                          {language === 'ar' ? 'اختيار الخصم' : 'Opponent'}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
          </div>

          {/* Real-time Status / Intermission Feedback */}
          {selectedOption !== null && !isRoundEnd && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center text-xs text-amber-300 font-bold flex items-center justify-center gap-2 animate-pulse">
              <Clock className="w-4 h-4" />
              <span>
                {opponent?.hasAnsweredCurrent
                  ? (language === 'ar' ? 'الخصم أجاب أيضاً! جارٍ إعلان النتيجة...' : 'Opponent has also answered! Closing round...')
                  : (language === 'ar' ? 'تم تسجيل إجابتك! بانتظار إجابة الخصم أو انتهاء الـ 15 ثانية...' : 'Answer locked in! Waiting for opponent or countdown timer...')}
              </span>
            </div>
          )}

          {/* Round End Explanation Reveal Banner */}
          {isRoundEnd && roundResult && (
            <div className="p-4 bg-slate-900/90 border border-slate-700 rounded-xl text-xs sm:text-sm space-y-1.5 animate-fadeIn">
              <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'ar' ? 'الإجابة الصحيحة وشرح الهدف:' : 'Correct Answer & Football Fact:'}</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {language === 'ar' ? roundResult.explanation?.ar : roundResult.explanation?.en}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // SCREEN 4: MATCH FINAL RESULTS SCREEN
  // =========================================================================
  if (screen === 'results' && finalResults) {
    const isMeWinner = finalResults.winnerId === user.id;
    const isDraw = finalResults.winnerId === 'draw';

    const p1 = finalResults.player1;
    const p2 = finalResults.player2;

    return (
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-fadeIn space-y-6">
        {/* Synchronized Professional Scoreboard at Match Finish */}
        <Scoreboard1v1
          player1={p1}
          player2={p2}
          currentUserId={user.id}
          language={language}
          isFinal={true}
          winnerId={finalResults.winnerId}
          totalQuestions={finalResults.totalQuestions}
        />

        {/* Winner / Duel Result Spotlight Card */}
        <div
          className={`relative rounded-3xl overflow-hidden border p-6 sm:p-8 text-center space-y-6 shadow-2xl ${
            isMeWinner
              ? 'bg-gradient-to-b from-[#0b2016] via-[#08150f] to-[#040c08] border-emerald-500/50 shadow-emerald-500/20'
              : isDraw
              ? 'bg-gradient-to-b from-[#191e26] via-[#10141a] to-[#080a0e] border-slate-600 shadow-slate-500/10'
              : 'bg-gradient-to-b from-[#1f1015] via-[#140b0e] to-[#0b0507] border-rose-500/40 shadow-rose-500/10'
          }`}
        >
          {/* Winner Avatar & Trophy Spotlight */}
          {!isDraw && (
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="relative">
                <FootballAvatar
                  player={finalResults.winnerId === p1.id ? p1 : p2}
                  size="lg"
                  isWinner={true}
                  isLeading={true}
                />
              </div>

              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 shadow">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {language === 'ar' ? 'بطل المباراة والمبارزة' : 'Match Duel Champion'}
                  </span>
                </span>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {finalResults.winnerId === p1.id ? p1.name : p2?.name}
                </div>
              </div>
            </div>
          )}

          {isDraw && (
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="flex items-center justify-center gap-4">
                <FootballAvatar player={p1} size="md" />
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shadow">
                  <Swords className="w-6 h-6" />
                </div>
                <FootballAvatar player={p2} size="md" />
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-700/40 text-slate-300 border border-slate-600 text-xs font-black uppercase tracking-wider">
                {language === 'ar' ? 'تعادل ناري وعادل بين الفريقين' : 'Dramatic Draw & Equal Honors'}
              </span>
            </div>
          )}

          {/* Final Score Banner Display (Format: Player 1: 5 - 4 :Player 2) */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2 max-w-md mx-auto shadow-inner">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {language === 'ar' ? 'النتيجة النهائية للمباراة' : 'Official Match Final Score'}
            </div>

            <div className="text-sm sm:text-base font-extrabold text-white flex items-center justify-center gap-2">
              <span className="truncate max-w-[120px]">{p1.name}</span>
              <span className="text-amber-400 font-mono font-black text-xl sm:text-2xl tracking-wider">
                : {p1.correctCount} - {p2?.correctCount ?? 0} :
              </span>
              <span className="truncate max-w-[120px]">{p2?.name}</span>
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              {p1.score} {language === 'ar' ? 'نقطة' : 'pts'} — {p2?.score ?? 0} {language === 'ar' ? 'نقطة' : 'pts'}
            </div>
          </div>

          {/* Head-to-Head Comparative Stats Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2">
            {/* Player 1 Card */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border text-center space-y-2 ${
                finalResults.winnerId === p1.id
                  ? 'bg-emerald-950/40 border-emerald-500/60 ring-2 ring-emerald-500/30'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div className="flex justify-center">
                <FootballAvatar player={p1} size="md" isWinner={finalResults.winnerId === p1.id} />
              </div>
              <div className="font-bold text-white text-sm truncate">{p1.name}</div>
              <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
                {p1.score} <span className="text-xs text-slate-400 font-normal">pts</span>
              </div>
              <div className="text-[11px] text-slate-400 space-y-0.5">
                <div>
                  {language === 'ar' ? 'الأهداف الصحيحة:' : 'Correct Goals:'}{' '}
                  <strong className="text-white font-mono">{p1.correctCount} / 30</strong>
                </div>
                <div>
                  {language === 'ar' ? 'دقة الإجابات:' : 'Accuracy:'}{' '}
                  <strong className="text-emerald-400 font-mono">{p1.accuracy}%</strong>
                </div>
              </div>
            </div>

            {/* Player 2 Card */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border text-center space-y-2 ${
                p2 && finalResults.winnerId === p2.id
                  ? 'bg-emerald-950/40 border-emerald-500/60 ring-2 ring-emerald-500/30'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div className="flex justify-center">
                <FootballAvatar player={p2} size="md" isWinner={p2 ? finalResults.winnerId === p2.id : false} />
              </div>
              <div className="font-bold text-white text-sm truncate">{p2?.name}</div>
              <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
                {p2?.score ?? 0} <span className="text-xs text-slate-400 font-normal">pts</span>
              </div>
              <div className="text-[11px] text-slate-400 space-y-0.5">
                <div>
                  {language === 'ar' ? 'الأهداف الصحيحة:' : 'Correct Goals:'}{' '}
                  <strong className="text-white font-mono">{p2?.correctCount ?? 0} / 30</strong>
                </div>
                <div>
                  {language === 'ar' ? 'دقة الإجابات:' : 'Accuracy:'}{' '}
                  <strong className="text-emerald-400 font-mono">{p2?.accuracy ?? 0}%</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Rematch Banner if requested */}
          {room?.rematchRequestedBy && room.rematchRequestedBy !== user.id && (
            <div className="p-3 bg-amber-500/20 border border-amber-500/40 rounded-xl text-xs sm:text-sm text-amber-300 font-bold flex items-center justify-center gap-2 animate-bounce">
              <Sparkles className="w-4 h-4" />
              <span>
                {language === 'ar'
                  ? 'الخصم يطلب مباراة ثأرية جديدة! هل تقبل التحدي؟'
                  : 'Opponent requested a rematch! Accept the challenge?'}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            {room?.rematchRequestedBy && room.rematchRequestedBy !== user.id ? (
              <button
                onClick={handleAcceptRematch}
                className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{language === 'ar' ? 'قبول مباراة الإياب الآن! 🔄' : 'Accept Rematch Kickoff! 🔄'}</span>
              </button>
            ) : (
              <button
                onClick={handleRequestRematch}
                disabled={room?.rematchRequestedBy === user.id}
                className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black rounded-xl text-sm shadow-lg shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <RotateCcw className="w-4 h-4" />
                <span>
                  {room?.rematchRequestedBy === user.id
                    ? (language === 'ar' ? 'بانتظار قبول الخصم...' : 'Waiting for Opponent...')
                    : (language === 'ar' ? 'طلب مباراة ثأرية (Rematch) 🔄' : 'Request Rematch 🔄')}
                </span>
              </button>
            )}

            <button
              onClick={handleCopyResult}
              className="w-full sm:w-auto px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {copiedResult ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedResult ? (language === 'ar' ? 'تم نسخ النتيجة!' : 'Copied!') : (language === 'ar' ? 'مشاركة النتيجة' : 'Share Result')}</span>
            </button>

            <button
              onClick={onBackToLobby}
              className="w-full sm:w-auto px-5 py-3.5 bg-transparent hover:bg-slate-800/60 text-slate-400 hover:text-white font-bold rounded-xl text-sm transition-all cursor-pointer"
            >
              <span>{language === 'ar' ? 'الرئيسية' : 'Back to Lobby'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
