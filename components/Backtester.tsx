"use client";

import React, { useState } from "react";
import { useTradingStore } from "@/store/tradingStore";
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Calendar,
  TrendingUp,
  Target,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export const Backtester: React.FC = () => {
  const { portfolio } = useTradingStore();
  const [isRunning, setIsRunning] = useState(false);
  const [strategy, setStrategy] = useState("MEAN_REVERSION");
  const [capital, setCapital] = useState(100000);
  const [results, setResults] = useState<any>(null);

  const strategies = [
    {
      id: "MEAN_REVERSION",
      name: "Mean Reversion",
      desc: "Buy oversold, sell overbought",
    },
    {
      id: "BREAKOUT",
      name: "Breakout Trading",
      desc: "Trade momentum on key levels",
    },
    {
      id: "OPTION_SELLING",
      name: "Premium Decay",
      desc: "Sell OTM options for theta",
    },
  ];

  const runBacktest = () => {
    setIsRunning(true);

    // Mock backtest simulation
    setTimeout(() => {
      setResults({
        totalTrades: 145,
        winRate: 68.5,
        totalPnL: 45200,
        maxDrawdown: -8500,
        sharpeRatio: 1.85,
        avgWin: 850,
        avgLoss: -420,
        bestTrade: 4200,
        worstTrade: -1850,
        profitFactor: 2.1,
      });
      setIsRunning(false);
    }, 2000);
  };

  return (
    <div className="backtester-screen">
      <div className="backtest-header">
        <div>
          <h1>Strategy Backtester</h1>
          <p className="text-gray">
            Test your trading ideas on historical data
          </p>
        </div>
        <div className="header-actions">
          <button className="icon-btn" disabled={isRunning}>
            <Calendar size={18} /> Select Date Range
          </button>
        </div>
      </div>

      <div className="backtest-grid">
        <div className="config-panel">
          <h3>Configuration</h3>

          <div className="config-group">
            <label>Strategy Type</label>
            <div className="strategy-cards">
              {strategies.map((s) => (
                <div
                  key={s.id}
                  className={`strategy-card ${strategy === s.id ? "selected" : ""}`}
                  onClick={() => setStrategy(s.id)}
                >
                  <span className="name">{s.name}</span>
                  <span className="desc">{s.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="config-group">
            <label>Initial Capital</label>
            <input
              type="number"
              value={capital}
              onChange={(e) => setCapital(Number(e.target.value))}
              className="capital-input"
            />
          </div>

          <div className="config-group">
            <label>Risk Per Trade</label>
            <input
              type="range"
              min="1"
              max="5"
              defaultValue="2"
              className="slider"
            />
            <span className="slider-val">2%</span>
          </div>

          <button
            className="run-backtest-btn"
            onClick={runBacktest}
            disabled={isRunning}
          >
            {isRunning ? (
              <>
                <div className="spinner"></div> Running Simulation...
              </>
            ) : (
              <>
                <Play size={18} /> Run Backtest
              </>
            )}
          </button>
        </div>

        <div className="results-panel">
          {!results ? (
            <div className="empty-results">
              <Target size={64} className="text-gray" />
              <h3>No Results Yet</h3>
              <p>
                Configure your strategy and click "Run Backtest" to see
                performance metrics.
              </p>
            </div>
          ) : (
            <div className="results-content">
              <div className="result-summary">
                <div className="summary-stat main">
                  <span className="label">Total P&L</span>
                  <span
                    className={`value ${results.totalPnL >= 0 ? "positive" : "negative"}`}
                  >
                    ₹{results.totalPnL.toLocaleString()}
                  </span>
                </div>
                <div className="summary-stat">
                  <span className="label">Win Rate</span>
                  <span className="value">{results.winRate}%</span>
                </div>
                <div className="summary-stat">
                  <span className="label">Sharpe Ratio</span>
                  <span className="value">{results.sharpeRatio}</span>
                </div>
              </div>

              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="icon-wrapper success">
                    <CheckCircle size={20} />
                  </div>
                  <div className="metric-data">
                    <span className="lbl">Total Trades</span>
                    <span className="val">{results.totalTrades}</span>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="icon-wrapper info">
                    <TrendingUp size={20} />
                  </div>
                  <div className="metric-data">
                    <span className="lbl">Avg Win</span>
                    <span className="val text-green">₹{results.avgWin}</span>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="icon-wrapper danger">
                    <AlertCircle size={20} />
                  </div>
                  <div className="metric-data">
                    <span className="lbl">Max Drawdown</span>
                    <span className="val text-red">₹{results.maxDrawdown}</span>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="icon-wrapper success">
                    <Target size={20} />
                  </div>
                  <div className="metric-data">
                    <span className="lbl">Profit Factor</span>
                    <span className="val">{results.profitFactor}x</span>
                  </div>
                </div>
              </div>

              <div className="verdict-box">
                <h4>AI Verdict</h4>
                <p>
                  This strategy shows <strong>strong potential</strong> with a
                  Sharpe ratio of {results.sharpeRatio}. The {results.winRate}%
                  win rate is above the industry average. However, monitor the
                  max drawdown carefully and consider reducing position size
                  during high volatility periods.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
