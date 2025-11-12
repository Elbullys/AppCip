const express=require('express');
const router=express.Router();
const componentescontroller = require('../controllers/componentesController'); 



    // Ruta web para / (renderiza con EJS y protege la ruta)
router.get('/', async (req, res) => {
 
  const data = req.session;
  

  if (data) {
        // Usuario AUTENTICADO: Renderiza la página de inicio con los datos
        res.render("index", {
            tituloweb: "Inicio",
            titulo: `HOLA, ${data.usuario || 'Usuario'}`,
            username: data.usuario,
        
           
        });
    } else {
      console.log("No hay datos de usuario");
        // Usuario NO AUTENTICADO: Redirigir o renderizar login
        res.render("Autenticacion/Login", { tituloweb: "Inicia Sesión" });
    }
});

//RUTAS WEB OTROS
  router.get("/inicio",async (req, res) => {
    
    const data = req.session;
   
   
  if (data) {
        // Usuario AUTENTICADO: Renderiza la página de inicio con los datos
        res.render("index", {
            tituloweb: "Inicio",
            titulo: `HOLA,  || 'Usuario'}`,
            username: data.usuario,
       
        });
    } else {
      
        // Usuario NO AUTENTICADO: Redirigir o renderizar login
        res.render("Autenticacion/Login", { tituloweb: "Inicia Sesión" });
    }
  });

router.post('/logout', (req, res) => {
  // Destruye la sesión del usuario
  res.clearCookie('access_token')
  .redirect('/');
  });

  router.get('/logintecnico', (req, res) => {
  res.render("Autenticacion/Login", {
      tituloweb: "Inicia Sesión",
      // Agrega variables necesarias para el formulario
    });
  });



  


  module.exports= router;