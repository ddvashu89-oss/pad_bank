const pool = require('../config/database');
const { getStockTotals } = require('../utils/stock');

async function listStock(req, res) {
    const [rows] = await pool.query(
        `SELECT s.id, s.quantity, s.note, s.created_at, u.name AS createdByName
         FROM pad_stock s
         LEFT JOIN users u ON u.id = s.created_by
         ORDER BY s.created_at DESC`
    );
    res.json(rows);
}

async function addStock(req, res) {
    const { quantity, note } = req.body;
    const qty = Number(quantity);

    if (!Number.isInteger(qty) || qty <= 0) {
        return res.status(400).json({ message: 'Quantity must be a positive whole number' });
    }

    const [result] = await pool.query(
        'INSERT INTO pad_stock (quantity, note, created_by) VALUES (?, ?, ?)',
        [qty, note || null, req.user.id]
    );

    const totals = await getStockTotals();

    res.status(201).json({
        id: result.insertId,
        quantity: qty,
        note: note || null,
        ...totals,
    });
}

module.exports = { listStock, addStock };
