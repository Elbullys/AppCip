import { conversionFecha, handleDataTableLoadingGET,General,
  handleDataTableLoadingPOST,VariablesFactura,handlePOST
 } from '../Utils.js';
const api = 'http://localhost:7000';
const idcomponente = document.getElementById('idcomponenteValue').textContent;

// Objeto para almacenar el estado del formulario (centraliza variables globales)
const estadoFormulario = {
  //UNIDADES
  IdUnidadValue: null,
  contratoid: null,
  operacion: null,
  tipo_unidad: null,
  nombre_unidad: null,
  //DISPOSITIVOS
  IdDispositivo: null,
  Dispositivo: null,
  AbrDispositivo: null,
  //AREAS
  IdArea: null,
  Nombre_Area: null,
  //CATALOGO COMPONENTES (CARACTERISTICAS)
  IdCatalogoComponente: null,
  Nombre_Catalogo: null,
  Descripcion: null,
  marca: null,
  modelo: null,
  procesador: null,
  memoria_ram: null,
  disco_duro: null,
  sistema_operativo: null,
  EsClienteServidor: null,

  //FACTURAS
  StatusFacturaEdit: false,
  IdFactura: null,
  NumeroFactura: null,
  NombreProveedor: null,
  LugarCompra: null,
  FechaFactura: null,
  Observacion: null,

  //input


  //VARIABLES DE CONTROL
  EsDispositivoMovil: null
};


// INICIALIZAR TABLA UNIDADES
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

  // Detectar si es dispositivo móvil/tablet

  // Inicializar DataTable al cargar la página
  InicializarFormulario();

  //var table = $('#table-componentes').DataTable(); 

  //ocultarColumnas();
  // Usar la función importada

  //const resultado=herencia.greet('Juan');  // Muestra: Hola, Juan!


}

async function InicializarFormulario() {

  // Reiniciar el formulario
  document.getElementById('FormEditComponente').reset();
  // Limpiar los campos de error
  const errorFields = document.querySelectorAll('.error');
  errorFields.forEach(field => field.textContent = '');
  //asignar a campo
  document.getElementById('txtidcomponente').value = idcomponente;

  const response = await fetch(`${api}/api/componentes/ConsultarIdComponente/${idcomponente}`); // Cambia la URL según tu API

  if (!response.ok) {
    Toast.fire({
      icon: "error",
      title: "Error al obtener los datos",

    });
    console.error('Error al obtener los datos');
    return;
  }

  const data = await response.json();


  // Verifica que el cuerpo de la respuesta contenga datos
  if (data.body.length > 0) {
    const componente = data.body[0]; // Accede al primer elemento del array
    // Llenar el formulario con los datos del componente
    document.getElementById('txtcodigoti').value = componente.codigo_TI;

    estadoFormulario.IdUnidadValue = componente.id_unidad.toString();
    estadoFormulario.operacion = componente.operacion.toString();
    estadoFormulario.contratoid = componente.num_contrato_actual.toString();
    estadoFormulario.tipo_unidad = componente.tipo_unidad;

    if (estadoFormulario.operacion === 'GUANAJUATO') {
      document.getElementById('txtIdUnidad').value = General.concatenar_contrato_unidad(estadoFormulario.IdUnidadValue, estadoFormulario.contratoid);
    }
    else {
      document.getElementById('txtIdUnidad').value = componente.id_unidad;
    }

    document.getElementById('txtnombreunidad').value = componente.nombre_unidad;
    document.getElementById('txtoperacion').value = componente.operacion;
    document.getElementById('txtarea').value = componente.area;
    estadoFormulario.IdDispositivo = componente.id_dispositivo
    document.getElementById('txtIddispositivo').value = estadoFormulario.IdDispositivo;
    document.getElementById('txtdispositivo').value = componente.tipo_equipo;
    document.getElementById('txtIdCatalogo').value = componente.id_catalogo_componente;
    document.getElementById('txtnombrecatalogo').value = componente.marca + ' ' + componente.modelo;
    document.getElementById('txtdescripcioncatalogo').value = componente.descripcion_modelo;
    document.getElementById('txtnumeroserie').value = componente.numero_serie;
    document.getElementById('txtobservaciones').value = componente.observaciones;
    estadoFormulario.EsClienteServidor = componente.EsClienteServidor;

    // Cargar PUESTOS
    //await SelectobtenerPuestos('AsignacionSelectPuestos'); // Llenar el select de PUESTOS
    // Seleccionar el color correspondiente
    //const selectpuesto = document.getElementById('AsignacionSelectPuestos');
    //selectpuesto.value = usuarios.IdPuesto; // Asegúrate de que este valor coincida con el value de las opciones

    document.getElementById('datefechacompra').value = conversionFecha(componente.FechaCompra);
    let clienteservidor = componente.EsClienteServidor.toString();
    console.log(clienteservidor);
    if (clienteservidor === 'SERVIDOR') {
      document.getElementById('chbxservidor').checked = true;
    }
    else if (clienteservidor === 'CLIENTE') {
      document.getElementById('chbxcliente').checked = true;
    }
    else if (clienteservidor === 'N/A') {
      document.getElementById('chbxna').checked = true;
    }
    document.getElementById('statusequiposelect').value = componente.status_componente.toString();
    document.getElementById('txidfactura').value = componente.IdFactura;
    document.getElementById('txtnumerofactura').value = componente.NumeroFactura;
    document.getElementById('txtnombreprovedor').value = componente.NombreProveedor;
    document.getElementById('txtlugarcompra').value = componente.LugarCompra;
    document.getElementById('datefechafactura').value = conversionFecha(componente.FechaFactura);
    document.getElementById('txtobservacionfactura').value = componente.Observacion;


  } else {
    Toast.fire({
      icon: "error",
      title: "No se encontraron datos para el Personal Solicitado",

    });
    console.error('No se encontraron datos para el Personal Solicitado');
  }
  estadoFormulario.EsDispositivoMovil = General.esDispositivoMovil();
  
}





// Evento para botón buscar
function BuscarUnidad() {
  searchTerm = $('#inputBusqueda').val().trim();

  if (searchTerm) {

    inicializarDataTableUnidades(searchTerm);
  } else {

    inicializarDataTableUnidades('');
  }
}



/*//////////////////////////////////////////////////////////////////////////////////////////////////////////*/
//FUNCION CON PROGRESS BAR "GET" PARA OBTENER DATOS 

/*//////////////////////////////////////////////////////////////////////////////////////////////////////////*/




/*//////////////////////////////////////////////////////////////////////////////////////////////////////////*/
/*FUNCIONES DE MODALES, VENTANAS EMERGENTES */
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////*/
//MODAL TABLA UNIDADES
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////*/
//INICIO EVENTO TECLADO PARA ABRIR MODAL UNIDADES
document.getElementById('txtIdUnidad').addEventListener('keydown', function (event) {
  if (event.key === 'F1' || event.key === 'F2') {
    event.preventDefault(); // Evitar acción por defecto (como ayuda del navegador)
    document.getElementById('inputBusqueda').value = '';// Limpiar el campo de búsqueda al abrir el modal
    $('#consultaUnidadesModal').modal('show'); // Mostrar modal
    inicializarDataTableUnidades('');
    // INICIALIZAR EVENTO TECLADO TECLA (ENTER) PARA BUSQUEDA EN UNIDAD
    const input = document.getElementById('inputBusqueda');

    if (input) {  // Verifica que exista
      input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          BuscarUnidad();
        }
      });
    } else {
      console.error("No se encuentra tu Búsqueda");
    }
  }
});

//INICIO EVENTO TOUCH PARA ABRIR MODAL UNIDADES

