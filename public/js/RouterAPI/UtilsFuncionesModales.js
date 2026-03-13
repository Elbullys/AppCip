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
} from "./Utils.js";

const api = URLAPI;

// Función auxiliar para agregar eventos
const agregarEventosSeleccion = (
  tableInstance,
  resolve,
  modalId,
  btnSeleccionarId,
) => {
  const tableBody = $(tableInstance.table().body());

  // 1. Doble Clic: Resuelve con el objeto completo de la fila inmediatamente
  tableBody.off("dblclick").on("dblclick", "tr", function () {
    const rowData = tableInstance.row(this).data();
    if (rowData) {
      $(modalId).modal("hide");

      resolve(rowData);
    }
  });

  // 2. Clic Simple: Manejo de selección visual
  tableBody.off("click").on("click", "tr", function () {
    // Quitamos la clase a cualquier otra fila previamente seleccionada
    tableInstance.$("tr.selected-row").removeClass("selected-row table-active");
    tableInstance.$("td.selected-cell").removeClass("selected-cell");

    // Aplicamos la clase a la fila actual
    $(this).addClass("selected-row table-active");
    $(this).find("td").addClass("selected-cell");

    // Forzamos el redibujado de celdas si es necesario
    tableInstance.cells().invalidate();
  });

  // 3. Botón Seleccionar: Resuelve con la fila que tenga la clase 'selected-row'
  $(btnSeleccionarId)
    .off("click")
    .on("click", function (e) {
      e.preventDefault();

      // Buscamos la fila seleccionada a través de la clase CSS
      const selectedRowData = tableInstance.row(".selected-row").data();

      if (selectedRowData) {
        $(modalId).modal("hide");

        resolve(selectedRowData); // Retorna el objeto completo
      } else {
        Swal.fire({
          icon: "warning",
          title: "Selección requerida",
          text: "Por favor, haz clic en una fila para seleccionarla.",
        });
      }
    });
  $(modalId).on("hidden.bs.modal", function () {
    // 1. Vaciar todas las filas del tbody
    tableInstance.clear().draw();

    // 2. Limpiar selección visual (por seguridad)
    tableInstance.$("tr.selected-row").removeClass("selected-row table-active");
    tableInstance.$("td.selected-cell").removeClass("selected-cell");

    // 3. Limpiar el input de búsqueda (si existe)
    const searchInput = $(modalId).find('input[type="search"]');
    if (searchInput.length) {
      searchInput.val("").trigger("change");
    }
  });
};
export class clsFuncionesModales {
  //* Función BuscarUnidad
  static async BuscarUnidad(searchTerm) {
    return inicializarDataTableUnidades(searchTerm);
  }

  //*FUNCION BUSCAR RESPONSABLE
  static async BuscarResponsable(searchTerm, id_unidad) {
    return inicializarDataTableResponsablePorIdUnidad(
      searchTerm || "",
      id_unidad,
    );
  }
  //*FUNCION BUSCAR AREA
  static async BuscarArea(searchTerm, tipo_unidad) {
    // Retorna la Promise de inicializarDataTableAreasPorTipoUnidad
    return inicializarDataTableAreasPorTipoUnidad(
      searchTerm || "",
      tipo_unidad,
    );
  }

  //* Función BuscarDispositivo
  static async BuscarDispositivo(searchTerm) {
    return inicializarDataTableDispositivos(searchTerm);
  }

  //* Función BuscarCatalogoComponente
  static async BuscarCatalogoComponente(searchTerm, IdDispositivo) {
    return inicializarDataTableCatalogoComponentePorDispositivo(
      searchTerm,
      IdDispositivo,
    );
  }

