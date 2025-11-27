const express = require('express');
const router = express.Router();
const componentescontroller = require('../controllers/componentesController');



// Ruta web para / (página principal protegida)
router.get('/', (req, res) => {
  res.render("index", {
    tituloweb: "Inicio",
    titulo: 'hoa',//`HOLA, ${req.username || 'Usuario'}`,  // Corregido: Agregado ${ antes de req.username
    username: 'invitado'
  });
});

// RUTA WEB PARA INICIO (¿Es necesaria? Parece duplicada con /. Si no, elimínala)
router.get("/inicio", (req, res) => {
  res.render("index", {
    tituloweb: "Inicio",
    titulo: `HOLA 'Usuario'}`,
    username: 'invitado'//req.username
  });
});

// Ruta para logout (POST, destruye sesión y redirige)
router.post('/logout', (req, res) => {

});

// RouterViewWeb.js (o donde esté tu router)

// Ruta para login (pública, con verificación opcional)
router.get('/logintecnico', (req, res) => {

  // 3. Si NO está logueado, renderizar el formulario de login
  res.render("Autenticacion/Login", {
    tituloweb: "Inicia Sesión",
    error: req.query.error || null
  });
});

module.exports = router;