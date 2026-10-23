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
  currentAnswer?: {
    selectedIndex: number;
    isCorrect: boolean;
    timeTaken: number;
  };
}

export interface Room1v1 {
  code: string;
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
}

// In-memory rooms
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

// Helper: Generate unique 6-character room code (e.g. ZF7K29)
const CODE_CHARS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
function generateRoomCode(): string {
  let code = '';
  for (let attempt = 0; attempt < 20; attempt++) {
    code = 'ZF';
    for (let i = 0; i < 4; i++) {
      code += CODE_CHARS.charAt(Math.floor(Math.random() * CODE_CHARS.length));
    }
    if (!rooms.has(code)) return code;
  }
  return 'ZF' + Math.floor(1000 + Math.random() * 9000);
}

// Broadcast message safely to both players
function broadcastToRoom(room: Room1v1, payload: Record<string, unknown>, excludeSocket?: WebSocket) {
  const jsonStr = JSON.stringify(payload);
  const sockets = [room.player1?.socket, room.player2?.socket].filter(
    (s): s is WebSocket => !!s && s.readyState === WebSocket.OPEN && s !== excludeSocket
  );
  for (const s of sockets) {
    s.send(jsonStr);
  }
}

// Send message to a specific player socket
function sendToSocket(socket: WebSocket | undefined, payload: Record<string, unknown>) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(payload));
  }
}

// Sanitize room data for client consumption (never reveal secret correctIndex during active question)
function getSafeRoomView(room: Room1v1, forPlayerId?: string) {
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
            // Reveal correct answer only on round_end
            correctIndex:
              room.status === 'round_end' ? currentQ?.correctIndex : undefined,
            explanation:
              room.status === 'round_end' ? currentQ?.explanation : undefined,
          }
        : undefined,
    rematchRequestedBy: room.rematchRequestedBy,
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

  // Pick fresh 30 questions
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

  // Short 1s count-in before first question
  setTimeout(() => {
    startNextQuestion(room);
  }, 1000);
}

