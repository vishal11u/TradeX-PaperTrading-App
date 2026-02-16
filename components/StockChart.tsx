"use client";

import React, { useState } from "react";
import { useTradingStore } from "@/store/tradingStore";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { CandleChart } from "./CandleChart";

export const PriceChart: React.FC = () => {
  const { selectedStock, priceHistory } = useTradingStore();
  const [timeframe, setTimeframe] = useState("1m");
  const [chartType, setChartType] = useState<"line" | "candle">("line");

  if (!selectedStock) return null;

  const history = priceHistory[selectedStock.symbol] || [];
  const timeframes = ["1m", "5m", "15m", "1h", "1D"];

  return (
    <div className="price-chart-container">
      <div className="chart-info">
        <div className="chart-title">
          <span className="symbol">{selectedStock.symbol}</span>
          <span className="interval">{timeframe} Chart</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              backgroundColor: "#1e293b",
              borderRadius: "8px",
              padding: "4px",
              marginRight: "16px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              gap: "4px",
            }}
          >
            <button
              style={{
                padding: "6px 16px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 500,
                transition: "all 0.2s",
                border: "none",
                cursor: "pointer",
                backgroundColor:
                  chartType === "line" ? "#2563eb" : "transparent",
                color: chartType === "line" ? "#ffffff" : "#94a3b8",
                boxShadow:
                  chartType === "line"
                    ? "0 4px 6px -1px rgba(37, 99, 235, 0.2)"
                    : "none",
              }}
              onClick={() => setChartType("line")}
            >
              Line
            </button>
            <button
              style={{
                padding: "6px 16px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 500,
                transition: "all 0.2s",
                border: "none",
                cursor: "pointer",
                backgroundColor:
                  chartType === "candle" ? "#2563eb" : "transparent",
                color: chartType === "candle" ? "#ffffff" : "#94a3b8",
                boxShadow:
                  chartType === "candle"
                    ? "0 4px 6px -1px rgba(37, 99, 235, 0.2)"
                    : "none",
              }}
              onClick={() => setChartType("candle")}
            >
              Candles
            </button>
          </div>
          <div className="timeframe-selector">
            {timeframes.map((tf) => (
              <button
                key={tf}
                className={`tf-btn ${timeframe === tf ? "active" : ""}`}
                onClick={() => setTimeframe(tf)}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ width: "100%", height: 350 }}>
        {chartType === "candle" ? (
          <CandleChart timeframe={timeframe} />
        ) : (
          <ResponsiveContainer>
            <AreaChart data={history}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--accent-blue)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--accent-blue)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis dataKey="time" hide />
              <YAxis
                domain={["auto", "auto"]}
                orientation="right"
                tick={{ fontSize: 10, fill: "var(--text-gray)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => val.toFixed(0)}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                itemStyle={{ color: "var(--text-primary)" }}
                labelStyle={{ display: "none" }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="var(--accent-blue)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPrice)"
                animationDuration={0}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
