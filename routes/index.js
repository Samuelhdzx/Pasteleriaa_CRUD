const express = require('express');
const jwt = require('jsonwebtoken');
const Bakery = require('../models/Bakery');
const router = express.Router();

// Middleware para verificar el token
function authenticateToken(req, res, next) {
    const token = req.cookies.token; // Obtén el token desde las cookies
    if (!token) {
        return res.redirect('/'); // Redirige al login si no hay token
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.redirect('/'); // Redirige al login si el token es inválido
        }
        req.user = user; // Almacena los datos del usuario en la solicitud
        next();
    });
}

// Ruta principal que muestra el formulario de login
router.get('/', (req, res) => {
    res.render('login'); // Renderiza la vista 'login.ejs'
});

// Ruta para mostrar el formulario de registro
router.get('/register', (req, res) => {
    res.render('register'); // Renderiza la vista 'register.ejs'
});

// Ruta para el dashboard (protegida)
router.get('/dashboard', authenticateToken, async (req, res) => {
    try {
        const bakeries = await Bakery.find({ owner: req.user.id }); // Obtén las pastelerías del usuario
        if (bakeries.length === 0) {
            return res.redirect('/pasteles'); // Redirige a "Gestionar Pasteles" si no hay pastelerías
        }
        res.redirect(`/pasteles/${bakeries[0]._id}`); // Redirige a la primera pastelería para gestionar pasteles
    } catch (error) {
        res.status(500).render('error', { message: 'Error al cargar el dashboard' });
    }
});

// Ruta para el CRUD de pasteles (protegida)
router.get('/dashboard/pasteles', authenticateToken, (req, res) => {
    res.render('pasteles'); // Renderiza la vista 'pasteles.ejs'
});

module.exports = router;
