"use client";

import React, { useEffect, useState } from "react";
import { useTradingStore } from "@/store/tradingStore";
import {
  Newspaper,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  ExternalLink,
  Zap,
  Clock,
} from "lucide-react";

const generateDynamicNews = (stocks: any[], marketStatus: string) => {
  const now = new Date();
  const newsTemplates = [
    {
      title: "NIFTY {action} as {sector} stocks show strength",
      content:
        "The benchmark index moved {direction} tracking gains in {sector} sector. Market breadth remained {breadth}.",
      category: "MARKET" as const,
      source: "TradeX Live",
    },
    {
      title: "FII activity {trend} in Indian equities",
      content:
        "Foreign institutional investors have been {action} in the cash segment, influencing market sentiment.",
      category: "GLOBAL" as const,
      source: "Bloomberg",
    },
    {
      title: "Volatility Index {movement} to {level}",
      content:
        "India VIX, the fear gauge, {action} indicating {sentiment} in the market ahead of key events.",
      category: "MARKET" as const,
      source: "Reuters",
    },
    {
      title: "Banking stocks {performance} amid rate concerns",
      content:
        "Bank Nifty {action} as investors assess the impact of potential rate {direction} on lending margins.",
      category: "ECONOMY" as const,
      source: "Economic Times",
    },
    {
      title: "Options traders turn {sentiment} on NIFTY",
      content:
        "Put-Call ratio indicates {bias} sentiment with significant buildup in {strikes} strikes.",
      category: "MARKET" as const,
      source: "TradeX Analytics",
    },
  ];

  const nifty = stocks.find((s) => s.symbol === "NIFTY");
  const banknifty = stocks.find((s) => s.symbol === "BANKNIFTY");

  const isPositive = (nifty?.changePercent || 0) > 0;
  const volatility = Math.abs(nifty?.changePercent || 0);

  const replacements: any = {
    action: isPositive ? "rallies" : "declines",
    direction: isPositive ? "higher" : "lower",
    sector: ["Banking", "IT", "Auto", "Pharma"][Math.floor(Math.random() * 4)],
    breadth: volatility > 1 ? "volatile" : "stable",
    trend: isPositive ? "increasing" : "decreasing",
    movement: volatility > 0.5 ? "spikes" : "eases",
    level: (12 + Math.random() * 8).toFixed(1),
    sentiment:
      volatility > 1 ? "heightened uncertainty" : "calm trading conditions",
    performance: isPositive ? "outperform" : "underperform",
    bias: isPositive ? "bullish" : "bearish",
    strikes: isPositive ? "higher" : "lower",
  };

  const selectedNews = newsTemplates.slice(
    0,
    3 + Math.floor(Math.random() * 2),
  );

  return selectedNews.map((template, idx) => {
    let title = template.title;
    let content = template.content;

    Object.keys(replacements).forEach((key) => {
      title = title.replace(`{${key}}`, replacements[key]);
      content = content.replace(`{${key}}`, replacements[key]);
    });

    const sentiment = isPositive
      ? Math.random() > 0.3
        ? "POSITIVE"
        : "NEUTRAL"
      : Math.random() > 0.3
        ? "NEGATIVE"
        : "NEUTRAL";

    const impact =
      volatility > 1 ? "HIGH" : volatility > 0.5 ? "MEDIUM" : "LOW";

    return {
      id: `news-${now.getTime()}-${idx}`,
      title,
      content,
      source: template.source,
      timestamp: new Date(now.getTime() - idx * 120000), // Stagger by 2 minutes
      sentiment: sentiment as "POSITIVE" | "NEGATIVE" | "NEUTRAL",
      impact: impact as "HIGH" | "MEDIUM" | "LOW",
      category: template.category,
    };
  });
};