document.getElementById('txtIdUnidad').addEventListener('click', function (event) {
  if (estadoFormulario.EsDispositivoMovil == true) {
    event.preventDefault();
    document.getElementById('inputBusqueda').value = '';
    $('#consultaUnidadesModal').modal('show');
    inicializarDataTableUnidades('');
  }
});



//FINALIZAR EVENTO TOUCH PARA ABRIR MODAL UNIDADES

// Evento para botón buscar Unidad en modal
/*
function BuscarUnidad() {
  searchTerm = $('#inputBusqueda').val().trim();

  if (searchTerm) {

    inicializarDataTableUnidades(searchTerm);
  } else {

    inicializarDataTableUnidades('');
  }
}*/
// FIN Evento para botón buscar Unidad en modal

// INICIALIZAR DATATABLE UNIDADES
async function inicializarDataTableUnidades(searchTerm = '') {
  var url = `${api}/api/unidades/ConsultaPorUnidad`;

  // Declarar variables para la selección y la tabla
  let selectedId = null;
  let selectedRow = null;
  let table; // Declarar aquí

  // Desconectar eventos previos
  $('#table_Modal_Consulta tbody').off('dblclick', 'tr');
  $('#table_Modal_Consulta tbody').off('click', 'tr');
  $('#btnSeleccionar').off('click');

  // Configuración base
  const configBase = {
    columns: [
      { data: 'id_unidad', title: 'ID Unidad' },
      { data: 'tipo_unidad', title: 'Tipo de Unidad' },
      { data: 'nombre_unidad', title: 'Unidad' },
      { data: 'municipio', title: 'Municipio' },
      { data: 'Estado', title: 'Estado' },
      { data: 'estado_unidad', title: 'Status' }
    ],
    language: {
      zeroRecords: "No se encontraron resultados",
      emptyTable: "No hay datos disponibles",
    },
    dom: 't',
    paging: false,
    info: false,
    ordering: false,
    responsive: true,
    destroy: true
  };

  if (!searchTerm) {
    // Tabla vacía sin AJAX
    table = $('#table_Modal_Consulta').DataTable({
      ...configBase,
      data: []
    });
  } else {
    try {
      const dataFromServer = await handleDataTableLoadingPOST({
        url: url,
        data: { search: searchTerm },  // Pasa los datos para POST
        timeoutDuration: 60000  // Ajusta si es necesario
      });

      table = $('#table_Modal_Consulta').DataTable({
        ...configBase,
        data: dataFromServer  // Usa los datos retornados por handleDataTableLoading
      });

      // Ahora agrega los eventos, ya que la tabla está inicializada
      $('#table_Modal_Consulta tbody').on('dblclick', 'tr', function () {
        var data = table.row(this).data();
        if (data && data.id_unidad) {
          estadoFormulario.IdUnidadValue = data.id_unidad;
          estadoFormulario.contratoid = data.num_contrato_actual;
          estadoFormulario.operacion = data.Estado;
          if (estadoFormulario.operacion === 'GUANAJUATO') {
            document.getElementById('txtIdUnidad').value = General.concatenar_contrato_unidad(estadoFormulario.IdUnidadValue, estadoFormulario.contratoid);
          } else {
            document.getElementById('txtIdUnidad').value = data.id_unidad;
          }
          document.getElementById('txtnombreunidad').value = data.nombre_unidad;
          document.getElementById('txtoperacion').value = estadoFormulario.operacion;
          document.getElementById('txtarea').value = "";
          searchTerm = '';
          $('#consultaUnidadesModal').modal('hide');
        } else {
          Toast.fire({
            icon: "error",
            title: "No se pudo capturar el ID"
          });
        }
      });

      $('#table_Modal_Consulta tbody').on('click', 'tr', function () {
        var data = table.row(this).data();
        if (data && data.id_unidad) {
          estadoFormulario.IdUnidadValue = data.id_unidad;
          estadoFormulario.contratoid = data.num_contrato_actual;
          estadoFormulario.operacion = data.Estado;
          estadoFormulario.nombre_unidad = data.nombre_unidad;
          estadoFormulario.tipo_unidad = data.tipo_unidad;

          if (selectedRow && selectedRow.length > 0) {
            selectedRow.removeClass('selected-row table-active');
            selectedRow.find('td').removeClass('selected-cell');
          }

          $(this).removeClass('odd even hover');
          $(this).find('td').removeClass('odd even hover');

          $(this).addClass('selected-row');
          $(this).find('td').addClass('selected-cell');

          selectedRow = $(this);
          selectedId = data.id_unidad;

          table.cells().invalidate();
        }
      });

      $('#btnSeleccionar').on('click', function (e) {
        e.preventDefault();
        if (selectedId) {
          if (estadoFormulario.operacion === 'GUANAJUATO') {
            document.getElementById('txtIdUnidad').value = General.concatenar_contrato_unidad(estadoFormulario.IdUnidadValue, estadoFormulario.contratoid);
          } else {
            document.getElementById('txtIdUnidad').value = estadoFormulario.IdUnidadValue;
          }
          document.getElementById('txtnombreunidad').value = estadoFormulario.nombre_unidad;
          document.getElementById('txtoperacion').value = estadoFormulario.operacion;
          document.getElementById('txtarea').value = "";

          searchTerm = '';
          $('#consultaUnidadesModal').modal('hide');
        } else {
          Toast.fire({
            icon: "warning",
            title: "Selecciona una fila primero",
            text: "Haz clic en una fila de la tabla para seleccionarla."
          });
        }
      });
    } catch (error) {
      console.error('Error al cargar datos:', error);
      Toast.fire({
        icon: "error",
        title: "Error en la carga",
        text: "Ocurrió un problema al obtener los datos."
      });
      // Inicializa la tabla con datos vacíos en caso de error
      table = $('#table_Modal_Consulta').DataTable({
        ...configBase,
        data: []
      });
    }
  }
}

// FINALIZAR DATATABLE UNIDADES


/*////////////////////////////////////////////////////////////////////////////////////////////////////////////*

//MODAL TABLA Area(Ubicacion)

/*//////////////////////////////////////////////////////////////////////////////////////////////////////////*/ 
//INICIO EVENTO TECLADO PARA ABRIR MODAL AREAS (UBICACION)
document.getElementById('txtarea').addEventListener('keydown', function (event) {
  if (event.key === 'F1' || event.key === 'F2') {
    event.preventDefault(); // Evitar acción por defecto (como ayuda del navegador)

    if (!estadoFormulario.tipo_unidad) {
      Toast.fire({
        icon: "warning",
        title: "Dato no Válido",

      });
    }
    else {
      document.getElementById('inputBusquedaArea').value = '';// Limpiar el campo de búsqueda al abrir el modal
      $('#consultaAreasModal').modal('show'); // Mostrar modal
      inicializarDataTableAreasPorTipoUnidad(searchTerm = '', estadoFormulario.tipo_unidad);
      // INICIALIZAR EVENTO TECLADO TECLA (ENTER) PARA BUSQUEDA EN AREA
      const input = document.getElementById('inputBusquedaArea');
      if (input) {  // Verifica que exista
        input.addEventListener('keydown', function (event) {
          if (event.key === 'Enter') {
            BuscarArea();
          }
        });
      } else {
        console.error("No se encuentra tu Búsqueda");
      }
    }



  }
});

//FINALIZAR EVENTO TECLADO PARA ABRIR MODAL AREAS (UBICACION)



