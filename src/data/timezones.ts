export interface TimezoneCity {
  name: string;
  timezone: string;
  lat: number;
  lng: number;
  country: string;
}

export const timezoneCities: TimezoneCity[] = [
  { name: "纽约", timezone: "America/New_York", lat: 40.7128, lng: -74.006, country: "美国" },
  { name: "洛杉矶", timezone: "America/Los_Angeles", lat: 34.0522, lng: -118.2437, country: "美国" },
  { name: "伦敦", timezone: "Europe/London", lat: 51.5074, lng: -0.1278, country: "英国" },
  { name: "巴黎", timezone: "Europe/Paris", lat: 48.8566, lng: 2.3522, country: "法国" },
  { name: "柏林", timezone: "Europe/Berlin", lat: 52.52, lng: 13.405, country: "德国" },
  { name: "莫斯科", timezone: "Europe/Moscow", lat: 55.7558, lng: 37.6173, country: "俄罗斯" },
  { name: "迪拜", timezone: "Asia/Dubai", lat: 25.2048, lng: 55.2708, country: "阿联酋" },
  { name: "孟买", timezone: "Asia/Kolkata", lat: 19.076, lng: 72.8777, country: "印度" },
  { name: "新加坡", timezone: "Asia/Singapore", lat: 1.3521, lng: 103.8198, country: "新加坡" },
  { name: "香港", timezone: "Asia/Hong_Kong", lat: 22.3193, lng: 114.1694, country: "中国" },
  { name: "北京", timezone: "Asia/Shanghai", lat: 39.9042, lng: 116.4074, country: "中国" },
  { name: "上海", timezone: "Asia/Shanghai", lat: 31.2304, lng: 121.4737, country: "中国" },
  { name: "东京", timezone: "Asia/Tokyo", lat: 35.6762, lng: 139.6503, country: "日本" },
  { name: "首尔", timezone: "Asia/Seoul", lat: 37.5665, lng: 126.978, country: "韩国" },
  { name: "悉尼", timezone: "Australia/Sydney", lat: -33.8688, lng: 151.2093, country: "澳大利亚" },
  { name: "奥克兰", timezone: "Pacific/Auckland", lat: -36.8485, lng: 174.7633, country: "新西兰" },
  { name: "圣保罗", timezone: "America/Sao_Paulo", lat: -23.5505, lng: -46.6333, country: "巴西" },
  { name: "墨西哥城", timezone: "America/Mexico_City", lat: 19.4326, lng: -99.1332, country: "墨西哥" },
  { name: "开罗", timezone: "Africa/Cairo", lat: 30.0444, lng: 31.2357, country: "埃及" },
  { name: "约翰内斯堡", timezone: "Africa/Johannesburg", lat: -26.2041, lng: 28.0473, country: "南非" },
];
