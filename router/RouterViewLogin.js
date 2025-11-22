const express = require('express');
const router = express.Router();
const componentescontroller = require('../controllers/componentesController'); 
const { requireAuth } = require('../controllers/Middleware/authMiddleware');

// Ruta web para / (página principal protegida)
router.get('/', requireAuth, (req, res) => {
  res.render("index", {
    tituloweb: "Inicio",
    titulo: `HOLA, ${req.username || 'Usuario'}`,  // Corregido: Agregado ${ antes de req.username
    username: req.username
  });
});

// RUTA WEB PARA INICIO (¿Es necesaria? Parece duplicada con /. Si no, elimínala)
router.get("/inicio", requireAuth, (req, res) => {
  res.render("index", {
    tituloweb: "Inicio",
    titulo: `HOLA, ${req.username || 'Usuario'}`,  // Corregido: Agregado ${req.username
    username: req.username
  });
});

// Ruta para logout (POST, destruye sesión y redirige)
router.post('/logout', (req, res) => {
  // Destruye la sesión completamente
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destruyendo sesión:', err);
      return res.redirect('/');  // O maneja el error
    }
    // Limpia la cookie de sesión (por defecto 'connect.sid', ajusta si usas 'access_token')
    res.clearCookie('connect.sid');  // Cambia a 'access_token' si es tu cookie personalizada
    res.redirect('/');
  });
});

// RouterViewWeb.js (o donde esté tu router)

// Ruta para login (pública, con verificación opcional)
router.get('/logintecnico', (req, res) => {
  // Ahora buscamos req.session.userData.usuario o si prefieres req.userSessionData.usuario
  if (req.session && req.session.userData && req.session.userData.usuario) {
    const returnTo = req.session.returnTo || '/';  // Página por defecto
    req.session.returnTo = null;  // Limpia para evitar loops
    return res.redirect(returnTo); // <-- ¡Aquí es donde debería redirigir!
  }
  // Si no está logueado, renderiza el formulario de login
  res.render("Autenticacion/Login", {
    tituloweb: "Inicia Sesión",
    error: req.query.error || null
  });
});

module.exports = router;