import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'analytics.sqlite');
const db = new Database(dbPath);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

const initialTables = [
    {
        name: 'page_accesses',
        sql: `CREATE TABLE IF NOT EXISTS page_accesses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            path TEXT NOT NULL,
            method TEXT DEFAULT 'GET',
            ip TEXT,
            country TEXT,
            countryCode TEXT,
            region TEXT,
            regionName TEXT,
            city TEXT,
            zip TEXT,
            lat REAL,
            lon REAL,
            isp TEXT,
            org TEXT,
            asName TEXT,
            userAgent TEXT,
            referrer TEXT,
            hostname TEXT,
            isBlocked INTEGER DEFAULT 0,
            proxy INTEGER DEFAULT 0,
            hosting INTEGER DEFAULT 0,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`
    },
    {
        name: 'firewall_settings',
        sql: `CREATE TABLE IF NOT EXISTS firewall_settings (
            key TEXT PRIMARY KEY,
            value TEXT
        )`
    },
    {
        name: 'blocked_countries',
        sql: `CREATE TABLE IF NOT EXISTS blocked_countries (
            countryCode TEXT PRIMARY KEY,
            countryName TEXT,
            status INTEGER DEFAULT 1,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`
    }
];

// Initialize Tables
initialTables.forEach(table => {
    try {
        db.prepare(table.sql).run();
    } catch (err) {
        console.error(`Error creating table ${table.name}:`, err.message);
    }
});

// Seed default settings if empty
const seedSettings = () => {
    const defaultSettings = {
        'lockdown_active': '0',
        'europe_block': '0',
        'usa_block': '0',
        'admin_ip': ''
    };

    const insert = db.prepare('INSERT OR IGNORE INTO firewall_settings (key, value) VALUES (?, ?)');
    Object.entries(defaultSettings).forEach(([key, value]) => {
        insert.run(key, value);
    });
};

seedSettings();

console.log('[Database] SQLite initialized successfully');

export default db;
