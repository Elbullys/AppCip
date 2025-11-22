const express = require('express');
const router = express.Router();
const componentescontroller = require('../controllers/componentesController');
const { requireAuth } = require('../controllers/Middleware/authMiddleware');


//RUTA WEB PARA LEER CODIGO QR
router.get("/leercodigoQR",requireAuth, (req, res) => {
const data = req.session;

  res.render("LeerCodigoQR", { pageTitle: "Buscar Componente", mode: 'search', username: req.username  })

})

//PERMITE CONSULTAR LOS DATOS DE LA TABLA COMPONENTES mediante un filtro
router.get("/Consultar_Componentes",requireAuth, (req, res) => {
 

    res.render("Consultar_Componentes.ejs",{username:req.username});
  

});

//RUTA WEB COMPONENTES

router.get('/Mostrar_Info_Componente',requireAuth, (req, res) => {

    res.render("Mostrar_Info_Componente",{ username: req.username});

});


//ruta para editar datos por medio de QR
router.get("/EditarDatos", requireAuth,(req, res) => {

    res.render("LeerCodigoQR", { pageTitle: "Editar Componente", mode: 'edit', username: req.username })
  

})

//RUTA DONDE MUESTRA TABLA PARA EDITAR COMPONENTE 
router.get('/EditarComponente/:databusqueda', requireAuth, (req, res) => {

    const codigo_TI = req.params.databusqueda;
   
    console.log("codigoTI CAPTURADO", codigo_TI);
    res.render("Componentes/TablaEComponente", { codigo_TI, username: req.username });
  

});

//PERMITE CONSULTAR LOS DATOS DE LA TABLA COMPONENTES mediante un filtro
router.get("/FormularioEditarComponente/:idcomponente", requireAuth, (req, res) => {
 
    //console.log(__dirname)
    //con EJS se renderiza en index.ejs
    const idcomponente = req.params.idcomponente;
     const IdTecnico=req.id_tecnico;
      if (!IdTecnico) { console.error('IdTecnico no definido'); }
   
    res.render("Componentes/Edit_Componente", { idcomponente, username: req.username, IdTecnico  });
  



});
module.exports = router;