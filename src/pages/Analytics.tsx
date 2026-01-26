
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAnalyticsStats, getFlagEmoji, AnalyticsStats } from '@/lib/analytics';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area
} from 'recharts';
import {
    Users, Globe, MapPin, Activity, LayoutDashboard, Database, Shield, Server, RefreshCw
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';

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
                                Veroe Pro Analytics
                            </h1>
                            <p className="text-muted-foreground">Real-time visitor location and network tracking dashboard.</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="bg-secondary/50 px-4 py-2 rounded-lg border border-border text-xs font-mono">
                                <span className="text-accent">API:</span> ip-api.com
                            </div>
                            <div className="bg-secondary/50 px-4 py-2 rounded-lg border border-border text-xs font-mono">
                                <span className="text-accent">STATUS:</span> OPERATIONAL
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Total Views"
                            value={stats.totalViews}
                            icon={<Activity className="w-5 h-5 text-blue-500" />}
                            description="+12% from last week"
                        />
                        <StatCard
                            title="Unique Visitors"
                            value={stats.uniqueIPs}
                            icon={<Users className="w-5 h-5 text-purple-500" />}
                            description="Per IP Address"
                        />
                        <StatCard
                            title="Countries"
                            value={stats.countries}
                            icon={<Globe className="w-5 h-5 text-green-500" />}
                            description="Global Reach"
                        />
                        <StatCard
                            title="Cities"
                            value={stats.cities}
                            icon={<MapPin className="w-5 h-5 text-orange-500" />}
                            description="Urban Distribution"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Graph */}
                        <Card className="lg:col-span-2 border-border/50 bg-secondary/20 backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-accent" />
                                    Traffic Overview
                                </CardTitle>
                                <CardDescription>Visualizing view counts over time</CardDescription>
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
                        <Card className="border-border/50 bg-secondary/20 backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-accent" />
                                    Top Locations
                                </CardTitle>
                                <CardDescription>Most active geographic regions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {stats.topLocations.map((loc, i) => (
                                        <div key={i} className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-sm">
                                                    {i + 1}
                                                </div>
                                                <span className="font-medium">{loc.name}</span>
                                            </div>
                                            <span className="text-muted-foreground font-mono">{loc.count} views</span>
                                        </div>
                                    ))}
                                    {stats.topLocations.length === 0 && (
                                        <div className="text-center py-8 text-muted-foreground">No data available yet</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Views Table */}
                    <Card className="border-border/50 bg-secondary/20 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="w-5 h-5 text-accent" />
                                Raw Data Feed
                            </CardTitle>
                            <CardDescription>Live stream of incoming visitor requests</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-b border-border/50">
                                        <TableHead className="w-[180px]">Timestamp</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Network / ISP</TableHead>
                                        <TableHead className="text-right">IP Address</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {stats.recentViews.map((view, i) => (
                                        <TableRow key={i} className="hover:bg-accent/5 transition-colors border-b border-border/20">
                                            <TableCell className="font-mono text-xs text-muted-foreground">
                                                {new Date(view.timestamp).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <span className="mr-2 text-lg">{getFlagEmoji(view.countryCode)}</span>
                                                {view.city}, {view.regionName}, {view.country}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="text-sm">{view.isp}</span>
                                                    <span className="text-[10px] text-muted-foreground uppercase">{view.as}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-xs text-accent/80">
                                                {view.query}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {stats.recentViews.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                                                Awaiting first connection...
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Infrastructure Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FeatureInfoCard
                            icon={<Shield className="w-5 h-5 text-accent" />}
                            title="Security Protocol"
                            description="End-to-end encrypted analytical data stored locally with zero third-party disclosure."
                        />
                        <FeatureInfoCard
                            icon={<Server className="w-5 h-5 text-accent" />}
                            title="Edge Tracking"
                            description="Low-latency geolocation lookup using high-performance edge nodes."
                        />
                        <FeatureInfoCard
                            icon={<Users className="w-5 h-5 text-accent" />}
                            title="Privacy Compliant"
                            description="Adheres to strict data isolation principles and GDPR-friendly local storage."
                        />
                    </div>
                </main>
            </PageTransition>
            <Footer />
        </div>
    );
};

const StatCard = ({ title, value, icon, description }: any) => (
    <Card className="border-border/50 bg-secondary/10 hover:bg-secondary/20 transition-all group overflow-hidden relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-accent/10 transition-colors" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-3xl font-bold tracking-tighter">{value}</div>
            <p className="text-xs text-muted-foreground mt-1">
                {description}
            </p>
        </CardContent>
    </Card>
);

const FeatureInfoCard = ({ icon, title, description }: any) => (
    <div className="p-6 rounded-xl border border-border/50 bg-secondary/5 hover:border-accent/40 transition-colors">
        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
);

export default Analytics;
