import React from "react";
import { useTradingStore } from "@/store/tradingStore";
import {
  Wallet as WalletIcon,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  History,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

export const WalletScreen: React.FC = () => {
  const { portfolio } = useTradingStore();

  const freeCash = portfolio.balance - portfolio.investedValue;
  const marginUsagePercent =
    (portfolio.investedValue / portfolio.balance) * 100;

  return (
    <div className="wallet-screen">
      <div className="wallet-header">
        <div className="balance-info">
          <span className="label">Total Available Funds</span>
          <div className="amount-row">
            <h1>₹{portfolio.balance.toLocaleString("en-IN")}</h1>
            <span className="status-badge">
              <ShieldCheck size={14} /> Verified
            </span>
          </div>
        </div>
      </div>

      <div className="wallet-grid">
        <div className="premium-card-wrapper">
          <div className="wallet-card-premium">
            <div className="card-glass"></div>
            <div className="card-content">
              <div className="card-top">
                <div className="chip"></div>
                <CreditCard size={28} className="card-icon" />
              </div>
              <div className="card-number">
                <span>****</span>
                <span>****</span>
                <span>****</span>
                <span>2024</span>
              </div>
              <div className="card-details">
                <div className="detail-item">
                  <span className="label">CARD HOLDER</span>
                  <span className="value">SHITOSH S.</span>
                </div>
                <div className="detail-item">
                  <span className="label">VALID THRU</span>
                  <span className="value">12/29</span>
                </div>
                <div className="card-logo">TRADEX</div>
              </div>
            </div>
          </div>
        </div>

        <div className="fund-management-panel">
          <div className="panel-title">Margin Breakdown</div>
          <div className="margin-bar-container">
            <div className="margin-labels">
              <span>Used: {marginUsagePercent.toFixed(1)}%</span>
              <span>Available: {(100 - marginUsagePercent).toFixed(1)}%</span>
            </div>
            <div className="margin-bar-bg">
              <div
                className="margin-bar-fill"
                style={{ width: `${marginUsagePercent || 2}%` }}
              ></div>
            </div>
          </div>
          <div className="fund-stats-detailed">
            <div className="fund-stat">
              <div className="stat-label">Utilized Margin</div>
              <div className="stat-value mono">
                ₹{portfolio.investedValue.toLocaleString()}
              </div>
            </div>
            <div className="fund-stat">
              <div className="stat-label">Unpledged Cash</div>
              <div className="stat-value mono ">
                ₹{freeCash.toLocaleString()}
              </div>
            </div>
            <div className="fund-stat highlight">
              <div className="stat-label">Total Collateral</div>
              <div className="stat-value mono">
                ₹{portfolio.balance.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="transactions-section">
        <div className="section-header">
          <h4>Recent Activity</h4>
          <Link href="/recent-activity" className="btn-activity-premium">
            Full Activity Log <ArrowRight size={14} />
          </Link>
        </div>
        <div className="transactions-list">
          {portfolio.trades
            .slice(-4)
            .reverse()
            .map((trade) => (
              <div key={trade.id} className="tx-item-enhanced">
                <div className={`tx-icon-boxed ${trade.side.toLowerCase()}`}>
                  {trade.side === "BUY" ? (
                    <TrendingDown size={18} />
                  ) : (
                    <TrendingUp size={18} />
                  )}
                </div>
                <div className="tx-main-info">
                  <span className="tx-title">
                    {trade.side} {trade.symbol}
                  </span>
                  <span className="tx-meta">
                    {new Date(trade.timestamp).toLocaleString()} • ID:{" "}
                    {trade.id.slice(0, 8)}
                  </span>
                </div>
                <div
                  className={`tx-amount-final ${trade.side === "BUY" ? "negative" : "positive"}`}
                >
                  {trade.side === "BUY" ? "-" : "+"}₹
                  {trade.amount.toLocaleString()}
                </div>
              </div>
            ))}

          {/* baseline event - always shown */}
          <div className="tx-item-enhanced">
            <div className="tx-icon-boxed success">
              <Plus size={18} />
            </div>
            <div className="tx-main-info">
              <span className="tx-title">Opening Balance Added</span>
              <span className="tx-meta">01 Feb, 2026 • System Deposit</span>
            </div>
            <div className="tx-amount-final positive">+₹10,00,000.00</div>
          </div>
        </div>
      </div>
    </div>
  );
};
