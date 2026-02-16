"use client";

import { useEffect, useState } from "react";
import { useTradingStore } from "@/store/tradingStore";
import { Watchlist } from "@/components/Watchlist";
import { OrderPanel } from "@/components/OrderPanel";
import { Positions } from "@/components/Positions";
import { Orders } from "@/components/Orders";
import { OptionChain } from "@/components/OptionChain";
import { Portfolio } from "@/components/Portfolio";
import { PriceChart } from "@/components/StockChart";

export default function Home() {
  const { portfolio, selectedStock } = useTradingStore();

  const [activeTab, setActiveTab] = useState<
    "positions" | "orders" | "options" | "chart"
  >("chart");

  return (
    <div className="container">
      {/* Left Sidebar - Watchlist */}
      <Watchlist />

      {/* Main Trading Area */}
      <main className="trading-area">
        <div className="chart-container">
          <div className="stock-header">
            <div>
              <div className="stock-title">{selectedStock?.symbol}</div>
              <div className="stock-name text-secondary">
                {selectedStock?.name}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="stock-price">
                ₹{selectedStock?.price?.toFixed(2) || "0.00"}
              </div>
              <div
                className={`change ${selectedStock && (selectedStock.change ?? 0) >= 0 ? "positive" : "negative"}`}
              >
                {selectedStock && (selectedStock.change ?? 0) >= 0 ? "+" : ""}
                {selectedStock?.change?.toFixed(2) || "0.00"} (
                {selectedStock?.changePercent?.toFixed(2) || "0.00"}%)
              </div>
            </div>
          </div>

          <div className="stock-stats">
            <div className="stat">
              <span className="stat-label">Open</span>
              <span className="stat-value mono">
                ₹{selectedStock?.open?.toFixed(2) || "0.00"}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">High</span>
              <span className="stat-value mono text-green">
                ₹{selectedStock?.high?.toFixed(2) || "0.00"}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Low</span>
              <span className="stat-value mono text-red">
                ₹{selectedStock?.low?.toFixed(2) || "0.00"}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Prev Close</span>
              <span className="stat-value mono">
                ₹{selectedStock?.previousClose?.toFixed(2) || "0.00"}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Volume</span>
              <span className="stat-value mono">
                {selectedStock?.volume?.toLocaleString() || "0"}
              </span>
            </div>
          </div>
        </div>

        <Portfolio />

        <div className="tabs-container">
          <div className="tabs">
            <button
              className={`tab ${activeTab === "chart" ? "active" : ""}`}
              onClick={() => setActiveTab("chart")}
            >
              Chart
            </button>
            <button
              className={`tab ${activeTab === "options" ? "active" : ""}`}
              onClick={() => setActiveTab("options")}
            >
              Option Chain
            </button>
            <button
              className={`tab ${activeTab === "positions" ? "active" : ""}`}
              onClick={() => setActiveTab("positions")}
            >
              Positions ({portfolio.positions.length})
            </button>
            <button
              className={`tab ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              Orders ({portfolio.orders.length})
            </button>
          </div>

          <div className="tab-content-container">
            <div
              className={`tab-content ${activeTab === "chart" ? "active" : ""}`}
            >
              <PriceChart />
            </div>
            <div
              className={`tab-content ${activeTab === "positions" ? "active" : ""}`}
            >
              <Positions />
            </div>
            <div
              className={`tab-content ${activeTab === "orders" ? "active" : ""}`}
            >
              <Orders />
            </div>
            <div
              className={`tab-content ${activeTab === "options" ? "active" : ""}`}
            >
              <OptionChain />
            </div>
          </div>
        </div>
      </main>

      {/* Right Sidebar - Order Panel */}
      <OrderPanel />
    </div>
  );
}