// Setup WebSocket Server and Express Routes
export function setupOneVsOneMultiplayer(app: Express, server: http.Server) {
  const wss = new WebSocketServer({ server, path: '/ws/1v1' });

  wss.on('connection', (ws: WebSocket) => {
    let boundRoomCode: string | null = null;
    let boundPlayerId: string | null = null;

    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        const { type } = data;

        // 1. CREATE ROOM
        if (type === 'create_room') {
          const user = data.user || {};
          const roomCode = generateRoomCode();

          // Prepare 30 questions
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
            },
            status: 'waiting',
            questions: selectedQuestions,
            currentQuestionIndex: 0,
            questionStartTime: 0,
            questionDurationSec: 15,
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

        // 2. JOIN ROOM
        if (type === 'join_room') {
          const rawCode = String(data.roomCode || '').trim().toUpperCase();
          const user = data.user || {};
          const room = rooms.get(rawCode);

          if (!room) {
            sendToSocket(ws, {
              type: 'error',
              code: 'ROOM_NOT_FOUND',
              message: 'Room not found. Check the code and try again.',
              message_ar: 'الغرفة غير موجودة. تأكد من الرمز وحاول مجدداً.',
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

          // If same player or new Player 2
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
          };

          room.status = 'ready';
          boundRoomCode = room.code;
          boundPlayerId = player2Id;

          // Notify both players that Player 2 joined
          broadcastToRoom(room, {
            type: 'player_joined',
            room: getSafeRoomView(room),
          });
          return;
        }

        // 3. RECONNECT TO EXISTING ROOM
        if (type === 'reconnect') {
          const rawCode = String(data.roomCode || '').trim().toUpperCase();
          const playerId = data.playerId;
          const room = rooms.get(rawCode);

          if (!room) {
            sendToSocket(ws, {
              type: 'error',
              code: 'ROOM_NOT_FOUND',
              message: 'Session expired or room does not exist.',
              message_ar: 'انتهت صلاحية الجلسة أو الغرفة غير موجودة.',
            });
            return;
          }

          boundRoomCode = room.code;
          boundPlayerId = playerId;

          let playerMatched = false;
          if (room.player1.id === playerId) {
            room.player1.socket = ws;
            room.player1.connected = true;
            playerMatched = true;
          } else if (room.player2 && room.player2.id === playerId) {
            room.player2.socket = ws;
            room.player2.connected = true;
            playerMatched = true;
          }

          if (playerMatched) {
            sendToSocket(ws, {
              type: 'sync_state',
              room: getSafeRoomView(room, playerId),
            });
            broadcastToRoom(room, {
              type: 'player_connection_change',
              playerId,
              connected: true,
            });
          }
          return;
        }

        // 4. START MATCH (Host only)
        if (type === 'start_match') {
          const room = rooms.get(data.roomCode);
          if (!room) return;

          if (room.player1.id !== data.playerId) {
            sendToSocket(ws, {
              type: 'error',
              message: 'Only the room creator can start the match.',
              message_ar: 'منشئ الغرفة فقط هو من يستطيع بدء التحدي.',
            });
            return;
          }

          if (!room.player2) {
            sendToSocket(ws, {
              type: 'error',
              message: 'Waiting for a second player to join.',
              message_ar: 'بانتظار انضمام الخصم الثاني لبدء التحدي.',
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
          return;
        }

        // 5. SUBMIT ANSWER
        if (type === 'submit_answer') {
          const room = rooms.get(data.roomCode);
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
          if (!targetPlayer || targetPlayer.currentAnswer) return; // Prevent double answer

          const timeTaken = Math.round((Date.now() - room.questionStartTime) / 1000);
          targetPlayer.currentAnswer = {
            selectedIndex,
            isCorrect,
            timeTaken,
          };

          if (isCorrect) {
            targetPlayer.score += 100;
            targetPlayer.correctCount += 1;
          }

          // Acknowledge to submitting player with updated score
          sendToSocket(ws, {
            type: 'answer_received',
            questionIndex,
            selectedIndex,
            isCorrect,
            score: targetPlayer.score,
            correctCount: targetPlayer.correctCount,
          });

          // Broadcast real-time score update to both players
          broadcastToRoom(room, {
            type: 'live_score_update',
            playerId,
            player1Score: room.player1.score,
            player1CorrectCount: room.player1.correctCount,
            player2Score: room.player2 ? room.player2.score : 0,
            player2CorrectCount: room.player2 ? room.player2.correctCount : 0,
          });

          // Notify opponent that other player answered WITHOUT revealing choice
          broadcastToRoom(
            room,
            {
              type: 'opponent_answered',
              playerId,
            },
            ws
          );

          // Check if BOTH players have answered
          const p1Answered = !!room.player1.currentAnswer;
          const p2Answered = room.player2 ? !!room.player2.currentAnswer : true;

          if (p1Answered && p2Answered) {
            finishRound(room, 'both_answered');
          }
          return;
        }

        // 6. REQUEST REMATCH
        if (type === 'request_rematch') {
          const room = rooms.get(data.roomCode);
          if (!room || room.status !== 'finished') return;

          room.rematchRequestedBy = data.playerId;
          broadcastToRoom(room, {
            type: 'rematch_requested',
            requesterId: data.playerId,
          });
          return;
        }

        // 7. ACCEPT REMATCH
        if (type === 'accept_rematch') {
          const room = rooms.get(data.roomCode);
          if (!room || room.status !== 'finished') return;

          restartMatchWithRematch(room);
          return;
        }

        // 8. LEAVE ROOM
        if (type === 'leave_room') {
          const room = rooms.get(data.roomCode);
          if (room) {
            broadcastToRoom(
              room,
              {
                type: 'player_left',
                playerId: data.playerId,
              },
              ws
            );
          }
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

  // REST API Routes for 1v1 Room checks
  app.get('/api/1v1/room/:code', (req: Request, res: Response) => {
    const rawCode = String(req.params.code || '').trim().toUpperCase();
    const room = rooms.get(rawCode);
    if (!room) {
      res.status(404).json({ exists: false, error: 'Room not found' });
      return;
    }
    res.json({
      exists: true,
      room: getSafeRoomView(room),
    });
  });

  app.post('/api/1v1/create', (req: Request, res: Response) => {
    const { user } = req.body || {};
    const roomCode = generateRoomCode();
    const selectedQuestions = shuffle(questionPool).slice(0, 30);

    const newRoom: Room1v1 = {
      code: roomCode,
      createdAt: Date.now(),
      creatorId: user?.id || 'creator_' + Date.now(),
      player1: {
        id: user?.id || 'creator_' + Date.now(),
        name: user?.name || 'Player 1',
        avatar: user?.avatar || 'striker',
        customPhoto: user?.customPhoto,
        connected: false,
        score: 0,
        correctCount: 0,
      },
      status: 'waiting',
      questions: selectedQuestions,
      currentQuestionIndex: 0,
      questionStartTime: 0,
      questionDurationSec: 15,
    };

    rooms.set(roomCode, newRoom);
    res.json({
      success: true,
      roomCode,
      room: getSafeRoomView(newRoom),
    });
  });

  app.post('/api/1v1/join', (req: Request, res: Response) => {
    const { roomCode, user } = req.body || {};
    const rawCode = String(roomCode || '').trim().toUpperCase();
    const room = rooms.get(rawCode);

    if (!room) {
      res.status(404).json({
        success: false,
        error: 'ROOM_NOT_FOUND',
        message: 'Invalid room code.',
        message_ar: 'رمز الغرفة غير صحيح.',
      });
      return;
    }

    if (room.status === 'playing' || room.status === 'round_end') {
      res.status(400).json({
        success: false,
        error: 'MATCH_IN_PROGRESS',
        message: 'Match is already in progress.',
        message_ar: 'المباراة جارية حالياً.',
      });
      return;
    }

    if (room.player2 && room.player2.id !== user?.id && room.player2.connected) {
      res.status(400).json({
        success: false,
        error: 'ROOM_FULL',
        message: 'Room is already full.',
        message_ar: 'الغرفة ممتلئة بالفعل.',
      });
      return;
    }

    res.json({
      success: true,
      roomCode: room.code,
      room: getSafeRoomView(room),
    });
  });

  // Clean up rooms older than 3 hours
  setInterval(() => {
    const now = Date.now();
    for (const [code, r] of rooms.entries()) {
      if (now - r.createdAt > 3 * 60 * 60 * 1000) {
        if (r.timerTimeout) clearTimeout(r.timerTimeout);
        if (r.intermissionTimeout) clearTimeout(r.intermissionTimeout);
        rooms.delete(code);
      }
    }
  }, 10 * 60 * 1000);
}
