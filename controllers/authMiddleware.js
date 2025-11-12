// middleware/authMiddleware.js
const api = 'http://localhost:7000';
const axios = require('axios');


const loadUserData = async (req, res, next) => {
  // Excluye rutas públicas (no verifica cookies)
  if (req.path === '/logintecnico' || req.path.startsWith('/api/public')) {  // Ajusta según tus rutas
    req.session = null;  // O deja undefined
    return next();
  }

  try {
    const response = await axios.get(`${api}/api/logintecnicos/protected`, {
      headers: { Cookie: req.headers.cookie }
    });
    req.session = response.data && response.data.data ? response.data.data : null;
  } catch (error) {
    req.session = null;
  }
  next();//seguir a la siguiente ruta o middleware
};

module.exports = { loadUserData };