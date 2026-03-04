const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users } = require('../models/db');

const JWT_SECRET = 'super_secret_key_for_mvp';

//default admin account
if (!users.find(u => u.username === 'alex')) {
    const defaultPassword = bcrypt.hashSync('alex', 10);
    users.push({ id: 1, username: 'alex', password: defaultPassword });
}

exports.register = async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now(), username, password: hashedPassword };
    users.push(newUser);
    res.status(201).json({ message: 'User registered successfully' });
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, username: user.username });
};