import { handleGET, URLAPI } from '../Utils.js';  // Agregado handlePOST para consistencia; removido textInputs si no lo usas

const api = URLAPI;
const cacheKey = 'cacheConsRetTransito';

document.addEventListener('DOMContentLoaded', async () => {

    const btnlogout = document.getElementById('logout');
    const titulo = document.getElementById('titulo');
    const nombreperfil = document.getElementById('username');//username
    const contadortransito= document.getElementById('equiposEnTransitoContador');
   

    const config = {
        url: `${api}/api/reportes/reporteDashboard/consultaretirostransito`, 
        timeoutDuration: 5000, //  ajusta el timeout si es necesario
        // data: {} // Opcional: no se pasa si no hay query params
      };

    
 const response = await handleGET(config);

const data = response.data;
if (data.body.length > 0) {
        const dashboard = data.body[0]; 
  //* Llenar el variables globales con los datos del componente traigo desde la API
        contadortransito.textContent = dashboard.EquiposEnTransito;
 

      }

   
    

    btnlogout.addEventListener('click', async function (event) {
        event.preventDefault();
        // Limpia localStorage y redirige
        localStorage.removeItem('username');

        try {
            // 1. Enviar la solicitud POST al servidor para limpiar la cookie
            const response = await fetch(`${api}/api/logintecnicos/logouttecnico`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // 1. Redirige solo si la respuesta del servidor fue exitosa (código 200-299)
                 window.location.href = '/logintecnico';
            } else {
                console.error('Error del servidor al cerrar sesión.');
   
            }
        } catch (error) {
            console.error('Error de conexión:', error);
        }


    });
});



