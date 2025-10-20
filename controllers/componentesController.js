/*const connection = require('../models/db');*/

exports.capturardatabusqueda =(req,res) =>{
     const codigoti = req.body.codigoti; // Esto es correcto si estás enviando un POST
    console.log(codigoti);
}
exports.capturaridcomponente =(req,res) =>{
     const idcomponente = req.body.idcomponente; 
    console.log(idcomponente);
}