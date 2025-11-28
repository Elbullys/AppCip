import { General, handlePOST, URLAPI } from '../Utils.js';  // Importa tus utilidades
const api = URLAPI;


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

            // Muestra error con Swal
            Swal.fire({
                icon: failedValidation.icon || "warning",
                title: 'Validación fallida',
                text: failedValidation.message || "Campo no válido",
            });
            return;
        } else {
            // Deshabilita el botón para evitar múltiples clics
            btnLogin.disabled = true;
            btnLogin.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Iniciando...';

            let url;
            try {
                if (puesto.value.trim() === 'TECNICO') {
                    url = `${api}/api/logintecnicos/logintecnico`;
                } else if (puesto.value.trim() === 'RESPONSABLE') {
                    // url = `${api}/api/loginresponsables/loginresponsable`;  // Descomenta si tienes endpoint para responsable
                    throw new Error('Login para RESPONSABLE no implementado aún.');
                }

                // Verifica que URL esté definida
                if (!url) {
                    throw new Error('URL no definida para el puesto seleccionado.');
                }

                const Data = {
                    username: username.value.trim(),
                    Password: password.value.trim(),  // Mantén mayúscula si tu backend lo espera así
                };

                // Configuración para handlePOST (asume que handlePOST usa fetch y soporta credentials)
                const config = {
                    url: url,
                    data: Data,
                    successTitle: `Inicio de sesión exitoso ¡Bienvenido! ${username.value.trim()}`,
                    loadingTitle: 'Iniciando sesión',
                    loadingText: 'Verificando credenciales...',
                    errorTitle: 'Error en login',
                    credentials: 'include'  // Agrega esto si handlePOST lo soporta; envía cookies
                };

                const response = await handlePOST(config);



                // Verifica éxito: response.success y response.data.data existen
                if (response && response.success && response.data && response.data.data) {
                    const userDataFromResponse = response.data.data;

                    const token = userDataFromResponse.token;
                    const verifyResponse = await fetch(`${api}/api/logintecnicos/protected`, {
                        method: 'GET',
                        credentials: 'include',  // Fuera de headers, en el objeto principal
                        // Quita headers si usas cookies; si usas localStorage, agrega:

                    });
                    console.log('verifyResponse', verifyResponse.body);
                    if (verifyResponse.ok) {

                        const responseData = await verifyResponse.json();
                        if (responseData.success && responseData.data) {
                            const customMessage = `Bienvenido, ${responseData.data.usuario}! Tu ID es ${responseData.data.id_tecnico}.`;
                            Swal.fire({
                                icon: 'success',
                                title: config.successTitle,
                                text: customMessage,
                            }).then(() => {
                                // Redirige con datos en la URL si necesitas
                                window.location.href = `/inicio?user=${encodeURIComponent(responseData.data.usuario)}`;
                            });
                        }
                    } else {
                        // Si falla la carga, muestra error
                        Swal.fire({
                            icon: 'warning',
                            title: 'Login exitoso, pero error cargando datos',
                            text: 'Inténtalo de nuevo.',
                        });
                    }
                } else {
                    // Error de autenticación
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de autenticación',
                        text: response?.data?.message || 'Credenciales incorrectas.',
                    });
                }
            } catch (error) {
                console.error('Error en login:', error);
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