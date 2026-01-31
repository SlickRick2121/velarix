import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, '..', 'firewall.db'));

// Ensure table exists
db.exec(`
  CREATE TABLE IF NOT EXISTS blocked_countries (
    country_code TEXT PRIMARY KEY,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

const europeanCountries = [
    'AD', 'AL', 'AT', 'AX', 'BA', 'BE', 'BG', 'BY', 'CH', 'CY', 'CZ', 'DE', 'DK', 'EE',
    'ES', 'FI', 'FO', 'FR', 'GB', 'GE', 'GI', 'GR', 'HR', 'HU', 'IE', 'IS', 'IT', 'LI',
    'LT', 'LU', 'LV', 'MC', 'MD', 'ME', 'MK', 'MT', 'NL', 'NO', 'PL', 'PT', 'RO', 'RS',
    'RU', 'SE', 'SI', 'SK', 'SM', 'TR', 'UA', 'VA'
];

const insert = db.prepare('INSERT OR IGNORE INTO blocked_countries (country_code) VALUES (?)');

const blockEurope = db.transaction((countries) => {
    for (const code of countries) {
        insert.run(code);
    }
});

blockEurope(europeanCountries);

console.log(`Successfully blocked ${europeanCountries.length} European countries.`);
const count = db.prepare('SELECT COUNT(*) as count FROM blocked_countries').get();
console.log(`Total blocked countries: ${count.count}`);
