const express = require('express');
const router = express.Router();





// RUTA WEB PARA INICIO (¿Es necesaria? Parece duplicada con /. Si no, elimínala)
router.get("/catalogos/panelcatalogos", (req, res) => {
  res.render("Catalogos/AdminCatalogos", {
   
  });
});



module.exports = router;