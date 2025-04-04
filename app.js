const express = require('express');
const mongoose = require('mongoose');
const pastelRoutes = require('./routes/pastel.routes');
const authRoutes = require('./routes/auth.routes');
const cookieParser = require('cookie-parser');

const app = express();

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/pasteleria', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log('Conectado a MongoDB');
}).catch(err => {
    console.error('Error al conectar a MongoDB:', err);
});

// Middleware
app.use(express.json()); // Para manejar JSON
app.use(express.urlencoded({ extended: true })); // Para manejar formularios
app.use(cookieParser()); // Para manejar cookies

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/pasteles', pastelRoutes);

// Servidor escuchando
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
