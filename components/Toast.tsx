"use client";

import React from "react";
import { useTradingStore, Toast } from "@/store/tradingStore";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => {
  const { removeToast } = useTradingStore();

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle size={18} className="text-green" />;
      case "error":
        return <AlertCircle size={18} className="text-red" />;
      case "info":
        return <Info size={18} className="text-blue" />;
    }
  };

  return (
    <div className={`toast-item ${toast.type}`}>
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-message">{toast.message}</div>
      <button className="toast-close" onClick={() => removeToast(toast.id)}>
        <X size={14} />
      </button>
      <div className="toast-progress"></div>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts } = useTradingStore();

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};
