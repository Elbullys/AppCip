import { handleGET, URLAPI } from '../Utils.js';  // Agregado handlePOST para consistencia; removido textInputs si no lo usas

const api = URLAPI;
const cacheKey = 'cacheConsRetTransito';

document.addEventListener('DOMContentLoaded', async () => {
        console.log("primer paso");
    const btnlogout = document.getElementById('logout');
    const titulo = document.getElementById('titulo');
    const nombreperfil = document.getElementById('username');//username
    const contadortransito= document.getElementById('equiposEnTransitoContador');
    console.log("se ejecuto el index");

    const config = {
        url: `${api}/api/reportes/reporteDashboard/consultaretirostransito`, // URL específica
        timeoutDuration: 5000, // Opcional: ajusta el timeout si es necesario
        // data: {} // Opcional: no se pasa si no hay query params
      };
      console.log(config);
    
 const response = await handleGET(config);
 console.log("response",response);
const data = response.data;
if (data.body.length > 0) {
        const dashboard = data.body[0]; // Accede al primer elemento del array
  //* Llenar el variables globales con los datos del componente traigo desde la API
console.log("dashboard.EquiposEnTransito",dashboard.EquiposEnTransito);
        contadortransito.textContent = dashboard.EquiposEnTransito;
       //titulo.textContent = data.data.usuario;

      }

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



