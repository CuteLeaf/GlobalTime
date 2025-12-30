import ct from 'city-timezones';

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

// 精选城市名称列表 - 用于地图标点显示
const featuredCityNames = [
  "Beijing", "Shanghai", "Hong Kong", "Taipei", "Tokyo", "Osaka", "Seoul", 
  "Singapore", "Bangkok", "Mumbai", "New Delhi", "Dubai", "Jakarta", "Manila", "Hanoi",
  "London", "Paris", "Berlin", "Rome", "Madrid", "Amsterdam", "Moscow", "Istanbul", "Zurich", "Vienna",
  "New York", "Los Angeles", "Chicago", "San Francisco", "Seattle", "Toronto", "Vancouver", 
  "Mexico City", "São Paulo", "Buenos Aires", "Lima",
  "Sydney", "Melbourne", "Auckland",
  "Cairo", "Johannesburg", "Lagos", "Nairobi"
];

interface CityData {
  city: string;
  city_ascii: string;
  lat: number;
  lng: number;
  country: string;
  iso2: string;
  timezone: string;
}

// 国家名称映射 - 用于自定义显示的国家名称
const countryNameMap: Record<string, string> = {
  "Taiwan": "China Taiwan",
  "Hong Kong S.A.R.": "China Hong Kong S.A.R.",
  // 可以继续添加其他需要修改的国家名称
};

// 从 city-timezones 查找精选城市
const findCity = (name: string): CityData | undefined => {
  return ct.cityMapping.find((c: CityData) =>
    c.city === name || c.city_ascii === name
  );
};

// 获取映射后的国家名称
const getMappedCountry = (country: string): string => {
  return countryNameMap[country] || country;
};

export const featuredCities: TimezoneCity[] = featuredCityNames
  .map(name => findCity(name))
  .filter((city): city is CityData => Boolean(city))
  .map((city: CityData) => {
    const iso2 = String(city.iso2 || '');
    return {
      id: `${city.city.toLowerCase().replace(/\s+/g, '-')}-${iso2.toLowerCase()}`,
      name: city.city,
      nameEn: city.city_ascii || city.city,
      timezone: city.timezone,
      lat: city.lat,
      lng: city.lng,
      country: getMappedCountry(city.country),
      countryCode: iso2
    };
  });

// 从 city-timezones 生成所有城市列表 - 用于搜索
const rawCities = ct.cityMapping || [];
const allCities = rawCities
  .filter((city: CityData) => city.timezone && city.lat && city.lng && city.iso2)
  .map((city: CityData) => {
    const iso2 = String(city.iso2 || '');
    return {
      id: `${city.city.toLowerCase().replace(/\s+/g, '-')}-${iso2.toLowerCase()}`,
      name: city.city,
      nameEn: city.city_ascii || city.city,
      timezone: city.timezone,
      lat: city.lat,
      lng: city.lng,
      country: getMappedCountry(city.country),
      countryCode: iso2
    };
  });

// 导出所有城市（用于搜索）
export const timezoneCities: TimezoneCity[] = allCities;

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
