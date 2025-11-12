import { General, handleGETHiddenCookie } from '../Utils.js';  // Agregado handlePOST para consistencia; removido textInputs si no lo usas
const api = 'http://localhost:7000';

document.addEventListener('DOMContentLoaded', () => {
  const btnlogout = document.getElementById('logout');
  redirectToLogin();

//INICIO EVENTO TOUCH PARA ABRIR MODAL AREAS (UBICACION)
btnlogout.addEventListener('click',async function (event) {
    event.preventDefault();
    console.log('Cerrando sesión...');
    try {
            // 1. Enviar la solicitud POST al servidor para limpiar la cookie
            const response = await fetch('/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // 2. Limpiar las variables de sesión del navegador (Buena práctica)
                sessionStorage.removeItem('user_usuario');
                sessionStorage.removeItem('user_isadmin');
                sessionStorage.removeItem('user_id_tecnico');
                
               
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

async function redirectToLogin() {

  const config = {
                    url: `${api}/api/logintecnicos/protected`,
                    successTitle: `Inicio de sesión exitoso ¡Bienvenido!`,
                    loadingTitle: 'Iniciando sesión',
                    loadingText: 'Verificando credenciales...',
                    errorTitle: 'Error en login',
                };

                

                const response = await handleGETHiddenCookie(config);
                if (response && response.success && response.data ) {
            
                       //window.location.href = '/inicio';
                   
               }
              console.log("es lo que obtuve",response);
  //window.location.href = '/logintecnico';
}

