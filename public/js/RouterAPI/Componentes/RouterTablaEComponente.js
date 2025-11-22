const api = 'http://localhost:7000';
const databusqueda = document.getElementById('codigoTIValue').textContent;

const queryParams = new URLSearchParams(); // Inicializar queryParams
const componenteoData = {};
let EstadoInventario = null;
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

//AL ABRIR LA PAGINA
window.onload = function () {
    // Inicializar DataTable al cargar la página


    //var table = $('#table-componentes').DataTable(); 

    //ocultarColumnas();
    inicializarDataTableComponentes(databusqueda);
    ocultarColumnas();




    // Variable para controlar el estado de las columnas
    var columnsVisible = false;
    $('#toggleColumns').on('click', function () {
        console.log("Toggle button clicked");

        // Alternar la visibilidad de las columnas
        if (columnsVisible) {
            console.log("Hiding columns");
            // Ocultar columnas (ejemplo: ocultar la segunda y la tercera columna)


            table.column(6).visible(false); // Ocultar
            table.column(7).visible(false); // Ocultar
            table.column(8).visible(false); // Ocultar
            table.column(9).visible(false); // Ocultar
            table.column(10).visible(false); // Ocultar
            table.column(11).visible(false); // Ocultar





        } else {
            console.log("Showing columns");
            // Mostrar columnas

            table.column(6).visible(true); // MOSTRAR
            table.column(7).visible(true); // MOSTRAR
            table.column(8).visible(true); // MOSTRAR
            table.column(9).visible(true); // MOSTRAR
            table.column(10).visible(true); // MOSTRAR
            table.column(11).visible(true); // MOSTRAR



        }
        // Cambiar el estado
        columnsVisible = !columnsVisible;
    });

}