//INICIO EVENTO TOUCH PARA ABRIR MODAL AREAS (UBICACION)
document.getElementById('txtarea').addEventListener('click', function (event) {
  if (estadoFormulario.EsDispositivoMovil == true) {
    if (!estadoFormulario.tipo_unidad) {
      Toast.fire({
        icon: "warning",
        title: "Dato no Válido",

      });
    }
    else {
      document.getElementById('inputBusquedaArea').value = '';// Limpiar el campo de búsqueda al abrir el modal
      $('#consultaAreasModal').modal('show'); // Mostrar modal
      inicializarDataTableAreasPorTipoUnidad(searchTerm = '', estadoFormulario.tipo_unidad);

    }
  }
});

//FINALIZAR EVENTO TOUCH PARA ABRIR MODAL AREAS (UBICACION)



// Evento para botón buscar AREA en modal
function BuscarArea() {
  searchTerm = $('#inputBusquedaArea').val().trim();

  if (searchTerm) {

    inicializarDataTableAreasPorTipoUnidad(searchTerm, estadoFormulario.tipo_unidad);
  } else {

    inicializarDataTableAreasPorTipoUnidad('');
  }
}
// FIN Evento para botón buscar AREA en modal

// INICIALIZAR DATATABLE AREAS POR TIPO UNIDAD
function inicializarDataTableAreasPorTipoUnidad(searchTerm = '', tipo_unidad) {
  var urlBusquedaAreaPorTipoUnidad = `${api}/api/areas/ConsultaAreaPorTipoUnidad`;
  var urlBusquedaTodasAreasTipoUnidad = `${api}/api/areas/ConsultaTodasAreasPorTipoUnidad`;

  // Declarar variables locales para la selección y la tabla
  let selectedId = null;
  let selectedRow = null;
  let table;


  // Desconectar eventos previos para evitar duplicados (siempre al inicio)
  $('#table_Modal_ConsultaArea tbody').off('dblclick', 'tr');
  $('#table_Modal_ConsultaArea tbody').off('click', 'tr');
  $('#btnSeleccionarArea').off('click');

  // Configuración base común
  // Configuración base personalizada para filtro en modal de áreas
  const configBase = {
    columns: [
      { data: 'id_area', title: 'ID Área' },
      { data: 'area', title: 'Área' },
      { data: 'tipo_unidad', title: 'Tipo Unidad' },
      { data: 'DescripcionArea', title: 'Descripción de Área' }
    ],
    language: {
      zeroRecords: "No se encontraron resultados",
      emptyTable: "No hay datos disponibles",
    },
    dom: 't',
    paging: false,
    info: false,
    ordering: false,
    responsive: true,
    destroy: true // Opción clave: destruye automáticamente si ya existe

  };

  // Uso en tu función principal
  if (!searchTerm) {
    handleDataTableLoadingGET({
      url: urlBusquedaTodasAreasTipoUnidad,
      data: { TipoUnidad: tipo_unidad },
      timeoutDuration: 60000,
    }).then((data) => {
      console.log('Entrando en then con data:', data);  // Log para depuración
      if (data && Array.isArray(data) && data.length > 0) {  // Verificación de éxito
        table = $('#table_Modal_ConsultaArea').DataTable({
          ...configBase,
          data: data,  // Usa los datos retornados
        });

        // Agrega eventos aquí
        $('#table_Modal_ConsultaArea tbody').on('dblclick', 'tr', function (event) {

          var rowData = table.row(this).data();
          if (rowData && rowData.id_area) {
            estadoFormulario.IdArea = rowData.id_area;
            estadoFormulario.Nombre_Area = rowData.area;
            document.getElementById('txtarea').value = estadoFormulario.Nombre_Area;
            Swal.fire({
              icon: "info",
              title: "Área capturada",
              text: "El área es: " + rowData.area
            });
            $('#consultaAreasModal').modal('hide');
          } else {
            Swal.fire({
              icon: "error",
              title: "No se pudo capturar el ID"
            });
          }
        });

        $('#table_Modal_ConsultaArea tbody').on('click', 'tr', function () {
          var rowData = table.row(this).data();
          if (rowData && rowData.id_area) {
            estadoFormulario.IdArea = rowData.id_area;
            estadoFormulario.Nombre_Area = rowData.area;

            if (selectedRow && selectedRow.length > 0) {
              selectedRow.removeClass('selected-row table-active');
              selectedRow.find('td').removeClass('selected-cell');
            }

            $(this).removeClass('odd even hover');
            $(this).find('td').removeClass('odd even hover');

            $(this).addClass('selected-row');
            $(this).find('td').addClass('selected-cell');

            selectedRow = $(this);
            selectedId = rowData.id_area;

            table.cells().invalidate();
          }
        });

        $('#btnSeleccionarArea').on('click', function (e) {
          e.preventDefault();
          if (selectedId) {
            document.getElementById('txtarea').value = estadoFormulario.Nombre_Area;
            $('#consultaAreasModal').modal('hide');
          } else {
            Swal.fire({
              icon: "warning",
              title: "Selecciona una fila primero",
              text: "Haz clic en una fila de la tabla para seleccionarla."
            });
          }
        });
      }
    }).catch((error) => {
      console.error('Error al cargar datos:', error);
      Swal.fire({
        icon: "error",
        title: "Error en la carga",
        text: "Ocurrió un problema: " + error.message
      });
    });
  } else {
    handleDataTableLoadingGET({
      url: urlBusquedaAreaPorTipoUnidad,
      data: { TipoUnidad: tipo_unidad, searchTerm: searchTerm },
      timeoutDuration: 60000,
    }).then((data) => {

      if (data && Array.isArray(data) && data.length > 0) {
        table = $('#table_Modal_ConsultaArea').DataTable({
          ...configBase,
          data: data,
        });
        // Agrega eventos aquí si es necesario
      }
    }).catch((error) => {
      console.error('Error al cargar datos:', error);
      Swal.fire({
        icon: "error",
        title: "Error en la carga",
        text: error.message
      });
    });
  }


  return {
    table,
    selectedId,
    selectedRow
  };
}
// FINALIZAR DATATABLE AREAS POR TIPO UNIDAD


/*////////////////////////////////////////////////////////////////////////////////////////////////////////////*

//MODAL TABLA Dispositivo

/*//////////////////////////////////////////////////////////////////////////////////////////////////////////*/ 

//INICIO EVENTO TECLADO PARA ABRIR MODAL DISPOSITIVOS
document.getElementById('txtIddispositivo').addEventListener('keydown', function (event) {
  if (event.key === 'F1' || event.key === 'F2') {
    event.preventDefault(); // Evitar acción por defecto (como ayuda del navegador)
    document.getElementById('inputBusquedadispositivo').value = '';// Limpiar el campo de búsqueda al abrir el modal
    $('#consultaDispositivosModal').modal('show'); // Mostrar modal
    inicializarDataTableDispositivos(searchTerm = '');

    // INICIALIZAR EVENTO TECLADO TECLA (ENTER) PARA BUSQUEDA EN CATALOGO COMPONENTES
    const input = document.getElementById('inputBusquedadispositivo');

    if (input) {  // Verifica que exista
      input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          BuscarDispositivo();
        }
      });
    } else {
      console.error("No se encuentra tu Búsqueda");
    }
  }
});
//FINALIZAR EVENTO TECLADO PARA ABRIR MODAL DISPOSITIVOS

//INICIO EVENTO TOUCH PARA ABRIR MODAL DISPOSITIVOS
document.getElementById('txtIddispositivo').addEventListener('click', function (event) {
  if (estadoFormulario.EsDispositivoMovil == true) {
    event.preventDefault(); // Evitar acción por defecto (como ayuda del navegador)
    document.getElementById('inputBusquedadispositivo').value = '';// Limpiar el campo de búsqueda al abrir el modal
    $('#consultaDispositivosModal').modal('show'); // Mostrar modal
    inicializarDataTableDispositivos(searchTerm = '');
  }
});