export const NewsFeed: React.FC = () => {
  const { news, fetchNews, stocks, marketStatus } = useTradingStore();
  const [localNews, setLocalNews] = useState(news);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    // Initial fetch
    fetchNews();

    // Generate dynamic news based on market data
    const updateNews = () => {
      const dynamicNews = generateDynamicNews(stocks, marketStatus);
      setLocalNews((prev) => {
        const combined = [...dynamicNews, ...prev];
        return combined.slice(0, 8); // Keep last 8 news items
      });
      setLastUpdate(new Date());
    };

    updateNews();

    // Update every 30 seconds
    const interval = setInterval(updateNews, 30000);

    return () => clearInterval(interval);
  }, [stocks, marketStatus, fetchNews]);

  // Calculate overall sentiment
  const sentimentCounts = localNews.reduce(
    (acc, item) => {
      acc[item.sentiment] = (acc[item.sentiment] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const overallSentiment =
    (sentimentCounts.POSITIVE || 0) > (sentimentCounts.NEGATIVE || 0)
      ? "BULLISH"
      : (sentimentCounts.NEGATIVE || 0) > (sentimentCounts.POSITIVE || 0)
        ? "BEARISH"
        : "NEUTRAL";

  const nifty = stocks.find((s) => s.symbol === "NIFTY");
  const volatilityIndex = Math.abs(nifty?.changePercent || 0) * 3 + 12;

  return (
    <div className="news-feed-container">
      <div className="news-header">
        <div className="title">
          <Newspaper size={20} className="accent-blue" />
          <span>News & Sentiment</span>
        </div>
        <div className="live-status">
          <span className="dot"></span> LIVE
        </div>
      </div>

      <div className="sentiment-summary">
        <div className="stat">
          <span className="label">GLOBAL SENTIMENT</span>
          <span
            className={`value ${overallSentiment === "BULLISH" ? "positive" : overallSentiment === "BEARISH" ? "negative" : "neutral"}`}
          >
            {overallSentiment}
          </span>
        </div>
        <div className="stat">
          <span className="label">VOLATILITY INDEX</span>
          <span className="value neutral">
            {volatilityIndex.toFixed(1)} (
            {volatilityIndex > 18
              ? "High"
              : volatilityIndex > 15
                ? "Moderate"
                : "Stable"}
            )
          </span>
        </div>
      </div>

      <div className="news-list">
        {localNews.map((item) => (
          <div
            key={item.id}
            className={`news-item-card ${item.impact.toLowerCase()}`}
          >
            <div className="item-top">
              <span className={`category-tag ${item.category.toLowerCase()}`}>
                {item.category}
              </span>
              <span className="timestamp">
                <Clock size={12} />{" "}
                {item.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <h3>{item.title}</h3>
            <p>{item.content}</p>
            <div className="item-footer">
              <div className="source">
                Source: <strong>{item.source}</strong>
              </div>
              <div className={`sentiment-pill ${item.sentiment.toLowerCase()}`}>
                {item.sentiment === "POSITIVE" && <TrendingUp size={14} />}
                {item.sentiment === "NEGATIVE" && <TrendingDown size={14} />}
                {item.sentiment === "NEUTRAL" && <Minus size={14} />}
                {item.sentiment}
              </div>
            </div>
          </div>
        ))}

        <div className="news-item-card high">
          <div className="item-top">
            <span className="category-tag economy">ECONOMY</span>
            <span className="timestamp">
              <Clock size={12} /> Just Now
            </span>
          </div>
          <div className="flash-indicator">
            <Zap size={14} /> BREAKING
          </div>
          <h3>RBI Keeps Interest Rates Unchanged at 6.5%</h3>
          <p>
            The Monetary Policy Committee decided to maintain the repo rate as
            expected, focusing on inflation control.
          </p>
          <div className="item-footer">
            <div className="source">
              Source: <strong>TradeX Live</strong>
            </div>
            <div className="sentiment-pill neutral">NEUTRAL</div>
          </div>
        </div>
      </div>
    </div>
  );
};
