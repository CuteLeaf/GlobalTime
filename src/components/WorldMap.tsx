"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Map, Marker, Popup, Source, Layer, MapRef } from "react-map-gl/maplibre";
import type { MapLayerMouseEvent, ViewStateChangeEvent } from "react-map-gl/maplibre";
import type { SymbolLayerSpecification, LineLayerSpecification } from "maplibre-gl";
import { featuredCities, TimezoneCity } from "@/data/timezones";
import SearchBox from "./SearchBox";
import { syncTime, getNow } from "@/utils/timeSync";

// 存储键
const STORAGE_KEY = "world-timezone-state";

// 获取相对日期标签
function getRelativeDayLabel(targetDate: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "";
  if (diffDays === 1) return "明天";
  if (diffDays === -1) return "昨天";
  return diffDays > 0 ? `+${diffDays}天` : `${diffDays}天`;
}

// 格式化时间信息
function formatTime(timezone: string) {
  const now = getNow();
  const tzDate = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
  
  const time = new Intl.DateTimeFormat("zh-CN", {
    timeZone: timezone, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  }).format(now);
  
  const date = new Intl.DateTimeFormat("zh-CN", {
    timeZone: timezone, month: "numeric", day: "numeric", weekday: "short",
  }).format(now);
  
  const hour = parseInt(new Intl.DateTimeFormat("en-US", { timeZone: timezone, hour: "numeric", hour12: false }).format(now));
  const isDay = hour >= 6 && hour < 18;
  
  const utcDate = new Date(now.toLocaleString("en-US", { timeZone: "UTC" }));
  const diff = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
  const offset = `UTC${diff >= 0 ? "+" : ""}${diff}`;
  
  const dayLabel = getRelativeDayLabel(tzDate);
  const localOffset = -now.getTimezoneOffset() / 60;
  const hourDiff = diff - localOffset;
  const timeDiff = hourDiff === 0 ? "同步" : (hourDiff > 0 ? `+${hourDiff}h` : `${hourDiff}h`);
  
  return { time, date, isDay, offset, dayLabel, timeDiff };
}

function formatTimeForOffset(lng: number) {
  const offsetHours = Math.round(lng / 15);
  const now = getNow();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const localTime = new Date(utc + offsetHours * 3600000);
  
  return {
    time: localTime.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }),
    date: localTime.toLocaleDateString("zh-CN", { month: "short", day: "numeric", weekday: "short" }),
    offset: `UTC${offsetHours >= 0 ? "+" : ""}${offsetHours}`,
    dayLabel: getRelativeDayLabel(localTime),
  };
}

// 根据用户语言获取默认地区
function getUserRegionLocation() {
  if (typeof navigator === "undefined") return { lat: 25, lng: 0, zoom: 1.5 };
  
  const lang = navigator.language.toLowerCase();
  const locationMap: Record<string, { lat: number; lng: number; zoom: number }> = {
    "zh": { lat: 35, lng: 105, zoom: 3 },
    "zh-cn": { lat: 35, lng: 105, zoom: 3 },
    "ja": { lat: 36, lng: 138, zoom: 4 },
    "ko": { lat: 36, lng: 128, zoom: 4 },
    "en": { lat: 40, lng: -100, zoom: 3 },
    "en-us": { lat: 40, lng: -100, zoom: 3 },
    "en-gb": { lat: 54, lng: -2, zoom: 4 },
    "de": { lat: 51, lng: 10, zoom: 4 },
    "fr": { lat: 46, lng: 2, zoom: 4 },
  };
  
  return locationMap[lang] || locationMap[lang.split("-")[0]] || { lat: 25, lng: 0, zoom: 1.5 };
}

function getDefaultLocation() {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const { center, zoom } = JSON.parse(saved);
        if (center && zoom) return { lat: center[1], lng: center[0], zoom };
      }
    } catch {}
  }
  return getUserRegionLocation();
}

// 获取语言字段
function getLabelField(): string {
  if (typeof navigator === "undefined") return "name:en";
  const fullLang = navigator.language.toLowerCase();
  const baseLang = fullLang.split("-")[0];
  
  if (fullLang === "zh-tw" || fullLang === "zh-hk" || fullLang === "zh-hant") {
    return "name:zh-Hant";
  }
  if (baseLang === "zh") {
    return "name:zh-Hans";
  }
  const langMap: Record<string, string> = {
    ja: "name:ja", ko: "name:ko", en: "name:en", de: "name:de",
    fr: "name:fr", es: "name:es", pt: "name:pt", ru: "name:ru", ar: "name:ar",
  };
  return langMap[baseLang] || "name:en";
}


