import React from 'react';
import { useTradingStore } from '@/store/tradingStore';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export const Orders: React.FC = () => {
  const { portfolio, cancelOrder } = useTradingStore();
  
  const sortedOrders = [...portfolio.orders].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  if (sortedOrders.length === 0) {
    return (
      <div className="empty-state">
        <p>No orders placed</p>
      </div>
    );
  }
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'EXECUTED':
        return <CheckCircle size={16} className="text-green" />;
      case 'CANCELLED':
        return <XCircle size={16} className="text-gray" />;
      case 'REJECTED':
        return <AlertCircle size={16} className="text-red" />;
      default:
        return <Clock size={16} className="text-yellow" />;
    }
  };
  
  return (
    <div className="orders-container">
      <table className="positions-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Symbol</th>
            <th>Type</th>
            <th>Side</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedOrders.map(order => (
            <tr key={order.id}>
              <td className="mono text-sm">
                {new Date(order.timestamp).toLocaleTimeString()}
              </td>
              <td className="symbol">{order.symbol}</td>
              <td>
                <span className="badge">{order.type}</span>
              </td>
              <td>
                <span className={`badge ${order.side.toLowerCase()}`}>
                  {order.side}
                </span>
              </td>
              <td className="mono">{order.quantity}</td>
              <td className="mono">
                {order.executedPrice 
                  ? `₹${order.executedPrice.toFixed(2)}`
                  : order.price 
                  ? `₹${order.price.toFixed(2)}`
                  : 'Market'}
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {getStatusIcon(order.status)}
                  <span className={`status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
              </td>
              <td>
                {order.status === 'PENDING' && (
                  <button
                    className="action-btn"
                    onClick={() => cancelOrder(order.id)}
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
