// const api ='https://apirestcip.onrender.com';
import { General, handlePOST, URLAPI } from '../Utils.js';  // Importa tus utilidades
const api = URLAPI;

// Declaraciones de alcance global que son necesarias
let accion = ""; // Se usará para diferenciar entre buscar y editar

// Clase de utilidades para la conversión de fecha
class General {
    static ConversionFecha(fecha) {
        const date = new Date(fecha);
        // Verificar si la fecha es inválida
        if (isNaN(date.getTime())) {
            return "Fecha inválida"; 
        }
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
        const anio = date.getFullYear();
        return `${dia}-${mes}-${anio}`;
    }
}

// PARA ALERTAS TOAST SWEETALERT2
const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});

// --- Funciones del DOMContentLoaded ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtención de Elementos del DOM
    // Asumiendo que existen estos IDs en tu HTML
    const btonmanual = document.getElementById('btnmanual'); 
    const btnSearch = document.getElementById('btnSearch'); // Botón para buscar
    const actionButton = document.getElementById('action-button'); // Botón para editar
    
    // 2. Inicialización de Variables y Datos
    // No son estrictamente necesarias aquí, pero se mantienen por coherencia
    // const queryParams = new URLSearchParams(); 
    // const componenteoData = {};

    // 3. Definición de Eventos
    
    // Evento para el botón de Búsqueda
    if (actionButton) {
        // 2. Determinar la acción inicial leyendo el texto que EJS ya renderizó
        const buttonText = actionButton.innerText.trim();
        
        if (buttonText === 'Consulta') {
            accion = "buscar_componente";
            // Opcional: Asegurar la clase si no viene del EJS, aunque en tu caso ya lo hace.
            actionButton.classList.add('btn-primary'); 
        } else if (buttonText === 'Editar') {
            accion = "editar_componente";
            actionButton.classList.add('btn-warning');
        } else {
            console.error("Modo de acción no reconocido.");
            return;
        }

        // 3. Definición del Evento (Común para ambos modos)
        actionButton.addEventListener('click', () => {
            // Llama a la función principal, usando la variable 'accion' ya configurada
            Verificacion_Componente();
        });
    }

    // Evento para el botón manual (si debe tener un comportamiento específico)
    // Se deja como estaba en tu código original, si se usaba para algo más
    if (btonmanual) {
         // Ejemplo: btonmanual.addEventListener('click', () => { /* tu lógica */ });
    }

    // *Nota: La función Search() y Edit() ya no son necesarias y se eliminan,
    // *su lógica se integra directamente en los event listeners.
});

// --- Funciones Asíncronas y Lógica de Negocio ---

function logoutAndRedirect(message) {
     // 3. Redirigir al login después de un breve momento
    setTimeout(() => {
        window.location.href = '/logintecnico';
    }, 1500); // 1.5 segundos para que el usuario vea el mensaje

}

/**
 * Muestra los detalles de un componente después de una búsqueda exitosa.
 */
function verDetallesComponenteQR() {
    const databusqueda = document.getElementById('qr-result').value;
    console.log(databusqueda);
    
    if (!databusqueda) {
        Toast.fire({
            icon: "warning",
            title: "No se ha proporcionado ningun dato de búsqueda",
        });
        return;
    }

    // **Nota:** En un entorno moderno, es mejor usar new bootstrap.Modal()
    // En lugar de acceder a jQuery (si #detallecomponenteQR es un modal de Bootstrap)
    const modalElement = document.getElementById('detallecomponenteQR');
    const bootstrapModal = bootstrap.Modal.getOrCreateInstance(modalElement);
    
    // Si el modal está abierto, lo cierra y luego recarga. Si no, lo carga directamente.
    if (modalElement.classList.contains('show')) {
        bootstrapModal.hide();
        modalElement.addEventListener('hidden.bs.modal', function handler() {
            console.log("Modal cerrado, recargando datos...");
            cargarComponenteQR(databusqueda, modalElement);
            modalElement.removeEventListener('hidden.bs.modal', handler); // Limpiar listener
        }, { once: true });
    } else {
        cargarComponenteQR(databusqueda, modalElement);
    }
}

/**
 * Carga los datos del componente desde el API y los muestra en el modal.
 */
