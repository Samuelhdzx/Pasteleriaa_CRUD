const mongoose = require('mongoose');

const bakerySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Relación con el usuario
});

module.exports = mongoose.model('Bakery', bakerySchema);
