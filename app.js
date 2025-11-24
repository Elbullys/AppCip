const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
// Importa el middleware
const { loadUserData } = require('./controllers/Middleware/authMiddleware');
//variable de entorno numero 1
const port =process.env.PORT || 3000;
require('dotenv').config()

app.use(session({
  secret: process.env.SESSION_SECRET || 'tu-secreto-aqui', 
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,  // Cambia a true si usas HTTPS
    maxAge: 24 * 60 * 60 * 1000  // 24 horas, ajusta según necesites
  }
}));

//Aplica loadUserData GLOBALMENTE a TODAS las rutas de la app 
app.use(loadUserData); 
app.use(express.urlencoded({extended:false}));
//app.use(express(json));
 



//MOTOR DE PLANTILLAS
app.set('view engine','ejs');
app.set('views',__dirname + '/views')

//cuando se ejecuta en html en la carpeta publica
app.use(express.static(__dirname + "/public"))


//RUTAS WEB Views
app.use('/',require('./router/RouterViewWeb'));
app.use('/',require('./router/RouterViewLogin'));
app.use('/',require('./router/RouterViewComponente'));


//body parser permite acceder y procesar lods datos que se envian desde el formulario html
app.use(bodyParser.json());
//se utiliza para analizar los datos de la url enviados en las solicitudes POST
app.use(bodyParser.urlencoded({extended:false}));
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
