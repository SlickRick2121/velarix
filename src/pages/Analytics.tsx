import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getAnalyticsStats, getFlagEmoji, AnalyticsStats, deleteLog, clearAllLogs } from '@/lib/analytics';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import {
    Users, Globe, MapPin, Activity, LayoutDashboard, Database, Shield, Server, RefreshCw, Smartphone, Monitor, Laptop, Info, Navigation as NavIcon, Lock, Trash2, Search, Filter, AlertTriangle, Cpu, Globe2, MousePointer2, Settings, History, ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from "sonner";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleLinear } from "d3-scale";

// Use the exact TopoJSON URL used in react-simple-maps official examples for maximum reliability
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const COLORS = ['#FE4A49', '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28'];

// Firewall related constants
const EUROPE_CODES = [
    'AD', 'AL', 'AT', 'AX', 'BA', 'BE', 'BG', 'BY', 'CH', 'CY', 'CZ', 'DE', 'DK', 'EE',
    'ES', 'FI', 'FO', 'FR', 'GB', 'GE', 'GI', 'GR', 'HR', 'HU', 'IE', 'IS', 'IT', 'LI',
    'LT', 'LU', 'LV', 'MC', 'MD', 'ME', 'MK', 'MT', 'NL', 'NO', 'PL', 'PT', 'RO', 'RS',
    'RU', 'SE', 'SI', 'SK', 'SM', 'TR', 'UA', 'VA'
];
const USA_CODES = ['US'];

