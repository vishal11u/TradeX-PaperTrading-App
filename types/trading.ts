export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
}

export interface Position {
  id: string;
  symbol: string;
  optionType: "CALL" | "PUT";
  strike: number;
  expiry: Date;
  side: "BUY" | "SELL";
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  entryTime: Date;
  underlying: string;
  iv: number;
  delta?: number;
  theta?: number;
  stopLoss?: number;
  trailingStopLoss?: number;
  trailingOffset?: number; // How much to trail by
  target?: number;
}

export interface Order {
  id: string;
  symbol: string;
  optionType: "CALL" | "PUT";
  strike: number;
  expiry: Date;
  underlying: string;
  type: "MARKET" | "LIMIT" | "STOP_LOSS";
  side: "BUY" | "SELL";
  quantity: number;
  price?: number;
  stopLoss?: number;
  trailingStopLoss?: number; // Initial trailing SL
  target?: number;
  status: "PENDING" | "EXECUTED" | "CANCELLED" | "REJECTED";
  timestamp: Date;
  executedPrice?: number;
  executedTime?: Date;
}

export interface OptionContract {
  symbol: string;
  strike: number;
  type: "CALL" | "PUT";
  expiry: Date;
  bid: number;
  ask: number;
  ltp: number;
  volume: number;
  oi: number;
  iv: number;
  delta?: number;
  gamma?: number;
  theta?: number;
  vega?: number;
}

export interface OptionChain {
  underlying: string;
  underlyingPrice: number;
  expiries: Date[];
  strikes: number[];
  calls: Record<string, OptionContract>;
  puts: Record<string, OptionContract>;
}

export interface Trade {
  id: string;
  symbol: string;
  optionType: "CALL" | "PUT";
  strike: number;
  expiry: Date;
  underlying: string;
  side: "BUY" | "SELL";
  quantity: number;
  price: number;
  amount: number;
  timestamp: Date;
  pnl?: number;
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  marketMood: "BULLISH" | "BEARISH" | "SIDEWAYS" | "VOLATILE";
  mistakes: string;
  goodWork: string;
  notes: string;
  pnlReflection: number;
  timestamp: Date;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  source: string;
  timestamp: Date;
  sentiment: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
  impact: "HIGH" | "MEDIUM" | "LOW";
  category: "GLOBAL" | "MARKET" | "ECONOMY" | "CRYPTO";
}

export interface RiskSettings {
  dailyLossLimit: number; // Percentage
  circuitBreakerEnabled: boolean;
  maxTradesPerDay: number;
  isLocked: boolean;
  unlockTime?: Date;
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  type: "TRADE" | "THOUGHT" | "MILESTONE";
  content: string;
  trades?: Trade[];
  stats?: {
    pnl: number;
    winRate: number;
  };
  likes: number;
  comments: number;
  timestamp: Date;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  rank: number;
  totalPnL: number;
  winRate: number;
  winStreak: number;
}

export interface Portfolio {
  balance: number;
  totalPnL: number;
  totalPnLPercent: number;
  positions: Position[];
  orders: Order[];
  trades: Trade[];
  journal: JournalEntry[];
  realizedPnL: number;
  unrealizedPnL: number;
  investedValue: number;
  currentValue: number;
  riskSettings: RiskSettings;
}

export interface Candle {
  time: number; // Unix timestamp in seconds
  open: number;
  high: number;
  low: number;
  close: number;
}
