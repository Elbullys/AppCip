import { General, handleGETHiddenCookie, URLAPI } from '../Utils.js';  // Agregado handlePOST para consistencia; removido textInputs si no lo usas

const api = URLAPI;
const cacheKey = 'cacheConsRetTransito';

document.addEventListener('DOMContentLoaded', async () => {
    const btnlogout = document.getElementById('logout');
    const titulo = document.getElementById('titulo');
    const nombreperfil = document.getElementById('username');//username

    // Uso en tu dashboard
    /*fetchComponentes().then(data => {
        // Renderiza datos (ej. en un div)
        console.log("data", data.body);
        const contadorElementoEnTransito = document.getElementById('equiposEnTransitoContador');
        contadorElementoEnTransito.textContent=data.body;
    
        //document.getElementById('dashboard').innerHTML = data.map(item => `<p>${item.area}: ${item.count}</p>`).join('');
    });*/
    // Verifica con la API solo si quieres "refrescar" o validar (no en cada carga)
    //  solo en la página de inicio o si el token podría expirar pronto
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
        return JSON.parse(cached);
    }
    const url = `${api}/api/reportes/reporte/ConsultaTotalRetirosEnTransito`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            //credentials: 'include',
        });
      
 console.log("response", data);
       /* if (data) {
             //const data = await response.json();
            // Guarda en localStorage
            //localStorage.setItem(cacheKey, JSON.stringify(data));
            //localStorage.setItem(cacheKey + '_time', now.toString());

            //return data;
            
        }*/
    } catch (error) {
        console.error('Error de conexión:', error);
    }



}

