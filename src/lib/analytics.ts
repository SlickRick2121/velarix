
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
  query: string; // IP Address
  timestamp: string;
  userAgent: string;
  browser: string;
  os: string;
  device: string;
  language: string;
  screenResolution: string;
  referrer: string;
  path: string;
}

export interface AnalyticsStats {
  totalViews: number;
  uniqueIPs: number;
  countries: number;
  cities: number;
  recentViews: VisitorData[];
  topLocations: { name: string; count: number }[];
  viewsByDate: { date: string; count: number }[];
  browserStats: { name: string; count: number }[];
  osStats: { name: string; count: number }[];
  deviceStats: { name: string; count: number }[];
}

const STORAGE_KEY = 'nexus_analytics_data';

const getBrowserName = (ua: string) => {
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('SamsungBrowser')) return 'Samsung Browser';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  if (ua.includes('Trident')) return 'Internet Explorer';
  if (ua.includes('Edge')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  return 'Unknown';
};

const getOSName = (ua: string) => {
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  if (ua.includes('Macintosh')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  return 'Unknown';
};

const getDeviceType = (ua: string) => {
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'Tablet';
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return 'Mobile';
  return 'Desktop';
};

export const trackView = async () => {
  try {
    const lastTracked = sessionStorage.getItem('last_tracked_view');
    const currentPath = window.location.pathname;

    // Allow tracking different pages in same session, but prevent spam on same page
    if (lastTracked === currentPath) return;

    const response = await fetch('http://ip-api.com/json/?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query');
    const data = await response.json();

    if (data.status === 'success') {
      const ua = navigator.userAgent;
      const visitor: VisitorData = {
        ...data,
        timestamp: new Date().toISOString(),
        userAgent: ua,
        browser: getBrowserName(ua),
        os: getOSName(ua),
        device: getDeviceType(ua),
        language: navigator.language,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        referrer: document.referrer || 'Direct',
        path: currentPath,
      };

      const existingData = getStoredData();
      existingData.push(visitor);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));
      sessionStorage.setItem('last_tracked_view', currentPath);
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

  // Browser Stats
  const browserCounts: Record<string, number> = {};
  data.forEach(v => {
    browserCounts[v.browser] = (browserCounts[v.browser] || 0) + 1;
  });
  const browserStats = Object.entries(browserCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // OS Stats
  const osCounts: Record<string, number> = {};
  data.forEach(v => {
    osCounts[v.os] = (osCounts[v.os] || 0) + 1;
  });
  const osStats = Object.entries(osCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Device Stats
  const deviceCounts: Record<string, number> = {};
  data.forEach(v => {
    deviceCounts[v.device] = (deviceCounts[v.device] || 0) + 1;
  });
  const deviceStats = Object.entries(deviceCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalViews: data.length,
    uniqueIPs,
    countries,
    cities,
    recentViews,
    topLocations,
    viewsByDate,
    browserStats,
    osStats,
    deviceStats
  };
};

export const getFlagEmoji = (countryCode: string) => {
  if (!countryCode) return '🏳️';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};
