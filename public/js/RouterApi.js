
//MUESTRA TODOS LOS COMPONENTES DE LA BASE DE DATOS, SE UTILIZA PARA EL FILTRO DE BUSQUEDA DEL "CONSULTAR_COMPONENTES.EJS" 
function inicializarDataTable() {
    var url = 'http://localhost:7000/api/componentes';
    var idContrato;
    $('#tablaComponentes').DataTable({
       // "processing": true, // Habilita el procesamiento
       // "serverSide": true, // Activa el procesamiento del lado del servidor
        "ajax": {
            "url": url,
            "method": "GET",
            "dataSrc": "body",  // Accede a la propiedad "body" del JSON
            "error": function(jqXHR, textStatus, errorThrown) {
                // Muestra una alerta en caso de error
                alert("Error al cargar los datos: " + textStatus + " - " + errorThrown);
            }
        },
        "columns": [
            {
                "data": 'num_contrato_actual',
                "data": null, // No se usa un campo específico
                "render": function(data, type, row) {
                    const idUnidad = row.id_unidad.toString(); // Convertir a string
                    const idContrato = row.num_contrato_actual; // Suponiendo que id_contrato está en la fila
                    const operacion= row.operacion;
                    let ceros = '';
                    if(operacion=== 'GUANAJUATO')
                    {
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
                        return idContrato + ceros + idUnidad;

                    }
                    else
                    {
                        return   idUnidad;
                    }
                   
                },
                "title": "ID Unidad"
            },
          
            /*{"data": 'nombre_responsable'},*/
            {"data": 'nombre_unidad'},
            {"data": 'tipo_equipo'},
            {"data": 'marca'},
            {"data": 'modelo'},
            {"data": 'numero_serie'},
            {"data": 'codigo_TI'},
            {
                "data": null,  // No hay datos directos para esta columna
                "render": function(data, type, row) {
                    return `
                        <a href="#editEmployeeModal" class="edit" data-toggle="modal">
			<i class="material-icons" data-toggle="swap_vert" title="Visualizar">visibility</i></a>
            <a href="#deleteEmployeeModal" class="delete" data-toggle="modal">
			<i class="material-icons" data-toggle="swap_vert" title="Editar">edit</i></a>
                    `;
                }
            }
            /*{"data": 'operacion'},*/
            
            /*{"data": 'observaciones'},
            {"data": 'status_componente'},
            {"data": 'area'},
            {
                "data": 'status_inventario',
                "render": function(data, type, row) {
                    if (data === 1) {
                        return '<span class="text-success">Activo</span>'; // Muestra "Activo" en verde
                    } else if (data === 0) {
                        return '<span class="text-danger">Inactivo</span>'; // Muestra "Inactivo" en rojo
                    } else {
                        return '<span class="text-warning">Desconocido</span>'; // Muestra "Desconocido" en amarillo
                    }
                },
                "title": "Estado del Componente"
            }*/
            

        ],
        "language": {
            "sProcessing":   "Procesando...",
            "sLengthMenu":   "Mostrar _MENU_ registros",
            "sZeroRecords":  "No se encontraron resultados",
            "sInfo":         "Mostrando de _START_ a _END_ de _TOTAL_ registros",
            "sInfoEmpty":    "Mostrando 0 a 0 de 0 registros",
            "sInfoFiltered": "(filtrado de _MAX_ registros totales)",
            "sInfoPostFix":  "",
            "sSearch":       "Buscar:",
            "sUrl":          "",
            "sInfoThousands":  ",",
            "oPaginate": {
                "sFirst":    "Primero",
                "sLast":     "Último",
                "sNext":     "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
        },
        "responsive": true
    });
}