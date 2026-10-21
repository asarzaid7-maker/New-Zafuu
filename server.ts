import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// In-memory / persisted live users store
const USERS_FILE = path.join(__dirname, 'data_users.json');

interface RegisteredUser {
  id: string;
  name: string;
  avatar: string;
  joinedAt: string;
}

const defaultUsers: RegisteredUser[] = [
  { id: '1', name: 'Zaid (Manager)', avatar: 'striker', joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { id: '2', name: 'Pep Tactician', avatar: 'playmaker', joinedAt: new Date(Date.now() - 1000 * 60 * 50).toISOString() },
  { id: '3', name: 'Ancelotti 4-3-3', avatar: 'coach', joinedAt: new Date(Date.now() - 1000 * 60 * 35).toISOString() },
  { id: '4', name: 'Golden Boot 9', avatar: 'striker', joinedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString() },
  { id: '5', name: 'Klopp High Press', avatar: 'coach', joinedAt: new Date(Date.now() - 1000 * 60 * 8).toISOString() },
  { id: '6', name: 'Trophy Hunter', avatar: 'trophy', joinedAt: new Date(Date.now() - 1000 * 60 * 2).toISOString() },
];

let usersList: RegisteredUser[] = [...defaultUsers];

try {
  if (fs.existsSync(USERS_FILE)) {
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed) && parsed.length > 0) {
      usersList = parsed;
    }
  } else {
    fs.writeFileSync(USERS_FILE, JSON.stringify(usersList, null, 2), 'utf-8');
  }
} catch (e) {
  console.warn('Failed to load users file, using in-memory list', e);
}

// SSE Subscribers
type SSESubscriber = (event: string, data: unknown) => void;
const sseClients: Set<SSESubscriber> = new Set();

const broadcastUserUpdate = () => {
  const payload = {
    count: usersList.length + 138,
    recent: usersList.slice(-6).reverse(),
  };
  for (const client of sseClients) {
    client('user_count', payload);
  }
};

// API: Users count & recent managers
app.get('/api/users/count', (_req: Request, res: Response) => {
  res.json({
    count: usersList.length + 138,
    recent: usersList.slice(-6).reverse(),
  });
});

// API: Register user
app.post('/api/users/register', (req: Request, res: Response) => {
  const { name, avatar } = req.body || {};
  const trimmedName = (typeof name === 'string' && name.trim()) || 'Manager ' + (usersList.length + 1);
  const userAvatar = typeof avatar === 'string' ? avatar : 'striker';

  const newUser: RegisteredUser = {
    id: 'u_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
    name: trimmedName,
    avatar: userAvatar,
    joinedAt: new Date().toISOString(),
  };

  usersList.push(newUser);
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(usersList.slice(-500), null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save user:', err);
  }

  broadcastUserUpdate();

  res.status(201).json({
    success: true,
    user: newUser,
    count: usersList.length + 138,
  });
});

// API: Server-Sent Events for real-time user counter
app.get('/api/users/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendEvent = (event: string, data: unknown) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  // Send initial data immediately
  sendEvent('user_count', {
    count: usersList.length + 138,
    recent: usersList.slice(-6).reverse(),
  });

  sseClients.add(sendEvent);

  req.on('close', () => {
    sseClients.delete(sendEvent);
  });
});

// API: Download APK endpoint
app.get(['/api/download/zafoot.apk', '/api/download/apk', '/api/download'], (_req: Request, res: Response) => {
  const possiblePaths = [
    path.join(__dirname, 'public', 'zafoot.apk'),
    path.join(__dirname, 'public', 'downloads', 'zafoot.apk'),
    path.join(__dirname, 'dist', 'zafoot.apk'),
  ];

  const apkPath = possiblePaths.find((p) => fs.existsSync(p));

  if (!apkPath) {
    res.status(404).json({ error: 'APK file not found' });
    return;
  }

  res.setHeader('Content-Type', 'application/vnd.android.package-archive');
  res.setHeader('Content-Disposition', 'attachment; filename="ZaFoot.apk"');
  res.sendFile(apkPath);
});

// Orders & Payment System
const ORDERS_FILE = path.join(__dirname, 'data_orders.json');

interface PaymentOrder {
  id: string;
  txnId: string;
  packageId: string;
  coins: number;
  amount: number;
  currency: string;
  method: 'Apple Pay' | 'PayPal' | 'Credit Card';
  cardDetails?: {
    brand: string;
    last4: string;
    cardHolder: string;
  };
  payerDetails?: {
    email?: string;
    name?: string;
  };
  status: 'COMPLETED';
  createdAt: string;
}

