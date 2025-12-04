//PERMITE EXPORTAR LA RUTA DE LA API
 export const URLAPI= 'https://apirestcip.onrender.com';
  //export const URLAPI= 'http://localhost:7000';
//PERMITE REDIRIGIR A LA PAGINA DE LOGIN
   const logoutAndRedirect = (errorMessage) => {
 
    // 3. Redirigir al login después de un breve momento
    setTimeout(() => {
      localStorage.removeItem('username');
        window.location.href = '/logintecnico';
    }, 1500); // 1.5 segundos para que el usuario vea el mensaje

   
};

// utils.js - Archivo para funciones y utilidades globales reutilizables

//FUNCION PARA CONVERTIR FECHA A FORMATO ACEPTADO POR INPUT DATE
export function conversionFecha(fecha) {
  // Extraer solo la parte de la fecha
  const extraerfecha = fecha.split('T')[0]; // Esto dará '2000-01-01'

  // Dividir la fecha en sus componentes
  const [anio, mes, dia] = extraerfecha.split('-'); // ['2000', '01', '01']

  // Reorganizar a formato 'DD-MM-YYYY' (si necesitas mostrarlo en otro lugar)
  const fechaFormateada = `${dia}-${mes}-${anio}`;


  // Retornar la fecha en formato 'YYYY-MM-DD' para el input de tipo date
  return extraerfecha; // Retorna '2000-01-01'
}



//FUNCION POST PARA DATATABLE OBTECION DE DATOS
/*POST*/
export async function handleDataTableLoadingPOST(config) {
  const { url, data, timeoutDuration = 3000 } = config;



  let progress = 0;
  const swalInstance = Swal.fire({
    title: 'Cargando datos... (0%)',
    text: 'Por favor, espera mientras se obtienen los datos. Conectando...',
    icon: 'info',
    allowOutsideClick: false,
    backdrop: true,
    didOpen: () => {
      Swal.showLoading();
      const progressInterval = setInterval(() => {
        progress += 5;
        if (progress > 100) progress = 100;
        Swal.getTitle().textContent = `Cargando datos... (${progress}%)`;
      }, 300);
      swalInstance._progressInterval = progressInterval;
    },
  });

  try {
    const response = await fetch(url, {
      method: 'POST',  // Cambiado a POST
      headers: {
        'Content-Type': 'application/json',  // Agregado para indicar que el body es JSON
      },
      body: JSON.stringify(data),  // Agregado: Envía data como cuerpo JSON
      signal: AbortSignal.timeout(timeoutDuration),
      credentials: 'include',
    });

    //VERIFICA DI LA RESPUESTA ES 401 Y REALIZA LOGOUT Y REDIRECCION A INICIO DE SESION
    if (response.status === 401) {
            // Si el servidor devuelve 401, forzamos el logout y la redirección
            let errorMessage = "Tu sesión ha expirado. Vuelve a iniciar sesión.";
            
            try {
                // Intentamos leer el mensaje de error del cuerpo JSON de la respuesta
                const errorResponse = await response.json(); 
                errorMessage = errorResponse.message || errorMessage;
            } catch (e) {
                // Si el cuerpo no es JSON, usamos el mensaje por defecto
            }
            
            // Cerrar el modal de carga y redirigir
            Swal.close(); 
            clearInterval(swalInstance._progressInterval);
            logoutAndRedirect(errorMessage);

            // Devolvemos un array vacío ya que la operación falló.
            return [];
        }
    if (!response.ok) {
      throw new Error(`Error en la respuesta: ${response.statusText}`);
    }
    const json = await response.json();
    clearInterval(swalInstance._progressInterval);
    // Agrega un retraso mínimo antes de cerrar la alerta
    await new Promise(resolve => setTimeout(resolve, 1000));  // Espera 1 segundo
    Swal.close();


    return json.body || [];
  }
  catch (error) {
    clearInterval(swalInstance._progressInterval);
    Swal.close();  // Cierra inmediatamente en caso de error para no bloquear al usuario

    if (error.name === 'TimeoutError') {
      console.error('Error de timeout:', error);
      Swal.fire({
        title: 'Tiempo de espera agotado',
        text: 'Intenta de nuevo más tarde.',
        icon: 'warning',
      });
    } else {
      console.error('Error general:', error);
      Swal.fire({
        title: 'Error inesperado',
        text: 'Ocurrió un problema al cargar los datos.',
        icon: 'error',
      });
    }
    return [];
  }
}



