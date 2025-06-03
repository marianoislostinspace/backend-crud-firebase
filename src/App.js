const express = require('express');
const cors = require('cors');
const http = require('http');         // Para crear el servidor HTTP
const { Server } = require('socket.io'); // Para WebSocket con Socket.IO
require('dotenv').config();

const app = express();

const categoriasRoutes = require('./routes/categoriasRoutes');
const platosRoutes = require('./routes/platosRoutes');
const opcionesRoutes = require('./routes/platosOpciones');

// Aquí importamos la función que recibe io y retorna el router
const pedidosRoutes = require('./routes/pedidosRoutes');

app.use(cors());
app.use(express.json());

// Rutas que no usan io
app.use('/categorias', categoriasRoutes);
app.use('/platos', platosRoutes);
app.use('/opciones', opcionesRoutes);

// Crear servidor HTTP para socket.io
const server = http.createServer(app);

// Inicializar socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // o la URL de tu front
    methods: ['GET', 'POST'],
  }
});

// Montar rutas que necesitan io
app.use('/pedidos', pedidosRoutes(io));

// Escuchar conexiones socket.io
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado: ' + socket.id);

  socket.on('disconnect', () => {
    console.log('Cliente desconectado: ' + socket.id);
  });
});

// Levantar servidor en puerto 3000
server.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000');
});
