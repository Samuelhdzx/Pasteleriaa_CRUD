const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.isAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token recibido:', token);_SECRET);
        console.log('Datos decodificados:', decoded);        if (!decoded) {
        const user = await User.findById(decoded.userId);sage: 'Invalid token' });

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Admin rights required' });        // Buscar el usuario en la base de datos
        }it User.findById(decoded.userId);
er || user.role !== 'admin') {
        req.user = user;s.status(403).json({ message: 'Access denied: Admin rights required' });
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });      req.user = user;
    }        next();


};    }        res.status(401).json({ message: 'Invalid token' });        console.error('Error in isAdmin middleware:', error.message);
};    } catch (error) {