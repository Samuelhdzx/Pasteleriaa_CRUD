const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    console.log('Solicitud recibida en /register'); // Mensaje de depuración
    try {
        console.log('Datos recibidos:', req.body); // Verifica los datos recibidos
        const user = new User(req.body);
        await user.save();
        console.log('Usuario registrado:', user); // Confirma que el usuario fue guardado
        const token = jwt.sign({ userId: user._id }, 'secretkey');
        res.status(201).json({ token });
    } catch (error) {
        console.error('Error en /register:', error.message); // Mensaje de error
        res.status(400).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error('Contraseña incorrecta');
        }
        const token = jwt.sign({ userId: user._id }, 'secretkey');
        res.cookie('token', token, { httpOnly: true }); // Guardar el token en una cookie
        res.redirect('/index'); // Redirigir al CRUD
    } catch (error) {
        res.status(400).send('Credenciales incorrectas');
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('token'); // Limpiar la cookie del token
    res.redirect('/login');
});

module.exports = router;
