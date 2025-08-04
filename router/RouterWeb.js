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

    router.get("/leercodigoQR", (req, res) => {
    //console.log(__dirname)
    //con EJS se renderiza en index.ejs
    res.render("LeerCodigoQR")
  })

 router.get('/Mostrar_Info_Componente', (req, res) => {
    // Aquí puedes renderizar la vista con los datos que necesites
    res.render("Mostrar_Info_Componente");
});

  //PERMITE CONSULTAR LOS DATOS DE LA TABLA COMPONENTES mediante un filtro
router.get("/Consultar_Componentes", (req, res) => {
  //console.log(__dirname)
  //con EJS se renderiza en index.ejs
  res.render("Consultar_Componentes.ejs");
  
});

router.get("/ComodatoRegister", (req, res) => {
    //console.log(__dirname)
    //con EJS se renderiza en index.ejs
    res.render("ComodatoRegister.ejs");

  })
  


  module.exports= router;