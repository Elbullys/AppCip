/*const mysql= require("mysql2");
//CONEXION A BASE DE DATOS

const connection = mysql.createConnection({
  host     : process.env.HOST,
  database : process.env.DBNAME,
  user     : process.env.USER,
  password : process.env.PASSWORD
});

connection.connect((err)=>{
  if(err)
  {
    throw err;
    //console.log(err.message);
  }
  console.log("conexion satisfactoria bd");
})
/*
const createconnection = () =>{
  return new Promise((resolve, reject) => {
  connection.connect(function(err){
    if(console.err){
      reject(err);
      
    }
    else
    {
      resolve(connection);
    }
  });
});
}

const ClosedConnection= () => {
  return new Promise((resolve, reject) => {
    connection.end(err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}*/
module.exports = connection;

