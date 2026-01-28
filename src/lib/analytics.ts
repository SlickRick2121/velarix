
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

/**
 * Tracks a page view by sending visitor metadata to the analytics backend.
 * Uses sessionStorage to prevent duplicate tracking within the same session.
 */
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

    const response = await fetch(`${API_BASE}/api/analytics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(visitor)
    });

    if (response.ok) {
      sessionStorage.setItem('last_tracked_view', currentPath);
      console.log('[Nexus Intelligence] Signal synchronized');
    }
  } catch (error) {
    // Fail silently to avoid interrupting user experience
  }
};

/**
 * Fetches and processes analytics statistics from the server.
 * Optimizes raw data into structured components for dashboard visualization.
 */
export const getAnalyticsStats = async (pin?: string): Promise<AnalyticsStats> => {
  try {
    const authPin = pin || sessionStorage.getItem('admin_access_pin') || '';

    const response = await fetch(`${API_BASE}/api/analytics/stats`, {
      headers: { 'x-admin-pin': authPin }
    });

    if (!response.ok) throw new Error('Unauthorized access');

    const rawData = await response.json();

    // Single-pass reduction for maximum efficiency
    const data: VisitorData[] = rawData.map((v: any) => ({
      ...v,
      countryCode: v.country_code,
      regionName: v.region_name,
      as: v.as_info,
      screenResolution: v.screen_resolution
    }));

    // Data Aggregation Structures
    const uniqueIPsSet = new Set<string>();
    const countriesSet = new Set<string>();
    const citiesSet = new Set<string>();
    const locationCounts: Record<string, number> = {};
    const countryCounts: Record<string, number> = {};
    const viewsByDateMap: Record<string, number> = {};
    const browserCounts: Record<string, number> = {};
    const osCounts: Record<string, number> = {};
    const deviceCounts: Record<string, number> = {};

    // Process all stats in a single loop
    data.forEach(v => {
      if (v.query) uniqueIPsSet.add(v.query);
      if (v.country) countriesSet.add(v.country);
      if (v.city) citiesSet.add(v.city);

      if (v.city || v.country) {
        const loc = `${v.city || 'Unknown'}, ${v.country || 'Unknown'}`;
        locationCounts[loc] = (locationCounts[loc] || 0) + 1;
      }

      if (v.countryCode) {
        countryCounts[v.countryCode] = (countryCounts[v.countryCode] || 0) + 1;
      }

      const date = new Date(v.timestamp).toLocaleDateString();
      viewsByDateMap[date] = (viewsByDateMap[date] || 0) + 1;

      if (v.browser) browserCounts[v.browser] = (browserCounts[v.browser] || 0) + 1;
      if (v.os) osCounts[v.os] = (osCounts[v.os] || 0) + 1;
      if (v.device) deviceCounts[v.device] = (deviceCounts[v.device] || 0) + 1;
    });

    // Transform and sort aggregated data
    const topLocations = Object.entries(locationCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const countryStats = Object.entries(countryCounts)
      .map(([id, count]) => ({ id, count }));

    const viewsByDate = Object.entries(viewsByDateMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30); // Extended history

    const browserStats = Object.entries(browserCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const osStats = Object.entries(osCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const deviceStats = Object.entries(deviceCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalViews: data.length,
      uniqueIPs: uniqueIPsSet.size,
      countries: countriesSet.size,
      cities: citiesSet.size,
      recentViews: data.slice(0, 150), // Increased feed depth
      topLocations,
      countryStats,
      viewsByDate,
      browserStats,
      osStats,
      deviceStats
    };
  } catch (error) {
    console.error('[Nexus Intelligence] Core fetch failure:', error);
    return {
      totalViews: 0, uniqueIPs: 0, countries: 0, cities: 0,
      recentViews: [], topLocations: [], countryStats: [],
      viewsByDate: [], browserStats: [], osStats: [], deviceStats: []
    };
  }
};

export const deleteLog = async (id: number, pin: string) => {
  return await fetch(`${API_BASE}/api/analytics/${id}`, {
    method: 'DELETE',
    headers: { 'x-admin-pin': pin }
  });
};

export const clearAllLogs = async (pin: string) => {
  return await fetch(`${API_BASE}/api/analytics`, {
    method: 'DELETE',
    headers: { 'x-admin-pin': pin }
  });
};

/**
 * Converts ISO 3166-1 alpha-2 country codes into high-resolution emoji flags.
 */
export const getFlagEmoji = (countryCode: string) => {
  if (!countryCode || countryCode === '??') return '🏳️';
  return countryCode
    .toUpperCase()
    .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt(0)));
};
