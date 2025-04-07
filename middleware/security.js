const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // límite de 100 solicitudes por ventana
});

// Sanitización de datos
const sanitizeData = (req, res, next) => {
    req.body = mongoSanitize(req.body);
    next();
};

// Validación básica de datos
const validateData = (req, res, next) => {
    if (req.body && Object.keys(req.body).length) {
        // Validar que no haya caracteres especiales o código malicioso
        const hasInjection = Object.values(req.body).some(value => 
            typeof value === 'string' && (
                value.includes('$') || 
                value.includes('{') ||
                value.includes('&&') ||
                value.includes('||')
            )
        );

        if (hasInjection) {
            return res.status(400).json({ error: 'Datos inválidos detectados' });
        }
    }
    next();
};

module.exports = {
    limiter,
    helmet,
    sanitizeData,
    validateData,
    mongoSanitize
};
