const express = require("express");
const app = express();

//variable de entorno numero 1
const port =process.env.PORT || 3000;
require('dotenv').config()

app.use(express.urlencoded({extended:false}));
//app.use(express(json));
 
//MOTOR DE PLANTILLAS
app.set('view engine','ejs');
app.set('views',__dirname + '/views')

//cuando se ejecuta en html en la carpeta publica
app.use(express.static(__dirname + "/public"))


//RUTAS WEB(RUTAS API)
app.use('/',require('./router/RouterWeb'));
app.use('/',require('./router/componentes_router'));

//para varios archivos
  app.use((req,res,next) => {
    res.status(404).render("404",{
      titulo:"404",
      descripcion: "titulo del sitio we"
    })
  })

  app.listen(port, () => {
    console.log('Servidor a su servicio en el puerto', port);
  })
