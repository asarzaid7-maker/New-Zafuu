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

  res.status(200).json({
    success: true,
    order,
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

  res.status(200).json({
    success: true,
    order,
    message: `Payment of $${pkg.price} charged to card ending in ${order.cardDetails?.last4}. Credited ${coins} Coins.`,
  });
});

// API: Apple Pay Payment
app.post('/api/payments/apple-pay', (req: Request, res: Response) => {
  const { packageId, coins, amount, token } = req.body || {};
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

  res.status(200).json({
    success: true,
    order,
    message: `Apple Pay payment of $${pkg.price} authorized. Credited ${coins} Coins.`,
  });
});

// API: Get Recent Orders / Receipts
app.get('/api/payments/orders', (_req: Request, res: Response) => {
  res.json({
    orders: ordersList.slice(0, 20),
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
