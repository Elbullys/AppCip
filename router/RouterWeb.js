const express=require('express');
const router=express.Router();
const componentescontroller = require('../controllers/componentesController'); 


//RUTA WEB COMPONENTES

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


//RUTAS WEB PAGINA PRINCIPAL

router.get("/", (req, res) => {
    //console.log(__dirname)
    //con EJS se renderiza en index.ejs
    res.render("index", {titulo:"mi titulo dinamico"})
  })
  


  //RUTAS WEB OTROS
  router.get("/servicios", (req, res) => {
    //console.log(__dirname)
    //con EJS se renderiza en index.ejs
    res.render("servicios", {servicio:"servicio automotriz"})
  })


  //RUTA WEB PARA LEER CODIGO QR
    router.get("/leercodigoQR", (req, res) => {
    //console.log(__dirname)
    //con EJS se renderiza en index.ejs
    res.render("LeerCodigoQR", { pageTitle: "Buscar Componente", mode: 'search' } )
  })



 
  //RUTA WEB PARA REGISTRAR COMODATO
router.get("/ComodatoRegister", (req, res) => {
    //console.log(__dirname)
    //con EJS se renderiza en index.ejs
    res.render("ComodatoRegister.ejs");

  })

//EDITAR


  //ruta para editar datos por medio de QR
     router.get("/EditarDatos", (req, res) => {
    //console.log(__dirname)
    //con EJS se renderiza en index.ejs
    res.render("LeerCodigoQR", {pageTitle:"Editar Componente", mode: 'edit'})
  })

  //PERMITE MANDAR DATOS ENTRE UNA VISTA Y OTRA
  /*
  router.post('/CapturarDataBusqueda',componentescontroller.capturardatabusqueda);
  router.post('/CapturarIdComponente',componentescontroller.capturaridcomponente);
*/
  //RUTA DONDE MUESTRA TABLA PARA EDITAR COMPONENTE 
  router.get('/EditarComponente/:databusqueda',(req,res)=>{ 
  const codigo_TI = req.params.databusqueda; 
    console.log("codigoTI CAPTURADO", codigo_TI);
    res.render("Componentes/TablaEComponente", { codigo_TI }); 
  });

    //PERMITE CONSULTAR LOS DATOS DE LA TABLA COMPONENTES mediante un filtro
router.get("/FormularioEditarComponente/:idcomponente", (req, res) => {
  //console.log(__dirname)
  //con EJS se renderiza en index.ejs
  const idcomponente = req.params.idcomponente; 
  console.log("id componente capturado en ruta",idcomponente);
  res.render("Componentes/Edit_Componente",{ idcomponente });
  
});


  module.exports= router;