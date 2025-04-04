const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    // Elimina etiquetas HTML
    .replace(/<[^>]*>/g, '')
    // Convierte caracteres especiales en entidades HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    // Elimina caracteres de control y otros potencialmente peligrosos
    .replace(/[^\w\s.,!?-]/gi, '');
};

module.exports = { sanitizeInput };
