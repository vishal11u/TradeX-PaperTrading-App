# TradeX Options - Installation Guide

## 📦 What's Included

This package contains a complete Next.js + TypeScript options trading application with:

- ✅ 18 source files (TypeScript, CSS, JSON)
- ✅ Real-time option chain with live premiums
- ✅ Greeks display (Delta, Theta, Gamma, Vega, IV)
- ✅ Buy/Sell options trading
- ✅ Position management with P&L tracking
- ✅ PWA support (installable app)
- ✅ Responsive design

## 🚀 Quick Installation

### Step 1: Extract Files

```bash
# Extract the archive
tar -xzf tradex-app.tar.gz

# Or on Windows, use 7-Zip, WinRAR, or built-in extraction
```

### Step 2: Install Dependencies

```bash
cd tradex-app
npm install
```

This will install:
- Next.js 14
- React 18
- TypeScript
- Zustand (state management)
- Recharts (charts)
- Lucide React (icons)
- next-pwa (PWA support)

### Step 3: Run the App

```bash
npm run dev
```

Open your browser to: **http://localhost:3000**

## 📁 Project Structure

```
tradex-app/
├── app/
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main dashboard page
│
├── components/
│   ├── Chart.tsx         # Price chart component
│   ├── OptionChain.tsx   # Options chain display
│   ├── OrderPanel.tsx    # Order placement form
│   ├── Orders.tsx        # Order history
│   ├── Portfolio.tsx     # Portfolio summary
│   ├── Positions.tsx     # Active positions
│   └── Watchlist.tsx     # Underlying selector
│
├── store/
│   └── tradingStore.ts   # Zustand state management
│
├── types/
│   └── trading.ts        # TypeScript interfaces
│
├── public/
│   └── manifest.json     # PWA manifest
│
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── next.config.js        # Next.js config
├── .gitignore           # Git ignore rules
├── README.md            # Documentation
└── SETUP.md             # This file
```

## 🎯 First Run

After starting the app, you'll see:

1. **Watchlist (Left)**: Click NIFTY, BANKNIFTY, or any stock
2. **Main Area (Center)**: View underlying price and option chain
3. **Order Panel (Right)**: Click any option to trade
4. **Portfolio Stats**: Top section shows balance and P&L

## 📖 How to Trade

### Place Your First Order

1. Click **NIFTY** in watchlist
2. Go to **Option Chain** tab
3. Click any **Call** (green) or **Put** (red) premium
4. Order panel shows option details
5. Select **BUY**, enter **1 LOT**
6. Click **BUY 1 LOT** button
7. Position appears in **Positions** tab
8. Watch **real-time P&L**!

## ⚙️ Configuration

### Change Starting Balance

Edit `store/tradingStore.ts` line ~91:

```typescript
balance: 500000, // Change to desired amount (default: ₹5 lakhs)
```

### Adjust Price Update Speed

Edit `store/tradingStore.ts` line ~456:

```typescript
setInterval(() => {
  get().updateStockPrices();
}, 2000); // Change milliseconds (default: 2 seconds)
```

### Modify Lot Sizes

Edit `store/tradingStore.ts` line ~157:

```typescript
const lotSize = ['NIFTY', 'BANKNIFTY', 'FINNIFTY'].includes(order.underlying) 
  ? (order.underlying === 'NIFTY' ? 25 : order.underlying === 'BANKNIFTY' ? 15 : 40)
  : 1;
```

## 🔧 Build for Production

```bash
npm run build
npm start
```

The app will be optimized and ready for deployment.

## 📱 PWA Installation

Once running, you can install as an app:

**Desktop:**
- Chrome/Edge: Click install icon in address bar
- Firefox: Not supported

**Mobile:**
- Android Chrome: Menu → "Add to Home Screen"
- iOS Safari: Share → "Add to Home Screen"

## 🎨 Customization

### Add More Underlyings

Edit `store/tradingStore.ts` line ~67:

```typescript
const mockStocks: Stock[] = [
  generateMockStock('NIFTY', 'NIFTY 50', 21500),
  generateMockStock('BANKNIFTY', 'BANK NIFTY', 45800),
  // Add your stocks here
  generateMockStock('SYMBOL', 'Company Name', basePrice),
];
```

### Change Color Scheme

Edit `app/globals.css` line ~10:

```css
:root {
  --accent-green: #00ff88;  /* Change profit color */
  --accent-red: #ff4757;    /* Change loss color */
  --bg-primary: #0a0e1a;    /* Change background */
  /* ... more colors */
}
```

## 🐛 Troubleshooting

### Port 3000 Already in Use

```bash
PORT=3001 npm run dev
```

### Dependencies Won't Install

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Rebuild TypeScript
npm run build
```

### PWA Not Working in Development

PWA features are disabled in dev mode. To test:

```bash
npm run build
npm start
```

## 📚 Features Overview

### Option Chain
- 21 strikes displayed (current ± 10)
- Real-time premium updates (every 2s)
- Click any option to select for trading
- Color-coded: Calls (green), Puts (red)
- ATM strikes highlighted (yellow)

### Greeks Displayed
- **Delta**: Price sensitivity to underlying
- **Theta**: Time decay per day
- **IV**: Implied volatility
- **Gamma**: Delta change rate
- **Vega**: Volatility sensitivity

### Order Types
- **Market**: Instant execution at best price
- **Limit**: Execute at specified price
- **Stop Loss**: Trigger at stop level

### Position Tracking
- Entry price and current price
- Unrealized P&L in ₹ and %
- Strike, type, expiry details
- One-click exit button

## 🎓 Learning Path

1. **Day 1**: Understand interface, place practice orders
2. **Day 2**: Learn about Greeks (Delta, Theta)
3. **Day 3**: Compare ITM vs OTM options
4. **Day 4**: Test different strategies
5. **Day 5**: Practice position management

## ⚠️ Important Notes

- This is **PAPER TRADING ONLY**
- No real money involved
- Use for learning and practice
- Simulated market data
- Not financial advice

## 🚀 Next Steps

1. ✅ Install and run the app
2. ✅ Place your first option trade
3. ✅ Monitor real-time P&L
4. ✅ Try different strikes
5. ✅ Understand Greeks
6. ✅ Test various strategies

## 📞 Need Help?

- Check **README.md** for detailed info
- Review code comments
- Browser console (F12) for errors

## 📄 System Requirements

- Node.js 18+ required
- Modern browser (Chrome, Firefox, Edge, Safari)
- 2GB RAM minimum
- Internet connection (for initial setup)

## 🎉 You're Ready!

Run `npm run dev` and start trading options!

---

**Happy Options Trading! 📈**

*Master options trading risk-free with this paper trading platform.*