const COUNTRY_LIST = [
    { code: 'AF', name: 'Afghanistan' }, { code: 'AX', name: 'Aland Islands' }, { code: 'AL', name: 'Albania' },
    { code: 'DZ', name: 'Algeria' }, { code: 'AS', name: 'American Samoa' }, { code: 'AD', name: 'Andorra' },
    { code: 'AO', name: 'Angola' }, { code: 'AI', name: 'Anguilla' }, { code: 'AQ', name: 'Antarctica' },
    { code: 'AG', name: 'Antigua and Barbuda' }, { code: 'AR', name: 'Argentina' }, { code: 'AM', name: 'Armenia' },
    { code: 'AW', name: 'Aruba' }, { code: 'AU', name: 'Australia' }, { code: 'AT', name: 'Austria' },
    { code: 'AZ', name: 'Azerbaijan' }, { code: 'BS', name: 'Bahamas' }, { code: 'BH', name: 'Bahrain' },
    { code: 'BD', name: 'Bangladesh' }, { code: 'BB', name: 'Barbados' }, { code: 'BY', name: 'Belarus' },
    { code: 'BE', name: 'Belgium' }, { code: 'BZ', name: 'Belize' }, { code: 'BJ', name: 'Benin' },
    { code: 'BM', name: 'Bermuda' }, { code: 'BT', name: 'Bhutan' }, { code: 'BO', name: 'Bolivia' },
    { code: 'BA', name: 'Bosnia and Herzegovina' }, { code: 'BW', name: 'Botswana' }, { code: 'BV', name: 'Bouvet Island' },
    { code: 'BR', name: 'Brazil' }, { code: 'IO', name: 'British Indian Ocean Territory' }, { code: 'BN', name: 'Brunei Darussalam' },
    { code: 'BG', name: 'Bulgaria' }, { code: 'BF', name: 'Burkina Faso' }, { code: 'BI', name: 'Burundi' },
    { code: 'KH', name: 'Cambodia' }, { code: 'CM', name: 'Cameroon' }, { code: 'CA', name: 'Canada' },
    { code: 'CV', name: 'Cape Verde' }, { code: 'KY', name: 'Cayman Islands' }, { code: 'CF', name: 'Central African Republic' },
    { code: 'TD', name: 'Chad' }, { code: 'CL', name: 'Chile' }, { code: 'CN', name: 'China' },
    { code: 'CX', name: 'Christmas Island' }, { code: 'CC', name: 'Cocos (Keeling) Islands' }, { code: 'CO', name: 'Colombia' },
    { code: 'KM', name: 'Comoros' }, { code: 'CG', name: 'Congo' }, { code: 'CD', name: 'Congo, Democratic Republic' },
    { code: 'CK', name: 'Cook Islands' }, { code: 'CR', name: 'Costa Rica' }, { code: 'CI', name: 'Cote D\'Ivoire' },
    { code: 'HR', name: 'Croatia' }, { code: 'CU', name: 'Cuba' }, { code: 'CY', name: 'Cyprus' },
    { code: 'CZ', name: 'Czech Republic' }, { code: 'DK', name: 'Denmark' }, { code: 'DJ', name: 'Djibouti' },
    { code: 'DM', name: 'Dominica' }, { code: 'DO', name: 'Dominican Republic' }, { code: 'EC', name: 'Ecuador' },
    { code: 'EG', name: 'Egypt' }, { code: 'SV', name: 'El Salvador' }, { code: 'GQ', name: 'Equatorial Guinea' },
    { code: 'ER', name: 'Eritrea' }, { code: 'EE', name: 'Estonia' }, { code: 'ET', name: 'Ethiopia' },
    { code: 'FK', name: 'Falkland Islands (Malvinas)' }, { code: 'FO', name: 'Faroe Islands' }, { code: 'FJ', name: 'Fiji' },
    { code: 'FI', name: 'Finland' }, { code: 'FR', name: 'France' }, { code: 'GF', name: 'French Guiana' },
    { code: 'PF', name: 'French Polynesia' }, { code: 'TF', name: 'French Southern Territories' }, { code: 'GA', name: 'Gabon' },
    { code: 'GM', name: 'Gambia' }, { code: 'GE', name: 'Georgia' }, { code: 'DE', name: 'Germany' },
    { code: 'GH', name: 'Ghana' }, { code: 'GI', name: 'Gibraltar' }, { code: 'GR', name: 'Greece' },
    { code: 'GL', name: 'Greenland' }, { code: 'GD', name: 'Grenada' }, { code: 'GP', name: 'Guadeloupe' },
    { code: 'GU', name: 'Guam' }, { code: 'GT', name: 'Guatemala' }, { code: 'GG', name: 'Guernsey' },
    { code: 'GN', name: 'Guinea' }, { code: 'GW', name: 'Guinea-Bissau' }, { code: 'GY', name: 'Guyana' },
    { code: 'HT', name: 'Haiti' }, { code: 'HM', name: 'Heard Island and Mcdonald Islands' }, { code: 'VA', name: 'Vatican City' },
    { code: 'HN', name: 'Honduras' }, { code: 'HK', name: 'Hong Kong' }, { code: 'HU', name: 'Hungary' },
    { code: 'IS', name: 'Iceland' }, { code: 'IN', name: 'India' }, { code: 'ID', name: 'Indonesia' },
    { code: 'IR', name: 'Iran' }, { code: 'IQ', name: 'Iraq' }, { code: 'IE', name: 'Ireland' },
    { code: 'IM', name: 'Isle of Man' }, { code: 'IL', name: 'Israel' }, { code: 'IT', name: 'Italy' },
    { code: 'JM', name: 'Jamaica' }, { code: 'JP', name: 'Japan' }, { code: 'JE', name: 'Jersey' },
    { code: 'JO', name: 'Jordan' }, { code: 'KZ', name: 'Kazakhstan' }, { code: 'KE', name: 'Kenya' },
    { code: 'KI', name: 'Kiribati' }, { code: 'KP', name: 'Korea (North)' }, { code: 'KR', name: 'Korea (South)' },
    { code: 'KW', name: 'Kuwait' }, { code: 'KG', name: 'Kyrgyzstan' }, { code: 'LA', name: 'Laos' },
    { code: 'LV', name: 'Latvia' }, { code: 'LB', name: 'Lebanon' }, { code: 'LS', name: 'Lesotho' },
    { code: 'LR', name: 'Liberia' }, { code: 'LY', name: 'Libya' }, { code: 'LI', name: 'Liechtenstein' },
    { code: 'LT', name: 'Lithuania' }, { code: 'LU', name: 'Luxembourg' }, { code: 'MO', name: 'Macao' },
    { code: 'MK', name: 'Macedonia' }, { code: 'MG', name: 'Madagascar' }, { code: 'MW', name: 'Malawi' },
    { code: 'MY', name: 'Malaysia' }, { code: 'MV', name: 'Maldives' }, { code: 'ML', name: 'Mali' },
    { code: 'MT', name: 'Malta' }, { code: 'MH', name: 'Marshall Islands' }, { code: 'MQ', name: 'Martinique' },
    { code: 'MR', name: 'Mauritania' }, { code: 'MU', name: 'Mauritius' }, { code: 'YT', name: 'Mayotte' },
    { code: 'MX', name: 'Mexico' }, { code: 'FM', name: 'Micronesia' }, { code: 'MD', name: 'Moldova' },
    { code: 'MC', name: 'Monaco' }, { code: 'MN', name: 'Mongolia' }, { code: 'ME', name: 'Montenegro' },
    { code: 'MS', name: 'Montserrat' }, { code: 'MA', name: 'Morocco' }, { code: 'MZ', name: 'Mozambique' },
    { code: 'MM', name: 'Myanmar' }, { code: 'NA', name: 'Namibia' }, { code: 'NR', name: 'Nauru' },
    { code: 'NP', name: 'Nepal' }, { code: 'NL', name: 'Netherlands' }, { code: 'NC', name: 'New Caledonia' },
    { code: 'NZ', name: 'New Zealand' }, { code: 'NI', name: 'Nicaragua' }, { code: 'NE', name: 'Niger' },
    { code: 'NG', name: 'Nigeria' }, { code: 'NU', name: 'Niue' }, { code: 'NF', name: 'Norfolk Island' },
    { code: 'MP', name: 'Northern Mariana Islands' }, { code: 'NO', name: 'Norway' }, { code: 'OM', name: 'Oman' },
    { code: 'PK', name: 'Pakistan' }, { code: 'PW', name: 'Palau' }, { code: 'PS', name: 'Palestine' },
    { code: 'PA', name: 'Panama' }, { code: 'PG', name: 'Papua New Guinea' }, { code: 'PY', name: 'Paraguay' },
    { code: 'PE', name: 'Peru' }, { code: 'PH', name: 'Philippines' }, { code: 'PN', name: 'Pitcairn' },
    { code: 'PL', name: 'Poland' }, { code: 'PT', name: 'Portugal' }, { code: 'PR', name: 'Puerto Rico' },
    { code: 'QA', name: 'Qatar' }, { code: 'RE', name: 'Reunion' }, { code: 'RO', name: 'Romania' },
    { code: 'RU', name: 'Russian Federation' }, { code: 'RW', name: 'Rwanda' }, { code: 'BL', name: 'Saint Barthelemy' },
    { code: 'SH', name: 'Saint Helena' }, { code: 'KN', name: 'Saint Kitts and Nevis' }, { code: 'LC', name: 'Saint Lucia' },
    { code: 'MF', name: 'Saint Martin' }, { code: 'PM', name: 'Saint Pierre and Miquelon' }, { code: 'VC', name: 'Saint Vincent and Grenadines' },
    { code: 'WS', name: 'Samoa' }, { code: 'SM', name: 'San Marino' }, { code: 'ST', name: 'Sao Tome and Principe' },
    { code: 'SA', name: 'Saudi Arabia' }, { code: 'SN', name: 'Senegal' }, { code: 'RS', name: 'Serbia' },
    { code: 'SC', name: 'Seychelles' }, { code: 'SL', name: 'Sierra Leone' }, { code: 'SG', name: 'Singapore' },
    { code: 'SK', name: 'Slovakia' }, { code: 'SI', name: 'Slovenia' }, { code: 'SB', name: 'Solomon Islands' },
    { code: 'SO', name: 'Somalia' }, { code: 'ZA', name: 'South Africa' }, { code: 'GS', name: 'South Georgia' },
    { code: 'ES', name: 'Spain' }, { code: 'LK', name: 'Sri Lanka' }, { code: 'SD', name: 'Sudan' },
    { code: 'SR', name: 'Suriname' }, { code: 'SJ', name: 'Svalbard and Jan Mayen' }, { code: 'SZ', name: 'Swaziland' },
    { code: 'SE', name: 'Sweden' }, { code: 'CH', name: 'Switzerland' }, { code: 'SY', name: 'Syrian Arab Republic' },
    { code: 'TW', name: 'Taiwan' }, { code: 'TJ', name: 'Tajikistan' }, { code: 'TZ', name: 'Tanzania' },
    { code: 'TH', name: 'Thailand' }, { code: 'TL', name: 'Timor-Leste' }, { code: 'TG', name: 'Togo' },
    { code: 'TK', name: 'Tokelau' }, { code: 'TO', name: 'Tonga' }, { code: 'TT', name: 'Trinidad and Tobago' },
    { code: 'TN', name: 'Tunisia' }, { code: 'TR', name: 'Turkey' }, { code: 'TM', name: 'Turkmenistan' },
    { code: 'TC', name: 'Turks and Caicos Islands' }, { code: 'TV', name: 'Tuvalu' }, { code: 'UG', name: 'Uganda' },
    { code: 'UA', name: 'Ukraine' }, { code: 'AE', name: 'United Arab Emirates' }, { code: 'GB', name: 'United Kingdom' },
    { code: 'US', name: 'United States' }, { code: 'UY', name: 'Uruguay' }, { code: 'UZ', name: 'Uzbekistan' },
    { code: 'VU', name: 'Vanuatu' }, { code: 'VE', name: 'Venezuela' }, { code: 'VN', name: 'Vietnam' },
    { code: 'VG', name: 'Virgin Islands, British' }, { code: 'VI', name: 'Virgin Islands, U.S.' }, { code: 'WF', name: 'Wallis and Futuna' },
    { code: 'EH', name: 'Western Sahara' }, { code: 'YE', name: 'Yemen' }, { code: 'ZM', name: 'Zambia' },
    { code: 'ZW', name: 'Zimbabwe' }
];

