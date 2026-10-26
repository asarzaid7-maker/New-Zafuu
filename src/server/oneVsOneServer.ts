import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import express, { Express, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface QuestionData {
  id: string;
  category: string;
  difficulty: string;
  question: {
    en: string;
    ar: string;
  };
  options: {
    en: [string, string, string, string];
    ar: [string, string, string, string];
  };
  correctIndex: number;
  explanation: {
    en: string;
    ar: string;
  };
}

export interface PlayerSession {
  id: string;
  name: string;
  avatar: string;
  customPhoto?: string;
  socket?: WebSocket;
  connected: boolean;
  score: number;
  correctCount: number;
  lastSeen: number;
  currentAnswer?: {
    selectedIndex: number;
    isCorrect: boolean;
    timeTaken: number;
  };
}

export interface RoomEvent {
  id: number;
  timestamp: number;
  payload: Record<string, unknown>;
}

export interface Room1v1 {
  code: string; // 8-digit numeric string (e.g. 12345678)
  createdAt: number;
  creatorId: string;
  player1: PlayerSession;
  player2?: PlayerSession;
  status: 'waiting' | 'ready' | 'playing' | 'round_end' | 'finished';
  questions: QuestionData[];
  currentQuestionIndex: number;
  questionStartTime: number;
  questionDurationSec: number;
  timerTimeout?: NodeJS.Timeout;
  intermissionTimeout?: NodeJS.Timeout;
  rematchRequestedBy?: string;
  eventSeq: number;
  eventLog: RoomEvent[];
  sseSubscribers: Set<Response>;
}

// In-memory rooms map
const rooms = new Map<string, Room1v1>();

// Load Questions from JSON
let questionPool: QuestionData[] = [];
try {
  const qPath = path.join(__dirname, '..', 'data', 'questions1v1.json');
  if (fs.existsSync(qPath)) {
    questionPool = JSON.parse(fs.readFileSync(qPath, 'utf-8'));
  }
} catch (err) {
  console.error('Failed to load questions1v1.json:', err);
}

// Helper: Shuffle array
function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Helper: Validate 8-digit numeric code
export function isValid8DigitCode(code: string): boolean {
  return /^\d{8}$/.test(String(code || '').trim());
}

// Helper: Clean / normalize 8-digit code
export function normalize8DigitCode(code: string): string {
  return String(code || '').replace(/\D/g, '').slice(0, 8);
}

// Helper: Generate unique 8-digit numeric code
export function generate8DigitCode(): string {
  for (let attempt = 0; attempt < 100; attempt++) {
    const code = String(Math.floor(10000000 + Math.random() * 90000000));
    if (!rooms.has(code)) return code;
  }
  return String(Math.floor(10000000 + Math.random() * 90000000));
}

// Broadcast message safely to both players (WebSockets + Server-Sent Events + EventLog)
function broadcastToRoom(room: Room1v1, payload: Record<string, unknown>, excludeSocket?: WebSocket) {
  room.eventSeq = (room.eventSeq || 0) + 1;
  const seqPayload = {
    ...payload,
    _seq: room.eventSeq,
    _timestamp: Date.now(),
  };

  // 1. Append to event log for polling/sync
  if (!room.eventLog) room.eventLog = [];
  room.eventLog.push({
    id: room.eventSeq,
    timestamp: Date.now(),
    payload: seqPayload,
  });
  if (room.eventLog.length > 100) {
    room.eventLog = room.eventLog.slice(-100);
  }

  // 2. Broadcast to WebSockets
  const jsonStr = JSON.stringify(seqPayload);
  const sockets = [room.player1?.socket, room.player2?.socket].filter(
    (s): s is WebSocket => !!s && s.readyState === WebSocket.OPEN && s !== excludeSocket
  );
  for (const s of sockets) {
    try {
      s.send(jsonStr);
    } catch {
      // ignore broken socket
    }
  }

  // 3. Broadcast to all active SSE subscribers
  if (room.sseSubscribers && room.sseSubscribers.size > 0) {
    const sseMsg = `data: ${jsonStr}\n\n`;
    for (const res of room.sseSubscribers) {
      try {
        res.write(sseMsg);
      } catch {
        room.sseSubscribers.delete(res);
      }
    }
  }
}

// Send message to a specific player socket
function sendToSocket(socket: WebSocket | undefined, payload: Record<string, unknown>) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(payload));
  }
}

// Sanitize room data for client consumption
export function getSafeRoomView(room: Room1v1, forPlayerId?: string) {
  const currentQ = room.questions[room.currentQuestionIndex];
  return {
    code: room.code,
    status: room.status,
    creatorId: room.creatorId,
    totalQuestions: room.questions.length,
    currentQuestionIndex: room.currentQuestionIndex,
    questionStartTime: room.questionStartTime,
    questionDurationSec: room.questionDurationSec,
    player1: {
      id: room.player1.id,
      name: room.player1.name,
      avatar: room.player1.avatar,
      customPhoto: room.player1.customPhoto,
      connected: room.player1.connected,
      score: room.player1.score,
      correctCount: room.player1.correctCount,
      hasAnsweredCurrent: !!room.player1.currentAnswer,
    },
    player2: room.player2
      ? {
          id: room.player2.id,
          name: room.player2.name,
          avatar: room.player2.avatar,
          customPhoto: room.player2.customPhoto,
          connected: room.player2.connected,
          score: room.player2.score,
          correctCount: room.player2.correctCount,
          hasAnsweredCurrent: !!room.player2.currentAnswer,
        }
      : undefined,
    currentQuestion:
      room.status === 'playing' || room.status === 'round_end'
        ? {
            id: currentQ?.id,
            category: currentQ?.category,
            difficulty: currentQ?.difficulty,
            question: currentQ?.question,
            options: currentQ?.options,
            correctIndex: room.status === 'round_end' ? currentQ?.correctIndex : undefined,
            explanation: room.status === 'round_end' ? currentQ?.explanation : undefined,
          }
        : undefined,
    rematchRequestedBy: room.rematchRequestedBy,
    _seq: room.eventSeq,
  };
}

