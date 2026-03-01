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
  imprimirEtiquetaSimple,
  imprimirEtiquetaRegulatorio,
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
  CaracteristicasAdicionales: null,
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
  IdComponente: null,
  NumeroSerie: null,
  NumeroConsecutivo: null,
  CodigoTI: null,
  AbrevEQ: "EQ",
  Observaciones: null,
  EstatusComponente: null,
  EstatusInventario: 1,
  FehaRegistro: null,
  EsClienteServidor: null,
  FechaCompra: null,
  //RESPONSABLE
  IdResponsable: null,
  nombre_responsable: null,
  cargo: null,
  areaResponsable: null,
  //TECNICO
  IdTecnico: null,
  //VARIABLES DE CONTROL
  EsDispositivoMovil: null,
  GenerarNumeroserie: false,
  ImpresionRapida: false,

  //CODIGO REGULATORIO
  codigoregulatorio: null,
};

const VariablesFactura = {
  idfactura: null,
  numerofactura: null,
  nombreproveedor: null,
  lugarcompra: null,
  fechafactura: null,
  observacionfactura: null,
};
//*PERMITE REALIZAR EL ALMACENAMIENTO DE VARIABLES ANTERIORES
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
  },
});

document.addEventListener("DOMContentLoaded", () => {
  //OBTENER LOCALSTORAGE NOMBRE DE USUARIO EN PERFIL
  obtenerUsuarioLocalStorage();
  let cambiosPendientes = true; // Bandera para saber si hay cambios no guardados
  estadoFormulario.EsDispositivoMovil = General.esDispositivoMovil(); // Detecta si es un dispositivo móvil para adaptar eventos
  //SI HAY CAMBIOS PERMITE NOTIFICAR SI QUIERE SALIR EL USUARIO
  window.onbeforeunload = (event) => {
    if (cambiosPendientes) {
      event.preventDefault();
      event.returnValue =
        "¡Atención! No se guardarán los cambios si sale de esta página.";
      return "¡Atención! No se guardarán los cambios si sale de esta página.";
    }
    // Si no hay cambios pendientes, no hace nada (no muestra advertencia)
  };

  // OBTIENE DATOS
  const FormAgregarComponente = document.getElementById(
    "FormAgregarComponente",
  );
  const switchElement = document.getElementById("switchinventario");

  // Event listener para cambios manuales
  switchElement.addEventListener("change", function () {
    if (this.checked) {
      cambiarLabelSwitch("switchinventario", "ACTIVO");
      estadoFormulario.EstatusInventario = 1;
    } else {
      cambiarLabelSwitch("switchinventario", "CANCELADO");
      estadoFormulario.EstatusInventario = 0;
    }
  });

  //swicth para generar numero de serie automatico
  const GenerarNumeroserie = document.getElementById("chkbxAutoSerie");

  // Event listener para cambios manuales

  // Recopila los datos del formulario
  const idfactura = document.getElementById("txidfactura");
  const numerofactura = document.getElementById("txtnumerofactura");
  const nombreproveedor = document.getElementById("txtnombreprovedor");
  const lugarcompra = document.getElementById("txtlugarcompra");
  const numeroserie = document.getElementById("txtnumeroserie");
  const status_equipo = document.getElementById("statusequiposelect");
  const fecha_compra = document.getElementById("datefechacompra");

  const activoEnInventario = obtenerEstadoSwitch("switchinventario");
  const observaciones = document.getElementById("txtobservaciones");
  const txtobservacionfactura = document.getElementById(
    "txtobservacionfactura",
  );
  const datefechafactura = document.getElementById("datefechafactura");
  const chkbxImpresionRapida = document.getElementById("chkbxImpresionRapida");

  //INICIALIZAMOS FACTURA
  variablesInicialesFactura();

  //* ENVIO DE FORMULARIO
  FormAgregarComponente.addEventListener("submit", async (e) => {
    e.preventDefault(); // Previene recargar la página
    // Recopila los datos del formulario
    let validarstatuseditarFactura = { error: false };
    const editFactura = estadoFormulario.StatusFacturaEdit;
    validarstatuseditarFactura =
      editFactura === true
        ? {
            icon: "warning",
            error: true,
            message: "Factura en Edición  ¡Termina el Proceso!",
          }
        : { error: false };

    //* Validaciones usando General de utils.js
    const validarnumeroFactura = General.validar_Campos_String(
      numerofactura.value.trim(),
      "El Número de Factura",
    );
    const validarnombreproveedor = General.validar_Campos_String(
      nombreproveedor.value.trim(),
      "El nombre de Proveedor",
    );
    const validarlugarcompra = General.validar_Campos_String(
      lugarcompra.value.trim(),
      "El lugar de compra",
    );
    const validaridfactura = General.verificacion_numerica_entero(
      idfactura.value,
      "El ID Factura",
    );
    const validarnumeroserie = General.validar_Campos_String(
      numeroserie.value,
      "El número de serie ",
    );
    const validarstatus_equipo = General.validar_Campos_Select(
      status_equipo.value,
      "un Estatus de equipo",
    );
    const validarObservaciones = General.validar_Campos_String(
      observaciones.value.trim(),
      "La observaciones",
    );
    const validarFechaCompra = General.validarFecha(
      fecha_compra.value,
      "La fecha de compra",
    );
    if (
      validarstatuseditarFactura.error ||
      validarnumeroFactura.error ||
      validarnombreproveedor.error ||
      validarlugarcompra.error ||
      validaridfactura.error ||
      validarnumeroserie.error ||
      validarstatus_equipo.error ||
      validarObservaciones.error ||
      validarFechaCompra.error
    ) {
      // Array de todas las validaciones para iterar
      const validations = [
        validarstatuseditarFactura,
        validarnumeroFactura,
        validarnombreproveedor,
        validarlugarcompra,
        validaridfactura,
        validarnumeroserie,
        validarstatus_equipo,
        validarObservaciones,
        validarFechaCompra,
      ];
      // Encontrar la primera validación que falló
      const failedValidation = validations.find((val) => val.error);

      Toast.fire({
        icon: failedValidation.icon,
        title: failedValidation.message,
      });
      return;
    }
    // Si pasa todas las validaciones, continúa con el proceso de guardado
    //TOMAMOS VALOR DE RADIO DE CLIENTE SERVIDOR
    const radioServidorCliente =
      obtenerValorRadioSeleccionado("servidorcliente");
    estadoFormulario.EsClienteServidor = radioServidorCliente;
    if (GenerarNumeroserie) {
      estadoFormulario.GenerarNumeroserie = GenerarNumeroserie.checked
        ? true
        : false; // Retorna true si activado, false si desactivado
    }
 
    estadoFormulario.IdFactura = idfactura.value;
    estadoFormulario.NumeroSerie = numeroserie.value;
    estadoFormulario.Observaciones = observaciones.value;
    estadoFormulario.EstatusComponente = status_equipo.value;
    estadoFormulario.EsClienteServidor = radioServidorCliente;
    estadoFormulario.FechaCompra = fecha_compra.value;

    //asignacion de data del componente a insertar
    const dataComponente = {
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
      observaciones: estadoFormulario.Observaciones,
      status_componente: estadoFormulario.EstatusComponente,
      status_inventario: estadoFormulario.EstatusInventario,
      EsClienteServidor: estadoFormulario.EsClienteServidor,
      FK_IdTecnico: null, // document.getElementById("idtecnicoValue").textContent,
      FechaCompra: estadoFormulario.FechaCompra,
      GenerarNumeroserie: estadoFormulario.GenerarNumeroserie,
    };
    //PERMITE OBTENER DEL CACHE EL ID DEL USUARIO QUE INICIO SESION
    const sesionTecnico = await ObtenerIdTecnicoSesion();
    let IdTecnico = sesionTecnico.data.id_tecnico;
    estadoFormulario.IdTecnico = IdTecnico;
    if (sesionTecnico || sesionTecnico.body) {
      dataComponente.FK_IdTecnico = IdTecnico;
      const config = {
        url: `${api}/api/componentes/AgregarNuevoComponente`,
        data: dataComponente,
        successTitle: "Componente agregado exitosamente",
      };
      const response = await handlePOST(config);
      Swal.fire({
        icon: response.data.icon || "success",
        title: response.data.tittle,
        text: response.data.message,
        showConfirmButton: false,
        timer: 2000,
      });


      if (response.data.error === false) {
        console.log("response", response);
        estadoFormulario.IdComponente = response.data.idInsertado;
        estadoFormulario.CodigoTI = response.data.body;
        cambiosPendientes = false; // Resetea la bandera al guardar exitosamente
        estadoFormulario.StatusFacturaEdit = false;
        
        setTimeout(() => {
          if (estadoFormulario.ImpresionRapida) {
            abrirmodalGeneradorQR();
          }
        }, 3000);
            

        
        resetvariables();
      }
      console.log("Respuesta del servidor:", response);
    }
  });

  //*EVENTO BOTON BUSCAR UNIDAD EN MODAL
  const btnBuscarUnidad = document.getElementById("btnBuscarUnidad");
  if (btnBuscarUnidad) {
    btnBuscarUnidad.addEventListener("click", async () => {
      //  captura los valores JUSTO en el momento del clic
      const searchTerm = $("#inputBusqueda").val().trim();

      const EleccionUnidad = await clsFuncionesModales.BuscarUnidad(searchTerm);
      //asignacion a variables globales del array
      asignacionVariablesUnidades(EleccionUnidad);
    });
  }

  const inputBusqueda = document.getElementById("inputBusqueda");
  if (inputBusqueda) {
    inputBusqueda.addEventListener("keydown", async function (event) {
      if (event.key === "Enter") {
        const searchTerm = $("#inputBusqueda").val().trim();
        const EleccionUnidad =
          await clsFuncionesModales.BuscarUnidad(searchTerm);
        //asignacion a variables globales del array
        asignacionVariablesUnidades(EleccionUnidad);
      }
    });
  }

  //*EVENTO BOTON BUSCAR RESPONSABLE EN MODAL
  const inputBusquedaResponsable = document.getElementById(
    "inputBusquedaResponsable",
  );
  if (inputBusquedaResponsable) {
    inputBusquedaResponsable.addEventListener(
      "keydown",
      async function (event) {
        // Usa 'Enter'
        if (event.key === "Enter") {
          const EleccionResponsable =
            await clsFuncionesModales.BuscarResponsable(
              inputBusquedaResponsable.value,
              estadoFormulario.IdUnidadValue,
            );

          asignacionVariablesResponsables(EleccionResponsable);
        }
      },
    );
  } else {
    console.error("No se encuentra tu búsqueda del Responsable");
  }

  const btnBuscarResponsable = document.getElementById("btnBuscarResponsable");
  if (btnBuscarResponsable) {
    btnBuscarResponsable.addEventListener("click", async () => {
      const EleccionResponsable =
        await inicializarDataTableResponsablePorIdUnidad(
          inputBusquedaResponsable.value,
          estadoFormulario.IdUnidadValue,
        );
      asignacionVariablesResponsables(EleccionResponsable);
    });
  }
  //*EVENTO BOTON BUSCAR AREA EN MODAL
  const btnBuscarArea = document.getElementById("btnBuscarArea");
  if (btnBuscarArea) {
    btnBuscarArea.addEventListener("click", async () => {
      //captura los valores JUSTO en el momento del clic
      const searchTerm = $("#inputBusquedaArea").val().trim();

      const EleccionArea = await clsFuncionesModales.BuscarArea(
        searchTerm,
        estadoFormulario.tipo_unidad,
      );
      asignacionVariablesAreas(EleccionArea);
    });
  }

  //EVENTO KEYDOWN ENTER BUSQUEDA ESPECIFICA DE AREA
  const inputBusquedaArea = document.getElementById("inputBusquedaArea");
  if (inputBusquedaArea) {
    inputBusquedaArea.addEventListener("keydown", async function (event) {
      if (event.key === "Enter") {
        // Usa 'Enter'
        const EleccionArea = await clsFuncionesModales.BuscarArea(
          inputBusquedaArea.value,
          estadoFormulario.tipo_unidad,
        ); // Llama a la función de búsqueda

        asignacionVariablesAreas(EleccionArea);
      }
    });
  } else {
    console.error("No se encuentra tu búsqueda del Área");
  }

  //*EVENTO BOTON BUSCAR DISPOSITIVO EN MODAL
  const btnBuscarDispositivo = document.getElementById("btnBuscarDispositivo");
  if (btnBuscarDispositivo) {
    btnBuscarDispositivo.addEventListener("click", async () => {
      // captura los valores JUSTO en el momento del clic
      const searchTerm = $("#inputBusquedadispositivo").val().trim();

      const EleccionDispositivos =
        await inicializarDataTableDispositivos(searchTerm);

      asignacionVariablesDispositivos(EleccionDispositivos);
    });
  }

  // EVENTO PARA BUSCAR CON ENTER EN EL INPUT DEL MODAL
  const inputDispositivo = document.getElementById("inputBusquedadispositivo");
  if (inputDispositivo) {
    inputDispositivo.addEventListener("keydown", async function (event) {
      if (event.key === "Enter") {
        // Usa 'Enter'
        const EleccionDispositivos =
          await clsFuncionesModales.BuscarDispositivo(inputDispositivo.value);
        asignacionVariablesDispositivos(EleccionDispositivos); // Llama a la función de búsqueda
      }
    });
  } else {
    console.error("No se encuentra tu búsqueda de dispositivo");
  }

  //   //*EVENTO BOTON BUSCAR CATALOGO COMPONENTE EN MODAL
  const btnBuscarcatalogo = document.getElementById("btnBuscarcatalogo");
  if (btnBuscarcatalogo) {
    btnBuscarcatalogo.addEventListener("click", async () => {
      // captura los valores JUSTO en el momento del clic
      const searchTerm = $("#inputBusquedaCatalogo").val().trim();

      const EleccionCatalogo =
        await inicializarDataTableCatalogoComponentePorDispositivo(
          searchTerm,
          estadoFormulario.IdDispositivo,
        );

      asignacionVariablesCatalogoComponentes(EleccionCatalogo);
    });
  }
  // EVENTO PARA BUSCAR CON ENTER EN EL INPUT DEL MODAL
  const inputBusquedaCatalogo = document.getElementById(
    "inputBusquedaCatalogo",
  );
  if (inputBusquedaCatalogo) {
    inputBusquedaCatalogo.addEventListener("keydown", async function (event) {
      if (event.key === "Enter") {
        // Usa 'Enter'
        const EleccionCatalogoComponentes =
          await clsFuncionesModales.BuscarCatalogoComponente(
            inputBusquedaCatalogo.value,
            estadoFormulario.IdDispositivo,
          ); // Llama a la función de búsqueda
        console.log("EleccionCatalogoComponentes", EleccionCatalogoComponentes);
        asignacionVariablesCatalogoComponentes(EleccionCatalogoComponentes);
      }
    });
  } else {
    console.error("No se encuentra tu Búsqueda de Catálogo");
  }
  //*EVENTO BOTON BUSCAR FACTURA EN MODAL
  const btnBuscarfactura = document.getElementById("btnBuscarfactura");

  if (btnBuscarfactura) {
    btnBuscarfactura.addEventListener("click", async () => {
      // captura los valores JUSTO en el momento del clic
      const searchTerm = $("#inputBusquedafactura").val().trim();

      const EleccionFactura = await inicializarDataTableFactura(
        searchTerm,
        estadoFormulario.IdUnidadValue,
      );

      asignacionVariablesFacturas(EleccionFactura);
    });
  }

  /*////////////////////////////////////////////////////////////////////////////////////////////////////////////*
  
    //* EVENTOS PARA ABRIR MODALES
  
  //* /////////////////////////////////////////////////////////////////////////////////////////////////////////*/

  //* Evento para abrir modal unidades
  document
    .getElementById("txtIdUnidad")
    .addEventListener("keydown", async function (event) {
      event.preventDefault();
      if (event.key === "F1" || event.key === "F2") {
        document.getElementById("inputBusqueda").value = "";
        $("#consultaUnidadesModal").modal("show");
        const EleccionUnidad = await inicializarDataTableUnidades("");
        asignacionVariablesUnidades(EleccionUnidad);
      }
    });

  // Evento touch para abrir modal unidades
  document
    .getElementById("txtIdUnidad")
    .addEventListener("click", async function (event) {
      if (estadoFormulario.EsDispositivoMovil == true) {
        event.preventDefault();
        document.getElementById("inputBusqueda").value = "";
        $("#consultaUnidadesModal").modal("show");
        const EleccionUnidad = await inicializarDataTableUnidades("");
        asignacionVariablesUnidades(EleccionUnidad);
      }
    });

  //* INICIO EVENTO TECLADO PARA ABRIR MODAL AREAS (UBICACION)
  document
    .getElementById("txtarea")
    .addEventListener("keydown", async function (event) {
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
            estadoFormulario.tipo_unidad,
          );
          asignacionVariablesAreas(EleccionArea);
        }
      }
    });

  // Evento touch para abrir modal AREAS
  document
    .getElementById("txtarea")
    .addEventListener("click", async function (event) {
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
            estadoFormulario.tipo_unidad,
          );

          asignacionVariablesAreas(EleccionArea);
        }
      }
    });

  //* INICIO EVENTO TECLADO PARA ABRIR MODAL RESPONSABLE

  document
    .getElementById("txtidresponsable")
    .addEventListener("keydown", async function (event) {
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
              estadoFormulario.IdUnidadValue,
            );
          asignacionVariablesResponsables(EleccionResponsable);
        }
      }
    });

  //*inicializarDataTable RESPONSABLE
  // Evento //INICIO EVENTO TOUCH PARA ABRIR MODAL RESPONSABLE
  document
    .getElementById("txtidresponsable")
    .addEventListener("click", async function (event) {
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
              estadoFormulario.IdUnidadValue,
            );
          asignacionVariablesResponsables(EleccionResponsable);
        }
      }
    });

  //* Evento para abrir modal DISPOSITIVOS
  document
    .getElementById("txtIddispositivo")
    .addEventListener("keydown", async function (event) {
      if (event.key === "F1" || event.key === "F2") {
        event.preventDefault();
        document.getElementById("inputBusquedadispositivo").value = "";
        $("#consultaDispositivosModal").modal("show");
        const EleccionDispositivos = await inicializarDataTableDispositivos("");

        asignacionVariablesDispositivos(EleccionDispositivos);
      }
    });

  // Evento touch para abrir modal DISPOSITIVOS
  document
    .getElementById("txtIddispositivo")
    .addEventListener("click", async function (event) {
      if (estadoFormulario.EsDispositivoMovil == true) {
        event.preventDefault();
        document.getElementById("inputBusquedadispositivo").value = "";
        $("#consultaDispositivosModal").modal("show");
        const EleccionDispositivos = await inicializarDataTableDispositivos("");

        asignacionVariablesDispositivos(EleccionDispositivos);
      }
    });

  //* Evento para abrir modal CATALOGOS
  document
    .getElementById("txtIdCatalogo")
    .addEventListener("keydown", async function (event) {
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
              estadoFormulario.IdDispositivo,
            );

          asignacionVariablesCatalogoComponentes(EleccionCatalogoComponentes);
        }
      }
    });

  // Evento touch para abrir modal CATALOGOS COMPONENTES
  document
    .getElementById("txtIdCatalogo")
    .addEventListener("click", async function (event) {
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

          const EleccionCatalogoComponentes =
            await inicializarDataTableCatalogoComponentePorDispositivo(
              "",
              estadoFormulario.IdDispositivo,
            );

          asignacionVariablesCatalogoComponentes(EleccionCatalogoComponentes);
        }
      }
    });

  //* Evento para abrir modal FACTURAS
  document
    .getElementById("txidfactura")
    .addEventListener("keydown", async function (event) {
      if (event.key === "F1" || event.key === "F2") {
        event.preventDefault();

        if (estadoFormulario.StatusFacturaEdit == true) {
          document.getElementById("inputBusquedafactura").value = "";
          $("#consultaFacturaModal").modal("show"); // Mostrar modal
          const EleccionFactura = await inicializarDataTableFactura("");
          asignacionVariablesFacturas(EleccionFactura);
        }
      }
    });
  // EVENTO PARA BUSCAR CON ENTER EN EL INPUT DEL MODAL
  const inputBusquedafactura = document.getElementById("inputBusquedafactura");
  if (inputBusquedafactura) {
    inputBusquedafactura.addEventListener("keydown", async function (event) {
      if (event.key === "Enter") {
        // Usa 'Enter'
        const EleccionFactura = await clsFuncionesModales.BuscarFactura(
          inputBusquedafactura.value,
        ); // Llama a la función de búsqueda

        asignacionVariablesFacturas(EleccionFactura);
      }
    });
  } else {
    console.error("No se encuentro la Factura");
  }

  // Evento touch para abrir modal FACTURAS
  document
    .getElementById("txidfactura")
    .addEventListener("click", async function (event) {
      if (estadoFormulario.EsDispositivoMovil == true) {
        event.preventDefault();
        if (estadoFormulario.StatusFacturaEdit == true) {
          document.getElementById("inputBusquedafactura").value = ""; // Limpiar el campo de búsqueda al abrir el modal
          $("#consultaFacturaModal").modal("show"); // Mostrar modal
          const EleccionFactura = await inicializarDataTableFactura("");
          asignacionVariablesFacturas(EleccionFactura);
        }
      }
    });

  //*TERMINA
  /*////////////////////////////////////////////////////////////////////////////////////////////////////////////*
  
    //* EVENTOS FORMULARIO
  
  //* /////////////////////////////////////////////////////////////////////////////////////////////////////////*/

  GenerarNumeroserie.addEventListener("change", function () {
    if (this.checked) {
      numeroserie.disabled = true;
      numeroserie.value = "GENERANDO";
    } else {
      numeroserie.value = "";
      numeroserie.disabled = false;
    }
  });
  chkbxImpresionRapida.addEventListener("change", function () {
    if (this.checked) {
      estadoFormulario.ImpresionRapida = true;
    } else {
      estadoFormulario.ImpresionRapida = false;
    }
  });

  //*////////////////////////////////////////////////////////////////////////////////////////////////////////////*

  //*FUNCIONES ADICIONALES
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
      document.getElementById("txtIdUnidad").value =
        General.concatenar_contrato_unidad(
          estadoFormulario.IdUnidadValue,
          estadoFormulario.contratoid,
        );
    } else {
      estadoFormulario.contratoid = "0";
      document.getElementById("txtIdUnidad").value =
        General.concatenar_contrato_unidad(
          estadoFormulario.IdUnidadValue,
          estadoFormulario.contratoid,
        );
    }
    document.getElementById("txtnombreunidad").value = data.nombre_unidad;
    document.getElementById("txtoperacion").value = estadoFormulario.operacion;
    //LIMPIAR CASILLAS YA QUE CAMBIO DE UNIDAD Y TIENE QUE ELEGIR OTRA UNIDAD Y AREA
    document.getElementById("txtidresponsable").value = "";
    document.getElementById("txtnombreresponsable").value = "";
    document.getElementById("txtcargoresponsable").value = "";
    document.getElementById("txtarea").value = "";
    document.getElementById("txtarearesponsable").value = "";
  }

  function asignacionVariablesResponsables(data) {
    estadoFormulario.IdResponsable = data.id_responsable;
    estadoFormulario.nombre_responsable = data.nombre_responsable;
    estadoFormulario.cargo = data.cargo;
    estadoFormulario.areaResponsable = data.area;

    //ASIGNACION DE INPUTS
    document.getElementById("txtidresponsable").value =
      estadoFormulario.IdResponsable;
    document.getElementById("txtnombreresponsable").value =
      estadoFormulario.nombre_responsable;
    document.getElementById("txtcargoresponsable").value =
      estadoFormulario.cargo;
    document.getElementById("txtarearesponsable").value =
      estadoFormulario.areaResponsable;
  }

  function asignacionVariablesAreas(data) {
    //asignacion a variables globales del array
    estadoFormulario.IdArea = data.id_area;
    estadoFormulario.Nombre_Area = data.area;
    //ASIGNACION A INPUTS
    document.getElementById("txtarea").value = estadoFormulario.Nombre_Area;
  }

  function asignacionVariablesDispositivos(data) {
    estadoFormulario.IdDispositivo = data.id_dispositivo;
    estadoFormulario.Dispositivo = data.tipo_equipo;
    estadoFormulario.AbrDispositivo = data.abreviatura_tipo;
    estadoFormulario.CaracteristicasAdicionales =
      data.CaracteristicasAdicionales;
    //ASIGNACION A INPUTS
    document.getElementById("txtIddispositivo").value =
      estadoFormulario.IdDispositivo;
    document.getElementById("txtdispositivo").value =
      estadoFormulario.Dispositivo;
    //LIMPIEZA DE INPUTS POR SELECCION
    document.getElementById("txtIdCatalogo").value = "";
    document.getElementById("txtnombrecatalogo").value = "";
    document.getElementById("txtdescripcioncatalogo").value = "";
    console.log(
      "CaracteristicasAdicionales",
      estadoFormulario.CaracteristicasAdicionales,
    );
    if (estadoFormulario.CaracteristicasAdicionales == "NO") {
      chbxservidor.disabled = true;
      chbxcliente.disabled = true;
      chbxna.checked = true;
    } else {
      chbxservidor.disabled = false;
      chbxcliente.disabled = false;
    }
  }

  function asignacionVariablesCatalogoComponentes(data) {
    //asignacion a variables globales del array
    estadoFormulario.IdCatalogoComponente = data.id_catalogo_componente;
    estadoFormulario.Nombre_Catalogo = data.nombre_catalogo;
    estadoFormulario.Descripcion = data.descripcion_modelo;
    estadoFormulario.marca = data.marca;
    estadoFormulario.modelo = data.modelo;
    estadoFormulario.procesador = data.Procesador;
    estadoFormulario.memoria_ram = data["Memoria Ram"];
    estadoFormulario.disco_duro = data["Disco Duro"];
    estadoFormulario.sistema_operativo = data["Sistema Operativo"];
    //ASIGNACION A INPUTS
    document.getElementById("txtIdCatalogo").value =
      estadoFormulario.IdCatalogoComponente;
    document.getElementById("txtnombrecatalogo").value =
      estadoFormulario.Nombre_Catalogo;
    document.getElementById("txtdescripcioncatalogo").value =
      estadoFormulario.Descripcion;
  }

  function asignacionVariablesFacturas(data) {
    //asignacion a variables globales del array
    estadoFormulario.IdFactura = data.IdFactura;
    estadoFormulario.NumeroFactura = data.NumeroFactura;
    estadoFormulario.NombreProveedor = data.NombreProveedor;
    estadoFormulario.LugarCompra = data.LugarCompra;
    estadoFormulario.FechaFactura = data.FechaFactura;
    estadoFormulario.Observacion = data.Observacion;
    //ASIGNACION A INPUTS
    document.getElementById("txidfactura").value = estadoFormulario.IdFactura;
    document.getElementById("txtnumerofactura").value =
      estadoFormulario.NumeroFactura;
    document.getElementById("txtnombreprovedor").value =
      estadoFormulario.NombreProveedor;
    document.getElementById("txtlugarcompra").value =
      estadoFormulario.LugarCompra;
    document.getElementById("txtobservacionfactura").value =
      estadoFormulario.Observacion;
    document.getElementById("datefechafactura").value = conversionFecha(
      estadoFormulario.FechaFactura,
    );
  }

  function variablesInicialesFactura() {
    //ASIGNACION A VARIABLES GLOBALES
    estadoFormulario.IdFactura = "1";
    estadoFormulario.NumeroFactura = "N/A";
    estadoFormulario.NombreProveedor = "N/A";
    estadoFormulario.LugarCompra = "N/A";
    estadoFormulario.FechaFactura = "2002-01-01";
    estadoFormulario.Observacion = "SO";
    estadoFormulario.StatusFacturaEdit = false;
    //ASIGNACION DE INPUTS FACTURAS
    idfactura.value = estadoFormulario.IdFactura;
    numerofactura.value = estadoFormulario.NumeroFactura;
    nombreproveedor.value = estadoFormulario.NombreProveedor;
    lugarcompra.value = estadoFormulario.LugarCompra;
    txtobservacionfactura.value = estadoFormulario.Observacion;
    datefechafactura.value = conversionFecha(estadoFormulario.FechaFactura);
  }
  function resetvariables() {
    //DISPOSITIVO
    estadoFormulario.IdDispositivo = "";
    estadoFormulario.Dispositivo = "";
    estadoFormulario.AbrDispositivo = "";
    estadoFormulario.CaracteristicasAdicionales = "";
    //CATALOGO COMPONENTE
    estadoFormulario.IdCatalogoComponente = "";
    estadoFormulario.Nombre_Catalogo = "";
    estadoFormulario.Descripcion = "";
    estadoFormulario.marca = "";
    estadoFormulario.modelo = "";
    estadoFormulario.procesador = "";
    estadoFormulario.memoria_ram = "";
    estadoFormulario.disco_duro = "";
    estadoFormulario.sistema_operativo = "";
    //CARACTERISTICAS COMPONENTES
    estadoFormulario.NumeroSerie = "";
    estadoFormulario.EstatusComponente = "";
    estadoFormulario.FehaRegistro = "";
    estadoFormulario.EsClienteServidor = "";
    estadoFormulario.FechaCompra = "";
    estadoFormulario.IdTecnico = "";
    estadoFormulario.GenerarNumeroserie = false;
    estadoFormulario.EstatusInventario = 1;

    //ASIGNACION A INPUTS
    txtIddispositivo.value = "";
    txtdispositivo.value = "";
    txtIdCatalogo.value = "";
    txtnombrecatalogo.value = "";
    txtdescripcioncatalogo.value = "";
    numeroserie.value = "";
    numeroserie.disabled = false;
    status_equipo.value = "";
    fecha_compra.value = "";
    chbxna.checked = true;
    cambiarLabelSwitch("switchinventario", "ACTIVO");
    
    GenerarNumeroserie.checked = false;
  }

  //*////////////////////////////////////////////////////////////////////////////////////////////////////////////*

  //* FUNCIONES PARA FACTURAS Y OTROS EVENTOS (SE ENCUENTRAN EN EL FORMULARIO BOTONES )

  //*//////////////////////////////////////////////////////////////////////////////////////////////////////////*/

  //*BOTON CANCELAR NUEVA FACTURA
  document
    .getElementById("btncancnuevafactura")
    .addEventListener("click", function () {
      //DECLARAR VARIABLES DE INPUTS
      const inputidfactura = document.getElementById("txidfactura");
      const inputnumerofactura = document.getElementById("txtnumerofactura");
      const inputnombreproveedor = document.getElementById("txtnombreprovedor");
      const inputlugarcompra = document.getElementById("txtlugarcompra");
      const inputfechafactura = document.getElementById("datefechafactura");
      const inputobservacionfactura = document.getElementById(
        "txtobservacionfactura",
      );
      const btncancnuevafactura = document.getElementById(
        "btncancnuevafactura",
      );
      const btneditarfactura = document.getElementById("btneditarfactura");

      //RESTAURAR VALORES ANTERIORES AL CANCELAR LA OPERACION
      //RESTAURAR VALORES ANTERIORES AL CANCELAR LA OPERACION
      inputidfactura.value = VariablesFactura.idfactura;
      inputnumerofactura.value = VariablesFactura.numerofactura;
      inputnombreproveedor.value = VariablesFactura.nombreproveedor;
      inputlugarcompra.value = VariablesFactura.lugarcompra;
      inputfechafactura.value = conversionFecha(VariablesFactura.fechafactura);
      inputobservacionfactura.value = VariablesFactura.observacionfactura;
      inputidfactura.disabled = true;
      inputnumerofactura.disabled = true;
      inputnombreproveedor.disabled = true;
      inputlugarcompra.disabled = true;
      inputfechafactura.disabled = true;
      inputobservacionfactura.disabled = true;
      btncancnuevafactura.hidden = true;
      btneditarfactura.disabled = false;
    });

  //*INICIO EVENTO PARA EL BOTON 'btnguardarfactura'
  document
    .getElementById("btnnuevafactura")
    .addEventListener("click", function () {
      estadoFormulario.StatusFacturaEdit = false;

      const inputidfactura = document.getElementById("txidfactura");
      const inputnumerofactura = document.getElementById("txtnumerofactura");
      const inputnombreproveedor = document.getElementById("txtnombreprovedor");
      const inputlugarcompra = document.getElementById("txtlugarcompra");
      const inputfechafactura = document.getElementById("datefechafactura");
      const inputobservacionfactura = document.getElementById(
        "txtobservacionfactura",
      );
      const btneditarfactura = document.getElementById("btneditarfactura");
      const btncancelarfactura = document.getElementById("btncancnuevafactura");

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
  document
    .getElementById("btnguardarfactura")
    .addEventListener("click", async function () {
      const inputidfactura = document.getElementById("txidfactura");
      const inputnumerofactura = document.getElementById("txtnumerofactura");
      const inputnombreproveedor = document.getElementById("txtnombreprovedor");
      const inputlugarcompra = document.getElementById("txtlugarcompra");
      const inputfechafactura = document.getElementById("datefechafactura");
      const inputobservacionfactura = document.getElementById(
        "txtobservacionfactura",
      );
      const btneditarfactura = document.getElementById("btneditarfactura");
      const btncancelarfactura = document.getElementById("btncancnuevafactura");

      //VERIFICAR SI SE CREA UNA NUEVA FACTURA O SE EDITA UNA EXISTENTE
      // Crear nueva factura
      if (inputidfactura.value === "*") {
        const Data = {
          numeroFactura: inputnumerofactura.value,
          nombreProveedor: inputnombreproveedor.value,
          lugarCompra: inputlugarcompra.value,
          fechaFactura: inputfechafactura.value,
          observacion: inputobservacionfactura.value,
        };
        // Validar datos
        if (
          !Data.numeroFactura ||
          !Data.nombreProveedor ||
          !Data.lugarCompra ||
          !Data.fechaFactura ||
          !Data.observacion
        ) {
          Toast.fire({
            icon: "warning",
            title: "Datos de Factura incompletos",
          });
          return;
        }
        const config = {
          url: `${api}/api/facturas/AgregarNuevaFactura`,
          data: Data,
          successTitle: "Factura agregada exitosamente",
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
        }
      }

      // Editar factura existente
      else {
        if (estadoFormulario.StatusFacturaEdit == true) {
          if (
            General.verificacion_numerica_entero(
              inputidfactura.value,
              "El ID factura",
            )
          ) {
            // Validar datos
            if (!inputidfactura.value) {
              Toast.fire({
                icon: "warning",
                title: "Id Factura no Válida",
              });
              return;
            }

            estadoFormulario.StatusFacturaEdit = false;
            estadoFormulario.IdFactura = inputidfactura.value;
            inputidfactura.disabled = true;
            inputnumerofactura.disabled = true;
            inputnombreproveedor.disabled = true;
            inputlugarcompra.disabled = true;
            inputfechafactura.disabled = true;
            inputobservacionfactura.disabled = true;
            btneditarfactura.disabled = false;
            btncancelarfactura.hidden = true;
          } else {
            console.log("El valor no es válido.");
          }
        }
      }
    });
  //FINALIZAR EVENTO PARA EL BOTON 'btnguardarfactura'

  //*INICIO Evento para el botón 'btneditarfactura'
  document
    .getElementById("btneditarfactura")
    .addEventListener("click", function (event) {
      const inputidfactura = document.getElementById("txidfactura");
      inputidfactura.disabled = false;
      estadoFormulario.StatusFacturaEdit = true;
    });

  //*////////////////////////////////////////////////////////////////////////////////////////////////////////////*

  //* IMPRESION DE ETIQUETAS Y GENERACION DE QR

  //*//////////////////////////////////////////////////////////////////////////////////////////////////////////*/

  //DECLARACION DE VARIABLES
  //botones
  const btnGenerarQR = document.getElementById("btnGenerarQR");
  const btnImprimirEtiqueta = document.getElementById("btnImprimirEtiqueta");
  const btncerrar = document.getElementById("btncerrar");
  const btoncerrarmodal = document.getElementById("btoncerrarmodal");
  //container
  const container = document.getElementById("container-input-regulatorio");
  const textboxregulatorio = document.getElementById("textboxregulatorio");
  const inputRegulatorio = document.getElementById("inputRegulatorio");
  const checkRegulatorio = document.getElementById("checkRegulatorio");
  const imgQR = document.getElementById("img_qr");

  const view_id = document.getElementById("view_id");
  const view_codigo_ti = document.getElementById("view_codigo_ti");
  const view_numero_serie = document.getElementById("view_numero_serie");
  const view_dispositivo = document.getElementById("view_dispositivo");
  const view_marca = document.getElementById("view_marca");
  const view_modelo = document.getElementById("view_modelo");

  function abrirmodalGeneradorQR() {
    if (estadoFormulario.ImpresionRapida == true) {
    
    
    QRCode.toDataURL(
        estadoFormulario.CodigoTI,
        { width: 150 },
        function (err, url) {
            if (err) {
                console.error('Error al generar QR:', err);
                return;
            }
            
            // Mostrar QR en el modal
            imgQR.src = url;
            
            // IMPRIMIR DENTRO DEL CALLBACK (después de que el QR esté listo)
            // ✅ Se pasa el 'url' como segundo parámetro
            imprimirEtiquetaSimple(estadoFormulario.CodigoTI, url);
        }
    );
} else {
      $("#modalDetalleQR").modal("show");

      view_id.textContent = estadoFormulario.IdComponente;
      view_codigo_ti.textContent = estadoFormulario.CodigoTI;
      view_numero_serie.textContent = estadoFormulario.NumeroSerie;
      view_dispositivo.textContent = estadoFormulario.Dispositivo;
      view_marca.textContent = estadoFormulario.marca;
      view_modelo.textContent = estadoFormulario.modelo;
    }
  }

 

  // Mostrar u ocultar el campo de código regulatorio según el estado del checkbox
  checkRegulatorio.addEventListener("change", function () {
    if (this.checked) {
      container.classList.remove("d-none");
      container.classList.add("d-block");
      textboxregulatorio.hidden = false;

      inputRegulatorio.focus();
    } else {
      textboxregulatorio.hidden = true;
      container.classList.add("d-none");
      container.classList.remove("d-block");
      inputRegulatorio.value = ""; // Limpiamos el dato al desmarcar
    }
  });
  // Evento para generar el código QR al hacer clic en el botón "btnGenerarQR"
  btnGenerarQR.addEventListener("click", function () {
    //provisional
    const codigoTI = document.getElementById("view_codigo_ti").textContent;
    estadoFormulario.CodigoTI = codigoTI; // Guardar el código TI en el

    // Limpiar QR anterior
    imgQR.src = "";

    QRCode.toDataURL(
      estadoFormulario.CodigoTI,
      { width: 150 },
      function (err, url) {
        imgQR.src = url;
        // Habilitamos el botón de imprimir una vez generado

        btnImprimirEtiqueta.disabled = false;
        btnImprimirEtiqueta.className = "btn btn-primary";
        document.getElementById("view_codigo_ti_etiqueta").textContent =
          estadoFormulario.CodigoTI;
        if (checkRegulatorio.checked == true) {
          document.getElementById(
            "view_codigo_regulatorio_etiqueta",
          ).textContent = inputRegulatorio.value;
          estadoFormulario.codigoregulatorio = inputRegulatorio.value;
        }
      },
    );
  });
  // Evento para imprimir la etiqueta al hacer clic en el botón "btnImprimirEtiqueta"
  btnImprimirEtiqueta.addEventListener("click", async function () {
    const qrYaGenerado = document.getElementById("img_qr").src;
    if (checkRegulatorio.checked == true) {
      //generar etiqueta con codigo regulatorio
      if (
        inputRegulatorio.value == "" ||
        !inputRegulatorio.value ||
        inputRegulatorio.value == null
      ) {
        Toast.fire({
          icon: "warning",
          title: "Código Regulatorio no Válido",
        });
        return;
      }
      if (
        document.getElementById("view_codigo_regulatorio_etiqueta")
          .textContent == "--"
      ) {
        Toast.fire({
          icon: "warning",
          title: "Generar el Código QR para imprimir la etiqueta",
        });
        return;
      }

      await imprimirEtiquetaRegulatorio(
        estadoFormulario.CodigoTI,
        estadoFormulario.codigoregulatorio,
        qrYaGenerado,
      );
    } else {
      await imprimirEtiquetaSimple(estadoFormulario.CodigoTI, qrYaGenerado);
    }
    limpiarmodalQR();
    $("#modalDetalleQR").modal("hide");
  });
  btncerrar.addEventListener("click", async function () {
    limpiarmodalQR();
    $("#modalDetalleQR").modal("hide");
  });
  btoncerrarmodal.addEventListener("click", async function () {
    limpiarmodalQR();
    $("#modalDetalleQR").modal("hide");
  });
  // Función para limpiar el modal después de imprimir la etiqueta
  function limpiarmodalQR() {
    /*view_id.textContent = "--";
    view_codigo_ti.textContent = "--";
    view_numero_serie.textContent = "--";
    view_dispositivo.textContent = "--";
    view_marca.textContent = "--";
    view_modelo.textContent = "--";*/
    checkRegulatorio.checked = false;
    textboxregulatorio.hidden = true;
    imgQR.src = "/resources/exampleQR.png";
    btnImprimirEtiqueta.disabled = true;
    textboxregulatorio.hidden = true;
    container.classList.add("d-none");
    container.classList.remove("d-block");
    inputRegulatorio.value = ""; // Limpiamos el dato al desmarcar
    document.getElementById("view_codigo_regulatorio_etiqueta").textContent =
      "--";
  }
});
