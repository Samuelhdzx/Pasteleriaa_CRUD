const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Pastel = require('../models/pastel.model');
const Bakery = require('../models/Bakery');
const jwt = require('jsonwebtoken');

// Configuración de multer para subir imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Middleware para autenticar al usuario
function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: 'Por favor autentícate' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }
        req.user = user;
        next();
    });
}

// Aplicar el middleware de autenticación a todas las rutas
router.use(authenticateToken);

// Obtener todos los pasteles de una pastelería específica
router.get('/:bakeryId', async (req, res) => {
    try {
        const { bakeryId } = req.params;
        const bakery = await Bakery.findOne({ _id: bakeryId, owner: req.user.id });
        if (!bakery) {
            return res.status(404).send('Pastelería no encontrada o no autorizada');
        }
        const pasteles = await Pastel.find({ bakery: bakeryId });
        res.render('product', { pasteles, bakery });
    } catch (error) {
        res.status(500).send('Error al cargar los pasteles');
    }
});

// Mostrar detalles de un pastel
router.get('/:bakeryId/:pastelId', async (req, res) => {
    try {
        const { bakeryId, pastelId } = req.params;
        const bakery = await Bakery.findOne({ _id: bakeryId, owner: req.user.id });
        if (!bakery) {
            return res.status(404).send('Pastelería no encontrada o no autorizada');
        }
        const pastel = await Pastel.findOne({ _id: pastelId, bakery: bakeryId });
        if (!pastel) {
            return res.status(404).send('Pastel no encontrado');
        }
        res.render('pastelDetails', { pastel, bakery });
    } catch (error) {
        res.status(500).send('Error al cargar los detalles del pastel');
    }
});

// Mostrar formulario para editar un pastel
router.get('/:bakeryId/:pastelId/edit', async (req, res) => {
    try {
        const { bakeryId, pastelId } = req.params;
        const bakery = await Bakery.findOne({ _id: bakeryId, owner: req.user.id });
        if (!bakery) {
            return res.status(404).send('Pastelería no encontrada o no autorizada');
        }
        const pastel = await Pastel.findOne({ _id: pastelId, bakery: bakeryId });
        if (!pastel) {
            return res.status(404).send('Pastel no encontrado');
        }
        res.render('editPastel', { pastel, bakery });
    } catch (error) {
        res.status(500).send('Error al cargar el formulario de edición');
    }
});

// Crear un nuevo pastel en una pastelería específica
router.post('/:bakeryId', upload.single('imageFile'), async (req, res) => {
    try {
        const { bakeryId } = req.params;
        const bakery = await Bakery.findOne({ _id: bakeryId, owner: req.user.id });
        if (!bakery) {
            return res.status(404).json({ error: 'Pastelería no encontrada o no autorizada' });
        }
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl; // Generar la URL de la imagen
        const pastel = new Pastel({
            ...req.body,
            bakery: bakeryId,
            user: req.user.id,
            imageUrl
        });
        await pastel.save();
        res.redirect(`/pasteles/${bakeryId}`);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Actualizar un pastel
router.post('/:bakeryId/:pastelId/edit', upload.single('imageFile'), async (req, res) => {
    try {
        const { bakeryId, pastelId } = req.params;
        const bakery = await Bakery.findOne({ _id: bakeryId, owner: req.user.id });
        if (!bakery) {
            return res.status(404).json({ error: 'Pastelería no encontrada o no autorizada' });
        }
        const updateData = {
            ...req.body,
            imageUrl: req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl // Actualizar la URL de la imagen
        };
        const pastel = await Pastel.findOneAndUpdate(
            { _id: pastelId, bakery: bakeryId },
            updateData,
            { new: true }
        );
        if (!pastel) {
            return res.status(404).json({ error: 'Pastel no encontrado' });
        }
        res.redirect(`/pasteles/${bakeryId}`);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Eliminar un pastel
router.post('/:bakeryId/:pastelId/delete', async (req, res) => {
    try {
        const { bakeryId, pastelId } = req.params;
        const bakery = await Bakery.findOne({ _id: bakeryId, owner: req.user.id });
        if (!bakery) {
            return res.status(404).json({ error: 'Pastelería no encontrada o no autorizada' });
        }
        const pastel = await Pastel.findOneAndDelete({ _id: pastelId, bakery: bakeryId });
        if (!pastel) {
            return res.status(404).json({ error: 'Pastel no encontrado' });
        }
        res.redirect(`/pasteles/${bakeryId}`);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
