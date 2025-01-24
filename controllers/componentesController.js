const connection = require('../models/db');

exports.mostrar =(req,res) =>{
    const codigoti=req.body.codigoti;
    console.log(codigoti);
}