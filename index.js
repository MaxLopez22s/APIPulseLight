// PulseLight API - Backend Express + MongoDB Atlas

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB Atlas'))
.catch(err => console.error('Error al conectar con MongoDB:', err));

// Esquema y Modelo de datos
const pulselightSchema = new mongoose.Schema({
  bpm: Number,
  lux: Number,
  ambiente: String,
  timestamp: Number,
  fecha: { type: Date, default: Date.now }
});

const PulselightDato = mongoose.model('PulselightDato', pulselightSchema);

// Ruta para recibir datos desde el smartphone
app.post('/api/datos', async (req, res) => {
  try {
    const { bpm, lux, ambiente, timestamp } = req.body;
    const nuevoDato = new PulselightDato({ bpm, lux, ambiente, timestamp });
    await nuevoDato.save();
    res.status(201).json({ mensaje: 'Dato guardado correctamente' });
  } catch (error) {
    console.error('Error al guardar:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Ruta para obtener todos los datos guardados
app.get('/api/datos', async (req, res) => {
  try {
    const datos = await PulselightDato.find().sort({ fecha: -1 });
    res.json(datos);
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