/*GET*/
// Función GET PARA DATATABLE OBTECION DE DATOS
export async function handleDataTableLoadingGET(config) {

 
  const { url, data, timeoutDuration = 3000 } = config;



  let progress = 0;
  const swalInstance = Swal.fire({
    title: 'Cargando datos... (0%)',
    text: 'Por favor, espera mientras se obtienen los datos. Conectando...',
    icon: 'info',
    allowOutsideClick: false,
    backdrop: true,
    didOpen: () => {
      Swal.showLoading();
      const progressInterval = setInterval(() => {
        progress += 5;
        if (progress > 100) progress = 100;
        Swal.getTitle().textContent = `Cargando datos... (${progress}%)`;
      }, 300);
      swalInstance._progressInterval = progressInterval;
    },
  });

  try {
    // Construye la URL con parámetros de consulta
    let fullUrl = url;
    if (data && typeof data === 'object' && Object.keys(data).length > 0) {
      const queryString = new URLSearchParams(data).toString();
      fullUrl += '?' + queryString;
    }

    const response = await fetch(fullUrl, {
      method: 'GET',
      signal: AbortSignal.timeout(timeoutDuration),
      credentials: 'include',

    });
//VERIFICA DI LA RESPUESTA ES 401 Y REALIZA LOGOUT Y REDIRECCION A INICIO DE SESION
    if (response.status === 401) {
            // Si el servidor devuelve 401, forzamos el logout y la redirección
            let errorMessage = "Tu sesión ha expirado. Vuelve a iniciar sesión.";
            
            try {
                // Intentamos leer el mensaje de error del cuerpo JSON de la respuesta
                const errorResponse = await response.json(); 
                errorMessage = errorResponse.message || errorMessage;
            } catch (e) {
                // Si el cuerpo no es JSON, usamos el mensaje por defecto
            }
            
            // Cerrar el modal de carga y redirigir
            Swal.close(); 
            clearInterval(swalInstance._progressInterval);
            logoutAndRedirect(errorMessage);

            // Devolvemos un array vacío ya que la operación falló.
            return [];
        }
//SI NO HAY ERROR 401, SIGUE CORRRIENDO EL CODIGO

    if (!response.ok) {
      throw new Error(`Error en la respuesta: ${response.statusText}`);
    }

    const json = await response.json();
    clearInterval(swalInstance._progressInterval);

    // Agrega un retraso mínimo antes de cerrar la alerta
    await new Promise(resolve => setTimeout(resolve, 1000));  // Espera 1 segundo
    Swal.close();


    return json.body || [];
  } catch (error) {
    clearInterval(swalInstance._progressInterval);
    Swal.close();  // Cierra inmediatamente en caso de error para no bloquear al usuario

    if (error.name === 'TimeoutError') {

      Swal.fire({
        title: 'Tiempo de espera agotado',
        text: 'Intenta de nuevo más tarde.',
        icon: 'warning',
      });
    } else {

      Swal.fire({
        title: 'Error inesperado',
        text: 'Ocurrió un problema al cargar los datos.',
        icon: 'error',
      });
    }
    return [];
  }
}




export class General {
  // Método estático para validar búsqueda
  static validarBusqueda(searchTerm) {
    console.log(searchTerm);
    if (searchTerm === '' || searchTerm.length === 0) {
      Toast.fire({
        icon: "warning",
        title: "Por favor ingrese un término de búsqueda",
      });
      return false; // Agregado: Retorna false para indicar error
    }
    return true; // Agregado: Retorna true si es válido
  }

  //INICIO PERMITE CONCATENAR EL ID DE CONTRATO + ID UNIDAD PARA OPERACION GUANAJUATO DANDO COMO RESULTADO EL ID UNIDAD  Y NOMBRE COMPLETO
  static concatenar_contrato_unidad(idunidad, contratoid) {
    idunidad = String(idunidad);  // Asegura que sea cadena
    if (idunidad.length === 1) {
      return contratoid + '00' + idunidad;
    } else if (idunidad.length === 2) {
      return contratoid + '0' + idunidad;
    } else if (idunidad.length === 3) {
      return contratoid + idunidad;
    }
  }
  static verificacion_numerica_entero(ValidarDato, campo) {

    // Verificar si el campo está vacío o nulo
    if (ValidarDato.toString().trim() === "") {
      return { icon: "warning", error: true, message: "" + campo + " no puede estar vacio o no es Válido" };
    }

    // Verificar si NO es un número (isNaN devuelve true si no es numérico)
    if (isNaN(ValidarDato)) {
      return { icon: "warning", error: true, message: "" + campo + " no es válido, solo números." };
    }

    // Si pasa ambas verificaciones, es válido
    return { icon: "check", error: false, message: "Datos válidos" };
  }