  //* Función BuscarFACTURA
  static async BuscarFactura(searchTerm) {
    return inicializarDataTableFactura(searchTerm);
  }
  //* Función BuscarComponente
  static async BuscarComponente(searchTerm) {
    return inicializarDataTableComponentes(searchTerm);
  }

}
//*FUNCION DATATABLE UNIDADES
export async function inicializarDataTableUnidades(searchTerm) {
  var urlUnidades = `${api}/api/unidades/ConsultaPorUnidad`;

  // Variables locales
  let selectedId = null;
  let selectedRow = null;
  let table;

  // Desconectar eventos previos
  $("#table_Modal_Consulta tbody").off("dblclick", "tr");
  $("#table_Modal_Consulta tbody").off("click", "tr");
  $("#btnSeleccionar").off("click");

  // Configuración base para DataTable
  const configBase = {
    columns: [
      { data: "id_unidad", title: "ID Unidad" },
      { data: "tipo_unidad", title: "Tipo de Unidad" },
      { data: "nombre_unidad", title: "Unidad" },
      { data: "municipio", title: "Municipio" },
      { data: "Estado", title: "Estado" },
      { data: "estado_unidad", title: "Status" },
    ],
    language: {
      zeroRecords: "No se encontraron resultados",
      emptyTable: "No hay datos disponibles",
    },
    dom: "t",
    paging: false,
    info: false,
    ordering: false,
    responsive: true,
    destroy: true,
  };

  // Retornar la Promise directamente  UNIDADES
  return new Promise((resolve, reject) => {
    const url = urlUnidades;
    const dataPayload = { search: searchTerm };

    if (!searchTerm) {
      table = $("#table_Modal_Consulta").DataTable({
        ...configBase,
        data: [],
      });
    } else {
      handleDataTableLoadingPOST({
        url: url,
        data: { search: dataPayload },
        timeoutDuration: 60000,
      })
        .then((data) => {
          if (data && Array.isArray(data) && data.length > 0) {
            table = $("#table_Modal_Consulta").DataTable({
              ...configBase,
              data: data,
            });

            // Agregar eventos con resolve
            agregarEventosSeleccion(
              table,
              resolve,
              "#consultaUnidadesModal",
              "#btnSeleccionar",
            );
          } else {
            reject(new Error("No hay datos para mostrar."));
          }
        })
        .catch((error) => {
          console.error("Error al cargar datos:", error);
          Swal.fire({
            icon: "error",
            title: "Error en la carga",
            text: error.message,
          });
          reject(error);
        });
    }
  });
}
//*FUNCION DATATABLE RESPONSABLE
export async function inicializarDataTableResponsablePorIdUnidad(
  searchTerm,
  id_unidad,
) {
  var urlBusquedaResponsablePorIDUnidad = `${api}/api/responsables/ConsultaResponsablePorUnidad`;
  var urlBusquedaTodasResponsablePorIDUnidad = `${api}/api/responsables/ConsultaTodosResponsablePorIDUnidad`;

  // Variables locales
  let selectedId = null;
  let selectedRow = null;
  let table;

  // Desconectar eventos previos
  $("#table_Modal_ConsultaResponsable tbody").off("dblclick", "tr");
  $("#table_Modal_ConsultaResponsable tbody").off("click", "tr");
  $("#btnSeleccionarResponsable").off("click");

  // Configuración base para DataTable
  const configBase = {
    columns: [
      { data: "id_responsable", title: "ID Responsable" },
      { data: "nombre_responsable", title: "Responsable" },
      { data: "cargo", title: "Cargo" },
      { data: "area", title: "Área " },
    ],
    language: {
      zeroRecords: "No se encontraron resultados",
      emptyTable: "No hay datos disponibles",
    },
    dom: "t",
    paging: false,
    info: false,
    ordering: false,
    responsive: true,
    destroy: true, // Opción clave: destruye automáticamente si ya existe
  };

  //*MODAL RESPONSABLE
  // Retornar la Promise directamente  RESPONSABLE
  return new Promise((resolve, reject) => {
    const url = !searchTerm
      ? urlBusquedaTodasResponsablePorIDUnidad
      : urlBusquedaResponsablePorIDUnidad;
    const dataPayload = !searchTerm
      ? { id_unidad: id_unidad }
      : { id_unidad: id_unidad, searchTerm: searchTerm };

    handleDataTableLoadingGET({
      url: url,
      data: dataPayload,
      timeoutDuration: 60000,
    })
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          table = $("#table_Modal_ConsultaResponsable").DataTable({
            ...configBase,
            data: data,
          });

          // Agregar eventos con resolve
          agregarEventosSeleccion(
            table,
            resolve,
            "#consultaResponsableModal",
            "#btnSeleccionarResponsable",
          );
        } else {
          reject(new Error("No hay datos para mostrar."));
        }
      })
      .catch((error) => {
        console.error("Error al cargar datos:", error);
        Swal.fire({
          icon: "error",
          title: "Error en la carga",
          text: error.message,
        });
        reject(error);
      });
  });
}
//*FUNCION DATATABLE AREAS
export async function inicializarDataTableAreasPorTipoUnidad(
  searchTerm,
  tipo_unidad,
) {
  const urlBusquedaAreaPorTipoUnidad = `${api}/api/areas/ConsultaAreaPorTipoUnidad`;
  const urlBusquedaTodasAreasTipoUnidad = `${api}/api/areas/ConsultaTodasAreasPorTipoUnidad`;

  // Variables locales
  let selectedId = null;
  let selectedRow = null;
  let table;

  // Desconectar eventos previos
  $("#table_Modal_ConsultaArea tbody").off("dblclick", "tr");
  $("#table_Modal_ConsultaArea tbody").off("click", "tr");
  $("#btnSeleccionarArea").off("click");

  // Configuración base para DataTable
  const configBase = {
    columns: [
      { data: "id_area", title: "ID Área" },
      { data: "area", title: "Área" },
      { data: "tipo_unidad", title: "Tipo Unidad" },
      { data: "DescripcionArea", title: "Descripción de Área" },
    ],
    language: {
      zeroRecords: "No se encontraron resultados",
      emptyTable: "No hay datos disponibles",
    },
    dom: "t",
    paging: false,
    info: false,
    ordering: false,
    responsive: true,
    destroy: true,
  };

  //*MODAL AREAS
  // Retornar la Promise directamente  AREAS
  return new Promise((resolve, reject) => {
    const url = !searchTerm
      ? urlBusquedaTodasAreasTipoUnidad
      : urlBusquedaAreaPorTipoUnidad;
    const dataPayload = !searchTerm
      ? { TipoUnidad: tipo_unidad }
      : { TipoUnidad: tipo_unidad, searchTerm: searchTerm };

    handleDataTableLoadingGET({
      url: url,
      data: dataPayload,
      timeoutDuration: 60000,
    })
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          table = $("#table_Modal_ConsultaArea").DataTable({
            ...configBase,
            data: data,
          });

          // Agregar eventos con resolve
          agregarEventosSeleccion(
            table,
            resolve,
            "#consultaAreasModal",
            "#btnSeleccionarArea",
          );
        } else {
          reject(new Error("No hay datos para mostrar."));
        }
      })
      .catch((error) => {
        console.error("Error al cargar datos:", error);
        Swal.fire({
          icon: "error",
          title: "Error en la carga",
          text: error.message,
        });
        reject(error);
      });
  });
}

