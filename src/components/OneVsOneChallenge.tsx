import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  LogIn,
  Crown,
  Dices,
  RefreshCw,
  Wifi,
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
  _seq?: number;
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
  // Navigation screen: 'lobby' | 'room' | 'match' | 'results'
  const [screen, setScreen] = useState<'lobby' | 'room' | 'match' | 'results'>('lobby');

  // 8-digit numeric room code input
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedResult, setCopiedResult] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'reconnecting' | 'idle'>('idle');

  // Active room data
  const [room, setRoom] = useState<RoomState | null>(null);

  // Round / Question state
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

  // Real-Time Stream References (SSE + Sync Polling + WebSocket)
  const eventSourceRef = useRef<EventSource | null>(null);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const lastSeqRef = useRef<number>(0);
  const boundCodeRef = useRef<string | null>(null);

  // Kickoff countdown (3s before match starts)
  const [kickoffCountdown, setKickoffCountdown] = useState<number | null>(null);

  // Helper to render player avatar
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

  // Process server messages uniformly (via SSE, Polling, or WebSocket)
  const handleServerMessage = useCallback((data: Record<string, any>) => {
    const { type } = data;
    if (!type) return;

    if (data._seq) {
      lastSeqRef.current = Math.max(lastSeqRef.current, data._seq);
    }

    // Room Created / Joined state sync
    if (type === 'room_created' || type === 'player_joined') {
      setRoom(data.room);
      setConnectionStatus('connected');
      setConnecting(false);
      setScreen('room');
      sounds.playWhistle();
      return;
    }

    // Match Starting countdown (3 seconds)
    if (type === 'match_starting') {
      sounds.playWhistle();
      const count = data.countDownSec || 3;
      setKickoffCountdown(count);
      const countdownTimer = setInterval(() => {
        setKickoffCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(countdownTimer);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
      return;
    }

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

    // Question Start (New Round)
    if (type === 'question_start') {
      setSelectedOption(null);
      setRoundResult(null);
      setKickoffCountdown(null);
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

      // Audio feedback for local player
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

    // Sync State
    if (type === 'sync_state') {
      setRoom(data.room);
      setConnectionStatus('connected');
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
  }, [language, room?.player1.id, user.id]);

  // Connect Real-Time Subscriptions (SSE + Polling + Non-blocking WS)
  const connectRealtime = useCallback((roomCode: string) => {
    boundCodeRef.current = roomCode;

    // 1. Close existing SSE and Poller
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
      syncIntervalRef.current = null;
    }

    // 2. Start Server-Sent Events (SSE) Stream
    try {
      const sseUrl = `/api/1v1/room/${roomCode}/events?playerId=${encodeURIComponent(user.id)}`;
      const es = new EventSource(sseUrl);

      es.onopen = () => {
        setConnectionStatus('connected');
      };

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleServerMessage(data);
        } catch (e) {
          console.warn('Failed to parse SSE payload:', e);
        }
      };

      es.onerror = () => {
        // SSE browser automatically retries; polling provides instant backup
        setConnectionStatus('reconnecting');
      };

      eventSourceRef.current = es;
    } catch (e) {
      console.warn('SSE creation error:', e);
    }

    // 3. Start High-Reliability Polling Sync (every 1000ms)
    syncIntervalRef.current = setInterval(async () => {
      if (!boundCodeRef.current) return;
      try {
        const resp = await fetch(
          `/api/1v1/room/${roomCode}/sync?since=${lastSeqRef.current}&playerId=${encodeURIComponent(user.id)}`
        );
        if (resp.ok) {
          const data = await resp.json();
          if (data.events && Array.isArray(data.events) && data.events.length > 0) {
            for (const ev of data.events) {
              handleServerMessage(ev);
            }
          }
          if (data.room && data.room.status) {
            setRoom((prev) => {
              if (!prev) return data.room;
              return {
                ...prev,
                status: data.room.status,
                player1: data.room.player1,
                player2: data.room.player2,
                currentQuestionIndex: data.room.currentQuestionIndex,
                currentQuestion: data.room.currentQuestion || prev.currentQuestion,
              };
            });
          }
          setConnectionStatus('connected');
        }
      } catch {
        // non-blocking
      }
    }, 1000);

    // 4. Optional parallel WebSocket (non-blocking fallback)
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/1v1`;
      const ws = new WebSocket(wsUrl);

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleServerMessage(data);
        } catch {}
      };

      wsRef.current = ws;
    } catch {
      // WS is non-essential since SSE + REST are active
    }
  }, [handleServerMessage, user.id]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      boundCodeRef.current = null;
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
      if (eventSourceRef.current) eventSourceRef.current.close();
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  // Quick helper to generate a random 8-digit numeric code
  const handleGenerateRandomCode = () => {
    const code = String(Math.floor(10000000 + Math.random() * 90000000));
    setRoomCodeInput(code);
    sounds.playClick();
  };

  // Helper to paste 8-digit code from clipboard
  const handlePasteCode = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const digits = text.replace(/\D/g, '').slice(0, 8);
      if (digits) {
        setRoomCodeInput(digits);
        sounds.playClick();
      }
    } catch {}
  };

  // Unified Action: Enter Room with 8-digit numeric code (Auto-creates if not exists, Joins if waiting)
  const handleEnterRoom = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const cleanCode = roomCodeInput.replace(/\D/g, '').slice(0, 8);
    if (cleanCode.length !== 8) {
      setErrorMessage(
        language === 'ar'
          ? 'يرجى إدخال رمز مكون من 8 أرقام (مثال: 00123456).'
          : 'Please enter an 8-digit numeric code (e.g. 00123456).'
      );
      sounds.playWrong();
      return;
    }

    setConnecting(true);
    sounds.playClick();

    try {
      const response = await fetch('/api/1v1/room/enter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomCode: cleanCode,
          user: {
            id: user.id,
            name: user.username,
            avatar: user.avatar,
            customPhoto: user.customPhoto,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setConnecting(false);
        setErrorMessage(
          language === 'ar'
            ? data.message_ar || data.message || 'تعذر الاتصال بالمباراة.'
            : data.message || 'Failed to connect to multiplayer match.'
        );
        sounds.playWrong();
        return;
      }

      setRoom(data.room);
      setConnecting(false);
      connectRealtime(data.roomCode);

      if (data.room.status === 'playing') {
        setScreen('match');
      } else if (data.room.status === 'finished') {
        setScreen('results');
      } else {
        setScreen('room');
      }

      sounds.playWhistle();
    } catch (e: any) {
      setConnecting(false);
      setErrorMessage(
        language === 'ar'
          ? 'تعذر الاتصال بخادم المباريات. تحقق من اتصال الإنترنت.'
          : 'Failed to connect to multiplayer server. Check your connection.'
      );
      sounds.playWrong();
    }
  };

  // Action: Start Match (Creator immediate trigger or override)
  const handleStartMatch = async () => {
    if (!room) return;
    sounds.playClick();

    try {
      await fetch('/api/1v1/room/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomCode: room.code,
          playerId: user.id,
        }),
      });
    } catch {}
  };

  // 4. Action: Submit Answer for current question
  const handleSubmitOption = async (optionIndex: number) => {
    if (!room || room.status !== 'playing' || selectedOption !== null) return;

    setSelectedOption(optionIndex);
    sounds.playClick();

    try {
      const res = await fetch('/api/1v1/room/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomCode: room.code,
          playerId: user.id,
          questionIndex: room.currentQuestionIndex,
          selectedIndex: optionIndex,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update local score immediately for instant response
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
      }
    } catch {}
  };

  // 5. Action: Rematch
  const handleRequestRematch = async () => {
    if (!room) return;
    sounds.playClick();
    try {
      await fetch('/api/1v1/room/rematch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomCode: room.code,
          playerId: user.id,
          action: 'request',
        }),
      });
    } catch {}
  };

  const handleAcceptRematch = async () => {
    if (!room) return;
    sounds.playClick();
    try {
      await fetch('/api/1v1/room/rematch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomCode: room.code,
          playerId: user.id,
          action: 'accept',
        }),
      });
    } catch {}
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
  // SCREEN 1: LOBBY (Enter 8-digit numeric code to Create or Join Room)
  // =========================================================================
  if (screen === 'lobby') {
    const is8DigitValid = /^\d{8}$/.test(roomCodeInput.trim());

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
                {language === 'ar' ? 'تحدي 1 ضد 1 المباشر أونلاين' : '1v1 Online Football Battle'}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              {language === 'ar'
                ? 'تحدَّ أصدقاءك على جهازين منفصلين عبر الإنترنت! يدخل كلا اللاعبين نفس الرمز المكون من 8 أرقام لبدء معركة الـ 30 سؤالاً.'
                : 'Challenge friends on separate devices over the internet! Both players enter the identical 8-digit code to play a live 30-question match.'}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl text-emerald-400 text-xs font-bold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Wifi className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'خادم التحدي المباشر متصل' : 'Online Multiplayer Live'}</span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm animate-shake">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
            <div className="flex-1">{errorMessage}</div>
          </div>
        )}

        {/* 1v1 Highlights Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black shrink-0">
              30
            </div>
            <div>
              <div className="font-bold text-white">
                {language === 'ar' ? '30 سؤالاً في كل مباراة' : '30 Questions Per Match'}
              </div>
              <div className="text-slate-400 text-[11px]">
                {language === 'ar' ? 'نفس الأسئلة والترتيب لكلا اللاعبين' : 'Synchronized identical questions'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-black shrink-0">
              15s
            </div>
            <div>
              <div className="font-bold text-white">
                {language === 'ar' ? '15 ثانية لكل سؤال' : '15s Synchronized Timer'}
              </div>
              <div className="text-slate-400 text-[11px]">
                {language === 'ar' ? 'إجابات مستقلة وسرعة حاسمة' : 'Independent real-time round clock'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black shrink-0">
              8#
            </div>
            <div>
              <div className="font-bold text-white">
                {language === 'ar' ? 'رمز 8 أرقام من اختياركما' : '8-Digit Custom Numeric Code'}
              </div>
              <div className="text-slate-400 text-[11px]">
                {language === 'ar' ? 'أدخل نفس الرمز على جهازين مختلفين' : 'Enter identical code on two devices'}
              </div>
            </div>
          </div>
        </div>

        {/* Central 8-Digit Room Entry Hub */}
        <div className="max-w-2xl mx-auto rounded-3xl border border-slate-800 bg-gradient-to-b from-[#0b1726] via-[#08121f] to-[#040910] p-6 sm:p-10 shadow-2xl space-y-8">
          <div className="text-center space-y-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 shadow">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'رمز الغرفة المباشر (8 أرقام)' : '8-Digit Room Code'}</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {language === 'ar' ? 'أدخل رمز الغرفة المكون من 8 أرقام' : 'Enter 8-Digit Numeric Code'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              {language === 'ar'
                ? 'اتفق مع منافسك على نفس الرمز المكون من 8 أرقام. يدخل اللاعب الأول وينتظر، ويدخل اللاعب الثاني نفس الرمز للانضمام فوراً.'
                : 'Both players choose the same 8-digit code. The first player enters and waits; the second player enters the same code to join.'}
            </p>
          </div>

          <form onSubmit={handleEnterRoom} className="space-y-6">
            {/* 8-Digit Input Field */}
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={8}
                  placeholder="00123456"
                  value={roomCodeInput}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 8);
                    setRoomCodeInput(cleaned);
                    setErrorMessage(null);
                  }}
                  className="w-full bg-[#050b12] border-2 border-slate-700 focus:border-amber-400 rounded-2xl px-4 py-4 text-2xl sm:text-4xl font-black tracking-[0.3em] text-center text-amber-300 font-mono shadow-inner outline-none transition-all placeholder:text-slate-600 placeholder:tracking-normal"
                />
                {roomCodeInput.length > 0 && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 font-bold">
                    {roomCodeInput.length}/8
                  </div>
                )}
              </div>

              {/* Quick Helper Tools */}
              <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
                <button
                  type="button"
                  onClick={handleGenerateRandomCode}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Dices className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'ar' ? 'توليد 8 أرقام عشوائية' : 'Generate 8 Digits'}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePasteCode}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{language === 'ar' ? 'لصق الرمز' : 'Paste Code'}</span>
                </button>

                {roomCodeInput.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setRoomCodeInput('')}
                    className="px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-rose-400 text-xs font-bold transition-all cursor-pointer"
                  >
                    {language === 'ar' ? 'مسح' : 'Clear'}
                  </button>
                )}
              </div>
            </div>

            {/* Current Player Preview Strip */}
            <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <FootballAvatar
                  player={{
                    id: user.id,
                    name: user.username,
                    avatar: user.avatar,
                    customPhoto: user.customPhoto,
                    connected: true,
                    score: 0,
                    correctCount: 0,
                  }}
                  size="sm"
                />
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                    <span>{user.username}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                      {language === 'ar' ? 'حسابك' : 'You'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {language === 'ar' ? 'جاهز للمنافسة الأونلاين' : 'Ready for online duel'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{language === 'ar' ? 'أونلاين' : 'Online'}</span>
              </div>
            </div>

            {/* Single Primary Action Button: Connect to Online Match */}
            <div>
              <button
                type="submit"
                disabled={connecting || !is8DigitValid}
                className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-2xl text-base sm:text-lg shadow-xl shadow-amber-500/25 active:scale-98 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-2">
                  {connecting ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Swords className="w-5 h-5 fill-slate-950" />
                  )}
                  <span>
                    {connecting
                      ? (language === 'ar' ? 'جارٍ الاتصال بالمباراة...' : 'Connecting to Match...')
                      : (language === 'ar' ? 'الاتصال بالمباراة الأونلاين' : 'Connect to Online Match')}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-slate-900/80">
                  {language === 'ar'
                    ? 'اللاعب الأول ينشئ وينتظر · اللاعب الثاني ينضم بنفس الرمز'
                    : 'First player enters & waits · Second player enters same code to join'}
                </span>
              </button>
            </div>
          </form>

          {/* Simple step-by-step instructions banner */}
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-xs text-slate-400 space-y-2">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>💡</span>
              <span>{language === 'ar' ? 'كيف يعمل التحدي الأونلاين؟' : 'How 1v1 Online Matchmaking Works:'}</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-[11px] sm:text-xs text-slate-300">
              <li>
                {language === 'ar'
                  ? 'اتفق مع منافسك على أي رمز مكون من 8 أرقام (مثال: 00123456).'
                  : 'Choose any 8-digit code with your opponent (e.g. 00123456).'}
              </li>
              <li>
                {language === 'ar'
                  ? 'يدخل اللاعب الأول الرمز، فيتم إنشاء الغرفة تلقائياً وينتظر منافسه.'
                  : 'The first player enters the code to automatically create the room and wait.'}
              </li>
              <li>
                {language === 'ar'
                  ? 'يدخل اللاعب الثاني نفس الرمز تماماً من جهازه للانضمام فوراً.'
                  : 'The second player enters the identical code on their device to join.'}
              </li>
              <li>
                {language === 'ar'
                  ? 'بمجرد اتصال كلا اللاعبين، تبدأ معركة الـ 30 سؤالاً الكروية مباشرة مع لوحة نتائج متزامنة!'
                  : 'Once both connect, the 30-question quiz kicks off with synchronized timers and scores!'}
              </li>
            </ol>
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
                boundCodeRef.current = null;
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowIcon className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'مغادرة الغرفة' : 'Leave Room'}</span>
          </button>

          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                connectionStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-ping'
              }`}
            />
            <span className="text-xs font-bold text-slate-300">
              {connectionStatus === 'connected'
                ? (language === 'ar' ? 'متصل بالخادم المباشر' : 'Live Room Connected')
                : (language === 'ar' ? 'جارٍ المزامنة...' : 'Syncing...')}
            </span>
          </div>
        </div>

        {/* Live Scoreboard displayed at top when both players enter the room */}
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

        {/* 8-Digit Room Code Card */}
        <div className="bg-gradient-to-br from-[#0c1a29] via-[#08121d] to-[#040a10] border border-amber-500/40 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xl relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'رمز الغرفة (8 أرقام)' : '8-Digit Room Code'}</span>
          </div>

          <div className="space-y-1">
            <div className="text-4xl sm:text-6xl font-black text-white tracking-[0.25em] font-mono py-2 select-all drop-shadow-md">
              {room.code}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              {language === 'ar'
                ? 'أعطِ هذا الرمز المكون من 8 أرقام لمنافسك ليدخله من جهازه وينضم فوراً للمباراة.'
                : 'Share this 8-digit code with your friend so they can join on their device!'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleCopyCode}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
            >
              {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>
                {copiedCode
                  ? (language === 'ar' ? 'تم نسخ الرمز بنجاح!' : 'Code Copied!')
                  : (language === 'ar' ? 'نسخ الرمز المكون من 8 أرقام' : 'Copy 8-Digit Code')}
              </span>
            </button>
          </div>
        </div>

        {/* Versus Players Tunnel Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
          {/* PLAYER 1 (Host) */}
          <div className="rounded-2xl border border-slate-700 bg-[#09121f] p-5 sm:p-6 flex items-center gap-4 relative shadow-lg">
            <FootballAvatar player={room.player1} size="lg" isCurrent={room.player1.id === user.id} side="left" />

            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black text-white">{room.player1.name}</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                  {language === 'ar' ? 'المضيف (P1)' : 'Host (P1)'}
                </span>
                {room.player1.id === user.id && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    {language === 'ar' ? 'أنت' : 'You'}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{language === 'ar' ? 'متصل وجاهز للمباراة' : 'Connected & Ready'}</span>
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
                <FootballAvatar player={room.player2} size="lg" isCurrent={room.player2.id === user.id} side="right" />

                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-black text-white">{room.player2.name}</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                      {language === 'ar' ? 'المنافس (P2)' : 'Challenger (P2)'}
                    </span>
                    {room.player2.id === user.id && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                        {language === 'ar' ? 'أنت' : 'You'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>{language === 'ar' ? 'متصل وجاهز للمباراة' : 'Connected & Ready'}</span>
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
                  {language === 'ar'
                    ? `أعطِ الرمز ${room.code} لصديقك ليدخله من جهازه`
                    : `Tell your friend to enter code ${room.code} on their device`}
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
                <span>
                  {language === 'ar'
                    ? 'كلا اللاعبين متصلان الآن! جاهزون لانطلاق صافرة بداية الـ 30 سؤالاً'
                    : 'Both players connected! Ready for 30-question kickoff'}
                </span>
              </div>

              <div>
                {kickoffCountdown !== null ? (
                  <div className="py-2 space-y-1">
                    <div className="text-amber-400 font-black text-2xl sm:text-3xl animate-bounce">
                      {language === 'ar'
                        ? `صافرة البداية خلال ${kickoffCountdown}... ⚡`
                        : `Kickoff in ${kickoffCountdown}... ⚡`}
                    </div>
                    <p className="text-xs text-slate-300">
                      {language === 'ar'
                        ? 'استعد! السؤال 1 من الـ 30 سؤالاً سينطلق الآن'
                        : 'Get ready! Question 1 of 30 launching now'}
                    </p>
                  </div>
                ) : isHost ? (
                  <button
                    onClick={handleStartMatch}
                    className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-base shadow-xl shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mx-auto"
                  >
                    <Play className="w-5 h-5 fill-slate-950" />
                    <span>{language === 'ar' ? 'ابدأ تحدي الـ 30 سؤالاً الآن! 🚀' : 'Start 30-Question Challenge! 🚀'}</span>
                  </button>
                ) : (
                  <div className="text-sm font-bold text-amber-300 animate-pulse py-2">
                    {language === 'ar'
                      ? 'بانتظار المضيف أو انطلاق صافرة البداية...'
                      : 'Waiting for match kickoff...'}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-xs sm:text-sm text-slate-400 py-2">
              {language === 'ar'
                ? `لا يمكنك بدء المباراة حتى ينضم اللاعب الثاني باستخدام رمز الغرفة (${room.code}) أعلاه.`
                : `Match will become available as soon as Player 2 enters code ${room.code} above.`}
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // SCREEN 3: LIVE 1V1 MATCH HUD (30 Synchronized Questions)
  // =========================================================================
  if (screen === 'match' && room && room.currentQuestion) {
    const q = room.currentQuestion;
    const isP1 = room.player1.id === user.id;
    const opponent = isP1 ? room.player2 : room.player1;

    const progressPct = ((room.currentQuestionIndex + 1) / room.totalQuestions) * 100;
    const isRoundEnd = room.status === 'round_end' && roundResult !== null;

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
              <span>+100</span> {language === 'ar' ? 'نقطة / هدف' : 'Pts / Goal'}
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
                  : (language === 'ar' ? 'تم تسجيل إجابتك! بانتظار إجابة الخصم أو انتهاء الـ 15 ثانية...' : 'Answer locked in! Waiting for opponent or timer...')}
              </span>
            </div>
          )}

          {/* Round End Explanation Reveal Banner */}
          {isRoundEnd && roundResult && (
            <div className="p-4 bg-slate-900/90 border border-slate-700 rounded-xl text-xs sm:text-sm space-y-1.5 animate-fadeIn">
              <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'ar' ? 'الإجابة الصحيحة وحقيقة الهدف:' : 'Correct Answer & Football Fact:'}</span>
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
