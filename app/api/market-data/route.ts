import { NextResponse } from "next/server";
import yahooFinance from "@/lib/yahooFinance";

export async function GET() {
  try {
    const symbols = ["^NSEI", "^NSEBANK", "^BSESN", "NIFTY_FIN_SERVICE.NS"];
    const results = await Promise.all(
      symbols.map((symbol) => yahooFinance.quote(symbol)),
    );

    const formattedData = results.map((quote: any) => ({
      symbol:
        quote.symbol === "^NSEI"
          ? "NIFTY"
          : quote.symbol === "^NSEBANK"
            ? "BANKNIFTY"
            : quote.symbol === "^BSESN"
              ? "SENSEX"
              : "FINNIFTY",
      name: quote.shortName || quote.longName,
      price: quote.regularMarketPrice,
      change: quote.regularMarketChange,
      changePercent: quote.regularMarketChangePercent,
      volume: quote.regularMarketVolume,
      high: quote.regularMarketDayHigh,
      low: quote.regularMarketDayLow,
      open: quote.regularMarketOpen,
      previousClose: quote.regularMarketPreviousClose,
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Yahoo Finance Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch market data" },
      { status: 500 },
    );
  }
}
