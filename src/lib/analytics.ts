
export interface VisitorData {
  status: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  query: string;
  timestamp: string;
}

export interface AnalyticsStats {
  totalViews: number;
  uniqueIPs: number;
  countries: number;
  cities: number;
  recentViews: VisitorData[];
  topLocations: { name: string; count: number }[];
  viewsByDate: { date: string; count: number }[];
}

const STORAGE_KEY = 'nexus_analytics_data';

export const trackView = async () => {
  try {
    // Prevent tracking in development if needed, but for now let's track everything
    // Avoid double tracking in strict mode if possible
    const lastTracked = sessionStorage.getItem('last_tracked_view');
    if (lastTracked) return;

    const response = await fetch('http://ip-api.com/json/?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query');
    const data = await response.json();

    if (data.status === 'success') {
      const visitor: VisitorData = {
        ...data,
        timestamp: new Date().toISOString(),
      };

      const existingData = getStoredData();
      existingData.push(visitor);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));
      sessionStorage.setItem('last_tracked_view', 'true');
    }
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }
};

const getStoredData = (): VisitorData[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const getAnalyticsStats = (): AnalyticsStats => {
  const data = getStoredData();
  
  const uniqueIPs = new Set(data.map(v => v.query)).size;
  const countries = new Set(data.map(v => v.country)).size;
  const cities = new Set(data.map(v => v.city)).size;

  // Recent views (last 50)
  const recentViews = [...data].reverse().slice(0, 50);

  // Top Locations
  const locationCounts: Record<string, number> = {};
  data.forEach(v => {
    const loc = `${v.city}, ${v.country}`;
    locationCounts[loc] = (locationCounts[loc] || 0) + 1;
  });
  const topLocations = Object.entries(locationCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Views by Date
  const viewsByDateMap: Record<string, number> = {};
  data.forEach(v => {
    const date = new Date(v.timestamp).toLocaleDateString();
    viewsByDateMap[date] = (viewsByDateMap[date] || 0) + 1;
  });
  const viewsByDate = Object.entries(viewsByDateMap)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return {
    totalViews: data.length,
    uniqueIPs,
    countries,
    cities,
    recentViews,
    topLocations,
    viewsByDate
  };
};

export const getFlagEmoji = (countryCode: string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};
