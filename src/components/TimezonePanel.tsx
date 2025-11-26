"use client";

import { useEffect, useState } from "react";
import { timezoneCities, TimezoneCity } from "@/data/timezones";

function formatTime(timezone: string) {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };
  return new Intl.DateTimeFormat("zh-CN", options).format(now);
}

function formatDate(timezone: string) {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    month: "short",
    day: "numeric",
    weekday: "short",
  };
  return new Intl.DateTimeFormat("zh-CN", options).format(now);
}

function getUtcOffset(timezone: string): string {
  const now = new Date();
  const utcDate = new Date(now.toLocaleString("en-US", { timeZone: "UTC" }));
  const tzDate = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
  const diff = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
  const sign = diff >= 0 ? "+" : "";
  return `UTC${sign}${diff}`;
}

function isDay(timezone: string): boolean {
  const now = new Date();
  const hourOptions: Intl.DateTimeFormatOptions = { timeZone: timezone, hour: "numeric", hour12: false };
  const hour = parseInt(new Intl.DateTimeFormat("en-US", hourOptions).format(now));
  return hour >= 6 && hour < 18;
}

function CityCard({ city }: { city: TimezoneCity }) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [dayTime, setDayTime] = useState(true);

  useEffect(() => {
    const update = () => {
      setTime(formatTime(city.timezone));
      setDate(formatDate(city.timezone));
      setDayTime(isDay(city.timezone));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [city.timezone]);

  return (
    <div className={`p-3 rounded-lg border transition-all hover:scale-105 cursor-pointer ${
      dayTime 
        ? "bg-gradient-to-br from-amber-900/20 to-yellow-900/20 border-yellow-500/30" 
        : "bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border-blue-500/30"
    }`}>
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium text-white">{city.name}</span>
        <span className={`w-2 h-2 rounded-full ${dayTime ? "bg-yellow-400" : "bg-blue-400"}`}></span>
      </div>
      <div className="text-2xl font-mono font-bold text-white">{time}</div>
      <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
        <span>{date}</span>
        <span>{getUtcOffset(city.timezone)}</span>
      </div>
    </div>
  );
}


export default function TimezonePanel() {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col bg-gray-900/50 backdrop-blur">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white mb-1">世界时区</h2>
        <p className="text-sm text-gray-400">本地时间: {currentTime}</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid gap-3">
          {timezoneCities.map((city) => (
            <CityCard key={city.name} city={city} />
          ))}
        </div>
      </div>
      
      <div className="p-3 border-t border-gray-700 text-center">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
            白天 (6:00-18:00)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            夜晚 (18:00-6:00)
          </span>
        </div>
      </div>
    </div>
  );
}
