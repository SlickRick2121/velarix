
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
  countryStats: { id: string; count: number }[];
  viewsByDate: { date: string; count: number }[];
  browserStats: { name: string; count: number }[];
  osStats: { name: string; count: number }[];
  deviceStats: { name: string; count: number }[];
}

const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:3001' : '';

export const trackView = async () => {
  try {
    const lastTracked = sessionStorage.getItem('last_tracked_view');
    const currentPath = window.location.pathname;

    if (lastTracked === currentPath) return;

    const visitor = {
      path: currentPath,
      referrer: document.referrer || 'Direct',
      language: navigator.language,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      device: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop'
    };

    // Send to our backend - backend will handle IP and Geo detection
    await fetch(`${API_BASE}/api/analytics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(visitor)
    });

    sessionStorage.setItem('last_tracked_view', currentPath);
    console.log('[Nexus] View logged');
  } catch (error) {
    // Silent fail for tracking
  }
};

export const getAnalyticsStats = async (pin?: string): Promise<AnalyticsStats> => {
  try {
    const authPin = pin || sessionStorage.getItem('admin_access_pin') || '';

    const response = await fetch(`${API_BASE}/api/analytics/stats`, {
      headers: {
        'x-admin-pin': authPin
      }
    });

    if (!response.ok) {
      throw new Error('Unauthorized');
    }

    const rawData = await response.json();

    const data: VisitorData[] = rawData.map((v: any) => ({
      ...v,
      countryCode: v.country_code,
      regionName: v.region_name,
      as: v.as_info,
      screenResolution: v.screen_resolution
    }));

    const uniqueIPs = new Set(data.map(v => v.query)).size;
    const countries = new Set(data.map(v => v.country)).size;
    const cities = new Set(data.map(v => v.city)).size;

    const recentViews = data.slice(0, 100);

    const locationCounts: Record<string, number> = {};
    data.forEach(v => {
      const loc = `${v.city || 'Unknown'}, ${v.country || 'Unknown'}`;
      locationCounts[loc] = (locationCounts[loc] || 0) + 1;
    });
    const topLocations = Object.entries(locationCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const countryCounts: Record<string, number> = {};
    data.forEach(v => {
      if (v.countryCode) {
        countryCounts[v.countryCode] = (countryCounts[v.countryCode] || 0) + 1;
      }
    });
    const countryStats = Object.entries(countryCounts)
      .map(([id, count]) => ({ id, count }));

    const viewsByDateMap: Record<string, number> = {};
    data.forEach(v => {
      const date = new Date(v.timestamp).toLocaleDateString();
      viewsByDateMap[date] = (viewsByDateMap[date] || 0) + 1;
    });
    const viewsByDate = Object.entries(viewsByDateMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-14);

    const browserCounts: Record<string, number> = {};
    data.forEach(v => {
      if (v.browser) browserCounts[v.browser] = (browserCounts[v.browser] || 0) + 1;
    });
    const browserStats = Object.entries(browserCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const osCounts: Record<string, number> = {};
    data.forEach(v => {
      if (v.os) osCounts[v.os] = (osCounts[v.os] || 0) + 1;
    });
    const osStats = Object.entries(osCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const deviceCounts: Record<string, number> = {};
    data.forEach(v => {
      if (v.device) deviceCounts[v.device] = (deviceCounts[v.device] || 0) + 1;
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
      countryStats,
      viewsByDate,
      browserStats,
      osStats,
      deviceStats
    };
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    return {
      totalViews: 0,
      uniqueIPs: 0,
      countries: 0,
      cities: 0,
      recentViews: [],
      topLocations: [],
      countryStats: [],
      viewsByDate: [],
      browserStats: [],
      osStats: [],
      deviceStats: []
    };
  }
};

export const getFlagEmoji = (countryCode: string) => {
  if (!countryCode || countryCode === '??') return '🏳️';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};
