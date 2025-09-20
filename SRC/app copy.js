const express = require('express');
const path = require('path');
//Para instalar cors = npm install cors
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../public')));

//MIDDLEWARES GLOBALES
app.use(cors());
app.use(express.json());

//Importar las rutas
const tareasRoutes = require('./routes/TareasRoutes');

//Configuracion de las rutas
app.use('/api/tareas', tareasRoutes);

app.listen(PORT, ()  => {
    console.log('Servidor ejecutando todoList');
})