//*FUNCION DATATABLE DISPOSITIVOS
export async function inicializarDataTableDispositivos(searchTerm) {
  var urlDispositivos = `${api}/api/dispositivos/ConsultaPorDispositivosBusqueda`;

  // Variables locales
  let selectedId = null;
  let selectedRow = null;
  let table;

  // Desconectar eventos previos
  $("#table_Modal_ConsultaDispositivos tbody").off("dblclick", "tr");
  $("#table_Modal_ConsultaDispositivos tbody").off("click", "tr");
  $("#btnBuscarDispositivo").off("click");

  // Configuración base para DataTable
  const configBase = {
    columns: [
      { data: "id_dispositivo", title: "ID Dispositivo" },
      { data: "tipo_equipo", title: "Dispositivo" },
      { data: "abreviatura_tipo", title: "Abreviatura" },
      { data: "descripcion_equipo", title: "Descripción" },
    ],
    language: {
      zeroRecords: "No se encontraron resultados",
      emptyTable: "No hay datos disponibles",
    },
    dom: "t",
    paging: false,
    info: false,
    ordering: false,
    responsive: true,
    destroy: true,
  };

  // Retornar la Promise directamente  DISPOSITIVOS
  return new Promise((resolve, reject) => {
    const url = urlDispositivos;
    const dataPayload = searchTerm;

    if (!searchTerm) {
      table = $("#table_Modal_ConsultaDispositivos").DataTable({
        ...configBase,
        data: [],
      });
    } else {
      handleDataTableLoadingGET({
        url: url,
        data: { searchTerm: dataPayload },
        timeoutDuration: 60000,
      })
        .then((data) => {
          if (data && Array.isArray(data) && data.length > 0) {
            table = $("#table_Modal_ConsultaDispositivos").DataTable({
              ...configBase,
              data: data,
            });

            // Agregar eventos con resolve
            agregarEventosSeleccion(
              table,
              resolve,
              "#consultaDispositivosModal",
              "#btnSeleccionardispositivo",
            );
          } else {
            reject(new Error("No hay datos para mostrar."));
          }
        })
        .catch((error) => {
          console.error("Error al cargar datos:", error);
          Swal.fire({
            icon: "error",
            title: "Error en la carga",
            text: error.message,
          });
          reject(error);
        });
    }
  });
}

