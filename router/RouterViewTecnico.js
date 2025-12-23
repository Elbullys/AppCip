const express = require('express');
const router = express.Router();





// RUTA WEB PARA INICIO (¿Es necesaria? Parece duplicada con /. Si no, elimínala)
router.get("/tecnicos/paneltecnico", (req, res) => {
  res.render("Tecnicos/AdminTecnicos", {
    tituloweb: "Alta de Técnicos",
  });
});



module.exports = router;