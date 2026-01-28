
import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getAnalyticsStats, getFlagEmoji, AnalyticsStats, deleteLog, clearAllLogs } from '@/lib/analytics';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import {
    Users, Globe, MapPin, Activity, LayoutDashboard, Database, Shield, Server, RefreshCw, Smartphone, Monitor, Laptop, Info, Navigation as NavIcon, Lock, Trash2, Search, Filter, AlertTriangle, Cpu, Globe2, MousePointer2
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Use the exact TopoJSON URL used in react-simple-maps official examples for maximum reliability
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const COLORS = ['#FE4A49', '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28'];

const Analytics = () => {
    const [stats, setStats] = useState<AnalyticsStats | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [pin, setPin] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPath, setFilterPath] = useState('all');

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

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this log entry?")) return;

        try {
            await deleteLog(id, '2323');
            toast.success("Log entry removed from database.");
            // Refresh stats
            const data = await getAnalyticsStats('2323');
            setStats(data);
        } catch (error) {
            toast.error("Failed to delete entry.");
        }
    };

    const handleClearAll = async () => {
        if (!confirm("CRITICAL ACTION: Are you sure you want to PURGE the entire intelligence database? This cannot be undone.")) return;

        try {
            await clearAllLogs('2323');
            toast.success("Intelligence database purged successfully.");
            const data = await getAnalyticsStats('2323');
            setStats(data);
        } catch (error) {
            toast.error("Process failed.");
        }
    };

    const filteredViews = useMemo(() => {
        if (!stats) return [];
        return stats.recentViews.filter(view => {
            const matchesSearch =
                (view.query?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
                (view.city?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
                (view.country?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
                (view.isp?.toLowerCase() || "").includes(searchQuery.toLowerCase());

            const matchesPath = filterPath === 'all' || view.path === filterPath;

            return matchesSearch && matchesPath;
        });
    }, [stats, searchQuery, filterPath]);

    const uniquePaths = useMemo(() => {
        if (!stats) return [];
        return Array.from(new Set(stats.recentViews.map(v => v.path)));
    }, [stats]);

    useEffect(() => {
        return () => {
            setIsAuthorized(false);
            setStats(null);
        };
    }, []);

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

    const maxCount = Math.max(...(stats.countryStats.map(d => d.count) || [0]), 1);
    const colorScale = scaleLinear<string>()
        .domain([0, maxCount])
        .range(["#1a1a1a", "#FE4A49"]);

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <Navigation />
            <PageTransition>
                <main className="container mx-auto px-4 py-32 space-y-8">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight mb-2 flex items-center gap-3">
                                <LayoutDashboard className="w-10 h-10 text-accent" />
                                Nexus Admin Intelligence
                            </h1>
                            <p className="text-muted-foreground">Comprehensive visitor demographics and behavioral analysis.</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <div className="flex gap-2">
                                <div className="bg-secondary/50 px-4 py-2 rounded-lg border border-border text-xs font-mono">
                                    <span className="text-accent">VERSION:</span> 4.0.0
                                </div>
                                <div className="bg-secondary/50 px-4 py-2 rounded-lg border border-border text-xs font-mono text-emerald-500">
                                    <span className="text-accent underline">TERMINAL:</span> MASTER
                                </div>
                            </div>
                            <button
                                onClick={handleClearAll}
                                className="text-[10px] text-destructive hover:text-red-400 transition-colors uppercase tracking-[0.2em] font-bold flex items-center gap-1 mt-2"
                            >
                                <AlertTriangle className="w-3 h-3" />
                                Purge All Intel
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard title="Impressions" value={stats.totalViews} icon={<Activity className="w-5 h-5 text-blue-500" />} description="Total requests logged" />
                        <StatCard title="Entities" value={stats.uniqueIPs} icon={<Users className="w-5 h-5 text-purple-500" />} description="Unique IP addresses" />
                        <StatCard title="Nations" value={stats.countries} icon={<Globe className="w-5 h-5 text-green-500" />} description="Global distribution" />
                        <StatCard title="Endpoints" value={uniquePaths.length} icon={<NavIcon className="w-5 h-5 text-orange-500" />} description="Active site paths" />
                    </div>

                    {/* Map & Hotspots Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Heatmap Section */}
                        <Card className="lg:col-span-2 border-border/50 bg-secondary/10 backdrop-blur-xl overflow-hidden shadow-2xl shadow-accent/5">
                            <CardHeader className="border-b border-white/5">
                                <CardTitle className="flex items-center gap-2">
                                    <Globe className="w-5 h-5 text-emerald-400" />
                                    Interactive Global Heatmap
                                </CardTitle>
                                <CardDescription>Visualizing global infrastructure utilization and traffic hotspots.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0 relative bg-black/40 h-[450px]">
                                <TooltipProvider>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <ComposableMap projectionConfig={{ scale: 140 }}>
                                            <Geographies geography={geoUrl}>
                                                {({ geographies }) =>
                                                    geographies.map((geo) => {
                                                        const isoCode = geo.properties.ISO_A2 || geo.properties.iso_a2;
                                                        const countryName = geo.properties.name || geo.properties.NAME;
                                                        const countryData = stats.countryStats.find(s =>
                                                            s.id === isoCode ||
                                                            s.id === geo.id ||
                                                            s.id === countryName
                                                        );

                                                        const sessionCount = countryData ? countryData.count : 0;
                                                        const label = `${countryName}: ${sessionCount} ${sessionCount === 1 ? 'session' : 'sessions'}`;

                                                        return (
                                                            <Tooltip key={geo.rsmKey}>
                                                                <TooltipTrigger asChild>
                                                                    <Geography
                                                                        geography={geo}
                                                                        fill={countryData ? colorScale(countryData.count) : "#1a1a1a"}
                                                                        stroke="#333"
                                                                        strokeWidth={0.5}
                                                                        style={{
                                                                            default: { outline: "none" },
                                                                            hover: { fill: "#FE4A49", outline: "none", cursor: "pointer" },
                                                                            pressed: { outline: "none" },
                                                                        }}
                                                                    />
                                                                </TooltipTrigger>
                                                                <TooltipContent className="bg-black/90 border-accent/20 backdrop-blur-md shadow-2xl">
                                                                    <div className="flex items-center gap-2 px-1">
                                                                        <span className="text-lg leading-none">{countryData ? getFlagEmoji(countryData.id) : ''}</span>
                                                                        <p className="font-mono text-xs font-bold">{label}</p>
                                                                    </div>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        );
                                                    })
                                                }
                                            </Geographies>
                                        </ComposableMap>
                                    </div>
                                </TooltipProvider>

                                <div className="absolute bottom-6 left-6 p-4 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md">
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3 font-bold text-accent">Traffic Density</p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px]">Idle</span>
                                        <div className="w-32 h-2 rounded-full bg-gradient-to-r from-[#1a1a1a] to-[#FE4A49]" />
                                        <span className="text-[10px]">Active</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Top Locations List */}
                        <Card className="border-border/50 bg-secondary/10 backdrop-blur-xl flex flex-col">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-accent" />
                                    Top Hotspots
                                </CardTitle>
                                <CardDescription>Highest concentration of active sessions.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-y-auto">
                                <div className="space-y-4">
                                    {stats.topLocations.map((loc, i) => (
                                        <div key={i} className="flex items-center justify-between group p-2 rounded-lg hover:bg-accent/5 transition-all">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold group-hover:text-accent transition-colors">{loc.name}</span>
                                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-tighter">
                                                    <Badge variant="outline" className="h-4 py-0 text-[8px] border-accent/20 text-accent/60">NODE-{i + 1}</Badge>
                                                    Regional Uplink active
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xl font-black text-accent">{loc.count}</span>
                                                <span className="text-[8px] block text-muted-foreground">SESSIONS</span>
                                            </div>
                                        </div>
                                    ))}
                                    {stats.topLocations.length === 0 && (
                                        <div className="text-center py-10 text-muted-foreground italic text-sm">
                                            Awaiting geo-spatial data...
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Environment Charts Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ChartCard title="Environment (OS)" data={stats.osStats} icon={<Cpu className="w-4 h-4 text-purple-400" />} />
                        <ChartCard title="Clients (Browser)" data={stats.browserStats} icon={<Globe2 className="w-4 h-4 text-blue-400" />} />
                        <ChartCard title="Hardware (Device)" data={stats.deviceStats} icon={<Smartphone className="w-4 h-4 text-emerald-400" />} />
                    </div>

                    {/* Management & Feed Section */}
                    <Card className="border-border/50 bg-secondary/10 backdrop-blur-xl">
                        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                            <div className="space-y-1">
                                <CardTitle className="flex items-center gap-2">
                                    <Database className="w-5 h-5 text-accent" />
                                    Intelligence Management
                                </CardTitle>
                                <CardDescription>Analyze, filter, and moderate incoming traffic metadata.</CardDescription>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <div className="relative">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search entities..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs focus:ring-1 focus:ring-accent outline-none w-[200px] transition-all focus:w-[250px]"
                                    />
                                </div>
                                <div className="flex items-center gap-2 px-3 py-2 bg-black/40 border border-white/10 rounded-xl">
                                    <Filter className="w-4 h-4 text-muted-foreground" />
                                    <select
                                        value={filterPath}
                                        onChange={(e) => setFilterPath(e.target.value)}
                                        className="bg-transparent text-xs outline-none cursor-pointer pr-2"
                                    >
                                        <option value="all">All Paths</option>
                                        {uniquePaths.map(p => (
                                            <option key={p} value={p}>{p}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent border-b border-border/50">
                                            <TableHead className="w-[150px] text-[10px] font-bold text-accent uppercase tracking-widest">TIMESTAMP</TableHead>
                                            <TableHead className="text-[10px] font-bold text-accent uppercase tracking-widest">LOCATION & ISP</TableHead>
                                            <TableHead className="text-[10px] font-bold text-accent uppercase tracking-widest">PLATFORM</TableHead>
                                            <TableHead className="text-[10px] font-bold text-accent uppercase tracking-widest">TECH SPECS</TableHead>
                                            <TableHead className="text-[10px] font-bold text-accent uppercase tracking-widest">IDENTITY</TableHead>
                                            <TableHead className="text-right text-[10px] font-bold text-accent uppercase tracking-widest">MGMT</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredViews.map((view, i) => (
                                            <TableRow key={view.id || i} className="hover:bg-accent/5 transition-colors border-b border-border/10 group">
                                                <TableCell className="font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                                                    {new Date(view.timestamp).toLocaleString()}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2 font-bold text-xs tracking-tight">
                                                            <span className="text-lg leading-none">{getFlagEmoji(view.countryCode)}</span>
                                                            {view.city}, {view.country}
                                                        </div>
                                                        <span className="text-[10px] text-muted-foreground truncate max-w-[150px]">
                                                            {view.isp || 'Internal Network'}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <Badge variant="outline" className="border-accent/30 text-[9px] uppercase font-mono px-1.5 h-5 bg-accent/5">
                                                            {view.os}
                                                        </Badge>
                                                        <span className="text-muted-foreground/30">/</span>
                                                        <span className="text-accent font-semibold">{view.browser}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[10px] font-mono text-muted-foreground">
                                                            RES: {view.screenResolution || 'DETECTED'}
                                                        </span>
                                                        <span className="text-[10px] font-mono bg-accent/10 text-accent px-2 py-0.5 rounded w-fit border border-accent/20">
                                                            {view.path}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-mono text-[10px] text-accent/80">
                                                    {view.query}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <button
                                                        onClick={() => handleDelete(view.id)}
                                                        className="p-2 rounded-lg hover:bg-red-500/20 text-muted-foreground hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                                                        title="Delete entry"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {filteredViews.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-20 text-muted-foreground italic">
                                                    No intelligence records match current filters.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Traffic Velocity */}
                    <Card className="border-border/50 bg-secondary/10 backdrop-blur-xl shadow-2xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="w-5 h-5 text-accent" />
                                Traffic Peak Velocity (30d)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px] pt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats.viewsByDate}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#FE4A49" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#FE4A49" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#444"
                                        fontSize={10}
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(val) => val.split('/')[0] + '/' + val.split('/')[1]}
                                    />
                                    <YAxis stroke="#444" fontSize={10} axisLine={false} tickLine={false} />
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px', boxShadow: '0 10px 30px -10px rgba(254, 74, 73, 0.2)' }}
                                        itemStyle={{ color: '#FE4A49', fontWeight: 'bold' }}
                                        labelStyle={{ color: '#666', marginBottom: '4px' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#FE4A49"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorCount)"
                                        animationDuration={1500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </main>
            </PageTransition>
            <Footer />
        </div>
    );
};

const StatCard = ({ title, value, icon, description }: any) => (
    <Card className="border-border/50 bg-secondary/5 hover:border-accent/30 hover:bg-secondary/10 transition-all group overflow-hidden relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-accent/10 transition-colors" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground mb-0">{title.toUpperCase()}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-4xl font-black tracking-tighter mb-1">{value}</div>
            <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-medium opacity-60">
                {description}
            </p>
        </CardContent>
    </Card>
);

const ChartCard = ({ title, data, icon }: any) => (
    <Card className="border-border/50 bg-secondary/5 overflow-hidden flex flex-col hover:border-accent/20 transition-all">
        <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                {icon}
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent className="h-[180px] flex items-center justify-center p-0 relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="count"
                        stroke="none"
                    >
                        {data.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <RechartsTooltip
                        contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px', fontSize: '10px' }}
                    />
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-muted-foreground font-bold tracking-tighter opacity-40 uppercase">Metrics</span>
            </div>
        </CardContent>
        <div className="px-6 pb-6 pt-2 flex-1">
            <div className="space-y-2">
                {data.slice(0, 3).map((item: any, i: number) => {
                    const total = data.reduce((acc: number, curr: any) => acc + curr.count, 0);
                    const percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : 0;
                    return (
                        <div key={i} className="flex flex-col gap-1">
                            <div className="flex items-center justify-between text-[10px]">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                    <span className="text-foreground font-semibold truncate max-w-[100px]">{item.name}</span>
                                </div>
                                <div className="font-mono flex items-center gap-2">
                                    <span className="text-accent">{item.count}</span>
                                    <span className="text-muted-foreground/40 text-[8px]">{percentage}%</span>
                                </div>
                            </div>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-accent/50 rounded-full"
                                    style={{ width: `${percentage}%`, backgroundColor: COLORS[i % COLORS.length] }}
                                />
                            </div>
                        </div>
                    );
                })}
                {data.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground text-[10px] uppercase tracking-widest opacity-50">
                        Insufficient Data
                    </div>
                )}
            </div>
        </div>
    </Card>
);

export default Analytics;
