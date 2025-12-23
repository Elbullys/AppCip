import {
  conversionFecha, handleDataTableLoadingGET, General,
  handleDataTableLoadingPOST, handlePOST, handlePUT, cambiarLabelSwitch,
  obtenerValorRadioSeleccionado, obtenerEstadoSwitch, handleGET, URLAPI,
  handleGETSinProgressBar, handlePOSTbatch, ObtenerIdTecnicoSesion,obtenerUsuarioLocalStorage
} from '../Utils.js';

const api = URLAPI;
let IndicadorDeErrores = 0;


//*PERMITE REALIZAR 
const ComponentesAnteriores = {
  //CONTRATOS
  IdContrato: null,
  //UNIDADES
  FK_id_unidad: null,
  operacion: null,
  estado_equipo: null,
  Abreviatura_Estado: null,
  //FACTURAS
  FK_Factura: null,
  //RESPONSABLES
  FK_id_responsable: null,
  //AREAS
  FK_id_area: null,
  //DISPOSITIVOS
  FK_id_dispositivo: null,
  abreviatura_tipo: null,
  //CATALOGOS
  FK_id_catalogo_componentes: null,
  //CARACTERISTICAS COMPONENTES
  numero_serie: null,
  numero_consecutivo: null,
  abreviatura_EQ: null,
  observaciones: null,
  status_componente: null,
  status_inventario: null,
  FechaRegistro: null,
  EsClienteServidor: null,
  FechaCompra: null,
  codigoTI: null,
};
const estadoFormulario = {
  //UNIDADES
  IdUnidadValue: null,
  contratoid: null,
  operacion: null,
  tipo_unidad: null,
  Estado: null,
  nombre_unidad: null,
  AbrevEstado: null,
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
  //CARACTERISTICAS COMPONENTES
  NumeroSerie: null,
  NumeroConsecutivo: null,
  CodigoTI: null,
  AbrevEQ: 'EQ',
  Observaciones: null,
  EstatusComponente: null,
  EstatusInventario: null,
  FehaRegistro: null,
  EsClienteServidor: null,
  FechaCompra: null,
  //RESPONSABLE
  IdResponsable: null,
  nombre_responsable: null,
  cargo: null,
  areaResponsable: null,
  //TECNICO
  //IdTecnico: document.getElementById('idtecnicoValue').textContent,
  //VARIABLES DE CONTROL
  EsDispositivoMovil: null
};
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

  // Detectar si es un dispositivo móvil
  estadoFormulario.EsDispositivoMovil = General.esDispositivoMovil();

  //DECLARACION DE INPUTS 
  const inputunidad = document.getElementById('inputunidad');
  const inputarea = document.getElementById('inputarea');
  const inputresponsable = document.getElementById('inputresponsable');
  const inputdispositivos = document.getElementById('inputdispositivos');
  const inputcatalogo = document.getElementById('inputcatalogo');
  const inputdescripcioncatalogo = document.getElementById('inputdescripcioncatalogo');
  const btnDescargarPlantilla = document.getElementById('downloadTemplate');
  const btnsubirform = document.getElementById('btnsubirform');
  const btnVerificacionyActualizacion = document.getElementById('btnVerificacionyActualizacion');

  let jsonData;

  //LOCALSTORAGE NOMBRE DE USUARIO EN PERFIL 
    obtenerUsuarioLocalStorage();


  //* UNIDADES
  // Función BuscarUnidad
  function BuscarUnidad() {
    let searchTerm = $('#inputBusqueda').val().trim();
    if (searchTerm) {
      inicializarDataTableUnidades(searchTerm);
    } else {
      inicializarDataTableUnidades('');
    }
  }
  // Evento para el botón Buscar Unidad
  const btnBuscarUnidad = document.getElementById('btnBuscarUnidad');
  if (btnBuscarUnidad) {
    btnBuscarUnidad.addEventListener('click', BuscarUnidad);
  }
  // Evento para el input de búsqueda al presionar Enter
  const inputBusqueda = document.getElementById('inputBusqueda');
  if (inputBusqueda) {
    inputBusqueda.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        BuscarUnidad();
      }
    });
  }


  //*AREAS (UBICACION)
  // Función BuscarArea (ubicacion)
  function BuscarArea() {
    let searchTerm = $('#inputBusquedaArea').val().trim();
    if (searchTerm) {
      inicializarDataTableAreasPorTipoUnidad(searchTerm, estadoFormulario.tipo_unidad);
    } else {
      inicializarDataTableAreasPorTipoUnidad('', estadoFormulario.tipo_unidad);
    }
  }

  // Evento para el botón Buscar AREA
  const btnBuscarArea = document.getElementById('btnBuscarArea');
  if (btnBuscarArea) {
    btnBuscarArea.addEventListener('click', BuscarArea);
  }
  const inputBusquedaArea = document.getElementById('inputBusquedaArea');
  if (inputBusquedaArea) {
    inputBusquedaArea.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {  // Usa 'Enter' (case-sensitive)
        BuscarArea();  // Llama a la función de búsqueda
      }
    });
  } else {
    console.error("No se encuentra tu búsqueda del Área");
  }


  //*RESPONSABLES
  //FUNCION RESPONSABLES
  function BuscarResponsable() {
    let searchTerm = $('#inputBusquedaResponsable').val().trim();
    if (searchTerm) {
      inicializarDataTableResponsablePorIdUnidad(searchTerm, estadoFormulario.IdUnidadValue);
    } else {
      inicializarDataTableResponsablePorIdUnidad('', estadoFormulario.IdUnidadValue);
    }
  }
  // Evento para el botón Buscar RESPONSABLE
  const btnBuscarResponsable = document.getElementById('btnBuscarResponsable');
  if (btnBuscarResponsable) {
    btnBuscarResponsable.addEventListener('click', BuscarResponsable);
  }

  const inputBusquedaResponsable = document.getElementById('inputBusquedaResponsable');
  // Evento para el input de búsqueda de RESPONSABLE
  if (inputBusquedaResponsable) {
    inputBusquedaResponsable.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {  // Usa 'Enter' (case-sensitive)
        BuscarResponsable();  // Llama a la función de búsqueda
      }
    });
  } else {
    console.error("No se encuentra tu búsqueda del Responsable");
  }

  //*DISPOSITIVOS
  //* Función BuscarDispositivo
  function BuscarDispositivo() {
    let searchTerm = $('#inputBusquedadispositivo').val().trim();
    if (searchTerm) {
      inicializarDataTableDispositivos(searchTerm);
    } else {
      inicializarDataTableDispositivos('');
    }
  }

  const btnBuscarDispositivo = document.getElementById('btnBuscarDispositivo');
  if (btnBuscarDispositivo) {
    btnBuscarDispositivo.addEventListener('click', BuscarDispositivo);
  }

  //* Función BuscarCatalogoComponente
  function BuscarCatalogoComponente() {
    let searchTerm = $('#inputBusquedaCatalogo').val().trim();
    if (searchTerm) {
      inicializarDataTableCatalogoComponentePorDispositivo(searchTerm, estadoFormulario.IdDispositivo);
    } else {
      inicializarDataTableCatalogoComponentePorDispositivo('', estadoFormulario.IdDispositivo);
    }
  }

  // **CAMBIO: Vincular botón 'btnBuscarCatalogo'**
  const btnBuscarcatalogo = document.getElementById('btnBuscarcatalogo');
  if (btnBuscarcatalogo) {
    btnBuscarcatalogo.addEventListener('click', BuscarCatalogoComponente);
  }



  /*////////////////////////////////////////////////////////////////////////////////////////////////////////////*
 
  // EVENTOS PARA ABRIR MODALES
 
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////*/ 
  //* Evento para abrir modal unidades
  //desktop
  inputunidad.addEventListener('keydown', function (event) {
    if (event.key === 'F1' || event.key === 'F2') {
      event.preventDefault();
      document.getElementById('inputBusqueda').value = '';
      $('#consultaUnidadesModal').modal('show');
      inicializarDataTableUnidades('');
    }
  });

  // Evento touch para abrir modal unidades
  inputunidad.addEventListener('click', function (event) {
    if (estadoFormulario.EsDispositivoMovil == true) {
      event.preventDefault();
      document.getElementById('inputBusqueda').value = '';
      $('#consultaUnidadesModal').modal('show');
      inicializarDataTableUnidades('');
    }
  });

  //* Evento para abrir modal areas (ubicacion)
  // INICIO EVENTO TECLADO PARA ABRIR MODAL AREAS (UBICACION)
  inputarea.addEventListener('keydown', function (event) {
    if (event.key === 'F1' || event.key === 'F2') {
      event.preventDefault();
      if (!estadoFormulario.tipo_unidad) {
        Toast.fire({
          icon: "warning",
          title: "Dato no Válido",

        });
      }
      else {
        document.getElementById('inputBusquedaArea').value = '';
        $('#consultaAreasModal').modal('show');
        let searchTerm;
        inicializarDataTableAreasPorTipoUnidad(searchTerm = '', estadoFormulario.tipo_unidad);

      }

    }
  });

  // Evento touch para abrir modal unidades
  inputarea.addEventListener('click', function (event) {
    if (estadoFormulario.EsDispositivoMovil == true) {
      event.preventDefault();
      if (!estadoFormulario.tipo_unidad) {
        Toast.fire({
          icon: "warning",
          title: "Dato no Válido",

        });
      }
      else {
        document.getElementById('inputBusquedaArea').value = '';
        $('#consultaAreasModal').modal('show');
        let searchTerm;
        inicializarDataTableAreasPorTipoUnidad(searchTerm = '', estadoFormulario.tipo_unidad);

      }
    }
  });

  //* Evento para abrir modal responsables
  // INICIO EVENTO TECLADO PARA ABRIR MODAL RESPONSABLE
  inputresponsable.addEventListener('keydown', function (event) {
    if (event.key === 'F1' || event.key === 'F2') {
      event.preventDefault();
      if (!estadoFormulario.IdUnidadValue) {
        Toast.fire({
          icon: "warning",
          title: "Dato no Válido",

        });
      }
      else {
        document.getElementById('inputBusquedaResponsable').value = '';
        $('#consultaResponsableModal').modal('show');
        let searchTerm;
        inicializarDataTableResponsablePorIdUnidad(searchTerm = '', estadoFormulario.IdUnidadValue);

      }

    }
  });
  // Evento //INICIO EVENTO TOUCH PARA ABRIR MODAL RESPONSABLE
  inputresponsable.addEventListener('click', function (event) {
    if (estadoFormulario.EsDispositivoMovil == true) {
      event.preventDefault();
      if (!estadoFormulario.IdUnidadValue) {
        Toast.fire({
          icon: "warning",
          title: "Dato no Válido",

        });
      }
      else {
        document.getElementById('inputBusquedaResponsable').value = '';
        $('#consultaResponsableModal').modal('show');
        let searchTerm;
        inicializarDataTableResponsablePorIdUnidad(searchTerm = '', estadoFormulario.IdUnidadValue);
      }

    }
  });



  //* Evento para abrir modal DISPOSITIVOS
  //ABRIR MODAL DISPOSITIVOS TECLADO
  inputdispositivos.addEventListener('keydown', function (event) {
    if (event.key === 'F1' || event.key === 'F2') {
      event.preventDefault();
      document.getElementById('inputBusquedadispositivo').value = '';
      $('#consultaDispositivosModal').modal('show');
      let searchTerm = '';
      inicializarDataTableDispositivos(searchTerm);

    }
  });
  // EVENTO PARA BUSCAR CON ENTER EN EL INPUT DEL MODAL
  const inputBusquedaDispositivo = document.getElementById('inputBusquedadispositivo');
  if (inputBusquedaDispositivo) {
    inputBusquedaDispositivo.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {  // Usa 'Enter' (case-sensitive)
        BuscarDispositivo();  // Llama a la función de búsqueda
      }
    });
  } else {
    console.error("No se encuentra tu búsqueda de dispositivo");
  }
  // Evento touch para abrir modal DISPOSITIVOS
  inputdispositivos.addEventListener('click', function (event) {
    if (estadoFormulario.EsDispositivoMovil == true) {
      event.preventDefault();
      document.getElementById('inputBusquedadispositivo').value = '';
      $('#consultaDispositivosModal').modal('show');
      let searchTerm;
      inicializarDataTableDispositivos(searchTerm = '');
    }
  });



  //* Evento para abrir modal CATALOGOS
  // INICIO EVENTO TECLADO PARA ABRIR MODAL CATALOGOS
  inputcatalogo.addEventListener('keydown', function (event) {
    if (event.key === 'F1' || event.key === 'F2') {
      event.preventDefault();
      if (!estadoFormulario.IdDispositivo) {
        Toast.fire({
          icon: "warning",
          title: "Seleccione un Dispositivo Primero",

        });
      }
      else {

        document.getElementById('inputBusquedaCatalogo').value = '';
        $('#consultaCatalogoComponenteModal').modal('show');
        let searchTerm = '';
        inicializarDataTableCatalogoComponentePorDispositivo(searchTerm, estadoFormulario.IdDispositivo);
      }

    }
  });
  // EVENTO PARA BUSCAR CON ENTER EN EL INPUT DEL MODAL
  const inputBusquedaCatalogo = document.getElementById('inputBusquedaCatalogo');
  if (inputBusquedaCatalogo) {
    inputBusquedaCatalogo.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {  // Usa 'Enter' (case-sensitive)
        BuscarCatalogoComponente();  // Llama a la función de búsqueda
      }
    });
  } else {
    console.error("No se encuentra tu Búsqueda de Catálogo");
  }

  // Evento touch para abrir modal CATALOGOS COMPONENTES
  inputcatalogo.addEventListener('click', function (event) {
    if (estadoFormulario.EsDispositivoMovil == true) {
      event.preventDefault();
      if (!estadoFormulario.IdDispositivo) {
        Toast.fire({
          icon: "warning",
          title: "Seleccione un Dispositivo Primero",

        });
      }
      else {
        document.getElementById('inputBusquedaCatalogo').value = '';
        $('#consultaCatalogoComponenteModal').modal('show');
        let searchTerm;
        inicializarDataTableCatalogoComponentePorDispositivo(searchTerm, estadoFormulario.IdDispositivo);
      }

    }
  });



  //*////////////////////////////////////////////////////////////////////////////////////////////////////////////*

  //FUNCIONES PARA INICIALIZAR DATATABLES 

  //*//////////////////////////////////////////////////////////////////////////////////////////////////////////*/ 


  //* INICIALIZAR DATATABLE UNIDADES
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
            estadoFormulario.Estado = data.Estado;
            estadoFormulario.nombre_unidad = data.nombre_unidad;
            estadoFormulario.tipo_unidad = data.tipo_unidad;
            estadoFormulario.AbrevEstado = data.abreviatura_estado;
            if (estadoFormulario.operacion === 'GUANAJUATO') {
              document.getElementById('inputunidad').value = General.concatenar_contrato_unidad(estadoFormulario.IdUnidadValue, estadoFormulario.contratoid) + ' - ' + data.nombre_unidad;
            } else {
              estadoFormulario.contratoid = "0";
              document.getElementById('inputunidad').value = General.concatenar_contrato_unidad(estadoFormulario.IdUnidadValue, estadoFormulario.contratoid) + ' - ' + data.nombre_unidad;
            }

            //LIMPIAR CASILLAS YA QUE CAMBIO DE UNIDAD Y TIENE QUE ELEGIR OTRA UNIDAD Y AREA
            document.getElementById('inputresponsable').value = "";
            document.getElementById('inputarea').value = "";

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
            estadoFormulario.Estado = data.Estado;
            estadoFormulario.nombre_unidad = data.nombre_unidad;
            estadoFormulario.tipo_unidad = data.tipo_unidad;
            estadoFormulario.AbrevEstado = data.abreviatura_estado;


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
              document.getElementById('inputunidad').value = General.concatenar_contrato_unidad(estadoFormulario.IdUnidadValue, estadoFormulario.contratoid) + ' - ' + estadoFormulario.nombre_unidad;
            } else {
              estadoFormulario.contratoid = "0";
              document.getElementById('inputunidad').value = General.concatenar_contrato_unidad(estadoFormulario.IdUnidadValue, estadoFormulario.contratoid) + ' - ' + estadoFormulario.nombre_unidad;
            }

            //LIMPIAR CASILLAS YA QUE CAMBIO DE UNIDAD Y TIENE QUE ELEGIR OTRA UNIDAD Y AREA
            document.getElementById('inputresponsable').value = "";
            document.getElementById('inputarea').value = "";


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

  // FINALIZAR DATATABLE RESPONSABLE POR TIPO UNIDAD

  //*INICIO DATATABLE RESPONSABLE 
  function inicializarDataTableResponsablePorIdUnidad(searchTerm = '') {

    var urlBusquedaResponsablePorIDUnidad = `${api}/api/responsables/ConsultaResponsablePorUnidad`;
    var urlBusquedaTodasResponsablePorIDUnidad = `${api}/api/responsables/ConsultaTodosResponsablePorIDUnidad`;

    // Declarar variables locales para la selección y la tabla
    let selectedId = null;
    let selectedRow = null;
    let table;


    // Desconectar eventos previos para evitar duplicados (siempre al inicio)
    $('#table_Modal_ConsultaResponsable tbody').off('dblclick', 'tr');
    $('#table_Modal_ConsultaResponsable tbody').off('click', 'tr');
    $('#btnSeleccionarResponsable').off('click');

    // Configuración base común
    // Configuración base personalizada para filtro en modal de áreas
    const configBase = {
      columns: [
        { data: 'id_responsable', title: 'ID Responsable' },
        { data: 'nombre_responsable', title: 'Responsable' },
        { data: 'cargo', title: 'Cargo' },
        { data: 'Area', title: 'Área ' }
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
        url: urlBusquedaTodasResponsablePorIDUnidad,
        data: { id_unidad: estadoFormulario.IdUnidadValue },
        timeoutDuration: 60000,
      }).then((data) => {

        if (data && Array.isArray(data) && data.length > 0) {  // Verificación de éxito
          table = $('#table_Modal_ConsultaResponsable').DataTable({
            ...configBase,
            data: data,  // Usa los datos retornados
          });

          // Agrega eventos aquí
          $('#table_Modal_ConsultaResponsable tbody').on('dblclick', 'tr', function (event) {

            var rowData = table.row(this).data();
            if (rowData && rowData.id_responsable) {
              estadoFormulario.IdResponsable = rowData.id_responsable;
              inputresponsable.value = rowData.nombre_responsable;
              $('#consultaResponsableModal').modal('hide');
            } else {
              Swal.fire({
                icon: "error",
                title: "No se pudo capturar el ID"
              });
            }
          });

          $('#table_Modal_ConsultaResponsable tbody').on('click', 'tr', function () {

            var rowData = table.row(this).data();
            if (rowData && rowData.id_responsable) {
              estadoFormulario.IdResponsable = rowData.id_responsable;
              estadoFormulario.nombre_responsable = rowData.nombre_responsable;
              estadoFormulario.cargo = rowData.cargo;
              estadoFormulario.areaResponsable = rowData.Area;

              if (selectedRow && selectedRow.length > 0) {
                selectedRow.removeClass('selected-row table-active');
                selectedRow.find('td').removeClass('selected-cell');
              }

              $(this).removeClass('odd even hover');
              $(this).find('td').removeClass('odd even hover');

              $(this).addClass('selected-row');
              $(this).find('td').addClass('selected-cell');

              selectedRow = $(this);
              selectedId = rowData.id_responsable;

              table.cells().invalidate();
            }
          });

          $('#btnSeleccionarResponsable').on('click', function (e) {
            e.preventDefault();
            if (selectedId) {
              inputresponsable.value = estadoFormulario.nombre_responsable;
              $('#consultaResponsableModal').modal('hide');
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
        url: urlBusquedaResponsablePorIDUnidad,
        data: { id_unidad: estadoFormulario.IdUnidadValue, searchTerm: searchTerm },
        timeoutDuration: 60000,
      }).then((data) => {

        if (data && Array.isArray(data) && data.length > 0) {
          table = $('#table_Modal_ConsultaResponsable').DataTable({
            ...configBase,
            data: data,
          });
          // Agrega eventos aquí si es necesario
          // Agrega eventos aquí
          $('#table_Modal_ConsultaResponsable tbody').on('dblclick', 'tr', function (event) {

            var rowData = table.row(this).data();
            if (rowData && rowData.id_responsable) {
              estadoFormulario.IdResponsable = rowData.id_responsable;
              inputresponsable.value = rowData.nombre_responsable;
              $('#consultaResponsableModal').modal('hide');
            } else {
              Swal.fire({
                icon: "error",
                title: "No se pudo capturar el ID"
              });
            }
          });

          $('#table_Modal_ConsultaResponsable tbody').on('click', 'tr', function () {

            var rowData = table.row(this).data();
            if (rowData && rowData.id_responsable) {
              estadoFormulario.IdResponsable = rowData.id_responsable;
              estadoFormulario.nombre_responsable = rowData.nombre_responsable;
              estadoFormulario.cargo = rowData.cargo;
              estadoFormulario.areaResponsable = rowData.Area;


              if (selectedRow && selectedRow.length > 0) {
                selectedRow.removeClass('selected-row table-active');
                selectedRow.find('td').removeClass('selected-cell');
              }

              $(this).removeClass('odd even hover');
              $(this).find('td').removeClass('odd even hover');

              $(this).addClass('selected-row');
              $(this).find('td').addClass('selected-cell');

              selectedRow = $(this);
              selectedId = rowData.id_responsable;

              table.cells().invalidate();
            }
          });

          $('#btnSeleccionarResponsable').on('click', function (e) {
            e.preventDefault();
            if (selectedId) {
              inputresponsable.value = estadoFormulario.nombre_responsable;
              $('#consultaResponsableModal').modal('hide');
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
  // FINALIZAR DATATABLE RESPONSABLE POR ID UNIDAD


  //* INICIALIZAR DATATABLE AREAS POR TIPO UNIDAD
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
        data: { TipoUnidad: estadoFormulario.tipo_unidad },
        timeoutDuration: 60000,
      }).then((data) => {

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
              inputarea.value = estadoFormulario.Nombre_Area;

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
              inputarea.value = estadoFormulario.Nombre_Area;
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
        data: { TipoUnidad: estadoFormulario.tipo_unidad, searchTerm: searchTerm },
        timeoutDuration: 60000,
      }).then((data) => {
        console.log('Entrando en then con data  AREAS POR TIPO:', data);
        if (data && Array.isArray(data) && data.length > 0) {
          table = $('#table_Modal_ConsultaArea').DataTable({
            ...configBase,
            data: data,
          });
          // Agrega eventos aquí si es necesario
          // Agrega eventos aquí
          $('#table_Modal_ConsultaArea tbody').on('dblclick', 'tr', function (event) {

            var rowData = table.row(this).data();
            if (rowData && rowData.id_area) {
              estadoFormulario.IdArea = rowData.id_area;
              estadoFormulario.Nombre_Area = rowData.area;
              inputarea.value = estadoFormulario.Nombre_Area;
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
              inputarea.value = estadoFormulario.Nombre_Area;
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


  //FINALIZA DATATABLE AREAS POR TIPO UNIDAD
  //* INICIALIZAR DATATABLE DISPOSITIVOS
  function inicializarDataTableDispositivos(searchTerm) {
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
              inputdispositivos.value = estadoFormulario.Dispositivo;
              //LIMPIAR CAMPOS PORQUE SE CAMBIO DISPOSITIVO
              inputcatalogo.value = "";

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

              inputdispositivos.value = estadoFormulario.Dispositivo;
              //LIMPIAR CAMPOS PORQUE SE CAMBIO DISPOSITIVO
              inputcatalogo.value = "";

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
  //FIN EVENTO DATATABLE

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
              //asigar valores a los inputs
              inputcatalogo.value = estadoFormulario.Nombre_Catalogo;
              inputdescripcioncatalogo.value = estadoFormulario.Descripcion;


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
              //asigar valores a los inputs
              inputcatalogo.value = estadoFormulario.Nombre_Catalogo;
              inputdescripcioncatalogo.value = estadoFormulario.Descripcion;

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
              inputcatalogo.value = estadoFormulario.Nombre_Catalogo;



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
              inputcatalogo.value = estadoFormulario.Nombre_Catalogo;
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


  //*////////////////////////////////////////////////////////////////////////////////////////////////////////////*

  //DESCARGA PLANTILLA EXCEL INVENTARIO COMPONENTES

  //*//////////////////////////////////////////////////////////////////////////////////////////////////////////*/ 

  btnDescargarPlantilla.addEventListener('click', async function () {
    if (inputunidad.value == '' || inputunidad.value == null || inputresponsable.value == '' || inputresponsable.value == null
      || inputarea.value == '' || inputarea.value == null || inputdispositivos.value == '' || inputdispositivos.value == null
      || inputcatalogo.value == '' || inputcatalogo.value == null
    ) {
      Toast.fire({
        icon: "warning",
        title: "Faltan datos obligatorios",

      });
      return; // Salir de la función si faltan datos
    }

    generarPlantillaExcel();

  });

  btnsubirform.addEventListener('click', async function (event) {

    event.preventDefault();
    const fileInput = document.getElementById('excelFile');
    const file = fileInput.files[0];
    if (!file) {

      Toast.fire({
        icon: "warning",
        title: "Selecciona un archivo Excel",

      });
      return;
    }
    // Lee el Excel con SheetJS
    const reader = new FileReader();
    reader.onload = async function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      // Procesa y valida datos (optimiza para no bloquear UI)
      const processedData = await processExcelData(jsonData);
      // Muestra en DataTable
      displayInDataTable(processedData);
      document.getElementById('processedTableContainer').style.display = 'block';
    };
    reader.readAsArrayBuffer(file);
  });

  btnVerificacionyActualizacion.addEventListener('click', async function (event) {
    event.preventDefault();
    const ActualizacionComponente = await actualizarBDDesdeTabla(jsonData);


  });


});

async function generarPlantillaExcel() {
  // 1. Datos
  const id_u = estadoFormulario.IdUnidadValue || '';
  const nom_u = document.getElementById('inputunidad').value || '';
  const id_r = estadoFormulario.IdResponsable || '';
  const nom_r = document.getElementById('inputresponsable').value || '';
  const id_a = estadoFormulario.IdArea || '';
  const nom_a = document.getElementById('inputarea').value || '';
  const id_c = estadoFormulario.IdCatalogoComponente || '';
  const nom_c = document.getElementById('inputcatalogo').value || '';
  const desc_cc = document.getElementById('inputdescripcioncatalogo').value || '';

  const statusArr = ["BUENAS CONDICIONES", "MEDIA VIDA", "MAL ESTADO", "EN REPARACION", "EXTRAVIADO", "EN REVISION", "PARA PIEZAS", "DESCONTINUADO", "DESECHADO", "SIN INFORMACION"];

  // 2. Estructura de Filas (AOA - Array of Arrays)
  const data = [
    ['PLANTILLA DE INVENTARIO'], // Fila 0
    ['INSTRUCCIONES:', 'Llenar solo columnas B y C'], // Fila 1
    [''], // Fila 2
    ['DATOS GENERALES'], // Fila 3
    ['ID Unidad:', id_u], // Fila 4
    ['Nombre Unidad:', nom_u], // Fila 5
    ['ID Responsable:', id_r], // Fila 6
    ['Responsable:', nom_r], // Fila 7
    ['ID Área:', id_a], // Fila 8
    ['Área:', nom_a], // Fila 9
    ['ID Catálogo:', id_c], // Fila 10
    ['Catálogo:', nom_c], // Fila 11
    ['Descripción Catálogo:', desc_cc], // Fila 12 (NUEVA)
    [''], // Fila 13 (ESPACIADOR)
    ['CONDICIÓN', 'NÚMERO DE SERIE', 'OBSERVACIONES'] // Encabezados (Fila 14 / Índice 14)
  ];

  // Agregar ejemplos y status
  data.push([statusArr[0], "EJEMPLO: 123456", "EJEMPLO: DAÑADO"]);
  for (let i = 1; i < statusArr.length; i++) {
    data.push([statusArr[i], '', '']);
  }

  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // 3. APLICAR NEGRITAS (Solo funciona con xlsx-js-style)
  const styleBold = { font: { bold: true } };

  // Hemos actualizado las celdas para que coincidan con la nueva fila 12
  const cellsToBold = [
    'A1', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'A11', 'A12', 'A13', // Etiquetas de datos
    'A15', 'B15', 'C15' // Encabezados de la tabla (Condición, Serie, Observación)
  ];

  cellsToBold.forEach(cell => {
    if (worksheet[cell]) {
      worksheet[cell].s = styleBold;
    }
  });

  // 4. Configuración de Columnas y Merges
  worksheet['!cols'] = [{ wch: 25 }, { wch: 30 }, { wch: 45 }];
  worksheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }, // Título principal
    { s: { r: 3, c: 0 }, e: { r: 3, c: 2 } }  // Subtítulo "DATOS GENERALES"
  ];

  // 5. Generar y Descargar
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Plantilla');

  XLSX.writeFile(workbook, 'plantilla_Componente_Colectivo.xlsx');

  // Mostrar botón de carga
  document.getElementById('btnsubirform')?.classList.remove('d-none');
}

// Función para procesar datos (actualizada con verificación batch)
async function processExcelData(data) {
  const processed = [];
  const seriesArray = [];
  const observacionArray = [];
  const batchSize = 50;
  let rowIndex = 1;
  let IndicadorDeErrores = 0;

  //validamos si estan vacios cargamos en inputs
  const camposVacios = [inputarea, inputcatalogo, inputunidad, inputresponsable].some(input => input.value === "");

  if (camposVacios) {
    estadoFormulario.IdUnidadValue = data[4]?.[1]; // Fila 5, Columna B
    estadoFormulario.nombre_unidad = data[5]?.[1]; // Fila 6, Columna B
    estadoFormulario.IdResponsable = data[6]?.[1]; //Fila 7, Columna B
    estadoFormulario.nombre_responsable = data[7]?.[1]; //Fila 8, Columna B
    estadoFormulario.IdArea = data[8]?.[1];  // Fila 9, Columna B
    estadoFormulario.Nombre_Area = data[9]?.[1];  // Fila 10, Columna B
    //estadoFormulario.IdDispositivo= data[10]?.[1];  // Fila 10, Columna B
    estadoFormulario.IdCatalogoComponente = data[10]?.[1];  // Fila 11, Columna B
    estadoFormulario.Nombre_Catalogo = data[11]?.[1];  // Fila 12, Columna B
    estadoFormulario.Descripcion = data[12]?.[1];  // Fila 12, Columna B

    //asignacion a inputs
    inputarea.value = estadoFormulario.Nombre_Area;
    inputunidad.value = estadoFormulario.nombre_unidad;
    inputresponsable.value = estadoFormulario.nombre_responsable;
    inputcatalogo.value = estadoFormulario.Nombre_Catalogo;
    inputdescripcioncatalogo.value = estadoFormulario.Descripcion;


  }

  //ASIGNACION POR CARGA MANUAL 
  // --- PASO 1: Recopilar y Pre-contar duplicados en Excel ---
  const excelCounts = {}; // Para contar cuántas veces aparece cada serie en el archivo

  for (let i = 15; i < data.length; i++) {
    const row = data[i];
    const serie = row[1]?.toString().trim();

    if (serie) {

      seriesArray.push(serie);
      excelCounts[serie] = (excelCounts[serie] || 0) + 1;
    }
  }

  if (seriesArray.length > 1000) {
    Toast.fire({
      icon: "warning",
      title: "Máximo 1000 series. Procesa menos filas",

    });

    seriesArray.splice(1000);
  }

  // --- PASO 2: Verificación en Base de Datos (API) ---
  let apiResults = {};
  if (seriesArray.length > 0) {
    try {
      const config = {
        url: `${api}/api/componentes/Inventario/verificarnumeroserieComponenteExistenciaDuplicadoArray`,
        data: { series: seriesArray, },
        disableAlerts: true,
      };

      const response = await handlePOSTbatch(config);

      if (response.success) {
        // Habilitamos el botón si la comunicación fue exitosa
        btnVerificacionyActualizacion.classList.remove('d-none');

        // Mapeamos resultados de la BD
        apiResults = response.data.body.resultados.reduce((acc, res) => {
          acc[res.serie] = res;
          return acc;
        }, {});
      } else {
        Toast.fire({
          icon: "warning",
          title: "Error al verificar series en el servidor",

        });

        return processed;
      }
    } catch (error) {
      console.error('Error en batch API:', error);
      Toast.fire({
        icon: "warning",
        title: "Error de conexión",

      });

      return processed;
    }
  }

 // --- PASO 3: Procesamiento Final con Jerarquía de Errores ---
const seenInExcelLoop = new Set(); // Para saber si es la primera vez que vemos la serie en este loop

for (let i = 15; i < data.length; i++) {
  const row = data[i];
  const serie = row[1]?.toString().trim();
  const observacionExcel = row[2]?.toString().trim() || 'SIN OBSERVACION';
  const status_componenteExcel = row[0]?.toString().trim();

  if (!serie) continue;

  let status = 'Válido';
  let details = 'Correcto';
  let rowClass = ''; // Vacío significa success (verde)
  let apiRes;

  // 1. PRIORIDAD: Duplicidad dentro del EXCEL
  if (excelCounts[serie] > 1) {
    status = 'Duplicado en Excel';
    details = `Esta serie aparece ${excelCounts[serie]} veces en tu archivo.`;
    rowClass = 'table-danger';
    IndicadorDeErrores++;
  }
  // 2. SEGUNDA PRIORIDAD: Duplicidad en la BASE DE DATOS
  else {
    apiRes = apiResults[serie];

    if (apiRes) {
      details = apiRes.detalles;
      if (apiRes.duplicado) {
        status = 'Duplicado en sistema';
        rowClass = 'table-danger';
        IndicadorDeErrores++;
      }
      else if (!apiRes.existe) {
        status = 'No Existe';
        // Si la API encontró sugerencias por los últimos 5 dígitos,
        // aparecerán automáticamente en la variable 'details'
        rowClass = 'table-warning';
        IndicadorDeErrores++;
      }
      // NUEVO: Si existe pero status_inventario == 0, tratar como error
      else if (apiRes.existe && apiRes.status_inventario == 0) {
        status = 'No se encuentra activo';
        rowClass = 'table-warning';  // Advertencia, similar a "No Existe"
        IndicadorDeErrores++;
      }
      // Si existe y status_inventario == 1, status se queda como 'Válido'
    } else {
      status = 'Error';
      details = 'No se pudo validar con el servidor.';
      rowClass = 'table-secondary';
    }
  }

  // Si llegó aquí y no tiene clase de error, es éxito
  const colorText = rowClass ? 'text-danger' : 'text-success';

  processed.push([
    rowIndex++,
    serie,
    `<span class="${rowClass ? 'text-danger' : 'text-success'}">${status}</span>`,
    `<small class="text-muted">${apiRes ? apiRes.detalles : details}</small>`, // Aquí
    `<small>${status_componenteExcel}</small>`,
    `<small>${observacionExcel}</small>`
  ]);

  // Pausa mínima para no bloquear el hilo principal cada 50 filas
  if (i % batchSize === 0) {
    await new Promise(resolve => setTimeout(resolve, 5));
  }
}

// Si hay errores críticos, deshabilitar el botón de actualizar 
if (IndicadorDeErrores > 0) {
  btnVerificacionyActualizacion.disabled = true;
} else if (IndicadorDeErrores === 0) {
  btnVerificacionyActualizacion.disabled = false;
}
errorCount.textContent = IndicadorDeErrores;
return processed;
}

//FUNCION PARA EDITAR COMPONENTES MASIVAMENTE POR COLECTIVO
async function actualizarBDDesdeTabla(data) {

  const sesionTecnico = await ObtenerIdTecnicoSesion();
  let IdTecnico = sesionTecnico.data.id_tecnico;

  if (sesionTecnico || sesionTecnico.body) {


    const table = $('#processedTable').DataTable();
    const allData = table.rows().data().toArray();
    // Filtra solo registros válidos (ej. excluye errores)
    const validData = allData.filter(row => {
      const status = $(row[2]).text();
      return !status.includes('Duplicado') && !status.includes('No Existe') && !status.includes('Error');

    });

    if (validData.length === 0) {

      Toast.fire({
        icon: "warning",
        title: "No hay datos válidos para actualizar",

      });

      return;
    }
    // Prepara payload: extrae series válidas
    const seriesToUpdate = validData.map(row => ({
      serie: row[1],  // row[1] es Número de Serie
      observacion: $(row[5]).find('input').val() || $(row[5]).text() || '',
      status_componente: $(row[4]).find('input').val() || $(row[4]).text() || '',
      id_unidad: estadoFormulario.IdUnidadValue,
      id_responsable: estadoFormulario.IdResponsable,
      id_area: estadoFormulario.IdArea,
      id_catalogo_componentes: estadoFormulario.IdCatalogoComponente,
      id_tecnico: IdTecnico
    }));

    try {
      const config = {
        url: `${api}/api/movComponentes/Inventario/AgregarMovimientoComponenteColectivoArray`,  // Nuevo endpoint
        data: { componentes: seriesToUpdate },
        disableAlerts: true,
      };
      const response = await handlePOSTbatch(config);
      console.log("response",response);
      if (response.success) {
        limpiarcampos();
        //alert('Actualización completada. ' + response.data.message);
        Swal.fire({
          icon: "success",
          title: "Inventario Actualizado",
          text: response.data.message || "Los componentes se han procesado y registrado correctamente",
          showConfirmButton: false,
          timer: 2500          // Cierra automáticamente después de 2 segundos (1000 ms)


        });
        // Opcional: Recarga tabla o muestra confirmación
      } else {
        //alert('Error en actualización: ' + response.message);
        Toast.fire({
          icon: "warning",
          title: "Error en actualización",

        });
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
      Toast.fire({
        icon: "warning",
        title: "Error de conexión al actualizar",

      });
    }
  }
}



// Función para mostrar en DataTable
function displayInDataTable(data) {
  $('#processedTable').DataTable({
    data: data,
    columns: [
      { title: '#' },
      { title: 'Número de Serie' },
      { title: 'Estado', orderable: false },  // No ordenable si tiene HTML
      { title: 'Detalles', orderable: false },
      { title: 'Status componente', orderable: false },
      { title: 'Observación', orderable: false }

    ],
    pageLength: 10,
    destroy: true,
    createdRow: function (row, data, dataIndex) {
      // Agrega clase a la fila basada en el estado (ej. 'table-danger' para errores)
      const statusText = $(data[1]).text();  // Extrae texto de HTML
      if (statusText.includes('Duplicado') || statusText.includes('No Existe')) {
        $(row).addClass('table-danger');
      } else if (statusText.includes('Error')) {
        $(row).addClass('table-warning');
      }
    }
  });
}

function limpiarcampos() {
  General.resetearCampos('#uploadForm');
  // 1. Limpiar DataTable
  $('#processedTable').DataTable().clear().draw();  // Vacía filas y redibuja
  // 3. Ocultar contenedor de tabla
  document.getElementById('processedTableContainer').style.display = 'none';
  // 4. Resetear indicador de errores (si tienes uno)
  document.getElementById('errorCount').textContent = '0';
  IndicadorDeErrores = 0;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  btnVerificacionyActualizacion.classList.add('d-none');
}
