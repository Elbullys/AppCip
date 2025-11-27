//const api = 'https://apirestcip.onrender.com';
const api = 'http://localhost:7000';

const axios = require('axios');

const loadUserData = async (req, res, next) => {
    // 1. Excluye rutas públicas
    if (req.path === '/logintecnico' || req.path.startsWith('/api/public')) {
        return next();
    }

    // 2. OPTIMIZACIÓN y VERIFICACIÓN: Si los datos de usuario YA están en la sesión, salta la API.
    // Usamos 'req.session.userData' para no interferir con el objeto principal.
    if (req.session && req.session.userData) {
        console.log('Datos de usuario ya cargados en sesión.');
        // Copia la data al req para que requireAuth y las rutas puedan usarla fácilmente
        req.userSessionData = req.session.userData;
        return next();
    }

    // 3. Si no hay datos, llama a la API para cargar la sesión (asumiendo que la API valida la cookie 'connect.sid')
    try {
        console.log('Llamando a API para cargar datos de usuario.');
        const response = await axios.get(`${api}/api/logintecnicos/protected`, {
            headers: { Cookie: req.headers.cookie }
        });

        const userData = response.data?.data || null;

        // 4. Almacena los datos en una propiedad de req.session (¡NO REEMPLAZAR req.session!)
        if (userData) {
            req.session.userData = userData;
            req.userSessionData = userData; // También disponible en req.userSessionData
        }

    } catch (error) {
        console.log('Error o sesión no válida desde API. Limpiando datos de sesión.');
        req.session.userData = null; // Limpia si hay un error (ej. 401 Unauthorized)
        req.userSessionData = null;
    }
    next();
};


// middleware/authMiddleware.js

function requireAuth(req, res, next) {
    // Usamos la data cargada por loadUserData, que ahora está en req.userSessionData
    const data = req.userSessionData;

    // Opcional: si usaste solo req.session.userData: const data = req.session?.userData;

    // El campo de usuario debe ser 'usuario' basado en tu código
    if (data && data.usuario) {
        console.log("Sesión de usuario válida:", data.usuario);
        console.log("Sesión de id tecnico válida:", data.id_tecnico);
        req.username = data.usuario;
        req.id_tecnico = data.id_tecnico; // Establece req.username para la ruta
        console.log("Sesión de id tecnico válida req:", req.id_tecnico);
        next();
    } else {
        console.log("Sesión no válida o no cargada. Redirigiendo a login.");
        // Opcional: req.session.returnTo = req.originalUrl;
        res.redirect('/logintecnico');
    }
}

module.exports = { loadUserData, requireAuth };