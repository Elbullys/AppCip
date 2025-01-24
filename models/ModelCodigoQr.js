/*const conexion = require("../conexion")
module.exports = {
    insertar(nombre, precio) {
        return new Promise((resolve, reject) => {
            conexion.query(`insert into productos
            (nombre, precio)
            values
            (?, ?)`,
                [nombre, precio], (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados.insertId);
                });
        });
    },
    obtener() {
        return new Promise((resolve, reject) => {
            conexion.query(`select id, nombre, precio from productos`,
                (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados);
                });
        });
    },
    obtenerPorId(id) {
        return new Promise((resolve, reject) => {
            conexion.query(`select id, nombre, precio from productos where id = ?`,
                [id],
                (err, resultados) => {
                    console.log({resultados});
                    if (err) reject(err);
                    else resolve(resultados[0]);
                });
        });
    },
    actualizar(id, nombre, precio) {
        return new Promise((resolve, reject) => {
            conexion.query(`update productos
            set nombre = ?,
            precio = ?
            where id = ?`,
                [nombre, precio, id],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                });
        });
    },
    eliminar(id) {
        return new Promise((resolve, reject) => {
            conexion.query(`delete from productos
            where id = ?`,
                [id],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                });
        });
    },
}*/
//---------------------------------------------------------------------
/*const { createconnection, ClosedConnection, connection } = require('./db');


// Declara la función leerQR fuera del bloque then
function leerQR() {
  connection.query('SELECT * FROM TECNICO;', (error, resultados) => {
    if (error) {
      return console.error(error.message);
    }

    // Imprime los resultados de la consulta en la página HTML
    resultados.forEach(resultado => {
        const li = document.createElement('li');
        li.textContent = JSON.stringify(resultado); // Convertir el objeto a texto
        document.getElementById('resultados').appendChild(li);
      });
  });
}

createconnection()
  .then(() => {
    // La conexión se estableció correctamente
    // Llama a la función leerQR
    leerQR(); 
  })
  .catch(error => {
    // Maneja cualquier error al establecer la conexión
    console.error('Error al conectar a la base de datos:', error);
  });

module.exports = {
  leerQR
};*/