import React from "react";
import { useTradingStore } from "@/store/tradingStore";
import { Shield, AlertTriangle, Lock, Unlock, Settings } from "lucide-react";

export const RiskManager: React.FC = () => {
  const { portfolio, updateRiskSettings } = useTradingStore();
  const { riskSettings } = portfolio;

  return (
    <div className="risk-manager-overlay">
      <div className="risk-header">
        <Shield size={24} className="accent-blue" />
        <div>
          <h2>Risk Management</h2>
          <p>Circuit Breaker & Position Controls</p>
        </div>
      </div>

      <div className="risk-status-banner">
        {riskSettings.isLocked ? (
          <div className="status locked">
            <Lock size={20} />
            <div>
              <strong>ACCOUNT LOCKED</strong>
              <span>Circuit breaker triggered. Trading is restricted.</span>
            </div>
          </div>
        ) : (
          <div className="status active">
            <Unlock size={20} />
            <div>
              <strong>ACTIVE PROTECTION</strong>
              <span>Circuit breaker is monitoring your account.</span>
            </div>
          </div>
        )}
      </div>

      <div className="risk-settings-grid">
        <div className="setting-card">
          <div className="setting-header">
            <AlertTriangle size={18} />
            <span>Daily Loss Limit</span>
          </div>
          <div className="setting-control">
            <input
              type="range"
              min="1"
              max="10"
              value={riskSettings.dailyLossLimit}
              onChange={(e) =>
                updateRiskSettings({ dailyLossLimit: Number(e.target.value) })
              }
              className="risk-slider"
            />
            <span className="value">{riskSettings.dailyLossLimit}%</span>
          </div>
          <p className="desc">
            Trading will be locked if you lose more than this percentage in a
            single day.
          </p>
        </div>

        <div className="setting-card">
          <div className="setting-header">
            <Settings size={18} />
            <span>Max Trades Per Day</span>
          </div>
          <div className="setting-control">
            <input
              type="number"
              min="1"
              max="50"
              value={riskSettings.maxTradesPerDay}
              onChange={(e) =>
                updateRiskSettings({ maxTradesPerDay: Number(e.target.value) })
              }
              className="number-input"
            />
          </div>
          <p className="desc">
            Prevents overtrading by limiting the number of executions per
            session.
          </p>
        </div>

        <div className="setting-card">
          <div className="setting-header">
            <Shield size={18} />
            <span>Circuit Breaker</span>
          </div>
          <div className="setting-control">
            <label className="switch">
              <input
                type="checkbox"
                checked={riskSettings.circuitBreakerEnabled}
                onChange={(e) =>
                  updateRiskSettings({
                    circuitBreakerEnabled: e.target.checked,
                  })
                }
              />
              <span className="slider round"></span>
            </label>
            <span className="value">
              {riskSettings.circuitBreakerEnabled ? "ON" : "OFF"}
            </span>
          </div>
          <p className="desc">
            Automatically locks your account when risk limits are breached.
          </p>
        </div>
      </div>

      {riskSettings.isLocked && (
        <div className="unlock-section">
          <h3>Account Locked</h3>
          <p>
            Your account has been locked to protect your capital. You can
            manually unlock it, but we recommend reviewing your trades first.
          </p>
          <button
            className="unlock-btn"
            onClick={() => updateRiskSettings({ isLocked: false })}
          >
            <Unlock size={18} /> Unlock Account
          </button>
        </div>
      )}
    </div>
  );
};