  // Función para detectar si es dispositivo móvil/tablet (pantalla <= 767px)
  static esDispositivoMovil() {
    const ancho = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (ancho <= 1024) return true; // Tablets grandes
    return false; // Desktop
  }

  static username(username) {
    // Verificar si username está definido
    if (typeof username === "undefined") {

      return {
        icon: "warning",
        error: true,
        message: "El nombre de usuario no está definido.",
      };
    }

    else if (!username || username.length < 3) {

      return {
        icon: "warning",
        error: true,
        message: "El Usuario es Incorrecto",
      };
      // return { icon:"warning",error: true, message: "El nombre de usuario ya está en uso." };
    }
    return { icon: "check", error: false, message: "Datos válidos" };
  }

  static password(Password) {
    if (typeof Password === "undefined") {
      console.log("password desconocido");
      return {
        icon: "warning",
        error: true,
        message: "La contraseña no está definida.",
      };
    }

    const password = Password;
    // Expresión regular para validar la contraseña
    //const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/; // Al menos una mayúscula, un número y longitud mínima de 6 caracteres
    if (Password.length < 3) {
      console.log("password tamaño");
      return {
        icon: "warning",
        error: true,
        message: "La contraseña debe tener al menos 3 caracteres.",
      };
    }
    return { icon: "check", error: false, message: "Datos válidos" };
  }

  static validar_Campos_Select(ValidarDato, campo) {
    // Verifica si el dato es null, undefined, o una cadena vacía (después de trim)
    if (!ValidarDato || ValidarDato.toString().trim() === "" || ValidarDato === "Selecciona") {
      return { icon: "warning", error: true, message: "Selecciona " + campo + " válido." };
    }
    // Si pasa la validación, retorna éxito
    return { icon: "success", error: false, message: "Campo válido." };
  }

  static validar_Campos_String(ValidarDato, campo) {

    if (!ValidarDato || ValidarDato.toString().trim() === "" || ValidarDato.toString() === "unfined") {
      return { icon: "warning", error: true, message: "" + campo + " no puede estar vacío." };
    }


    return { icon: "check", error: false, message: "Datos válidos" };
  }

}


