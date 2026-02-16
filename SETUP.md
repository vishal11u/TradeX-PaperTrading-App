# Quick Setup Guide

## Installation Steps

### 1. Install Node.js Dependencies

```bash
cd tradex-app
npm install
```

This will install:
- Next.js 14
- React 18
- TypeScript
- Zustand (state management)
- Recharts (charting)
- Lucide React (icons)
- next-pwa (Progressive Web App support)

### 2. Run Development Server

```bash
npm run dev
```

The app will be available at: http://localhost:3000

### 3. Build for Production

```bash
npm run build
npm start
```

## Features Available Immediately

Once the app is running, you can:

✅ **View Live Market Data**
- 15 pre-loaded Indian stocks (Reliance, TCS, HDFC, etc.)
- Real-time price updates every 2 seconds
- Live charts showing price movements

✅ **Place Orders**
- Buy/Sell stocks
- Market, Limit, and Stop Loss orders
- Set quantity, price, stop loss, and target

✅ **Manage Positions**
- View all open positions
- See live P&L for each position
- Exit positions with one click

✅ **Track Portfolio**
- Starting balance: ₹10,00,000
- Real-time total P&L
- Available balance tracking

✅ **View Option Chain**
- Complete option chain for selected stock
- Call and Put options
- Strike prices, OI, Volume, IV

✅ **Order History**
- All pending orders
- Executed orders with prices
- Cancelled/Rejected orders

## Default Configuration

- **Starting Balance**: ₹10,00,000 (1 Million)
- **Price Update Frequency**: Every 2 seconds
- **Pre-loaded Stocks**: 15 major Indian stocks
- **Watchlist**: Top 5 stocks by default

## Customization

### Change Starting Balance

Edit: `store/tradingStore.ts`

```typescript
portfolio: {
  balance: 1000000, // Change this
```

### Add More Stocks

Edit: `store/tradingStore.ts`

```typescript
const mockStocks: Stock[] = [
  generateMockStock('SYMBOL', 'Company Name', basePrice),
  // Add more here
];
```

### Change Update Speed

Edit: `store/tradingStore.ts`

```typescript
setInterval(() => {
  get().updateStockPrices();
}, 2000); // Milliseconds (2000 = 2 seconds)
```

## Testing the App

### Test Buying a Stock

1. Click on any stock in the watchlist (left sidebar)
2. Select "BUY" in the order panel (right sidebar)
3. Enter quantity (or use quick buttons: 1, 5, 10, 25)
4. Choose order type (Market/Limit/Stop Loss)
5. Click the green "BUY" button
6. Check "Positions" tab to see your position
7. Watch the P&L update in real-time!

### Test Selling/Exiting

1. Go to "Positions" tab
2. Click "Exit" button on any position
3. Position closes and P&L is realized
4. Check your updated balance

### Test Option Chain

1. Select a stock from watchlist
2. Click "Option Chain" tab
3. View Call and Put options
4. See different strike prices and their premiums

## PWA Installation

### On Desktop (Chrome/Edge)

1. Look for install icon in address bar
2. Click "Install TradeX"
3. App opens in standalone window
4. Works offline!

### On Mobile (Android)

1. Open in Chrome
2. Tap menu (3 dots)
3. Tap "Add to Home Screen"
4. App icon appears on home screen

### On Mobile (iOS)

1. Open in Safari
2. Tap Share button
3. Tap "Add to Home Screen"
4. App icon appears on home screen

## Troubleshooting

### Port Already in Use

If port 3000 is busy:

```bash
PORT=3001 npm run dev
```

### Dependencies Not Installing

Try:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

Make sure you have Node.js 18+ installed:

```bash
node --version
```

### PWA Not Working

PWA features are disabled in development mode. To test PWA:

```bash
npm run build
npm start
```

## Next Steps

1. **Explore the Interface**: Click around, try different features
2. **Place Some Trades**: Buy and sell stocks, watch P&L change
3. **Check Order History**: See all your orders in the Orders tab
4. **View Option Chain**: Explore option pricing for different strikes
5. **Test Portfolio**: Monitor your total P&L and balance

## Need Help?

Check the README.md for more detailed information about:
- Project structure
- Architecture details
- Adding new features
- Connecting to real market data
- Security considerations

---

**Enjoy your paper trading experience! 🚀**
