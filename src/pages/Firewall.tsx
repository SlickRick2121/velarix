import React, { useState, useEffect } from 'react';
import { Shield, Globe, Lock, Unlock, Zap, Activity, Filter, Trash2, Plus, Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

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

const Firewall = () => {
    const [blockedCountries, setBlockedCountries] = useState<string[]>([]);
    const [lockdownMode, setLockdownMode] = useState(false);
    const [adminIp, setAdminIp] = useState('');
    const [loading, setLoading] = useState(true);
    const [bulkLoading, setBulkLoading] = useState(false);

    const fetchStatus = async () => {
        try {
            const res = await fetch('/api/firewall/status');
            const data = await res.json();
            setBlockedCountries(data.blocked.map((b: any) => b.country_code));
            const lockdown = data.settings.find((s: any) => s.key === 'lockdown_active')?.value === '1';
            const ip = data.settings.find((s: any) => s.key === 'admin_ip')?.value || '';
            setLockdownMode(lockdown);
            setAdminIp(ip);
        } catch (err) {
            toast.error('Failed to load firewall status');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    const toggleBulk = async (codes: string[], name: string) => {
        setBulkLoading(true);
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
                fetchStatus();
            }
        } catch (err) {
            toast.error(`Failed to update ${name} status`);
        } finally {
            setBulkLoading(false);
        }
    };

    const toggleSingle = async (code: string) => {
        try {
            const res = await fetch('/api/firewall/toggle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ countryCode: code })
            });
            if (res.ok) {
                toast.success(`Updated status for ${code}`);
                fetchStatus();
            }
        } catch (err) {
            toast.error('Failed to toggle country');
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
                toast.success('Lockdown settings updated');
                fetchStatus();
            }
        } catch (err) {
            toast.error('Failed to update lockdown');
        }
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-red-500 font-mono">INITIALIZING FIREWALL...</div>;

    const isEuropeBlocked = EUROPE_CODES.every(code => blockedCountries.includes(code));
    const isUSABlocked = USA_CODES.every(code => blockedCountries.includes(code));

    return (
        <div className="min-h-screen bg-[#050505] text-white p-8 font-mono">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto space-y-8"
            >
                <div className="flex items-center justify-between border-b border-red-900/50 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-950/30 border border-red-500/50 rounded-lg shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                            <Shield className="w-8 h-8 text-red-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tighter text-red-500">SYSTEM FIREWALL v4.0</h1>
                            <p className="text-red-900 text-sm">NEXUS_CREATIVE_TECH // SECURITY_CORE</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full animate-pulse ${lockdownMode ? 'bg-red-500' : 'bg-green-500'}`} />
                        <span className="text-xs text-zinc-500 uppercase">{lockdownMode ? 'LOCKDOWN_ACTIVE' : 'SYSTEM_OPERATIONAL'}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Global Toggles */}
                    <Card className="bg-zinc-950 border-zinc-900 border-2">
                        <CardHeader>
                            <CardTitle className="text-xs text-zinc-500 flex items-center gap-2">
                                <Globe className="w-4 h-4" /> REGIONAL_PROTOCOLS
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                                <div>
                                    <p className="text-sm font-bold">EUROPE_BLOCK</p>
                                    <p className="text-[10px] text-zinc-500">50 COUNTRIES (EU/UK/NON-EU)</p>
                                </div>
                                <Switch
                                    checked={isEuropeBlocked}
                                    onCheckedChange={() => toggleBulk(EUROPE_CODES, 'Europe')}
                                    disabled={bulkLoading}
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                                <div>
                                    <p className="text-sm font-bold">USA_BLOCK</p>
                                    <p className="text-[10px] text-zinc-500">UNITED STATES DOMESTIC</p>
                                </div>
                                <Switch
                                    checked={isUSABlocked}
                                    onCheckedChange={() => toggleBulk(USA_CODES, 'USA')}
                                    disabled={bulkLoading}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Lockdown Mode */}
                    <Card className={`bg-zinc-950 border-2 transition-colors duration-500 ${lockdownMode ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.1)]' : 'border-zinc-900'}`}>
                        <CardHeader>
                            <CardTitle className="text-xs text-zinc-500 flex items-center gap-2">
                                <Lock className="w-4 h-4" /> LOCKDOWN_MODE
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between gap-4">
                                <p className="text-[11px] text-zinc-400">BLOCK ALL INBOUND TRANSMISSIONS EXCEPT AUTHENTICATED ADMIN IP</p>
                                <Switch checked={lockdownMode} onCheckedChange={setLockdownMode} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] text-zinc-500 uppercase">Whitelist_IP</label>
                                <Input
                                    value={adminIp}
                                    onChange={(e) => setAdminIp(e.target.value)}
                                    placeholder="0.0.0.0"
                                    className="bg-black border-zinc-800 text-red-400 font-mono text-xs focus:border-red-500"
                                />
                            </div>
                            <Button
                                onClick={saveLockdown}
                                className={`w-full text-xs font-bold ${lockdownMode ? 'bg-red-600 hover:bg-red-700' : 'bg-zinc-800 hover:bg-zinc-700'}`}
                            >
                                {lockdownMode ? 'EXECUTE_LOCKDOWN' : 'UPDATE_WHITELIST'}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Activity Mini Stats */}
                    <Card className="bg-zinc-950 border-zinc-900 border-2">
                        <CardHeader>
                            <CardTitle className="text-xs text-zinc-500 flex items-center gap-2">
                                <Activity className="w-4 h-4" /> CORE_METRICS
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-zinc-900/50 p-4 rounded border border-zinc-800 text-center">
                                    <p className="text-3xl font-bold text-red-500">{blockedCountries.length}</p>
                                    <p className="text-[9px] text-zinc-500">BLOCKED_REGIONS</p>
                                </div>
                                <div className="bg-zinc-900/50 p-4 rounded border border-zinc-800 text-center">
                                    <p className="text-3xl font-bold text-green-500">0</p>
                                    <p className="text-[9px] text-zinc-500">THREATS_DETERRRED</p>
                                </div>
                            </div>
                            <div className="p-3 bg-red-950/10 border border-red-900/30 rounded">
                                <p className="text-[9px] text-red-400 flex items-center gap-2 animate-pulse">
                                    <Zap className="w-3 h-3" /> SECURITY_HEURISTICS: OPTIMIZED
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Individual Country Management */}
                <Card className="bg-zinc-950 border-zinc-900 border-2">
                    <CardHeader className="border-b border-zinc-900">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xs text-zinc-500 flex items-center gap-2">
                                <Filter className="w-4 h-4" /> GRANULAR_BLOCKING
                            </CardTitle>
                            <div className="flex items-center gap-4">
                                <Select onValueChange={toggleSingle}>
                                    <SelectTrigger className="w-[280px] bg-black border-zinc-800 text-xs">
                                        <SelectValue placeholder="SELECT COUNTRY TO TOGGLE" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-black border-zinc-800 text-white max-h-[400px]">
                                        {COUNTRY_LIST.map(country => (
                                            <SelectItem key={country.code} value={country.code} className="hover:bg-red-950 cursor-pointer">
                                                {country.name} ({country.code}) {blockedCountries.includes(country.code) ? '[BLOCKED]' : ''}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-2">
                            {blockedCountries.length === 0 ? (
                                <p className="col-span-full text-center text-zinc-600 text-[10px] py-8">NO INDIVIDUAL BLOCKS ACTIVE</p>
                            ) : (
                                blockedCountries.map(code => {
                                    const country = COUNTRY_LIST.find(c => c.code === code);
                                    return (
                                        <motion.div
                                            key={code}
                                            whileHover={{ scale: 1.05 }}
                                            className="bg-red-950/20 border border-red-900/50 p-2 rounded flex flex-col items-center justify-center relative group"
                                        >
                                            <span className="text-xs font-bold text-red-500">{code}</span>
                                            <span className="text-[8px] text-zinc-500 uppercase truncate w-full text-center">{country?.name || 'Unknown'}</span>
                                            <button
                                                onClick={() => toggleSingle(code)}
                                                className="absolute inset-0 bg-red-600/90 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default Firewall;
