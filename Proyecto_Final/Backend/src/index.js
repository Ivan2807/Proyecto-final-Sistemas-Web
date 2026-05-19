const PORT = process.env.PORT || 3001;

const expres = require('express');
const cors = require('cors');

const app = expres();
const port = 3000;

//Rutas
const juegosApi = require('./routes/JuegosApi.js');
const {creaciondeTablas} = require('../Db/db.js');

//Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));
app.use(expres.json());

//Rutas
app.use('/api/juegos', juegosApi);

//Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    error: 'Error interno del servidor',
    detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});
//Iniciar el servidor
const iniciar = async () => {
  await creaciondeTablas();
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
};

iniciar();