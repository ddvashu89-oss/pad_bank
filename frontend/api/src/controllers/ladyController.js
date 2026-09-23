const pool = require('../config/database');

const LADY_COLUMNS =
    'id, aadhaar, name, marital_status, father_name, husband_name, mobile, address, created_at';

function maskAadhaar(aadhaar) {
    if (!aadhaar || aadhaar.length < 4) return aadhaar;
    const last4 = aadhaar.slice(-4);
    return `XXXX-XXXX-${last4}`;
}

function isValidAadhaar(aadhaar) {
    return /^\d{12}$/.test(aadhaar);
}

function validateFamilyInfo({ maritalStatus, fatherName, husbandName }) {
    if (maritalStatus !== 'MARRIED' && maritalStatus !== 'UNMARRIED') {
        return 'Marital status must be either MARRIED or UNMARRIED';
    }
    if (maritalStatus === 'MARRIED' && !husbandName) {
        return "Husband's name is required for a married lady";
    }
    if (maritalStatus === 'UNMARRIED' && !fatherName) {
        return "Father's name is required for an unmarried lady";
    }
    return null;
}

async function listLadies(req, res) {
    const { search } = req.query;

    let sql = `SELECT ${LADY_COLUMNS} FROM ladies`;
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

    const [rows] = await pool.query(`SELECT ${LADY_COLUMNS} FROM ladies WHERE aadhaar = ?`, [aadhaar]);

    const lady = rows[0];
    if (!lady) {
        return res.status(404).json({ message: 'No lady found with this Aadhaar number' });
    }

    res.json({ ...lady, aadhaarMasked: maskAadhaar(lady.aadhaar) });
}

async function getLady(req, res) {
    const { id } = req.params;

    const [ladyRows] = await pool.query(`SELECT ${LADY_COLUMNS} FROM ladies WHERE id = ?`, [id]);
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
    const { aadhaar, name, maritalStatus, fatherName, husbandName, mobile, address } = req.body;

    if (!aadhaar || !name) {
        return res.status(400).json({ message: 'Aadhaar and name are required' });
    }

    if (!isValidAadhaar(aadhaar)) {
        return res.status(400).json({ message: 'Aadhaar number must be exactly 12 digits' });
    }

    const familyInfoError = validateFamilyInfo({ maritalStatus, fatherName, husbandName });
    if (familyInfoError) {
        return res.status(400).json({ message: familyInfoError });
    }

    const [existing] = await pool.query('SELECT id FROM ladies WHERE aadhaar = ?', [aadhaar]);
    if (existing.length > 0) {
        return res.status(409).json({ message: 'This lady is already registered.' });
    }

    const husbandNameToStore = maritalStatus === 'MARRIED' ? husbandName : null;
    const fatherNameToStore = maritalStatus === 'UNMARRIED' ? fatherName : null;

    const [result] = await pool.query(
        `INSERT INTO ladies (aadhaar, name, marital_status, father_name, husband_name, mobile, address)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [aadhaar, name, maritalStatus, fatherNameToStore, husbandNameToStore, mobile || null, address || null]
    );

    res.status(201).json({
        id: result.insertId,
        aadhaar,
        name,
        maritalStatus,
        fatherName: fatherNameToStore,
        husbandName: husbandNameToStore,
        mobile: mobile || null,
        address: address || null,
    });
}

async function updateLady(req, res) {
    const { id } = req.params;
    const { aadhaar, name, maritalStatus, fatherName, husbandName, mobile, address } = req.body;

    const [existing] = await pool.query('SELECT id, aadhaar FROM ladies WHERE id = ?', [id]);
    if (existing.length === 0) {
        return res.status(404).json({ message: 'Lady not found' });
    }

    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
    }

    const familyInfoError = validateFamilyInfo({ maritalStatus, fatherName, husbandName });
    if (familyInfoError) {
        return res.status(400).json({ message: familyInfoError });
    }

    const nextAadhaar = aadhaar || existing[0].aadhaar;
    if (!isValidAadhaar(nextAadhaar)) {
        return res.status(400).json({ message: 'Aadhaar number must be exactly 12 digits' });
    }

    if (nextAadhaar !== existing[0].aadhaar) {
        const [conflict] = await pool.query('SELECT id FROM ladies WHERE aadhaar = ? AND id != ?', [
            nextAadhaar,
            id,
        ]);
        if (conflict.length > 0) {
            return res.status(409).json({ message: 'This Aadhaar number is already registered to another lady.' });
        }
    }

    const husbandNameToStore = maritalStatus === 'MARRIED' ? husbandName : null;
    const fatherNameToStore = maritalStatus === 'UNMARRIED' ? fatherName : null;

    await pool.query(
        `UPDATE ladies
         SET aadhaar = ?, name = ?, marital_status = ?, father_name = ?, husband_name = ?, mobile = ?, address = ?
         WHERE id = ?`,
        [nextAadhaar, name, maritalStatus, fatherNameToStore, husbandNameToStore, mobile || null, address || null, id]
    );

    res.json({
        id: Number(id),
        aadhaar: nextAadhaar,
        name,
        maritalStatus,
        fatherName: fatherNameToStore,
        husbandName: husbandNameToStore,
        mobile: mobile || null,
        address: address || null,
    });
}

async function deleteLady(req, res) {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT id FROM ladies WHERE id = ?', [id]);
    if (existing.length === 0) {
        return res.status(404).json({ message: 'Lady not found' });
    }

    const [[{ distributionCount }]] = await pool.query(
        'SELECT COUNT(*) AS distributionCount FROM pad_distribution WHERE lady_id = ?',
        [id]
    );
    if (distributionCount > 0) {
        return res.status(409).json({
            message: `Cannot delete — this lady has ${distributionCount} distribution record(s). Ladies with distribution history can't be deleted, to preserve the audit trail.`,
        });
    }

    await pool.query('DELETE FROM ladies WHERE id = ?', [id]);
    res.json({ message: 'Lady deleted' });
}

module.exports = { listLadies, searchByAadhaar, getLady, createLady, updateLady, deleteLady };
