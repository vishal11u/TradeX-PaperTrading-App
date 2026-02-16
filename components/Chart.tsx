import React, { useState, useEffect } from 'react';
import { useTradingStore } from '@/store/tradingStore';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartDataPoint {
  time: string;
  price: number;
}

export const Chart: React.FC = () => {
  const { selectedStock } = useTradingStore();
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  
  useEffect(() => {
    if (!selectedStock) return;
    
    // Initialize chart with some data
    const initialData: ChartDataPoint[] = [];
    const basePrice = selectedStock.price;
    
    for (let i = 60; i >= 0; i--) {
      const variance = (Math.random() - 0.5) * basePrice * 0.01;
      initialData.push({
        time: new Date(Date.now() - i * 1000).toLocaleTimeString(),
        price: basePrice + variance,
      });
    }
    
    setChartData(initialData);
  }, [selectedStock?.symbol]);
  
  useEffect(() => {
    if (!selectedStock) return;
    
    const interval = setInterval(() => {
      setChartData(prev => {
        const newData = [...prev.slice(1), {
          time: new Date().toLocaleTimeString(),
          price: selectedStock.price,
        }];
        return newData;
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, [selectedStock?.price]);
  
  if (!selectedStock) {
    return (
      <div className="chart-placeholder">
        <p>Select a stock to view chart</p>
      </div>
    );
  }
  
  return (
    <div className="chart-container">
      <div className="stock-header">
        <div>
          <div className="stock-title">{selectedStock.symbol}</div>
          <div className="stock-name text-secondary">{selectedStock.name}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="stock-price">₹{selectedStock.price.toFixed(2)}</div>
          <div className={`change ${selectedStock.change >= 0 ? 'positive' : 'negative'}`}>
            {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change.toFixed(2)} ({selectedStock.changePercent.toFixed(2)}%)
          </div>
        </div>
      </div>
      
      <div className="stock-stats">
        <div className="stat">
          <span className="stat-label">Open</span>
          <span className="stat-value mono">₹{selectedStock.open.toFixed(2)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">High</span>
          <span className="stat-value mono text-green">₹{selectedStock.high.toFixed(2)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Low</span>
          <span className="stat-value mono text-red">₹{selectedStock.low.toFixed(2)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Prev Close</span>
          <span className="stat-value mono">₹{selectedStock.previousClose.toFixed(2)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Volume</span>
          <span className="stat-value mono">{selectedStock.volume.toLocaleString()}</span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis 
            dataKey="time" 
            stroke="#94a3b8"
            tick={{ fontSize: 11 }}
            tickFormatter={(value) => value.split(':').slice(0, 2).join(':')}
          />
          <YAxis 
            stroke="#94a3b8"
            domain={['auto', 'auto']}
            tick={{ fontSize: 11 }}
            tickFormatter={(value) => `₹${value.toFixed(0)}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1a2332', 
              border: '1px solid #2d3748',
              borderRadius: 8,
              fontFamily: 'JetBrains Mono, monospace'
            }}
            formatter={(value: any) => [`₹${value.toFixed(2)}`, 'Price']}
          />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke={selectedStock.change >= 0 ? '#00ff88' : '#ff4757'}
            strokeWidth={2}
            dot={false}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
