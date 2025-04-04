const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const indexRoutes = require('./routes/index');
const bakeryRoutes = require('./routes/bakery');
const pastelRoutes = require('./routes/pastel.routes');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware para servir archivos estáticos desde la carpeta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.set('view engine', 'ejs');
app.use(express.json());

// Middleware para cookies
app.use(cookieParser());

// Verificar JWT_SECRET
if (!process.env.JWT_SECRET) {
  console.error('Error: JWT_SECRET no está definido en el archivo .env');
  process.exit(1);
}

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'CRUDCS'
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

// Routes
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/bakery', bakeryRoutes);
app.use('/pasteles', pastelRoutes);
app.use('/dashboard/pasteles', pastelRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
