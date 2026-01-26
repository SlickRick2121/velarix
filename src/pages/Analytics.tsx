
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAnalyticsStats, getFlagEmoji, AnalyticsStats } from '@/lib/analytics';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import {
    Users, Globe, MapPin, Activity, LayoutDashboard, Database, Shield, Server, RefreshCw, Smartphone, Monitor, Laptop, Info, Navigation as NavIcon, Lock
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { toast } from "sonner";

// World Map TopoJSON
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Analytics = () => {
    const [stats, setStats] = useState<AnalyticsStats | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [pin, setPin] = useState('');

    useEffect(() => {
        return () => {
            setIsAuthorized(false);
            setStats(null);
        };
    }, []);

    const handleVerify = async () => {
        if (pin === '2323') {
            setIsLoading(true);
            try {
                const data = await getAnalyticsStats('2323');
                setStats(data);
                setIsAuthorized(true);
                toast.success("Identity Verified. Intelligence Feed Active.");
            } catch (error) {
                toast.error("Failed to fetch intelligence data.");
            } finally {
                setIsLoading(false);
            }
        } else {
            toast.error("Invalid Administrative PIN");
            setPin('');
        }
    };

    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <Navigation />
                <div className="w-full max-w-md p-8 rounded-3xl bg-secondary/10 border border-accent/20 backdrop-blur-3xl space-y-8 text-center">
                    <div className="mx-auto w-20 h-20 rounded-2xl bg-accent/20 flex items-center justify-center border border-accent/30 shadow-2xl shadow-accent/20">
                        <Lock className="w-10 h-10 text-accent animate-pulse" />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tighter text-foreground">Security Challenge</h1>
                        <p className="text-muted-foreground text-sm uppercase tracking-widest font-mono">Restricted Admin Environment</p>
                    </div>

                    <div className="space-y-4">
                        <div className="relative">
                            <input
                                type="password"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                                placeholder="ENTER 4-DIGIT PIN"
                                className="w-full bg-black/60 border border-accent/30 rounded-2xl px-4 py-6 text-foreground placeholder-foreground/20 focus:outline-none focus:ring-2 focus:ring-accent/50 text-center tracking-[1em] text-3xl font-bold transition-all"
                                maxLength={4}
                                autoFocus
                            />
                        </div>

                        <button
                            onClick={handleVerify}
                            disabled={isLoading}
                            className="w-full py-5 bg-accent text-black font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isLoading ? 'Decrypting Protocols...' : 'Verify Authority'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading || !stats) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <RefreshCw className="w-8 h-8 animate-spin text-accent" />
            </div>
        );
    }

    // Color scale for heatmap
    const maxCount = Math.max(...(stats.countryStats.map(d => d.count) || [0]), 1);
    const colorScale = scaleLinear<string>()
        .domain([0, maxCount])
        .range(["#1a1a1a", "#FE4A49"]); // Dark to Accent color

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navigation />
            <PageTransition>
                <main className="container mx-auto px-4 py-32 space-y-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight mb-2 flex items-center gap-3">
                                <LayoutDashboard className="w-10 h-10 text-accent" />
                                Nexus Admin Intelligence
                            </h1>
                            <p className="text-muted-foreground">Comprehensive visitor demographics and behavioral analysis.</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="bg-secondary/50 px-4 py-2 rounded-lg border border-border text-xs font-mono">
                                <span className="text-accent">VERSION:</span> 3.2.0
                            </div>
                            <div className="bg-secondary/50 px-4 py-2 rounded-lg border border-border text-xs font-mono text-emerald-500">
                                <span className="text-accent underline">TERMINAL:</span> VERIFIED
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Total Impressions"
                            value={stats.totalViews}
                            icon={<Activity className="w-5 h-5 text-blue-500" />}
                            description="All-time view count"
                        />
                        <StatCard
                            title="Unique Entities"
                            value={stats.uniqueIPs}
                            icon={<Users className="w-5 h-5 text-purple-500" />}
                            description="Distinct IP addresses"
                        />
                        <StatCard
                            title="Global Reach"
                            value={stats.countries}
                            icon={<Globe className="w-5 h-5 text-green-500" />}
                            description="Countries reached"
                        />
                        <StatCard
                            title="City Centers"
                            value={stats.cities}
                            icon={<MapPin className="w-5 h-5 text-orange-500" />}
                            description="Urban locations tracked"
                        />
                    </div>

                    {/* Cloudflare Style Heatmap */}
                    <Card className="border-border/50 bg-secondary/10 backdrop-blur-xl overflow-hidden">
                        <CardHeader className="border-b border-white/5">
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="w-5 h-5 text-emerald-400" />
                                Interactive Heatmap
                            </CardTitle>
                            <CardDescription>Visualizing global infrastructure utilization and traffic hotspots.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 relative aspect-[21/9] min-h-[400px] bg-black/40">
                            <ComposableMap projectionConfig={{ scale: 140 }}>
                                <Geographies geography={geoUrl}>
                                    {({ geographies }) =>
                                        geographies.map((geo) => {
                                            const country = stats.countryStats.find((s) => s.id === geo.properties.ISO_A2 || s.id === geo.id);
                                            return (
                                                <Geography
                                                    key={geo.rsmKey}
                                                    geography={geo}
                                                    fill={country ? colorScale(country.count) : "#1a1a1a"}
                                                    stroke="#333"
                                                    strokeWidth={0.5}
                                                    style={{
                                                        default: { outline: "none" },
                                                        hover: { fill: "#FE4A49", outline: "none", cursor: "crosshair" },
                                                        pressed: { outline: "none" },
                                                    }}
                                                />
                                            );
                                        })
                                    }
                                </Geographies>
                            </ComposableMap>

                            {/* Heatmap Legend */}
                            <div className="absolute bottom-6 left-6 p-4 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md">
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3 font-bold">Traffic Density</p>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px]">Low</span>
                                    <div className="w-32 h-2 rounded-full bg-gradient-to-r from-[#1a1a1a] to-[#FE4A49]" />
                                    <span className="text-[10px]">Critical</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Traffic Graph */}
                        <Card className="lg:col-span-2 border-border/50 bg-secondary/10 backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-accent" />
                                    Traffic Velocity
                                </CardTitle>
                                <CardDescription>Temporal distribution of incoming requests</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats.viewsByDate}>
                                        <defs>
                                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                        <XAxis dataKey="date" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                                            itemStyle={{ color: '#8884d8' }}
                                        />
                                        <Area type="monotone" dataKey="count" stroke="#8884d8" fillOpacity={1} fill="url(#colorViews)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Top Locations */}
                        <Card className="border-border/50 bg-secondary/10 backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-accent" />
                                    Strategic Regions
                                </CardTitle>
                                <CardDescription>Top performing geographic nodes</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {stats.topLocations.map((loc, i) => (
                                        <div key={i} className="flex justify-between items-center group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xs group-hover:bg-accent group-hover:text-black transition-colors">
                                                    {i + 1}
                                                </div>
                                                <span className="font-medium text-sm">{loc.name}</span>
                                            </div>
                                            <span className="text-muted-foreground font-mono text-xs">{loc.count} req</span>
                                        </div>
                                    ))}
                                    {stats.topLocations.length === 0 && (
                                        <div className="text-center py-8 text-muted-foreground">Analytical synchronization pending...</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Platform Demographics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Browser Distribution */}
                        <PlatformCard
                            title="Browser Breakdown"
                            data={stats.browserStats}
                            icon={<Monitor className="w-5 h-5 text-accent" />}
                        />
                        {/* OS Distribution */}
                        <PlatformCard
                            title="OS Distribution"
                            data={stats.osStats}
                            icon={<Laptop className="w-5 h-5 text-accent" />}
                        />
                        {/* Device Distribution */}
                        <PlatformCard
                            title="Device Diversity"
                            data={stats.deviceStats}
                            icon={<Smartphone className="w-5 h-5 text-accent" />}
                        />
                    </div>

                    {/* Recent Intelligence Table */}
                    <Card className="border-border/50 bg-secondary/10 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="w-5 h-5 text-accent" />
                                Live Intelligence Feed
                            </CardTitle>
                            <CardDescription>Real-time stream of incoming visitor metadata</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent border-b border-border/50">
                                            <TableHead className="w-[150px]">TIMESTAMP</TableHead>
                                            <TableHead>LOCATION & NETWORK</TableHead>
                                            <TableHead>PLATFORM</TableHead>
                                            <TableHead>VISITED PATH</TableHead>
                                            <TableHead className="text-right">IDENTITY / IP</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {stats.recentViews.map((view, i) => (
                                            <TableRow key={i} className="hover:bg-accent/5 transition-colors border-b border-border/10">
                                                <TableCell className="font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                                                    {new Date(view.timestamp).toLocaleString()}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-lg leading-none" title={view.country}>{getFlagEmoji(view.countryCode)}</span>
                                                            <span className="font-semibold text-xs tracking-tight">{view.city}, {view.regionName}</span>
                                                        </div>
                                                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded w-fit italic">
                                                            {view.isp} ({view.as})
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-0.5">
                                                        <div className="flex items-center gap-2 text-xs">
                                                            <span className="text-accent">{view.browser}</span>
                                                            <span className="text-muted-foreground/50">on</span>
                                                            <span>{view.os}</span>
                                                        </div>
                                                        <div className="flex gap-2 text-[9px] text-muted-foreground">
                                                            <span>{view.device}</span>
                                                            <span>•</span>
                                                            <span>{view.screenResolution}</span>
                                                            <span>•</span>
                                                            <span>{view.language}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-xs font-mono bg-accent/10 text-accent px-1.5 py-0.5 rounded w-fit">
                                                            {view.path}
                                                        </span>
                                                        <span className="text-[10px] text-muted-foreground truncate max-w-[150px]" title={view.referrer}>
                                                            Ref: {view.referrer}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <span className="font-mono text-xs text-accent/80 bg-accent/5 px-2 py-1 rounded">
                                                        {view.query}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </PageTransition>
            <Footer />
        </div>
    );
};

const PlatformCard = ({ title, data, icon }: any) => (
    <Card className="border-border/50 bg-secondary/10 backdrop-blur-xl">
        <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                {icon}
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="h-[200px] mb-4">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="count"
                        >
                            {data.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="space-y-2">
                {data.slice(0, 3).map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                            <span>{item.name}</span>
                        </div>
                        <span className="font-mono text-muted-foreground">{item.count}</span>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
);

const StatCard = ({ title, value, icon, description }: any) => (
    <Card className="border-border/50 bg-secondary/5 hover:bg-secondary/10 transition-all group overflow-hidden relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-accent/10 transition-colors" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold tracking-wider text-muted-foreground">{title.toUpperCase()}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-3xl font-bold tracking-tighter">{value}</div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest">
                {description}
            </p>
        </CardContent>
    </Card>
);

const FeatureInfoCard = ({ icon, title, description }: any) => (
    <div className="p-6 rounded-xl border border-border/50 bg-secondary/5 hover:border-accent/40 transition-all group overflow-hidden relative">
        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="text-base font-semibold mb-2">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed italic">"{description}"</p>
    </div>
);

export default Analytics;