//FINALIZAR EVENTO TOUCH PARA ABRIR MODAL DISPOSITIVOS

// Evento para botón buscar DISPOSITIVOS en modal
function BuscarDispositivo() {
  searchTerm = $('#inputBusquedadispositivo').val().trim();

  if (searchTerm) {

    inicializarDataTableDispositivos(searchTerm);
  } else {

    inicializarDataTableDispositivos('');
  }
}
// FIN Evento para botón buscar DISPOSITIVOS en modal
// INICIALIZAR DATATABLE DISPOSITIVOS
function inicializarDataTableDispositivos(searchTerm = '') {
  var url = `${api}/api/dispositivos/ConsultaPorDispositivosBusqueda`;
  // Declarar variables locales para la selección y la tabla
  let selectedId = null;
  let selectedRow = null;
  let table;

  // Desconectar eventos previos para evitar duplicados (siempre al inicio)
  $('#table_Modal_ConsultaDispositivos tbody').off('dblclick', 'tr');
  $('#table_Modal_ConsultaDispositivos tbody').off('click', 'tr');
  $('#btnBuscar').off('click');

  // Configuración base común
  // Configuración base personalizada para filtro en modal de áreas
  const configBase = {
    columns: [
      { data: 'id_dispositivo', title: 'ID Dispositivo' },
      { data: 'tipo_equipo', title: 'Dispositivo' },
      { data: 'abreviatura_tipo', title: 'Abreviatura' },
      { data: 'descripcion_equipo', title: 'Descripción' },
    ],
    language: {
      zeroRecords: "No se encontraron resultados",
      emptyTable: "No hay datos disponibles",
    },
    dom: 't',
    paging: false,
    info: false,
    ordering: false,
    responsive: true,
    destroy: true // Opción clave: destruye automáticamente si ya existe

  };

  if (!searchTerm) {
    // Tabla vacía sin AJAX
    table = $('#table_Modal_ConsultaDispositivos').DataTable({
      ...configBase,
      data: []
    });
  } else {
    handleDataTableLoadingGET({
      url: url,
      data: { searchTerm: searchTerm },
      timeoutDuration: 60000,
    }).then((data) => {

      if (data && Array.isArray(data) && data.length > 0) {
        table = $('#table_Modal_ConsultaDispositivos').DataTable({
          ...configBase,
          data: data,
        });
        // Agrega eventos 
        // EVENTOS PARA SELECCIONAR FILA Y CAPTURAR ID DISPOSITIVO DOBLE CLIC
        $('#table_Modal_ConsultaDispositivos tbody').on('dblclick', 'tr', function (event) {

          var rowData = table.row(this).data();
          if (rowData && rowData.id_dispositivo) {
            estadoFormulario.IdDispositivo = rowData.id_dispositivo;
            estadoFormulario.Dispositivo = rowData.tipo_equipo;
            estadoFormulario.AbrDispositivo = rowData.abreviatura_tipo;
            document.getElementById('txtIddispositivo').value = estadoFormulario.IdDispositivo;
            document.getElementById('txtdispositivo').value = estadoFormulario.Dispositivo;
            $('#consultaDispositivosModal').modal('hide');
          } else {
            Swal.fire({
              icon: "error",
              title: "No se pudo capturar el ID"
            });
          }
        });

        // Evento de clic para seleccionar fila
        $('#table_Modal_ConsultaDispositivos tbody').on('click', 'tr', function () {
          var rowData = table.row(this).data();
          if (rowData && rowData.id_dispositivo) {
            estadoFormulario.IdDispositivo = rowData.id_dispositivo;
            estadoFormulario.Dispositivo = rowData.tipo_equipo;
            estadoFormulario.AbrDispositivo = rowData.abreviatura_tipo;
            if (selectedRow && selectedRow.length > 0) {
              selectedRow.removeClass('selected-row table-active');
              selectedRow.find('td').removeClass('selected-cell');
            }

            $(this).removeClass('odd even hover');
            $(this).find('td').removeClass('odd even hover');

            $(this).addClass('selected-row');
            $(this).find('td').addClass('selected-cell');

            selectedRow = $(this);
            selectedId = rowData.id_dispositivo;

            table.cells().invalidate();
          }
        });
        //BOTON SELECCIONAR DISPOSITIVO
        $('#btnSeleccionardispositivo').on('click', function (e) {
          e.preventDefault();
          if (selectedId) {
            document.getElementById('txtIddispositivo').value = estadoFormulario.IdDispositivo;
            document.getElementById('txtdispositivo').value = estadoFormulario.Dispositivo;
            $('#consultaDispositivosModal').modal('hide');
          } else {
            Swal.fire({
              icon: "warning",
              title: "Selecciona una fila primero",
              text: "Haz clic en una fila de la tabla para seleccionarla."
            });
          }
        });
      } else {

        Swal.fire({
          icon: "warning",
          title: "No se recibieron datos",
          text: "Intenta nuevamente o verifica la solicitud."
        });

      }
    }).catch((error) => {
      console.error('Error al cargar datos:', error);
      Swal.fire({
        icon: "error",
        title: "Error en la carga",
        text: error.message
      });
    });
  }


  return {
    table,
    selectedId,
    selectedRow
  };

}


/*////////////////////////////////////////////////////////////////////////////////////////////////////////////*

//MODAL TABLA CATALOGO COMPONENTES

/*//////////////////////////////////////////////////////////////////////////////////////////////////////////*/ 

//INICIO EVENTO TECLADO PARA ABRIR MODAL CATALOGO COMPONENTES
document.getElementById('txtIdCatalogo').addEventListener('keydown', function (event) {
  if (event.key === 'F1' || event.key === 'F2') {
    event.preventDefault(); // Evitar acción por defecto (como ayuda del navegador)
    if (!estadoFormulario.IdDispositivo) {
      Toast.fire({
        icon: "warning",
        title: "Seleccione un Dispositivo Primero",

      });
    }
    else {
      //document.getElementById('inputBusquedadispositivo').value = '';// Limpiar el campo de búsqueda al abrir el modal
      $('#consultaCatalogoComponenteModal').modal('show'); // Mostrar modal

      inicializarDataTableCatalogoComponentePorDispositivo(searchTerm = '', estadoFormulario.IdDispositivo);

      // INICIALIZAR EVENTO TECLADO TECLA (ENTER) PARA BUSQUEDA EN CATALOGO COMPONENTES
      const input = document.getElementById('inputBusquedaCatalogo');

      if (input) {  // Verifica que exista
        input.addEventListener('keydown', function (event) {
          if (event.key === 'Enter') {
            BuscarCatalogoComponente();
          }
        });
      } else {
        console.error("No se encuentra tu Búsqueda de Catálogo");
      }


    }


  }
});
//FINALIZAR EVENTO TECLADO PARA ABRIR MODAL CATALOGO COMPONENTES

//INICIO EVENTO TOUCH PARA ABRIR MODAL CATALOGO COMPONENTES
document.getElementById('txtIdCatalogo').addEventListener('click', function (event) {
  if (estadoFormulario.EsDispositivoMovil == true) {
    event.preventDefault(); // Evitar acción por defecto (como ayuda del navegador)

    if (!estadoFormulario.IdDispositivo) {
      Toast.fire({
        icon: "warning",
        title: "Seleccione un Dispositivo Primero",

      });
    }
    else {
      //document.getElementById('inputBusquedadispositivo').value = '';// Limpiar el campo de búsqueda al abrir el modal
      $('#consultaCatalogoComponenteModal').modal('show'); // Mostrar modal

      inicializarDataTableCatalogoComponentePorDispositivo(searchTerm = '', estadoFormulario.IdDispositivo);

    }
  }



});

