const mongoose = require('mongoose');

const pastelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    bakery: { type: mongoose.Schema.Types.ObjectId, ref: 'Bakery', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    deliveryDate: { type: Date } // Nuevo campo para la fecha de entrega
});

module.exports = mongoose.model('Pastel', pastelSchema);