async function cargarComponenteQR(databusqueda, modal) {
    console.log("Cargando detalles del componente para:", databusqueda);
    const queryParams = new URLSearchParams({
        dataBusqueda: databusqueda,
    });

    try {
        const response = await fetch(`${api}/api/componentes/BusquedaComponenteCodigoTINumSerie?${queryParams}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

       
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Asumiendo que `General` está definido y tiene `ConversionFecha`
        const componente = data.body[0];

        // Lógica de formateo del ID de la unidad
        let textoFormateado;
        const idUnidad = String(componente.id_unidad);
        if (idUnidad.length === 1) {
            textoFormateado = '00' + idUnidad;
        } else if (idUnidad.length === 2) {
            textoFormateado = '0' + idUnidad;
        } else {
            textoFormateado = idUnidad;
        }
        
        // Conversión de fechas
        const Fechafactura = General.ConversionFecha(componente.FechaFactura);
        const fecharegistro = General.ConversionFecha(componente.FechaRegistro);
        const fechacompra = General.ConversionFecha(componente.FechaCompra);

        // Actualizar el DOM
        document.getElementById('idunidad').innerText = String(componente.num_contrato_actual) + textoFormateado;
        document.getElementById('tecnicoregistro').innerText = componente.nombre;
        document.getElementById('fecharegistro').innerText = fecharegistro;
        document.getElementById('fechacompra').innerText = fechacompra;
        document.getElementById('clienteservidor').innerText = componente.EsClienteServidor;
        document.getElementById('numerofactura').innerText = componente.NumeroFactura;
        document.getElementById('nombreproveedor').innerText = componente.NombreProveedor;
        document.getElementById('lugarcompra').innerText = componente.LugarCompra;
        document.getElementById('fechafactura').innerText = Fechafactura;
        document.getElementById('nombreResponsable').innerText = componente.nombre_responsable;
        document.getElementById('nombreUnidad').innerText = componente.nombre_unidad;
        document.getElementById('tipoEquipo').innerText = componente.tipo_equipo;
        document.getElementById('marca').innerText = componente.marca;
        document.getElementById('modelo').innerText = componente.modelo;
        document.getElementById('numeroSerie').innerText = componente.numero_serie;
        document.getElementById('codigoTI').innerText = componente.codigo_TI;
        document.getElementById('operacion').innerText = componente.operacion;
        document.getElementById('statusComponente').innerText = componente.status_componente;
        document.getElementById('observaciones').innerText = componente.observaciones;
        document.getElementById('area').innerText = componente.area;
        document.getElementById('statusInventario').innerText = componente.status_inventario === 1 ? 'ACTIVO' : 'INACTIVO';

        // Mostrar el modal
        const bootstrapModal = new bootstrap.Modal(document.getElementById('detallecomponenteQR'));
        bootstrapModal.show();

    } catch (error) {
        Toast.fire({
            icon: "error",
            title: "Error al cargar los detalles: ",
        });
        console.error(error);
    }
}

/**
 * Verifica la existencia del componente antes de buscar o editar.
 */
async function Verificacion_Componente() {
    // Obtener el valor de la búsqueda
    const databusqueda = document.getElementById('qr-result')?.value;
    
    const componenteoData = { databusqueda };

    console.log("componenteoData", componenteoData.databusqueda);
    
    // Validar datos
    if (!componenteoData.databusqueda) {
        Toast.fire({
            icon: "warning",
            title: "Favor de llenar el campo de búsqueda",
        });
        return;
    }
    
    // Construir parámetros de consulta
    const queryParams = new URLSearchParams({
        dataBusqueda: componenteoData.databusqueda,
    });
    
    const submitButton = document.getElementById(accion === 'editar_componente' ? 'btnEdit' : 'btnSearch');
    if(submitButton) submitButton.disabled = true; // Deshabilitar el botón durante la petición

    try {
        const response = await fetch(`${api}/api/componentes/VerificarExistenciaComponente?${queryParams}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        const result = await response.json(); 
        console.log("response",response);
         if (response.status === 401) {
            Swal.close();
            // Usamos la ruta de redirección del servidor si está disponible
                window.location.href = `/logintecnico`;
        }


        if (!response.ok) {
            Swal.fire({
                icon: result.icon || "error",
                title: result.message || "Ocurrió un error al solicitar la búsqueda",
                showConfirmButton: true
            });
            return;
        }

        if (result.body.error === true) {
            Swal.fire({
                icon: result.body.icon || "warning",
                title: result.body.message || "No se encontró el componente",
                showConfirmButton: true
            });
        } else if (result.body.error === false) {
            console.log("si existe:");
            
            if (accion === 'editar_componente') {
                Swal.fire({
                    icon: "success",
                    title: "Componente encontrado",
                    text: "Redirigiendo a la edición...",
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    // Redirección a la página de edición
                    window.location.href = `/EditarComponente/${componenteoData.databusqueda}`;
                });
            } else if (accion === 'buscar_componente') {
                // Muestra los detalles en el modal
                verDetallesComponenteQR();
            }

            // Deshabilitar botón manual si existe y tiene sentido
            // const btonmanual = document.getElementById('btnmanual');
            // if (btonmanual) btonmanual.disabled = true;
        } 
        
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Ocurrió un error al solicitar la búsqueda",
            showConfirmButton: true
        });
        console.error(error);
    } finally {
        // Habilitar el botón nuevamente
        if(submitButton) submitButton.disabled = false;
    }
}