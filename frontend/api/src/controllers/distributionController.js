const pool = require('../config/database');
const { getStockTotals } = require('../utils/stock');

async function listDistributions(req, res) {
    const { from, to } = req.query;

    let sql = `
        SELECT d.id, d.lady_id, d.quantity, d.distribution_date, d.created_at,
               l.name AS ladyName, l.aadhaar
        FROM pad_distribution d
        JOIN ladies l ON l.id = d.lady_id
        WHERE 1 = 1
    `;
    const params = [];

    if (from) {
        sql += ' AND d.distribution_date >= ?';
        params.push(from);
    }
    if (to) {
        sql += ' AND d.distribution_date <= ?';
        params.push(to);
    }

    sql += ' ORDER BY d.distribution_date DESC, d.id DESC';

    const [rows] = await pool.query(sql, params);
    res.json(rows);
}

async function getDistribution(req, res) {
    const { id } = req.params;

    const [rows] = await pool.query(
        `SELECT d.id, d.lady_id, d.quantity, d.distribution_date, d.created_at,
                l.name AS ladyName, l.aadhaar
         FROM pad_distribution d
         JOIN ladies l ON l.id = d.lady_id
         WHERE d.id = ?`,
        [id]
    );

    const distribution = rows[0];
    if (!distribution) {
        return res.status(404).json({ message: 'Distribution record not found' });
    }

    res.json(distribution);
}

async function createDistribution(req, res) {
    const { ladyId, quantity, distributionDate } = req.body;
    const qty = Number(quantity);

    if (!ladyId) {
        return res.status(400).json({ message: 'ladyId is required' });
    }
    if (!Number.isInteger(qty) || qty <= 0) {
        return res.status(400).json({ message: 'Quantity must be a positive whole number' });
    }
    if (!distributionDate) {
        return res.status(400).json({ message: 'distributionDate is required' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [ladyRows] = await connection.query('SELECT id FROM ladies WHERE id = ?', [ladyId]);
        if (ladyRows.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Lady not found' });
        }

        const totals = await getStockTotals(connection);
        if (qty > totals.available) {
            await connection.rollback();
            return res.status(400).json({
                message: `Insufficient stock. Only ${totals.available} pads available.`,
            });
        }

        const [result] = await connection.query(
            'INSERT INTO pad_distribution (lady_id, quantity, distribution_date, created_by) VALUES (?, ?, ?, ?)',
            [ladyId, qty, distributionDate, req.user.id]
        );

        await connection.commit();

        const newTotals = await getStockTotals();

        res.status(201).json({
            id: result.insertId,
            ladyId: Number(ladyId),
            quantity: qty,
            distributionDate,
            ...newTotals,
        });
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
}

module.exports = { listDistributions, getDistribution, createDistribution };
