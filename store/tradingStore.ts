import { create } from "zustand";
import {
  Stock,
  Position,
  Order,
  Portfolio,
  OptionChain,
  Trade,
  OptionContract,
  JournalEntry,
  NewsItem,
  CommunityPost,
  LeaderboardEntry,
  RiskSettings,
  Candle,
} from "@/types/trading";

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
}

const isMarketOpen = () => {
  const now = new Date();
  const day = now.getDay();
  if (day === 0 || day === 6) return false; // Weekend

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = hours * 60 + minutes;

  const marketStart = 9 * 60 + 15; // 09:15 AM
  const marketEnd = 15 * 60 + 30; // 03:30 PM

  return currentTime >= marketStart && currentTime <= marketEnd;
};

interface TradingStore {
  marketStatus: "OPEN" | "CLOSED";
  // Portfolio state
  portfolio: Portfolio;

  // Market data
  stocks: Stock[];
  selectedStock: Stock | null;
  selectedOption: OptionContract | null;
  optionChain: OptionChain | null;
  priceHistory: Record<string, { time: string; price: number }[]>;
  candleHistory: Record<string, Candle[]>;
  currentCandles: Record<string, Candle>;

  // Watchlist
  watchlist: string[];

  // Actions
  setSelectedStock: (stock: Stock) => void;
  setSelectedOption: (option: OptionContract | null) => void;
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;

  // Trading actions
  placeOrder: (order: Omit<Order, "id" | "timestamp" | "status">) => void;
  cancelOrder: (orderId: string) => void;
  exitPosition: (positionId: string) => void;

  // Market data updates
  updateStockPrices: () => void;
  syncMarketData: () => Promise<void>;
  updateOptionChain: (symbol: string) => void;

  // Navigation & Theme
  activeScreen:
    | "dashboard"
    | "analytics"
    | "wallet"
    | "history"
    | "journal"
    | "news"
    | "community"
    | "backtest"
    | "profile";
  setActiveScreen: (
    screen:
      | "dashboard"
      | "analytics"
      | "wallet"
      | "history"
      | "journal"
      | "news"
      | "community"
      | "backtest"
      | "profile",
  ) => void;
  theme: "dark" | "light";
  toggleTheme: () => void;

  // News & Community
  news: NewsItem[];
  communityPosts: CommunityPost[];
  leaderboard: LeaderboardEntry[];
  fetchNews: () => Promise<void>;
  addCommunityPost: (
    post: Omit<CommunityPost, "id" | "timestamp" | "likes" | "comments">,
  ) => void;
  isPublicProfile: boolean;
  togglePublicProfile: () => void;

  // Risk Management
  updateRiskSettings: (settings: Partial<RiskSettings>) => void;
  checkRiskLimits: () => void;

  // Journal
  addJournalEntry: (entry: Omit<JournalEntry, "id" | "timestamp">) => void;
  deleteJournalEntry: (id: string) => void;

  // Toasts
  toasts: Toast[];
  addToast: (message: string, type: Toast["type"]) => void;
  removeToast: (id: string) => void;

  // Initialize
  initialize: () => void;
}

const INITIAL_STOCKS: Stock[] = [
  {
    symbol: "NIFTY",
    name: "NIFTY 50",
    price: 24300,
    change: 0,
    changePercent: 0,
    volume: 0,
    high: 24350,
    low: 24250,
    open: 24280,
    previousClose: 24300,
  },
  {
    symbol: "BANKNIFTY",
    name: "BANK NIFTY",
    price: 52500,
    change: 0,
    changePercent: 0,
    volume: 0,
    high: 52600,
    low: 52400,
    open: 52450,
    previousClose: 52500,
  },
  {
    symbol: "FINNIFTY",
    name: "FIN NIFTY",
    price: 23800,
    change: 0,
    changePercent: 0,
    volume: 0,
    high: 23850,
    low: 23750,
    open: 23780,
    previousClose: 23800,
  },
  {
    symbol: "SENSEX",
    name: "SENSEX",
    price: 80000,
    change: 0,
    changePercent: 0,
    volume: 0,
    high: 80100,
    low: 79900,
    open: 79950,
    previousClose: 80000,
  },
];

