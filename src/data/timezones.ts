export interface TimezoneCity {
  id: string;
  name: string;
  nameEn: string;
  timezone: string;
  lat: number;
  lng: number;
  country: string;
  countryCode: string;
}

export const timezoneCities: TimezoneCity[] = [
  // 亚洲
  { id: "beijing", name: "北京", nameEn: "Beijing", timezone: "Asia/Shanghai", lat: 39.9042, lng: 116.4074, country: "中国", countryCode: "CN" },
  { id: "shanghai", name: "上海", nameEn: "Shanghai", timezone: "Asia/Shanghai", lat: 31.2304, lng: 121.4737, country: "中国", countryCode: "CN" },
  { id: "hongkong", name: "香港", nameEn: "Hong Kong", timezone: "Asia/Hong_Kong", lat: 22.3193, lng: 114.1694, country: "中国", countryCode: "HK" },
  { id: "taipei", name: "台北", nameEn: "Taipei", timezone: "Asia/Taipei", lat: 25.033, lng: 121.5654, country: "台湾", countryCode: "TW" },
  { id: "tokyo", name: "东京", nameEn: "Tokyo", timezone: "Asia/Tokyo", lat: 35.6762, lng: 139.6503, country: "日本", countryCode: "JP" },
  { id: "osaka", name: "大阪", nameEn: "Osaka", timezone: "Asia/Tokyo", lat: 34.6937, lng: 135.5023, country: "日本", countryCode: "JP" },
  { id: "seoul", name: "首尔", nameEn: "Seoul", timezone: "Asia/Seoul", lat: 37.5665, lng: 126.978, country: "韩国", countryCode: "KR" },
  { id: "singapore", name: "新加坡", nameEn: "Singapore", timezone: "Asia/Singapore", lat: 1.3521, lng: 103.8198, country: "新加坡", countryCode: "SG" },
  { id: "bangkok", name: "曼谷", nameEn: "Bangkok", timezone: "Asia/Bangkok", lat: 13.7563, lng: 100.5018, country: "泰国", countryCode: "TH" },
  { id: "mumbai", name: "孟买", nameEn: "Mumbai", timezone: "Asia/Kolkata", lat: 19.076, lng: 72.8777, country: "印度", countryCode: "IN" },
  { id: "delhi", name: "新德里", nameEn: "New Delhi", timezone: "Asia/Kolkata", lat: 28.6139, lng: 77.209, country: "印度", countryCode: "IN" },
  { id: "dubai", name: "迪拜", nameEn: "Dubai", timezone: "Asia/Dubai", lat: 25.2048, lng: 55.2708, country: "阿联酋", countryCode: "AE" },
  { id: "jakarta", name: "雅加达", nameEn: "Jakarta", timezone: "Asia/Jakarta", lat: -6.2088, lng: 106.8456, country: "印尼", countryCode: "ID" },
  { id: "manila", name: "马尼拉", nameEn: "Manila", timezone: "Asia/Manila", lat: 14.5995, lng: 120.9842, country: "菲律宾", countryCode: "PH" },
  { id: "hanoi", name: "河内", nameEn: "Hanoi", timezone: "Asia/Ho_Chi_Minh", lat: 21.0285, lng: 105.8542, country: "越南", countryCode: "VN" },
  
  // 欧洲
  { id: "london", name: "伦敦", nameEn: "London", timezone: "Europe/London", lat: 51.5074, lng: -0.1278, country: "英国", countryCode: "GB" },
  { id: "paris", name: "巴黎", nameEn: "Paris", timezone: "Europe/Paris", lat: 48.8566, lng: 2.3522, country: "法国", countryCode: "FR" },
  { id: "berlin", name: "柏林", nameEn: "Berlin", timezone: "Europe/Berlin", lat: 52.52, lng: 13.405, country: "德国", countryCode: "DE" },
  { id: "rome", name: "罗马", nameEn: "Rome", timezone: "Europe/Rome", lat: 41.9028, lng: 12.4964, country: "意大利", countryCode: "IT" },
  { id: "madrid", name: "马德里", nameEn: "Madrid", timezone: "Europe/Madrid", lat: 40.4168, lng: -3.7038, country: "西班牙", countryCode: "ES" },
  { id: "amsterdam", name: "阿姆斯特丹", nameEn: "Amsterdam", timezone: "Europe/Amsterdam", lat: 52.3676, lng: 4.9041, country: "荷兰", countryCode: "NL" },
  { id: "moscow", name: "莫斯科", nameEn: "Moscow", timezone: "Europe/Moscow", lat: 55.7558, lng: 37.6173, country: "俄罗斯", countryCode: "RU" },
  { id: "istanbul", name: "伊斯坦布尔", nameEn: "Istanbul", timezone: "Europe/Istanbul", lat: 41.0082, lng: 28.9784, country: "土耳其", countryCode: "TR" },
  { id: "zurich", name: "苏黎世", nameEn: "Zurich", timezone: "Europe/Zurich", lat: 47.3769, lng: 8.5417, country: "瑞士", countryCode: "CH" },
  { id: "vienna", name: "维也纳", nameEn: "Vienna", timezone: "Europe/Vienna", lat: 48.2082, lng: 16.3738, country: "奥地利", countryCode: "AT" },

  // 美洲
  { id: "newyork", name: "纽约", nameEn: "New York", timezone: "America/New_York", lat: 40.7128, lng: -74.006, country: "美国", countryCode: "US" },
  { id: "losangeles", name: "洛杉矶", nameEn: "Los Angeles", timezone: "America/Los_Angeles", lat: 34.0522, lng: -118.2437, country: "美国", countryCode: "US" },
  { id: "chicago", name: "芝加哥", nameEn: "Chicago", timezone: "America/Chicago", lat: 41.8781, lng: -87.6298, country: "美国", countryCode: "US" },
  { id: "sanfrancisco", name: "旧金山", nameEn: "San Francisco", timezone: "America/Los_Angeles", lat: 37.7749, lng: -122.4194, country: "美国", countryCode: "US" },
  { id: "seattle", name: "西雅图", nameEn: "Seattle", timezone: "America/Los_Angeles", lat: 47.6062, lng: -122.3321, country: "美国", countryCode: "US" },
  { id: "toronto", name: "多伦多", nameEn: "Toronto", timezone: "America/Toronto", lat: 43.6532, lng: -79.3832, country: "加拿大", countryCode: "CA" },
  { id: "vancouver", name: "温哥华", nameEn: "Vancouver", timezone: "America/Vancouver", lat: 49.2827, lng: -123.1207, country: "加拿大", countryCode: "CA" },
  { id: "mexicocity", name: "墨西哥城", nameEn: "Mexico City", timezone: "America/Mexico_City", lat: 19.4326, lng: -99.1332, country: "墨西哥", countryCode: "MX" },
  { id: "saopaulo", name: "圣保罗", nameEn: "São Paulo", timezone: "America/Sao_Paulo", lat: -23.5505, lng: -46.6333, country: "巴西", countryCode: "BR" },
  { id: "buenosaires", name: "布宜诺斯艾利斯", nameEn: "Buenos Aires", timezone: "America/Argentina/Buenos_Aires", lat: -34.6037, lng: -58.3816, country: "阿根廷", countryCode: "AR" },
  { id: "lima", name: "利马", nameEn: "Lima", timezone: "America/Lima", lat: -12.0464, lng: -77.0428, country: "秘鲁", countryCode: "PE" },
  
  // 大洋洲
  { id: "sydney", name: "悉尼", nameEn: "Sydney", timezone: "Australia/Sydney", lat: -33.8688, lng: 151.2093, country: "澳大利亚", countryCode: "AU" },
  { id: "melbourne", name: "墨尔本", nameEn: "Melbourne", timezone: "Australia/Melbourne", lat: -37.8136, lng: 144.9631, country: "澳大利亚", countryCode: "AU" },
  { id: "auckland", name: "奥克兰", nameEn: "Auckland", timezone: "Pacific/Auckland", lat: -36.8485, lng: 174.7633, country: "新西兰", countryCode: "NZ" },
  
  // 非洲
  { id: "cairo", name: "开罗", nameEn: "Cairo", timezone: "Africa/Cairo", lat: 30.0444, lng: 31.2357, country: "埃及", countryCode: "EG" },
  { id: "johannesburg", name: "约翰内斯堡", nameEn: "Johannesburg", timezone: "Africa/Johannesburg", lat: -26.2041, lng: 28.0473, country: "南非", countryCode: "ZA" },
  { id: "lagos", name: "拉各斯", nameEn: "Lagos", timezone: "Africa/Lagos", lat: 6.5244, lng: 3.3792, country: "尼日利亚", countryCode: "NG" },
  { id: "nairobi", name: "内罗毕", nameEn: "Nairobi", timezone: "Africa/Nairobi", lat: -1.2921, lng: 36.8219, country: "肯尼亚", countryCode: "KE" },
];

// 搜索城市
export function searchCities(query: string): TimezoneCity[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return timezoneCities.filter(city => 
    city.name.toLowerCase().includes(q) ||
    city.nameEn.toLowerCase().includes(q) ||
    city.country.toLowerCase().includes(q) ||
    city.countryCode.toLowerCase() === q
  ).slice(0, 8);
}
