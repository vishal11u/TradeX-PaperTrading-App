import React from "react";
import { useTradingStore } from "@/store/tradingStore";
import { Wallet, TrendingUp, TrendingDown, Activity } from "lucide-react";

export const Portfolio: React.FC = () => {
  const { portfolio } = useTradingStore();

  return (
    <div className="portfolio-summary">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Wallet size={20} />
          </div>
          <div>
            <div className="stat-label">Available Balance</div>
            <div className="stat-value mono">
              ₹
              {portfolio.balance.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Activity size={20} />
          </div>
          <div>
            <div className="stat-label">Invested Value</div>
            <div className="stat-value mono">
              ₹
              {portfolio.investedValue.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div
            className={`stat-icon ${portfolio.realizedPnL >= 0 ? "text-green" : "text-red"}`}
          >
            {portfolio.realizedPnL >= 0 ? (
              <TrendingUp size={20} />
            ) : (
              <TrendingDown size={20} />
            )}
          </div>
          <div>
            <div className="stat-label">Realized P&L</div>
            <div
              className={`stat-value mono ${portfolio.realizedPnL >= 0 ? "text-green" : "text-red"}`}
            >
              {portfolio.realizedPnL >= 0 ? "+" : ""}₹
              {portfolio.realizedPnL.toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div
            className={`stat-icon ${portfolio.totalPnL >= 0 ? "text-green" : "text-red"}`}
          >
            {portfolio.totalPnL >= 0 ? (
              <TrendingUp size={20} />
            ) : (
              <TrendingDown size={20} />
            )}
          </div>
          <div>
            <div className="stat-label">Total P&L</div>
            <div
              className={`stat-value mono ${portfolio.totalPnL >= 0 ? "text-green" : "text-red"}`}
            >
              {portfolio.totalPnL >= 0 ? "+" : ""}₹
              {portfolio.totalPnL.toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div
            className={`stat-icon ${portfolio.totalPnLPercent >= 0 ? "text-green" : "text-red"}`}
          >
            {portfolio.totalPnLPercent >= 0 ? (
              <TrendingUp size={20} />
            ) : (
              <TrendingDown size={20} />
            )}
          </div>
          <div>
            <div className="stat-label">P&L %</div>
            <div
              className={`stat-value mono ${portfolio.totalPnLPercent >= 0 ? "text-green" : "text-red"}`}
            >
              {portfolio.totalPnLPercent >= 0 ? "+" : ""}
              {portfolio.totalPnLPercent.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
