import React from "react";
import { useTradingStore } from "@/store/tradingStore";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Link from "next/link";

export const RecentActivity: React.FC = () => {
  const { portfolio } = useTradingStore();

  const allActivity = [
    // Mock the opening balance as an activity record
    {
      id: "init-dep",
      type: "DEPOSIT",
      title: "Opening Balance Added",
      meta: "01 Feb, 2026 • System Deposit",
      amount: 1000000,
      timestamp: new Date("2026-02-01T09:00:00"),
      side: "SELL" as const, // Side SELL for credits/deposits
      status: "SUCCESS",
    },
    ...portfolio.trades.map((t) => ({
      id: t.id,
      type: "TRADE",
      title: `${t.side} ${t.symbol}`,
      meta: `${new Date(t.timestamp).toLocaleString()} • Qty: ${t.quantity}`,
      amount: t.amount,
      timestamp: new Date(t.timestamp),
      side: t.side,
      status: "EXECUTED",
    })),
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div className="activity-screen">
      <div className="activity-header">
        <div className="header-left">
          <Link href="/wallet" className="back-btn-circle">
            <ArrowLeft size={20} />
          </Link>
          <div className="title-group">
            <h1>Activity History</h1>
            <p className="text-gray">{allActivity.length} events recorded</p>
          </div>
        </div>

        <div className="header-actions">
          <div className="search-pill">
            <Search size={16} />
            <input type="text" placeholder="Search activity..." />
          </div>
          <button className="filter-btn-slim">
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>

      <div className="activity-container">
        <div className="activity-list-premium">
          {allActivity.map((item) => (
            <div key={item.id} className="activity-card-row">
              <div className="activity-time">
                <span className="time">
                  {item.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className="date">
                  {item.timestamp.toLocaleDateString([], {
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
              </div>

              <div
                className={`activity-icon-wrapper ${item.type === "DEPOSIT" ? "deposit" : item.side === "BUY" ? "buy" : "sell"}`}
              >
                {item.type === "DEPOSIT" ? (
                  <Plus size={20} />
                ) : item.side === "BUY" ? (
                  <ArrowDownRight size={20} />
                ) : (
                  <ArrowUpRight size={20} />
                )}
              </div>

              <div className="activity-details">
                <div className="main-row">
                  <span className="title">{item.title}</span>
                  <span className={`status-pill ${item.status?.toLowerCase()}`}>
                    {item.status}
                  </span>
                </div>
                <div className="sub-row">
                  <span className="meta">{item.meta}</span>
                </div>
              </div>

              <div
                className={`activity-amount ${item.type === "DEPOSIT" || item.side === "SELL" ? "positive" : "negative"}`}
              >
                {item.type === "DEPOSIT" || item.side === "SELL" ? "+" : "-"}₹
                {item.amount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
