const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Registro
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).render('error', { message: 'Username y password son requeridos' });
        }
        const user = new User({ username, password });
        await user.save();
        res.status(201).redirect('/'); // Redirigir al login después del registro
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).render('error', { message: 'El username ya está en uso' });
        } else {
            res.status(400).render('error', { message: 'Error al registrar usuario' });
        }
    }
});

// Inicio de sesión
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).render('error', { message: 'Username y password son requeridos' });
        }
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).render('error', { message: 'Credenciales inválidas' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Guardar el token en una cookie HTTP
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/dashboard'); // Redirigir al dashboard
    } catch (error) {
        res.status(500).render('error', { message: 'Error al iniciar sesión' });
    }
});

// Cerrar sesión
router.post('/logout', (req, res) => {
    res.clearCookie('token'); // Limpiar la cookie del token
    res.redirect('/'); // Redirigir al login
});

module.exports = router;
