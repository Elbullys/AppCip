const express=require('express');
const router=express.Router();
const componentescontroller = require('../controllers/componentesController'); 

  //RUTAS WEB OTROS
  router.get("/servicios", (req, res) => {
    //console.log(__dirname)
    //con EJS se renderiza en index.ejs
    res.render("servicios", {servicio:"servicio automotriz"})
  })


 



 
  //RUTA WEB PARA REGISTRAR COMODATO
router.get("/ComodatoRegister", (req, res) => {
    //console.log(__dirname)
    //con EJS se renderiza en index.ejs
    res.render("ComodatoRegister.ejs");

  })

//EDITAR



  //PERMITE MANDAR DATOS ENTRE UNA VISTA Y OTRA
  /*
  router.post('/CapturarDataBusqueda',componentescontroller.capturardatabusqueda);
  router.post('/CapturarIdComponente',componentescontroller.capturaridcomponente);
*/
 





  module.exports= router;