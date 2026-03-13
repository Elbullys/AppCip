//IMPORTACIONES DE FUNCIONES Y CONSTANTES
import {
  conversionFecha,
  handleDataTableLoadingGET,
  General,
  handleDataTableLoadingPOST,
  handlePOST,
  handlePUT,
  cambiarLabelSwitch,
  obtenerValorRadioSeleccionado,
  obtenerEstadoSwitch,
  handleGET,
  URLAPI,
  ObtenerIdTecnicoSesion,
  obtenerUsuarioLocalStorage,
  handleGETSinProgressBar,
} from "../Utils.js";

//IMPORTAR FUNCIONES PARA INCIALIZAR MODALES
import {
  clsFuncionesModales,
  inicializarDataTableUnidades,
  inicializarDataTableResponsablePorIdUnidad,
  inicializarDataTableAreasPorTipoUnidad,
  inicializarDataTableDispositivos,
  inicializarDataTableCatalogoComponentePorDispositivo,
  inicializarDataTableFactura,
} from "../UtilsFuncionesModales.js";

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
  AbrevEQ: "EQ",
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

  //VARIABLES DE CONTROL
  EsDispositivoMovil: null,
};
// ESTADO DE LOS FILTROS
let estadoFiltros = {
  unidad: null,
  responsable: null,
  dispositivo: null,
  area: null,
  catalogo: null,
  procesador: null,
  memoriaRam: null,
  almacenamiento: null,
  sistemaOp: null,
};
const api = URLAPI;

//Declaración de variables globales para DataTables y almacenamiento de datos

// ============================================
// SELECTS CON BUSQUEDA (SELECT2)
// ============================================

let tableComponentes;
let datosFiltrados = [];
let datosTecnicos = [];
let datosUnidades = [];
let datosAreas = [];
let datosResponsables = [];
let datosDispositivos = [];
let datosCatalogos = [];
let datosMarcas = [];
let datosModelos = [];
let datosProcesador = [];
let datosMemoriaRam = [];
let datosAlmacenamiento = [];
let datosSistemaOperativo = [];

//MAPS
let mapUnidades = {};
let mapDispositivo = {};
let mapaProcesadores = {};
let mapaMarcas = {};
let mapaModelos = {};
let mapaMemoriaRam = {};
let mapaAlmacenamiento = {};
let mapaSistemaOp = {};

const FILTROS_DEPENDIENTES = {
  // Filtros que dependen de otros
  filtroArea: ["filtroUnidad"], // Área depende de Unidad
  filtroResponsable: ["filtroUnidad"], // Responsable depende de Unidad
  filtroCatalogo: ["filtroDispositivo"], // Catálogo depende de Dispositivo
  filtroProcesador: ["filtroDispositivo"], // Procesador depende de Dispositivo
  filtroMemoriaRam: ["filtroDispositivo"], // RAM depende de Dispositivo
  filtroAlmacenamiento: ["filtroDispositivo"], // Almacenamiento depende de Dispositivo
  filtroSistemaOp: ["filtroDispositivo"], // SO depende de Dispositivo
};

