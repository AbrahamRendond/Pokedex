// Importación de módulos necesarios
const express = require('express');
const mysql = require('mysql');

// Creación de una nueva aplicación Express
const app = express();

// Configuración del servidor para servir archivos estáticos
app.use(express.static('public'));

// Configuración de la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pokedex'
});

// Establece la conexión con la base de datos
connection.connect();

// Define una ruta para obtener todos los Pokémon de la base de datos
app.get('/pokedex', (req, res) => {
  connection.query('SELECT * FROM pokemon', (error, results) => {
    if (error) throw error;
    res.json(results);  // Envía los resultados como JSON
  });
});

// Inicia el servidor en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});