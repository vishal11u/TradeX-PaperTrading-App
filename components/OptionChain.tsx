import React from "react";
import { useTradingStore } from "@/store/tradingStore";

const formatVolume = (val: number | undefined) => {
  if (!val) return "-";
  if (val > 1000000) return (val / 1000000).toFixed(1) + "M";
  if (val > 1000) return (val / 1000).toFixed(1) + "K";
  return val.toString();
};

export const OptionChain: React.FC = () => {
  const { optionChain, selectedStock, selectedOption, setSelectedOption } =
    useTradingStore();

  const prevUnderlyingRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (optionChain && optionChain.underlying !== prevUnderlyingRef.current) {
      // Small delay to ensure the DOM is rendered
      setTimeout(() => {
        const atmRow = document.querySelector(".atm-strike");
        atmRow?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
      prevUnderlyingRef.current = optionChain.underlying;
    }
  }, [optionChain]);

  if (!optionChain || !selectedStock) {
    return (
      <div className="empty-state">
        <p>Select a stock to view option chain</p>
      </div>
    );
  }

  return (
    <div className="option-chain">
      <div className="option-header">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <h3>{selectedStock.symbol}</h3>
          <div className="expiry-selector-pill">
            {new Date(optionChain.expiries[0]).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <button
            className="center-atm-btn"
            onClick={() => {
              const atmRow = document.querySelector(".atm-strike");
              atmRow?.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
          >
            Center ATM
          </button>
          <div className="underlying-price">
            Underlying:{" "}
            <span className="mono text-green">
              ₹{optionChain.underlyingPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="option-table-container">
        <table className="option-table">
          <thead>
            <tr>
              <th colSpan={6} className="calls-header">
                CALLS
              </th>
              <th className="strike-header">STRIKE</th>
              <th colSpan={6} className="puts-header">
                PUTS
              </th>
            </tr>
            <tr>
              <th>OI</th>
              <th>Vol</th>
              <th>Delta</th>
              <th>Theta</th>
              <th>LTP</th>
              <th>IV</th>
              <th>Strike</th>
              <th>IV</th>
              <th>LTP</th>
              <th>Delta</th>
              <th>Theta</th>
              <th>Vol</th>
              <th>OI</th>
            </tr>
          </thead>
          <tbody>
            {optionChain.strikes.map((strike) => {
              const callKey = `${optionChain.underlying}-${strike}-CALL`;
              const putKey = `${optionChain.underlying}-${strike}-PUT`;
              const call = optionChain.calls[callKey];
              const put = optionChain.puts[putKey];

              const strikeInterval = [
                "SENSEX",
                "BANKNIFTY",
                "FINNIFTY",
              ].includes(optionChain.underlying)
                ? 100
                : 50;
              const isATM =
                Math.abs(strike - optionChain.underlyingPrice) <
                strikeInterval / 2;

              const isCallITM = strike < optionChain.underlyingPrice;
              const isPutITM = strike > optionChain.underlyingPrice;

              return (
                <tr key={strike} className={isATM ? "atm-strike" : ""}>
                  {/* Call Side */}
                  <td className={`mono text-xs ${isCallITM ? "itm-call" : ""}`}>
                    {formatVolume(call?.oi)}
                  </td>
                  <td className={`mono text-xs ${isCallITM ? "itm-call" : ""}`}>
                    {formatVolume(call?.volume)}
                  </td>
                  <td
                    className={`mono text-xs text-gray ${isCallITM ? "itm-call" : ""}`}
                  >
                    {call?.delta?.toFixed(2) || "0.00"}
                  </td>
                  <td
                    className={`mono text-xs text-gray ${isCallITM ? "itm-call" : ""}`}
                  >
                    {call?.theta?.toFixed(1) || "0.0"}
                  </td>
                  <td
                    className={`mono ltp-cell clickable-option ${isCallITM ? "itm-call" : ""}`}
                    onClick={() => call && setSelectedOption(call)}
                    style={{
                      background:
                        selectedOption?.symbol === call?.symbol
                          ? "var(--accent-blue) !important"
                          : undefined,
                      color:
                        selectedOption?.symbol === call?.symbol
                          ? "white"
                          : "var(--accent-green)",
                    }}
                  >
                    {call?.ltp.toFixed(2)}
                  </td>
                  <td className={`mono text-xs ${isCallITM ? "itm-call" : ""}`}>
                    {call?.iv.toFixed(1)}%
                  </td>

                  {/* Strike Price */}
                  <td className="strike-price mono">{strike}</td>

                  {/* Put Side */}
                  <td className={`mono text-xs ${isPutITM ? "itm-put" : ""}`}>
                    {put?.iv.toFixed(1)}%
                  </td>
                  <td
                    className={`mono ltp-cell clickable-option ${isPutITM ? "itm-put" : ""}`}
                    onClick={() => put && setSelectedOption(put)}
                    style={{
                      background:
                        selectedOption?.symbol === put?.symbol
                          ? "var(--accent-blue) !important"
                          : undefined,
                      color:
                        selectedOption?.symbol === put?.symbol
                          ? "white"
                          : "var(--accent-red)",
                    }}
                  >
                    {put?.ltp.toFixed(2)}
                  </td>
                  <td
                    className={`mono text-xs text-gray ${isPutITM ? "itm-put" : ""}`}
                  >
                    {put?.delta?.toFixed(2) || "0.00"}
                  </td>
                  <td
                    className={`mono text-xs text-gray ${isPutITM ? "itm-put" : ""}`}
                  >
                    {put?.theta?.toFixed(1) || "0.0"}
                  </td>
                  <td className={`mono text-xs ${isPutITM ? "itm-put" : ""}`}>
                    {formatVolume(put?.volume)}
                  </td>
                  <td className={`mono text-xs ${isPutITM ? "itm-put" : ""}`}>
                    {formatVolume(put?.oi)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