document.addEventListener("DOMContentLoaded", function () {
  //DECLARACION VARIABLES EN DOM
  const filtrosAvanzados = document.getElementById("filtrosAvanzados");

  // ========================================
  // 1. INICIALIZAR SELECT2
  // ========================================
  function inicializarSelect2() {
    const selects = [
      "filtroTecnico",
      "filtroUnidad",
      "filtroResponsable",
      "filtroArea",
      "filtroDispositivo",
      "filtroCatalogo",
      "filtroProcesador",
      "filtroMemoriaRam",
      "filtroAlmacenamiento",
      "filtroSistemaOp",
    ];

    selects.forEach((id) => {
      $(`#${id}`).select2({
        placeholder: "Buscar...",
        allowClear: true,
        language: {
          noResults: function () {
            return "No se encontraron resultados";
          },
        },
      });
    });
  }

  // ========================================
  // 2. CARGAR DATOS PARA SELECTS
  // ========================================
  async function cargarSelects() {
    try {
      //*DECLARACION DE VARIABLES
      //tecnicos
      const tecnicos = await obtenerTecnicos("");
      datosTecnicos = tecnicos;
      //unidades
      const unidades = await obtenerUnidades("");
      datosUnidades = unidades;

      //areas
      const areas = await obtenerAreasPorTipoUnidad();
      datosAreas = areas;

      //areas
      const responsables = await obtenerResponsablesPorIdUnidad();
      datosResponsables = responsables;

      //DISPOSITIVOS
      const dispositivos = await obtenerDispositivos();
      datosDispositivos = dispositivos;

   

      //*CREACION DE MAP
      //UNIDADES
      mapUnidades = {};
      unidades.forEach((u) => {
        mapUnidades[u.id_unidad] = u;
      });

      //DISPOSITIVOS
      mapDispositivo = {};
      dispositivos.forEach((d) => {
        mapDispositivo[d.id_dispositivo] = d;
      });

      //*SELECT 2 DECLARACION Y CONFIGURACION
      //TECNICO
      // Limpiar select
      $("#filtroTecnico")
        .empty()
        .append('<option value="TECNICOS">Técnicos</option>');

      // Agregar opciones
      tecnicos.forEach((t) => {
        $("#filtroTecnico").append(
          `<option value="${t.id_tecnico}">${t.nombre}</option>`,
        );
      });

      $("#filtroTecnico").on("change", async function () {
        const idSeleccionado = $(this).val();
        estadoFormulario.id_tecnico = idSeleccionado;
      });

      //UNIDADES
      // Limpiar select
      $("#filtroUnidad")
        .empty()
        .append(
          '<option value="TODAS LAS UNIDADES">Todas las Unidades</option>',
        );

      // Agregar opciones
      unidades.forEach((u) => {
        $("#filtroUnidad").append(
          `<option value="${u.id_unidad}">${u.nombre_unidad}</option>`,
        );
      });

      //CAMBIOS EN UNIDAD
      $("#filtroUnidad").on("change", async function () {
        const idSeleccionado = $(this).val();
        estadoFormulario.IdUnidadValue = idSeleccionado;

        const unidadSeleccionada = mapUnidades[idSeleccionado];
        const tipoUnidad = unidadSeleccionada?.tipo_unidad || null;
        estadoFormulario.tipo_unidad = tipoUnidad;
        // Controlar visibilidad
        controlarVisibilidadFiltros();
        //CARGAR DEPENDIENTES
        if (idSeleccionado) {
          await Promise.all([
            cargarResponsablesPorUnidad(estadoFormulario.IdUnidadValue),
            cargarAreasPorTipoUnidad(estadoFormulario.tipo_unidad),
          ]);
        } else {
          $("#filtroResponsable")
            .empty()
            .append('<option value="">-- Seleccionar Responsable --</option>');
          $("#filtroArea")
            .empty()
            .append('<option value="">-- Seleccionar Área --</option>');
        }
      });
      //DISPOSITIVOS
      // Limpiar select
      $("#filtroDispositivo")
        .empty()
        .append('<option value="DISPOSITIVO">Dispositivo</option>');

      // Agregar opciones
      dispositivos.forEach((d) => {
        $("#filtroDispositivo").append(
          `<option value="${d.id_dispositivo}">${d.tipo_equipo}</option>`,
        );
      });

      $("#filtroDispositivo").on("change", async function () {
        const idSeleccionado = $(this).val();
        estadoFormulario.IdDispositivo = idSeleccionado;
        const dispositivoSeleccionada = mapDispositivo[idSeleccionado];
        const CaracteristicasAdicionales =
          dispositivoSeleccionada?.CaracteristicasAdicionales || null;
        estadoFormulario.CaracteristicasAdicionales =
          CaracteristicasAdicionales;
        // Controlar visibilidad
        

        if (estadoFormulario.CaracteristicasAdicionales === "SI") {
          $("#filtrosAvanzados").removeClass("d-none");
          await Promise.all([
            //cargarCatalogoPorDispositivo(estadoFormulario.IdDispositivo),
            cargarProcesadores(),
            cargarMemoriaRam(),
            cargarAlmacenamiento(),
            cargarSistemaOp(),
          ]);
        } else {
          $("#filtrosAvanzados").addClass("d-none");
          
    cargarCatalogoPorDispositivo(estadoFormulario.IdDispositivo),
          $("#filtroMarca")
            .empty()
            .append('<option value="">-- Buscar Marca --</option>');
          $("#filtroModelo")
            .empty()
            .append('<option value="">-- Buscar Modelo --</option>');
          $("#filtroProcesador")
            .empty()
            .append('<option value="">-- Buscar Procesador --</option>');
          $("#filtroMemoriaRam")
            .empty()
            .append('<option value="">-- Buscar Memoria RAM --</option>');
          $("#filtroAlmacenamiento")
            .empty()
            .append('<option value="">-- Buscar Almacenamiento --</option>');
          $("#filtroSistemaOp")
            .empty()
            .append('<option value="">-- Buscar Sistema Operativo --</option>');
          datosCatalogos = [];
        }
        //await cargarResponsablesPorUnidad(estadoFormulario.IdUnidadValue );
      });

      // Inicializar Select2 después de cargar datos
      inicializarSelect2();
    } catch (error) {
      console.error("Error cargando selects:", error);
    }
  }
  // ========================================
  // 2. CONTROLAR VISIBILIDAD DE FILTROS
  // ========================================
  function controlarVisibilidadFiltros() {
    // Área y Responsable dependen de Unidad
    const unidadSeleccionada = $("#filtroUnidad").val();
    const areaVisible = unidadSeleccionada ? true : false;
    const responsableVisible = unidadSeleccionada ? true : false;

    if (areaVisible) {
      $("#filtroArea").closest(".p-3").removeClass("d-none");
    } else {
      $("#filtroArea").closest(".p-3").addClass("d-none");
      $("#filtroArea").val("").trigger("change");
    }

    if (responsableVisible) {
      $("#filtroResponsable").closest(".p-3").removeClass("d-none");
    } else {
      $("#filtroResponsable").closest(".p-3").addClass("d-none");
      $("#filtroResponsable").val("").trigger("change");
    }

    // Catálogo y Avanzados dependen de Dispositivo
    const dispositivoSeleccionado = $("#filtroDispositivo").val();
    const catalogoVisible = dispositivoSeleccionado ? true : false;
    const avanzadosVisible = dispositivoSeleccionado ? true : false;

    if (catalogoVisible) {
      $("#filtroCatalogo").closest(".p-3").removeClass("d-none");
    } else {
      $("#filtroCatalogo").closest(".p-3").addClass("d-none");
      $("#filtroCatalogo").val("").trigger("change");
    }

    
  }

  async function cargarResponsablesPorUnidad(idUnidad) {
    try {
      // Cargar Responsables
      const responsables = await obtenerResponsablesPorIdUnidad(idUnidad);
      datosResponsables = responsables;
      $("#filtroResponsable")
        .empty()
        .append(
          '<option value="TODOS LOS RESPONSABLES">Todos los responsables</option>',
        );
      responsables.forEach((r) => {
        $("#filtroResponsable").append(
          `<option value="${r.id_responsable}">${r.nombre_responsable}</option>`,
        );
      });

      $("#filtroResponsable").on("change", async function () {
        const idSeleccionado = $(this).val();
        estadoFormulario.IdResponsable = idSeleccionado;
      });
    } catch (error) {
      console.error("Error cargando responsables:", error);
    }
  }
  async function cargarAreasPorTipoUnidad(tipoUnidad) {
    try {
      // Cargar AREAS
      const areas = await obtenerAreasPorTipoUnidad(tipoUnidad);
      datosAreas = areas;
      $("#filtroArea").empty().append('<option value="AREAS">ÁREAS</option>');
      areas.forEach((a) => {
        $("#filtroArea").append(
          `<option value="${a.id_area}">${a.area}</option>`,
        );
      });

      $("#filtroArea").on("change", async function () {
        const idSeleccionado = $(this).val();
        estadoFormulario.IdArea = idSeleccionado;
      });
    } catch (error) {
      console.error("Error cargando áreas:", error);
    }
  }
  async function cargarMarcaModeloPorDispositivo() {
    try {
      const marca = await obtenerMarcaModeloPorDispositivo("",estadoFormulario.IdDispositivo);
      mapaMarcas = {};
      marca.forEach((ma) => {
        mapaMarcas[p.id_marca] = ma;
      });

      $("#filtroMarca")
        .empty()
        .append('<option value="">-- Seleccionar Marca --</option>');
      marca.forEach((ma) => {
        $("#filtroMarca").append(
          `<option value="${ma.id_marca}">${ma.marca} ${ma.modelo}</option>`,
        );
      });
      $("#filtroModelo")
        .empty()
        .append('<option value="">-- Seleccionar Marca --</option>');
      marca.forEach((ma) => {
        $("#filtroMarca").append(
          `<option value="${ma.id_marca}">${ma.marca} ${ma.modelo}</option>`,
        );
      });
  
    } catch (error) {
      console.error("Error cargando Marcas:", error);
    }
  }
  
  async function cargarCatalogoPorDispositivo(id_dispositivo) {
  
    try {
      // Cargar AREAS
      const catalogos =await obtenerCatalogoPorDispositivo(
        id_dispositivo,
      );
      datosCatalogos = catalogos;
      $("#filtroCatalogo")
        .empty()
        .append('<option value="CATALOGO">CATÁLOGO</option>');
      catalogos.forEach((cc) => {
        $("#filtroCatalogo").append(
          `<option value="${cc.id_catalogo_componente}">${cc.nombre_catalogo}</option>`,
        );
      });

      $("#filtroCatalogo").on("change", async function () {
        const idSeleccionado = $(this).val();
        estadoFormulario.IdCatalogoComponente = idSeleccionado;
      });
    } catch (error) {
      console.error("Error cargando catalogos:", error);
    }
  }
  
  async function cargarProcesadores() {
    try {
      const procesadores = await obtenerProcesadores("");
      mapaProcesadores = {};
      procesadores.forEach((p) => {
        mapaProcesadores[p.IdProcesador] = p;
      });

      $("#filtroProcesador")
        .empty()
        .append('<option value="">-- Seleccionar Procesador --</option>');
      procesadores.forEach((p) => {
        $("#filtroProcesador").append(
          `<option value="${p.IdProcesador}">${p.Fabricante} ${p.serie} ${p.modelo}</option>`,
        );
      });
    } catch (error) {
      console.error("Error cargando procesadores:", error);
    }
  }

  async function cargarMemoriaRam() {
    try {
      const memoria = await obtenerMemoriaRam("");
      mapaMemoriaRam = {};
      memoria.forEach((m) => {
        mapaMemoriaRam[m.IdMemoriaRam] = m;
      });

      $("#filtroMemoriaRam")
        .empty()
        .append('<option value="">-- Seleccionar RAM --</option>');
      memoria.forEach((m) => {
        $("#filtroMemoriaRam").append(
          `<option value="${m.IdMemoriaRam}">${m.CapacidadGB} ${m.Tipo}</option>`,
        );
      });
    } catch (error) {
      console.error("Error cargando memoria RAM:", error);
    }
  }

  async function cargarAlmacenamiento() {
    try {
      const almacenamiento = await obtenerAlmacenamiento("");
      mapaAlmacenamiento = {};
      almacenamiento.forEach((a) => {
        mapaAlmacenamiento[a.IdDiscoDuro] = a;
      });

      $("#filtroAlmacenamiento")
        .empty()
        .append('<option value="">-- Seleccionar Almacenamiento --</option>');
      almacenamiento.forEach((a) => {
        $("#filtroAlmacenamiento").append(
          `<option value="${a.IdDiscoDuro}">${a.Tipo} ${a.Capacidad_GB}</option>`,
        );
      });
    } catch (error) {
      console.error("Error cargando almacenamiento:", error);
    }
  }

  async function cargarSistemaOp() {
    try {
      const sistemaOp = await obtenerSistemaOp("");
      mapaSistemaOp = {};
      sistemaOp.forEach((s) => {
        mapaSistemaOp[s.IdSistemaOperativo] = s;
      });

      $("#filtroSistemaOp")
        .empty()
        .append('<option value="">-- Seleccionar SO --</option>');
      sistemaOp.forEach((s) => {
        $("#filtroSistemaOp").append(
          `<option value="${s.IdSistemaOperativo}">${s.Nombre} ${s.VersIon_SO} ${s.Arquitectura}</option>`,
        );
      });
    } catch (error) {
      console.error("Error cargando sistema operativo:", error);
    }
  }

  // ========================================
  // 3. OBTENER DATOS (API)
  // ========================================
  async function obtenerTecnicos(searchTerm) {
    const config = {
      url: `${api}/api/tecnicos/consultatecnicosActivos`, // URL específica
      timeoutDuration: 5000,
      data: { searchTerm }, //  no se pasa si no hay query params
    };
    const response = await handleGETSinProgressBar(config);

    const data = response.data.body;

    return data;
  }
  async function obtenerUnidades(searchTerm) {
    const config = {
      url: `${api}/api/unidades/ConsultaPorUnidadBusqueda`, // URL específica
      timeoutDuration: 5000,
      data: { searchTerm }, //  no se pasa si no hay query params
    };
    const response = await handleGETSinProgressBar(config);

    const data = response.data.body;

    return data;
  }

  async function obtenerAreasPorTipoUnidad(TipoUnidad) {
    if (!TipoUnidad) {
      return [];
    }

    const config = {
      url: `${api}/api/areas/ConsultaTodasAreasPorTipoUnidad?TipoUnidad=${TipoUnidad}`, // URL específica
      timeoutDuration: 5000,
      //  no se pasa si no hay query params
    };
    const response = await handleGETSinProgressBar(config);

    const data = response.data.body;

    return data;
  }

  async function obtenerResponsablesPorIdUnidad(idUnidad) {
    if (!idUnidad) {
      return [];
    }
    console.log("Obteniendo responsables para unidad ID:", idUnidad);

    const config = {
      url: `${api}/api/responsables/ConsultaTodosResponsablePorIDUnidad?id_unidad=${idUnidad}`, // URL específica
      timeoutDuration: 5000,
      //  no se pasa si no hay query params
    };
    const response = await handleGETSinProgressBar(config);

    const data = response.data.body;

    return data;
  }
  async function obtenerDispositivos() {
    const config = {
      url: `${api}/api/dispositivos/ConsultaTodosDispositivos`, // URL específica
      timeoutDuration: 5000,
    };
    const response = await handleGETSinProgressBar(config);

    const data = response.data.body;

    return data;
  }

  async function obtenerCatalogoPorDispositivo(IdDispositivo) {
    console.log("IdDispositivo",IdDispositivo)
    const config = {
      url: `${api}/api/CatalogosComponentes/ConsultaTodosCatalogoPorDispositivo?IdDispositivo=${IdDispositivo}`, // URL específica
      timeoutDuration: 5000, //  no se pasa si no hay query params
    };
    const response = await handleGETSinProgressBar(config);

    const data = response.data.body;

    return data;
  }
  async function obtenerMarcaModeloPorDispositivo(searchTerm,FK_dispositivo) {
    const config = {
      url: `${api}/api/MarcaModelo/ctl_consulta_Por_MarcaModelo_BusquedaPorDispositivo`, // URL específica
      timeoutDuration: 5000,
      data: { searchTerm,FK_dispositivo },
    };
    const response = await handleGETSinProgressBar(config);

    const data = response.data.body;

    return data;
  }
  async function obtenerProcesadores(searchTerm) {
    const config = {
      url: `${api}/api/procesador/consulta_Todos_Procesador_busqueda`, // URL específica
      timeoutDuration: 5000,
      data: { searchTerm },
    };
    const response = await handleGETSinProgressBar(config);

    const data = response.data.body;

    return data;
  }
  async function obtenerMemoriaRam(searchTerm) {
    const config = {
      url: `${api}/api/MemoriaRam/consulta_Todos_MemoriaRam_busqueda`, // URL específica
      timeoutDuration: 5000,
      data: { searchTerm },
    };
    const response = await handleGETSinProgressBar(config);

    const data = response.data.body;

    return data;
  }
  async function obtenerAlmacenamiento(searchTerm) {
    const config = {
      url: `${api}/api/Almacenamiento/consulta_Todos_DiscoDuro_busqueda`, // URL específica
      timeoutDuration: 5000,
      data: { searchTerm },
    };
    const response = await handleGETSinProgressBar(config);

    const data = response.data.body;

    return data;
  }
  async function obtenerSistemaOp(searchTerm) {
    const config = {
      url: `${api}/api/SistemaOperativo/consulta_Todos_SistemaOperativo_busqueda`, // URL específica
      timeoutDuration: 5000,
      data: { searchTerm },
    };
    const response = await handleGETSinProgressBar(config);

    const data = response.data.body;

    return data;
  }

  // ========================================
  // 4. INICIALIZAR DATATABLES
  // ========================================
  tableComponentes = $("#tablaResultadoComponentes").DataTable({
    paging: true,
    pageLength: 10,
    lengthMenu: [10, 25, 50],
    searching: false,
    ordering: true,
    info: false,
    language: {
      zeroRecords: "No se encontraron resultados",
      emptyTable: "No hay datos disponibles",
      info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
      infoEmpty: "Mostrando 0 a 0 de 0 registros",
      infoFiltered: "(filtrado de _MAX_ registros totales)",
      lengthMenu: "Mostrar _MENU_ registros",
      paginate: {
        first: "Primero",
        last: "Último",
        next: "Siguiente",
        previous: "Anterior",
      },
    },
    dom: "<'row'<'col-sm-12'tr>><'row'<'col-sm-6'l><'col-sm-6'f>><'row'<'col-sm-12'ip>>",
    destroy: true,
  });

  // ========================================
  // 5. CARGAR DATOS INICIALES
  // ========================================
  async function cargarDatosIniciales() {
    try {
      $("#tablaResultadoComponentes tbody").html(
        '<tr><td colspan="9" class="text-center">Cargando...</td></tr>',
      );

      const datos = await obtenerDatosComponentes();
      datosFiltrados = datos;

      tableComponentes.clear();
      datos.forEach((item, index) => {
        tableComponentes.row.add([
          index + 1,
          item.codigo_TI || "-",
          item.numero_serie || "-",
          item.nombre_unidad || "-",
          item.nombre_responsable || "-",
          item.marca || "-",
          item.modelo || "-",
          item.status_componente || "-",
          `<button class="btn btn-sm btn-primary" onclick="verDetalle(${item.id_componente})">
                        <i class="fas fa-eye"></i>
                    </button>`,
        ]);
      });

      tableComponentes.draw();
      actualizarInfoPaginacion();
    } catch (error) {
      console.error("Error:", error);
      $("#tablaResultadoComponentes tbody").html(
        '<tr><td colspan="9" class="text-center text-danger">Error al cargar datos</td></tr>',
      );
    }
  }

  // ========================================
  // 6. APLICAR FILTROS
  // ========================================
  function aplicarFiltros() {
    const filtroCodigoTI = $("#filtroCodigoTI").val().toLowerCase();
    const filtroSerie = $("#filtroNumeroSerie").val().toLowerCase();
    const filtroUnidad = $("#filtroUnidad").val();
    const filtroResponsable = $("#filtroResponsable").val();
    const filtroMarca = $("#filtroMarca").val();
    const filtroModelo = $("#filtroModelo").val();
    const filtroStatus = $("#filtroStatus").val();

    // Filtrar datos
    datosFiltrados = datosFiltrados.filter((item) => {
      return (
        (!filtroCodigoTI ||
          item.codigo_TI?.toLowerCase().includes(filtroCodigoTI)) &&
        (!filtroSerie ||
          item.numero_serie?.toLowerCase().includes(filtroSerie)) &&
        (!filtroUnidad || item.id_unidad?.toString() === filtroUnidad) &&
        (!filtroResponsable ||
          item.id_responsable?.toString() === filtroResponsable) &&
        (!filtroMarca || item.id_marca?.toString() === filtroMarca) &&
        (!filtroModelo || item.id_modelo?.toString() === filtroModelo) &&
        (!filtroStatus || item.status_componente?.toString() === filtroStatus)
      );
    });

    // Actualizar tabla
    tableComponentes.clear();
    datosFiltrados.forEach((item, index) => {
      tableComponentes.row.add([
        index + 1,
        item.codigo_TI || "-",
        item.numero_serie || "-",
        item.nombre_unidad || "-",
        item.nombre_responsable || "-",
        item.marca || "-",
        item.modelo || "-",
        item.status_componente || "-",
        `<button class="btn btn-sm btn-primary" onclick="verDetalle(${item.id_componente})">
                    <i class="fas fa-eye"></i>
                </button>`,
      ]);
    });

    tableComponentes.draw();
    actualizarInfoPaginacion();

    if (datosFiltrados.length === 0) {
      Swal.fire({
        icon: "info",
        title: "Sin resultados",
        text: "No se encontraron componentes con los filtros seleccionados",
        confirmButtonText: "Entendido",
      });
    }
  }

  // ========================================
  // 7. LIMPIAR FILTROS
  // ========================================
  function limpiarFiltros() {
    $("#filtroCodigoTI").val("");
    $("#filtroNumeroSerie").val("");
    $("#filtroUnidad").val("").trigger("change");
    $("#filtroResponsable").val("").trigger("change");
    $("#filtroMarca").val("").trigger("change");
    $("#filtroModelo").val("").trigger("change");
    $("#filtroStatus").val("");

    cargarDatosIniciales();
  }

  // ========================================
  // 8. ACTUALIZAR INFORMACIÓN DE PAGINACIÓN
  // ========================================
  function actualizarInfoPaginacion() {
    const info = tableComponentes.page.info();
    $("#infoPaginacion").text(
      `Mostrando ${info.start + 1}-${Math.min(info.end, info.recordsTotal)} de ${info.recordsTotal} registros`,
    );
  }

  // ========================================
  // 9. OBTENER DATOS (SIMULADO)
  // ========================================
  async function obtenerDatosComponentes() {
    return [
      {
        id_componente: 1,
        codigo_TI: "COD-TI-001",
        numero_serie: "ABC123456",
        id_unidad: 1,
        nombre_unidad: "Administrativa",
        id_responsable: 1,
        nombre_responsable: "Juan Pérez",
        id_marca: 1,
        marca: "HP",
        id_modelo: 1,
        modelo: "Latitude 5420",
        status_componente: "1",
      },
      {
        id_componente: 2,
        codigo_TI: "COD-TI-002",
        numero_serie: "XYZ789012",
        id_unidad: 2,
        nombre_unidad: "Técnica",
        id_responsable: 2,
        nombre_responsable: "María García",
        id_marca: 2,
        marca: "Dell",
        id_modelo: 2,
        modelo: "ThinkPad X1",
        status_componente: "1",
      },
    ];
  }

  // ========================================
  // 10. EVENTOS
  // ========================================
  $("#btnAplicarFiltros").on("click", function () {
    aplicarFiltros();
  });

  $("#btnLimpiarFiltros").on("click", function () {
    limpiarFiltros();
  });

  $("#busquedaTabla").on("keyup", function () {
    const valor = $(this).val().toLowerCase();
    tableComponentes.search(valor).draw();
  });

  // ========================================
  // 11. INICIALIZAR
  // ========================================
  cargarSelects();
  cargarDatosIniciales();
});

// ============================================
// VER DETALLE (FUNCION GLOBAL)
// ============================================
window.verDetalle = function (id) {
  console.log("Ver detalle de componente:", id);
};