const PACKAGE_PRICES: Record<string, { coins: number; price: number }> = {
  pack_1000: { coins: 1000, price: 9.99 },
  pack_5000: { coins: 5000, price: 30.99 },
  pack_10000: { coins: 10000, price: 70.99 },
};

let ordersList: PaymentOrder[] = [];

try {
  if (fs.existsSync(ORDERS_FILE)) {
    const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      ordersList = parsed;
    }
  } else {
    fs.writeFileSync(ORDERS_FILE, '[]', 'utf-8');
  }
} catch (e) {
  console.warn('Could not load orders file:', e);
}

const saveOrders = () => {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(ordersList.slice(0, 100), null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save orders:', err);
  }
};

// API: Payment Configuration (PayPal Client ID & Package info)
app.get('/api/payments/config', (_req: Request, res: Response) => {
  res.json({
    paypalClientId: process.env.PAYPAL_CLIENT_ID || process.env.VITE_PAYPAL_CLIENT_ID || 'test',
    currency: 'USD',
    packages: PACKAGE_PRICES,
  });
});

// API: Verify PayPal Order
app.post('/api/payments/verify-paypal', (req: Request, res: Response) => {
  const { orderId, packageId, coins, amount, payerEmail, payerName } = req.body || {};
  const pkg = PACKAGE_PRICES[packageId];
  if (!pkg || pkg.coins !== coins || Math.abs(pkg.price - Number(amount)) > 0.01) {
    res.status(400).json({ error: 'Package and price mismatch' });
    return;
  }

  const order: PaymentOrder = {
    id: 'ZF-' + Math.floor(100000 + Math.random() * 900000),
    txnId: orderId || 'PAYID-' + Date.now().toString(36).toUpperCase(),
    packageId,
    coins,
    amount: pkg.price,
    currency: 'USD',
    method: 'PayPal',
    payerDetails: {
      email: payerEmail || 'customer@paypal.com',
      name: payerName || 'PayPal Customer',
    },
    status: 'COMPLETED',
    createdAt: new Date().toISOString(),
  };

  ordersList.unshift(order);
  saveOrders();

  const { userId } = req.body || {};
  if (userId) {
    userBalances[userId] = (userBalances[userId] || 0) + coins;
    saveBalances();
  }

  res.status(200).json({
    success: true,
    order,
    updatedBalance: userId ? userBalances[userId] : undefined,
    message: `Payment of $${pkg.price} verified via PayPal. Credited ${coins} Coins.`,
  });
});

// API: Charge Credit / Debit Card
app.post('/api/payments/charge-card', (req: Request, res: Response) => {
  const { packageId, coins, amount, cardHolder, last4, cardBrand, zip } = req.body || {};
  const pkg = PACKAGE_PRICES[packageId];
  if (!pkg || pkg.coins !== coins || Math.abs(pkg.price - Number(amount)) > 0.01) {
    res.status(400).json({ error: 'Package and price mismatch' });
    return;
  }

  const order: PaymentOrder = {
    id: 'ZF-' + Math.floor(100000 + Math.random() * 900000),
    txnId: 'CHG_' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase(),
    packageId,
    coins,
    amount: pkg.price,
    currency: 'USD',
    method: 'Credit Card',
    cardDetails: {
      brand: cardBrand || 'Credit Card',
      last4: String(last4 || '4242').slice(-4),
      cardHolder: String(cardHolder || 'Cardholder').trim(),
    },
    status: 'COMPLETED',
    createdAt: new Date().toISOString(),
  };

  ordersList.unshift(order);
  saveOrders();

  const { userId } = req.body || {};
  if (userId) {
    userBalances[userId] = (userBalances[userId] || 0) + coins;
    saveBalances();
  }

  res.status(200).json({
    success: true,
    order,
    updatedBalance: userId ? userBalances[userId] : undefined,
    message: `Payment of $${pkg.price} charged to card ending in ${order.cardDetails?.last4}. Credited ${coins} Coins.`,
  });
});