function ocultarColumnas() {
    // Ocultar columnas (ejemplo: ocultar la segunda y la tercera columna)

    $('#table_componentes').DataTable().column(6).visible(false); // Ocultar
    $('#table_componentes').DataTable().column(7).visible(false); // Ocultar
    $('#table_componentes').DataTable().column(8).visible(false); // Ocultar
    $('#table_componentes').DataTable().column(9).visible(false); // Ocultar
    $('#table_componentes').DataTable().column(10).visible(false); // Ocultar
    $('#table_componentes').DataTable().column(11).visible(false); // Ocultar



}
//PERMITE BUSCAR EL COMPONENTE Y VERIFICAR SI EXISTE EN LA BASE DE DATOS, SI EXISTE LO MUESTRA EN LA TABLA
function inicializarDataTableComponentes(databusqueda) {


    var url = `${api}/api/componentes/ConsultarCodigoTINumSerie/${databusqueda}`; // URL de la API para obtener los datos

    table = $('#table_componentes').DataTable({
        // "processing": true, // Habilita el procesamiento
        // "serverSide": true, // Activa el procesamiento del lado del servidor
        "ajax": {
            "url": url,
            "method": "GET",
            "dataSrc": "body",  // Accede a la propiedad "body" del JSON
            "error": function (jqXHR, textStatus, errorThrown) {
                Toast.fire({
                    icon: "warning",
                    title: "Ocurrio Un Error Al Cargar Los Datos",

                });

            }
        },
        "columns": [
            {
                "data": 'id_componente',
                "render": function (data, type, row) {
                    // Guardar en variable (puedes usarla luego donde necesites)
                    id_componente = data;

                    // Opcional: Mostrar en consola para verificar
                    console.log("ID Componente:", id_componente);
                    // Retornar el valor para mostrarlo en la columna
                    return data;
                }
            },
            { "data": 'codigo_TI' },
            { "data": 'tipo_equipo' },
            { "data": 'marca' },
            { "data": 'modelo' },
            { "data": 'numero_serie' },
            {
                "data": 'num_contrato_actual',
                "data": null, // No se usa un campo específico
                "render": function (data, type, row) {
                    const idUnidad = row.id_unidad.toString(); // Convertir a string
                    const idContrato = row.num_contrato_actual; // Suponiendo que id_contrato está en la fila
                    const operacion = row.operacion;
                    const unidad = row.nombre_unidad;
                    EstadoInventario = row.status_inventario;
                    let ceros = '';
                    if (operacion === 'GUANAJUATO') {
                        if (idUnidad.length === 1) {
                            ceros = '00'; // Agregar 2 ceros si tiene 1 carácter
                        }
                        else if (idUnidad.length === 2) {
                            ceros = '0'; // Agregar 1 cero si tiene 2 caracteres
                        }
                        else if (idUnidad.length === 3) {
                            ceros = ''; // Agregar 1 cero si tiene 2 caracteres
                        }

                        // Concatenar id_contrato, ceros y id_unidad
                        return idContrato + ceros + idUnidad + "-" + unidad;

                    }
                    else {
                        return idUnidad + "-" + unidad;
                    }

                },
                "title": "Nombre de la Unidad"
            },


            { "data": 'area' },
            { "data": 'nombre_responsable' },
            { "data": 'observaciones' },
            { "data": 'status_componente' },
            {
                "data": 'status_inventario',
                "render": function (data, type, row) {
                    if (data === 1) {
                        return '<span class="text-success">ACTIVO</span>'; // Muestra "Activo" en verde
                    } else if (data === 0) {
                        return '<span class="text-danger">INACTIVO</span>'; // Muestra "Inactivo" en rojo
                    } else {
                        return '<span class="text-warning">DESCONOCIDO</span>'; // Muestra "Desconocido" en amarillo
                    }
                },
                "title": "Estado del Componente"
            }

        ],
        "language": {
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sInfo": "Mostrando de _START_ a _END_ de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando 0 a 0 de 0 registros",
            "sInfoFiltered": "(filtrado de _MAX_ registros totales)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ",",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
        },
        "responsive": true
    });


}
/*BOTONES ACCION*/

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
                title: '¿Advertencia',
                text: 'Esta apunto de Actualizar Un Componente El cual Ha sido Dado De baja, Si lo modificas se Ocasionará Un Descuadre En los Inventario , por consecuencia si se modifica esta bajo responsabilidad del técnico ¿Esta seguro de realizarlo ?',
                icon: 'question',
                showCancelButton: true,  
                confirmButtonText: 'Sí, proceder',
                cancelButtonText: 'No, cancelar',
                reverseButtons: false, 
                customClass: {
                    confirmButton: 'btn btn-success',  // Clases CSS personalizadas (opcional)
                    cancelButton: 'btn btn-danger'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    // Si el usuario confirma, redirige después de 1 segundo
                    setTimeout(() => {
                        window.location.href =  `/FormularioEditarComponente/${id_componente}`;
                    }, 1000);
                } 
            });



        }
        else{
   window.location.href = `/FormularioEditarComponente/${id_componente}`;
        }
       
     
        //Mostrar_Info_Componente/codigoti




    }





}

async function verDetallesComponente() {
    //databusqueda=document.getElementById('codigoTIValue').textContent;
    console.log(id_componente);
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
    console.log("Cargando detalles del componente para:", id_componente);
    console.log("Modal:", modal);


    try {
        const response = await fetch(`${api}/api/componentes/ConsultarIdComponente/${id_componente}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' } // Este encabezado no es necesario para GET
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Datos recibidos:", data);

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
        Fechafactura = General.ConversionFecha(fecha);
        fecha = data.body[0].FechaRegistro;
        fecharegistro = General.ConversionFecha(fecha);
        fecha = data.body[0].FechaCompra;
        fechacompra = General.ConversionFecha(fecha);


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

    } catch (error) {
        Toast.fire({
            icon: "error",
            title: "Error al cargar los detalles:  ",
        });
        console.log(error);
    }
}

class General {
    static ConversionFecha(fecha) {
        const date = new Date(fecha);
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
        const anio = date.getFullYear();
        return `${dia}-${mes}-${anio}`; // Usar comillas invertidas para la interpolación
    }
}




