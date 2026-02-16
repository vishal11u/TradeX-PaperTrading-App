import React from "react";
import { useTradingStore } from "@/store/tradingStore";
import {
  User,
  Mail,
  Shield,
  Settings,
  Bell,
  Monitor,
  LogOut,
  Camera,
  CheckCircle,
  Clock,
  Briefcase,
  AlertTriangle,
} from "lucide-react";
import { RiskManager } from "./RiskManager";

export const Profile: React.FC = () => {
  const { portfolio, theme, toggleTheme, addToast } = useTradingStore();
  const [showRiskManager, setShowRiskManager] = React.useState(false);

  const stats = [
    {
      label: "Total Trades",
      value: portfolio.trades.length,
      icon: <Briefcase size={20} />,
    },
    {
      label: "Realized P&L",
      value: `₹${portfolio.realizedPnL.toLocaleString()}`,
      icon: <CheckCircle size={20} />,
      color: "text-green",
    },
    { label: "Account Age", value: "Today", icon: <Clock size={20} /> },
  ];

  const [notifEnabled, setNotifEnabled] = React.useState(false);

  const handleNotifToggle = async () => {
    // If user is trying to turn it ON
    if (!notifEnabled) {
      if (!("Notification" in window)) {
        addToast("This browser does not support notifications.", "error");
        return;
      }

      // Check current permission first
      if (Notification.permission === "denied") {
        addToast(
          "Notification permission is blocked. Please reset it from browser settings.",
          "error",
        );
        return;
      }

      // Request permission
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setNotifEnabled(true);
        addToast("Notifications enabled successfully!", "success");
      } else {
        addToast(
          "Permission denied. Notifications cannot be enabled.",
          "error",
        );
      }
    } else {
      // Turn it OFF
      setNotifEnabled(false);
      addToast("Notifications disabled.", "info");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-hero">
        <div className="profile-hero-content">
          <div className="avatar-large-wrapper">
            <div className="avatar-large">
              <User size={60} />
            </div>
            <button className="edit-avatar">
              <Camera size={16} />
            </button>
          </div>
          <div className="profile-basic-info">
            <h1>Shitosh S.</h1>
            <div className="profile-badges">
              <span className="badge-pro">PRO USER</span>
              <span className="badge-id">ID: TX-2026-990</span>
            </div>
            <p className="profile-email">
              <Mail size={14} /> shitosh.s@example.com
            </p>
          </div>
        </div>
      </div>

      <div className="profile-content-grid">
        <div className="profile-main-stats">
          <h2>Account Performance</h2>
          <div className="stats-row">
            {stats.map((stat, i) => (
              <div key={i} className="profile-stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-info">
                  <span className="lbl">{stat.label}</span>
                  <span className={`val ${stat.color || ""}`}>
                    {stat.value}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="profile-settings-section">
            <h2>Preferences</h2>
            <div className="settings-list">
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-icon">
                    <Monitor size={20} />
                  </div>
                  <div>
                    <div className="name">Display Theme</div>
                    <div className="desc">
                      Toggle between light and dark mode
                    </div>
                  </div>
                </div>
                <button
                  className={`theme-toggle-btn ${theme}`}
                  onClick={toggleTheme}
                >
                  <div className="toggle-thumb"></div>
                </button>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-icon">
                    <Bell size={20} />
                  </div>
                  <div>
                    <div className="name">Notifications</div>
                    <div className="desc">Alerts for orders and execution</div>
                  </div>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={notifEnabled}
                    onChange={handleNotifToggle}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-sidebar-sections">
          <div className="profile-card-mini security">
            <h3>
              <Shield size={18} /> Security
            </h3>
            <div className="security-item">
              <span className="label">Two-Factor Auth</span>
              <span className="status enabled">ENABLED</span>
            </div>
            <div className="security-item">
              <span className="label">Last Login</span>
              <span className="val">Today, 17:21 PM</span>
            </div>
            <button
              className="security-btn"
              onClick={() => setShowRiskManager(true)}
            >
              <AlertTriangle size={16} /> Risk Settings
            </button>
          </div>

          <button className="logout-button">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </div>

      {showRiskManager && (
        <div
          className="modal-overlay"
          onClick={() => setShowRiskManager(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <RiskManager />
            <button
              className="close-modal-btn"
              onClick={() => setShowRiskManager(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