//*FUNCION DATATABLE CATALOGO COMPONENTES
export async function inicializarDataTableCatalogoComponentePorDispositivo(
  searchTerm,
  IdDispositivo,
) {
  const urlBusquedaCatalogoComponentePorDispositivo = `${api}/api/CatalogosComponentes/ConsultaCatalogosPorDispositivoBusqueda`;
  const urlTodosCatalogoComponentePorDispositivo = `${api}/api/CatalogosComponentes/ConsultaTodosCatalogoPorDispositivo`;

  // Variables locales
  let selectedId = null;
  let selectedRow = null;
  let table;

  // Desconectar eventos previos
  $("#table_Modal_ConsultaCatalogoComponente tbody").off("dblclick", "tr");
  $("#table_Modal_ConsultaCatalogoComponente tbody").off("click", "tr");
  $("#btnSeleccionarCatalogo").off("click");

  // Configuración base para DataTable
  const configBase = {
    columns: [
      { data: "nombre_catalogo", title: "Nombre Cátalogo" },

      { data: "tipo_equipo", title: "Dispositivo" },
      { data: "marca", title: "Marca" },
      { data: "modelo", title: "Modelo" },
      { data: "Procesador", title: "Procesador" },
      { data: "Memoria Ram", title: "Memoria Ram" },
      { data: "Disco Duro", title: "Disco Duro" },
      { data: "Sistema Operativo", title: "Sistema Operativo" },
    ],
    language: {
      zeroRecords: "No se encontraron resultados",
      emptyTable: "No hay datos disponibles",
    },
    dom: "t",
    paging: false,
    info: false,
    ordering: false,
    responsive: true,
    destroy: true,
  };

  //*MODAL CATALOGO COMPONENTES
  // Retornar la Promise directamente  CATALOGO COMPONENTES
  return new Promise((resolve, reject) => {
    const url = !searchTerm
      ? urlTodosCatalogoComponentePorDispositivo
      : urlBusquedaCatalogoComponentePorDispositivo;
    const dataPayload = !searchTerm
      ? { IdDispositivo: IdDispositivo }
      : { IdDispositivo: IdDispositivo, searchTerm: searchTerm };

    handleDataTableLoadingGET({
      url: url,
      data: dataPayload,
      timeoutDuration: 60000,
    })
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          table = $("#table_Modal_ConsultaCatalogoComponente").DataTable({
            ...configBase,
            data: data,
          });

          // Agregar eventos con resolve
          agregarEventosSeleccion(
            table,
            resolve,
            "#consultaCatalogoComponenteModal",
            "#btnSeleccionarCatalogo",
          );
        } else {
          reject(new Error("No hay datos para mostrar."));
        }
      })
      .catch((error) => {
        console.error("Error al cargar datos:", error);
        Swal.fire({
          icon: "error",
          title: "Error en la carga",
          text: error.message,
        });
        reject(error);
      });
  });
}

