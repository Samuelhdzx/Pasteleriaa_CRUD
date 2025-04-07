const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Admin = require('../models/Admin');

// Middleware para verificar si el usuario es administrador
const isAdmin = async (req, res, next) => {
    const admin = await Admin.findOne({ username: 'admin' }); // Ajusta esto según tu lógica de autenticación
    if (!admin) {
        return res.status(403).json({ message: 'Acceso prohibido' });
    }
    next();
};

// Ruta para eliminar un usuario (solo accesible para administradores)
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const userId = req.params.id;
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
    }
});

module.exports = router;
