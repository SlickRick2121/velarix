import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const db = new Database(path.join(__dirname, 'firewall.db'));

console.log('--- DATABASE DIAGNOSTIC ---');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Existing Tables:', tables.map(t => t.name).join(', '));

for (const table of tables) {
    const info = db.prepare(`PRAGMA table_info(${table.name})`).all();
    console.log(`\nTable: ${table.name}`);
    console.log('Columns:', info.map(c => `${c.name} (${c.type})`).join(', '));

    const count = db.prepare(`SELECT COUNT(*) as count FROM ${table.name}`).get().count;
    console.log('Row count:', count);
}

const nlCheck = db.prepare("SELECT * FROM blocked_countries WHERE country_code = 'NL'").get();
console.log('\nNL in blocked_countries:', nlCheck ? 'YES' : 'NO');
if (nlCheck) console.log('NL Row Data:', nlCheck);

const settings = db.prepare("SELECT * FROM firewall_settings").all();
console.log('\nSettings:', settings);