//funcion para obtener el Get
export async function handleGET(config) {
  const {
    url,
    data = {}, // Opcional: objeto para query params (si no se pasa, no se agregan)
    timeoutDuration = 3000,
    loadingTitle = 'Cargando datos...', // Título del modal de carga
    loadingText = 'Por favor, espera mientras se obtienen los datos. Conectando...', // Texto del modal de carga
    errorTitle = 'Error al obtener datos', // Solo para errores
  } = config;

  // Validaciones iniciales
  if (!url) {
    console.error('Error: URL es requerida.');
    Swal.fire({
      title: 'Error',
      text: 'No se proporcionó una URL válida.',
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
    return false;
  }

  let progress = 0;
  const swalInstance = Swal.fire({
    title: `${loadingTitle} (0%)`,
    text: loadingText,
    icon: 'info',
    allowOutsideClick: false,
    backdrop: true,
    didOpen: () => {
      Swal.showLoading();
      const progressInterval = setInterval(() => {
        progress += 5;
        if (progress > 100) progress = 100;
        Swal.getTitle().textContent = `${loadingTitle} (${progress}%)`;
      }, 300);
      swalInstance._progressInterval = progressInterval;
    },
  });

  try {
    // Construir URL con query params si data está presente
    let fullUrl = url;
    if (data && typeof data === 'object' && Object.keys(data).length > 0) {
      const params = new URLSearchParams(data);
      fullUrl += `?${params.toString()}`;
    }

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(timeoutDuration),
      credentials: 'include',
    });
    //VERIFICA DI LA RESPUESTA ES 401 Y REALIZA LOGOUT Y REDIRECCION A INICIO DE SESION
    if (response.status === 401) {
            // Si el servidor devuelve 401, forzamos el logout y la redirección
            let errorMessage = "Tu sesión ha expirado. Vuelve a iniciar sesión.";
            
            try {
                // Intentamos leer el mensaje de error del cuerpo JSON de la respuesta
                const errorResponse = await response.json(); 
                errorMessage = errorResponse.message || errorMessage;
            } catch (e) {
                // Si el cuerpo no es JSON, usamos el mensaje por defecto
            }
            
            // Cerrar el modal de carga y redirigir
            Swal.close(); 
            clearInterval(swalInstance._progressInterval);
            logoutAndRedirect(errorMessage);

            // Devolvemos un array vacío ya que la operación falló.
            return [];
        }

    if (!response.ok) {
      // Maneja respuestas no-JSON usando text() con try-catch
      let errorMessage;
      try {
        const errorData = await response.text();
        const parsed = JSON.parse(errorData);
        errorMessage = parsed.message || `Error al obtener: ${response.status}`;
      } catch {
        errorMessage = `Error al obtener: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    clearInterval(swalInstance._progressInterval);
    // Agrega un retraso mínimo antes de cerrar la alerta
    await new Promise(resolve => setTimeout(resolve, 1000));  // Espera 1 segundo
    Swal.close();  // Cierra inmediatamente sin retraso
    // Retorna un objeto con success y data (sin mensajes de éxito)
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    clearInterval(swalInstance._progressInterval);
    Swal.close();  // Cierra inmediatamente en caso de error

    if (error.name === 'TimeoutError') {
      Swal.fire({
        title: 'Tiempo de espera agotado',
        text: 'Intenta de nuevo más tarde.',
        icon: 'warning',
      });
    } else {
      Swal.fire({
        title: 'Error inesperado',
        text: 'Ocurrió un problema al obtener los datos.',
        icon: 'error',
      });
    }
    console.error('Error completo:', error);
    return false;
  }
}





// Función PUT genérica para ediciones o actualizaciones (adaptada al estilo de handleDataTableLoadingGET)
export async function handlePUT(config) {
  const {
    url,
    id,
    data,
    timeoutDuration = 3000,
    successTitle = 'Edición exitosa',
    successMessage = 'El recurso ha sido editado exitosamente.',
    loadingTitle = 'Procesando edición...',
    loadingText = 'Por favor, espera mientras se procesa la edición.',
    errorTitle = 'Error al editar',
  } = config;

  console.log("data", data);
  console.log("id", id);

  // Validaciones iniciales
  if (!url || !data) {
    console.error('Error: URL y data son requeridos.');
    Swal.fire({
      title: 'Error',
      text: 'Faltan parámetros obligatorios para la edición.',
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
    return false;
  }

  let progress = 0;
  let swalInstance;
  try {
    swalInstance = Swal.fire({
      title: `${loadingTitle} (0%)`,
      text: loadingText,
      icon: 'info',
      allowOutsideClick: false,
      backdrop: true,
      didOpen: () => {
        Swal.showLoading();
        const progressInterval = setInterval(() => {
          progress += 5;
          if (progress > 100) progress = 100;
          Swal.getTitle().textContent = `${loadingTitle} (${progress}%)`;
        }, 300);
        swalInstance._progressInterval = progressInterval;
      },
    });
  } catch (error) {
    console.error('Error al mostrar modal de carga:', error);
    return false;
  }

  try {
    let fullUrl = url;
    if (id) fullUrl += `/${id}`;
    console.log("fullUrl", fullUrl);
    const response = await fetch(fullUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(timeoutDuration),
      credentials: 'include',
    });

    //VERIFICA DI LA RESPUESTA ES 401 Y REALIZA LOGOUT Y REDIRECCION A INICIO DE SESION
    if (response.status === 401) {
            // Si el servidor devuelve 401, forzamos el logout y la redirección
            let errorMessage = "Tu sesión ha expirado. Vuelve a iniciar sesión.";
            
            try {
                // Intentamos leer el mensaje de error del cuerpo JSON de la respuesta
                const errorResponse = await response.json(); 
                errorMessage = errorResponse.message || errorMessage;
            } catch (e) {
                // Si el cuerpo no es JSON, usamos el mensaje por defecto
            }
            
            // Cerrar el modal de carga y redirigir
            Swal.close(); 
            clearInterval(swalInstance._progressInterval);
            logoutAndRedirect(errorMessage);

            // Devolvemos un array vacío ya que la operación falló.
            return [];
        }

    if (!response.ok) {
      // CORRECCIÓN: Maneja respuestas no-JSON usando text() con try-catch
      let errorMessage;
      try {
        const errorData = await response.text(); // Cambiado a text() para mayor robustez
        // Intenta parsear como JSON si es posible
        const parsed = JSON.parse(errorData);
        errorMessage = parsed.message || `Error en la edición: ${response.status}`;
      } catch {
        errorMessage = `Error en la edición: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    clearInterval(swalInstance._progressInterval);
    await new Promise(resolve => setTimeout(resolve, 1000));
    Swal.close();

    Swal.fire({
      icon: "success",
      title: successTitle,
      text: successMessage,
      showConfirmButton: false,
      timer: 1500
    });

    return result;
  } catch (error) {
    if (swalInstance && swalInstance._progressInterval) {
      clearInterval(swalInstance._progressInterval);
    }
    Swal.close();

    if (error.name === 'TimeoutError') {
      Swal.fire({
        title: 'Tiempo de espera agotado',
        text: 'Intenta de nuevo más tarde.',
        icon: 'warning',
      });
    } else {

      if (typeof Toast !== 'undefined') {
        Toast.fire({
          icon: "error",
          title: `${errorTitle}: ${error.message}`,
        });
      } else {
        console.error('Toast no definido:', error.message);
      }
    }
    console.error('Error completo:', error);
    return false;
  }
}




export async function handlePOST(config) {
  const {
    url,
    data,
    timeoutDuration = 3000,
    successTitle = 'Datos agregados exitosamente',
    successMessage = 'Los datos han sido agregados exitosamente.',
    loadingTitle = 'Procesando...',
    loadingText = 'Por favor, espera mientras se procesan los datos.',
    errorTitle = 'Error al agregar datos',
  } = config;



  // Validaciones iniciales
  if (!url || !data) {
    console.error('Error: URL y data son requeridos.');
    Swal.fire({
      title: 'Error',
      text: 'Faltan parámetros obligatorios.',
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
    return false;
  }

  let progress = 0;
  let swalInstance;
  try {
    swalInstance = Swal.fire({
      title: `${loadingTitle} (0%)`,
      text: loadingText,
      icon: 'info',
      allowOutsideClick: false,
      backdrop: true,
      didOpen: () => {
        Swal.showLoading();
        const progressInterval = setInterval(() => {
          progress += 5;
          if (progress > 100) progress = 100;
          Swal.getTitle().textContent = `${loadingTitle} (${progress}%)`;
        }, 300);
        swalInstance._progressInterval = progressInterval;
      },
    });
  } catch (error) {
    console.error('Error al mostrar modal de carga:', error);
    return false;
  }

  try {
    console.log("URL completa:", url);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(timeoutDuration),
      credentials: 'include',
    });

    //VERIFICA DI LA RESPUESTA ES 401 Y REALIZA LOGOUT Y REDIRECCION A INICIO DE SESION
    if (response.status === 401) {
            // Si el servidor devuelve 401, forzamos el logout y la redirección
            let errorMessage = "Tu sesión ha expirado. Vuelve a iniciar sesión.";
            
            try {
                // Intentamos leer el mensaje de error del cuerpo JSON de la respuesta
                const errorResponse = await response.json(); 
                errorMessage = errorResponse.message || errorMessage;
            } catch (e) {
                // Si el cuerpo no es JSON, usamos el mensaje por defecto
            }
            
            // Cerrar el modal de carga y redirigir
            Swal.close(); 
            clearInterval(swalInstance._progressInterval);
            logoutAndRedirect(errorMessage);

            // Devolvemos un array vacío ya que la operación falló.
            return [];
        }

    if (!response.ok) {
      // Maneja respuestas no-JSON usando text() con try-catch
      let errorMessage;
      try {
        const errorData = await response.text();
        const parsed = JSON.parse(errorData);
        errorMessage = parsed.message || `Error al agregar: ${response.status}`;
      } catch {
        errorMessage = `Error al agregar: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    clearInterval(swalInstance._progressInterval);
    await new Promise(resolve => setTimeout(resolve, 1000));
    Swal.close();

    Swal.fire({
      icon: "success",
      title: successTitle,
      text: successMessage,
      showConfirmButton: false,
      timer: 1500
    });

    // AJUSTE: Retorna un objeto con success, data y id (si existe)
    return {
      success: true,
      data: result,
      id: result.id || null, // Asume que el ID está en result.id; ajusta si es otro campo (ej. result.facturaId)
    };
  } catch (error) {
    if (swalInstance && swalInstance._progressInterval) {
      clearInterval(swalInstance._progressInterval);
    }
    Swal.close();

    if (error.name === 'TimeoutError') {
      Swal.fire({
        title: 'Tiempo de espera agotado',
        text: 'Intenta de nuevo más tarde.',
        icon: 'warning',
      });
    } else {
      if (typeof Toast !== 'undefined') {
        Toast.fire({
          icon: "error",
          title: `${errorTitle}: ${error.message}`,
        });
      } else {
        console.error('Toast no definido:', error.message);
      }
    }
    console.error('Error completo:', error);
    return false;
  }
}
export async function handleGETHiddenCookie(config) {
  const {
    url,
    data = {}, // Opcional: objeto para query params
    timeoutDuration = 3000,
    successTitle = 'Datos obtenidos exitosamente',
    successMessage = 'Los datos han sido obtenidos exitosamente.',
    loadingTitle = 'Cargando...',
    loadingText = 'Por favor, espera mientras se obtienen los datos.',
    errorTitle = 'Error al obtener datos',
  } = config;

  // Validaciones iniciales
  if (!url) {
    console.error('Error: URL es requerida.');
    return false;
  }

  // Construir URL con query params si data está presente
  let fullUrl = url;
  if (data && typeof data === 'object' && Object.keys(data).length > 0) {
    const params = new URLSearchParams(data);
    fullUrl += `?${params.toString()}`;
  }

  let progress = 0;
  let swalInstance;


  try {

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(timeoutDuration),
      credentials: 'include',
    });

    //VERIFICA DI LA RESPUESTA ES 401 Y REALIZA LOGOUT Y REDIRECCION A INICIO DE SESION
    if (response.status === 401) {
            // Si el servidor devuelve 401, forzamos el logout y la redirección
            let errorMessage = "Tu sesión ha expirado. Vuelve a iniciar sesión.";
            
            try {
                // Intentamos leer el mensaje de error del cuerpo JSON de la respuesta
                const errorResponse = await response.json(); 
                errorMessage = errorResponse.message || errorMessage;
            } catch (e) {
                // Si el cuerpo no es JSON, usamos el mensaje por defecto
            }
            
            // Cerrar el modal de carga y redirigir
            Swal.close(); 
            clearInterval(swalInstance._progressInterval);
            logoutAndRedirect(errorMessage);

            // Devolvemos un array vacío ya que la operación falló.
            return [];
        }

        

    if (!response.ok) {
      // Maneja respuestas no-JSON usando text() con try-catch
      let errorMessage;
      try {
        const errorData = await response.text();
        const parsed = JSON.parse(errorData);
        errorMessage = parsed.message || `Error al obtener: ${response.status}`;
      } catch {
        errorMessage = `Error al obtener: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Retorna un objeto con success y data (sin id, ya que GET no crea recursos típicamente)
    return {
      success: true,
      data: result,
    };
  } catch (error) {

    if (error.name === 'TimeoutError') {
      console.error('Error de timeout:', error);
    } else {
      if (typeof Toast !== 'undefined') {
        console.error('Error general:', error);
      } else {
        console.error('Toast no definido:', error.message);
      }
    }
    console.error('Error completo:', error);
    return false;
  }
}


export const textInputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea');
textInputs.forEach(input => {
  input.addEventListener('input', function () {
    this.value = this.value.toUpperCase();
  });
});

// Función para cambiar el texto del label del switch
export function cambiarLabelSwitch(idSwitch, nuevoTexto) {
  const labelElement = document.querySelector(`label[for="${idSwitch}"]`);
  if (labelElement) {
    labelElement.textContent = nuevoTexto;
  }
}

export function obtenerValorRadioSeleccionado(nombreGrupo) {
  const radios = document.getElementsByName(nombreGrupo);
  for (let radio of radios) {
    if (radio.checked) {
      return radio.value;  // Retorna el valor del radio seleccionado
    }
  }
  return null;  // Si ninguno está seleccionado
}

export function obtenerEstadoSwitch(idSwitch) {
  const switchElement = document.getElementById(idSwitch);
  if (switchElement) {
    return switchElement.checked ? 1 : 0;  // Retorna 1 si activado, 0 si no (como números)
  }
  console.warn(`Switch con ID "${idSwitch}" no encontrado.`);
  return 0;  // Valor por defecto si no se encuentra
}