const Analytics = () => {
    const [stats, setStats] = useState<AnalyticsStats | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [pin, setPin] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPath, setFilterPath] = useState('all');
    const [activeView, setActiveView] = useState<'intelligence' | 'firewall'>('intelligence');
    const [heatmapMode, setHeatmapMode] = useState<'traffic' | 'blocked'>('traffic');

    // Firewall State
    const [blockedCountries, setBlockedCountries] = useState<string[]>([]);
    const [lockdownMode, setLockdownMode] = useState(false);
    const [adminIp, setAdminIp] = useState('');
    const [firewallStats, setFirewallStats] = useState<{ country_code: string; count: number }[]>([]);
    const [isFirewallLoading, setIsFirewallLoading] = useState(false);

    const handleVerify = async () => {
        if (pin === '2323') {
            setIsLoading(true);
            try {
                const data = await getAnalyticsStats('2323');
                setStats(data);
                await fetchFirewallStatus(); // Fetch firewall too
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

    const fetchFirewallStatus = async () => {
        try {
            const res = await fetch('/api/firewall/status');
            const data = await res.json();
            setBlockedCountries(data.blocked.map((b: any) => b.country_code));
            setFirewallStats(data.stats || []);
            const lockdown = data.settings.find((s: any) => s.key === 'lockdown_active')?.value === '1';
            const ip = data.settings.find((s: any) => s.key === 'admin_ip')?.value || '';
            setLockdownMode(lockdown);
            setAdminIp(ip);
        } catch (err) {
            console.error('Firewall fetch error');
        }
    };

    const toggleFirewallBulk = async (codes: string[], name: string) => {
        setIsFirewallLoading(true);
        const isBlocking = !codes.every(code => blockedCountries.includes(code));
        const action = isBlocking ? 'block' : 'unblock';

        try {
            const res = await fetch('/api/firewall/bulk-toggle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ countryCodes: codes, action })
            });
            if (res.ok) {
                toast.success(`${action === 'block' ? 'Blocked' : 'Unblocked'} ${name}`);
                fetchFirewallStatus();
            }
        } catch (err) {
            toast.error(`Failed to update ${name}`);
        } finally {
            setIsFirewallLoading(false);
        }
    };

    const toggleFirewallSingle = async (code: string) => {
        try {
            const res = await fetch('/api/firewall/toggle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ countryCode: code })
            });
            if (res.ok) {
                toast.success(`Updated status for ${code}`);
                fetchFirewallStatus();
            }
        } catch (err) {
            toast.error('Toggle failed');
        }
    };

    const saveLockdown = async () => {
        try {
            const res = await fetch('/api/firewall/lockdown', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ active: lockdownMode, adminIp })
            });
            if (res.ok) {
                toast.success('Lockdown configuration updated');
                fetchFirewallStatus();
            }
        } catch (err) {
            toast.error('Update failed');
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

    const activeMaxCount = heatmapMode === 'traffic'
        ? Math.max(...(stats.countryStats.map(d => d.count) || [0]), 1)
        : Math.max(...(firewallStats.map(d => d.count) || [0]), 1);

    const colorScale = scaleLinear<string>()
        .domain([0, activeMaxCount])
        .range(["#1a1a1a", heatmapMode === 'traffic' ? "#FE4A49" : "#ff0000"]);

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
                                <div className="bg-secondary/20 rounded-xl border border-white/5 p-1 flex gap-1">
                                    <button
                                        onClick={() => setActiveView('intelligence')}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeView === 'intelligence' ? 'bg-accent text-black shadow-lg shadow-accent/20' : 'text-muted-foreground hover:text-white'}`}
                                    >
                                        <Activity className="w-3 h-3" /> INTELLIGENCE
                                    </button>
                                    <button
                                        onClick={() => setActiveView('firewall')}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeView === 'firewall' ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' : 'text-muted-foreground hover:text-white'}`}
                                    >
                                        <Shield className="w-3 h-3" /> FIREWALL
                                    </button>
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

                    {activeView === 'intelligence' ? (
                        <>
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
                                    <CardHeader className="border-b border-white/5 flex flex-row items-center justify-between">
                                        <div>
                                            <CardTitle className="flex items-center gap-2">
                                                <Globe className="w-5 h-5 text-emerald-400" />
                                                {heatmapMode === 'traffic' ? 'Interactive Global Heatmap' : 'Blocked Access Map'}
                                            </CardTitle>
                                            <CardDescription>
                                                {heatmapMode === 'traffic'
                                                    ? 'Visualizing global infrastructure utilization and traffic hotspots.'
                                                    : 'Geographic distribution of blocked/deterred unauthorized access attempts.'
                                                }
                                            </CardDescription>
                                        </div>
                                        <div className="bg-black/60 p-1 rounded-lg border border-white/5 flex">
                                            <button
                                                onClick={() => setHeatmapMode('traffic')}
                                                className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${heatmapMode === 'traffic' ? 'bg-secondary text-white' : 'text-zinc-500'}`}
                                            >TRAFFIC</button>
                                            <button
                                                onClick={() => setHeatmapMode('blocked')}
                                                className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${heatmapMode === 'blocked' ? 'bg-red-600/20 text-red-500' : 'text-zinc-500'}`}
                                            >THREATS</button>
                                        </div>
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

                                                                const trafficData = stats.countryStats.find(s =>
                                                                    s.id === isoCode ||
                                                                    s.id === geo.id ||
                                                                    s.id === countryName
                                                                );

                                                                const blockData = firewallStats.find(s => s.country_code === isoCode);

                                                                const activeData = heatmapMode === 'traffic' ? trafficData : { count: blockData?.count || 0 };
                                                                const sessionCount = activeData ? activeData.count : 0;

                                                                const label = heatmapMode === 'traffic'
                                                                    ? `${countryName}: ${sessionCount} ${sessionCount === 1 ? 'session' : 'sessions'}`
                                                                    : `${countryName}: ${sessionCount} blocked attempts`;

                                                                return (
                                                                    <Tooltip key={geo.rsmKey}>
                                                                        <TooltipTrigger asChild>
                                                                            <Geography
                                                                                geography={geo}
                                                                                fill={sessionCount > 0 ? colorScale(sessionCount) : "#1a1a1a"}
                                                                                stroke="#333"
                                                                                strokeWidth={0.5}
                                                                                style={{
                                                                                    default: { outline: "none" },
                                                                                    hover: { fill: heatmapMode === 'traffic' ? "#FE4A49" : "#ff0000", outline: "none", cursor: "pointer" },
                                                                                    pressed: { outline: "none" },
                                                                                }}
                                                                            />
                                                                        </TooltipTrigger>
                                                                        <TooltipContent className="bg-black/90 border-accent/20 backdrop-blur-md shadow-2xl">
                                                                            <div className="flex items-center gap-2 px-1">
                                                                                <span className="text-lg leading-none">{getFlagEmoji(isoCode)}</span>
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
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3 font-bold text-accent">
                                                {heatmapMode === 'traffic' ? 'Traffic Density' : 'Inbound Threat Density'}
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px]">Idle</span>
                                                <div className={`w-32 h-2 rounded-full bg-gradient-to-r from-[#1a1a1a] ${heatmapMode === 'traffic' ? 'to-[#FE4A49]' : 'to-[#ff0000]'}`} />
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
                                            Traffic Hubs
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
                                                            Regional active
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-xl font-black text-accent">{loc.count}</span>
                                                        <span className="text-[8px] block text-muted-foreground">SESSIONS</span>
                                                    </div>
                                                </div>
                                            ))}
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
                                            Intelligence Feed
                                        </CardTitle>
                                        <CardDescription>Live telemetry and metadata extraction.</CardDescription>
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
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="hover:bg-transparent border-b border-border/50">
                                                    <TableHead className="w-[150px] text-[10px] font-bold text-accent uppercase tracking-widest">TIMESTAMP</TableHead>
                                                    <TableHead className="text-[10px] font-bold text-accent uppercase tracking-widest">LOCATION</TableHead>
                                                    <TableHead className="text-[10px] font-bold text-accent uppercase tracking-widest">PLATFORM</TableHead>
                                                    <TableHead className="text-[10px] font-bold text-accent uppercase tracking-widest">PATH</TableHead>
                                                    <TableHead className="text-[10px] font-bold text-accent uppercase tracking-widest">IP</TableHead>
                                                    <TableHead className="text-right text-[10px] font-bold text-accent uppercase tracking-widest">MOD</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredViews.map((view, i) => (
                                                    <TableRow key={view.id || i} className="hover:bg-accent/5 transition-colors border-b border-border/10 group">
                                                        <TableCell className="font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                                                            {new Date(view.timestamp).toLocaleString()}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2 font-bold text-xs tracking-tight">
                                                                <span className="text-lg leading-none">{getFlagEmoji(view.countryCode)}</span>
                                                                {view.city}, {view.country}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="text-xs">{view.os} / {view.browser}</span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline" className="text-[9px] uppercase px-1 h-5">{view.path}</Badge>
                                                        </TableCell>
                                                        <TableCell className="font-mono text-[10px] text-accent/80">
                                                            {view.query}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <button onClick={() => handleDelete(view.id)} className="p-2 opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10 rounded">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    ) : (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Firewall Controls */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card className="bg-zinc-950 border-zinc-900 border-2 overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-3xl -mr-16 -mt-16" />
                                    <CardHeader>
                                        <CardTitle className="text-xs text-zinc-500 flex items-center gap-2">
                                            <Globe className="w-4 h-4 text-red-500" /> REGIONAL_PROTOCOLS
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-zinc-900/30 rounded-xl border border-white/5 group hover:border-red-500/30 transition-all">
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold tracking-tight">EUROPE_BLOCK</p>
                                                <p className="text-[10px] text-zinc-500 font-mono">50 NATIONS // RESTRICTED</p>
                                            </div>
                                            <Switch
                                                checked={EUROPE_CODES.every(c => blockedCountries.includes(c))}
                                                onCheckedChange={() => toggleFirewallBulk(EUROPE_CODES, 'Europe')}
                                                disabled={isFirewallLoading}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-zinc-900/30 rounded-xl border border-white/5 group hover:border-red-500/30 transition-all">
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold tracking-tight">USA_BLOCK</p>
                                                <p className="text-[10px] text-zinc-500 font-mono">UNITED STATES // NORTH AMERICA</p>
                                            </div>
                                            <Switch
                                                checked={USA_CODES.every(c => blockedCountries.includes(c))}
                                                onCheckedChange={() => toggleFirewallBulk(USA_CODES, 'USA')}
                                                disabled={isFirewallLoading}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className={`bg-zinc-950 border-2 transition-all duration-700 ${lockdownMode ? 'border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.1)]' : 'border-zinc-900'}`}>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-xs text-zinc-500 flex items-center gap-2">
                                                <Lock className="w-4 h-4 text-red-500" /> SYSTEM_LOCKDOWN
                                            </CardTitle>
                                            {lockdownMode && <Badge className="bg-red-600 animate-pulse border-none">ACTIVE</Badge>}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between gap-4">
                                            <p className="text-[10px] text-zinc-400 font-mono leading-relaxed">BLOCK ALL INBOUND TRAFFIC EXCEPT VERIFIED ADMIN UPLINK</p>
                                            <Switch checked={lockdownMode} onCheckedChange={setLockdownMode} />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center px-1">
                                                <label className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest">AUTHORIZED_ADMIN_IP</label>
                                                <button
                                                    onClick={() => setAdminIp('127.0.0.1')}
                                                    className="text-[8px] text-accent hover:underline uppercase"
                                                >Use Localhost</button>
                                            </div>
                                            <Input
                                                value={adminIp}
                                                onChange={(e) => setAdminIp(e.target.value)}
                                                placeholder="Detecting IP..."
                                                className="bg-black/40 border-zinc-800 text-red-500 font-mono text-sm focus:border-red-600 h-12 rounded-xl"
                                            />
                                        </div>
                                        <Button
                                            onClick={saveLockdown}
                                            className={`w-full font-black tracking-widest text-[10px] h-12 rounded-xl border-none transition-all ${lockdownMode ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20' : 'bg-zinc-900 hover:bg-zinc-800'}`}
                                        >
                                            {lockdownMode ? 'SYNCHRONIZE SECURITY CORE' : 'UPDATE WHITELIST PROTOCOLS'}
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Card className="bg-zinc-950 border-zinc-900 border-2 overflow-hidden relative group">
                                    <CardHeader>
                                        <CardTitle className="text-xs text-zinc-500 flex items-center gap-2 text-red-500">
                                            <History className="w-4 h-4" /> THREAT_HISTORY
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-zinc-900/40 p-5 rounded-2xl border border-white/5 text-center group-hover:border-red-500/20 transition-all">
                                                <p className="text-4xl font-black text-red-600 tracking-tighter">{blockedCountries.length}</p>
                                                <p className="text-[8px] text-zinc-600 uppercase font-black tracking-widest mt-1">BLACKLISTED</p>
                                            </div>
                                            <div className="bg-zinc-900/40 p-5 rounded-2xl border border-white/5 text-center group-hover:border-red-500/20 transition-all">
                                                <p className="text-4xl font-black text-zinc-100 tracking-tighter">
                                                    {firewallStats.reduce((a, b) => a + b.count, 0)}
                                                </p>
                                                <p className="text-[8px] text-zinc-600 uppercase font-black tracking-widest mt-1">DETECTIONS</p>
                                            </div>
                                        </div>
                                        <div className="text-[9px] text-zinc-500 font-mono flex items-center gap-2 justify-center bg-zinc-900/20 py-2 rounded-lg border border-white/5">
                                            <Settings className="w-3 h-3 animate-spin duration-[3000ms]" /> ENCRYPTION_ENGINE: STEALTH_MODE_ACTIVE
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Granular Management */}
                            <Card className="bg-zinc-950 border-zinc-900 border-2 overflow-hidden">
                                <CardHeader className="border-b border-white/5 bg-secondary/5">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <CardTitle className="text-xs text-zinc-300 flex items-center gap-3">
                                            <Filter className="w-5 h-5 text-red-600" /> GRANULAR_SECURITY_POLICY
                                        </CardTitle>
                                        <div className="flex gap-3">
                                            <Select onValueChange={toggleFirewallSingle}>
                                                <SelectTrigger className="w-[300px] h-11 bg-black/60 border-zinc-800 text-xs rounded-xl focus:ring-red-600/50">
                                                    <SelectValue placeholder="ADD INDIVIDUAL COUNTRY BLOCK" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-black border-red-900/30 text-white max-h-[400px] rounded-xl backdrop-blur-3xl">
                                                    {COUNTRY_LIST.map(country => (
                                                        <SelectItem key={country.code} value={country.code} className="hover:bg-red-600/20 cursor-pointer text-xs font-mono">
                                                            <span className="mr-2 opacity-50">{country.code}</span> {country.name.toUpperCase()} {blockedCountries.includes(country.code) ? '⚠️' : ''}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
                                        {blockedCountries.length === 0 ? (
                                            <div className="col-span-full text-center py-20 opacity-20 flex flex-col items-center gap-4">
                                                <Shield className="w-12 h-12" />
                                                <p className="text-xs font-mono tracking-widest">ZERO_THREATS_DEFINED</p>
                                            </div>
                                        ) : (
                                            blockedCountries.map(code => {
                                                const country = COUNTRY_LIST.find(c => c.code === code);
                                                const detections = firewallStats.find(s => s.country_code === code)?.count || 0;
                                                return (
                                                    <motion.div
                                                        key={code}
                                                        whileHover={{ scale: 1.05, borderColor: 'rgba(220,38,38,0.5)' }}
                                                        className="bg-zinc-900/30 border border-white/5 p-3 rounded-2xl flex flex-col items-center justify-center relative group transition-all"
                                                    >
                                                        <span className="text-lg mb-1">{getFlagEmoji(code)}</span>
                                                        <span className="text-xs font-black text-red-500">{code}</span>
                                                        <span className="text-[7px] text-zinc-600 uppercase font-bold truncate max-w-full px-1">{country?.name || 'Unknown'}</span>
                                                        {detections > 0 && (
                                                            <Badge variant="outline" className="h-4 px-1 text-[7px] text-red-400/60 bg-red-950/20 mt-1 pointer-events-none">
                                                                {detections} BLOCKS
                                                            </Badge>
                                                        )}
                                                        <button
                                                            onClick={() => toggleFirewallSingle(code)}
                                                            className="absolute inset-0 bg-red-600 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 rounded-2xl"
                                                        >
                                                            <Trash2 className="w-5 h-5 text-white" />
                                                        </button>
                                                    </motion.div>
                                                );
                                            })
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
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
