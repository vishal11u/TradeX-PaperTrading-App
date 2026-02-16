"use client";

import React, { useState, useMemo } from "react";
import { useTradingStore } from "@/store/tradingStore";
import { Activity, Target, Trophy, Award, Calendar } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Helper for Heatmap colors
const getHeatmapColor = (pnl: number) => {
  if (pnl === 0) return "var(--bg-tertiary)";
  if (pnl > 0) {
    if (pnl > 5000) return "#065f46";
    if (pnl > 2000) return "#059669";
    return "#34d399";
  } else {
    if (pnl < -5000) return "#991b1b";
    if (pnl < -2000) return "#dc2626";
    return "#f87171";
  }
};

export const Analytics: React.FC = () => {
  const { portfolio } = useTradingStore();
  const [activeTab, setActiveTab] = useState<"equity" | "heatmap">("equity");

  // Date Filters - Default to Current Year
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date(new Date().getFullYear(), 0, 1);
    return d.toISOString().split("T")[0];
  });
  const [toDate, setToDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  // Dynamic Data Calculation
  const filteredTrades = useMemo(() => {
    return portfolio.trades.filter((t) => {
      const date = new Date(t.timestamp).toISOString().split("T")[0];
      return date >= fromDate && date <= toDate;
    });
  }, [portfolio.trades, fromDate, toDate]);

  const totalTrades = filteredTrades.length;
  const realizedPnL = filteredTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);

  const winRate =
    totalTrades > 0
      ? (
          (filteredTrades.filter((t) => (t.pnl || 0) > 0).length /
            totalTrades) *
          100
        ).toFixed(1)
      : "0.0";

  const avgProfit =
    totalTrades > 0 ? (realizedPnL / totalTrades).toFixed(2) : "0.00";

  // Grouping for Heatmap
  const dailyPnL = useMemo(() => {
    const map: Record<string, number> = {};
    filteredTrades.forEach((t) => {
      const d = new Date(t.timestamp).toISOString().split("T")[0];
      map[d] = (map[d] || 0) + (t.pnl || 0);
    });
    return map;
  }, [filteredTrades]);

  const heatmapDays = useMemo(() => {
    const days = [];
    const current = new Date(fromDate);
    const end = new Date(toDate);
    current.setDate(current.getDate() - current.getDay());
    while (current <= end) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  }, [fromDate, toDate]);

  // Equity Curve Data
  const equityData = useMemo(() => {
    const tradesAfterStart = portfolio.trades.filter((t) => {
      const tradeDate = new Date(t.timestamp).toISOString().split("T")[0];
      return tradeDate >= fromDate;
    });
    let runningBalance =
      portfolio.balance -
      tradesAfterStart.reduce((sum, t) => sum + (t.pnl || 0), 0);

    const data = [];
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const iter = new Date(start);
    while (iter <= end) {
      const dateStr = iter.toISOString().split("T")[0];
      runningBalance += dailyPnL[dateStr] || 0;
      data.push({
        date: dateStr.split("-").slice(1).join("/"),
        balance: runningBalance,
      });
      iter.setDate(iter.getDate() + 1);
    }
    return data;
  }, [fromDate, toDate, dailyPnL, portfolio.balance, portfolio.trades]);

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"];

  const pieData = useMemo(() => {
    const instrumentPnL: Record<string, number> = {};
    filteredTrades.forEach((trade) => {
      const instrument = trade.underlying || "UNKNOWN";
      instrumentPnL[instrument] =
        (instrumentPnL[instrument] || 0) + Math.abs(trade.pnl || 0);
    });
    const totalPnL = Object.values(instrumentPnL).reduce(
      (sum, val) => sum + val,
      0,
    );
    if (totalPnL === 0) return [{ name: "No Trades", value: 100 }];
    return Object.entries(instrumentPnL)
      .map(([name, val]) => ({
        name,
        value: parseFloat(((val / totalPnL) * 100).toFixed(1)),
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTrades]);

  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const dayDetails = useMemo(() => {
    if (!selectedDay) return null;
    const tradesOnDay = filteredTrades.filter(
      (t) => new Date(t.timestamp).toISOString().split("T")[0] === selectedDay,
    );
    const grossPnL = tradesOnDay.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const charges = tradesOnDay.length * 25;
    return {
      date: selectedDay,
      trades: tradesOnDay.length,
      grossPnL,
      charges,
      netPnL: grossPnL - charges,
    };
  }, [selectedDay, filteredTrades]);

  return (
    <div className="analytics-screen">
      <div className="analytics-header">
        <div className="header-left">
          <h2>Performance Analytics</h2>
          <div className="analytics-filters-inline">
            <div className="date-input-group-slim">
              <Calendar size={14} className="text-gray" />
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <span className="separator">to</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="stat-card premium">
          <div className="stat-icon-wrapper pnl">
            <Trophy size={20} />
          </div>
          <div className="stat-info">
            <span className="label">Realized P&L</span>
            <div
              className={`value mono ${realizedPnL >= 0 ? "text-green" : "text-red"}`}
            >
              ₹{realizedPnL.toLocaleString()}
            </div>
            <span className="sub-label">Filtered Net</span>
          </div>
        </div>

        <div className="stat-card premium">
          <div className="stat-icon-wrapper winrate">
            <Target size={20} />
          </div>
          <div className="stat-info">
            <span className="label">Win Rate</span>
            <div className="value mono">{winRate}%</div>
            <div className="progress-mini">
              <div
                className="progress-fill"
                style={{ width: `${winRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="stat-card premium">
          <div className="stat-icon-wrapper avg">
            <Award size={20} />
          </div>
          <div className="stat-info">
            <span className="label">Avg Profit/Trade</span>
            <div
              className={`value mono ${parseFloat(avgProfit) >= 0 ? "text-green" : "text-red"}`}
            >
              ₹{avgProfit}
            </div>
            <span className="sub-label">Trade Efficiency</span>
          </div>
        </div>

        <div className="stat-card premium">
          <div className="stat-icon-wrapper activity">
            <Activity size={20} />
          </div>
          <div className="stat-info">
            <span className="label">Total Trades</span>
            <div className="value mono">{totalTrades}</div>
            <span className="sub-label">Executions</span>
          </div>
        </div>
      </div>

      <div className="analytics-charts">
        <div className="chart-main chart-box">
          <div className="chart-header">
            <h4>{activeTab === "equity" ? "Equity Curve" : "P&L Heatmap"}</h4>
            <div className="chart-actions">
              <button
                className={`chart-tab ${activeTab === "equity" ? "active" : ""}`}
                onClick={() => setActiveTab("equity")}
              >
                Curve
              </button>
              <button
                className={`chart-tab ${activeTab === "heatmap" ? "active" : ""}`}
                onClick={() => setActiveTab("heatmap")}
              >
                Heatmap
              </button>
            </div>
          </div>

          <div className="chart-content-render">
            {activeTab === "equity" ? (
              <div className="chart-container-inner">
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={equityData}>
                    <defs>
                      <linearGradient id="colorBal" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="rgba(255,255,255,0.05)"
                    />
                    <XAxis dataKey="date" hide />
                    <YAxis
                      orientation="right"
                      tick={{ fontSize: 10 }}
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#0f172a",
                        border: "1px solid #1e293b",
                        borderRadius: "8px",
                      }}
                      itemStyle={{ color: "#f1f5f9", fontSize: "12px" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="balance"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorBal)"
                      animationDuration={1000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="heatmap-wrapper">
                <div className="heatmap-scroll-container">
                  <div className="heatmap-yearly-grid">
                    <div className="heatmap-month-labels">
                      {Array.from({ length: 12 }).map((_, i) => {
                        const monthDate = new Date(
                          new Date().getFullYear(),
                          i,
                          1,
                        );
                        return (
                          <div key={i} className="month-label">
                            {monthDate.toLocaleString("default", {
                              month: "short",
                            })}
                          </div>
                        );
                      })}
                    </div>
                    <div className="heatmap-main-view">
                      <div className="day-labels">
                        <span>M</span>
                        <span>W</span>
                        <span>F</span>
                      </div>
                      <div className="heatmap-cells-container">
                        {heatmapDays.map((day) => {
                          const dateStr = day.toISOString().split("T")[0];
                          const pnl = dailyPnL[dateStr] || 0;
                          const isSelected = selectedDay === dateStr;
                          return (
                            <div
                              key={dateStr}
                              className={`heatmap-cell-v2 ${isSelected ? "selected" : ""}`}
                              style={{ background: getHeatmapColor(pnl) }}
                              onClick={() => setSelectedDay(dateStr)}
                              title={`${dateStr}: ₹${pnl.toFixed(2)}`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {selectedDay && dayDetails && (
                  <div className="day-details-panel">
                    <div className="panel-header">
                      <h5>
                        Breakdown: {new Date(selectedDay).toLocaleDateString()}
                      </h5>
                      <span className="trades-count">
                        {dayDetails.trades} Trades
                      </span>
                    </div>
                    <div className="panel-metrics">
                      <div className="metric">
                        <span className="lbl">Gross P&L</span>
                        <span
                          className={`val mono ${dayDetails.grossPnL >= 0 ? "text-green" : "text-red"}`}
                        >
                          ₹
                          {dayDetails.grossPnL.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <div className="metric">
                        <span className="lbl">Charges & Taxes</span>
                        <span className="val mono text-red">
                          - ₹{dayDetails.charges.toFixed(2)}
                        </span>
                      </div>
                      <div className="metric highlight">
                        <span className="lbl">Net Realized</span>
                        <span
                          className={`val mono ${dayDetails.netPnL >= 0 ? "text-green" : "text-red"}`}
                        >
                          ₹
                          {dayDetails.netPnL.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="heatmap-legend-slim">
                  <span className="lbl">Min Loss</span>
                  <div className="color-scale">
                    {[
                      "#991b1b",
                      "#dc2626",
                      "var(--bg-tertiary)",
                      "#059669",
                      "#065f46",
                    ].map((c) => (
                      <div key={c} style={{ background: c }}></div>
                    ))}
                  </div>
                  <span className="lbl">Max Profit</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="chart-side chart-box">
          <h4>Exposure Mix</h4>
          <div className="pie-container">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-center-label">
              <span className="val">
                {totalTrades > 0 ? "Diversified" : "No Data"}
              </span>
              <span className="lbl">Exposure</span>
            </div>
          </div>
          <div className="chart-legend-custom">
            {pieData.map((d, i) => (
              <div key={d.name} className="legend-item">
                <span
                  className="dot"
                  style={{ background: COLORS[i % COLORS.length] }}
                ></span>
                <span className="name">{d.name}</span>
                <span className="val">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
