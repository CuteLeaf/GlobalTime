"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const WorldMap = dynamic(() => import("@/components/WorldMap"), {
  ssr: false,
  loading: () => (
    <div className="loading-screen">
      <div className="loader" />
      <span>加载中...</span>
    </div>
  ),
});

export default function Home() {
  const [localTime, setLocalTime] = useState("");
  const [localDate, setLocalDate] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setLocalTime(now.toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }));
      setLocalDate(now.toLocaleDateString("zh-CN", {
        month: "short",
        day: "numeric",
        weekday: "short",
      }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="map-wrapper">
      <WorldMap />
      
      {/* Header */}
      <header className="header">
        <div className="brand">
          <span className="brand-icon">🌍</span>
          <div className="brand-text">
            <h1>World Timezone</h1>
            <p>实时世界时区地图</p>
          </div>
        </div>
        
        <div className="local-time">
          <div className="time">{localTime}</div>
          <div className="label">本地时间 · {localDate}</div>
        </div>
      </header>
    </main>
  );
}
