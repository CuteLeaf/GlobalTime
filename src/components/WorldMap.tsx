"use client";

import { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, Polyline, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { timezoneCities, TimezoneCity } from "@/data/timezones";

function formatTimeForOffset(lng: number): { time: string; date: string; offset: string } {
  const offsetHours = Math.round(lng / 15);
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const localTime = new Date(utc + offsetHours * 3600000);
  
  const time = localTime.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  const date = localTime.toLocaleDateString("zh-CN", { month: "short", day: "numeric", weekday: "short" });
  const sign = offsetHours >= 0 ? "+" : "";
  const offset = `UTC${sign}${offsetHours}`;
  
  return { time, date, offset };
}

function formatTime(timezone: string): { time: string; shortTime: string; date: string; isDay: boolean; offset: string } {
  const now = new Date();
  const time = new Intl.DateTimeFormat("zh-CN", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(now);

  const shortTime = new Intl.DateTimeFormat("zh-CN", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);
  
  const date = new Intl.DateTimeFormat("zh-CN", {
    timeZone: timezone,
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(now);
  
  const hour = parseInt(new Intl.DateTimeFormat("en-US", { timeZone: timezone, hour: "numeric", hour12: false }).format(now));
  const isDay = hour >= 6 && hour < 18;

  const utcDate = new Date(now.toLocaleString("en-US", { timeZone: "UTC" }));
  const tzDate = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
  const diff = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
  const sign = diff >= 0 ? "+" : "";
  const offset = `UTC${sign}${diff}`;
  
  return { time, shortTime, date, isDay, offset };
}


// 根据语言获取默认位置
function getDefaultLocation(): { lat: number; lng: number; zoom: number } {
  if (typeof navigator === "undefined") return { lat: 25, lng: 0, zoom: 2 };
  
  const lang = navigator.language.toLowerCase();
  
  // 语言到位置的映射
  const locationMap: Record<string, { lat: number; lng: number; zoom: number }> = {
    "zh": { lat: 35, lng: 105, zoom: 4 },      // 中国
    "zh-cn": { lat: 35, lng: 105, zoom: 4 },   // 中国大陆
    "zh-tw": { lat: 23.5, lng: 121, zoom: 5 }, // 台湾
    "zh-hk": { lat: 22.3, lng: 114, zoom: 6 }, // 香港
    "ja": { lat: 36, lng: 138, zoom: 5 },      // 日本
    "ko": { lat: 36, lng: 128, zoom: 5 },      // 韩国
    "en": { lat: 40, lng: -100, zoom: 4 },     // 美国
    "en-us": { lat: 40, lng: -100, zoom: 4 },  // 美国
    "en-gb": { lat: 54, lng: -2, zoom: 5 },    // 英国
    "en-au": { lat: -25, lng: 135, zoom: 4 },  // 澳大利亚
    "de": { lat: 51, lng: 10, zoom: 5 },       // 德国
    "fr": { lat: 46, lng: 2, zoom: 5 },        // 法国
    "es": { lat: 40, lng: -4, zoom: 5 },       // 西班牙
    "pt": { lat: -15, lng: -50, zoom: 4 },     // 巴西
    "pt-br": { lat: -15, lng: -50, zoom: 4 },  // 巴西
    "ru": { lat: 60, lng: 100, zoom: 3 },      // 俄罗斯
    "ar": { lat: 25, lng: 45, zoom: 4 },       // 阿拉伯
    "hi": { lat: 22, lng: 78, zoom: 4 },       // 印度
  };
  
  // 精确匹配
  if (locationMap[lang]) return locationMap[lang];
  
  // 语言前缀匹配
  const prefix = lang.split("-")[0];
  if (locationMap[prefix]) return locationMap[prefix];
  
  return { lat: 25, lng: 0, zoom: 2 };
}

// 初始化地图位置，动画完成后回调
function InitialPosition({ onComplete }: { onComplete: () => void }) {
  const map = useMap();
  useEffect(() => {
    const { lat, lng, zoom } = getDefaultLocation();
    map.flyTo([lat, lng], zoom, { duration: 1.5 });
    
    const timer = setTimeout(onComplete, 1600);
    return () => clearTimeout(timer);
  }, [map, onComplete]);
  return null;
}

// 时区经线（每15度一条）
function TimezoneLines({ visible }: { visible: boolean }) {
  if (!visible) return null;
  
  const lines: Array<{ positions: [number, number][]; isDateLine: boolean }> = [];
  
  // 生成时区线 (-180 到 180，每15度)
  for (let lng = -180; lng <= 180; lng += 15) {
    const isDateLine = lng === 180 || lng === -180;
    lines.push({
      positions: [[-85, lng], [85, lng]],
      isDateLine,
    });
  }
  
  return (
    <>
      {lines.map((line, i) => (
        <Polyline
          key={i}
          positions={line.positions}
          pathOptions={{
            color: line.isDateLine ? "#ef4444" : "rgba(255, 255, 255, 0.15)",
            weight: line.isDateLine ? 2 : 1,
            dashArray: line.isDateLine ? undefined : "5, 10",
            opacity: line.isDateLine ? 0.8 : 0.5,
          }}
        />
      ))}
    </>
  );
}

// 获取日期变更线两侧的日期
function getDateLineDates(): { westDate: string; eastDate: string } {
  const now = new Date();
  
  // UTC+12 (日期变更线西侧，如新西兰) - "明天"
  const westDate = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Pacific/Auckland",
    month: "numeric",
    day: "numeric",
    weekday: "short",
  }).format(now);
  
  // UTC-12 (日期变更线东侧) - "昨天"
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const eastTime = new Date(utc - 12 * 3600000);
  const eastDate = eastTime.toLocaleDateString("zh-CN", {
    month: "numeric",
    day: "numeric",
    weekday: "short",
  });
  
  return { westDate, eastDate };
}

// 创建固定大小的标记图标
function createMarkerIcon(isDay: boolean) {
  const color = isDay ? "#f59e0b" : "#6366f1";
  const glow = isDay ? "rgba(245, 158, 11, 0.5)" : "rgba(99, 102, 241, 0.5)";
  
  return L.divIcon({
    className: "city-marker",
    html: `<div style="
      width: 12px;
      height: 12px;
      background: ${color};
      border: 2px solid rgba(255,255,255,0.8);
      border-radius: 50%;
      box-shadow: 0 0 10px ${glow}, 0 0 20px ${glow};
    "></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
}

function CityMarker({ city }: { city: TimezoneCity }) {
  const [timeInfo, setTimeInfo] = useState(() => formatTime(city.timezone));
  const [icon, setIcon] = useState(() => createMarkerIcon(formatTime(city.timezone).isDay));

  useEffect(() => {
    const interval = setInterval(() => {
      const info = formatTime(city.timezone);
      setTimeInfo(info);
      setIcon(createMarkerIcon(info.isDay));
    }, 1000);
    return () => clearInterval(interval);
  }, [city.timezone]);

  return (
    <Marker position={[city.lat, city.lng]} icon={icon}>
      <Tooltip
        direction="top"
        offset={[0, -10]}
        opacity={1}
        className="city-tooltip"
      >
        <div className="tooltip-content">
          <div className="tooltip-header">
            <div className={`status-dot ${timeInfo.isDay ? "day" : "night"}`} />
            <div className="city-info">
              <span className="city-name">{city.name}</span>
              <span className="country-name">{city.country}</span>
            </div>
          </div>
          <div className="time-display">
            <span className="time">{timeInfo.time}</span>
            <span className="date">{timeInfo.date}</span>
          </div>
          <div className="tooltip-footer">
            <span className="offset">{timeInfo.offset}</span>
            <span className="day-night">{timeInfo.isDay ? "☀️ 白天" : "🌙 夜晚"}</span>
          </div>
        </div>
      </Tooltip>
    </Marker>
  );
}

function MouseTracker({ onMove }: { onMove: (info: { lat: number; lng: number; time: string; date: string; offset: string } | null) => void }) {
  useMapEvents({
    mousemove(e) {
      const { lat, lng } = e.latlng;
      onMove({ lat, lng, ...formatTimeForOffset(lng) });
    },
    mouseout() { onMove(null); },
  });
  return null;
}


export default function WorldMap() {
  const [mounted, setMounted] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);
  const [mouseInfo, setMouseInfo] = useState<{ lat: number; lng: number; time: string; date: string; offset: string } | null>(null);
  const [dateLineInfo, setDateLineInfo] = useState(getDateLineDates);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const interval = setInterval(() => setDateLineInfo(getDateLineDates()), 1000);
    return () => clearInterval(interval);
  }, []);
  const handleMouse = useCallback((info: typeof mouseInfo) => setMouseInfo(info), []);
  const handleAnimationComplete = useCallback(() => setAnimationDone(true), []);

  if (!mounted) {
    return (
      <div className="loading-screen">
        <div className="loader" />
        <span>加载中...</span>
      </div>
    );
  }

  return (
    <div className="map-wrapper">
      <MapContainer
        center={[25, 0]}
        zoom={2}
        minZoom={2}
        maxZoom={8}
        zoomControl={false}
        className="map-container"
        worldCopyJump={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <TimezoneLines visible={animationDone} />
        <InitialPosition onComplete={handleAnimationComplete} />
        <MouseTracker onMove={handleMouse} />
        {timezoneCities.map((city) => (
          <CityMarker key={city.name} city={city} />
        ))}
      </MapContainer>

      {/* 鼠标跟随信息 */}
      {mouseInfo && (
        <div className="mouse-info">
          <div className="mouse-time">{mouseInfo.time}</div>
          <div className="mouse-meta">
            <span>{mouseInfo.offset}</span>
            <span className="coords">{mouseInfo.lat.toFixed(1)}°, {mouseInfo.lng.toFixed(1)}°</span>
          </div>
        </div>
      )}

      {/* 日期变更线信息 */}
      <div className="dateline-panel">
        <div className="dateline-title">
          <span className="dateline-indicator" />
          日期变更线
        </div>
        <div className="dateline-dates">
          <div className="dateline-side west">
            <span className="side-label">西侧</span>
            <span className="side-date">{dateLineInfo.westDate}</span>
          </div>
          <div className="dateline-divider">|</div>
          <div className="dateline-side east">
            <span className="side-label">东侧</span>
            <span className="side-date">{dateLineInfo.eastDate}</span>
          </div>
        </div>
      </div>

      {/* 图例 */}
      <div className="legend">
        <div className="legend-item">
          <span className="legend-dot day" />
          <span>白天</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot night" />
          <span>夜晚</span>
        </div>
      </div>
    </div>
  );
}
