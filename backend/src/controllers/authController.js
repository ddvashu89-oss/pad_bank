const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const [rows] = await pool.query(
        'SELECT id, name, email, password, role, status FROM users WHERE email = ?',
        [email]
    );

    const user = rows[0];
    if (!user || !user.status) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
}

async function me(req, res) {
    res.json({ user: req.user });
}

async function logout(req, res) {
    // JWTs are stateless — the client discards the token. Nothing to invalidate server-side in V1.
    res.json({ message: 'Logged out' });
}

module.exports = { login, me, logout };