// Start question round
function startNextQuestion(room: Room1v1) {
  if (room.timerTimeout) clearTimeout(room.timerTimeout);
  if (room.intermissionTimeout) clearTimeout(room.intermissionTimeout);

  room.status = 'playing';
  room.questionStartTime = Date.now();
  room.questionDurationSec = 15;

  // Reset current answers
  room.player1.currentAnswer = undefined;
  if (room.player2) {
    room.player2.currentAnswer = undefined;
  }

  const currentQ = room.questions[room.currentQuestionIndex];
  if (!currentQ) {
    finishMatch(room);
    return;
  }

  // Broadcast question to both players WITHOUT correctIndex
  broadcastToRoom(room, {
    type: 'question_start',
    questionIndex: room.currentQuestionIndex,
    totalQuestions: room.questions.length,
    durationSec: room.questionDurationSec,
    startTime: room.questionStartTime,
    question: {
      id: currentQ.id,
      category: currentQ.category,
      difficulty: currentQ.difficulty,
      question: currentQ.question,
      options: currentQ.options,
    },
    player1Score: room.player1.score,
    player1CorrectCount: room.player1.correctCount,
    player2Score: room.player2 ? room.player2.score : 0,
    player2CorrectCount: room.player2 ? room.player2.correctCount : 0,
  });

  // Set 15-second server countdown
  room.timerTimeout = setTimeout(() => {
    finishRound(room, 'timeout');
  }, 15000);
}

// End current question round, reveal answer and scores, then queue next question
function finishRound(room: Room1v1, reason: 'both_answered' | 'timeout') {
  if (room.status !== 'playing') return;
  if (room.timerTimeout) clearTimeout(room.timerTimeout);

  room.status = 'round_end';
  const currentQ = room.questions[room.currentQuestionIndex];
  const correctIdx = currentQ.correctIndex;

  const p1Ans = room.player1.currentAnswer;
  const p2Ans = room.player2?.currentAnswer;

  broadcastToRoom(room, {
    type: 'round_end',
    reason,
    questionIndex: room.currentQuestionIndex,
    correctIndex: correctIdx,
    explanation: currentQ.explanation,
    player1Score: room.player1.score,
    player1CorrectCount: room.player1.correctCount,
    player2Score: room.player2 ? room.player2.score : 0,
    player2CorrectCount: room.player2 ? room.player2.correctCount : 0,
    player1Result: {
      selectedIndex: p1Ans ? p1Ans.selectedIndex : null,
      isCorrect: !!p1Ans?.isCorrect,
      scoreDelta: p1Ans?.isCorrect ? 100 : 0,
      totalScore: room.player1.score,
      correctCount: room.player1.correctCount,
    },
    player2Result: room.player2
      ? {
          selectedIndex: p2Ans ? p2Ans.selectedIndex : null,
          isCorrect: !!p2Ans?.isCorrect,
          scoreDelta: p2Ans?.isCorrect ? 100 : 0,
          totalScore: room.player2.score,
          correctCount: room.player2.correctCount,
        }
      : null,
  });

  // 2.5-second intermission before next question or finish
  room.intermissionTimeout = setTimeout(() => {
    if (room.currentQuestionIndex + 1 < room.questions.length) {
      room.currentQuestionIndex++;
      startNextQuestion(room);
    } else {
      finishMatch(room);
    }
  }, 2500);
}

// Finish match and announce final results
function finishMatch(room: Room1v1) {
  if (room.timerTimeout) clearTimeout(room.timerTimeout);
  if (room.intermissionTimeout) clearTimeout(room.intermissionTimeout);

  room.status = 'finished';

  const p1 = room.player1;
  const p2 = room.player2;

  let winnerId: string | 'draw' = 'draw';
  if (p2) {
    if (p1.score > p2.score) winnerId = p1.id;
    else if (p2.score > p1.score) winnerId = p2.id;
  } else {
    winnerId = p1.id;
  }

  broadcastToRoom(room, {
    type: 'match_finished',
    winnerId,
    totalQuestions: room.questions.length,
    player1: {
      id: p1.id,
      name: p1.name,
      avatar: p1.avatar,
      customPhoto: p1.customPhoto,
      score: p1.score,
      correctCount: p1.correctCount,
      accuracy: Math.round((p1.correctCount / room.questions.length) * 100),
    },
    player2: p2
      ? {
          id: p2.id,
          name: p2.name,
          avatar: p2.avatar,
          customPhoto: p2.customPhoto,
          score: p2.score,
          correctCount: p2.correctCount,
          accuracy: Math.round((p2.correctCount / room.questions.length) * 100),
        }
      : null,
  });
}

