# Documentación del Proyecto Pokédex

## Tutoriales

### Cómo configurar tu entorno de desarrollo para la Pokédex

Este tutorial guía a los desarrolladores a través de la configuración inicial necesaria para comenzar a trabajar en el proyecto Pokédex.

#### Requisitos Previos
- Node.js y npm: Asegúrate de que ambos estén instalados en tu sistema.
- MySQL: Deberás tener MySQL instalado para gestionar la base de datos.

#### Pasos para la configuración
1. **Instalación de Node.js y npm:**
   - Descarga e instala Node.js desde su [página oficial](https://nodejs.org/).
   - Verifica la instalación con `node -v` y `npm -v` en tu terminal.

2. **Clonación del repositorio:**
   - Utiliza `git clone https://github.com/AbrahamRendond/Pokedex.git` para obtener una copia local del proyecto.

3. **Instalación de dependencias:**
   - Navega a la carpeta del proyecto y ejecuta `npm install` para instalar las dependencias necesarias para el proyecto.

4. **Configuración de la base de datos:**
   - Configura las credenciales de acceso a MySQL según las definiciones en el archivo `app.js`.
   - Asegúrate de crear la base de datos y las tablas necesarias conforme a los scripts SQL proporcionados.

5. **Ejecución del servidor:**
   - Inicia el servidor con `node app.js` y navega a `http://localhost:3000` para ver el proyecto en acción.

## Guías prácticas

### Cómo añadir una nueva ruta API para Pokémon

Esta guía práctica muestra cómo expandir la funcionalidad de la API al añadir una nueva ruta que permita obtener detalles específicos de un Pokémon por su ID.

1. **Modificar `app.js`:**
   - Añade una ruta nueva en el archivo `app.js`. Por ejemplo:
     ```javascript
     app.get('/pokedex/:id', (req, res) => {
       const id = req.params.id;
       connection.query('SELECT * FROM pokemon WHERE id = ?', [id], (error, results) => {
         if (error) throw error;
         res.json(results);
       });
     });
     ```

2. **Crear la consulta SQL:**
   - La consulta SQL dentro de la nueva ruta debe estar diseñada para buscar un Pokémon específico utilizando su ID como parámetro.

3. **Enviar la respuesta:**
   - Configura la respuesta para enviar los datos del Pokémon en formato JSON, asegurando que se manejen correctamente los errores.

4. **Probar la ruta:**
   - Utiliza herramientas como Postman para asegurarte de que la ruta funciona correctamente y devuelve los datos esperados.

## Explicaciones

### Estructura y Funcionalidad de `index.html`

El archivo `index.html` es la columna vertebral de la interfaz de usuario para la Pokédex. Define la estructura básica de la página, incluyendo la barra de búsqueda, botón de modo oscuro, y el área donde se muestran las tarjetas de Pokémon. Utiliza Bootstrap para un diseño responsivo y hace uso de varias librerías como Echarts para gráficos y jQuery para manipulación del DOM.

### Funcionalidad de `scripts.js`

Este archivo contiene la lógica principal de la interactividad de la página. Hace peticiones a la API para recuperar los datos de los Pokémon y los renderiza en la página utilizando el DOM. Gestiona eventos como clics en tarjetas, búsqueda de Pokémon, y el cambio del modo oscuro.

### Estilos con `styles.css`

El archivo `styles.css` define todos los estilos específicos para la Pokédex, ajustando la apariencia visual de la interfaz de usuario. Esto incluye los estilos para las tarjetas de Pokémon, modales de detalle, y la barra de búsqueda, asegurando que la interfaz sea intuitiva y estéticamente agradable.

## Referencias

### Referencia de la API

Documentación detallada de cada endpoint de la API, proporcionando una referencia útil para desarrolladores que trabajan con la Pokédex.

- **GET `/pokedex`:**
  - Descripción: Devuelve un listado completo de todos los Pokémon en la base de datos.
  - Ejemplo de uso: `curl http://localhost:3000/pokedex`

- **GET `/pokedex/:id`:**
  - Descripción: Devuelve detalles específicos de un Pokémon identificado por su ID.
  - Ejemplo de uso: `curl http://localhost:3000/pokedex/101`
