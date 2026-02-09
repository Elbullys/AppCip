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
  handleGETSinProgressBar,
  handlePOSTbatch,
  ObtenerIdTecnicoSesion,
  obtenerUsuarioLocalStorage,
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

const api = URLAPI;
let IndicadorDeErrores = 0;

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
  //TECNICO
  //IdTecnico: document.getElementById('idtecnicoValue').textContent,
  //VARIABLES DE CONTROL
  EsDispositivoMovil: null,
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
  },
});

document.addEventListener("DOMContentLoaded", () => {
  // Detectar si es un dispositivo móvil
  estadoFormulario.EsDispositivoMovil = General.esDispositivoMovil();

  //DECLARACION DE INPUTS
  const inputunidad = document.getElementById("inputunidad");
  const inputarea = document.getElementById("inputarea");
  const inputresponsable = document.getElementById("inputresponsable");
  const inputdispositivos = document.getElementById("inputdispositivos");
  const inputcatalogo = document.getElementById("inputcatalogo");
  const inputdescripcioncatalogo = document.getElementById(
    "inputdescripcioncatalogo"
  );
  const btnDescargarPlantilla = document.getElementById("downloadTemplate");
  const btnsubirform = document.getElementById("btnsubirform");
  const btnVerificacionyActualizacion = document.getElementById(
    "btnVerificacionyActualizacion"
  );

  let jsonData;

  //LOCALSTORAGE NOMBRE DE USUARIO EN PERFIL
  obtenerUsuarioLocalStorage();

  //* UNIDADES

  // Evento para el botón Buscar Unidad
  const btnBuscarUnidad = document.getElementById("btnBuscarUnidad");
  if (btnBuscarUnidad) {
    btnBuscarUnidad.addEventListener("click", async () => {
      // Aquí capturamos los valores JUSTO en el momento del clic
      const searchTerm = $("#inputBusqueda").val().trim();

      const EleccionUnidad = await clsFuncionesModales.BuscarUnidad(searchTerm);
      //asignacion a variables globales del array
      asignacionVariablesUnidades(EleccionUnidad);
    });
  }
  // Evento para el input de búsqueda al presionar Enter
  const inputBusqueda = document.getElementById("inputBusqueda");
  if (inputBusqueda) {
    inputBusqueda.addEventListener("keydown", async function (event) {
      if (event.key === "Enter") {
        const searchTerm = $("#inputBusqueda").val().trim();
        const EleccionUnidad = await clsFuncionesModales.BuscarUnidad(
          searchTerm
        );
        //asignacion a variables globales del array
        asignacionVariablesUnidades(EleccionUnidad);
      }
    });
  }

  //*AREAS (UBICACION)

  // Evento para el botón Buscar AREA
  //*EVENTO BOTON BUSCAR AREA EN MODAL
  const btnBuscarArea = document.getElementById("btnBuscarArea");
  if (btnBuscarArea) {
    btnBuscarArea.addEventListener("click", async () => {
      // Aquí capturamos los valores JUSTO en el momento del clic
      const searchTerm = $("#inputBusquedaArea").val().trim();

      const EleccionArea = await clsFuncionesModales.BuscarArea(
        searchTerm,
        estadoFormulario.tipo_unidad
      );
      asignacionVariablesAreas(EleccionArea);
    });
  }
  //EVENTO KEYDOWN ENTER BUSQUEDA ESPECIFICA DE AREA
  const inputBusquedaArea = document.getElementById("inputBusquedaArea");
  if (inputBusquedaArea) {
    inputBusquedaArea.addEventListener("keydown", async function (event) {
      if (event.key === "Enter") {
        // Usa 'Enter' (case-sensitive)
        const EleccionArea = await clsFuncionesModales.BuscarArea(
          inputBusquedaArea.value,
          estadoFormulario.tipo_unidad
        ); // Llama a la función de búsqueda

        asignacionVariablesAreas(EleccionArea);
      }
    });
  } else {
    console.error("No se encuentra tu búsqueda del Área");
  }

  //*RESPONSABLES

  // Evento para el botón Buscar RESPONSABLE
  const btnBuscarResponsable = document.getElementById("btnBuscarResponsable");
  if (btnBuscarResponsable) {
    btnBuscarResponsable.addEventListener("click", async () => {
      const EleccionResponsable =
        await inicializarDataTableResponsablePorIdUnidad(
          inputBusquedaResponsable.value,
          estadoFormulario.IdUnidadValue
        );
      asignacionVariablesResponsables(EleccionResponsable);
    });
  }

  const inputBusquedaResponsable = document.getElementById(
    "inputBusquedaResponsable"
  );
  if (inputBusquedaResponsable) {
    inputBusquedaResponsable.addEventListener(
      "keydown",
      async function (event) {
        if (event.key === "Enter") {
          // Usa 'Enter' (case-sensitive)
          const EleccionResponsable =
            await clsFuncionesModales.BuscarResponsable(
              inputBusquedaResponsable.value,
              estadoFormulario.IdUnidadValue
            ); // Llama a la función de búsqueda

          asignacionVariablesResponsables(EleccionResponsable);
        }
      }
    );
  } else {
    console.error("No se encuentra tu búsqueda del Responsable");
  }

  //*DISPOSITIVOS

  const btnBuscarDispositivo = document.getElementById("btnBuscarDispositivo");
  if (btnBuscarDispositivo) {
    btnBuscarDispositivo.addEventListener("click", async () => {
      // Aquí capturamos los valores JUSTO en el momento del clic
      const searchTerm = $("#inputBusquedadispositivo").val().trim();

      const EleccionDispositivos = await inicializarDataTableDispositivos(
        searchTerm
      );
      console.log("EleccionDispositivos", EleccionDispositivos);
      asignacionVariablesDispositivos(EleccionDispositivos);
    });
  }

  // EVENTO PARA BUSCAR CON ENTER EN EL INPUT DEL MODAL
  const inputDispositivo = document.getElementById("inputBusquedadispositivo");
  if (inputDispositivo) {
    inputDispositivo.addEventListener("keydown", async function (event) {
      if (event.key === "Enter") {
        // Usa 'Enter' (case-sensitive)
        const EleccionDispositivos =
          await clsFuncionesModales.BuscarDispositivo(inputDispositivo.value);
        asignacionVariablesDispositivos(EleccionDispositivos); // Llama a la función de búsqueda
      }
    });
  } else {
    console.error("No se encuentra tu búsqueda de dispositivo");
  }

  //*CATALOGO COMPONENTES

  const inputBusquedaCatalogo = document.getElementById(
    "inputBusquedaCatalogo"
  );
  if (inputBusquedaCatalogo) {
    inputBusquedaCatalogo.addEventListener("keydown", async function (event) {
      if (event.key === "Enter") {
        // Usa 'Enter' (case-sensitive)
        const EleccionCatalogoComponentes =
          await clsFuncionesModales.BuscarCatalogoComponente(
            inputBusquedaCatalogo.value,
            estadoFormulario.IdDispositivo
          ); // Llama a la función de búsqueda
        asignacionVariablesCatalogoComponentes(EleccionCatalogoComponentes);
      }
    });
  } else {
    console.error("No se encuentra tu Búsqueda de Catálogo");
  }

  /*////////////////////////////////////////////////////////////////////////////////////////////////////////////*
 
  // EVENTOS PARA ABRIR MODALES
 
/* /////////////////////////////////////////////////////////////////////////////////////////////////////////*/
  //* Evento para abrir modal unidades
  //desktop
  inputunidad.addEventListener("keydown", function (event) {
    if (event.key === "F1" || event.key === "F2") {
      event.preventDefault();
      document.getElementById("inputBusqueda").value = "";
      $("#consultaUnidadesModal").modal("show");
      inicializarDataTableUnidades("");
    }
  });

  // Evento touch para abrir modal unidades
  inputunidad.addEventListener("click", function (event) {
    if (estadoFormulario.EsDispositivoMovil == true) {
      event.preventDefault();
      document.getElementById("inputBusqueda").value = "";
      $("#consultaUnidadesModal").modal("show");
      inicializarDataTableUnidades("");
    }
  });

  //* Evento para abrir modal areas (ubicacion)
  // INICIO EVENTO TECLADO PARA ABRIR MODAL AREAS (UBICACION)
  inputarea.addEventListener("keydown", async function (event) {
    if (event.key === "F1" || event.key === "F2") {
      event.preventDefault();
      if (!estadoFormulario.tipo_unidad) {
        Toast.fire({
          icon: "warning",
          title: "Dato no Válido",
        });
      } else {
        document.getElementById("inputBusquedaArea").value = "";
        $("#consultaAreasModal").modal("show");
        const EleccionArea = await inicializarDataTableAreasPorTipoUnidad(
          "",
          estadoFormulario.tipo_unidad
        );
        asignacionVariablesAreas(EleccionArea);
      }
    }
  });

  // Evento touch para abrir modal unidades
  inputarea.addEventListener("click", async function (event) {
    if (estadoFormulario.EsDispositivoMovil == true) {
      event.preventDefault();
      if (!estadoFormulario.tipo_unidad) {
        Toast.fire({
          icon: "warning",
          title: "Dato no Válido",
        });
      } else {
        document.getElementById("inputBusquedaArea").value = "";
        $("#consultaAreasModal").modal("show");
        const EleccionArea = await inicializarDataTableAreasPorTipoUnidad(
          "",
          estadoFormulario.tipo_unidad
        );
        asignacionVariablesAreas(EleccionArea);
      }
    }
  });

  //* Evento para abrir modal responsables
  // INICIO EVENTO TECLADO PARA ABRIR MODAL RESPONSABLE
  inputresponsable.addEventListener("keydown", async function (event) {
    if (event.key === "F1" || event.key === "F2") {
      event.preventDefault();
      if (!estadoFormulario.IdUnidadValue) {
        Toast.fire({
          icon: "warning",
          title: "Dato no Válido",
        });
      } else {
        document.getElementById("inputBusquedaResponsable").value = "";
        $("#consultaResponsableModal").modal("show");

        const EleccionResponsable =
          await inicializarDataTableResponsablePorIdUnidad(
            "",
            estadoFormulario.IdUnidadValue
          );
        asignacionVariablesResponsables(EleccionResponsable);
      }
    }
  });
  // Evento //INICIO EVENTO TOUCH PARA ABRIR MODAL RESPONSABLE
  inputresponsable.addEventListener("click", async function (event) {
    if (estadoFormulario.EsDispositivoMovil == true) {
      event.preventDefault();
      if (!estadoFormulario.IdUnidadValue) {
        Toast.fire({
          icon: "warning",
          title: "Dato no Válido",
        });
      } else {
        document.getElementById("inputBusquedaResponsable").value = "";
        $("#consultaResponsableModal").modal("show");

        const EleccionResponsable =
          await inicializarDataTableResponsablePorIdUnidad(
            "",
            estadoFormulario.IdUnidadValue
          );
        asignacionVariablesResponsables(EleccionResponsable);
      }
    }
  });

  //* Evento para abrir modal DISPOSITIVOS
  //ABRIR MODAL DISPOSITIVOS TECLADO
  inputdispositivos.addEventListener("keydown", async function (event) {
    if (event.key === "F1" || event.key === "F2") {
      event.preventDefault();
      document.getElementById("inputBusquedadispositivo").value = "";
      $("#consultaDispositivosModal").modal("show");
      const EleccionDispositivos = await inicializarDataTableDispositivos("");

      asignacionVariablesDispositivos(EleccionDispositivos);
    }
  });

  // Evento touch para abrir modal DISPOSITIVOS
  inputdispositivos.addEventListener("click", async function (event) {
    if (estadoFormulario.EsDispositivoMovil == true) {
      event.preventDefault();
      document.getElementById("inputBusquedadispositivo").value = "";
      $("#consultaDispositivosModal").modal("show");
      const EleccionDispositivos = await inicializarDataTableDispositivos("");

      asignacionVariablesDispositivos(EleccionDispositivos);
    }
  });

  //* Evento para abrir modal CATALOGOS
  // INICIO EVENTO TECLADO PARA ABRIR MODAL CATALOGOS
  inputcatalogo.addEventListener("keydown", async function (event) {
    if (event.key === "F1" || event.key === "F2") {
      event.preventDefault();
      if (!estadoFormulario.IdDispositivo) {
        Toast.fire({
          icon: "warning",
          title: "Seleccione un Dispositivo Primero",
        });
      } else {
        document.getElementById("inputBusquedaCatalogo").value = "";
        $("#consultaCatalogoComponenteModal").modal("show");

        const EleccionCatalogoComponentes =
          await inicializarDataTableCatalogoComponentePorDispositivo(
            "",
            estadoFormulario.IdDispositivo
          );
        asignacionVariablesCatalogoComponentes(EleccionCatalogoComponentes);
      }
    }
  });
  // Evento touch para abrir modal CATALOGOS COMPONENTES
  inputcatalogo.addEventListener("click",async function (event) {
    if (estadoFormulario.EsDispositivoMovil == true) {
      event.preventDefault();
      if (!estadoFormulario.IdDispositivo) {
        Toast.fire({
          icon: "warning",
          title: "Seleccione un Dispositivo Primero",
        });
      } else {
        document.getElementById("inputBusquedaCatalogo").value = "";
        $("#consultaCatalogoComponenteModal").modal("show");
        let searchTerm;
        const EleccionCatalogoComponentes =
          await inicializarDataTableCatalogoComponentePorDispositivo(
          "",
          estadoFormulario.IdDispositivo
        );
         asignacionVariablesCatalogoComponentes(EleccionCatalogoComponentes);
      }
    }
  });

  //*////////////////////////////////////////////////////////////////////////////////////////////////////////////*

  //FUNCIONES PARA INICIALIZAR DATATABLES

  //*//////////////////////////////////////////////////////////////////////////////////////////////////////////*/
  function asignacionVariablesUnidades(data) {
    estadoFormulario.IdUnidadValue = data.id_unidad;
    estadoFormulario.contratoid = data.num_contrato_actual;
    estadoFormulario.operacion = data.Estado;
    estadoFormulario.Estado = data.Estado;
    estadoFormulario.nombre_unidad = data.nombre_unidad;
    estadoFormulario.tipo_unidad = data.tipo_unidad;
    estadoFormulario.AbrevEstado = data.abreviatura_estado;
    if (estadoFormulario.operacion === "GUANAJUATO") {
      document.getElementById("inputunidad").value =
        General.concatenar_contrato_unidad(
          estadoFormulario.IdUnidadValue,
          estadoFormulario.contratoid
        ) +
        " - " +
        data.nombre_unidad;
    } else {
      estadoFormulario.contratoid = "0";
      document.getElementById("inputunidad").value =
        General.concatenar_contrato_unidad(
          estadoFormulario.IdUnidadValue,
          estadoFormulario.contratoid
        ) +
        " - " +
        data.nombre_unidad;
    }

    //LIMPIAR CASILLAS YA QUE CAMBIO DE UNIDAD Y TIENE QUE ELEGIR OTRA UNIDAD Y AREA
    document.getElementById("inputresponsable").value = "";
    document.getElementById("inputarea").value = "";
  }

  function asignacionVariablesResponsables(data) {
    estadoFormulario.IdResponsable = data.id_responsable;
    estadoFormulario.nombre_responsable = data.nombre_responsable;
    estadoFormulario.cargo = data.cargo;
    estadoFormulario.areaResponsable = data.area;

    //ASIGNACION DE INPUTS
    inputresponsable.value = estadoFormulario.nombre_responsable;
  }

  function asignacionVariablesAreas(data) {
    //asignacion a variables globales del array
    estadoFormulario.IdArea = data.id_area;
    estadoFormulario.Nombre_Area = data.area;
    //ASIGNACION A INPUTS
    inputarea.value = estadoFormulario.Nombre_Area;
  }

  function asignacionVariablesDispositivos(data) {
    estadoFormulario.IdDispositivo = data.id_dispositivo;
    estadoFormulario.Dispositivo = data.tipo_equipo;
    estadoFormulario.AbrDispositivo = data.abreviatura_tipo;
    //ASIGNACION A INPUTS
    document.getElementById("inputdispositivos").value =
      estadoFormulario.Dispositivo;
    //LIMPIEZA DE INPUTS POR SELECCION
    document.getElementById("inputcatalogo").value = "";
    document.getElementById("inputdescripcioncatalogo").value = "";
  }
  function asignacionVariablesCatalogoComponentes(data) {
      estadoFormulario.IdCatalogoComponente = data.id_catalogo_componente;
              estadoFormulario.Nombre_Catalogo = data.nombre_catalogo;
              estadoFormulario.Descripcion = data.descripcion_modelo;
              estadoFormulario.marca = data.marca;
              estadoFormulario.modelo = data.modelo;
              estadoFormulario.procesador = data.Procesador;
              estadoFormulario.memoria_ram = data['Memoria Ram'];
              estadoFormulario.disco_duro = data['Disco Duro'];
              estadoFormulario.sistema_operativo = data['Sistema Operativo'];
    //ASIGNACION A INPUTS
    document.getElementById("inputcatalogo").value = estadoFormulario.Nombre_Catalogo;
              document.getElementById("inputdescripcioncatalogo").value = estadoFormulario.Descripcion;
   
  }

  

  //*////////////////////////////////////////////////////////////////////////////////////////////////////////////*

  //DESCARGA PLANTILLA EXCEL INVENTARIO COMPONENTES

  //*//////////////////////////////////////////////////////////////////////////////////////////////////////////*/

  btnDescargarPlantilla.addEventListener("click", async function () {
    if (
      inputunidad.value == "" ||
      inputunidad.value == null ||
      inputresponsable.value == "" ||
      inputresponsable.value == null ||
      inputarea.value == "" ||
      inputarea.value == null ||
      inputdispositivos.value == "" ||
      inputdispositivos.value == null ||
      inputcatalogo.value == "" ||
      inputcatalogo.value == null
    ) {
      Toast.fire({
        icon: "warning",
        title: "Faltan datos obligatorios",
      });
      return; // Salir de la función si faltan datos
    }

    generarPlantillaExcel();
  });

  btnsubirform.addEventListener("click", async function (event) {
    event.preventDefault();
    const fileInput = document.getElementById("excelFile");
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
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      // Procesa y valida datos (optimiza para no bloquear UI)
      const processedData = await processExcelData(jsonData);
      // Muestra en DataTable
      displayInDataTable(processedData);
      document.getElementById("processedTableContainer").style.display =
        "block";
    };
    reader.readAsArrayBuffer(file);
  });

  btnVerificacionyActualizacion.addEventListener(
    "click",
    async function (event) {
      event.preventDefault();
      const ActualizacionComponente = await actualizarBDDesdeTabla(jsonData);
    }
  );
});

