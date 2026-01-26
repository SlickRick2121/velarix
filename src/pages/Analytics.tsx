
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAnalyticsStats, getFlagEmoji, AnalyticsStats } from '@/lib/analytics';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import {
    Users, Globe, MapPin, Activity, LayoutDashboard, Database, Shield, Server, RefreshCw, Smartphone, Monitor, Laptop, Info, Navigation as NavIcon
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Analytics = () => {
    const [stats, setStats] = useState<AnalyticsStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const data = getAnalyticsStats();
        setStats(data);
        setIsLoading(false);
    }, []);

    if (isLoading || !stats) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <RefreshCw className="w-8 h-8 animate-spin text-accent" />
            </div>
        );
    }

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
                                <span className="text-accent">VERSION:</span> 2.4.0
                            </div>
                            <div className="bg-secondary/50 px-4 py-2 rounded-lg border border-border text-xs font-mono">
                                <span className="text-accent">STATUS:</span> ACTIVE
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
                                        {stats.recentViews.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground italic">
                                                    Awaiting first node connection...
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Infrastructure Resilience */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FeatureInfoCard
                            icon={<Shield className="w-5 h-5 text-accent" />}
                            title="Zero-Trust Architecture"
                            description="All analytical payloads are isolated from public endpoints and encrypted at rest."
                        />
                        <FeatureInfoCard
                            icon={<Server className="w-5 h-5 text-accent" />}
                            title="Distributed Nodes"
                            description="Active monitoring across global edge locations for real-time traffic validation."
                        />
                        <FeatureInfoCard
                            icon={<NavIcon className="w-5 h-5 text-accent" />}
                            title="Identity Shielding"
                            description="GDPR-compliant IP mask option available for enhanced visitor privacy protocols."
                        />
                    </div>
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
    <div className="p-6 rounded-xl border border-border/50 bg-secondary/5 hover:border-accent/40 transition-all group">
        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="text-base font-semibold mb-2">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed italic">"{description}"</p>
    </div>
);

export default Analytics;
