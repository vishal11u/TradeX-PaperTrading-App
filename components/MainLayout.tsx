"use client";

import React, { useEffect } from "react";
import { useTradingStore } from "@/store/tradingStore";
import {
  BarChart3,
  Wallet,
  Settings,
  History as HistoryIcon,
  Sun,
  Moon,
  User,
  LayoutDashboard,
  TrendingUp,
  BookOpen,
  Brain,
  Newspaper,
  Users,
  Target,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ToastContainer } from "./Toast";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { portfolio, initialize, theme, toggleTheme, marketStatus } =
    useTradingStore();

  const pathname = usePathname();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <div className={`app-layout ${theme}`}>
      {/* Vertical Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <BarChart3 size={24} />
        </div>
        <div className="sidebar-nav">
          <Link
            href="/"
            className={`nav-item ${pathname === "/" ? "active" : ""}`}
            title="Dashboard"
          >
            <LayoutDashboard size={20} />
          </Link>
          <Link
            href="/analytics"
            className={`nav-item ${pathname === "/analytics" ? "active" : ""}`}
            title="Analytics"
          >
            <TrendingUp size={20} />
          </Link>
          <Link
            href="/ai-analyst"
            className={`nav-item ${pathname === "/ai-analyst" ? "active" : ""}`}
            title="AI Psychometrician"
          >
            <Brain size={20} />
          </Link>
          <Link
            href="/journal"
            className={`nav-item ${pathname === "/journal" ? "active" : ""}`}
            title="Trading Journal"
          >
            <BookOpen size={20} />
          </Link>
          <Link
            href="/news"
            className={`nav-item ${pathname === "/news" ? "active" : ""}`}
            title="News & Sentiment"
          >
            <Newspaper size={20} />
          </Link>
          <Link
            href="/community"
            className={`nav-item ${pathname === "/community" ? "active" : ""}`}
            title="Community"
          >
            <Users size={20} />
          </Link>
          <Link
            href="/backtester"
            className={`nav-item ${pathname === "/backtester" ? "active" : ""}`}
            title="Strategy Backtester"
          >
            <Target size={20} />
          </Link>
          <Link
            href="/wallet"
            className={`nav-item ${pathname === "/wallet" ? "active" : ""}`}
            title="Wallet"
          >
            <Wallet size={20} />
          </Link>
          <Link
            href="/history"
            className={`nav-item ${pathname === "/history" ? "active" : ""}`}
            title="History"
          >
            <HistoryIcon size={20} />
          </Link>
        </div>
        <div className="sidebar-footer">
          <div className="nav-item" title="Settings">
            <Settings size={20} />
          </div>
        </div>
      </aside>

      <div className="main-wrapper">
        <nav>
          <div className="logo-text">
            <span>
              {pathname === "/" && "Market Dashboard"}
              {pathname === "/analytics" && "Trading Analytics"}
              {pathname === "/ai-analyst" && "AI Psychometrician"}
              {pathname === "/journal" && "Trading Journal"}
              {pathname === "/news" && "News & Sentiment"}
              {pathname === "/community" && "Community Hub"}
              {pathname === "/backtester" && "Strategy Backtester"}
              {pathname === "/wallet" && "Funds & Wallet"}
              {pathname === "/recent-activity" && "Activity History"}
              {pathname === "/history" && "Trade History"}
              {pathname === "/profile" && "User Profile"}
            </span>
            {marketStatus === "OPEN" ? (
              <span className="live-indicator">
                <span className="pulse-dot"></span>
                LIVE
              </span>
            ) : (
              <span className="market-closed-indicator">CLOSED</span>
            )}
          </div>

          <div className="nav-actions">
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="balance-pill">
              <Wallet size={16} />
              <span>
                ₹
                {portfolio.balance.toLocaleString("en-IN", {
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>

            <Link href="/profile" className="profile-pill">
              <div className="user-avatar">
                <User size={18} />
              </div>
              <span className="user-name">Trader</span>
            </Link>
          </div>
        </nav>

        <div className="screen-content">{children}</div>
      </div>
      <ToastContainer />
    </div>
  );
}
