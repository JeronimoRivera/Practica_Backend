const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/propiedades', propertyRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint no encontrado' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
  });
});

module.exports = app;
