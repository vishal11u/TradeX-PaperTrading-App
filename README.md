# TradeX Options – Paper Trading Platform

TradeX is a professional **stocks and options paper trading platform** (similar to Zerodha Kite) built with **Next.js 14 + TypeScript**.  
It simulates live markets, lets you place options trades with full Greeks, and adds institutional‑grade tools like AI psychology analysis, global news, strategy backtesting, and risk management – all with **zero real money risk**.

---

## 🎯 Core Features

### Options & Stock Trading
- Real-time option chain with live premium updates
- Call and Put options with full contract details
- Greeks display: Delta, Theta, Gamma, Vega, IV
- Lot-based trading (NIFTY: 25, BANKNIFTY: 15, FINNIFTY: 40, stocks: 1)
- Click-to-trade from the option chain or watchlist
- Market/Limit/Stop-Loss orders

### Portfolio & Positions
- Starting virtual balance: **₹10,00,000**
- Live P&L, P&L%, invested value, current value
- Open positions with one-click exit
- Order book and trade history
- Real-time mark-to-market updates

### Charts & Market Data
- Live price chart for the selected underlying
- Price, change, % change, high/low/open/previous close
- Watchlist with major Indian indices and stocks
- Continuous price simulation with intraday behavior

---

## 🧠 Elite Features (Pro Tools)

These are advanced institutional-style tools implemented inside the app:

- **AI Trading Psychometrician** (`/ai-analyst`)  
  Analyzes your journal entries, grades discipline, detects patterns (e.g., “Monday morning alpha”, “volatility trap”), and gives personalized psychology feedback.

- **Global News & Sentiment Feed** (`/news`)  
  Mock Bloomberg/Reuters-style feed with sentiment (POSITIVE/NEGATIVE/NEUTRAL), impact (HIGH/MEDIUM/LOW), and categories (GLOBAL, MARKET, ECONOMY, CRYPTO).

- **Community Hub** (`/community`)  
  Social trading area with posts, likes, comments, and a leaderboard so you can compare performance and learn from others.

- **Strategy Backtester** (`/backtester`)  
  Test strategies on simulated data, review P&L and win-rate style metrics before trying them in live paper trading.

- **Risk Manager** (via Profile → Risk Settings)  
  Daily loss limit, max trades per day, and a circuit breaker that can automatically lock your account when limits are breached.

For a deep dive into these tools, see `ELITE_FEATURES.md`.

---

## 🚀 Quick Start

```bash
cd tradex-app
npm install
npm run dev
```

Then open: **http://localhost:3000**

For full installation details, see `INSTALL.md` and `SETUP.md`.

---

## 📖 How to Use the Trading Terminal

### 1. Select an Underlying
- Use the **Watchlist** (left sidebar) to pick NIFTY, BANKNIFTY, FINNIFTY, SENSEX, or a stock.

### 2. View Market & Options
- Main area shows current price, change, and a live chart.
- Switch tabs to view **Option Chain**, **Positions**, **Orders**, or **Chart**.

### 3. Place an Options Trade
- Go to **Option Chain**, click any Call/Put premium.
- Order panel (right side) shows strike, expiry, type, Greeks, bid/ask/LTP.
- Choose **BUY/SELL**, order type (Market/Limit/SL), and enter **LOTS**.  
  Quantity is auto-calculated from the lot size.

### 4. Manage Positions
- Use the **Positions** tab to track P&L, entry price, current price, and Greeks.
- Exit with one click, or let stop-loss/target logic close trades automatically.

---

## ⚙️ Configuration (Key Settings)

All core configuration lives in [`store/tradingStore.ts`](file:///c:/Users/shito/Music/tradex-app/store/tradingStore.ts).

### Starting Balance
```ts
portfolio: {
  balance: 1000000, // ₹10,00,000 starting virtual capital
}
```

### Price Update Frequency
```ts
setInterval(() => {
  get().updateStockPrices();
}, 800); // 800 ms ticks for UI price updates
```

You can adjust these values to change the “feel” of the simulation.

---

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router) + React 18
- **Language**: TypeScript
- **State Management**: Zustand (`store/tradingStore.ts`)
- **Charts**: Recharts
- **Icons**: Lucide React
- **PWA**: `next-pwa` + `public/manifest.json`

---

## 📁 Project Structure (High Level)

```bash
tradex-app/
├── app/            # Next.js app entry (layout, pages)
├── components/     # UI components (terminal, elite tools, layout)
├── store/          # Zustand store and trading logic
├── types/          # Shared TypeScript interfaces
└── public/         # Static assets and PWA manifest
```

For a file-by-file breakdown, see `FILE_LIST.md`.

---

## 📱 PWA Support

- Installable on desktop and mobile (Add to Home Screen / Install App).
- Launches in a standalone window with dark theme.
- Works offline for the UI once assets are cached (data is simulated).

---

## ⚠️ Disclaimer

- This is a **paper trading simulator** only.  
- All prices, news, and results are **simulated** for educational use.
- Do **not** use this application for real-money trading decisions.

License: **MIT** – suitable for personal and educational projects.

---

Happy trading and journaling – master your strategy and psychology here before risking real capital. 📈
