import React from "react";
import { useTradingStore } from "@/store/tradingStore";
import {
  History as HistoryIcon,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export const TradeHistory: React.FC = () => {
  const { portfolio } = useTradingStore();

  if (portfolio.trades.length === 0) {
    return (
      <div className="empty-state-full">
        <div className="icon-circle">
          <HistoryIcon size={40} />
        </div>
        <h3>No trade history found</h3>
        <p>Your executed trades will appear here once you start trading.</p>
      </div>
    );
  }

  // Sort and group trades by date
  const sortedTrades = [...portfolio.trades].reverse();
  const groupedTrades: Record<string, typeof sortedTrades> = {};

  sortedTrades.forEach((trade) => {
    const date = new Date(trade.timestamp).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    if (!groupedTrades[date]) groupedTrades[date] = [];
    groupedTrades[date].push(trade);
  });

  return (
    <div className="trade-history-screen">
      <div className="history-header">
        <div className="title-area">
          <h3>Trade History</h3>
          <span className="count-pill">
            {portfolio.trades.length} Activities
          </span>
        </div>
        <div className="header-actions">
          <button className="btn-filter">Filter By Date</button>
        </div>
      </div>

      <div className="history-container">
        {Object.entries(groupedTrades).map(([date, trades]) => (
          <div key={date} className="date-group">
            <div className="date-header">
              <span className="date-text">{date}</span>
              <div className="date-divider"></div>
            </div>
            <div className="trades-group-list">
              {trades.map((trade) => (
                <div key={trade.id} className="history-item-premium">
                  <div
                    className={`status-line ${trade.side.toLowerCase()}`}
                  ></div>
                  <div className="item-left">
                    <div className="time-col">
                      <span className="time">
                        {new Date(trade.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="id">#{trade.id.slice(-6)}</span>
                    </div>
                    <div className="symbol-info">
                      <div className="main-row">
                        <span className="instrument">{trade.underlying}</span>
                        <span
                          className={`side-tag ${trade.side.toLowerCase()}`}
                        >
                          {trade.side}
                        </span>
                      </div>
                      <div className="sub-row">
                        <span className="strike">{trade.strike}</span>
                        <span className="type">{trade.optionType}</span>
                        <span className="dot"></span>
                        <span className="expiry">
                          {new Date(trade.expiry).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="item-right">
                    <div className="execution-details">
                      <div className="detail">
                        <span className="lbl">Rate</span>
                        <span className="val mono">
                          ₹{trade.price.toFixed(2)}
                        </span>
                      </div>
                      <div className="detail">
                        <span className="lbl">Qty</span>
                        <span className="val mono">{trade.quantity}</span>
                      </div>
                    </div>
                    <div className="total-col">
                      <span className="lbl">Net Value</span>
                      <span className="val mono">
                        ₹{trade.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
