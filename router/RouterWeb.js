const express=require('express');
const router=express.Router();


router.get("/", (req, res) => {
    //console.log(__dirname)
    //con EJS se renderiza en index.ejs
    res.render("index", {titulo:"mi titulo dinamico"})
  })
  

  router.get("/servicios", (req, res) => {
    //console.log(__dirname)
    //con EJS se renderiza en index.ejs
    res.render("servicios", {servicio:"servicio automotriz"})
  })
  


  module.exports= router;