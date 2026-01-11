const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const { generateToken, generateRefreshToken, verifyRefreshToken } = require('../utils/authUtils');

const register = async (req, res) => {
    try {
        const { email, password, fullName } = req.body;

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            email,
            password_hash: hashedPassword,
            full_name: fullName,
            role: 'admin'
        });

        const token = generateToken(newUser);
        const refreshToken = generateRefreshToken(newUser);

        delete newUser.password_hash;

        res.status(201).json({
            message: 'User registered successfully',
            user: newUser,
            token,
            refreshToken
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        await User.updateLastLogin(user.id);

        const token = generateToken(user);
        const refreshToken = generateRefreshToken(user);

        delete user.password_hash;

        res.json({
            message: 'Login successful',
            user,
            token,
            refreshToken
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        delete user.password_hash;
        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const logout = async (req, res) => {
    res.json({ message: 'Logged out successfully' });
};

const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ error: 'No refresh token provided' });

    const userPayload = verifyRefreshToken(refreshToken);
    if (!userPayload) return res.status(403).json({ error: 'Invalid refresh token' });

    const user = await User.findById(userPayload.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newToken = generateToken(user);
    res.json({ token: newToken });
};

module.exports = {
    register,
    login,
    getMe,
    logout,
    refreshToken
};
