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

                    // Guarda el token en localStorage (en lugar de depender de cookies)
                    localStorage.setItem('access_token', token);

                    try {
                        // Fetch a /protected con el token en headers
                        const verifyResponse = await fetch(`${api}/api/logintecnicos/protected`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'  // Envía el token aquí
                            },
                            // Quita credentials: 'include' si usas headers
                        });

                        if (verifyResponse.ok) {
                            const responseData = await verifyResponse.json();
                            console.log("responseData", responseData);

                            if (responseData.success && responseData.data) {
                                const customMessage = `Bienvenido, ${responseData.data.usuario}! Tu ID es ${responseData.data.id_tecnico}.`;
                                Swal.fire({
                                    icon: 'success',
                                    title: config.successTitle,
                                    text: customMessage,
                                }).then(() => {
                                    window.location.href = `/inicio?user=${encodeURIComponent(responseData.data.usuario)}`;
                                });
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    text: 'Respuesta inesperada.',
                                });
                            }
                        } else {
                            const errorData = await verifyResponse.json().catch(() => ({}));
                            console.error('Error:', verifyResponse.status, errorData);
                            Swal.fire({
                                icon: 'error',
                                title: 'Acceso denegado',
                                text: errorData.error || 'No autorizado.',
                            });
                        }
                    } catch (error) {
                        console.error('Error en fetch:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error de conexión',
                            text: 'No se pudo verificar.',
                        });
                    }
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Login fallido',
                        text: 'Credenciales inválidas.',
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