//*FUNCION DATATABLE FACTURAS
export async function inicializarDataTableFactura(searchTerm) {
  const urlBusquedaFactura = `${api}/api/facturas/ConsultaFacturaBusqueda`;
  const urlTodasFactura = `${api}/api/facturas/ConsultaTodasFacturas`;

  // Variables locales
  let selectedId = null;
  let selectedRow = null;
  let table;

  // Desconectar eventos previos
  $("#table_Modal_ConsultaFactura tbody").off("dblclick", "tr");
  $("#table_Modal_ConsultaFactura tbody").off("click", "tr");
  $("#btnSeleccionarFactura").off("click");

  // Configuración base para DataTable
  const configBase = {
    columns: [
      { data: "IdFactura", title: "Id Factura" },
      { data: "NumeroFactura", title: "Número de Factura" },
      { data: "NombreProveedor", title: "Nombre del Proveedor" },
      { data: "LugarCompra", title: "Lugar de Compra" },
      {
        data: "FechaFactura",
        title: "Fecha de Factura",
        render: function (data, type, row) {
          // Formatea la fecha si es necesario (ej. a DD/MM/YYYY)
          if (type === "display" && data) {
            const date = new Date(data);
            return date.toLocaleDateString("es-ES"); // Ejemplo: 15/10/2023
          }
          return data;
        },
      },
      { data: "Observacion", title: "Observación" },
    ],
    language: {
      zeroRecords: "No se encontraron resultados",
      emptyTable: "No hay datos disponibles",
    },
    dom: "t",
    paging: false,
    info: false,
    ordering: true,
    responsive: true,
    destroy: true,
  };

  //*MODAL facturas
  // Retornar la Promise directamente  FACTURAS
  return new Promise((resolve, reject) => {
    const url = !searchTerm ? urlTodasFactura : urlBusquedaFactura;
    //const dataPayload = searchTerm;
    const dataPayload = !searchTerm
      ? { searchTerm: "" }
      : { searchTerm: searchTerm };

    handleDataTableLoadingGET({
      url: url,
      data: dataPayload,
      timeoutDuration: 60000,
    })
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          table = $("#table_Modal_ConsultaFactura").DataTable({
            ...configBase,
            data: data,
          });

          // Agregar eventos con resolve
          agregarEventosSeleccion(
            table,
            resolve,
            "#consultaFacturaModal",
            "#btnSeleccionarFactura",
          );
        } else {
          reject(new Error("No hay datos para mostrar."));
        }
      })
      .catch((error) => {
        console.error("Error al cargar datos:", error);
        Swal.fire({
          icon: "error",
          title: "Error en la carga",
          text: error.message,
        });
        reject(error);
      });
  });
}

