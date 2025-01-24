const express=require('express');
const router=express.Router();
//const componentes=require('../models/componentesModel.js');
const connection = require('../models/db');

const componentescontroller = require('../controllers/componentesController');  
const { route } = require('./RouterWeb');
  router.post('/mostrar',componentescontroller.mostrar)




//PERMITE CONSULTAR LOS DATOS DE LA TABLA COMPONENTES
router.get("/CodigoQR", (req, res) => {
    //console.log(__dirname)
    //con EJS se renderiza en index.ejs
    res.render("CODIGOQR.ejs");

  })



//PERMITE MANDAR DATO CODIGO TI MIGRAR HACIA OTRA VISTA
router.get('/Mostrar_Info_Componente/:codigo_TI',(req,res)=>{  
  const codigo_TI=componentescontroller.mostrar;
  connection.query('SELECT operacion,numero_serie,codigo_TI FROM componentes where codigo_TI=?',[codigo_TI],(error,results)=>{

    if (error){
      throw error;
    }
    else
    {
      res.render("Mostrar_Info_Componente.ejs",{componentes:results[0]});
    }
  
})
});

module.exports= router;