// 城市标记组件
interface CityMarkerProps {
  city: TimezoneCity;
  isSelected: boolean;
  onClick: (city: TimezoneCity) => void;
  onHover: (city: TimezoneCity | null) => void;
}

function CityMarker({ city, isSelected, onClick, onHover }: CityMarkerProps) {
  const [info, setInfo] = useState(() => formatTime(city.timezone));
  
  useEffect(() => {
    const interval = setInterval(() => {
      setInfo(formatTime(city.timezone));
    }, 1000);
    return () => clearInterval(interval);
  }, [city.timezone]);
  
  const innerColor = info.isDay ? "#fbbf24" : "#818cf8";
  const ringClass = info.dayLabel 
    ? (info.dayLabel.includes("明") || info.dayLabel.includes("+") ? "tomorrow" : "yesterday")
    : "";
  
  return (
    <Marker
      longitude={city.lng}
      latitude={city.lat}
      anchor="center"
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        onClick(city);
      }}
    >
      <div 
        className="city-marker-container"
        data-name={city.name}
        onMouseEnter={() => onHover(city)}
        onMouseLeave={() => !isSelected && onHover(null)}
      >
        <div className={`marker-wrapper ${ringClass}`}>
          {ringClass && <div className="marker-ring" />}
          <div 
            className="marker-dot" 
            style={{ background: innerColor, boxShadow: `0 0 12px ${innerColor}` }}
          />
        </div>
      </div>
    </Marker>
  );
}

// 弹窗内容组件
interface PopupContentProps {
  city: TimezoneCity;
  onClose: () => void;
  isMobile: boolean;
}

function PopupContent({ city, onClose, isMobile }: PopupContentProps) {
  const [info, setInfo] = useState(() => formatTime(city.timezone));
  
  useEffect(() => {
    const interval = setInterval(() => {
      setInfo(formatTime(city.timezone));
    }, 1000);
    return () => clearInterval(interval);
  }, [city.timezone]);
  
  const labelClass = info.dayLabel 
    ? (info.dayLabel.includes("明") || info.dayLabel.includes("+") ? "tomorrow" : "yesterday") 
    : "";
  
  return (
    <div className="popup-content">
      {isMobile && (
        <button className="popup-close" onClick={onClose}>✕</button>
      )}
      <div className="popup-header">
        <div className={`status-dot ${info.isDay ? "day" : "night"}`} />
        <div className="city-info">
          <span className="city-name">{city.name}</span>
          <span className="country-name">{city.nameEn} · {city.country}</span>
        </div>
        {info.dayLabel && (
          <span className={`popup-day-label ${labelClass}`}>{info.dayLabel}</span>
        )}
      </div>
      <div className="time-display">
        <span className="time">{info.time}</span>
        <span className="date">{info.date}</span>
      </div>
      <div className="popup-footer">
        <span className="offset">{info.offset}</span>
        <span className="time-diff">{info.timeDiff}</span>
        <span className="day-night">{info.isDay ? "☀️" : "🌙"}</span>
      </div>
    </div>
  );
}