//*FUNCION DATATABLE COMPONENTES
export async function inicializarDataTableComponentes(searchTerm) {
  var urlComponentes = `${api}/api/componentes/consulta_Todos_Componentes_Busqueda`;

  // Variables locales
  let selectedId = null;
  let selectedRow = null;
  let table;

  // Desconectar eventos previos
  $("#table_Modal_componentes tbody").off("dblclick", "tr");
  $("#table_Modal_componentes tbody").off("click", "tr");
  $("#btnSeleccionarComponente").off("click");

  // Configuración base para DataTable
 const configBase = {
  // Columnas
  columns: [
    { data: "id_componente", title: "ID Componente" },
    { data: "nombre_responsable", title: "Responsable" },
    { data: "nombre_unidad", title: "Unidad" },
    { data: "tipo_equipo", title: "Dispositivo" },
    { data: "marca", title: "Catálogo" },
    { data: "numero_serie", title: "Número de Serie" },
    { data: "operacion", title: "Operación" },
    { data: "codigo_TI", title: "Código TI" },
    { data: "observaciones", title: "Observación" },
    { data: "status_componente", title: "Status" },
    { data: "area", title: "Área" },
    { data: "status_inventario", title: "Activo/Baja" },
  ],
  
  // Idioma
  language: {
    url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json',
    zeroRecords: "No se encontraron resultados",
    emptyTable: "No hay datos disponibles",
    info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
    infoEmpty: "Mostrando 0 a 0 de 0 registros",
    infoFiltered: "(filtrado de _MAX_ registros totales)",
    lengthMenu: "Mostrar _MENU_ registros",
   
    paginate: {
      first: "Primero",
      last: "Último",
      next: ">",
      previous: "<"
    }
  },
  
  // Paginación
  paging: true,
  pageLength: 10,
  lengthMenu: [10, 25, 50, 100],
  
  // Búsqueda
  searching: false, 
  search: {
    smart: true,
    regex: false
  },
  
  // Ordenamiento
  ordering: true,
  order: [],
  
  // Información
  info: true,
  
  // Procesamiento
  processing: false,
  
  // Responsive
  responsive: true,
  
 
  
  // DOM 
  dom: "<'row'<'col-sm-12'tr>><'row'<'col-sm-6'l><'col-sm-6'f>><'row'<'col-sm-12'ip>>",
  
  // Destruir instancia anterior si existe
  destroy: true,
  
  // Limites
  rowsPorPagina: 10,
  maxRegistrosCarga: 100,
  tiempoCarga: 2000,
};

  // Retornar la Promise directamente  DISPOSITIVOS
  return new Promise((resolve, reject) => {
    const url = urlComponentes;
    const dataPayload = searchTerm;

    if (!searchTerm) {
      table = $("#table_Modal_componentes").DataTable({
        ...configBase,
        data: [],
      });
    } else {
      handleDataTableLoadingGET({
        url: url,
        data: { searchTerm: dataPayload },
        timeoutDuration: 60000,
      })
        .then((data) => {
          if (data && Array.isArray(data) && data.length > 0) {
            table = $("#table_Modal_componentes").DataTable({
              ...configBase,
              data: data,
            });

            // Agregar eventos con resolve
            agregarEventosSeleccion(
              table,
              resolve,
              "#consultaComponentesModal",
              "#btnSeleccionarComponente",
            );
          } else {
            reject(new Error("No hay datos para mostrar."));
          }
        })
        .catch((error) => {
          console.error("Error al cargar datos:", error);
          Swal.fire({
            icon: "error",
            title: "Error en la carga",
            text: error.message,
          });
          reject(error);
        });
    }
  });
}

// Función genérica para ocultar elementos
export const ocultarElementos = (selectores) => {
  selectores.forEach((selector) => {
    const elementos = document.querySelectorAll(selector);
    elementos.forEach((elemento) => {
      if (elemento) {
        elemento.style.display = "none";
      } else {
        console.warn(`Elemento no encontrado para selector: ${selector}`); // Logging
      }
    });
  });
};

// Función para mostrar elementos
export const mostrarElementos = (selectores) => {
  selectores.forEach((selector) => {
    const elementos = document.querySelectorAll(selector);
    elementos.forEach((elemento) => {
      if (elemento) {
        elemento.style.display = "";
      }
    });
  });
};

