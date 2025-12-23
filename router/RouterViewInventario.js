const express = require('express');
const router = express.Router();
const componentescontroller = require('../controllers/componentesController');



//RUTA WEB PARA LEER CODIGO QR
router.get("/inventarios/editarcomponentesporcolectivo", (req, res) => {

  res.render("Inventarios/EditarComponentePorColectivo");

})


module.exports = router;