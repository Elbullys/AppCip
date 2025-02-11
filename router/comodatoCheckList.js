const express=require('express');
const router=express.Router();
const connection = require('../models/db');

//PERMITE CONSULTAR LOS DATOS DE LA TABLA COMPONENTES
router.get("/ComodatoRegister", (req, res) => {
    //console.log(__dirname)
    //con EJS se renderiza en index.ejs
    res.render("ComodatoRegister.ejs");

  })
  module.exports= router;