import {
  conversionFecha, handleDataTableLoadingGET, General,
  handleDataTableLoadingPOST, handlePOST, handlePUT, cambiarLabelSwitch,
  obtenerValorRadioSeleccionado, obtenerEstadoSwitch, handleGET, URLAPI
} from '../Utils.js';


const api = URLAPI;
const idcomponente = document.getElementById('idcomponenteValue').textContent;

// Objeto para almacenar el estado del formulario (centraliza variables globales)
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
  IdTecnico: document.getElementById('idtecnicoValue').textContent,
  //VARIABLES DE CONTROL
  EsDispositivoMovil: null
};

const VariablesFactura = {
  idfactura: null,
  numerofactura: null,
  nombreproveedor: null,
  lugarcompra: null,
  fechafactura: null,
  observacionfactura: null,
};

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

// AL ABRIR LA PAGINA - TODO DENTRO DE DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {


  let cambiosPendientes = true; // Bandera para saber si hay cambios no guardados
  window.onbeforeunload = (event) => {
    if (cambiosPendientes) {
      event.preventDefault();
      event.returnValue = '¡Atención! No se guardarán los cambios si sale de esta página.';
      return '¡Atención! No se guardarán los cambios si sale de esta página.';
    }
    // Si no hay cambios pendientes, no hace nada (no muestra advertencia)
  };


  // OBTIENE DATOS 
  const editComponenteForm = document.getElementById('FormEditComponente');
  const btnmodificar = document.getElementById('btnmodificar');

  // Inicializar DataTable al cargar la página
  InicializarFormulario();
  const switchElement = document.getElementById('switchinventario');
  // Event listener para cambios manuales 
  switchElement.addEventListener('change', function () {
    if (this.checked) {
      cambiarLabelSwitch('switchinventario', 'ACTIVO');
      estadoFormulario.EstatusInventario = 1;
    } else {
      cambiarLabelSwitch('switchinventario', 'CANCELADO');
      estadoFormulario.EstatusInventario = 0;
    }



  });

  // ENVIO DE FORMULARIO 
  editComponenteForm.addEventListener('submit', async (e) => {
    e.preventDefault();  // Previene recargar la página
    // Recopila los datos del formulario
    let validarstatuseditarFactura = { error: false };
    const editFactura = estadoFormulario.StatusFacturaEdit;

    validarstatuseditarFactura = editFactura === true ? {
      icon: "warning",
      error: true,
      message: "Factura en Edición  ¡Termina el Proceso!",
    } : { error: false };

    // Recopila los datos del formulario
    const idfactura = document.getElementById('txidfactura');
    const numerofactura = document.getElementById('txtnumerofactura');
    const nombreproveedor = document.getElementById('txtnombreprovedor');
    const lugarcompra = document.getElementById('txtlugarcompra');
    const numeroserie = document.getElementById('txtnumeroserie');
    const status_equipo = document.getElementById('statusequiposelect');
    const fecha_compra = document.getElementById('datefechacompra');
    const radioServidorCliente = obtenerValorRadioSeleccionado('servidorcliente');
    const activoEnInventario = obtenerEstadoSwitch('switchinventario');
    const observaciones = document.getElementById('txtobservaciones');

    // Validaciones usando General de utils.js
    const validarnumeroFactura = General.validar_Campos_String(numerofactura.value.trim(), "El Número de Factura");
    const validarnombreproveedor = General.validar_Campos_String(nombreproveedor.value.trim(), "El nombre de Proveedor");
    const validarlugarcompra = General.validar_Campos_String(lugarcompra.value.trim(), "El lugar de compra");
    const validaridfactura = General.verificacion_numerica_entero(idfactura.value, "El ID Factura");
    const validarnumeroserie = General.validar_Campos_String(numeroserie.value, "El número de serie ");
    const validarstatus_equipo = General.validar_Campos_Select(status_equipo.value, "un Estatus de equipo");
    const validarObservaciones = General.validar_Campos_String(observaciones.value.trim(), "La observaciones");

    if (validarstatuseditarFactura.error || validarnumeroFactura.error || validarnombreproveedor.error || validarlugarcompra.error || validaridfactura.error
      || validarnumeroserie.error || validarstatus_equipo.error || validarObservaciones.error
    ) {
      // Array de todas las validaciones para iterar
      const validations = [validarstatuseditarFactura, validarnumeroFactura, validarnombreproveedor, validarlugarcompra, validaridfactura
        , validarnumeroserie, validarstatus_equipo, validarObservaciones
      ];
      // Encontrar la primera validación que falló
      const failedValidation = validations.find(val => val.error);

      Toast.fire({
        icon: failedValidation.icon,
        title: failedValidation.message,
      });
    } else {
      estadoFormulario.IdFactura = idfactura.value;
      estadoFormulario.NumeroSerie = numeroserie.value;
      estadoFormulario.Observaciones = observaciones.value;
      estadoFormulario.EstatusComponente = status_equipo.value;

      estadoFormulario.EsClienteServidor = radioServidorCliente;
      estadoFormulario.FechaCompra = fecha_compra.value;
      estadoFormulario.EstatusInventario = activoEnInventario;



      const dataComponenteActualizado = {
        //UNIDADES
        FK_id_unidad: estadoFormulario.IdUnidadValue,
        operacion: estadoFormulario.operacion,
        estado_equipo: estadoFormulario.Estado,
        Abreviatura_Estado: estadoFormulario.AbrevEstado,
        //FACTURAS
        FK_Factura: estadoFormulario.IdFactura,
        //RESPONSABLES
        FK_id_responsable: estadoFormulario.IdResponsable,
        //AREAS
        FK_id_area: estadoFormulario.IdArea,
        //DISPOSITIVOS
        FK_id_dispositivo: estadoFormulario.IdDispositivo,
        abreviatura_tipo: estadoFormulario.AbrDispositivo,
        //CATALOGOS
        FK_id_catalogo_componentes: estadoFormulario.IdCatalogoComponente,
        //CARACTERISTICAS COMPONENTES
        numero_serie: estadoFormulario.NumeroSerie,
        numero_consecutivo: estadoFormulario.NumeroConsecutivo,
        abreviatura_EQ: estadoFormulario.AbrevEQ,
        observaciones: estadoFormulario.Observaciones,
        status_componente: estadoFormulario.EstatusComponente,
        status_inventario: estadoFormulario.EstatusInventario,
        FechaRegistro: estadoFormulario.FehaRegistro,
        EsClienteServidor: estadoFormulario.EsClienteServidor,
        FechaCompra: estadoFormulario.FechaCompra,
        //TECNICO

        FK_IdTecnico: document.getElementById('idtecnicoValue').textContent,
        //contrato 
        numero_contrato_actual: estadoFormulario.contratoid,

      };

     let responseData;
      const verifyResponse = await fetch(`${api}/api/logintecnicos/protected`, {
        method: 'GET',
        credentials: 'include',

      });
      if (!verifyResponse.ok) {
        console.error(`Error de verificación HTTP: ${verifyResponse.status}`);
        cambiosPendientes = false;
        setTimeout(() => {
          window.location.href = '/logintecnico';
        }, 1500);
        return; // Retorno temprano: detiene la ejecución
      }

      responseData = await verifyResponse.json();
      if (!responseData.success || !responseData.data) {
        return;
      }

      if (verifyResponse.ok) {

        //*Preparar la Petición de Actualización (PUT)
        dataComponenteActualizado.FK_IdTecnico = responseData.data.id_tecnico;


        const config = {
          url: `${api}/api/componentes/EditarComponentePorID`,
          id: idcomponente,
          data: {  // Combina ambos en un solo objeto
            data: dataComponenteActualizado,  // Tu data actualizada
            data_componentes_anteriores: ComponentesAnteriores  // Los datos anteriores
          },
          successTitle: `La Factura del Componente de ha Modificado Exitosamente`,
        };

        const response = await handlePUT(config);

        if (response.error === false && response.status == 200) {
          setTimeout(() => {
            cambiosPendientes = false;
            window.location.href = `/EditarComponente/${response.body.codigo_TI}`;
          }, 1000);
        }
        else {
          Swal.fire({
            icon: response.icon,
            title: "Error en la edicion",
            text: response.message || 'Datos no Válidos',
          })
        }
      }
    }
  });



  // FUNCIONES Y EVENTOS PARA MODALES
  //* Función BuscarUnidad
  function BuscarUnidad() {
    let searchTerm = $('#inputBusqueda').val().trim();
    if (searchTerm) {
      inicializarDataTableUnidades(searchTerm);
    } else {
      inicializarDataTableUnidades('');
    }
  }


  const btnBuscarUnidad = document.getElementById('btnBuscarUnidad');
  if (btnBuscarUnidad) {
    btnBuscarUnidad.addEventListener('click', BuscarUnidad);
  }


  const inputBusqueda = document.getElementById('inputBusqueda');
  if (inputBusqueda) {
    inputBusqueda.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        BuscarUnidad();
      }
    });
  }

  //* Función BuscarArea (ubicacion)
  function BuscarArea() {
    let searchTerm = $('#inputBusquedaArea').val().trim();
    if (searchTerm) {
      inicializarDataTableAreasPorTipoUnidad(searchTerm, estadoFormulario.tipo_unidad);
    } else {
      inicializarDataTableAreasPorTipoUnidad('', estadoFormulario.tipo_unidad);
    }
  }


  const btnBuscarArea = document.getElementById('btnBuscarArea');
  if (btnBuscarArea) {
    btnBuscarArea.addEventListener('click', BuscarArea);
  }

  //*FUNCION RESPONSABLES
  function BuscarResponsable() {
    let searchTerm = $('#inputBusquedaResponsable').val().trim();
    if (searchTerm) {
      inicializarDataTableResponsablePorIdUnidad(searchTerm, estadoFormulario.IdUnidadValue);
    } else {
      inicializarDataTableResponsablePorIdUnidad('', estadoFormulario.IdUnidadValue);
    }
  }
  const btnBuscarResponsable = document.getElementById('btnBuscarResponsable');
  if (btnBuscarResponsable) {
    btnBuscarResponsable.addEventListener('click', BuscarResponsable);
  }


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

  //* Función BuscarFactura
  function BuscarFactura() {
    let searchTerm = $('#inputBusquedafactura').val().trim();
    if (searchTerm) {
      inicializarDataTableFactura(searchTerm);
    } else {
      inicializarDataTableFactura('');
    }
  }

  // **CAMBIO: Vincular botón 'btnBuscarFactura'**
  const btnBuscarfactura = document.getElementById('btnBuscarfactura');
  if (btnBuscarfactura) {
    btnBuscarfactura.addEventListener('click', BuscarFactura);
  }
  /*////////////////////////////////////////////////////////////////////////////////////////////////////////////*
  
    // EVENTOS PARA ABRIR MODALES
  
  /*//////////////////////////////////////////////////////////////////////////////////////////////////////////*/ 

  //* Evento para abrir modal unidades
  document.getElementById('txtIdUnidad').addEventListener('keydown', function (event) {
    if (event.key === 'F1' || event.key === 'F2') {
      event.preventDefault();
      document.getElementById('inputBusqueda').value = '';
      $('#consultaUnidadesModal').modal('show');
      inicializarDataTableUnidades('');
    }
  });

  // Evento touch para abrir modal unidades
  document.getElementById('txtIdUnidad').addEventListener('click', function (event) {
    if (estadoFormulario.EsDispositivoMovil == true) {
      event.preventDefault();
      document.getElementById('inputBusqueda').value = '';
      $('#consultaUnidadesModal').modal('show');
      inicializarDataTableUnidades('');
    }
  });

  //* INICIO EVENTO TECLADO PARA ABRIR MODAL AREAS (UBICACION)
  document.getElementById('txtarea').addEventListener('keydown', function (event) {
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
  document.getElementById('txtarea').addEventListener('click', function (event) {
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
  //* INICIO EVENTO TECLADO PARA ABRIR MODAL RESPONSABLE
  document.getElementById('txtidresponsable').addEventListener('keydown', function (event) {
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
  const inputBusquedaResponsable = document.getElementById('inputBusquedaResponsable');
  if (inputBusquedaResponsable) {
    inputBusquedaResponsable.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {  // Usa 'Enter' (case-sensitive)
        BuscarResponsable();  // Llama a la función de búsqueda
      }
    });
  } else {
    console.error("No se encuentra tu búsqueda del Responsable");
  }

  //*inicializarDataTable RESPONSABLE
  // Evento //INICIO EVENTO TOUCH PARA ABRIR MODAL RESPONSABLE
  document.getElementById('txtidresponsable').addEventListener('click', function (event) {
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
  document.getElementById('txtIddispositivo').addEventListener('keydown', function (event) {
    if (event.key === 'F1' || event.key === 'F2') {
      event.preventDefault();
      document.getElementById('inputBusquedadispositivo').value = '';
      $('#consultaDispositivosModal').modal('show');
      let searchTerm = '';
      inicializarDataTableDispositivos(searchTerm);

    }
  });
  // EVENTO PARA BUSCAR CON ENTER EN EL INPUT DEL MODAL
  const inputDispositivo = document.getElementById('inputBusquedadispositivo');
  if (inputDispositivo) {
    inputDispositivo.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {  // Usa 'Enter' (case-sensitive)
        BuscarDispositivo();  // Llama a la función de búsqueda
      }
    });
  } else {
    console.error("No se encuentra tu búsqueda de dispositivo");
  }

  // Evento touch para abrir modal DISPOSITIVOS
  document.getElementById('txtIddispositivo').addEventListener('click', function (event) {
    if (estadoFormulario.EsDispositivoMovil == true) {
      event.preventDefault();
      document.getElementById('inputBusquedadispositivo').value = '';
      $('#consultaDispositivosModal').modal('show');
      let searchTerm;
      inicializarDataTableDispositivos(searchTerm = '');
    }
  });


  //* Evento para abrir modal CATALOGOS
  document.getElementById('txtIdCatalogo').addEventListener('keydown', function (event) {
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
  document.getElementById('txtIdCatalogo').addEventListener('click', function (event) {
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


  //* Evento para abrir modal FACTURAS
  document.getElementById('txidfactura').addEventListener('keydown', function (event) {
    if (event.key === 'F1' || event.key === 'F2') {
      event.preventDefault();

      if (estadoFormulario.StatusFacturaEdit == true) {
        $('#consultaFacturaModal').modal('show'); // Mostrar modal
        inicializarDataTableFactura('');

      }


    }
  });
  // EVENTO PARA BUSCAR CON ENTER EN EL INPUT DEL MODAL
  const inputBusquedafactura = document.getElementById('inputBusquedafactura');
  if (inputBusquedafactura) {
    inputBusquedafactura.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {  // Usa 'Enter' (case-sensitive)
        BuscarFactura();  // Llama a la función de búsqueda
      }
    });
  } else {
    console.error("No se encuentro la Factura");
  }

  // Evento touch para abrir modal CATALOGOS COMPONENTES
  document.getElementById('txidfactura').addEventListener('click', function (event) {
    if (estadoFormulario.EsDispositivoMovil == true) {
      event.preventDefault();
      if (estadoFormulario.StatusFacturaEdit == true) {
        document.getElementById('inputBusquedafactura').value = '';// Limpiar el campo de búsqueda al abrir el modal
        $('#consultaFacturaModal').modal('show'); // Mostrar modal
        inicializarDataTableFactura('');
        // INICIALIZAR EVENTO TECLADO TECLA (ENTER) PARA BUSQUEDA EN UNIDAD
        const input = document.getElementById('inputBusquedafactura');
      }

    }
    // Función para detectar si hay cambios no guardados (implementa según tu formulario)

    // Código del formulario aquí (ej. event listeners para switches, toasts, etc.)
    // Función y event listener para advertencia de navegación atrás



  });





  //*TERMINA

  //*////////////////////////////////////////////////////////////////////////////////////////////////////////////*

  //FUNCIONES PARA INICIALIZAR DATATABLES 

  //*//////////////////////////////////////////////////////////////////////////////////////////////////////////*/ 


  // FUNCIONES PARA INICIALIZAR DATATABLES (movidas dentro de DOMContentLoaded)
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
              document.getElementById('txtIdUnidad').value = General.concatenar_contrato_unidad(estadoFormulario.IdUnidadValue, estadoFormulario.contratoid);
            } else {
              estadoFormulario.contratoid = "0";
              document.getElementById('txtIdUnidad').value = General.concatenar_contrato_unidad(estadoFormulario.IdUnidadValue, estadoFormulario.contratoid);
            }
            document.getElementById('txtnombreunidad').value = data.nombre_unidad;
            document.getElementById('txtoperacion').value = estadoFormulario.operacion;
            //LIMPIAR CASILLAS YA QUE CAMBIO DE UNIDAD Y TIENE QUE ELEGIR OTRA UNIDAD Y AREA
            document.getElementById('txtidresponsable').value = "";
            document.getElementById('txtnombreresponsable').value = "";
            document.getElementById('txtcargoresponsable').value = "";
            document.getElementById('txtarea').value = "";
            document.getElementById('txtarearesponsable').value = "";

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
              document.getElementById('txtIdUnidad').value = General.concatenar_contrato_unidad(estadoFormulario.IdUnidadValue, estadoFormulario.contratoid);
            } else {
              estadoFormulario.contratoid = "0";
              document.getElementById('txtIdUnidad').value = General.concatenar_contrato_unidad(estadoFormulario.IdUnidadValue, estadoFormulario.contratoid);
            }
            document.getElementById('txtnombreunidad').value = estadoFormulario.nombre_unidad;
            document.getElementById('txtoperacion').value = estadoFormulario.operacion;
            //LIMPIAR CASILLAS YA QUE CAMBIO DE UNIDAD Y TIENE QUE ELEGIR OTRA UNIDAD Y AREA
            document.getElementById('txtidresponsable').value = "";
            document.getElementById('txtnombreresponsable').value = "";
            document.getElementById('txtcargoresponsable').value = "";
            document.getElementById('txtarea').value = "";
            document.getElementById('txtarearesponsable').value = "";


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

  // INICIALIZAR DATATABLE AREAS POR TIPO UNIDAD
  function inicializarDataTableAreasPorTipoUnidad(searchTerm = '', tipo_unidad) {
    console.log("inicializarDataTableAreasPorTipoUnidad ENTRO");
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
        console.log('Entrando en then con data TODAS AREAS:', data);  // Log para depuración
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

  //*INICIO DATATABLE RESPONSABLE 
  function inicializarDataTableResponsablePorIdUnidad(searchTerm = '', id_unidad) {

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
              document.getElementById('txtidresponsable').value = rowData.id_responsable;
              document.getElementById('txtnombreresponsable').value = rowData.nombre_responsable;
              document.getElementById('txtcargoresponsable').value = rowData.cargo;
              document.getElementById('txtarearesponsable').value = rowData.Area;
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
              document.getElementById('txtidresponsable').value = estadoFormulario.IdResponsable;
              document.getElementById('txtnombreresponsable').value = estadoFormulario.nombre_responsable;
              document.getElementById('txtcargoresponsable').value = estadoFormulario.cargo;
              document.getElementById('txtarearesponsable').value = estadoFormulario.areaResponsable;
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
              document.getElementById('txtidresponsable').value = rowData.id_responsable;
              document.getElementById('txtnombreresponsable').value = rowData.nombre_responsable;
              document.getElementById('txtcargoresponsable').value = rowData.cargo;
              document.getElementById('txtarearesponsable').value = rowData.Area;
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
              document.getElementById('txtidresponsable').value = estadoFormulario.IdResponsable;
              document.getElementById('txtnombreresponsable').value = estadoFormulario.nombre_responsable;
              document.getElementById('txtcargoresponsable').value = estadoFormulario.cargo;
              document.getElementById('txtarearesponsable').value = estadoFormulario.areaResponsable;
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


  // INICIALIZAR DATATABLE DISPOSITIVOS
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
              document.getElementById('txtIddispositivo').value = estadoFormulario.IdDispositivo;
              document.getElementById('txtdispositivo').value = estadoFormulario.Dispositivo;
              document.getElementById('txtIdCatalogo').value = "";
              document.getElementById('txtnombrecatalogo').value = "";
              document.getElementById('txtdescripcioncatalogo').value = "";
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
              //LIMPIAR CAMPOS PORQUE SE CAMBIO DISPOSITIVO
              document.getElementById('txtIdCatalogo').value = "";
              document.getElementById('txtnombrecatalogo').value = "";
              document.getElementById('txtdescripcioncatalogo').value = "";
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

  //* INICIALIZAR DATATABLE FACTURA
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

  // 
  //*////////////////////////////////////////////////////////////////////////////////////////////////////////////*

  // FUNCIONES PARA FACTURAS Y OTROS EVENTOS (SE ENCUENTRAN EN EL FORMULARIO BOTONES ETC) 

  //*//////////////////////////////////////////////////////////////////////////////////////////////////////////*/ 

  //*BOTON CANCELAR NUEVA FACTURA
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

  //*INICIO EVENTO PARA EL BOTON 'btnguardarfactura'
  document.getElementById('btnnuevafactura').addEventListener('click', function () {

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


  });


  //*INICIO EVENTO PARA EL BOTON 'btnguardarfactura'
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
        estadoFormulario.IdFactura = response.data.body.id;
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

        if (General.verificacion_numerica_entero(inputidfactura.value, "El ID factura")) {
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

  });
  //FINALIZAR EVENTO PARA EL BOTON 'btnguardarfactura'

  //*INICIO Evento para el botón 'btneditarfactura'
  document.getElementById('btneditarfactura').addEventListener('click', function (event) {
    const inputidfactura = document.getElementById('txidfactura');
    inputidfactura.disabled = false;
    estadoFormulario.StatusFacturaEdit = true;
  });



  // FUNCION INICIALIZAR FORMULARIO
  async function InicializarFormulario() {

    // Reiniciar el formulario
    document.getElementById('FormEditComponente').reset();
    // Limpiar los campos de error
    const errorFields = document.querySelectorAll('.error');
    errorFields.forEach(field => field.textContent = '');





    const validaridcomponente = General.verificacion_numerica_entero(idcomponente, "El ID Componente");

    if (validaridcomponente.error) {
      // Array de todas las validaciones para iterar
      const validations = [validaridcomponente];

      // Encontrar la primera validación que falló
      const failedValidation = validations.find(val => val.error);
      Swal.fire({
        icon: failedValidation.icon,
        title: "ID no Válido",
        text: failedValidation.message || 'Login exitoso.',
      }).then(() => {
        window.location.href = '/EditarDatos';
      });

    }
    else {
      //asignar a campo
      document.getElementById('txtidcomponente').value = idcomponente;


      const config = {
        url: `${api}/api/componentes/ConsultarIdComponente/${idcomponente}`, // URL específica
        timeoutDuration: 5000, // Opcional: ajusta el timeout si es necesario
        // data: {} // Opcional: no se pasa si no hay query params
      };
      const response = await handleGET(config);

      const data = response.data;

      // Verifica que el cuerpo de la respuesta contenga datos
      if (data.body.length > 0) {
        const componente = data.body[0]; // Accede al primer elemento del array

        //* Llenar el variables globales con los datos del componente traigo desde la API

        document.getElementById('txtcodigoti').value = componente.codigo_TI;
        estadoFormulario.IdUnidadValue = componente.id_unidad.toString();
        estadoFormulario.operacion = componente.operacion.toString();
        estadoFormulario.contratoid = componente.num_contrato_actual.toString();
        estadoFormulario.tipo_unidad = componente.tipo_unidad;
        estadoFormulario.nombre_unidad = componente.nombre_unidad;//nombre_unidad
        estadoFormulario.Estado = componente.Estado;//Estado
        estadoFormulario.IdDispositivo = componente.id_dispositivo;
        estadoFormulario.EsClienteServidor = componente.EsClienteServidor;
        estadoFormulario.IdArea = componente.FK_id_area;
        console.log("IdArea", estadoFormulario.IdArea);
        estadoFormulario.AbrevEstado = componente.abreviatura_estado;
        estadoFormulario.AbrDispositivo = componente.abreviatura_tipo;
        estadoFormulario.IdCatalogoComponente = componente.id_catalogo_componente;
        estadoFormulario.NumeroSerie = componente.numero_serie;
        estadoFormulario.NumeroConsecutivo = componente.numero_consecutivo;
        estadoFormulario.CodigoTI = componente.codigo_TI;
        estadoFormulario.Observaciones = componente.observaciones;
        estadoFormulario.EstatusComponente = componente.status_componente;
        estadoFormulario.EstatusInventario = componente.status_inventario;
        estadoFormulario.FehaRegistro = componente.FechaRegistro;
        estadoFormulario.FechaCompra = componente.FechaCompra;
        estadoFormulario.IdResponsable = componente.id_responsable;
        estadoFormulario.IdTecnico = componente.FK_IdTecnico;
        estadoFormulario.IdFactura = componente.IdFactura;




        //FACTURAS
        VariablesFactura.idfactura = componente.IdFactura;
        VariablesFactura.numerofactura = componente.NumeroFactura;
        VariablesFactura.nombreproveedor = componente.NombreProveedor;
        VariablesFactura.lugarcompra = componente.LugarCompra;
        VariablesFactura.observacionfactura = componente.Observacion;
        VariablesFactura.fechafactura = componente.FechaFactura;
        //*LLENADO DE FORMULARIO CON DATOS OBTENIDOS DE COMPONENTES (API)
        //conversion de variables a dato a mostrar
        if (estadoFormulario.operacion === 'GUANAJUATO') {
          document.getElementById('txtIdUnidad').value = General.concatenar_contrato_unidad(estadoFormulario.IdUnidadValue, estadoFormulario.contratoid);
        }
        else {
          document.getElementById('txtIdUnidad').value = estadoFormulario.IdUnidadValue;
        }
        document.getElementById('txtnombreunidad').value = estadoFormulario.nombre_unidad;
        document.getElementById('txtoperacion').value = estadoFormulario.operacion;
        document.getElementById('txtarea').value = componente.area;
        document.getElementById('txtidresponsable').value = componente.id_responsable;
        document.getElementById('txtnombreresponsable').value = componente.nombre_responsable;
        document.getElementById('txtcargoresponsable').value = componente.cargo;
        document.getElementById('txtarearesponsable').value = componente.area;
        document.getElementById('txtIddispositivo').value = estadoFormulario.IdDispositivo;
        document.getElementById('txtdispositivo').value = componente.tipo_equipo;
        document.getElementById('txtIdCatalogo').value = estadoFormulario.IdCatalogoComponente;
        document.getElementById('txtnombrecatalogo').value = componente.marca + ' ' + componente.modelo;
        document.getElementById('txtdescripcioncatalogo').value = componente.descripcion_modelo;
        document.getElementById('txtnumeroserie').value = estadoFormulario.NumeroSerie;
        document.getElementById('txtobservaciones').value = estadoFormulario.Observaciones;

        //*SWITCH QUE PERMITE DAR UN ACTIVO O CANCELADO 
        const switchElement = document.getElementById('switchinventario');
        console.log("EstatusInventario inicial formulario", estadoFormulario.EstatusInventario);
        if (estadoFormulario.EstatusInventario.toString() == "1") {

          switchElement.checked = true;  // Activar switch si activo
          cambiarLabelSwitch('switchinventario', 'ACTIVO');
          //*error por aqui 
        } else if (estadoFormulario.EstatusInventario.toString() === "0") {
          switchElement.checked = false;  // Desactivar si cancelado
          cambiarLabelSwitch('switchinventario', 'CANCELADO');
        } else {
          switchElement.checked = false;  // Por defecto, desactivado
          cambiarLabelSwitch('switchinventario', 'UNDEFINED');
        }



        // Cargar PUESTOS
        //await SelectobtenerPuestos('AsignacionSelectPuestos'); // Llenar el select de PUESTOS
        // Seleccionar el color correspondiente
        //const selectpuesto = document.getElementById('AsignacionSelectPuestos');
        //selectpuesto.value = usuarios.IdPuesto; // Asegúrate de que este valor coincida con el value de las opciones

        document.getElementById('datefechacompra').value = conversionFecha(estadoFormulario.FechaCompra);
        let clienteservidor = estadoFormulario.EsClienteServidor.toString();
        console.log("clienteservidor", clienteservidor);
        if (clienteservidor === 'SERVIDOR') {
          document.getElementById('chbxservidor').checked = true;
        }
        else if (clienteservidor === 'CLIENTE') {
          document.getElementById('chbxcliente').checked = true;
        }
        else if (clienteservidor === 'N/A') {
          document.getElementById('chbxna').checked = true;
        }
        document.getElementById('statusequiposelect').value = estadoFormulario.EstatusComponente.toString();
        document.getElementById('txidfactura').value = VariablesFactura.idfactura;
        document.getElementById('txtnumerofactura').value = VariablesFactura.numerofactura;
        document.getElementById('txtnombreprovedor').value = VariablesFactura.nombreproveedor;
        document.getElementById('txtlugarcompra').value = VariablesFactura.lugarcompra;
        document.getElementById('datefechafactura').value = conversionFecha(VariablesFactura.fechafactura);
        document.getElementById('txtobservacionfactura').value = VariablesFactura.observacionfactura;



      } else {
        Toast.fire({
          icon: "error",
          title: "No se encontraron datos del componente Solicitado",

        });
        console.error('No se encontraron datos del componente Solicitado');
      }
      estadoFormulario.EsDispositivoMovil = General.esDispositivoMovil();

      //*LLENADO DE ARRAY COMPONENTES ANTERIOR PARA REGISTRAR MOVIMIENTO ANTERIOR
      //CONTRATOS
      ComponentesAnteriores.IdContrato = estadoFormulario.contratoid;
      //unidades
      ComponentesAnteriores.FK_id_unidad = estadoFormulario.IdUnidadValue;
      ComponentesAnteriores.operacion = estadoFormulario.operacion;
      ComponentesAnteriores.estado_equipo = estadoFormulario.Estado;
      ComponentesAnteriores.Abreviatura_Estado = estadoFormulario.AbrevEstado;
      //FACTURAS
      ComponentesAnteriores.FK_Factura = estadoFormulario.IdFactura;
      //RESPONSABLES

      ComponentesAnteriores.FK_id_responsable = estadoFormulario.IdResponsable;
      //AREAS
      ComponentesAnteriores.FK_id_area = estadoFormulario.IdArea;//IdArea
      //DISPOSITIVOS
      ComponentesAnteriores.FK_id_dispositivo = estadoFormulario.IdDispositivo;
      ComponentesAnteriores.abreviatura_tipo = estadoFormulario.AbrDispositivo;
      //COMPONENTES
      ComponentesAnteriores.FK_id_catalogo_componentes = estadoFormulario.IdCatalogoComponente;
      ComponentesAnteriores.numero_serie = estadoFormulario.NumeroSerie;
      ComponentesAnteriores.numero_consecutivo = estadoFormulario.NumeroConsecutivo;
      ComponentesAnteriores.abreviatura_EQ = estadoFormulario.AbrevEQ;
      ComponentesAnteriores.observaciones = estadoFormulario.Observaciones;
      ComponentesAnteriores.status_componente = estadoFormulario.EstatusComponente;
      ComponentesAnteriores.status_inventario = estadoFormulario.EstatusInventario;
      ComponentesAnteriores.FechaRegistro = estadoFormulario.FehaRegistro;
      ComponentesAnteriores.EsClienteServidor = estadoFormulario.EsClienteServidor;
      ComponentesAnteriores.FechaCompra = estadoFormulario.FechaCompra;
      ComponentesAnteriores.codigoTI = estadoFormulario.CodigoTI;



    }

  }

  // FUNCION ActualizarComponenteFactura
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
});