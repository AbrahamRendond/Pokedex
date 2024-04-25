const express = require('express');
const mysql = require('mysql');
const app = express();
const path = require('path');

// Sirve los archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pokedex'
});

// Conectar a la base de datos
connection.connect();

// Ruta para obtener todos los Pokémon
app.get('/pokedex', (req, res) => {
  connection.query('SELECT * FROM pokemon', (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});