const getLotSize = (symbol: string) => {
  switch (symbol) {
    case "NIFTY":
      return 75;
    case "BANKNIFTY":
      return 25;
    case "FINNIFTY":
      return 25;
    case "SENSEX":
      return 10;
    default:
      return 1;
  }
};

const generateOptionContract = (
  underlying: string,
  underlyingPrice: number,
  strike: number,
  type: "CALL" | "PUT",
  expiry: Date,
  iv: number,
): OptionContract => {
  const distance = Math.abs(underlyingPrice - strike);
  const isITM =
    type === "CALL" ? underlyingPrice > strike : underlyingPrice < strike;

  // Realistic option pricing simulation (Black-Scholes approximation)
  const timeToExpiry = 7; // days
  // Intrinsic value
  const intrinsic = isITM ? Math.abs(underlyingPrice - strike) : 0;

  // Realistic time value (simplified Greek approx)
  // Scaling by / 5000 to bring NIFTY ATM options to ~100-200 range
  const timeValue = Math.max(
    1,
    (iv * Math.sqrt(timeToExpiry) * (underlyingPrice / 4500)) /
      (distance / 50 + 1),
  );

  const ltp = intrinsic + timeValue;
  const spread = Math.max(0.05, ltp * 0.01);

  return {
    symbol: `${underlying}${strike}${type.charAt(0)}`,
    strike,
    type,
    expiry,
    bid: Math.max(0.05, ltp - spread / 2),
    ask: ltp + spread / 2,
    ltp: Math.max(0.05, ltp),
    volume: Math.floor(Math.random() * 1000000),
    oi: Math.floor(Math.random() * 5000000),
    iv,
    delta:
      type === "CALL"
        ? isITM
          ? 0.6 + Math.random() * 0.3
          : 0.1 + Math.random() * 0.4
        : isITM
          ? -0.6 - Math.random() * 0.3
          : -0.1 - Math.random() * 0.4,
    gamma: 0.001 + Math.random() * 0.002,
    theta: -(1 + Math.random() * 5),
    vega: 5 + Math.random() * 10,
  };
};

