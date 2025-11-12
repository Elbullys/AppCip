import { General, handlePOST,handleGETHiddenCookie } from '../Utils.js';  // Agregado handlePOST para consistencia; removido textInputs si no lo usas
const api = 'http://localhost:7000';

// Espera a que el DOM cargue completamente
document.addEventListener('DOMContentLoaded', () => {








    const loginForm = document.getElementById('FormLogin');
    const btnLogin = document.getElementById('btnlogin');

    // Escucha el evento 'submit' del formulario
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();  // Previene recargar la página

        // Recopila los datos del formulario
        const username = document.getElementById('inputusername');
        const password = document.getElementById('inputpassword');
        const puesto = document.getElementById('selecttipousuario');

        // Validaciones usando General de utils.js
        const validarusername = General.username(username.value.trim());
        const validarpassword = General.password(password.value.trim());
        const validarpuesto = General.validar_Campos_Select(puesto.value.trim());

        if (validarusername.error || validarpassword.error || validarpuesto.error) {
            // Array de todas las validaciones para iterar
            const validations = [validarusername, validarpassword, validarpuesto];

            // Encontrar la primera validación que falló
            const failedValidation = validations.find(val => val.error);

            return {
                icon: failedValidation.icon || "warning",
                error: true,
                message: failedValidation.message || "Campo no válido",
            };
        }
        else {
            // Deshabilita el botón para evitar múltiples clics
            btnLogin.disabled = true;
            btnLogin.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Iniciando...';
            let url;
            try {

                if (puesto.value.trim() === 'TECNICO') {
                 
                    url = `${api}/api/logintecnicos/logintecnico`;
                } else if (puesto === 'RESPONSABLE') {
                    //url=`${api}/api/logintecnicos/logintecnico`;
                }


                // Verifica que URL esté definida
                if (!url) {
                    throw new Error('URL no definida para el puesto seleccionado.');
                }

                const Data = {
                    username: username.value.trim(),
                    Password: password.value.trim(),  // Mantén mayúscula si tu backend lo espera así
                };

                const config = {
                    url: url,
                data: Data,
                successTitle: `Inicio de sesión exitoso ¡Bienvenido! ${username.value.trim()}`,
                loadingTitle: 'Iniciando sesión',
                loadingText: 'Verificando credenciales...',
                errorTitle: 'Error en login',
                };

                

                const response = await handlePOST(config);
              

                
                 // Corrección: Verifica éxito correctamente
               if (response && response.success && response.data ) {
                   sessionStorage.setItem('user_id_tecnico', response.data.Idusuario);
                // Éxito: Muestra mensaje y redirige
                   Swal.fire({
                       icon: 'success',
                       title: config.successTitle,
                       text: response.data.message || 'Login exitoso.',
                   }).then(() => {
                       window.location.href = '/inicio';
                   });
               } else {
                   // Error de autenticación
                   Swal.fire({
                       icon: 'error',
                       title: 'Error de autenticación',
                       text: response?.data?.message || 'Credenciales incorrectas.',
                   });
               }
            } catch (error) {
                
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'Inténtalo de nuevo.',
                });
            } finally {
                // Rehabilita el botón
                btnLogin.disabled = false;
                btnLogin.innerHTML = '<i class="fa-solid fa-sign-in-alt"></i> Iniciar Sesión';
            }
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
            
                       window.location.href = '/inicio';
                   
               }
              console.log("es lo que obtuve",response);
  //window.location.href = '/logintecnico';
}