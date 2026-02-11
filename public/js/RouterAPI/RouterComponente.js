
import { General, handlePOST,conversionFecha, URLAPI,obtenerUsuarioLocalStorage } from '../RouterAPI/Utils.js';  // Importa tus utilidades
const api = URLAPI;

let accion = ""; 


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



document.addEventListener('DOMContentLoaded', () => {
    //OBTENER DE LOCALSTORAGE NOMBRE DE USUARIO EN PERFIL 
           obtenerUsuarioLocalStorage();
   

    const btonmanual = document.getElementById('btnmanual'); 
    const btnSearch = document.getElementById('btnSearch'); // Botón para buscar
    const actionButton = document.getElementById('action-button'); // Botón para editar

    
    // Evento para el botón de Búsqueda
    if (actionButton) {
        
        const buttonText = actionButton.innerText.trim();
        
        if (buttonText === 'Consulta') {
            accion = "buscar_componente";

            actionButton.classList.add('btn-primary'); 
        } else if (buttonText === 'Editar') {
            accion = "editar_componente";
            actionButton.classList.add('btn-warning');
        } else {
            console.error("Modo de acción no reconocido.");
            return;
        }

        // 3. Definición del Evento 
        actionButton.addEventListener('click', () => {
            // Llama a la función principal
            Verificacion_Componente();
        });
    }

    // Evento para el botón manual 
  
    if (btonmanual) {

    }

  
});



 //* Muestra los detalles de un componente después de una búsqueda exitosa.

function verDetallesComponenteQR() {
    const databusqueda = document.getElementById('qr-result').value;

    
    if (!databusqueda) {
        Toast.fire({
            icon: "warning",
            title: "No se ha proporcionado ningun dato de búsqueda",
        });
        return;
    }


    //DECLARACION DE MODAL
    const modalElement = document.getElementById('detallecomponenteQR');
    const bootstrapModal = bootstrap.Modal.getOrCreateInstance(modalElement);
    
 
    if (modalElement.classList.contains('show')) {
        bootstrapModal.hide();
        modalElement.addEventListener('hidden.bs.modal', function handler() {
            
            cargarComponenteQR(databusqueda, modalElement);
            modalElement.removeEventListener('hidden.bs.modal', handler); 
        }, { once: true });
    } else {
        cargarComponenteQR(databusqueda, modalElement);
    }
}

async function cargarComponenteQR(databusqueda, modal) {
  
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
        

        const componente = data.body[0];

 
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
        const Fechafactura = conversionFecha(componente.FechaFactura);
        const fecharegistro = conversionFecha(componente.FechaRegistro);
        const fechacompra = conversionFecha(componente.FechaCompra);

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

         if (response.status === 401) {
            Swal.close();
           
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