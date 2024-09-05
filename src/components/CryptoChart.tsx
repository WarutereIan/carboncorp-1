import TradeViewChart from "react-crypto-chart";

export default function CryptoChart() {
  return (
    <div className="parent">
      <TradeViewChart
        interval="5m"
        containerStyle={{
          minHeight: "60vh",
          minWidth: "100%",
          marginBottom: "30px",
        }}
        chartLayout={{
          layout: {
            backgroundColor: "white",
            textColor: "black",
          },
          grid: {
            vertLines: {
              color: "#838fa3",
              style: 1,
            },
            horzLines: {
              color: "#838fa3",
              style: 1,
            },
          },
          crosshair: {
            mode: 0,
          },
          priceScale: {
            borderColor: "#485c7b",
          },
          timeScale: {
            borderColor: "#485c7b",
            timeVisible: true,
            secondsVisible: false,
          },
        }}
        candleStickConfig={{
          upColor: "green",
          downColor: "red",
          borderDownColor: "transparent",
          borderUpColor: "transparent",
          wickDownColor: "gray",
          wickUpColor: "gray",
        }}
        pair="ETHUSDT"
        histogramConfig={{}}
      />
    </div>
  );
}
