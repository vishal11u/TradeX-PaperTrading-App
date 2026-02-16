import React from "react";
import { useTradingStore } from "@/store/tradingStore";
import { TrendingUp, TrendingDown, Plus } from "lucide-react";

export const Watchlist: React.FC = () => {
  const { stocks, watchlist, selectedStock, setSelectedStock } =
    useTradingStore();

  const watchlistStocks = stocks.filter((stock) =>
    watchlist.includes(stock.symbol),
  );

  return (
    <div className="watchlist">
      <div className="section-header">
        <span>Watchlist</span>
        <button className="icon-btn">
          <Plus size={18} />
        </button>
      </div>

      <div className="watchlist-items">
        {watchlistStocks.map((stock) => (
          <div
            key={stock.symbol}
            className={`watchlist-item ${selectedStock?.symbol === stock.symbol ? "active" : ""}`}
            onClick={() => setSelectedStock(stock)}
          >
            <div className="symbol">{stock.symbol}</div>
            <div className="price-row">
              <span className="price mono">
                ₹{stock.price?.toFixed(2) || "0.00"}
              </span>
              <span
                className={`change ${(stock.change ?? 0) >= 0 ? "positive" : "negative"}`}
              >
                {(stock.change ?? 0) >= 0 ? (
                  <TrendingUp
                    size={12}
                    style={{ display: "inline", marginRight: 2 }}
                  />
                ) : (
                  <TrendingDown
                    size={12}
                    style={{ display: "inline", marginRight: 2 }}
                  />
                )}
                {stock.changePercent?.toFixed(2) || "0.00"}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