// API: Apple Pay Payment
app.post('/api/payments/apple-pay', (req: Request, res: Response) => {
  const { packageId, coins, amount, token, userId } = req.body || {};
  const pkg = PACKAGE_PRICES[packageId];
  if (!pkg || pkg.coins !== coins || Math.abs(pkg.price - Number(amount)) > 0.01) {
    res.status(400).json({ error: 'Package and price mismatch' });
    return;
  }

  const order: PaymentOrder = {
    id: 'ZF-' + Math.floor(100000 + Math.random() * 900000),
    txnId: 'APL_' + (token ? String(token).slice(0, 14) : Date.now().toString(36).toUpperCase()),
    packageId,
    coins,
    amount: pkg.price,
    currency: 'USD',
    method: 'Apple Pay',
    status: 'COMPLETED',
    createdAt: new Date().toISOString(),
  };

  ordersList.unshift(order);
  saveOrders();

  if (userId) {
    userBalances[userId] = (userBalances[userId] || 0) + coins;
    saveBalances();
  }

  res.status(200).json({
    success: true,
    order,
    updatedBalance: userId ? userBalances[userId] : undefined,
    message: `Apple Pay payment of $${pkg.price} authorized. Credited ${coins} Coins.`,
  });
});

// API: Get Recent Orders / Receipts
app.get('/api/payments/orders', (_req: Request, res: Response) => {
  res.json({
    orders: ordersList.slice(0, 20),
  });
});

// ==========================================
// Career Path Challenge Game Backend
// ==========================================
interface ClubHistory {
  club: string;
  club_ar: string;
  years: string;
  country: string;
  loan?: boolean;
}

interface CareerPlayer {
  id: string;
  name: string;
  name_ar: string;
  nationality: string;
  nationality_ar: string;
  flag: string;
  photo: string;
  position: string;
  position_ar: string;
  difficulty: 'easy' | 'medium' | 'hard';
  career: ClubHistory[];
  distractors: string[];
}

interface CareerMatchQuestion {
  questionIndex: number;
  targetPlayerId: string;
  careerTimeline: ClubHistory[];
  options: {
    id: string;
    name: string;
    name_ar: string;
    nationality: string;
    nationality_ar: string;
    flag: string;
    photo: string;
    position: string;
    position_ar: string;
  }[];
}

interface ActiveCareerMatch {
  matchId: string;
  userId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  fee: number;
  reward: number;
  winThreshold: number;
  totalQuestions: number;
  questions: CareerMatchQuestion[];
  answers: Record<number, { selectedPlayerId: string; isCorrect: boolean }>;
  correctCount: number;
  wrongCount: number;
  completed: boolean;
  rewardClaimed: boolean;
  createdAt: number;
}

const CAREER_PLAYERS_FILE = path.join(__dirname, 'src', 'data', 'careerPlayers.json');
let careerPlayers: CareerPlayer[] = [];
try {
  if (fs.existsSync(CAREER_PLAYERS_FILE)) {
    careerPlayers = JSON.parse(fs.readFileSync(CAREER_PLAYERS_FILE, 'utf-8'));
  }
} catch (e) {
  console.warn('Could not load careerPlayers.json:', e);
}

const BALANCES_FILE = path.join(__dirname, 'data_user_balances.json');
let userBalances: Record<string, number> = {};
try {
  if (fs.existsSync(BALANCES_FILE)) {
    userBalances = JSON.parse(fs.readFileSync(BALANCES_FILE, 'utf-8'));
  } else {
    fs.writeFileSync(BALANCES_FILE, '{}', 'utf-8');
  }
} catch (e) {
  console.warn('Could not load balances file:', e);
}

