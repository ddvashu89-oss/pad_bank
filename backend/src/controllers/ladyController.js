const pool = require('../config/database');

function maskAadhaar(aadhaar) {
    if (!aadhaar || aadhaar.length < 4) return aadhaar;
    const last4 = aadhaar.slice(-4);
    return `XXXX-XXXX-${last4}`;
}

async function listLadies(req, res) {
    const { search } = req.query;

    let sql = 'SELECT id, aadhaar, name, mobile, address, created_at FROM ladies';
    const params = [];

    if (search) {
        sql += ' WHERE name LIKE ? OR aadhaar LIKE ?';
        params.push(`%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY name ASC';

    const [rows] = await pool.query(sql, params);
    const ladies = rows.map((l) => ({ ...l, aadhaarMasked: maskAadhaar(l.aadhaar) }));
    res.json(ladies);
}

async function searchByAadhaar(req, res) {
    const { aadhaar } = req.query;
    if (!aadhaar) {
        return res.status(400).json({ message: 'aadhaar query parameter is required' });
    }

    const [rows] = await pool.query(
        'SELECT id, aadhaar, name, mobile, address FROM ladies WHERE aadhaar = ?',
        [aadhaar]
    );

    const lady = rows[0];
    if (!lady) {
        return res.status(404).json({ message: 'No lady found with this Aadhaar number' });
    }

    res.json({ ...lady, aadhaarMasked: maskAadhaar(lady.aadhaar) });
}

async function getLady(req, res) {
    const { id } = req.params;

    const [ladyRows] = await pool.query(
        'SELECT id, aadhaar, name, mobile, address, created_at FROM ladies WHERE id = ?',
        [id]
    );
    const lady = ladyRows[0];
    if (!lady) {
        return res.status(404).json({ message: 'Lady not found' });
    }

    const [history] = await pool.query(
        `SELECT id, quantity, distribution_date, created_at
         FROM pad_distribution
         WHERE lady_id = ?
         ORDER BY distribution_date DESC`,
        [id]
    );

    const totalPadsReceived = history.reduce((sum, row) => sum + row.quantity, 0);

    res.json({
        ...lady,
        aadhaarMasked: maskAadhaar(lady.aadhaar),
        totalDistributions: history.length,
        totalPadsReceived,
        history,
    });
}

async function createLady(req, res) {
    const { aadhaar, name, mobile, address } = req.body;

    if (!aadhaar || !name) {
        return res.status(400).json({ message: 'Aadhaar and name are required' });
    }

    const [existing] = await pool.query('SELECT id FROM ladies WHERE aadhaar = ?', [aadhaar]);
    if (existing.length > 0) {
        return res.status(409).json({ message: 'This lady is already registered.' });
    }

    const [result] = await pool.query(
        'INSERT INTO ladies (aadhaar, name, mobile, address) VALUES (?, ?, ?, ?)',
        [aadhaar, name, mobile || null, address || null]
    );

    res.status(201).json({
        id: result.insertId,
        aadhaar,
        name,
        mobile: mobile || null,
        address: address || null,
    });
}

async function updateLady(req, res) {
    const { id } = req.params;
    const { name, mobile, address } = req.body;

    const [existing] = await pool.query('SELECT id FROM ladies WHERE id = ?', [id]);
    if (existing.length === 0) {
        return res.status(404).json({ message: 'Lady not found' });
    }

    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
    }

    await pool.query(
        'UPDATE ladies SET name = ?, mobile = ?, address = ? WHERE id = ?',
        [name, mobile || null, address || null, id]
    );

    res.json({ id: Number(id), name, mobile: mobile || null, address: address || null });
}

module.exports = { listLadies, searchByAadhaar, getLady, createLady, updateLady };
