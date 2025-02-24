import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [symbol, setSymbol] = useState("");
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [data, setData] = useState([]);
  const [intervalId, setIntervalId] = useState(null);

  const fetchStockData = async () => {
    if (!symbol) return;
    const apiKey = process.env.REACT_APP_FINNHUB_API_KEY;
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;

    try {
      const response = await axios.get(url);
      const newEntry = {
        time: new Date().toLocaleTimeString(),
        open: response.data.o,
        high: response.data.h,
        low: response.data.l,
        current: response.data.c,
        prevClose: response.data.pc,
      };
      setData((prevData) => [...prevData, newEntry]);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  const startFetching = () => {
    if (intervalId) clearInterval(intervalId);
    fetchStockData();
    const totalMilliseconds = (minutes * 60 + seconds) * 1000;
    const newIntervalId = setInterval(fetchStockData, totalMilliseconds);
    setIntervalId(newIntervalId);
  };

  return (
    <div className="container">
      <h1>Stock Exchange - SCE’s Financial Advising App</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter Stock Symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
        />
        <input
          type="number"
          placeholder="Minutes"
          value={minutes}
          onChange={(e) => setMinutes(Math.max(0, parseInt(e.target.value)))}
        />
        <input
          type="number"
          placeholder="Seconds"
          value={seconds}
          onChange={(e) => setSeconds(Math.max(0, parseInt(e.target.value)))}
        />
        <button onClick={startFetching}>Start Tracking</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Open</th>
            <th>High</th>
            <th>Low</th>
            <th>Current</th>
            <th>Prev Close</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index}>
              <td>{entry.time}</td>
              <td>${entry.open.toFixed(2)}</td>
              <td>${entry.high.toFixed(2)}</td>
              <td>${entry.low.toFixed(2)}</td>
              <td>${entry.current.toFixed(2)}</td>
              <td>${entry.prevClose.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
