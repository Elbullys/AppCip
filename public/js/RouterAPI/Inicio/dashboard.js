import { handleGET, URLAPI } from '../Utils.js';  // Agregado handlePOST para consistencia; removido textInputs si no lo usas

const api = URLAPI;
const cacheKey = 'cacheConsRetTransito';
let data;

document.addEventListener('DOMContentLoaded', async () => {

    const btnlogout = document.getElementById('logout');
    const titulo = document.getElementById('titulo');
    const nombreperfil = document.getElementById('username');//username
    const contadortransito = document.getElementById('equiposEnTransitoContador');

    fetchComponentes().then(data => {
        // Renderiza datos (ej. en un div)
        console.log("data ejecutado fetch", data);

        contadortransito.textContent = data;

        //document.getElementById('dashboard').innerHTML = data.map(item => `<p>${item.area}: ${item.count}</p>`).join('');
    });


    const shouldVerify = window.location.pathname === '/inicio';  // O tu lógica
    if (shouldVerify) {
        const urlProtected = `${api}/api/logintecnicos/protected`;
        try {
            const response = await fetch(urlProtected, {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                // Actualiza localStorage y UI con datos frescos
                localStorage.setItem('username', data.data.usuario);
                titulo.textContent = data.data.usuario;
                nombreperfil.textContent = data.data.usuario;

            } else if (response.status === 401) {
                // Limpia localStorage y redirige
                localStorage.removeItem('username');
                window.location.href = '/logintecnico';
            }
        } catch (error) {
            console.error('Error al verificar sesión:', error);
            // No rediriges aquí para no interrumpir la UX; solo loguea
        }
    }


    btnlogout.addEventListener('click', async function (event) {
        event.preventDefault();
        console.log('Cerrando sesión...');
        // Limpia localStorage y redirige
        localStorage.removeItem('username');

        try {//`${api}/api/componentes/BusquedaComponenteCodigoTINumSerie
            // 1. Enviar la solicitud POST al servidor para limpiar la cookie
            const response = await fetch(`${api}/api/logintecnicos/logouttecnico`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log("response.ok", response);
            if (response.ok) {
                // 1. Redirige solo si la respuesta del servidor fue exitosa (código 200-299)
                window.location.href = '/logintecnico';
            } else {
                console.error('Error del servidor al cerrar sesión.');
                // Puedes mostrar un SweetAlert si tienes uno
            }
        } catch (error) {
            console.error('Error de conexión:', error);
        }


    });
});

// Función para obtener datos con cache local
async function fetchComponentes() {

    const cached = localStorage.getItem(cacheKey);
    const cacheTime = localStorage.getItem(cacheKey + '_time');
    const now = Date.now();

    // Si hay cache y no ha expirado (ej. 1 hora)
    if (cached && cacheTime && (now - cacheTime) < 3600000) {
        console.log('Datos desde localStorage');
        try {
            const parsedData = JSON.parse(cached);
            return parsedData;  // Devuelve el valor cacheado (ej. 8)
        } catch (error) {
            console.error('Error al parsear cache, limpiando:', error);
            localStorage.removeItem(cacheKey);
            localStorage.removeItem(cacheKey + '_time');
        }
    }
    const config = {
        url: `${api}/api/reportes/reporteDashboard/consultaretirostransito`, // URL específica
        timeoutDuration: 5000, // Opcional: ajusta el timeout si es necesario
        // data: {} // Opcional: no se pasa si no hay query params
    };
    try {
        const response = await handleGET(config);
        console.log("Respuesta completa:", response);
        // Asume que response.data es el array [{ EquiposEnTransito: 8 }]
        // Verifica si response tiene body y es válida
        if (!response) {
            console.warn('Respuesta inválida de handleGET');
            return 0;
        }
        const data = response.data.body;
        console.log("Data extraída (body):", data);
        if (Array.isArray(data) && data.length > 0) {
            const valorEquiposEnTransito = data[0]?.EquiposEnTransito || 0;
            console.log("Valor extraído:", valorEquiposEnTransito);
            // Guarda con JSON.stringify
            localStorage.setItem(cacheKey, JSON.stringify(valorEquiposEnTransito));
            localStorage.setItem(cacheKey + '_time', now.toString());
            return valorEquiposEnTransito;
        } else {
            console.warn('Datos inválidos de la API:', data);
            return 0;
        }
    } catch (error) {
        console.error('Error en fetchComponentes:', error);
        return 0;  // Fallback
    }
}







