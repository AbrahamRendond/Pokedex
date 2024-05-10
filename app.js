// Importación de módulos necesarios
const express = require('express');
const mysql = require('mysql');

// Creación de una nueva aplicación Express
const app = express();

const port = process.env.PORT || 3000;

const DB_HOST = process.env.DB_HOST || 'localhost'
const DB_USER = process. env. DB_USER || 'root'
const DB_PASSWORD = process. env. DB_PASSWORD || ''
const DB_NAME = process. env. DB_NAME || 'pokedex'
const DB_PORT = process.env.DB_PORT3306 || 3306

// Configuración del servidor para servir archivos estáticos
app.use(express.static('public'));

// Configuración de la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
  database: DB_NAME
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
app.listen(port, () => {
  console.log('Servidor escuchando en el puerto 3000');
});