// Reset room for a 30-question Rematch
function restartMatchWithRematch(room: Room1v1) {
  if (room.timerTimeout) clearTimeout(room.timerTimeout);
  if (room.intermissionTimeout) clearTimeout(room.intermissionTimeout);

  const thirtyQuestions = shuffle(questionPool).slice(0, 30);
  room.questions = thirtyQuestions;
  room.currentQuestionIndex = 0;
  room.rematchRequestedBy = undefined;

  room.player1.score = 0;
  room.player1.correctCount = 0;
  room.player1.currentAnswer = undefined;

  if (room.player2) {
    room.player2.score = 0;
    room.player2.correctCount = 0;
    room.player2.currentAnswer = undefined;
  }

  broadcastToRoom(room, {
    type: 'rematch_started',
    room: getSafeRoomView(room),
  });

  setTimeout(() => {
    startNextQuestion(room);
  }, 1000);
}

// Main setup function: WebSocket + Express REST & SSE backend
export function setupOneVsOneMultiplayer(app: Express, server: http.Server) {
  // =========================================================================
  // 1. REST & SSE REAL-TIME ENDPOINTS (100% PROXY COMPATIBLE)
  // =========================================================================

  // UNIFIED ROOM ENTRY: Auto-Create if room does not exist, Join if waiting, or Reconnect
  app.post('/api/1v1/room/enter', (req: Request, res: Response) => {
    try {
      const { roomCode, user } = req.body || {};
      const code = normalize8DigitCode(roomCode);
      const targetUser = user || {};

      if (!isValid8DigitCode(code)) {
        res.status(400).json({
          success: false,
          error: 'INVALID_CODE',
          message: 'Please enter a valid 8-digit numeric code (e.g. 00123456).',
          message_ar: 'يرجى إدخال رمز صحيح مكون من 8 أرقام (مثال: 00123456).',
        });
        return;
      }

      const userId = targetUser.id || 'player_' + Date.now();
      const existing = rooms.get(code);

      // CASE 1: Room does not exist -> Automatically create room with Player 1 and wait
      if (!existing) {
        const selectedQuestions = shuffle(questionPool).slice(0, 30);
        const newRoom: Room1v1 = {
          code,
          createdAt: Date.now(),
          creatorId: userId,
          player1: {
            id: userId,
            name: targetUser.name || 'Player 1',
            avatar: targetUser.avatar || 'striker',
            customPhoto: targetUser.customPhoto,
            connected: true,
            score: 0,
            correctCount: 0,
            lastSeen: Date.now(),
          },
          status: 'waiting',
          questions: selectedQuestions,
          currentQuestionIndex: 0,
          questionStartTime: 0,
          questionDurationSec: 15,
          eventSeq: 0,
          eventLog: [],
          sseSubscribers: new Set(),
        };

        rooms.set(code, newRoom);

        res.json({
          success: true,
          action: 'created',
          roomCode: code,
          isHost: true,
          room: getSafeRoomView(newRoom, userId),
        });
        return;
      }

      // CASE 1.5: Room exists but was finished -> Reset room cleanly for a brand new match!
      if (existing.status === 'finished') {
        const selectedQuestions = shuffle(questionPool).slice(0, 30);
        existing.status = 'waiting';
        existing.createdAt = Date.now();
        existing.creatorId = userId;
        existing.questions = selectedQuestions;
        existing.currentQuestionIndex = 0;
        existing.questionStartTime = 0;
        existing.rematchRequestedBy = undefined;
        existing.player1 = {
          id: userId,
          name: targetUser.name || 'Player 1',
          avatar: targetUser.avatar || 'striker',
          customPhoto: targetUser.customPhoto,
          connected: true,
          score: 0,
          correctCount: 0,
          lastSeen: Date.now(),
        };
        existing.player2 = undefined;
        res.json({
          success: true,
          action: 'created',
          roomCode: code,
          isHost: true,
          room: getSafeRoomView(existing, userId),
        });
        return;
      }

      // CASE 2: Player 1 reconnecting
      if (existing.player1.id === userId) {
        existing.player1.connected = true;
        existing.player1.lastSeen = Date.now();
        if (targetUser.name) existing.player1.name = targetUser.name;
        if (targetUser.avatar) existing.player1.avatar = targetUser.avatar;
        if (targetUser.customPhoto) existing.player1.customPhoto = targetUser.customPhoto;

        res.json({
          success: true,
          action: 'reconnected',
          roomCode: code,
          isHost: true,
          room: getSafeRoomView(existing, userId),
        });
        return;
      }

      // CASE 3: Player 2 reconnecting
      if (existing.player2 && existing.player2.id === userId) {
        existing.player2.connected = true;
        existing.player2.lastSeen = Date.now();
        if (targetUser.name) existing.player2.name = targetUser.name;
        if (targetUser.avatar) existing.player2.avatar = targetUser.avatar;
        if (targetUser.customPhoto) existing.player2.customPhoto = targetUser.customPhoto;

        res.json({
          success: true,
          action: 'reconnected',
          roomCode: code,
          isHost: false,
          room: getSafeRoomView(existing, userId),
        });
        return;
      }

      // CASE 4: Room already has two players (and user is neither of them)
      if (existing.player2 && existing.player2.id !== userId) {
        res.status(400).json({
          success: false,
          error: 'ROOM_FULL',
          message: 'This room already has two players. Please choose a different 8-digit code.',
          message_ar: 'هذه الغرفة تضم لاعبين بالفعل. يرجى اختيار رمز آخر مكون من 8 أرقام.',
        });
        return;
      }

      // CASE 5: Match already in progress
      if (existing.status === 'playing' || existing.status === 'round_end') {
        res.status(400).json({
          success: false,
          error: 'MATCH_IN_PROGRESS',
          message: 'This match is already in progress between two other players.',
          message_ar: 'المباراة جارية بالفعل بين لاعبين آخرين.',
        });
        return;
      }

      // CASE 6: Player 2 joins the waiting Player 1!
      existing.player2 = {
        id: userId,
        name: targetUser.name || 'Player 2',
        avatar: targetUser.avatar || 'coach',
        customPhoto: targetUser.customPhoto,
        connected: true,
        score: 0,
        correctCount: 0,
        lastSeen: Date.now(),
      };

      existing.status = 'ready';

      // Broadcast player_joined to all listeners
      broadcastToRoom(existing, {
        type: 'player_joined',
        room: getSafeRoomView(existing),
      });

      // Automatically announce kickoff countdown (3 seconds) for synchronized start
      broadcastToRoom(existing, {
        type: 'match_starting',
        countDownSec: 3,
      });

      if (existing.timerTimeout) clearTimeout(existing.timerTimeout);
      existing.timerTimeout = setTimeout(() => {
        startNextQuestion(existing);
      }, 3000);

      res.json({
        success: true,
        action: 'joined',
        roomCode: code,
        isHost: false,
        room: getSafeRoomView(existing, userId),
      });
    } catch (e: any) {
      console.error('Error in /api/1v1/room/enter:', e);
      res.status(500).json({ success: false, error: 'SERVER_ERROR', message: e.message });
    }
  });

  // Create Room with 8-digit numeric code (legacy alias)
  app.post('/api/1v1/room/create', (req: Request, res: Response) => {
    try {
      const { roomCode, user } = req.body || {};
      const targetUser = user || {};

      let code = normalize8DigitCode(roomCode);
      if (!isValid8DigitCode(code)) {
        code = generate8DigitCode();
      }

      // Check if room with this code already exists
      const existing = rooms.get(code);
      if (existing) {
        // If room is expired or same user is recreating it
        const isExpired = Date.now() - existing.createdAt > 2 * 60 * 60 * 1000;
        const isSameCreator = existing.creatorId === targetUser.id;
        const isWaiting = existing.status === 'waiting';

        if (!isExpired && !isSameCreator && !isWaiting && existing.status !== 'finished') {
          res.status(400).json({
            success: false,
            error: 'CODE_IN_USE',
            message: 'This 8-digit code is already active in another match. Choose a different 8-digit code.',
            message_ar: 'هذا الرمز المكون من 8 أرقام قيد الاستخدام حالياً. اختر رمزاً آخر.',
          });
          return;
        }

        // Clean up timeouts
        if (existing.timerTimeout) clearTimeout(existing.timerTimeout);
        if (existing.intermissionTimeout) clearTimeout(existing.intermissionTimeout);
      }

      const selectedQuestions = shuffle(questionPool).slice(0, 30);
      const newRoom: Room1v1 = {
        code,
        createdAt: Date.now(),
        creatorId: targetUser.id || 'creator_' + Date.now(),
        player1: {
          id: targetUser.id || 'creator_' + Date.now(),
          name: targetUser.name || 'Player 1',
          avatar: targetUser.avatar || 'striker',
          customPhoto: targetUser.customPhoto,
          connected: true,
          score: 0,
          correctCount: 0,
          lastSeen: Date.now(),
        },
        status: 'waiting',
        questions: selectedQuestions,
        currentQuestionIndex: 0,
        questionStartTime: 0,
        questionDurationSec: 15,
        eventSeq: 0,
        eventLog: [],
        sseSubscribers: new Set(),
      };

      rooms.set(code, newRoom);

      res.json({
        success: true,
        roomCode: code,
        room: getSafeRoomView(newRoom),
      });
    } catch (e: any) {
      console.error('Error in /api/1v1/room/create:', e);
      res.status(500).json({ success: false, error: 'SERVER_ERROR', message: e.message });
    }
  });

  // Join Room with 8-digit numeric code
  app.post('/api/1v1/room/join', (req: Request, res: Response) => {
    try {
      const { roomCode, user } = req.body || {};
      const code = normalize8DigitCode(roomCode);
      const targetUser = user || {};

      if (!isValid8DigitCode(code)) {
        res.status(400).json({
          success: false,
          error: 'INVALID_CODE',
          message: 'Please enter a valid 8-digit numeric code (e.g. 12345678).',
          message_ar: 'يرجى إدخال رمز صحيح مكون من 8 أرقام (مثال: 12345678).',
        });
        return;
      }

      const room = rooms.get(code);
      if (!room) {
        res.status(404).json({
          success: false,
          error: 'ROOM_NOT_FOUND',
          message: `Room with code ${code} was not found. Check the code or ask Player 1 to create it first.`,
          message_ar: `لم يتم العثور على غرفة بالرمز ${code}. تأكد من الرمز أو اطلب من اللاعب 1 إنشاءها أولاً.`,
        });
        return;
      }

      const p1 = room.player1;
      const p2 = room.player2;

      // Check if re-joining as Player 1
      if (p1.id === targetUser.id) {
        p1.connected = true;
        p1.lastSeen = Date.now();
        res.json({
          success: true,
          roomCode: room.code,
          room: getSafeRoomView(room, targetUser.id),
        });
        return;
      }

      // Check if re-joining as Player 2
      if (p2 && p2.id === targetUser.id) {
        p2.connected = true;
        p2.lastSeen = Date.now();
        res.json({
          success: true,
          roomCode: room.code,
          room: getSafeRoomView(room, targetUser.id),
        });
        return;
      }

      // If room is full with another player
      if (p2 && p2.id !== targetUser.id && p2.connected) {
        res.status(400).json({
          success: false,
          error: 'ROOM_FULL',
          message: 'This room is already full (2 players are already in this match).',
          message_ar: 'هذه الغرفة ممتلئة بالفعل (لاعبان متصلان حالياً).',
        });
        return;
      }

      // If match is already playing or finished
      if (room.status === 'playing' || room.status === 'round_end') {
        res.status(400).json({
          success: false,
          error: 'MATCH_IN_PROGRESS',
          message: 'Match is already in progress between two other players.',
          message_ar: 'المباراة قد بدأت بالفعل بين لاعبين آخرين.',
        });
        return;
      }

      // Add as Player 2
      const player2Id = targetUser.id || 'p2_' + Date.now();
      room.player2 = {
        id: player2Id,
        name: targetUser.name || 'Player 2',
        avatar: targetUser.avatar || 'coach',
        customPhoto: targetUser.customPhoto,
        connected: true,
        score: 0,
        correctCount: 0,
        lastSeen: Date.now(),
      };

      room.status = 'ready';

      // Broadcast to all connected listeners that Player 2 joined
      broadcastToRoom(room, {
        type: 'player_joined',
        room: getSafeRoomView(room),
      });

      res.json({
        success: true,
        roomCode: room.code,
        room: getSafeRoomView(room, player2Id),
      });
    } catch (e: any) {
      console.error('Error in /api/1v1/room/join:', e);
      res.status(500).json({ success: false, error: 'SERVER_ERROR', message: e.message });
    }
  });

  // Start Match
  app.post('/api/1v1/room/start', (req: Request, res: Response) => {
    try {
      const { roomCode, playerId } = req.body || {};
      const code = normalize8DigitCode(roomCode);
      const room = rooms.get(code);

      if (!room) {
        res.status(404).json({ success: false, error: 'ROOM_NOT_FOUND' });
        return;
      }

      if (room.player1.id !== playerId) {
        res.status(403).json({
          success: false,
          error: 'NOT_HOST',
          message: 'Only the room creator (Player 1) can start the match.',
          message_ar: 'منشئ الغرفة فقط هو من يملك صلاحية إطلاق صافرة البداية.',
        });
        return;
      }

      if (!room.player2) {
        res.status(400).json({
          success: false,
          error: 'WAITING_PLAYER_2',
          message: 'Waiting for Player 2 to enter the room before starting.',
          message_ar: 'بانتظار انضمام اللاعب الثاني قبل بدء التحدي.',
        });
        return;
      }

      broadcastToRoom(room, {
        type: 'match_starting',
        countDownSec: 3,
      });

      setTimeout(() => {
        startNextQuestion(room);
      }, 3000);

      res.json({ success: true, message: 'Match starting in 3s' });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // Submit Answer
  app.post('/api/1v1/room/answer', (req: Request, res: Response) => {
    try {
      const { roomCode, playerId, questionIndex, selectedIndex } = req.body || {};
      const code = normalize8DigitCode(roomCode);
      const room = rooms.get(code);

      if (!room || room.status !== 'playing') {
        res.status(400).json({ success: false, error: 'NOT_PLAYING' });
        return;
      }

      if (questionIndex !== room.currentQuestionIndex) {
        res.status(400).json({ success: false, error: 'OUTDATED_QUESTION' });
        return;
      }

      const targetPlayer = room.player1.id === playerId ? room.player1 : room.player2;
      if (!targetPlayer) {
        res.status(404).json({ success: false, error: 'PLAYER_NOT_IN_ROOM' });
        return;
      }

      if (targetPlayer.currentAnswer) {
        // Prevent double answer
        res.json({
          success: true,
          alreadyAnswered: true,
          score: targetPlayer.score,
          correctCount: targetPlayer.correctCount,
        });
        return;
      }

      const currentQ = room.questions[room.currentQuestionIndex];
      const isCorrect = Number(selectedIndex) === currentQ.correctIndex;
      const timeTaken = Math.round((Date.now() - room.questionStartTime) / 1000);

      targetPlayer.currentAnswer = {
        selectedIndex: Number(selectedIndex),
        isCorrect,
        timeTaken,
      };

      if (isCorrect) {
        targetPlayer.score += 100;
        targetPlayer.correctCount += 1;
      }

      // Broadcast live scoreboard update to all devices
      broadcastToRoom(room, {
        type: 'live_score_update',
        playerId,
        player1Score: room.player1.score,
        player1CorrectCount: room.player1.correctCount,
        player2Score: room.player2 ? room.player2.score : 0,
        player2CorrectCount: room.player2 ? room.player2.correctCount : 0,
      });

      // Notify opponent that other player answered without revealing their choice
      broadcastToRoom(room, {
        type: 'opponent_answered',
        playerId,
      });

      // Check if BOTH players answered
      const p1Answered = !!room.player1.currentAnswer;
      const p2Answered = room.player2 ? !!room.player2.currentAnswer : true;

      if (p1Answered && p2Answered) {
        finishRound(room, 'both_answered');
      }

      res.json({
        success: true,
        isCorrect,
        score: targetPlayer.score,
        correctCount: targetPlayer.correctCount,
      });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // Rematch request / accept
  app.post('/api/1v1/room/rematch', (req: Request, res: Response) => {
    try {
      const { roomCode, playerId, action } = req.body || {};
      const code = normalize8DigitCode(roomCode);
      const room = rooms.get(code);

      if (!room || room.status !== 'finished') {
        res.status(400).json({ success: false, error: 'NOT_FINISHED' });
        return;
      }

      if (action === 'request') {
        room.rematchRequestedBy = playerId;
        broadcastToRoom(room, {
          type: 'rematch_requested',
          requesterId: playerId,
        });
        res.json({ success: true, status: 'requested' });
        return;
      }

      if (action === 'accept') {
        restartMatchWithRematch(room);
        res.json({ success: true, status: 'started' });
        return;
      }

      res.status(400).json({ success: false, error: 'INVALID_ACTION' });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // Server-Sent Events (SSE) Real-Time Stream for Room
  app.get('/api/1v1/room/:code/events', (req: Request, res: Response) => {
    const code = normalize8DigitCode(req.params.code);
    const room = rooms.get(code);

    if (!room) {
      res.status(404).json({ error: 'Room not found' });
      return;
    }

    const playerId = String(req.query.playerId || '');

    // Set up standard SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders?.();

    if (!room.sseSubscribers) {
      room.sseSubscribers = new Set();
    }
    room.sseSubscribers.add(res);

    // Update connection status
    if (playerId === room.player1.id) {
      room.player1.connected = true;
      room.player1.lastSeen = Date.now();
    } else if (room.player2 && playerId === room.player2.id) {
      room.player2.connected = true;
      room.player2.lastSeen = Date.now();
    }

    // Send initial sync payload
    const initialMsg = JSON.stringify({
      type: 'sync_state',
      room: getSafeRoomView(room, playerId),
    });
    res.write(`data: ${initialMsg}\n\n`);

    // Keep-alive heartbeat every 15s
    const keepAlive = setInterval(() => {
      try {
        res.write(': ping\n\n');
      } catch {
        clearInterval(keepAlive);
      }
    }, 15000);

    req.on('close', () => {
      clearInterval(keepAlive);
      if (room.sseSubscribers) {
        room.sseSubscribers.delete(res);
      }
    });
  });

  // Polling Sync Endpoint (High-reliability fallback for any network)
  app.get('/api/1v1/room/:code/sync', (req: Request, res: Response) => {
    const code = normalize8DigitCode(req.params.code);
    const room = rooms.get(code);

    if (!room) {
      res.status(404).json({ success: false, error: 'ROOM_NOT_FOUND' });
      return;
    }

    const since = parseInt(String(req.query.since || '0'), 10);
    const playerId = String(req.query.playerId || '');

    // Update lastSeen
    if (playerId === room.player1.id) {
      room.player1.connected = true;
      room.player1.lastSeen = Date.now();
    } else if (room.player2 && playerId === room.player2.id) {
      room.player2.connected = true;
      room.player2.lastSeen = Date.now();
    }

    const newEvents = (room.eventLog || []).filter((e) => e.id > since);

    res.json({
      success: true,
      room: getSafeRoomView(room, playerId),
      events: newEvents.map((e) => e.payload),
      lastSeq: room.eventSeq,
    });
  });

  // Get Room Status
  app.get('/api/1v1/room/:code', (req: Request, res: Response) => {
    const code = normalize8DigitCode(req.params.code);
    const room = rooms.get(code);

    if (!room) {
      res.status(404).json({ exists: false, error: 'Room not found' });
      return;
    }

    res.json({
      exists: true,
      room: getSafeRoomView(room),
    });
  });

  // =========================================================================
  // 2. WEBSOCKET SERVER (HYBRID SECONDARY TRANSPORT)
  // =========================================================================
  const wss = new WebSocketServer({ server, path: '/ws/1v1' });

  wss.on('connection', (ws: WebSocket) => {
    let boundRoomCode: string | null = null;
    let boundPlayerId: string | null = null;

    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        const { type } = data;

        // ENTER ROOM (UNIFIED: AUTO-CREATE OR JOIN)
        if (type === 'enter_room') {
          const user = data.user || {};
          const roomCode = normalize8DigitCode(data.roomCode);

          if (!isValid8DigitCode(roomCode)) {
            sendToSocket(ws, {
              type: 'error',
              code: 'INVALID_CODE',
              message: 'Please enter a valid 8-digit numeric code (e.g. 00123456).',
              message_ar: 'يرجى إدخال رمز صحيح مكون من 8 أرقام (مثال: 00123456).',
            });
            return;
          }

          const userId = user.id || 'player_' + Date.now();
          const existing = rooms.get(roomCode);

          if (!existing) {
            const selectedQuestions = shuffle(questionPool).slice(0, 30);
            const newRoom: Room1v1 = {
              code: roomCode,
              createdAt: Date.now(),
              creatorId: userId,
              player1: {
                id: userId,
                name: user.name || 'Player 1',
                avatar: user.avatar || 'striker',
                customPhoto: user.customPhoto,
                socket: ws,
                connected: true,
                score: 0,
                correctCount: 0,
                lastSeen: Date.now(),
              },
              status: 'waiting',
              questions: selectedQuestions,
              currentQuestionIndex: 0,
              questionStartTime: 0,
              questionDurationSec: 15,
              eventSeq: 0,
              eventLog: [],
              sseSubscribers: new Set(),
            };

            rooms.set(roomCode, newRoom);
            boundRoomCode = roomCode;
            boundPlayerId = userId;

            sendToSocket(ws, {
              type: 'room_created',
              roomCode,
              action: 'created',
              room: getSafeRoomView(newRoom, userId),
            });
            return;
          }

          // Player 1 reconnect
          if (existing.player1.id === userId) {
            existing.player1.socket = ws;
            existing.player1.connected = true;
            existing.player1.lastSeen = Date.now();
            boundRoomCode = roomCode;
            boundPlayerId = userId;
            sendToSocket(ws, {
              type: 'room_joined',
              roomCode,
              action: 'reconnected',
              room: getSafeRoomView(existing, userId),
            });
            return;
          }

          // Player 2 reconnect
          if (existing.player2 && existing.player2.id === userId) {
            existing.player2.socket = ws;
            existing.player2.connected = true;
            existing.player2.lastSeen = Date.now();
            boundRoomCode = roomCode;
            boundPlayerId = userId;
            sendToSocket(ws, {
              type: 'room_joined',
              roomCode,
              action: 'reconnected',
              room: getSafeRoomView(existing, userId),
            });
            return;
          }

          // Room full
          if (existing.player2 && existing.player2.id !== userId) {
            sendToSocket(ws, {
              type: 'error',
              code: 'ROOM_FULL',
              message: 'This room already has two players. Please choose a different 8-digit code.',
              message_ar: 'هذه الغرفة تضم لاعبين بالفعل. يرجى اختيار رمز آخر مكون من 8 أرقام.',
            });
            return;
          }

          // Match in progress
          if (existing.status === 'playing' || existing.status === 'round_end') {
            sendToSocket(ws, {
              type: 'error',
              code: 'MATCH_IN_PROGRESS',
              message: 'This match is already in progress.',
              message_ar: 'المباراة جارية بالفعل بين لاعبين آخرين.',
            });
            return;
          }

          // Player 2 joins
          existing.player2 = {
            id: userId,
            name: user.name || 'Player 2',
            avatar: user.avatar || 'coach',
            customPhoto: user.customPhoto,
            socket: ws,
            connected: true,
            score: 0,
            correctCount: 0,
            lastSeen: Date.now(),
          };

          existing.status = 'ready';
          boundRoomCode = roomCode;
          boundPlayerId = userId;

          broadcastToRoom(existing, {
            type: 'player_joined',
            room: getSafeRoomView(existing),
          });

          broadcastToRoom(existing, {
            type: 'match_starting',
            countDownSec: 3,
          });

          if (existing.timerTimeout) clearTimeout(existing.timerTimeout);
          existing.timerTimeout = setTimeout(() => {
            startNextQuestion(existing);
          }, 3000);
          return;
        }

        // CREATE ROOM (legacy)
        if (type === 'create_room') {
          const user = data.user || {};
          let roomCode = normalize8DigitCode(data.roomCode);
          if (!isValid8DigitCode(roomCode)) {
            roomCode = generate8DigitCode();
          }

          const selectedQuestions = shuffle(questionPool).slice(0, 30);
          const newRoom: Room1v1 = {
            code: roomCode,
            createdAt: Date.now(),
            creatorId: user.id || 'creator_' + Date.now(),
            player1: {
              id: user.id || 'creator_' + Date.now(),
              name: user.name || 'Player 1',
              avatar: user.avatar || 'striker',
              customPhoto: user.customPhoto,
              socket: ws,
              connected: true,
              score: 0,
              correctCount: 0,
              lastSeen: Date.now(),
            },
            status: 'waiting',
            questions: selectedQuestions,
            currentQuestionIndex: 0,
            questionStartTime: 0,
            questionDurationSec: 15,
            eventSeq: 0,
            eventLog: [],
            sseSubscribers: new Set(),
          };

          rooms.set(roomCode, newRoom);
          boundRoomCode = roomCode;
          boundPlayerId = newRoom.player1.id;

          sendToSocket(ws, {
            type: 'room_created',
            roomCode,
            room: getSafeRoomView(newRoom, boundPlayerId),
          });
          return;
        }

        // JOIN ROOM
        if (type === 'join_room') {
          const rawCode = normalize8DigitCode(data.roomCode);
          const user = data.user || {};
          const room = rooms.get(rawCode);

          if (!room) {
            sendToSocket(ws, {
              type: 'error',
              code: 'ROOM_NOT_FOUND',
              message: `Room with code ${rawCode} not found. Check the code and try again.`,
              message_ar: `الغرفة غير موجودة بالرمز ${rawCode}. تأكد من الرمز وحاول مجدداً.`,
            });
            return;
          }

          if (room.status === 'playing' || room.status === 'round_end') {
            sendToSocket(ws, {
              type: 'error',
              code: 'MATCH_ALREADY_IN_PROGRESS',
              message: 'This match is already in progress.',
              message_ar: 'المباراة قد بدأت بالفعل.',
            });
            return;
          }

          if (room.player2 && room.player2.id !== user.id && room.player2.connected) {
            sendToSocket(ws, {
              type: 'error',
              code: 'ROOM_FULL',
              message: 'This room is already full (2 players).',
              message_ar: 'الغرفة ممتلئة بالكامل (لاعبان).',
            });
            return;
          }

          const player2Id = user.id || 'p2_' + Date.now();
          room.player2 = {
            id: player2Id,
            name: user.name || 'Player 2',
            avatar: user.avatar || 'coach',
            customPhoto: user.customPhoto,
            socket: ws,
            connected: true,
            score: 0,
            correctCount: 0,
            lastSeen: Date.now(),
          };

          room.status = 'ready';
          boundRoomCode = room.code;
          boundPlayerId = player2Id;

          broadcastToRoom(room, {
            type: 'player_joined',
            room: getSafeRoomView(room),
          });
          return;
        }

        // START MATCH
        if (type === 'start_match') {
          const room = rooms.get(normalize8DigitCode(data.roomCode));
          if (!room || room.player1.id !== data.playerId || !room.player2) return;

          broadcastToRoom(room, {
            type: 'match_starting',
            countDownSec: 3,
          });

          setTimeout(() => {
            startNextQuestion(room);
          }, 3000);
          return;
        }

        // SUBMIT ANSWER
        if (type === 'submit_answer') {
          const room = rooms.get(normalize8DigitCode(data.roomCode));
          if (!room || room.status !== 'playing') return;

          const questionIndex = data.questionIndex;
          if (questionIndex !== room.currentQuestionIndex) return;

          const playerId = data.playerId;
          const selectedIndex = Number(
            data.selectedIndex !== undefined ? data.selectedIndex : data.selectedOptionIndex
          );
          const currentQ = room.questions[room.currentQuestionIndex];
          const isCorrect = selectedIndex === currentQ.correctIndex;

          const targetPlayer = room.player1.id === playerId ? room.player1 : room.player2;
          if (!targetPlayer || targetPlayer.currentAnswer) return;

          targetPlayer.currentAnswer = {
            selectedIndex,
            isCorrect,
            timeTaken: Math.round((Date.now() - room.questionStartTime) / 1000),
          };

          if (isCorrect) {
            targetPlayer.score += 100;
            targetPlayer.correctCount += 1;
          }

          sendToSocket(ws, {
            type: 'answer_received',
            questionIndex,
            selectedIndex,
            isCorrect,
            score: targetPlayer.score,
            correctCount: targetPlayer.correctCount,
          });

          broadcastToRoom(room, {
            type: 'live_score_update',
            playerId,
            player1Score: room.player1.score,
            player1CorrectCount: room.player1.correctCount,
            player2Score: room.player2 ? room.player2.score : 0,
            player2CorrectCount: room.player2 ? room.player2.correctCount : 0,
          });

          broadcastToRoom(room, {
            type: 'opponent_answered',
            playerId,
          }, ws);

          const p1Answered = !!room.player1.currentAnswer;
          const p2Answered = room.player2 ? !!room.player2.currentAnswer : true;

          if (p1Answered && p2Answered) {
            finishRound(room, 'both_answered');
          }
          return;
        }

        // REMATCH
        if (type === 'request_rematch') {
          const room = rooms.get(normalize8DigitCode(data.roomCode));
          if (!room || room.status !== 'finished') return;

          room.rematchRequestedBy = data.playerId;
          broadcastToRoom(room, {
            type: 'rematch_requested',
            requesterId: data.playerId,
          });
          return;
        }

        if (type === 'accept_rematch') {
          const room = rooms.get(normalize8DigitCode(data.roomCode));
          if (!room || room.status !== 'finished') return;

          restartMatchWithRematch(room);
          return;
        }
      } catch (err) {
        console.error('Error handling WebSocket message in 1v1:', err);
      }
    });

    ws.on('close', () => {
      if (boundRoomCode && boundPlayerId) {
        const room = rooms.get(boundRoomCode);
        if (room) {
          if (room.player1.id === boundPlayerId) {
            room.player1.connected = false;
          } else if (room.player2 && room.player2.id === boundPlayerId) {
            room.player2.connected = false;
          }
          broadcastToRoom(room, {
            type: 'player_connection_change',
            playerId: boundPlayerId,
            connected: false,
          });
        }
      }
    });
  });

  // Routine cleanup of rooms older than 3 hours
  setInterval(() => {
    const now = Date.now();
    for (const [code, r] of rooms.entries()) {
      if (now - r.createdAt > 3 * 60 * 60 * 1000) {
        if (r.timerTimeout) clearTimeout(r.timerTimeout);
        if (r.intermissionTimeout) clearTimeout(r.intermissionTimeout);
        rooms.delete(code);
      }
    }
  }, 30 * 60 * 1000);
}