export const useTradingStore = create<TradingStore>((set, get) => ({
  portfolio: {
    balance: 1000000, // Starting with 10 Lakhs
    totalPnL: 0,
    totalPnLPercent: 0,
    positions: [],
    orders: [],
    trades: [],
    journal: [],
    realizedPnL: 0,
    unrealizedPnL: 0,
    investedValue: 0,
    currentValue: 0,
    riskSettings: {
      dailyLossLimit: 5,
      circuitBreakerEnabled: true,
      maxTradesPerDay: 10,
      isLocked: false,
    },
  },

  stocks: INITIAL_STOCKS,
  selectedStock: INITIAL_STOCKS[0],
  selectedOption: null,
  optionChain: null,
  priceHistory: {},
  candleHistory: {},
  currentCandles: {},
  watchlist: ["NIFTY", "BANKNIFTY", "FINNIFTY", "SENSEX"],

  news: [],
  communityPosts: [
    {
      id: "post1",
      userId: "user1",
      userName: "QuantMaster",
      type: "TRADE",
      content: "Caught the NIFTY reversal perfectly!",
      stats: { pnl: 45200, winRate: 68 },
      likes: 24,
      comments: 5,
      timestamp: new Date(),
    },
  ],
  leaderboard: [
    {
      userId: "u1",
      userName: "TradeWizard",
      rank: 1,
      totalPnL: 852000,
      winRate: 72,
      winStreak: 8,
    },
    {
      userId: "u2",
      userName: "NiftyWhale",
      rank: 2,
      totalPnL: 420000,
      winRate: 65,
      winStreak: 4,
    },
  ],
  isPublicProfile: false,

  activeScreen: "dashboard",
  setActiveScreen: (screen) => set({ activeScreen: screen }),
  theme: "dark",
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "dark" ? "light" : "dark";
      get().addToast(`Switched to ${newTheme} mode`, "info");
      return { theme: newTheme };
    }),

  fetchNews: async () => {
    // Mock news fetching
    const mockNews: NewsItem[] = [
      {
        id: "n1",
        title: "Global Markets Rally on Inflation Data",
        content: "NIFTY and S&P 500 show strong bullish momentum...",
        source: "Bloomberg",
        timestamp: new Date(),
        sentiment: "POSITIVE",
        impact: "HIGH",
        category: "GLOBAL",
      },
      {
        id: "n2",
        title: "Fed Interest Rate Decision Looming",
        content: "Analysts expect a 25bps cut in the next meeting...",
        source: "Reuters",
        timestamp: new Date(),
        sentiment: "NEUTRAL",
        impact: "MEDIUM",
        category: "ECONOMY",
      },
    ];
    set({ news: mockNews });
  },

  addCommunityPost: (post) => {
    const newPost: CommunityPost = {
      ...post,
      id: `CP${Date.now()}`,
      timestamp: new Date(),
      likes: 0,
      comments: 0,
    };
    set((state) => ({ communityPosts: [newPost, ...state.communityPosts] }));
    get().addToast("Post shared with community!", "success");
  },

  togglePublicProfile: () => {
    set((state) => ({ isPublicProfile: !state.isPublicProfile }));
    get().addToast(
      `Profile visibility: ${get().isPublicProfile ? "Public" : "Private"}`,
      "info",
    );
  },

  updateRiskSettings: (settings) => {
    set((state) => ({
      portfolio: {
        ...state.portfolio,
        riskSettings: { ...state.portfolio.riskSettings, ...settings },
      },
    }));
    get().addToast("Risk settings updated", "success");
  },

  checkRiskLimits: () => {
    const { portfolio, addToast } = get();
    const { trades, riskSettings } = portfolio;

    if (!riskSettings.circuitBreakerEnabled) return;

    // Check trades per day
    const today = new Date().toDateString();
    const tradesToday = trades.filter(
      (t) => new Date(t.timestamp).toDateString() === today,
    ).length;

    if (tradesToday >= riskSettings.maxTradesPerDay && !riskSettings.isLocked) {
      set((state) => ({
        portfolio: {
          ...state.portfolio,
          riskSettings: { ...state.portfolio.riskSettings, isLocked: true },
        },
      }));
      addToast(
        "Circuit Breaker Triggered: Max trades per day reached.",
        "error",
      );
    }

    // Check daily loss percentage
    const dailyPnLPercent = (portfolio.realizedPnL / portfolio.balance) * 100;
    if (
      dailyPnLPercent <= -riskSettings.dailyLossLimit &&
      !riskSettings.isLocked
    ) {
      set((state) => ({
        portfolio: {
          ...state.portfolio,
          riskSettings: { ...state.portfolio.riskSettings, isLocked: true },
        },
      }));
      addToast("Circuit Breaker Triggered: Daily loss limit reached.", "error");
    }
  },

  marketStatus: isMarketOpen() ? "OPEN" : "CLOSED",

  toasts: [],
  addToast: (message, type) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
    setTimeout(() => get().removeToast(id), 3000);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  setSelectedStock: (stock) => {
    set({ selectedStock: stock, selectedOption: null });
    get().updateOptionChain(stock.symbol);
    get().addToast(`Selected ${stock.symbol}`, "info");
  },

  setSelectedOption: (option) => {
    set({ selectedOption: option });
    if (option) {
      get().addToast(`Selected ${option.type} ${option.strike}`, "info");
    }
  },

  addJournalEntry: (entry) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newEntry: JournalEntry = {
      ...entry,
      id,
      timestamp: new Date(),
    };
    set((state) => ({
      portfolio: {
        ...state.portfolio,
        journal: [newEntry, ...state.portfolio.journal],
      },
    }));
    get().addToast("Journal entry saved", "success");
  },

  deleteJournalEntry: (id) => {
    set((state) => ({
      portfolio: {
        ...state.portfolio,
        journal: state.portfolio.journal.filter((j) => j.id !== id),
      },
    }));
    get().addToast("Journal entry deleted", "info");
  },

  addToWatchlist: (symbol) => {
    const { watchlist } = get();
    if (!watchlist.includes(symbol)) {
      set({ watchlist: [...watchlist, symbol] });
      get().addToast(`Added ${symbol} to watchlist`, "success");
    }
  },

  removeFromWatchlist: (symbol) => {
    set({ watchlist: get().watchlist.filter((s) => s !== symbol) });
    get().addToast(`Removed ${symbol} from watchlist`, "info");
  },

  placeOrder: (orderData) => {
    const { portfolio, selectedOption, optionChain, marketStatus, addToast } =
      get();

    if (marketStatus === "CLOSED") {
      addToast("Market is currently closed. Cannot place orders.", "error");
      return;
    }

    if (portfolio.riskSettings.isLocked) {
      addToast(
        "Account is locked by Circuit Breaker. Controls restricted.",
        "error",
      );
      return;
    }

    if (!selectedOption || !optionChain) return;

    const lotSize = getLotSize(orderData.underlying);
    const totalQuantity = orderData.quantity * lotSize;

    const order: Order = {
      ...orderData,
      id: `ORD${Date.now()}`,
      timestamp: new Date(),
      status: "PENDING",
    };

    // Auto-execute Market Orders
    if (order.type === "MARKET") {
      const executedPrice =
        order.side === "BUY" ? selectedOption.ask : selectedOption.bid;
      const amount = executedPrice * totalQuantity;

      if (order.side === "BUY" && amount > portfolio.balance) {
        order.status = "REJECTED";
        set({
          portfolio: { ...portfolio, orders: [...portfolio.orders, order] },
        });
        return;
      }

      order.status = "EXECUTED";
      order.executedPrice = executedPrice;
      order.executedTime = new Date();

      const position: Position = {
        id: `POS${Date.now()}`,
        symbol: selectedOption.symbol,
        optionType: selectedOption.type,
        strike: selectedOption.strike,
        expiry: selectedOption.expiry,
        underlying: order.underlying,
        side: order.side,
        quantity: totalQuantity,
        avgPrice: executedPrice,
        currentPrice: executedPrice,
        pnl: 0,
        pnlPercent: 0,
        entryTime: new Date(),
        iv: selectedOption.iv,
        delta: selectedOption.delta,
        theta: selectedOption.theta,
        stopLoss: order.stopLoss,
        target: order.target,
        trailingStopLoss: order.trailingStopLoss,
        trailingOffset: order.trailingStopLoss
          ? executedPrice - order.trailingStopLoss
          : undefined,
      };

      const trade: Trade = {
        id: `TRD${Date.now()}`,
        symbol: selectedOption.symbol,
        optionType: selectedOption.type,
        strike: selectedOption.strike,
        expiry: selectedOption.expiry,
        underlying: order.underlying,
        side: order.side,
        quantity: totalQuantity,
        price: executedPrice,
        amount,
        timestamp: new Date(),
      };

      set({
        portfolio: {
          ...portfolio,
          balance:
            order.side === "BUY"
              ? portfolio.balance - amount
              : portfolio.balance + amount,
          positions: [...portfolio.positions, position],
          orders: [...portfolio.orders, order],
          trades: [...portfolio.trades, trade],
        },
      });
      addToast(`${order.side} order executed for ${order.symbol}`, "success");
    } else {
      set({
        portfolio: { ...portfolio, orders: [...portfolio.orders, order] },
      });
      addToast(`${order.type} order placed for ${order.symbol}`, "info");
    }
    get().checkRiskLimits();
  },

  cancelOrder: (orderId) => {
    const { portfolio, addToast } = get();
    set({
      portfolio: {
        ...portfolio,
        orders: portfolio.orders.map((o) =>
          o.id === orderId ? { ...o, status: "CANCELLED" } : o,
        ),
      },
    });
    addToast(`Order ${orderId} cancelled`, "info");
  },

  exitPosition: (positionId) => {
    const { portfolio, optionChain, marketStatus, addToast } = get();

    if (marketStatus === "CLOSED") {
      addToast(
        "Market is currently closed. Cannot square off positions.",
        "error",
      );
      return;
    }

    const position = portfolio.positions.find((p) => p.id === positionId);
    if (!position || !optionChain) return;

    const optionKey = `${position.underlying}-${position.strike}-${position.optionType}`;
    const currentOption = (
      position.optionType === "CALL" ? optionChain.calls : optionChain.puts
    )[optionKey];
    if (!currentOption) return;

    const exitPrice =
      position.side === "BUY" ? currentOption.bid : currentOption.ask;
    const pnl =
      position.side === "BUY"
        ? (exitPrice - position.avgPrice) * position.quantity
        : (position.avgPrice - exitPrice) * position.quantity;

    const trade: Trade = {
      id: `TRD${Date.now()}`,
      symbol: position.symbol,
      optionType: position.optionType,
      strike: position.strike,
      expiry: position.expiry,
      underlying: position.underlying,
      side: position.side === "BUY" ? "SELL" : "BUY",
      quantity: position.quantity,
      price: exitPrice,
      amount: exitPrice * position.quantity,
      timestamp: new Date(),
      pnl: pnl,
    };

    set({
      portfolio: {
        ...portfolio,
        balance:
          portfolio.balance +
          (position.side === "BUY"
            ? exitPrice * position.quantity
            : -(exitPrice * position.quantity)),
        realizedPnL: (portfolio.realizedPnL || 0) + pnl,
        positions: portfolio.positions.filter((p) => p.id !== positionId),
        trades: [...portfolio.trades, trade],
      },
    });
    addToast(
      `Position closed for ${position.symbol}. P&L: ₹${pnl.toFixed(2)}`,
      pnl >= 0 ? "success" : "info",
    );
  },

  syncMarketData: async () => {
    const { stocks, marketStatus } = get();

    // Update market status
    const currentStatus = isMarketOpen() ? "OPEN" : "CLOSED";
    if (currentStatus !== marketStatus) set({ marketStatus: currentStatus });

    // In a real app, we usually don't fetch live data if market is closed
    if (currentStatus === "CLOSED") return;

    try {
      const response = await fetch("/api/market-data");
      if (response.ok) {
        const freshStocks: Stock[] = await response.json();

        // Merge fresh data with local state to avoid jumps
        const updatedStocks = stocks.map((s) => {
          const match = freshStocks.find((fs) => fs.symbol === s.symbol);
          return match ? { ...s, ...match } : s;
        });

        set({ stocks: updatedStocks });
      }
    } catch (e) {
      console.error("Market sync failed", e);
    }
  },

  updateStockPrices: () => {
    const { stocks, portfolio, optionChain, selectedOption, marketStatus } =
      get();

    // Stop ticks if market is closed to be realistic
    if (marketStatus === "CLOSED") return;

    // Update stocks and history
    const newHistory = { ...get().priceHistory };
    const newCandleHistory = { ...get().candleHistory };
    const newCurrentCandles = { ...get().currentCandles };

    const updatedStocks = stocks.map((stock) => {
      const change = (Math.random() - 0.5) * (stock.price * 0.001);
      const newPrice = stock.price + change;

      // Update history
      const history = newHistory[stock.symbol] || [];
      const updatedHistory = [
        ...history,
        {
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          price: newPrice,
        },
      ].slice(-5000); // Keep last 5000 points (approx 1.5 hours)
      newHistory[stock.symbol] = updatedHistory;

      // Update Candles
      const now = Math.floor(Date.now() / 1000);
      const currentCandle = newCurrentCandles[stock.symbol];

      if (!currentCandle) {
        newCurrentCandles[stock.symbol] = {
          time: now,
          open: stock.price,
          high: Math.max(stock.price, newPrice),
          low: Math.min(stock.price, newPrice),
          close: newPrice,
        };
      } else {
        const candleMinute = Math.floor(currentCandle.time / 60);
        const currentMinute = Math.floor(now / 60);

        if (currentMinute > candleMinute) {
          const history = newCandleHistory[stock.symbol] || [];
          newCandleHistory[stock.symbol] = [...history, currentCandle].slice(
            -5000,
          );
          newCurrentCandles[stock.symbol] = {
            time: now,
            open: newPrice,
            high: newPrice,
            low: newPrice,
            close: newPrice,
          };
        } else {
          newCurrentCandles[stock.symbol] = {
            ...currentCandle,
            high: Math.max(currentCandle.high, newPrice),
            low: Math.min(currentCandle.low, newPrice),
            close: newPrice,
          };
        }
      }

      return {
        ...stock,
        price: newPrice,
        change: newPrice - stock.previousClose,
        changePercent:
          ((newPrice - stock.previousClose) / stock.previousClose) * 100,
        high: Math.max(stock.high, newPrice),
        low: Math.min(stock.low, newPrice),
      };
    });

    set({
      stocks: updatedStocks,
      priceHistory: newHistory,
      candleHistory: newCandleHistory,
      currentCandles: newCurrentCandles,
    });

    // Update Options and Positions
    let updatedOptionChain = optionChain;
    let updatedSelectedOption = selectedOption;

    if (optionChain) {
      const underlying = updatedStocks.find(
        (s) => s.symbol === optionChain.underlying,
      );
      if (underlying) {
        const updatedCalls = { ...optionChain.calls };
        const updatedPuts = { ...optionChain.puts };

        // Update all strike prices based on underlying movement
        optionChain.strikes.forEach((strike) => {
          ["CALL", "PUT"].forEach((type) => {
            const key = `${optionChain.underlying}-${strike}-${type}`;
            const contract =
              type === "CALL" ? updatedCalls[key] : updatedPuts[key];
            if (contract) {
              const delta = contract.delta || 0.5;
              const priceChange =
                (underlying.price - optionChain.underlyingPrice) * delta;
              const newLtp = Math.max(
                0.05,
                contract.ltp + priceChange + (Math.random() - 0.5) * 0.2,
              );
              const updated = {
                ...contract,
                ltp: newLtp,
                bid: Math.max(0.05, newLtp - newLtp * 0.01),
                ask: newLtp + newLtp * 0.01,
              };
              if (type === "CALL") updatedCalls[key] = updated;
              else updatedPuts[key] = updated;

              if (selectedOption?.symbol === updated.symbol)
                updatedSelectedOption = updated;
            }
          });
        });

        updatedOptionChain = {
          ...optionChain,
          underlyingPrice: underlying.price,
          calls: updatedCalls,
          puts: updatedPuts,
        };
      }
    }

    // Process Positions: P&L, SL, Target, Trailing SL
    const updatedPositions: Position[] = [];
    const positionsToExit: string[] = [];

    portfolio.positions.forEach((pos) => {
      if (!updatedOptionChain) {
        updatedPositions.push(pos);
        return;
      }

      const key = `${pos.underlying}-${pos.strike}-${pos.optionType}`;
      const contract = (
        pos.optionType === "CALL"
          ? updatedOptionChain.calls
          : updatedOptionChain.puts
      )[key];

      if (!contract) {
        updatedPositions.push(pos);
        return;
      }

      const currentPrice = pos.side === "BUY" ? contract.bid : contract.ask;
      const pnl =
        pos.side === "BUY"
          ? (currentPrice - pos.avgPrice) * pos.quantity
          : (pos.avgPrice - currentPrice) * pos.quantity;

      let newSL = pos.stopLoss;
      let newTrailingSL = pos.trailingStopLoss;

      // Trailing SL Logic
      if (pos.trailingStopLoss && pos.trailingOffset) {
        if (pos.side === "BUY") {
          const potentialTrailingSL = currentPrice - pos.trailingOffset;
          if (potentialTrailingSL > (pos.trailingStopLoss || 0)) {
            newTrailingSL = potentialTrailingSL;
          }
        } else {
          // SELL
          const potentialTrailingSL = currentPrice + pos.trailingOffset;
          if (potentialTrailingSL < (pos.trailingStopLoss || 999999)) {
            newTrailingSL = potentialTrailingSL;
          }
        }
      }

      const updatedPos = {
        ...pos,
        currentPrice,
        pnl,
        pnlPercent: (pnl / (pos.avgPrice * pos.quantity)) * 100,
        trailingStopLoss: newTrailingSL,
      };

      // Check Exit Conditions
      const effectiveSL = newTrailingSL || pos.stopLoss;
      const hitSL =
        effectiveSL &&
        (pos.side === "BUY"
          ? currentPrice <= effectiveSL
          : currentPrice >= effectiveSL);
      const hitTarget =
        pos.target &&
        (pos.side === "BUY"
          ? currentPrice >= pos.target
          : currentPrice <= pos.target);

      if (hitSL || hitTarget) {
        positionsToExit.push(pos.id);
      } else {
        updatedPositions.push(updatedPos);
      }
    });

    // Batch Update
    set({
      stocks: updatedStocks,
      optionChain: updatedOptionChain,
      selectedOption: updatedSelectedOption,
      selectedStock: get().selectedStock
        ? updatedStocks.find((s) => s.symbol === get().selectedStock?.symbol) ||
          get().selectedStock
        : null,
      portfolio: {
        ...portfolio,
        positions: updatedPositions,
        unrealizedPnL: updatedPositions.reduce((s, p) => s + p.pnl, 0),
        totalPnL:
          (portfolio.realizedPnL || 0) +
          updatedPositions.reduce((s, p) => s + p.pnl, 0),
        totalPnLPercent:
          ((portfolio.realizedPnL || 0) +
            updatedPositions.reduce((s, p) => s + p.pnl, 0)) /
          10000,
        investedValue: updatedPositions.reduce(
          (s, p) => s + p.avgPrice * p.quantity,
          0,
        ),
        currentValue: updatedPositions.reduce(
          (s, p) => s + p.currentPrice * p.quantity,
          0,
        ),
      },
    });

    // Auto-exit if needed
    positionsToExit.forEach((id) => get().exitPosition(id));
  },

  updateOptionChain: (symbol) => {
    const { stocks } = get();
    const stock = stocks.find((s) => s.symbol === symbol);
    if (!stock) return;

    const strikes: number[] = [];
    const strikeInterval =
      symbol === "SENSEX"
        ? 100
        : ["BANKNIFTY", "FINNIFTY"].includes(symbol)
          ? 100
          : 50;
    const baseStrike =
      Math.round(stock.price / strikeInterval) * strikeInterval;
    for (let i = -10; i <= 10; i++)
      strikes.push(baseStrike + i * strikeInterval);

    const calls: Record<string, any> = {};
    const puts: Record<string, any> = {};
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 3);
    const commonIv = 15 + Math.random() * 5;

    strikes.forEach((strike) => {
      calls[`${symbol}-${strike}-CALL`] = generateOptionContract(
        symbol,
        stock.price,
        strike,
        "CALL",
        expiry,
        commonIv,
      );
      puts[`${symbol}-${strike}-PUT`] = generateOptionContract(
        symbol,
        stock.price,
        strike,
        "PUT",
        expiry,
        commonIv,
      );
    });

    set({
      optionChain: {
        underlying: symbol,
        underlyingPrice: stock.price,
        expiries: [expiry],
        strikes,
        calls,
        puts,
      },
    });
  },

  initialize: async () => {
    // Initial data fetch
    await get().syncMarketData();

    if (get().selectedStock) {
      get().updateOptionChain(get().selectedStock!.symbol);
    }

    // High frequency UI ticks (800ms)
    setInterval(() => get().updateStockPrices(), 800);

    // Low frequency API sync (10 seconds)
    setInterval(() => get().syncMarketData(), 10000);
  },
}));
