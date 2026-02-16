import React, { useState } from "react";
import { useTradingStore } from "@/store/tradingStore";
import { ShoppingCart, TrendingUp, TrendingDown } from "lucide-react";

export const OrderPanel: React.FC = () => {
  const { selectedStock, selectedOption, portfolio, placeOrder, exitPosition } =
    useTradingStore();

  const [orderSide, setOrderSide] = useState<"BUY" | "SELL">("BUY");
  const [orderType, setOrderType] = useState<"MARKET" | "LIMIT" | "STOP_LOSS">(
    "MARKET",
  );
  const [lots, setLots] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);
  const [stopLoss, setStopLoss] = useState<number>(0);
  const [target, setTarget] = useState<number>(0);
  const [trailingStopLoss, setTrailingStopLoss] = useState<number>(0);

  React.useEffect(() => {
    if (selectedOption) {
      setPrice(orderSide === "BUY" ? selectedOption.ask : selectedOption.bid);
    }
  }, [selectedOption, orderSide]);

  const handleSubmit = () => {
    if (!selectedOption || !selectedStock) return;

    placeOrder({
      symbol: selectedOption.symbol,
      optionType: selectedOption.type,
      strike: selectedOption.strike,
      expiry: selectedOption.expiry,
      underlying: selectedStock.symbol,
      type: orderType,
      side: orderSide,
      quantity: lots,
      price: orderType !== "MARKET" ? price : undefined,
      stopLoss: stopLoss > 0 ? stopLoss : undefined,
      target: target > 0 ? target : undefined,
      trailingStopLoss: trailingStopLoss > 0 ? trailingStopLoss : undefined,
    });

    // Reset form
    setLots(1);
    setStopLoss(0);
    setTarget(0);
    setTrailingStopLoss(0);
  };

  // Get lot size based on underlying
  const getLotSize = () => {
    if (!selectedStock) return 1;
    if (selectedStock.symbol === "NIFTY") return 75;
    if (selectedStock.symbol === "BANKNIFTY") return 25;
    if (selectedStock.symbol === "FINNIFTY") return 25;
    if (selectedStock.symbol === "SENSEX") return 10;
    return 1;
  };

  const lotSize = getLotSize();

  const existingPosition = portfolio.positions.find(
    (p) =>
      p.underlying === selectedStock?.symbol &&
      p.strike === selectedOption?.strike &&
      p.optionType === selectedOption?.type,
  );
  const totalQuantity = lots * lotSize;
  const currentPrice =
    orderType === "MARKET"
      ? selectedOption
        ? orderSide === "BUY"
          ? selectedOption.ask
          : selectedOption.bid
        : price
      : price;
  const totalAmount = totalQuantity * currentPrice;

  return (
    <div className="order-panel">
      <div className="section-header">
        <span>Place Order</span>
      </div>

      <div className="order-type-selector">
        <button
          className={`order-type-btn buy ${orderSide === "BUY" ? "active" : ""}`}
          onClick={() => setOrderSide("BUY")}
        >
          BUY
        </button>
        <button
          className={`order-type-btn sell ${orderSide === "SELL" ? "active" : ""}`}
          onClick={() => setOrderSide("SELL")}
        >
          SELL
        </button>
      </div>

      <div className="order-form">
        {!selectedOption ? (
          <div
            className="empty-state"
            style={{ padding: "2rem 1rem", textAlign: "center" }}
          >
            <ShoppingCart
              size={32}
              style={{ opacity: 0.3, marginBottom: "0.5rem" }}
            />
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
              Select an option from the Option Chain to place an order
            </p>
          </div>
        ) : (
          <>
            <div className="option-details">
              <div className="option-badge-container">
                <span
                  className={`option-badge ${selectedOption.type.toLowerCase()}`}
                >
                  {selectedOption.type}
                </span>
                <span className="underlying-badge">
                  {selectedStock?.symbol}
                </span>
              </div>

              <div className="strike-display">
                <span className="strike-label">Strike Price</span>
                <span className="strike-value mono">
                  {selectedOption.strike}
                </span>
              </div>

              <div className="expiry-display">
                <span className="expiry-label">Expiry</span>
                <span className="expiry-value">
                  {new Date(selectedOption.expiry).toLocaleDateString()}
                </span>
              </div>

              <div className="greeks-display">
                <div className="greek-item">
                  <span className="greek-label">Delta</span>
                  <span className="greek-value mono">
                    {selectedOption.delta?.toFixed(3)}
                  </span>
                </div>
                <div className="greek-item">
                  <span className="greek-label">Theta</span>
                  <span className="greek-value mono">
                    {selectedOption.theta?.toFixed(2)}
                  </span>
                </div>
                <div className="greek-item">
                  <span className="greek-label">IV</span>
                  <span className="greek-value mono">
                    {selectedOption.iv?.toFixed(1) || "0.0"}%
                  </span>
                </div>
              </div>

              <div className="current-price-display">
                <div className="price-item">
                  <span className="price-label">Bid</span>
                  <span className="price-value mono text-red">
                    ₹{selectedOption.bid?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="price-item">
                  <span className="price-label">LTP</span>
                  <span className="price-value mono">
                    ₹{selectedOption.ltp?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="price-item">
                  <span className="price-label">Ask</span>
                  <span className="price-value mono text-green">
                    ₹{selectedOption.ask?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Order Type</label>
              <select
                className="form-select"
                value={orderType}
                onChange={(e) => setOrderType(e.target.value as any)}
              >
                <option value="MARKET">Market</option>
                <option value="LIMIT">Limit</option>
                <option value="STOP_LOSS">Stop Loss</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Lots ({lotSize} qty/lot)</label>
              <input
                type="number"
                className="form-input"
                value={lots}
                onChange={(e) => setLots(parseInt(e.target.value) || 1)}
                min="1"
              />
              <div className="qty-selector">
                {[1, 2, 5, 10].map((qty) => (
                  <button
                    key={qty}
                    className="qty-btn"
                    onClick={() => setLots(qty)}
                  >
                    {qty}
                  </button>
                ))}
              </div>
              <div className="lot-info">
                Total Quantity: <span className="mono">{totalQuantity}</span>
              </div>
            </div>

            {orderType !== "MARKET" && (
              <div className="form-group">
                <label className="form-label">Price per Qty</label>
                <input
                  type="number"
                  className="form-input"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  step="0.05"
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Stop Loss (Optional)</label>
              <input
                type="number"
                className="form-input"
                value={stopLoss || ""}
                onChange={(e) => setStopLoss(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                step="0.05"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Trailing SL (Optional)</label>
              <input
                type="number"
                className="form-input"
                value={trailingStopLoss || ""}
                onChange={(e) =>
                  setTrailingStopLoss(parseFloat(e.target.value) || 0)
                }
                placeholder="Initial TSL price"
                step="0.05"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Target (Optional)</label>
              <input
                type="number"
                className="form-input"
                value={target || ""}
                onChange={(e) => setTarget(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                step="0.05"
              />
            </div>

            <div className="order-summary">
              <div className="summary-row">
                <span>Price per Qty</span>
                <span className="mono">₹{currentPrice.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Total Quantity</span>
                <span className="mono">{totalQuantity}</span>
              </div>
              <div
                className="summary-row"
                style={{
                  borderTop: "1px solid var(--border-color)",
                  paddingTop: "0.5rem",
                  marginTop: "0.5rem",
                }}
              >
                <span style={{ fontWeight: 600 }}>Total Amount</span>
                <span className="mono" style={{ fontWeight: 700 }}>
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
              <div className="summary-row">
                <span>Available Balance</span>
                <span className="mono">₹{portfolio.balance.toFixed(2)}</span>
              </div>
              {orderSide === "BUY" && totalAmount > portfolio.balance && (
                <div className="insufficient-funds">Insufficient funds</div>
              )}
            </div>

            {existingPosition && (
              <div className="existing-position-info">
                <div className="pos-label">Current Position</div>
                <div className="pos-data">
                  <span
                    className={`badge ${existingPosition.side.toLowerCase()}`}
                  >
                    {existingPosition.side} {existingPosition.quantity} QTY
                  </span>
                  <span
                    className={`mono ${(existingPosition.pnl ?? 0) >= 0 ? "text-green" : "text-red"}`}
                  >
                    P&L: ₹{existingPosition.pnl?.toFixed(2)}
                  </span>
                </div>
                <button
                  className="submit-order sell"
                  style={{
                    marginTop: "0.5rem",
                    background: "var(--accent-red)",
                  }}
                  onClick={() => exitPosition(existingPosition.id)}
                >
                  EXIT POSITION (SQUARE OFF)
                </button>
              </div>
            )}

            <button
              className={`submit-order ${orderSide.toLowerCase()}`}
              onClick={handleSubmit}
              disabled={
                !selectedOption ||
                (orderSide === "BUY" && totalAmount > portfolio.balance)
              }
            >
              {orderSide} {lots} LOT{lots > 1 ? "S" : ""} @ ₹
              {currentPrice.toFixed(2)}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
