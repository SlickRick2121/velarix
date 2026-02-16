import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const db = new Database(path.join(__dirname, 'firewall.db'));

console.log('--- RECENT FIREWALL PATHS ---');
const accesses = db.prepare("SELECT path, timestamp, isBlocked FROM page_accesses WHERE path LIKE '%firewall%' ORDER BY timestamp DESC LIMIT 20").all();
console.table(accesses);
