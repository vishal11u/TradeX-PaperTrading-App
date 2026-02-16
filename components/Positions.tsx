import React from "react";
import { useTradingStore } from "@/store/tradingStore";
import { TrendingUp, TrendingDown, X } from "lucide-react";

export const Positions: React.FC = () => {
  const { portfolio, exitPosition } = useTradingStore();

  if (portfolio.positions.length === 0) {
    return (
      <div className="empty-state">
        <p>No open positions</p>
      </div>
    );
  }

  return (
    <div className="positions-container">
      <table className="positions-table">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Type</th>
            <th>Strike</th>
            <th>Side</th>
            <th>Qty</th>
            <th>Avg Price</th>
            <th>LTP</th>
            <th>P&L</th>
            <th>SL</th>
            <th>P&L %</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {portfolio.positions.map((position) => (
            <tr key={position.id}>
              <td>
                <div>
                  <div className="symbol">{position.underlying}</div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {new Date(position.expiry).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </td>
              <td>
                <span
                  className={`option-type-badge ${position.optionType.toLowerCase()}`}
                >
                  {position.optionType}
                </span>
              </td>
              <td className="mono strike-cell">{position.strike}</td>
              <td>
                <span className={`badge ${position.side.toLowerCase()}`}>
                  {position.side}
                </span>
              </td>
              <td className="mono">{position.quantity}</td>
              <td className="mono">
                ₹{position.avgPrice?.toFixed(2) || "0.00"}
              </td>
              <td className="mono">
                ₹{position.currentPrice?.toFixed(2) || "0.00"}
              </td>
              <td
                className={`mono ${(position.pnl ?? 0) >= 0 ? "text-green" : "text-red"}`}
              >
                {(position.pnl ?? 0) >= 0 ? "+" : ""}₹
                {position.pnl?.toFixed(2) || "0.00"}
              </td>
              <td className="mono text-yellow" style={{ fontSize: "0.8rem" }}>
                {position.trailingStopLoss ? (
                  <div title="Trailing SL">
                    T: ₹{position.trailingStopLoss?.toFixed(2) || "0.00"}
                  </div>
                ) : position.stopLoss ? (
                  <div title="Stop Loss">
                    ₹{position.stopLoss?.toFixed(2) || "0.00"}
                  </div>
                ) : (
                  "-"
                )}
              </td>
              <td
                className={`mono ${(position.pnlPercent ?? 0) >= 0 ? "text-green" : "text-red"}`}
              >
                {(position.pnlPercent ?? 0) >= 0 ? (
                  <TrendingUp
                    size={14}
                    style={{ display: "inline", marginRight: 2 }}
                  />
                ) : (
                  <TrendingDown
                    size={14}
                    style={{ display: "inline", marginRight: 2 }}
                  />
                )}
                {(position.pnlPercent ?? 0) >= 0 ? "+" : ""}
                {position.pnlPercent?.toFixed(2) || "0.00"}%
              </td>
              <td>
                <button
                  className="action-btn exit"
                  onClick={() => exitPosition(position.id)}
                >
                  <X size={14} style={{ marginRight: 4 }} />
                  Exit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