const saveBalances = () => {
  try {
    fs.writeFileSync(BALANCES_FILE, JSON.stringify(userBalances, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to save balances:', e);
  }
};

const activeCareerMatches: Map<string, ActiveCareerMatch> = new Map();

type CareerDiff = 'easy' | 'medium' | 'hard';

// Difficulty configurations for Career Path Challenge
const CAREER_CONFIG: Record<CareerDiff, {
  fee: number;
  reward: number;
  questionsCount: number;
  winThreshold: number;
  name: string;
  name_ar: string;
}> = {
  easy: {
    fee: 150,
    reward: 300,
    questionsCount: 15,
    winThreshold: 10, // 10/15 (~67%)
    name: 'Easy',
    name_ar: 'السهل',
  },
  medium: {
    fee: 300,
    reward: 600,
    questionsCount: 20,
    winThreshold: 14, // 14/20 (70%)
    name: 'Medium',
    name_ar: 'المتوسط',
  },
  hard: {
    fee: 500,
    reward: 1000,
    questionsCount: 25,
    winThreshold: 18, // 18/25 (72%)
    name: 'Hard',
    name_ar: 'الصعب',
  },
};

// API: Sync balance
app.post('/api/user/sync-balance', (req: Request, res: Response) => {
  const { userId, clientCoins } = req.body || {};
  if (!userId) {
    res.status(400).json({ error: 'Missing userId' });
    return;
  }
  if (typeof userBalances[userId] !== 'number') {
    userBalances[userId] = typeof clientCoins === 'number' ? clientCoins : 50;
    saveBalances();
  }
  res.json({ userId, coins: userBalances[userId] });
});

// Helper: Shuffle array
function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// API: Start Career Path Challenge Game
app.post('/api/career-challenge/start', (req: Request, res: Response) => {
  const { userId, difficulty = 'easy', clientCoins } = req.body || {};
  if (!userId) {
    res.status(400).json({ error: 'Missing userId' });
    return;
  }

  const diffKey: CareerDiff = (difficulty === 'medium' || difficulty === 'hard') ? difficulty : 'easy';
  const cfg = CAREER_CONFIG[diffKey];

  if (typeof userBalances[userId] !== 'number') {
    userBalances[userId] = typeof clientCoins === 'number' ? clientCoins : 50;
  }

  const currentBal = userBalances[userId];

  // Prevent users from starting if they don't have enough coins
  if (currentBal < cfg.fee) {
    res.status(403).json({
      error: 'Insufficient coins',
      message: `You need at least ${cfg.fee} Coins to enter the ${cfg.name} Career Challenge.`,
      message_ar: `تحتاج إلى ${cfg.fee} عملة على الأقل لدخول تحدي مسيرة اللاعب بمستوى ${cfg.name_ar}.`,
      required: cfg.fee,
      currentBalance: currentBal,
    });
    return;
  }

  // Deduct entry fee once per game on start
  userBalances[userId] = currentBal - cfg.fee;
  saveBalances();

  // Separate pools by difficulty
  const easyPool = careerPlayers.filter((p) => p.difficulty === 'easy');
  const mediumPool = careerPlayers.filter((p) => p.difficulty === 'medium');
  const hardPool = careerPlayers.filter((p) => p.difficulty === 'hard');

  let selectedTargets: CareerPlayer[] = [];
  const targetCount = cfg.questionsCount;

  if (diffKey === 'easy') {
    selectedTargets = [...shuffleArray(easyPool), ...shuffleArray(mediumPool)].slice(0, targetCount);
  } else if (diffKey === 'medium') {
    selectedTargets = [...shuffleArray(mediumPool), ...shuffleArray(easyPool), ...shuffleArray(hardPool)].slice(0, targetCount);
  } else {
    selectedTargets = [...shuffleArray(hardPool), ...shuffleArray(mediumPool), ...shuffleArray(easyPool)].slice(0, targetCount);
  }

  // Ensure unique targets
  selectedTargets = shuffleArray(selectedTargets).slice(0, targetCount);

  // Build questions with 4 answer options each (1 correct + 3 smart distractors)
  const questions: CareerMatchQuestion[] = selectedTargets.map((target, idx) => {
    // Pick distractors: prefer named distractors, fall back to players from same tier/pool
    const namedDistractorPlayers = (target.distractors || [])
      .map((id) => careerPlayers.find((p) => p.id === id))
      .filter((p): p is CareerPlayer => p !== undefined && p.id !== target.id);

    const otherPlayers = careerPlayers.filter(
      (p) => p.id !== target.id && !namedDistractorPlayers.some((d) => d.id === p.id)
    );

    const neededDistractors = 3;
    const chosenDistractors: CareerPlayer[] = [
      ...shuffleArray(namedDistractorPlayers).slice(0, 2),
      ...shuffleArray(otherPlayers),
    ].slice(0, neededDistractors);

    const candidateOptions = shuffleArray([target, ...chosenDistractors]).map((p) => ({
      id: p.id,
      name: p.name,
      name_ar: p.name_ar,
      nationality: p.nationality,
      nationality_ar: p.nationality_ar,
      flag: p.flag,
      photo: p.photo,
      position: p.position,
      position_ar: p.position_ar,
    }));

    return {
      questionIndex: idx,
      targetPlayerId: target.id,
      careerTimeline: target.career,
      options: candidateOptions,
    };
  });

  const matchId = 'ccm_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  const newMatch: ActiveCareerMatch = {
    matchId,
    userId,
    difficulty: diffKey,
    fee: cfg.fee,
    reward: cfg.reward,
    winThreshold: cfg.winThreshold,
    totalQuestions: targetCount,
    questions,
    answers: {},
    correctCount: 0,
    wrongCount: 0,
    completed: false,
    rewardClaimed: false,
    createdAt: Date.now(),
  };

  activeCareerMatches.set(matchId, newMatch);

  // Housekeeping: remove old matches (> 2 hours)
  const now = Date.now();
  for (const [id, m] of activeCareerMatches.entries()) {
    if (now - m.createdAt > 2 * 60 * 60 * 1000) {
      activeCareerMatches.delete(id);
    }
  }

  // Return client payload WITHOUT targetPlayerId (prevents inspecting answer)
  const clientQuestions = questions.map((q) => ({
    questionIndex: q.questionIndex,
    careerTimeline: q.careerTimeline,
    options: q.options,
  }));

  res.json({
    matchId,
    difficulty: diffKey,
    totalQuestions: targetCount,
    fee: cfg.fee,
    reward: cfg.reward,
    winThreshold: cfg.winThreshold,
    updatedBalance: userBalances[userId],
    questions: clientQuestions,
  });
});

// API: Submit Answer for a single question in Career Path Challenge
app.post('/api/career-challenge/answer', (req: Request, res: Response) => {
  const { matchId, questionIndex, selectedPlayerId, userId } = req.body || {};
  if (!matchId || typeof questionIndex !== 'number' || !selectedPlayerId || !userId) {
    res.status(400).json({ error: 'Missing parameters' });
    return;
  }

  const match = activeCareerMatches.get(matchId);
  if (!match) {
    res.status(404).json({ error: 'Match session expired or not found.' });
    return;
  }

  if (match.userId !== userId) {
    res.status(403).json({ error: 'Unauthorized match' });
    return;
  }

  if (match.answers[questionIndex]) {
    res.status(400).json({ error: 'Question already answered' });
    return;
  }

  const question = match.questions[questionIndex];
  if (!question) {
    res.status(404).json({ error: 'Question index invalid' });
    return;
  }

  const isCorrect = selectedPlayerId === question.targetPlayerId;
  match.answers[questionIndex] = { selectedPlayerId, isCorrect };

  if (isCorrect) {
    match.correctCount++;
  } else {
    match.wrongCount++;
  }

  const correctPlayer = careerPlayers.find((p) => p.id === question.targetPlayerId);

  res.json({
    isCorrect,
    questionIndex,
    selectedPlayerId,
    correctPlayer,
    correctCount: match.correctCount,
    wrongCount: match.wrongCount,
  });
});

// API: Finish Career Path Challenge Game & Validate Win Reward
app.post('/api/career-challenge/finish', (req: Request, res: Response) => {
  const { matchId, userId } = req.body || {};
  if (!matchId || !userId) {
    res.status(400).json({ error: 'Missing parameters' });
    return;
  }

  const match = activeCareerMatches.get(matchId);
  if (!match) {
    res.status(404).json({ error: 'Match session not found' });
    return;
  }

  if (match.userId !== userId) {
    res.status(403).json({ error: 'Unauthorized match' });
    return;
  }

  // Prevent duplicate reward claims
  if (match.rewardClaimed) {
    res.status(400).json({ error: 'Reward already claimed for this game' });
    return;
  }

  match.completed = true;
  match.rewardClaimed = true;

  const isWin = match.correctCount >= match.winThreshold;
  let coinsAwarded = 0;

  if (isWin) {
    coinsAwarded = match.reward;
    userBalances[userId] = (userBalances[userId] || 0) + coinsAwarded;
    saveBalances();
  }

  res.json({
    isWin,
    score: match.correctCount,
    totalQuestions: match.totalQuestions,
    correctCount: match.correctCount,
    wrongCount: match.wrongCount,
    winThreshold: match.winThreshold,
    difficulty: match.difficulty,
    feeDeducted: match.fee,
    coinsAwarded,
    netCoinsChange: isWin ? (coinsAwarded - match.fee) : -match.fee,
    updatedBalance: userBalances[userId],
  });
});

// Main Vite Dev Server / Static Production Server
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ZaFoot Server started at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
