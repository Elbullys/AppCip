const express=require('express');
const router=express.Router();
const connection = require('../models/db');

//const componentescontroller = require('../controllers/componentesController');  
//const { route, connect } = require('./RouterWeb');
  //router.post('/Mostrar_Info_Componente',componentescontroller.mostrar)

  router.post('/Mostrar_Info_Componente',(req,res)=>{
    const codigoti=req.body.codigoti;
    console.log(codigoti);
    //res.render('Mostrar_Info_Componente.ejs',{codigoti:codigoti});
    //console.log(componentescontroller.mostrar);

    connection.query('SELECT U.id_unidad,U.nombre_unidad,U.municipio,C.operacion,R.nombre_responsable,A.area,D.tipo_equipo,M.marca,M.modelo,CC.descripcion_modelo,C.numero_serie,C.codigo_TI,C.observaciones,C.status_componente,C.status_inventario FROM componentes C INNER JOIN unidad U ON U.id_unidad=C.FK_id_unidad INNER JOIN RESPONSABLE R ON R.id_responsable=C.FK_id_responsable INNER JOIN CATALOGO_COMPONENTES CC ON CC.id_catalogo_componente=C.FK_id_catalogo_componentes INNER JOIN MARCA M ON M.id_marca=CC.FK_id_marca_cata INNER JOIN dispositivos D ON D.id_dispositivo=C.FK_id_dispositivo INNER JOIN AREA A ON A.id_area=R.FK_id_area where codigo_TI=? OR C.numero_serie=?',[codigoti,codigoti],(error,results)=>{

      if (error){
        throw error;
      }
      else
      {
        res.render("Mostrar_Info_Componente.ejs",{results:results});
      }
    
  })
    
  });




//PERMITE CONSULTAR LOS DATOS DE LA TABLA COMPONENTES
router.get("/CodigoQR", (req, res) => {
    //console.log(__dirname)
    //con EJS se renderiza en index.ejs
    res.render("CODIGOQR.ejs");

  })

  //PERMITE CONSULTAR LOS DATOS DE LA TABLA COMPONENTES mediante un filtro
router.get("/Consultar_Componentes", (req, res) => {
  //console.log(__dirname)
  //con EJS se renderiza en index.ejs
  res.render("Consultar_Componentes.ejs");

  /*connection.query('SELECT U.id_unidad,R.nombre_responsable,U.nombre_unidad,D.tipo_equipo,M.marca,M.modelo,C.numero_serie,C.operacion,C.codigo_TI,C.observaciones,C.status_componente,A.area,C.status_inventario FROM componentes C INNER JOIN unidad U ON U.id_unidad=C.FK_id_unidad INNER JOIN RESPONSABLE R ON R.id_responsable=C.FK_id_responsable INNER JOIN CATALOGO_COMPONENTES CC ON CC.id_catalogo_componente=C.FK_id_catalogo_componentes INNER JOIN MARCA M ON M.id_marca=CC.FK_id_marca_cata INNER JOIN dispositivos D ON D.id_dispositivo=C.FK_id_dispositivo INNER JOIN AREA A ON A.id_area=R.FK_id_area limit 25',(error,results)=>{

    if (error){
      throw error;
    }
    else
    {
      res.render("Consultar_Componentes.ejs",{results:results});
    }
  
})*/
  
});




/*
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

*/

module.exports= router;