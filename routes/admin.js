const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

// Ruta para registrar un nuevo administrador
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validar el nombre de usuario y la contraseña
        if (username !== 'admin' || !password.endsWith('admin')) {
            return res.status(400).json({ message: 'Credenciales de administrador inválidas' });
        }
        
        // Verificar si el administrador ya existe
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
        }
        
        // Crear nuevo administrador
        const newAdmin = new Admin({
            username,
            password
        });
        
        // Guardar el administrador (la contraseña se hasheará automáticamente gracias al middleware pre-save)
        await newAdmin.save();
        
        res.status(201).json({ message: 'Administrador registrado exitosamente' });
    } catch (error) {
        console.error('Error al registrar administrador:', error);
        res.status(500).json({ message: 'Error al registrar administrador', error: error.message });
    }
});

// Ruta para el login de administrador
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Buscar el administrador en la base de datos
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        // Comparar la contraseña
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        // Si las credenciales son correctas, puedes generar un token JWT aquí si lo deseas
        // Por ahora, simplemente enviaremos un mensaje de éxito
        res.status(200).json({ message: 'Administrador logueado exitosamente' });

    } catch (error) {
        console.error('Error al loguear administrador:', error);
        res.status(500).json({ message: 'Error al loguear administrador', error: error.message });
    }
});

module.exports = router;
