"use client";

import React, { useMemo } from "react";
import { useTradingStore } from "@/store/tradingStore";
import {
  Brain,
  Target,
  TrendingUp,
  TrendingDown,
  Zap,
  AlertTriangle,
  Award,
  BarChart2,
} from "lucide-react";

export const AIAnalyst: React.FC = () => {
  const { portfolio } = useTradingStore();
  const { journal, trades } = portfolio;

  const insights = useMemo(() => {
    if (journal.length === 0 && trades.length === 0) return null;

    // Calculate actual metrics
    const totalTrades = trades.length;
    const profitableTrades = trades.filter((t) => (t.pnl || 0) > 0).length;
    const winRate =
      totalTrades > 0 ? (profitableTrades / totalTrades) * 100 : 0;

    // Analyze by market mood
    const moodStats = journal.reduce(
      (acc, entry) => {
        const mood = entry.marketMood || "NEUTRAL";
        if (!acc[mood]) acc[mood] = { total: 0, wins: 0, pnl: 0 };

        // Find trades around this journal entry time
        const entryTime = new Date(entry.timestamp).getTime();
        const relatedTrades = trades.filter((t) => {
          const tradeTime = new Date(t.timestamp).getTime();
          return Math.abs(tradeTime - entryTime) < 3600000; // Within 1 hour
        });

        relatedTrades.forEach((t) => {
          acc[mood].total++;
          if ((t.pnl || 0) > 0) acc[mood].wins++;
          acc[mood].pnl += t.pnl || 0;
        });

        return acc;
      },
      {} as Record<string, { total: number; wins: number; pnl: number }>,
    );

    // Find best and worst moods
    const moodEntries = Object.entries(moodStats);
    const bestMood = moodEntries.reduce(
      (best, [mood, stats]) => {
        const wr = stats.total > 0 ? (stats.wins / stats.total) * 100 : 0;
        const bestWr =
          best.stats.total > 0 ? (best.stats.wins / best.stats.total) * 100 : 0;
        return wr > bestWr ? { mood, stats } : best;
      },
      { mood: "BULLISH", stats: { total: 0, wins: 0, pnl: 0 } },
    );

    const worstMood = moodEntries.reduce(
      (worst, [mood, stats]) => {
        const wr = stats.total > 0 ? (stats.wins / stats.total) * 100 : 0;
        const worstWr =
          worst.stats.total > 0
            ? (worst.stats.wins / worst.stats.total) * 100
            : 0;
        return wr < worstWr && stats.total > 0 ? { mood, stats } : worst;
      },
      { mood: "VOLATILE", stats: { total: 1, wins: 0, pnl: -1000 } },
    );

    // Calculate discipline score based on journal consistency
    const disciplineScore = Math.min(
      100,
      (journal.length / Math.max(trades.length, 1)) * 100 + 20,
    );

    // Psychology score based on win rate and consistency
    const psychologyScore = Math.min(
      100,
      winRate + (journal.length > 5 ? 20 : 0),
    );

    // Risk score based on P&L volatility
    const pnls = trades.map((t) => t.pnl || 0);
    const avgPnL = pnls.reduce((a, b) => a + b, 0) / Math.max(pnls.length, 1);
    const variance =
      pnls.reduce((acc, pnl) => acc + Math.pow(pnl - avgPnL, 2), 0) /
      Math.max(pnls.length, 1);
    const riskScore = Math.max(0, 100 - Math.sqrt(variance) / 50);

    // Generate grade
    const avgScore = (disciplineScore + psychologyScore + riskScore) / 3;
    const grade =
      avgScore >= 90
        ? "A+"
        : avgScore >= 80
          ? "A"
          : avgScore >= 70
            ? "B+"
            : avgScore >= 60
              ? "B"
              : avgScore >= 50
                ? "C"
                : "D";

    // Dynamic patterns
    const patterns = [];

    if (worstMood.stats.total > 2) {
      const worstWr = (worstMood.stats.wins / worstMood.stats.total) * 100;
      patterns.push({
        label: `${worstMood.mood} Market Weakness`,
        desc: `${worstWr.toFixed(0)}% win rate during ${worstMood.mood} conditions. ${Math.abs(worstMood.stats.pnl) > 1000 ? "Significant losses detected." : "Consider reducing exposure."}`,
        impact: worstMood.stats.pnl < -2000 ? "HIGH" : "MEDIUM",
      });
    }

    if (bestMood.stats.total > 2) {
      const bestWr = (bestMood.stats.wins / bestMood.stats.total) * 100;
      patterns.push({
        label: `${bestMood.mood} Market Edge`,
        desc: `Strong ${bestWr.toFixed(0)}% win rate during ${bestMood.mood} sessions. This is your optimal trading environment.`,
        impact: "POSITIVE",
      });
    }

    if (journal.length < trades.length * 0.3) {
      patterns.push({
        label: "Journaling Gap",
        desc: `Only ${journal.length} journal entries for ${trades.length} trades. Increase documentation to improve self-awareness.`,
        impact: "MEDIUM",
      });
    }

    const analysis = {
      grade,
      summary: `Your discipline is ${disciplineScore > 70 ? "strong" : "developing"}. ${winRate > 60 ? "Win rate is above average." : "Focus on quality setups."} ${journal.length > 10 ? "Excellent journaling habits!" : "More journaling will unlock deeper insights."}`,
      strengths: [
        winRate > 60 ? "Consistent profitability" : "Learning from mistakes",
        journal.length > 5
          ? "Strong journaling discipline"
          : "Active trading engagement",
        bestMood.stats.total > 0
          ? `${bestMood.mood} market expertise`
          : "Adaptability",
      ],
      weaknesses: [
        winRate < 50 ? "Win rate needs improvement" : "Occasional overtrading",
        journal.length < trades.length * 0.5
          ? "Inconsistent journaling"
          : "Risk management refinement",
        worstMood.stats.pnl < -1000
          ? `Struggles in ${worstMood.mood} markets`
          : "Patience during consolidation",
      ],
      patterns,
      psychologyScore: Math.round(psychologyScore),
      riskScore: Math.round(riskScore),
      disciplineScore: Math.round(disciplineScore),
    };

    return analysis;
  }, [journal, trades]);

  if (journal.length === 0 && trades.length === 0) {
    return (
      <div className="ai-placeholder">
        <Brain size={64} className="pulse-icon" />
        <h2>Intelligence Gathering...</h2>
        <p>
          Start journaling your trades to unlock personalized AI psychometric
          insights.
        </p>
      </div>
    );
  }

  return (
    <div className="ai-analyst-screen">
      <div className="analyst-header">
        <div className="title-section">
          <Brain size={32} className="accent-blue" />
          <div>
            <h1>AI Psychometrician</h1>
            <p className="text-gray">Psychology & Discipline Analysis</p>
          </div>
        </div>
        <div className="grade-badge">
          <span className="label">AI GRADE</span>
          <span className="value">{insights?.grade}</span>
        </div>
      </div>

      <div className="ai-summary-card">
        <div className="card-glass"></div>
        <p>{insights?.summary}</p>
        <div className="scores-row">
          <div className="score-item">
            <span className="lbl">Psychology</span>
            <div className="progress-bg">
              <div
                className="fill"
                style={{ width: `${insights?.psychologyScore}%` }}
              ></div>
            </div>
            <span className="num">{insights?.psychologyScore}%</span>
          </div>
          <div className="score-item">
            <span className="lbl">Risk Integrity</span>
            <div className="progress-bg">
              <div
                className="fill"
                style={{ width: `${insights?.riskScore}%` }}
              ></div>
            </div>
            <span className="num">{insights?.riskScore}%</span>
          </div>
          <div className="score-item">
            <span className="lbl">Discipline</span>
            <div className="progress-bg">
              <div
                className="fill"
                style={{ width: `${insights?.disciplineScore}%` }}
              ></div>
            </div>
            <span className="num">{insights?.disciplineScore}%</span>
          </div>
        </div>
      </div>

      <div className="ai-grid">
        <div className="insight-section">
          <h3>
            <Target size={20} /> Behavioural Patterns
          </h3>
          <div className="pattern-list">
            {insights?.patterns.map((p, i) => (
              <div key={i} className={`pattern-card ${p.impact.toLowerCase()}`}>
                <div className="pattern-header">
                  <span className="title">{p.label}</span>
                  <span className="impact-pill">{p.impact}</span>
                </div>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-analysis">
          <div className="sw-card strengths">
            <h4>
              <TrendingUp size={16} /> Key Strengths
            </h4>
            <ul>
              {insights?.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
          <div className="sw-card weaknesses">
            <h4>
              <TrendingDown size={16} /> Growth Areas
            </h4>
            <ul>
              {insights?.weaknesses.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>

          <div className="recommendation-card">
            <h4>
              <BarChart2 size={16} /> Suggested Adjustment
            </h4>
            <p>
              Reduce position size by 50% on days labeled as{" "}
              <strong>VOLATILE</strong> in your pre-market analysis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
