const mongoose = require('mongoose');
<<<<<<< HEAD
=======
const { sanitizeInput } = require('../utils/sanitizer');
>>>>>>> 3867be8ac700160ac3b22bd2e88e764031bc370b

const productSchema = new mongoose.Schema({
  name: String,          // Nombre del producto
  description: String,   // Descripción del producto
  price: Number,        // Precio
  imageUrl: String,     // URL de la imagen
  requestedBy: String,  // Quién lo solicitó
  requestedAt: String,  // Cuándo se solicitó
  purpose: String       // Propósito/ocasión
}, {
  timestamps: true      // Añade createdAt y updatedAt
});

<<<<<<< HEAD
=======
// Middleware de pre-save para sanitizar los campos
productSchema.pre('save', function(next) {
  this.name = sanitizeInput(this.name);
  this.description = sanitizeInput(this.description);
  this.requestedBy = sanitizeInput(this.requestedBy);
  this.purpose = sanitizeInput(this.purpose);
  this.imageUrl = sanitizeInput(this.imageUrl);
  next();
});

>>>>>>> 3867be8ac700160ac3b22bd2e88e764031bc370b
module.exports = mongoose.model('Product', productSchema);