export default function WorldMap() {
  const mapRef = useRef<MapRef>(null);
  const [mounted, setMounted] = useState(false);
  const [viewState, setViewState] = useState(() => {
    const loc = getDefaultLocation();
    return { longitude: loc.lng, latitude: loc.lat, zoom: loc.zoom };
  });
  const [mouseInfo, setMouseInfo] = useState<{ lat: number; lng: number; time: string; date: string; offset: string; dayLabel: string } | null>(null);
  const mousePosRef = useRef<{ lng: number; lat: number } | null>(null);
  const [selectedCity, setSelectedCity] = useState<TimezoneCity | null>(null);
  const [hoveredCity, setHoveredCity] = useState<TimezoneCity | null>(null);
  const [dynamicCities, setDynamicCities] = useState<TimezoneCity[]>([]);
  const [timezoneLabelsData, setTimezoneLabelsData] = useState<GeoJSON.FeatureCollection | null>(null);
  
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  
  // 所有显示的城市（精选 + 动态添加）
  const allCities = useMemo(() => {
    const cityIds = new Set(featuredCities.map(c => c.id));
    const uniqueDynamic = dynamicCities.filter(c => !cityIds.has(c.id));
    return [...featuredCities, ...uniqueDynamic];
  }, [dynamicCities]);

  useEffect(() => { 
    setMounted(true);
    syncTime();
  }, []);

  // 时区线数据
  const timezoneLines = useMemo<GeoJSON.FeatureCollection>(() => {
    const features: GeoJSON.Feature[] = [];
    for (let lng = -180; lng <= 180; lng += 15) {
      const offset = lng / 15;
      features.push({
        type: "Feature",
        properties: { offset: offset >= 0 ? `+${offset}` : `${offset}` },
        geometry: { type: "LineString", coordinates: [[lng, -85], [lng, 85]] },
      });
    }
    return { type: "FeatureCollection", features };
  }, []);

  // 时区线样式
  const timezoneLineLayer: Omit<LineLayerSpecification, "source"> = useMemo(() => ({
    id: "timezone-lines",
    type: "line",
    paint: { "line-color": "rgba(255, 255, 255, 0.1)", "line-width": 1, "line-dasharray": [3, 6] },
  }), []);

  // 时区标签样式
  const timezoneLabelLayer: Omit<SymbolLayerSpecification, "source"> = useMemo(() => ({
    id: "timezone-labels",
    type: "symbol",
    layout: {
      "text-field": ["get", "offset"],
      "text-size": 10,
      "text-anchor": "center",
      "text-allow-overlap": true,
      "text-line-height": 1.3,
      "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
    },
    paint: {
      "text-color": "rgba(255, 255, 255, 0.6)",
      "text-halo-color": "rgba(0, 0, 0, 0.9)",
      "text-halo-width": 1.5,
    },
  }), []);

  // 更新时区标签位置
  const updateTimezoneLabels = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    
    const bounds = map.getBounds();
    const topLat = Math.min(bounds.getNorth() - 5, 80);
    
    const features: GeoJSON.Feature[] = [];
    for (let lng = -180; lng <= 180; lng += 15) {
      const offset = lng / 15;
      const offsetStr = offset >= 0 ? `+${offset}` : `${offset}`;
      const timeInfo = formatTimeForOffset(lng);
      
      features.push({
        type: "Feature",
        properties: { offset: `UTC${offsetStr}\n${timeInfo.time.slice(0, 5)}`, lng },
        geometry: { type: "Point", coordinates: [lng, topLat] },
      });
    }
    
    setTimezoneLabelsData({ type: "FeatureCollection", features });
  }, []);

  // 定时更新时区标签时间
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(updateTimezoneLabels, 60000);
    return () => clearInterval(interval);
  }, [mounted, updateTimezoneLabels]);

  // 保存地图状态
  const saveMapState = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        center: [viewState.longitude, viewState.latitude],
        zoom: viewState.zoom,
      }));
    } catch {}
  }, [viewState]);

  // 飞到指定城市
  const flyToCity = useCallback((city: TimezoneCity) => {
    mapRef.current?.flyTo({ center: [city.lng, city.lat], zoom: 5, duration: 1500 });
    
    // 如果不在列表中，动态添加
    if (!featuredCities.find(c => c.id === city.id) && !dynamicCities.find(c => c.id === city.id)) {
      setDynamicCities(prev => [...prev, city]);
    }
    
    setSelectedCity(city);
  }, [dynamicCities]);

  // 处理鼠标移动
  const handleMouseMove = useCallback((e: MapLayerMouseEvent) => {
    const { lng, lat } = e.lngLat;
    mousePosRef.current = { lng, lat };
    setMouseInfo({ lat, lng, ...formatTimeForOffset(lng) });
  }, []);

  // 实时更新鼠标位置的时间
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      if (mousePosRef.current) {
        const { lng, lat } = mousePosRef.current;
        setMouseInfo({ lat, lng, ...formatTimeForOffset(lng) });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [mounted]);

  // 处理视图变化
  const handleMove = useCallback((e: ViewStateChangeEvent) => {
    setViewState(e.viewState);
  }, []);

  // 处理移动结束
  const handleMoveEnd = useCallback(() => {
    saveMapState();
    updateTimezoneLabels();
  }, [saveMapState, updateTimezoneLabels]);

  // 处理地图加载
  const handleLoad = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    
    const labelField = getLabelField();
    
    // 更新所有文字图层的语言
    map.getStyle().layers.forEach((layer) => {
      if (layer.type === "symbol" && layer.layout?.["text-field"]) {
        map.setLayoutProperty(layer.id, "text-field", [
          "coalesce",
          ["get", labelField],
          ["get", "name:zh"],
          ["get", "name:en"],
          ["get", "name"]
        ]);
      }
    });
    
    updateTimezoneLabels();
    
    // 如果没有保存状态，飞到默认位置
    const hasSavedState = typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY);
    if (!hasSavedState) {
      const defaultLoc = getUserRegionLocation();
      setTimeout(() => {
        mapRef.current?.flyTo({ center: [defaultLoc.lng, defaultLoc.lat], zoom: defaultLoc.zoom, duration: 2000 });
      }, 500);
    }
  }, [updateTimezoneLabels]);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      const map = mapRef.current;
      if (!map) return;
      
      if (e.key === "=" || e.key === "+") map.zoomIn();
      else if (e.key === "-") map.zoomOut();
      else if (e.key === "0") {
        try { localStorage.removeItem(STORAGE_KEY); } catch {}
        const userLoc = getUserRegionLocation();
        map.flyTo({ center: [userLoc.lng, userLoc.lat], zoom: userLoc.zoom, duration: 2000 });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 当前显示的弹窗城市
  const popupCity = selectedCity || hoveredCity;

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
      <Map
        ref={mapRef}
        {...viewState}
        onMove={handleMove}
        onMoveEnd={handleMoveEnd}
        onMouseMove={handleMouseMove}
        onMouseOut={() => { mousePosRef.current = null; setMouseInfo(null); }}
        onClick={() => setSelectedCity(null)}
        onLoad={handleLoad}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        minZoom={1.5}
        maxZoom={10}
        attributionControl={false}
      >
        {/* 时区线 */}
        <Source id="timezone-lines" type="geojson" data={timezoneLines}>
          <Layer {...timezoneLineLayer} />
        </Source>
        
        {/* 时区标签 */}
        {timezoneLabelsData && (
          <Source id="timezone-labels" type="geojson" data={timezoneLabelsData}>
            <Layer {...timezoneLabelLayer} />
          </Source>
        )}
        
        {/* 城市标记 */}
        {allCities.map((city) => (
          <CityMarker
            key={city.id}
            city={city}
            isSelected={selectedCity?.id === city.id}
            onClick={(c) => setSelectedCity(prev => prev?.id === c.id ? null : c)}
            onHover={setHoveredCity}
          />
        ))}
        
        {/* 弹窗 */}
        {popupCity && (
          <Popup
            longitude={popupCity.lng}
            latitude={popupCity.lat}
            anchor="bottom"
            offset={15}
            closeButton={false}
            closeOnClick={false}
            className="city-popup"
            onClose={() => {
              setSelectedCity(null);
              setHoveredCity(null);
            }}
          >
            <PopupContent 
              city={popupCity} 
              onClose={() => {
                setSelectedCity(null);
                setHoveredCity(null);
              }}
              isMobile={isMobile}
            />
          </Popup>
        )}
      </Map>

      {/* 搜索框 */}
      <div className="search-container">
        <SearchBox onSelect={flyToCity} />
      </div>

      {/* 鼠标跟随信息 */}
      {mouseInfo && (
        <div className="mouse-info">
          <div className="mouse-header">
            <span className="mouse-time">{mouseInfo.time}</span>
            {mouseInfo.dayLabel && (
              <span className={`mouse-day-label ${mouseInfo.dayLabel.includes("明") || mouseInfo.dayLabel.includes("+") ? "tomorrow" : "yesterday"}`}>
                {mouseInfo.dayLabel}
              </span>
            )}
          </div>
          <div className="mouse-meta">
            <span>{mouseInfo.offset}</span>
            <span className="mouse-date">{mouseInfo.date}</span>
          </div>
        </div>
      )}

      {/* 缩放级别显示城市名 */}
      {viewState.zoom >= 4 && (
        <style>{`
          .city-marker-container::after {
            content: attr(data-name);
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            font-size: 10px;
            color: rgba(255,255,255,0.8);
            white-space: nowrap;
            margin-top: 2px;
            text-shadow: 0 1px 3px rgba(0,0,0,0.8);
          }
        `}</style>
      )}

      {/* 图例 */}
      <div className="legend">
        <div className="legend-item">
          <span className="legend-marker day" />
          <span>白天</span>
        </div>
        <div className="legend-item">
          <span className="legend-marker night" />
          <span>夜晚</span>
        </div>
        <div className="legend-divider" />
        <div className="legend-item">
          <span className="legend-combo tomorrow"><span className="combo-ring" /><span className="combo-dot" /></span>
          <span>明天</span>
        </div>
        <div className="legend-item">
          <span className="legend-combo yesterday"><span className="combo-ring" /><span className="combo-dot" /></span>
          <span>昨天</span>
        </div>
      </div>

      {/* 快捷键提示 */}
      <div className="shortcuts-hint">
        <span><kbd>+</kbd><kbd>-</kbd> 缩放</span>
        <span><kbd>0</kbd> 重置</span>
        <span><kbd>Ctrl</kbd><kbd>K</kbd> 搜索</span>
      </div>
    </div>
  );
}
