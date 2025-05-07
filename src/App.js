const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

const categoriasRoutes = require('./routes/categoriasRoutes');
const platosRoutes = require('./routes/platosRoutes');
const pedidosRoutes = require('./routes/pedidosRoutes');

app.use(cors());
app.use(express.json());

app.use('/categorias', categoriasRoutes);
app.use('/platos', platosRoutes); // rutas de platos
app.use('/pedidos', pedidosRoutes); // rutas de platos

app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000');
});