async function generarPlantillaExcel() {
  // 1. Datos
  const id_u = estadoFormulario.IdUnidadValue || "";
  const nom_u = document.getElementById("inputunidad").value || "";
  const id_r = estadoFormulario.IdResponsable || "";
  const nom_r = document.getElementById("inputresponsable").value || "";
  const id_a = estadoFormulario.IdArea || "";
  const nom_a = document.getElementById("inputarea").value || "";
  const id_c = estadoFormulario.IdCatalogoComponente || "";
  const nom_c = document.getElementById("inputcatalogo").value || "";
  const desc_cc =
    document.getElementById("inputdescripcioncatalogo").value || "";

  const statusArr = [
    "BUENAS CONDICIONES",
    "MEDIA VIDA",
    "MAL ESTADO",
    "EN REPARACION",
    "EXTRAVIADO",
    "EN REVISION",
    "PARA PIEZAS",
    "DESCONTINUADO",
    "DESECHADO",
    "SIN INFORMACION",
  ];

  // 2. Estructura de Filas (AOA - Array of Arrays)
  const data = [
    ["PLANTILLA DE INVENTARIO"], // Fila 0
    ["INSTRUCCIONES:", "Llenar solo columnas B y C"], // Fila 1
    [""], // Fila 2
    ["DATOS GENERALES"], // Fila 3
    ["ID Unidad:", id_u], // Fila 4
    ["Nombre Unidad:", nom_u], // Fila 5
    ["ID Responsable:", id_r], // Fila 6
    ["Responsable:", nom_r], // Fila 7
    ["ID Área:", id_a], // Fila 8
    ["Área:", nom_a], // Fila 9
    ["ID Catálogo:", id_c], // Fila 10
    ["Catálogo:", nom_c], // Fila 11
    ["Descripción Catálogo:", desc_cc], // Fila 12 (NUEVA)
    [""], // Fila 13 (ESPACIADOR)
    ["CONDICIÓN", "NÚMERO DE SERIE", "OBSERVACIONES"], // Encabezados (Fila 14 / Índice 14)
  ];

  // Agregar ejemplos y status
  data.push([statusArr[0], "EJEMPLO: 123456", "EJEMPLO: DAÑADO"]);
  for (let i = 1; i < statusArr.length; i++) {
    data.push([statusArr[i], "", ""]);
  }

  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // 3. APLICAR NEGRITAS (Solo funciona con xlsx-js-style)
  const styleBold = { font: { bold: true } };

  // Hemos actualizado las celdas para que coincidan con la nueva fila 12
  const cellsToBold = [
    "A1",
    "A4",
    "A5",
    "A6",
    "A7",
    "A8",
    "A9",
    "A10",
    "A11",
    "A12",
    "A13", // Etiquetas de datos
    "A15",
    "B15",
    "C15", // Encabezados de la tabla (Condición, Serie, Observación)
  ];

  cellsToBold.forEach((cell) => {
    if (worksheet[cell]) {
      worksheet[cell].s = styleBold;
    }
  });

  // 4. Configuración de Columnas y Merges
  worksheet["!cols"] = [{ wch: 25 }, { wch: 30 }, { wch: 45 }];
  worksheet["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }, // Título principal
    { s: { r: 3, c: 0 }, e: { r: 3, c: 2 } }, // Subtítulo "DATOS GENERALES"
  ];

  // 5. Generar y Descargar
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Plantilla");

  XLSX.writeFile(workbook, "plantilla_Componente_Colectivo.xlsx");

  // Mostrar botón de carga
  document.getElementById("btnsubirform")?.classList.remove("d-none");
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
  const camposVacios = [
    inputarea,
    inputcatalogo,
    inputunidad,
    inputresponsable,
  ].some((input) => input.value === "");

  if (camposVacios) {
    estadoFormulario.IdUnidadValue = data[4]?.[1]; // Fila 5, Columna B
    estadoFormulario.nombre_unidad = data[5]?.[1]; // Fila 6, Columna B
    estadoFormulario.IdResponsable = data[6]?.[1]; //Fila 7, Columna B
    estadoFormulario.nombre_responsable = data[7]?.[1]; //Fila 8, Columna B
    estadoFormulario.IdArea = data[8]?.[1]; // Fila 9, Columna B
    estadoFormulario.Nombre_Area = data[9]?.[1]; // Fila 10, Columna B
    //estadoFormulario.IdDispositivo= data[10]?.[1];  // Fila 10, Columna B
    estadoFormulario.IdCatalogoComponente = data[10]?.[1]; // Fila 11, Columna B
    estadoFormulario.Nombre_Catalogo = data[11]?.[1]; // Fila 12, Columna B
    estadoFormulario.Descripcion = data[12]?.[1]; // Fila 12, Columna B

    //asignacion a inputs
    inputarea.value = estadoFormulario.Nombre_Area;
    inputunidad.value = estadoFormulario.nombre_unidad;
    inputresponsable.value = estadoFormulario.nombre_responsable;
    inputcatalogo.value = estadoFormulario.Nombre_Catalogo;
    inputdescripcioncatalogo.value = estadoFormulario.Descripcion;
  }

  //*ASIGNACION POR CARGA MANUAL
  //* --- PASO 1: Recopilar y Pre-contar duplicados en Excel ---
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

  //* --- PASO 2: Verificación en Base de Datos (API) ---
  let apiResults = {};
  if (seriesArray.length > 0) {
    try {
      const config = {
        url: `${api}/api/componentes/Inventario/verificarnumeroserieComponenteExistenciaDuplicadoArray`,
        data: { series: seriesArray },
        disableAlerts: true,
      };

      const response = await handlePOSTbatch(config);

      if (response.success) {
        // Habilitamos el botón si la comunicación fue exitosa
        btnVerificacionyActualizacion.classList.remove("d-none");

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
      console.error("Error en batch API:", error);
      Toast.fire({
        icon: "warning",
        title: "Error de conexión",
      });

      return processed;
    }
  }

  //* --- PASO 3: Procesamiento Final con Jerarquía de Errores ---
  const seenInExcelLoop = new Set(); // Para saber si es la primera vez que vemos la serie en este loop

  for (let i = 15; i < data.length; i++) {
    const row = data[i];
    const serie = row[1]?.toString().trim();
    const observacionExcel = row[2]?.toString().trim() || "SIN OBSERVACION";
    const status_componenteExcel = row[0]?.toString().trim();

    if (!serie) continue;

    let status = "Válido";
    let details = "Correcto";
    let rowClass = ""; // Vacío significa success (verde)
    let apiRes;

    // 1. PRIORIDAD: Duplicidad dentro del EXCEL
    if (excelCounts[serie] > 1) {
      status = "Duplicado en Excel";
      details = `Esta serie aparece ${excelCounts[serie]} veces en tu archivo.`;
      rowClass = "table-danger";
      IndicadorDeErrores++;
    }
    // 2. SEGUNDA PRIORIDAD: Duplicidad en la BASE DE DATOS
    else {
      apiRes = apiResults[serie];

      if (apiRes) {
        details = apiRes.detalles;
        if (apiRes.duplicado) {
          status = "Duplicado en sistema";
          rowClass = "table-danger";
          IndicadorDeErrores++;
        } else if (!apiRes.existe) {
          status = "No Existe";
          // Si la API encontró sugerencias por los últimos 5 dígitos,
          // aparecerán automáticamente en la variable 'details'
          rowClass = "table-warning";
          IndicadorDeErrores++;
        }
        // Si existe pero status_inventario == 0, tratar como error
        else if (apiRes.existe && apiRes.status_inventario == 0) {
          status = "No se encuentra activo";
          rowClass = "table-warning"; // Advertencia, similar a "No Existe"
          IndicadorDeErrores++;
        }
        // Si existe y status_inventario == 1, status se queda como 'Válido'
      } else {
        status = "Error";
        details = "No se pudo validar con el servidor.";
        rowClass = "table-secondary";
      }
    }

    // Si llegó aquí y no tiene clase de error, es éxito
    const colorText = rowClass ? "text-danger" : "text-success";

    processed.push([
      rowIndex++,
      serie,
      `<span class="${
        rowClass ? "text-danger" : "text-success"
      }">${status}</span>`,
      `<small class="text-muted">${apiRes ? apiRes.detalles : details}</small>`, // Aquí
      `<small>${status_componenteExcel}</small>`,
      `<small>${observacionExcel}</small>`,
    ]);

    // Pausa mínima para no bloquear el hilo principal cada 50 filas
    if (i % batchSize === 0) {
      await new Promise((resolve) => setTimeout(resolve, 5));
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
    const table = $("#processedTable").DataTable();
    const allData = table.rows().data().toArray();
    // Filtra solo registros válidos (ej. excluye errores)
    const validData = allData.filter((row) => {
      const status = $(row[2]).text();
      return (
        !status.includes("Duplicado") &&
        !status.includes("No Existe") &&
        !status.includes("Error")
      );
    });

    if (validData.length === 0) {
      Toast.fire({
        icon: "warning",
        title: "No hay datos válidos para actualizar",
      });

      return;
    }
    // Prepara payload: extrae series válidas
    const seriesToUpdate = validData.map((row) => ({
      serie: row[1], // row[1] es Número de Serie
      observacion: $(row[5]).find("input").val() || $(row[5]).text() || "",
      status_componente:
        $(row[4]).find("input").val() || $(row[4]).text() || "",
      id_unidad: estadoFormulario.IdUnidadValue,
      id_responsable: estadoFormulario.IdResponsable,
      id_area: estadoFormulario.IdArea,
      id_catalogo_componentes: estadoFormulario.IdCatalogoComponente,
      id_tecnico: IdTecnico,
    }));

    try {
      const config = {
        url: `${api}/api/movComponentes/Inventario/AgregarMovimientoComponenteColectivoArray`, // Nuevo endpoint
        data: { componentes: seriesToUpdate },
        disableAlerts: true,
      };
      const response = await handlePOSTbatch(config);
      console.log("response", response);
      if (response.success) {
        limpiarcampos();
        //alert('Actualización completada. ' + response.data.message);
        Swal.fire({
          icon: "success",
          title: "Inventario Actualizado",
          text:
            response.data.message ||
            "Los componentes se han procesado y registrado correctamente",
          showConfirmButton: false,
          timer: 2500, // Cierra automáticamente después de 2 segundos (1000 ms)
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
      console.error("Error al actualizar:", error);
      Toast.fire({
        icon: "warning",
        title: "Error de conexión al actualizar",
      });
    }
  }
}

// Función para mostrar en DataTable
function displayInDataTable(data) {
  $("#processedTable").DataTable({
    data: data,
    columns: [
      { title: "#" },
      { title: "Número de Serie" },
      { title: "Estado", orderable: false }, // No ordenable si tiene HTML
      { title: "Detalles", orderable: false },
      { title: "Status componente", orderable: false },
      { title: "Observación", orderable: false },
    ],
    pageLength: 10,
    destroy: true,
    createdRow: function (row, data, dataIndex) {
      // Agrega clase a la fila basada en el estado (ej. 'table-danger' para errores)
      const statusText = $(data[1]).text(); // Extrae texto de HTML
      if (
        statusText.includes("Duplicado") ||
        statusText.includes("No Existe")
      ) {
        $(row).addClass("table-danger");
      } else if (statusText.includes("Error")) {
        $(row).addClass("table-warning");
      }
    },
  });
}

function limpiarcampos() {
  General.resetearCampos("#uploadForm");
  // 1. Limpiar DataTable
  $("#processedTable").DataTable().clear().draw(); // Vacía filas y redibuja
  // 3. Ocultar contenedor de tabla
  document.getElementById("processedTableContainer").style.display = "none";
  // 4. Resetear indicador de errores (si tienes uno)
  document.getElementById("errorCount").textContent = "0";
  IndicadorDeErrores = 0;
  window.scrollTo({ top: 0, behavior: "smooth" });
  btnVerificacionyActualizacion.classList.add("d-none");
}
