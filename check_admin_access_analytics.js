import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const db = new Database(path.join(__dirname, 'server', 'db', 'data', 'analytics.sqlite'));

console.log('--- RECENT ADMIN ACCESSES (ANALYTICS) ---');
const adminAccesses = db.prepare("SELECT * FROM page_accesses WHERE path LIKE '%adminperm%' ORDER BY timestamp DESC LIMIT 10").all();
console.table(adminAccesses);
