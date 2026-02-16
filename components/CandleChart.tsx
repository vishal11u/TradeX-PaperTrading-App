"use client";

import React, { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  IChartApi,
  ISeriesApi,
  CandlestickSeries,
} from "lightweight-charts";
import { useTradingStore } from "@/store/tradingStore";
import { Candle } from "@/types/trading";

interface CandleChartProps {
  timeframe: string;
}

export const CandleChart: React.FC<CandleChartProps> = ({ timeframe }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  const { selectedStock, candleHistory, currentCandles, theme } =
    useTradingStore();

  // Initialize Chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: theme === "dark" ? "#d1d5db" : "#374151",
      },
      width: chartContainerRef.current.clientWidth,
      height: 350,
      grid: {
        vertLines: {
          color:
            theme === "dark"
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.1)",
        },
        horzLines: {
          color:
            theme === "dark"
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.1)",
        },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    chartRef.current = chart;
    seriesRef.current = series;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [theme]);

  // Update Data
  useEffect(() => {
    if (!seriesRef.current || !selectedStock) return;

    const history = candleHistory[selectedStock.symbol] || [];
    const current = currentCandles[selectedStock.symbol];

    // Combine history + current
    const rawData = [...history];
    if (current) {
      // Only add current if it's newer than last history
      const last = rawData[rawData.length - 1];
      if (!last || current.time >= last.time) {
        rawData.push(current);
      }
    }

    // Sort and Unique
    const sortedData = Array.from(
      new Map(rawData.map((item) => [item.time, item])).values(),
    ).sort((a, b) => a.time - b.time);

    // Initial check for 1m - no aggregation needed if 1m
    if (timeframe === "1m") {
      seriesRef.current.setData(sortedData as any);
      return;
    }

    // Aggregation Logic
    const intervalMap: Record<string, number> = {
      "5m": 5,
      "15m": 15,
      "1h": 60,
      "1D": 1440,
    };
    const intervalMinutes = intervalMap[timeframe] || 1;
    const intervalSeconds = intervalMinutes * 60;

    const aggregatedData: Candle[] = [];
    let currentBucket: Candle | null = null;
    let bucketStartTime = 0;

    for (const candle of sortedData) {
      const bucketTime =
        Math.floor(candle.time / intervalSeconds) * intervalSeconds;

      if (!currentBucket || bucketTime !== bucketStartTime) {
        if (currentBucket) aggregatedData.push(currentBucket);
        currentBucket = { ...candle, time: bucketTime };
        bucketStartTime = bucketTime;
      } else {
        currentBucket.high = Math.max(currentBucket.high, candle.high);
        currentBucket.low = Math.min(currentBucket.low, candle.low);
        currentBucket.close = candle.close;
      }
    }
    if (currentBucket) aggregatedData.push(currentBucket);

    seriesRef.current.setData(aggregatedData as any);
  }, [selectedStock, candleHistory, currentCandles, timeframe]);

  return <div ref={chartContainerRef} className="w-full h-[350px]" />;
};