//FINALIZAR EVENTO TOUCH PARA ABRIR MODAL CATALOGO COMPONENTES
// Evento para botón buscar AREA en modal
function BuscarCatalogoComponente() {
  searchTerm = $('#inputBusquedaCatalogo').val().trim();

  if (searchTerm) {

    inicializarDataTableCatalogoComponentePorDispositivo(searchTerm, estadoFormulario.IdDispositivo);
  } else {

    inicializarDataTableCatalogoComponentePorDispositivo('');
  }
  // Agregar el evento del Enter al input
}

// FIN Evento para botón buscar AREA en modal


// INICIALIZAR DATATABLE CATALOGO COMPONENTES POR DISPOSITIVO
function inicializarDataTableCatalogoComponentePorDispositivo(searchTerm = '', IdDispositivo) {
  var urlBusquedaCatalogoComponentePorDispositivo = `${api}/api/CatalogosComponentes/ConsultaCatalogosPorDispositivoBusqueda`;
  var urlTodosCatalogoComponentePorDispositivo = `${api}/api/CatalogosComponentes/ConsultaTodosCatalogoPorDispositivo`;

  // Declarar variables locales para la selección y la tabla
  let selectedId = null;
  let selectedRow = null;
  let table;


  // Desconectar eventos previos para evitar duplicados (siempre al inicio)
  $('#table_Modal_ConsultaCatalogoComponente tbody').off('dblclick', 'tr');
  $('#table_Modal_ConsultaCatalogoComponente tbody').off('click', 'tr');
  $('#btnSeleccionarCatalogo').off('click');

  // Configuración base común
  // Configuración base personalizada para filtro en modal de áreas
  const configBase = {
    columns: [
      { data: 'nombre_catalogo', title: 'Nombre Cátalogo' },

      { data: 'tipo_equipo', title: 'Dispositivo' },
      { data: 'marca', title: 'Marca' },
      { data: 'modelo', title: 'Modelo' },
      { data: 'Procesador', title: 'Procesador' },
      { data: 'Memoria Ram', title: 'Memoria Ram' },
      { data: 'Disco Duro', title: 'Disco Duro' },
      { data: 'Sistema Operativo', title: 'Sistema Operativo' }
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

  // Uso en tu función principal
  if (!searchTerm) {
    handleDataTableLoadingGET({
      url: urlTodosCatalogoComponentePorDispositivo,
      data: { IdDispositivo: IdDispositivo },
      timeoutDuration: 60000,
    }).then((data) => {

      if (data && Array.isArray(data) && data.length > 0) {  // Verificación de éxito
        table = $('#table_Modal_ConsultaCatalogoComponente').DataTable({
          ...configBase,
          data: data,  // Usa los datos retornados
        });

        // Agrega eventos aquí
        $('#table_Modal_ConsultaCatalogoComponente tbody').on('dblclick', 'tr', function (event) {

          var rowData = table.row(this).data();
          if (rowData && rowData.id_catalogo_componente) {
            estadoFormulario.IdCatalogoComponente = rowData.id_catalogo_componente;
            estadoFormulario.Nombre_Catalogo = rowData.nombre_catalogo;
            estadoFormulario.Descripcion = rowData.descripcion_modelo;
            estadoFormulario.marca = rowData.marca;
            estadoFormulario.modelo = rowData.modelo;
            estadoFormulario.procesador = rowData.Procesador;
            estadoFormulario.memoria_ram = rowData['Memoria Ram'];
            estadoFormulario.disco_duro = rowData['Disco Duro'];
            estadoFormulario.sistema_operativo = rowData['Sistema Operativo'];
            document.getElementById('txtIdCatalogo').value = estadoFormulario.IdCatalogoComponente;
            document.getElementById('txtnombrecatalogo').value = estadoFormulario.Nombre_Catalogo;
            document.getElementById('txtdescripcioncatalogo').value = estadoFormulario.Descripcion;

            $('#consultaCatalogoComponenteModal').modal('hide');
          } else {
            Swal.fire({
              icon: "error",
              title: "No se pudo capturar el ID"
            });
          }
        });

        $('#table_Modal_ConsultaCatalogoComponente tbody').on('click', 'tr', function () {
          var rowData = table.row(this).data();
          if (rowData && rowData.id_catalogo_componente) {
            estadoFormulario.IdCatalogoComponente = rowData.id_catalogo_componente;
            estadoFormulario.Nombre_Catalogo = rowData.nombre_catalogo;
            estadoFormulario.Descripcion = rowData.descripcion_modelo;
            estadoFormulario.marca = rowData.marca;
            estadoFormulario.modelo = rowData.modelo;
            estadoFormulario.procesador = rowData.Procesador;
            estadoFormulario.memoria_ram = rowData['Memoria Ram'];
            estadoFormulario.disco_duro = rowData['Disco Duro'];
            estadoFormulario.sistema_operativo = rowData['Sistema Operativo'];

            if (selectedRow && selectedRow.length > 0) {
              selectedRow.removeClass('selected-row table-active');
              selectedRow.find('td').removeClass('selected-cell');
            }

            $(this).removeClass('odd even hover');
            $(this).find('td').removeClass('odd even hover');

            $(this).addClass('selected-row');
            $(this).find('td').addClass('selected-cell');

            selectedRow = $(this);
            selectedId = rowData.id_catalogo_componente;

            table.cells().invalidate();
          }
        });

        $('#btnSeleccionarCatalogo').on('click', function (e) {
          e.preventDefault();
          if (selectedId) {
            document.getElementById('txtIdCatalogo').value = estadoFormulario.IdCatalogoComponente;
            document.getElementById('txtnombrecatalogo').value = estadoFormulario.Nombre_Catalogo;
            document.getElementById('txtdescripcioncatalogo').value = estadoFormulario.Descripcion;
            $('#consultaCatalogoComponenteModal').modal('hide');
          } else {
            Swal.fire({
              icon: "warning",
              title: "Selecciona una fila primero",
              text: "Haz clic en una fila de la tabla para seleccionarla."
            });
          }
        });
      }

    }).catch((error) => {
      console.error('Error al cargar datos:', error);
      Swal.fire({
        icon: "error",
        title: "Error en la carga",
        text: "Ocurrió un problema: " + error.message
      });
    });
  } else {
    handleDataTableLoadingGET({
      url: urlBusquedaCatalogoComponentePorDispositivo,
      data: { IdDispositivo: IdDispositivo, searchTerm: searchTerm },
      timeoutDuration: 60000,
    }).then((data) => {

      if (data && Array.isArray(data) && data.length > 0) {
        table = $('#table_Modal_ConsultaCatalogoComponente').DataTable({
          ...configBase,
          data: data,
        });
        // Agrega eventos aquí si es necesario
        // Agrega eventos aquí
        $('#table_Modal_ConsultaCatalogoComponente tbody').on('dblclick', 'tr', function (event) {

          var rowData = table.row(this).data();
          if (rowData && rowData.id_catalogo_componente) {
            estadoFormulario.IdCatalogoComponente = rowData.id_catalogo_componente;
            estadoFormulario.Nombre_Catalogo = rowData.nombre_catalogo;
            estadoFormulario.Descripcion = rowData.descripcion_modelo;
            estadoFormulario.marca = rowData.marca;
            estadoFormulario.modelo = rowData.modelo;
            estadoFormulario.procesador = rowData.Procesador;
            estadoFormulario.memoria_ram = rowData['Memoria Ram'];
            estadoFormulario.disco_duro = rowData['Disco Duro'];
            estadoFormulario.sistema_operativo = rowData['Sistema Operativo'];
            document.getElementById('txtIdCatalogo').value = estadoFormulario.IdCatalogoComponente;
            document.getElementById('txtnombrecatalogo').value = estadoFormulario.Nombre_Catalogo;
            document.getElementById('txtdescripcioncatalogo').value = estadoFormulario.Descripcion;

            $('#consultaCatalogoComponenteModal').modal('hide');
          } else {
            Swal.fire({
              icon: "error",
              title: "No se pudo capturar el ID"
            });
          }
        });

        $('#table_Modal_ConsultaCatalogoComponente tbody').on('click', 'tr', function () {
          var rowData = table.row(this).data();
          if (rowData && rowData.id_catalogo_componente) {
            estadoFormulario.IdCatalogoComponente = rowData.id_catalogo_componente;
            estadoFormulario.Nombre_Catalogo = rowData.nombre_catalogo;
            estadoFormulario.Descripcion = rowData.descripcion_modelo;
            estadoFormulario.marca = rowData.marca;
            estadoFormulario.modelo = rowData.modelo;
            estadoFormulario.procesador = rowData.Procesador;
            estadoFormulario.memoria_ram = rowData['Memoria Ram'];
            estadoFormulario.disco_duro = rowData['Disco Duro'];
            estadoFormulario.sistema_operativo = rowData['Sistema Operativo'];

            if (selectedRow && selectedRow.length > 0) {
              selectedRow.removeClass('selected-row table-active');
              selectedRow.find('td').removeClass('selected-cell');
            }

            $(this).removeClass('odd even hover');
            $(this).find('td').removeClass('odd even hover');

            $(this).addClass('selected-row');
            $(this).find('td').addClass('selected-cell');

            selectedRow = $(this);
            selectedId = rowData.id_catalogo_componente;

            table.cells().invalidate();
          }
        });

        $('#btnSeleccionarCatalogo').on('click', function (e) {
          e.preventDefault();
          if (selectedId) {
            document.getElementById('txtIdCatalogo').value = estadoFormulario.IdCatalogoComponente;
            document.getElementById('txtnombrecatalogo').value = estadoFormulario.Nombre_Catalogo;
            document.getElementById('txtdescripcioncatalogo').value = estadoFormulario.Descripcion;
            $('#consultaCatalogoComponenteModal').modal('hide');
          } else {
            Swal.fire({
              icon: "warning",
              title: "Selecciona una fila primero",
              text: "Haz clic en una fila de la tabla para seleccionarla."
            });
          }
        });
      }
    }).catch((error) => {
      console.error('Error al cargar datos:', error);
      Swal.fire({
        icon: "error",
        title: "Error en la carga",
        text: error.message
      });
    });
  }


  return {
    table,
    selectedId,
    selectedRow
  };
}
// FINALIZAR DATATABLE AREAS POR TIPO UNIDAD


/*////////////////////////////////////////////////////////////////////////////////////////////////////////////*
/*FACTURAS*/
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////*/



//INICIO Evento para el botón 'btneditarfactura'
document.getElementById('btneditarfactura').addEventListener('click', function (event) {
  const inputidfactura = document.getElementById('txidfactura');
  inputidfactura.disabled = false;
  estadoFormulario.StatusFacturaEdit = true;
});
//FINALIZAR Evento para el botón 'btneditarfactura'

//BOTON CANCELAR NUEVA FACTURA
document.getElementById('btncancnuevafactura').addEventListener('click', function () {
  //DECLARAR VARIABLES DE INPUTS
  const inputidfactura = document.getElementById('txidfactura');
  const inputnumerofactura = document.getElementById('txtnumerofactura');
  const inputnombreproveedor = document.getElementById('txtnombreprovedor');
  const inputlugarcompra = document.getElementById('txtlugarcompra');
  const inputfechafactura = document.getElementById('datefechafactura');
  const inputobservacionfactura = document.getElementById('txtobservacionfactura');
  const btncancnuevafactura = document.getElementById('btncancnuevafactura');

  //RESTAURAR VALORES ANTERIORES AL CANCELAR LA OPERACION
  inputidfactura.value = VariablesFactura.idfactura;
  inputnumerofactura.value = VariablesFactura.numerofactura;
  inputnombreproveedor.value = VariablesFactura.nombreproveedor;
  inputlugarcompra.value = VariablesFactura.lugarcompra;
  inputfechafactura.value = conversionFecha(VariablesFactura.fechafactura);
  inputobservacionfactura.value = VariablesFactura.observacionfactura;
  btncancnuevafactura.hidden = true;
});
//INICIO EVENTO PARA EL BOTON 'btnguardarfactura'
document.getElementById('btnnuevafactura').addEventListener('click', function () {
  Swal.fire({
    title: "Deseas crear una Nueva Factura?",
    text: "¡Ya no podrás regresar a los datos anteriores!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    cancelButtonText: "Cancelar",
    confirmButtonText: "De Acuerdo"
  }).then((result) => {
    if (result.isConfirmed) {
      estadoFormulario.StatusFacturaEdit = false;
      const inputidfactura = document.getElementById('txidfactura');
      const inputnumerofactura = document.getElementById('txtnumerofactura');
      const inputnombreproveedor = document.getElementById('txtnombreprovedor');
      const inputlugarcompra = document.getElementById('txtlugarcompra');
      const inputfechafactura = document.getElementById('datefechafactura');
      const inputobservacionfactura = document.getElementById('txtobservacionfactura');
      const btneditarfactura = document.getElementById('btneditarfactura');
      const btncancelarfactura = document.getElementById('btncancnuevafactura');

      //ALMACENAR VALORES ANTERIORES EN VARIABLES POR SI SE DESEA CANCELAR LA OPERACION
      VariablesFactura.idfactura = inputidfactura.value;
      VariablesFactura.numerofactura = inputnumerofactura.value;
      VariablesFactura.nombreproveedor = inputnombreproveedor.value;
      VariablesFactura.lugarcompra = inputlugarcompra.value;
      VariablesFactura.fechafactura = inputfechafactura.value;
      VariablesFactura.observacionfactura = inputobservacionfactura.value;

      //DESHABILITAR
      inputidfactura.disabled = true;
      btneditarfactura.disabled = true;

      //HABILITAR
      inputnumerofactura.disabled = false;
      inputnombreproveedor.disabled = false;
      inputlugarcompra.disabled = false;
      inputfechafactura.disabled = false;
      inputobservacionfactura.disabled = false;

      //LIMPIAR CASILLAS
      inputidfactura.value = "*";
      inputnumerofactura.value = "";
      inputnombreproveedor.value = "";
      inputlugarcompra.value = "";
      inputobservacionfactura.value = "";

      //MOSTRAR 
      btncancelarfactura.hidden = false;

    }
  });




});

//INICIO EVENTO PARA EL BOTON 'btnguardarfactura'
document.getElementById('btnguardarfactura').addEventListener('click', async function () {
  const inputidfactura = document.getElementById('txidfactura');
  const inputnumerofactura = document.getElementById('txtnumerofactura');
  const inputnombreproveedor = document.getElementById('txtnombreprovedor');
  const inputlugarcompra = document.getElementById('txtlugarcompra');
  const inputfechafactura = document.getElementById('datefechafactura');
  const inputobservacionfactura = document.getElementById('txtobservacionfactura');
  const btneditarfactura = document.getElementById('btneditarfactura');
  const btncancelarfactura = document.getElementById('btncancnuevafactura');
  const url = `${api}/api/facturas/AgregarNuevaFactura`;
  //VERIFICAR SI SE CREA UNA NUEVA FACTURA O SE EDITA UNA EXISTENTE
  // Crear nueva factura
  if (inputidfactura.value === "*") {


    const Data = {
      numeroFactura: inputnumerofactura.value,
      nombreProveedor: inputnombreproveedor.value,
      lugarCompra: inputlugarcompra.value,
      fechaFactura: inputfechafactura.value,
      observacion: inputobservacionfactura.value
    }
    // Validar datos
    if (!Data.numeroFactura || !Data.nombreProveedor || !Data.lugarCompra || !Data.fechaFactura || !Data.observacion) {
      Toast.fire({
        icon: "warning",
        title: "Datos de Factura incompletos",
      });
      return;
    }
    const config = {
      url: `${api}/api/facturas/AgregarNuevaFactura`,
      data: Data,
      successTitle: 'Factura agregada exitosamente',
    };

    const response = await handlePOST(config);


    if (response && response.success && response.data.body.id) {
      estadoFormulario.StatusFacturaEdit = false;
      inputidfactura.value = response.data.body.id;
      inputnumerofactura.disabled = true;
      inputnombreproveedor.disabled = true;
      inputlugarcompra.disabled = true;
      inputfechafactura.disabled = true;
      inputobservacionfactura.disabled = true;
      btneditarfactura.disabled = false;
      btncancelarfactura.hidden = true;
      // Usa response.id para lo que necesites
    }
  }


  // Editar factura existente
  else {
    if (estadoFormulario.StatusFacturaEdit == true) {

      if (verificacion_numerica_entero(inputidfactura.value)) {
        // Validar datos
        if (!inputidfactura.value) {

          Toast.fire({
            icon: "warning",
            title: "Id Factura no Válida",

          });
          return;
        }

        const data = {
          idFactura: inputidfactura.value
        }

        if (isNaN(data.idFactura)) {

          Toast.fire({
            icon: "warning",
            title: "Id Factura Inválida",

          });
          return;
        }

        const config = {
          url: `${api}/api/componentes/EditarComponenteFactura`,
          id: idcomponente,
          data: data,
          //submitButtonId: 'btnEditarLavador',
          //formId: 'formularioPersonal',
          //modalId: 'editarEmpleadoLavadoModal',
          //table: table, // Tu DataTable
          successTitle: `La Factura del Componente de ha Modificado Exitosamente`,
        };


        const response = await handlePUT(config);


        if (response.error === false && response.status == 200) {

          estadoFormulario.StatusFacturaEdit = false;
          inputidfactura.disabled = true;
        }

      } else {
        console.log("El valor no es válido.");
      }
    }
  }




  //LIMPIAR DATOS FACTURA

});
//FINALIZAR EVENTO PARA EL BOTON 'btnguardarfactura'


//INICIO ENVENTO TECLADO PARA ABRIR MODAL FACTURAS
document.getElementById('txidfactura').addEventListener('keydown', function (event) {
  if (event.key === 'F1' || event.key === 'F2') {
    event.preventDefault(); // Evitar acción por defecto (como ayuda del navegador)

    if (estadoFormulario.StatusFacturaEdit == true) {

      document.getElementById('inputBusquedafactura').value = '';// Limpiar el campo de búsqueda al abrir el modal
      $('#consultaFacturaModal').modal('show'); // Mostrar modal
      inicializarDataTableFactura('');
      // INICIALIZAR EVENTO TECLADO TECLA (ENTER) PARA BUSQUEDA EN UNIDAD
      const input = document.getElementById('inputBusquedafactura');

      if (input) {  // Verifica que exista
        input.addEventListener('keydown', function (event) {
          if (event.key === 'Enter') {
            BuscarFactura();
          }
        });
      } else {
        console.error("No se encuentra tu Búsqueda");
      }

    }


  }
});
//FINALIZAR EVENTO TECLADO PARA ABRIR MODAL FACTURAS

//INICIO EVENTO TOUCH PARA ABRIR MODAL CATALOGO COMPONENTES
document.getElementById('txidfactura').addEventListener('click', function (event) {
  if (estadoFormulario.EsDispositivoMovil == true) {

    event.preventDefault(); // Evitar acción por defecto (como ayuda del navegador)

    if (estadoFormulario.StatusFacturaEdit == true) {

      document.getElementById('inputBusquedafactura').value = '';// Limpiar el campo de búsqueda al abrir el modal
      $('#consultaFacturaModal').modal('show'); // Mostrar modal
      inicializarDataTableFactura('');
      // INICIALIZAR EVENTO TECLADO TECLA (ENTER) PARA BUSQUEDA EN UNIDAD
      const input = document.getElementById('inputBusquedafactura');

    }
  }



});

//FINALIZAR EVENTO TOUCH PARA ABRIR MODAL CATALOGO COMPONENTES

// Evento para botón buscar Factura en modal
function BuscarFactura() {
  searchTerm = $('#inputBusquedafactura').val().trim();

  if (searchTerm) {

    inicializarDataTableFactura(searchTerm);
  } else {

    inicializarDataTableFactura('');
  }
  // Agregar el evento del Enter al input
}

// FIN Evento para botón buscar AREA en modal


// INICIALIZAR DATATABLE FACTURA
function inicializarDataTableFactura(searchTerm = '') {
  var urlBusquedaFactura = `${api}/api/facturas/ConsultaFacturaBusqueda`;
  var urlTodasFactura = `${api}/api/facturas/ConsultaTodasFacturas`;

  // Declarar variables locales para la selección y la tabla
  let selectedId = null;
  let selectedRow = null;
  let table;


  // Desconectar eventos previos para evitar duplicados (siempre al inicio)
  $('#table_Modal_ConsultaFactura tbody').off('dblclick', 'tr');
  $('#table_Modal_ConsultaFactura tbody').off('click', 'tr');
  $('#btnSeleccionarFactura').off('click');

  // Configuración base común
  // Configuración base personalizada para filtro en modal de áreas
  const configBase = {
    columns: [
      { data: 'IdFactura', title: 'Id Factura' },
      { data: 'NumeroFactura', title: 'Número de Factura' },
      { data: 'NombreProveedor', title: 'Nombre del Proveedor' },
      { data: 'LugarCompra', title: 'Lugar de Compra' },
      {
        data: 'FechaFactura', title: 'Fecha de Factura', render: function (data, type, row) {
          // Formatea la fecha si es necesario (ej. a DD/MM/YYYY)
          if (type === 'display' && data) {
            const date = new Date(data);
            return date.toLocaleDateString('es-ES'); // Ejemplo: 15/10/2023
          }
          return data;
        }
      },
      { data: 'Observacion', title: 'Observación' }

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

  // Uso en tu función principal
  if (!searchTerm) {
    handleDataTableLoadingGET({
      url: urlTodasFactura,
      timeoutDuration: 60000,
    }).then((data) => {

      if (data && Array.isArray(data) && data.length > 0) {  // Verificación de éxito
        table = $('#table_Modal_ConsultaFactura').DataTable({
          ...configBase,
          data: data,  // Usa los datos retornados
        });

        // Agrega eventos aquí
        $('#table_Modal_ConsultaFactura tbody').on('dblclick', 'tr', function (event) {

          var rowData = table.row(this).data();
          if (rowData && rowData.IdFactura) {
            estadoFormulario.IdFactura = rowData.IdFactura;
            estadoFormulario.NumeroFactura = rowData.NumeroFactura;
            estadoFormulario.NombreProveedor = rowData.NombreProveedor;
            estadoFormulario.LugarCompra = rowData.LugarCompra;
            estadoFormulario.FechaFactura = rowData.FechaFactura;
            estadoFormulario.Observacion = rowData.Observacion;

            document.getElementById('txidfactura').value = estadoFormulario.IdFactura;
            document.getElementById('txtnumerofactura').value = estadoFormulario.NumeroFactura;
            document.getElementById('txtnombreprovedor').value = estadoFormulario.NombreProveedor;
            document.getElementById('txtlugarcompra').value = estadoFormulario.LugarCompra;
            document.getElementById('txtobservacionfactura').value = estadoFormulario.Observacion;
            document.getElementById('datefechafactura').value = conversionFecha(estadoFormulario.FechaFactura);


            $('#consultaFacturaModal').modal('hide');
          } else {
            Swal.fire({
              icon: "error",
              title: "No se pudo capturar el ID"
            });
          }
        });

        $('#table_Modal_ConsultaFactura tbody').on('click', 'tr', function () {
          var rowData = table.row(this).data();
          if (rowData && rowData.IdFactura) {
            estadoFormulario.IdFactura = rowData.IdFactura;
            estadoFormulario.NumeroFactura = rowData.NumeroFactura;
            estadoFormulario.NombreProveedor = rowData.NombreProveedor;
            estadoFormulario.LugarCompra = rowData.LugarCompra;
            estadoFormulario.FechaFactura = rowData.FechaFactura;
            estadoFormulario.Observacion = rowData.Observacion;

            if (selectedRow && selectedRow.length > 0) {
              selectedRow.removeClass('selected-row table-active');
              selectedRow.find('td').removeClass('selected-cell');
            }

            $(this).removeClass('odd even hover');
            $(this).find('td').removeClass('odd even hover');

            $(this).addClass('selected-row');
            $(this).find('td').addClass('selected-cell');

            selectedRow = $(this);
            selectedId = rowData.IdFactura;

            table.cells().invalidate();
          }
        });

        $('#btnSeleccionarFactura').on('click', function (e) {
          e.preventDefault();
          if (selectedId) {
            document.getElementById('txidfactura').value = estadoFormulario.IdFactura;
            document.getElementById('txtnumerofactura').value = estadoFormulario.NumeroFactura;
            document.getElementById('txtnombreprovedor').value = estadoFormulario.NombreProveedor;
            document.getElementById('txtlugarcompra').value = estadoFormulario.LugarCompra;
            document.getElementById('txtobservacionfactura').value = estadoFormulario.Observacion;
            document.getElementById('datefechafactura').value = conversionFecha(estadoFormulario.FechaFactura);
            $('#consultaFacturaModal').modal('hide');
          } else {
            Swal.fire({
              icon: "warning",
              title: "Selecciona una fila primero",
              text: "Haz clic en una fila de la tabla para seleccionarla."
            });
          }
        });
      }

    }).catch((error) => {
      console.error('Error al cargar datos:', error);
      Swal.fire({
        icon: "error",
        title: "Error en la carga",
        text: "Ocurrió un problema: " + error.message
      });
    });
  } else {
    handleDataTableLoadingGET({
      url: urlBusquedaFactura,
      data: { searchTerm: searchTerm },
      timeoutDuration: 60000,
    }).then((data) => {

      if (data && Array.isArray(data) && data.length > 0) {
        table = $('#table_Modal_ConsultaFactura').DataTable({
          ...configBase,
          data: data,
        });
        // Agrega eventos aquí si es necesario
        // Agrega eventos aquí
        $('#table_Modal_ConsultaFactura tbody').on('dblclick', 'tr', function (event) {

          var rowData = table.row(this).data();
          if (rowData && rowData.IdFactura) {
            estadoFormulario.IdFactura = rowData.IdFactura;
            estadoFormulario.NumeroFactura = rowData.NumeroFactura;
            estadoFormulario.NombreProveedor = rowData.NombreProveedor;
            estadoFormulario.LugarCompra = rowData.LugarCompra;
            estadoFormulario.FechaFactura = rowData.FechaFactura;
            estadoFormulario.Observacion = rowData.Observacion;

            document.getElementById('txidfactura').value = estadoFormulario.IdFactura;
            document.getElementById('txtnumerofactura').value = estadoFormulario.NumeroFactura;
            document.getElementById('txtnombreprovedor').value = estadoFormulario.NombreProveedor;
            document.getElementById('txtlugarcompra').value = estadoFormulario.LugarCompra;
            document.getElementById('txtobservacionfactura').value = estadoFormulario.Observacion;
            document.getElementById('datefechafactura').value = conversionFecha(estadoFormulario.FechaFactura);



            $('#consultaFacturaModal').modal('hide');
          } else {
            Swal.fire({
              icon: "error",
              title: "No se pudo capturar el ID"
            });
          }
        });

        $('#table_Modal_ConsultaFactura tbody').on('click', 'tr', function () {
          var rowData = table.row(this).data();
          if (rowData && rowData.IdFactura) {
            estadoFormulario.IdFactura = rowData.IdFactura;
            estadoFormulario.NumeroFactura = rowData.NumeroFactura;
            estadoFormulario.NombreProveedor = rowData.NombreProveedor;
            estadoFormulario.LugarCompra = rowData.LugarCompra;
            estadoFormulario.FechaFactura = rowData.FechaFactura;
            estadoFormulario.Observacion = rowData.Observacion;

            if (selectedRow && selectedRow.length > 0) {
              selectedRow.removeClass('selected-row table-active');
              selectedRow.find('td').removeClass('selected-cell');
            }

            $(this).removeClass('odd even hover');
            $(this).find('td').removeClass('odd even hover');

            $(this).addClass('selected-row');
            $(this).find('td').addClass('selected-cell');

            selectedRow = $(this);
            selectedId = rowData.id_catalogo_componente;

            table.cells().invalidate();
          }
        });

        $('#btnSeleccionarFactura').on('click', function (e) {
          e.preventDefault();
          if (selectedId) {
            ocument.getElementById('txidfactura').value = estadoFormulario.IdFactura;
            document.getElementById('txtnumerofactura').value = estadoFormulario.NumeroFactura;
            document.getElementById('txtnombreprovedor').value = estadoFormulario.NombreProveedor;
            document.getElementById('txtlugarcompra').value = estadoFormulario.LugarCompra;
            document.getElementById('txtobservacionfactura').value = estadoFormulario.Observacion;
            document.getElementById('datefechafactura').value = conversionFecha(estadoFormulario.FechaFactura);
            $('#consultaFacturaModal').modal('hide');
          } else {
            Swal.fire({
              icon: "warning",
              title: "Selecciona una fila primero",
              text: "Haz clic en una fila de la tabla para seleccionarla."
            });
          }
        });
      }
    }).catch((error) => {
      console.error('Error al cargar datos:', error);
      Swal.fire({
        icon: "error",
        title: "Error en la carga",
        text: error.message
      });
    });
  }


  return {
    table,
    selectedId,
    selectedRow
  };
}
// FINALIZAR DATATABLE FACTURAS

//inicio UPDATE COMPONENTE FACTURA
async function ActualizarComponenteFactura() {
  const id_factura = document.getElementById('idpersonallavadoHidden').value;
  if (id_factura === "*") {
    Toast.fire({
      icon: "warning",
      title: "Es un *.",

    });

  }

  else if (id_factura != "*") {
    const verificar_numero = General.verificacion_numerica_entero(id_factura);
    if (verificar_numero === true) {

    }
    else {
      Toast.fire({
        icon: "warning",
        title: "Dato Inválido",

      });
    }

  }



  // Obtener el ID del lavador a editar



}


/*////////////////////////////////////////////////////////////////////////////////////////////////////////////*
/*GUARDAR DATOS DE FORMULARIO DEL COMPONENTE A EDICION*/
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////*/

// Obtén el formulario
const formulario = document.getElementById('miFormulario');






