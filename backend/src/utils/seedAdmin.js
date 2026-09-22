// Creates (or updates the password of) the first admin account.
// Usage: npm run seed:admin -- --email=admin@padbank.local --password=changeme --name="Admin"
require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('../config/database');

function parseArgs() {
    const args = {};
    for (const arg of process.argv.slice(2)) {
        const [key, ...rest] = arg.replace(/^--/, '').split('=');
        args[key] = rest.join('=');
    }
    return args;
}

async function main() {
    const { email = 'admin@padbank.local', password = 'admin123', name = 'Admin' } = parseArgs();

    const hash = await bcrypt.hash(password, 10);

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);

    if (existing.length > 0) {
        await pool.query('UPDATE users SET password = ?, name = ?, role = ? WHERE email = ?', [
            hash,
            name,
            'ADMIN',
            email,
        ]);
        console.log(`Updated existing admin: ${email}`);
    } else {
        await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hash, 'ADMIN']
        );
        console.log(`Created admin: ${email}`);
    }

    console.log(`Password: ${password}`);
    await pool.end();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