export class BuscadorGenericoSelectFiltro {
  constructor(configBuscador, elementosDOM) {
    // Configuración de campos
    this.configBuscador = configBuscador;
    // Referencias a elementos DOM
    this.vistaBuscador = elementosDOM.vistaBuscador;
    this.inputBusqueda = elementosDOM.inputBusqueda;
    this.btnFiltro = elementosDOM.btnFiltro;
    this.listaResultados = elementosDOM.listaResultados;
    this.btnCancelar = elementosDOM.btnCancelar;
    // Estado
    this.campoActual = null;
  }

  // Método genérico para ocultar elementos
  ocultarElementos(selectores) {
    selectores.forEach((selector) => {
      const elementos = document.querySelectorAll(selector);
      elementos.forEach((elemento) => {
        if (elemento) {
          elemento.style.display = "none";
        }
      });
    });
  }

  // Método genérico para mostrar elementos
  mostrarElementos(selectores) {
    selectores.forEach((selector) => {
      const elementos = document.querySelectorAll(selector);
      elementos.forEach((elemento) => {
        if (elemento) {
          elemento.style.display = "flex"; // O 'block' según el layout
        }
      });
    });
  }

  // Método para abrir el buscador
  abrir(campo, nombre) {
    this.campoActual = campo;
    const config = this.configBuscador[campo];
    const busquedaTittle = document.getElementById("busquedaTittle");
    busquedaTittle.textContent = `Realiza tu búsqueda ${nombre}`;

    // Muestra búsqueda
    this.vistaBuscador.style.display = "block";
    this.inputBusqueda.placeholder = config.placeholder;
    this.inputBusqueda.focus();
    this.inputBusqueda.value = "";
    this.listaResultados.innerHTML =
      '<div class="text-center p-3 text-muted">Escribe algo para buscar</div>';
    if (config.onOpen) config.onOpen();
  }

  // Método para cerrar el buscador
  cerrar() {
    this.vistaBuscador.style.display = "none";

    const config = this.configBuscador[this.campoActual];
    if (config && config.onClose) config.onClose();

    this.campoActual = null;
  }

  // Método para ejecutar búsqueda

  async buscar() {
    if (!this.campoActual) return [];
    const config = this.configBuscador[this.campoActual];
    const busqueda = this.inputBusqueda.value.trim();
    if (!busqueda) {
      this.listaResultados.innerHTML =
        '<div class="text-center p-3 text-muted">Escribe algo para buscar</div>';
      return [];
    }

    const queryParams = new URLSearchParams({ searchTerm: busqueda });

    if (config.getExtraParams && typeof config.getExtraParams === "function") {
      const extras = config.getExtraParams();
      Object.keys(extras).forEach((key) => {
        if (extras[key]) {
          // Solo agrega si el valor no es null/undefined
          queryParams.append(key, extras[key]);
        }
      });
    }

    const fetchOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    };

    try {
      const response = await fetch(
        `${config.endpoint}?${queryParams}`,
        fetchOptions,
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          `Error HTTP: ${response.status} - ${data.message || "Desconocido"}`,
        );
      }

      const items = Array.isArray(data)
        ? data
        : data.body && Array.isArray(data.body)
          ? data.body
          : [];

      if (!Array.isArray(items)) {
        console.error("La respuesta no contiene un array válido:", items);
        this.listaResultados.innerHTML =
          '<div class="text-center p-3 text-danger">Respuesta inválida del servidor</div>';
        return [];
      }

