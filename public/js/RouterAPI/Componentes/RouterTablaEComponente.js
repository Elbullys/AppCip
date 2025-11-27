import {
    conversionFecha, handleDataTableLoadingGET, General,
    handleDataTableLoadingPOST, handlePOST, handlePUT, cambiarLabelSwitch,
    obtenerValorRadioSeleccionado, obtenerEstadoSwitch, handleGET, URLAPI
} from '../Utils.js';

const api = URLAPI;


//const api ='https://apirestcip.onrender.com';
const databusqueda = document.getElementById('codigoTIValue').textContent;

const queryParams = new URLSearchParams(); // Inicializar queryParams
const componenteoData = {};
let id_componente = null;
let EstadoInventario = null;
let modal = null;
let textoFormateado = null;
let fecha = null;
let Fechafactura = null;
let fecharegistro = null;
let fechacompra = null;

//PARA ALERTAS TOAST SWEETALERT2
var Toast = Swal.mixin({
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
    const btnEditar = document.getElementById('btnEditar');
    const btnVisualizar = document.getElementById('btnVisualizar');
    const btnmaximizarColumnas = document.getElementById('toggleColumns');//toggleColumns
    
    // --- VARIABLES DE ÁMBITO CORREGIDO ---
    let table; // Declarada aquí para ser accesible por los listeners
    let columnsVisible = false; // Declarada aquí para manejar el estado de las columnas
    // ------------------------------------

    inicializarDataTableComponentes(databusqueda);


    // DATATABLES INICIARLIZAR COMPONENTE
    function inicializarDataTableComponentes(databusqueda) {
        var url = `${api}/api/componentes/ConsultarCodigoTINumSerie/${databusqueda}`; // URL de la API para obtener los datos
        
        const configBase = {
            "columns": [
                {
                    "data": 'id_componente',
                    "render": function (data, type, row) {
                        // Aquí se guarda el ID de la primera fila. 
                        // NOTA: Si hay varias filas, solo se guarda el ID de la última.
                        id_componente = data;
                        return data;
                    }
                },
                { "data": 'codigo_TI' },
                { "data": 'tipo_equipo' },
                { "data": 'marca' },
                { "data": 'modelo' },
                { "data": 'numero_serie' },
                {
                    // Esta columna está en el índice 6
                    "data": null, // No se usa un campo específico
                    "render": function (data, type, row) {
                        const idUnidad = row.id_unidad.toString(); // Convertir a string
                        const idContrato = row.num_contrato_actual; 
                        const operacion = row.operacion;
                        const unidad = row.nombre_unidad;
                        EstadoInventario = row.status_inventario;
                        let ceros = '';

                        if (operacion === 'GUANAJUATO') {
                            if (idUnidad.length === 1) {
                                ceros = '00';
                            } else if (idUnidad.length === 2) {
                                ceros = '0';
                            } else if (idUnidad.length === 3) {
                                ceros = '';
                            }
                            // Concatenar id_contrato, ceros y id_unidad
                            return idContrato + ceros + idUnidad + "-" + unidad;
                        } else {
                            return idUnidad + "-" + unidad;
                        }
                    },
                    "title": "Nombre de la Unidad"
                },
                // Columnas de la 7 a la 11 (Ocultables)
                { "data": 'area' }, // 7
                { "data": 'nombre_responsable' }, // 8
                { "data": 'observaciones' }, // 9
                { "data": 'status_componente' }, // 10
                {
                    "data": 'status_inventario', // 11
                    "render": function (data, type, row) {
                        if (data === 1) {
                            return '<span class="text-success">ACTIVO</span>';
                        } else if (data === 0) {
                            return '<span class="text-danger">INACTIVO</span>';
                        } else {
                            return '<span class="text-warning">DESCONOCIDO</span>';
                        }
                    },
                    "title": "Estado del Componente"
                }

            ],
            language: {
                zeroRecords: "No se encontraron resultados",
                emptyTable: "No hay datos disponibles",
            },
            dom: 't',
            paging: false,
            info: false,
            ordering: true,
            responsive: true,
            destroy: true // Opción clave: destruye automáticamente si ya existe

        };
        handleDataTableLoadingGET({
            url: url,
            timeoutDuration: 60000,
        }).then((data) => {
            if (data && Array.isArray(data) && data.length > 0) {  // Verificación de éxito
                // ASIGNAR LA INSTANCIA DE LA TABLA CREADA A LA VARIABLE 'table'
                table = $('#table_componentes').DataTable({
                    ...configBase,
                    data: data,  // Usa los datos retornados
                });
                
                ocultarColumnas(table);
                // Establece el estado inicial después de ocultarlas
                columnsVisible = false;
            }

        });
    }
    
    // --- LISTENERS ---

    if (btnEditar) {
        btnEditar.addEventListener('click', EnviarFormEditarComponente);
    }

    if (btnVisualizar) { // Corregido: Usar if (btnVisualizar) en lugar de if (btnEditar)
        btnVisualizar.addEventListener('click', verDetallesComponente);
    }

    if (btnmaximizarColumnas) {
        btnmaximizarColumnas.addEventListener('click', () => {
            // Se llama a la función externa y se le pasa el callback para actualizar el estado
            maximizarColumnas(
                table,
                columnsVisible,
                (newState) => { columnsVisible = newState; }
            );
        });
    }

    // --- FUNCIONES LÓGICAS ---

    function EnviarFormEditarComponente() {
        if (id_componente === undefined || id_componente === null || id_componente === '') {
            Toast.fire({
                icon: "warning",
                title: "Error al enviar el formulario: ID de componente no encontrado.",
            });
            return;
        }
        else {

            if (EstadoInventario.toString() === "0") {

                // Muestra el toast de pregunta
                Swal.fire({
                    title: '¿Advertencia?',
                    text: 'Esta apunto de Actualizar Un Componente El cual Ha sido Dado De baja, Si lo modificas se Ocasionará Un Descuadre En los Inventario , por consecuencia si se modifica esta bajo responsabilidad del técnico ¿Esta seguro de realizarlo ?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, proceder',
                    cancelButtonText: 'No, cancelar',
                    reverseButtons: false,
                    customClass: {
                        confirmButton: 'btn btn-success',
                        cancelButton: 'btn btn-danger'
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Si el usuario confirma, redirige después de 1 segundo
                        setTimeout(() => {
                            window.location.href = `/FormularioEditarComponente/${id_componente}`;
                        }, 1000);
                    }
                });


            }
            else {
                window.location.href = `/FormularioEditarComponente/${id_componente}`;
            }

        }

    }

    async function verDetallesComponente() {
       
        // Validar id
        if (isNaN(id_componente)) {

            Toast.fire({
                icon: "warning",
                title: "Búsqueda inválida ",

            });
            return;
        }

        modal = $('#detallecomponenteQR');

        // Cerrar el modal si está abierto
        if (modal.hasClass('show')) {
            modal.modal('hide');
            modal.one('hidden.bs.modal', function () {
                cargarComponenteQR(modal);
            });
        } else {
            // Cargar detalles y abrir el modal
            cargarComponenteQR(modal);
        }
    }


    async function cargarComponenteQR(modal) {
      

        const config = {
            url: `${api}/api/componentes/ConsultarIdComponente/${id_componente}`, // URL específica
            timeoutDuration: 5000, 
        };
        const response = await handleGET(config);
        const result = response.data;

        if (result.body.length > 0) {
            const data = result; // Accede al primer elemento del array
           
            const idUnidad = String(data.body[0].id_unidad);

            // Convertir a cadena para manipulación
            // Verificar la longitud del ID y agregar ceros según sea necesario
            if (idUnidad.length === 1) {
                textoFormateado = '00' + idUnidad; // Agregar 2 ceros si tiene 1 dígito
            } else if (idUnidad.length === 2) {
                textoFormateado = '0' + idUnidad; // Agregar 1 cero si tiene 2 dígitos
            }
            else if (idUnidad.length === 3) {
                textoFormateado = idUnidad;
            }

            // Formatear las fechas
            fecha = data.body[0].FechaFactura;
            Fechafactura = conversionFecha(fecha);
            fecha = data.body[0].FechaRegistro;
            fecharegistro = conversionFecha(fecha);
            fecha = data.body[0].FechaCompra;
            fechacompra = conversionFecha(fecha);


            // Limpiar contenido previo
            document.getElementById('idunidad').innerText = String(data.body[0].num_contrato_actual) + textoFormateado;
            document.getElementById('tecnicoregistro').innerText = data.body[0].nombre;
            document.getElementById('fecharegistro').innerText = fecharegistro;
            document.getElementById('fechacompra').innerText = fechacompra;
            document.getElementById('clienteservidor').innerText = data.body[0].EsClienteServidor;
            document.getElementById('numerofactura').innerText = data.body[0].NumeroFactura;
            document.getElementById('nombreproveedor').innerText = data.body[0].NombreProveedor;
            document.getElementById('lugarcompra').innerText = data.body[0].LugarCompra;
            document.getElementById('fechafactura').innerText = Fechafactura;
            document.getElementById('nombreResponsable').innerText = data.body[0].nombre_responsable;
            document.getElementById('nombreUnidad').innerText = data.body[0].nombre_unidad;
            document.getElementById('tipoEquipo').innerText = data.body[0].tipo_equipo;
            document.getElementById('marca').innerText = data.body[0].marca;
            document.getElementById('modelo').innerText = data.body[0].modelo;
            document.getElementById('numeroSerie').innerText = data.body[0].numero_serie;
            document.getElementById('codigoTI').innerText = data.body[0].codigo_TI;
            document.getElementById('operacion').innerText = data.body[0].operacion;
            document.getElementById('statusComponente').innerText = data.body[0].status_componente;
            document.getElementById('observaciones').innerText = data.body[0].observaciones;
            document.getElementById('area').innerText = data.body[0].area;
            document.getElementById('statusInventario').innerText = data.body[0].status_inventario === 1 ? 'ACTIVO' : 'INACTIVO';
            // Mostrar el modal con Bootstrap 5
            const bootstrapModal = new bootstrap.Modal(document.getElementById('detallecomponenteQR'));
            bootstrapModal.show();
        }

    }
});

// ----------------------------------------------------------------------
// FUNCIONES DE UTILIDAD PARA VISIBILIDAD DE COLUMNAS (MANTENIENDO EL ESTADO)
// ----------------------------------------------------------------------

function ocultarColumnas(tableInstance) {
    if (!tableInstance) {
      
        return;
    }

    // 1. Ocultar la primera columna (id_componente) - Índice 0.
    tableInstance.column(0).visible(false); 
    
    // 2. Ocultar las columnas 6 a 11.
    for (let i = 6; i <= 11; i++) {
        tableInstance.column(i).visible(false); 
    }
    

}


function maximizarColumnas(tableInstance, currentVisibleState, setVisibleStateCallback) {
    if (!tableInstance) {
     
        return;
    }
    
    // Alternar la visibilidad de las columnas 6 a 11
    if (currentVisibleState) {
      
        // Ocultar columnas 6-11
        for (let i = 6; i <= 11; i++) {
            tableInstance.column(i).visible(false);
        }
    } else {
     
        // Mostrar columnas 6-11
        for (let i = 6; i <= 11; i++) {
            tableInstance.column(i).visible(true);
        }
    }
    
    // Llamar al callback para cambiar el estado en el archivo principal
    setVisibleStateCallback(!currentVisibleState);
}