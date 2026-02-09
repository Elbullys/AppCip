const express = require('express');
const router = express.Router();

// RUTA WEB PARA INICIO (¿Es necesaria? Parece duplicada con /. Si no, elimínala)
router.get("/reponsable/panelresponsables", (req, res) => {
  res.render("Responsables/AdminResponsable", {
    tituloweb: "Administrador de Responsables"
  });
});



module.exports = router;