      return items;
    } catch (error) {
      console.error("Error en búsqueda:", error);
      this.listaResultados.innerHTML =
        '<div class="text-center p-3 text-danger">Error al buscar: ' +
        error.message +
        "</div>";
      return [];
    }
  }

  async ejecutarBusqueda() {
    const items = await this.buscar();

    this.listaResultados.innerHTML = "";

    if (items.length === 0) {
      this.listaResultados.innerHTML =
        '<div class="text-center p-3 text-muted">No hay resultados</div>';
      return;
    }

    const config = this.configBuscador[this.campoActual];

    items.forEach((item) => {
      const li = document.createElement("button");
      li.type = "button";
      li.className = "list-group-item list-group-item-action";

      li.textContent = config.renderLabel(item);

      li.onclick = () => {
        // Asignación visual básica
        config.inputVisual.value = config.renderLabel(item);

        // Ejecutamos la lógica personalizada
        if (config.onSelect) config.onSelect(item);

        this.cerrar();
      };
      this.listaResultados.appendChild(li);
      // Renderizado interno
      this.renderizarLista(items);
    });
  }

  renderizarLista(items) {
    this.listaResultados.innerHTML = "";
    if (items.length === 0) {
      this.listaResultados.innerHTML =
        '<div class="text-center p-3 text-muted">No hay resultados</div>';
      return;
    }

    const config = this.configBuscador[this.campoActual];
    items.forEach((item) => {
      const li = document.createElement("button");
      li.type = "button";
      li.className = "list-group-item list-group-item-action";
      li.textContent = config.renderLabel(item);
      li.onclick = () => {
        config.inputVisual.value = config.renderLabel(item);
        if (config.onSelect) config.onSelect(item);
        this.cerrar();
      };
      this.listaResultados.appendChild(li);
    });
  }

  // Método para seleccionar un item y retornarlo
  seleccionarItem(item) {
    if (!this.campoActual) return null;
    // Cierra el buscador
    this.cerrar();

    // Retorna el item seleccionado para usar en el DOM
    return item;
  }

  inicializar() {
    Object.keys(this.configBuscador).forEach((campo) => {
      const config = this.configBuscador[campo];
      const nombre = this.configBuscador[campo].nombre;
      config.btnAbrir.onclick = () => this.abrir(campo, nombre);
      config.inputVisual.onclick = () => this.abrir(campo, nombre);
    });

    this.btnCancelar.onclick = () => this.cerrar();

    // Vinculamos el botón de filtro a la nueva función de la clase
    this.btnFiltro.onclick = () => this.ejecutarBusqueda();

    //  Buscar al presionar Enter
    this.inputBusqueda.onkeyup = (e) => {
      if (e.key === "Enter") this.ejecutarBusqueda();
    };
  }
}

export class SelectLoader {
  async cargarOpciones(config, limpiarOpciones) {
    const { endpoint, selectId, renderOption, getExtraParams } = config;
    const select = document.getElementById(selectId);

    if (!select) return;

    if (limpiarOpciones) {
      select.innerHTML = '<option value="">Selecciona una opción</option>';
    }

    // Construye query params con extras si getExtraParams existe

    const queryParams = new URLSearchParams();

    if (getExtraParams) {
      const extra = getExtraParams(); // Obtiene params dinámicos

      Object.keys(extra).forEach((key) => {
        if (extra[key] !== undefined) {
          queryParams.append(key, extra[key]);
        }
      });
    }

    const url = `${endpoint}?${queryParams.toString()}`;

    try {
      const response = await fetch(url, {
        method: "GET",

        headers: { "Content-Type": "application/json" },

        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

      const items = Array.isArray(data) ? data : data.body || [];

      // Usamos un bucle normal para asegurar que se procese todo antes de terminar la función
      items.forEach((item) => {
        const optionData = renderOption(item);
        const option = document.createElement("option");
        option.value = optionData.value;
        option.textContent = optionData.text;
        select.appendChild(option);
      });

      return true;
    } catch (error) {
      console.error("Error al cargar opciones:", error);
      select.innerHTML = '<option value="">Error al cargar</option>';
      throw error; // Re-lanzamos para que el modal sepa que falló
    }
  }
}
