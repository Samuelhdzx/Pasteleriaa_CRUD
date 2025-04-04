const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware para autenticar al usuario
function authenticateToken(req, res, next) {
    const token = req.cookies.token; // Obtén el token desde las cookies
    if (!token) return res.redirect('/'); // Redirige al login si no hay token

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.redirect('/'); // Redirige al login si el token es inválido
        req.user = user;
        next();
    });
}

module.exports = router;
