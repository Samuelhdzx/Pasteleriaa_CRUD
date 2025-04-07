const express = require('express');
const mongoose = require('mongoose');
const pastelRoutes = require('./routes/pastel.routes');
const authRoutes = require('./routes/auth.routes');
const cookieParser = require('cookie-parser');
const { limiter, helmet, sanitizeData, validateData, mongoSanitize } = require('./middleware/security');
const cors = require('cors');
const logger = require('./config/logger');
require('dotenv').config();

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

// Configuración adicional de seguridad
app.disable('x-powered-by');
mongoose.set('strictQuery', true);

// Middleware
app.use(express.json()); // Para manejar JSON
app.use(express.urlencoded({ extended: true })); // Para manejar formularios
app.use(cookieParser()); // Para manejar cookies

// Configuración de CORS
const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Logger para solicitudes HTTP
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// Aplicar middlewares de seguridad
app.use(helmet());
app.use(limiter);
app.use(mongoSanitize());
app.use(sanitizeData);
app.use(validateData);

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/pasteles', pastelRoutes);

// Manejo de errores centralizado
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send('¡Algo salió mal!');
});

// Servidor escuchando
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
