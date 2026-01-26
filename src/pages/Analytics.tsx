
import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAnalyticsStats, getFlagEmoji, AnalyticsStats, deleteLog, clearAllLogs } from '@/lib/analytics';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import {
    Users, Globe, MapPin, Activity, LayoutDashboard, Database, Shield, Server, RefreshCw, Smartphone, Monitor, Laptop, Info, Navigation as NavIcon, Lock, Trash2, Search, Filter, AlertTriangle
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { toast } from "sonner";

// High-quality TopoJSON with ISO-2 codes in properties
const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
                view.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
                view.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                view.country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                view.isp?.toLowerCase().includes(searchQuery.toLowerCase());

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
                        <div className="flex flex-col items-end gap-2">
                            <div className="flex gap-2">
                                <div className="bg-secondary/50 px-4 py-2 rounded-lg border border-border text-xs font-mono">
                                    <span className="text-accent">VERSION:</span> 3.5.0
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard title="Impressions" value={stats.totalViews} icon={<Activity className="w-5 h-5 text-blue-500" />} description="Total requests logged" />
                        <StatCard title="Entities" value={stats.uniqueIPs} icon={<Users className="w-5 h-5 text-purple-500" />} description="Unique IP addresses" />
                        <StatCard title="Nations" value={stats.countries} icon={<Globe className="w-5 h-5 text-green-500" />} description="Global distribution" />
                        <StatCard title="Endpoints" value={uniquePaths.length} icon={<NavIcon className="w-5 h-5 text-orange-500" />} description="Active site paths" />
                    </div>

                    {/* Heatmap Section */}
                    <Card className="border-border/50 bg-secondary/10 backdrop-blur-xl overflow-hidden shadow-2xl shadow-accent/5">
                        <CardHeader className="border-b border-white/5">
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="w-5 h-5 text-emerald-400" />
                                Interactive Global Heatmap
                            </CardTitle>
                            <CardDescription>Visualizing global infrastructure utilization and traffic hotspots.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 relative aspect-[21/9] min-h-[450px] bg-black/40">
                            <ComposableMap projectionConfig={{ scale: 140 }}>
                                <Geographies geography={geoUrl}>
                                    {({ geographies }) =>
                                        geographies.map((geo) => {
                                            // Matching strategy for ISO-2
                                            const iso2 = geo.properties.ISO_A2 || geo.properties.iso_a2 || geo.id;
                                            const countryData = stats.countryStats.find((s) => s.id === iso2);
                                            return (
                                                <Geography
                                                    key={geo.rsmKey}
                                                    geography={geo}
                                                    fill={countryData ? colorScale(countryData.count) : "#1a1a1a"}
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

                            <div className="absolute bottom-6 left-6 p-4 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md">
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3 font-bold">Traffic Density</p>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px]">Idle</span>
                                    <div className="w-32 h-2 rounded-full bg-gradient-to-r from-[#1a1a1a] to-[#FE4A49]" />
                                    <span className="text-[10px]">Maximum</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Management & Feed Section */}
                    <Card className="border-border/50 bg-secondary/10 backdrop-blur-xl">
                        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                                        className="pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs focus:ring-1 focus:ring-accent outline-none w-[200px]"
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
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent border-b border-border/50">
                                            <TableHead className="w-[150px]">TIMESTAMP</TableHead>
                                            <TableHead>LOCATION & ISP</TableHead>
                                            <TableHead>PLATFORM</TableHead>
                                            <TableHead>TRAJECTORY</TableHead>
                                            <TableHead>IDENTITY</TableHead>
                                            <TableHead className="text-right">MGMT</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredViews.map((view: any, i) => (
                                            <TableRow key={view.id || i} className="hover:bg-accent/5 transition-colors border-b border-border/10 group">
                                                <TableCell className="font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                                                    {new Date(view.timestamp).toLocaleString()}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2 font-bold text-xs tracking-tight">
                                                            <span className="text-lg leading-none">{getFlagEmoji(view.country_code)}</span>
                                                            {view.city}, {view.country}
                                                        </div>
                                                        <span className="text-[10px] text-muted-foreground truncate max-w-[150px]">
                                                            {view.isp || 'Internal Network'}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <span className="text-accent">{view.browser}</span>
                                                        <span className="text-muted-foreground/30">/</span>
                                                        <span>{view.os}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-[10px] font-mono bg-accent/10 text-accent px-2 py-1 rounded truncate block max-w-[120px]">
                                                        {view.path}
                                                    </span>
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
                    <Card className="border-border/50 bg-secondary/10 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="w-5 h-5 text-accent" />
                                Traffic Peak Velocity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats.viewsByDate}>
                                    <XAxis dataKey="date" stroke="#444" fontSize={10} />
                                    <YAxis stroke="#444" fontSize={10} />
                                    <RechartsTooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
                                    <Area type="monotone" dataKey="count" stroke="#FE4A49" fill="#FE4A49" fillOpacity={0.1} />
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

export default Analytics;
