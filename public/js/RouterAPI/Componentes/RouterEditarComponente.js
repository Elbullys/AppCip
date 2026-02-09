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
} from "../Utils.js";

//IMPORTAR FUNCIONES PARA INCIALIZAR MODALES
import {
  clsFuncionesModales,
  inicializarDataTableUnidades,
  inicializarDataTableResponsablePorIdUnidad,
  inicializarDataTableAreasPorTipoUnidad,
  inicializarDataTableDispositivos,
  inicializarDataTableCatalogoComponentePorDispositivo,
  inicializarDataTableFactura
} from "../UtilsFuncionesModales.js";

const api = URLAPI;
const idcomponente = document.getElementById("idcomponenteValue").textContent;

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
  IdTecnico: document.getElementById("idtecnicoValue").textContent,
  //VARIABLES DE CONTROL
  EsDispositivoMovil: null,
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
  },
});

// AL ABRIR LA PAGINA - TODO DENTRO DE DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  //LOCALSTORAGE NOMBRE DE USUARIO EN PERFIL
  obtenerUsuarioLocalStorage();
  let cambiosPendientes = true; // Bandera para saber si hay cambios no guardados
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
  const editComponenteForm = document.getElementById("FormEditComponente");
  const btnmodificar = document.getElementById("btnmodificar");

  // Inicializar DataTable al cargar la página
  InicializarFormulario();
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

  // ENVIO DE FORMULARIO
  editComponenteForm.addEventListener("submit", async (e) => {
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

    // Recopila los datos del formulario
    const idfactura = document.getElementById("txidfactura");
    const numerofactura = document.getElementById("txtnumerofactura");
    const nombreproveedor = document.getElementById("txtnombreprovedor");
    const lugarcompra = document.getElementById("txtlugarcompra");
    const numeroserie = document.getElementById("txtnumeroserie");
    const status_equipo = document.getElementById("statusequiposelect");
    const fecha_compra = document.getElementById("datefechacompra");
    const radioServidorCliente =
      obtenerValorRadioSeleccionado("servidorcliente");
    const activoEnInventario = obtenerEstadoSwitch("switchinventario");
    const observaciones = document.getElementById("txtobservaciones");

    // Validaciones usando General de utils.js
    const validarnumeroFactura = General.validar_Campos_String(
      numerofactura.value.trim(),
      "El Número de Factura"
    );
    const validarnombreproveedor = General.validar_Campos_String(
      nombreproveedor.value.trim(),
      "El nombre de Proveedor"
    );
    const validarlugarcompra = General.validar_Campos_String(
      lugarcompra.value.trim(),
      "El lugar de compra"
    );
    const validaridfactura = General.verificacion_numerica_entero(
      idfactura.value,
      "El ID Factura"
    );
    const validarnumeroserie = General.validar_Campos_String(
      numeroserie.value,
      "El número de serie "
    );
    const validarstatus_equipo = General.validar_Campos_Select(
      status_equipo.value,
      "un Estatus de equipo"
    );
    const validarObservaciones = General.validar_Campos_String(
      observaciones.value.trim(),
      "La observaciones"
    );

    if (
      validarstatuseditarFactura.error ||
      validarnumeroFactura.error ||
      validarnombreproveedor.error ||
      validarlugarcompra.error ||
      validaridfactura.error ||
      validarnumeroserie.error ||
      validarstatus_equipo.error ||
      validarObservaciones.error
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
      ];
      // Encontrar la primera validación que falló
      const failedValidation = validations.find((val) => val.error);

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

        FK_IdTecnico: document.getElementById("idtecnicoValue").textContent,
        //contrato
        numero_contrato_actual: estadoFormulario.contratoid,
      };

      const sesionTecnico = await ObtenerIdTecnicoSesion();
      let IdTecnico = sesionTecnico.data.id_tecnico;

      if (sesionTecnico || sesionTecnico.body) {
        //*Preparar la Petición de Actualización (PUT)
        dataComponenteActualizado.FK_IdTecnico = IdTecnico;

        const config = {
          url: `${api}/api/componentes/EditarComponentePorID`,
          id: idcomponente,
          data: {
            // Combina ambos en un solo objeto
            data: dataComponenteActualizado, // Tu data actualizada
            data_componentes_anteriores: ComponentesAnteriores, // Los datos anteriores
          },
          successTitle: `El componente se ha Modificado Exitosamente`,
        };

        const response = await handlePUT(config);

        if (response.error === false && response.status == 200) {
          setTimeout(() => {
            cambiosPendientes = false;
            window.location.href = `/EditarComponente/${response.body.codigo_TI}`;
          }, 1000);
        } else {
          Swal.fire({
            icon: response.icon,
            title: "Error en la edicion",
            text: response.message || "Datos no Válidos",
          });
        }
      }
    }
  });

  //*EVENTO BOTON BUSCAR UNIDAD EN MODAL
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

//*EVENTO BOTON BUSCAR RESPONSABLE EN MODAL
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



  //*EVENTO BOTON BUSCAR DISPOSITIVO EN MODAL
  const btnBuscarDispositivo = document.getElementById("btnBuscarDispositivo");
  if (btnBuscarDispositivo) {
      btnBuscarDispositivo.addEventListener("click", async () => {
      // Aquí capturamos los valores JUSTO en el momento del clic
      const searchTerm = $("#inputBusquedadispositivo").val().trim();

      const EleccionDispositivos=
        await inicializarDataTableDispositivos(searchTerm);
        console.log("EleccionDispositivos",EleccionDispositivos);
        asignacionVariablesDispositivos(EleccionDispositivos);
    });
  }

   // EVENTO PARA BUSCAR CON ENTER EN EL INPUT DEL MODAL
  const inputDispositivo = document.getElementById("inputBusquedadispositivo");
  if (inputDispositivo) {
    inputDispositivo.addEventListener("keydown",async function (event) {
      if (event.key === "Enter") {
        // Usa 'Enter' (case-sensitive)
        const EleccionDispositivos=await clsFuncionesModales.BuscarDispositivo(inputDispositivo.value);
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
      // Aquí capturamos los valores JUSTO en el momento del clic
      const searchTerm = $("#inputBusquedaCatalogo").val().trim();

      const EleccionResponsable =
        await inicializarDataTableCatalogoComponentePorDispositivo(
          searchTerm,
          estadoFormulario.IdDispositivo
        );
        asignacionVariablesCatalogoComponentes(EleccionResponsable);
    });
   
  }
    //*EVENTO BOTON BUSCAR FACTURA EN MODAL
  const btnBuscarfactura = document.getElementById("btnBuscarfactura");
 
    if (btnBuscarfactura) {
      btnBuscarfactura.addEventListener("click", async () => {
      // Aquí capturamos los valores JUSTO en el momento del clic
      const searchTerm = $("#inputBusquedafactura").val().trim();

      const EleccionFactura =
        await inicializarDataTableFactura(
          searchTerm,
          estadoFormulario.IdUnidadValue
        );
        console.log("EleccionFactura",EleccionFactura);
        asignacionVariablesFacturas(EleccionFactura);
    });
     
   
  }


  /*////////////////////////////////////////////////////////////////////////////////////////////////////////////*
  
    // EVENTOS PARA ABRIR MODALES
  
  /*/ /////////////////////////////////////////////////////////////////////////////////////////////////////////*/

  //* Evento para abrir modal unidades
  document
    .getElementById("txtIdUnidad")
    .addEventListener("keydown",  function (event) {
      if (event.key === "F1" || event.key === "F2") {
        event.preventDefault();
        document.getElementById("inputBusqueda").value = "";
        $("#consultaUnidadesModal").modal("show");
        inicializarDataTableUnidades("");
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
        inicializarDataTableUnidades("");
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
            estadoFormulario.tipo_unidad
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
            estadoFormulario.tipo_unidad
          );

          asignacionVariablesAreas(EleccionArea);
        }
      }
    });

  
  //* INICIO EVENTO TECLADO PARA ABRIR MODAL RESPONSABLE

  document.getElementById("txtidresponsable").addEventListener("keydown", async function (event) {
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
              estadoFormulario.IdUnidadValue
            );
          asignacionVariablesResponsables(EleccionResponsable);
        }
      }
    });

  

  //* Evento para abrir modal DISPOSITIVOS
  document
    .getElementById("txtIddispositivo")
    .addEventListener("keydown",async function (event) {
      if (event.key === "F1" || event.key === "F2") {
        event.preventDefault();
        document.getElementById("inputBusquedadispositivo").value = "";
        $("#consultaDispositivosModal").modal("show");
        const EleccionDispositivos = await inicializarDataTableDispositivos('');
      
        asignacionVariablesDispositivos(EleccionDispositivos);
      }
    });
 

  // Evento touch para abrir modal DISPOSITIVOS
  document
    .getElementById("txtIddispositivo")
    .addEventListener("click",async function (event) {
      if (estadoFormulario.EsDispositivoMovil == true) {
        event.preventDefault();
        document.getElementById("inputBusquedadispositivo").value = "";
        $("#consultaDispositivosModal").modal("show");
        const EleccionDispositivos = await inicializarDataTableDispositivos('');
        
        asignacionVariablesDispositivos(EleccionDispositivos);
      }
    });

  //* Evento para abrir modal CATALOGOS
  document
    .getElementById("txtIdCatalogo")
    .addEventListener("keydown", function (event) {
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
          let searchTerm = "";
          inicializarDataTableCatalogoComponentePorDispositivo(
            searchTerm,
            estadoFormulario.IdDispositivo
          );
        }
      }
    });
  // EVENTO PARA BUSCAR CON ENTER EN EL INPUT DEL MODAL
  const inputBusquedaCatalogo = document.getElementById(
    "inputBusquedaCatalogo"
  );
  if (inputBusquedaCatalogo) {
    inputBusquedaCatalogo.addEventListener("keydown",async function (event) {
      if (event.key === "Enter") {
        // Usa 'Enter' (case-sensitive)
        const EleccionCatalogoComponentes=await clsFuncionesModales.BuscarCatalogoComponente(inputBusquedaCatalogo.value,estadoFormulario.IdDispositivo); // Llama a la función de búsqueda
        asignacionVariablesCatalogoComponentes(EleccionCatalogoComponentes);
      }
    });
  } else {
    console.error("No se encuentra tu Búsqueda de Catálogo");
  }

  // Evento touch para abrir modal CATALOGOS COMPONENTES
  document
    .getElementById("txtIdCatalogo")
    .addEventListener("click",async function (event) {
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
       
         const EleccionCatalogoComponentes= await inicializarDataTableCatalogoComponentePorDispositivo(
            "",
            estadoFormulario.IdDispositivo
          );
          asignacionVariablesCatalogoComponentes(EleccionCatalogoComponentes);
        }
      }
    });


  //* Evento para abrir modal FACTURAS
  document
    .getElementById("txidfactura")
    .addEventListener("keydown",async function (event) {
      if (event.key === "F1" || event.key === "F2") {
        event.preventDefault();

        if (estadoFormulario.StatusFacturaEdit == true) {
           document.getElementById("inputBusquedafactura").value = "";
          $("#consultaFacturaModal").modal("show"); // Mostrar modal
           const EleccionFactura= await inicializarDataTableFactura("");
          asignacionVariablesFacturas(EleccionFactura);
        }
      }
    });
  // EVENTO PARA BUSCAR CON ENTER EN EL INPUT DEL MODAL
  const inputBusquedafactura = document.getElementById("inputBusquedafactura");
  if (inputBusquedafactura) {
    inputBusquedafactura.addEventListener("keydown",async function (event) {
      if (event.key === "Enter") {
        // Usa 'Enter' (case-sensitive)
        const EleccionFactura= await clsFuncionesModales.BuscarFactura(inputBusquedafactura.value); // Llama a la función de búsqueda
         console.log("EleccionFactura",EleccionFactura);
        asignacionVariablesFacturas(EleccionFactura);
      }
    });
  } else {
    console.error("No se encuentro la Factura");
  }

  // Evento touch para abrir modal FACTURAS
  document
    .getElementById("txidfactura")
    .addEventListener("click",async function (event) {
      if (estadoFormulario.EsDispositivoMovil == true) {
        event.preventDefault();
        if (estadoFormulario.StatusFacturaEdit == true) {
          document.getElementById("inputBusquedafactura").value = ""; // Limpiar el campo de búsqueda al abrir el modal
          $("#consultaFacturaModal").modal("show"); // Mostrar modal
          const EleccionFactura= await inicializarDataTableFactura("");
           console.log("EleccionFactura",EleccionFactura);
          asignacionVariablesFacturas(EleccionFactura);
          // INICIALIZAR EVENTO TECLADO TECLA (ENTER) PARA BUSQUEDA EN UNIDAD
          const input = document.getElementById("inputBusquedafactura");
        }
      }
      // Función para detectar si hay cambios no guardados (implementa según tu formulario)

      // Código del formulario aquí (ej. event listeners para switches, toasts, etc.)
      // Función y event listener para advertencia de navegación atrás
    });

  //*TERMINA

  //*////////////////////////////////////////////////////////////////////////////////////////////////////////////*

  //FUNCIONES PARA ASIGNACION DE CAMPOS

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
          estadoFormulario.contratoid
        );
    } else {
      estadoFormulario.contratoid = "0";
      document.getElementById("txtIdUnidad").value =
        General.concatenar_contrato_unidad(
          estadoFormulario.IdUnidadValue,
          estadoFormulario.contratoid
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
    console.log("estadoFormulario.contratoid", estadoFormulario.contratoid);
    console.log("estadoFormulario.operacion", estadoFormulario.operacion);
    console.log("estadoFormulario.Estado", estadoFormulario.Estado);
    console.log(
      "estadoFormulario.nombre_unidad",
      estadoFormulario.nombre_unidad
    );
    console.log("estadoFormulario.tipo_unidad", estadoFormulario.tipo_unidad);
    console.log("estadoFormulario.AbrevEstado", estadoFormulario.AbrevEstado);
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

  function asignacionVariablesAreas(data)
{
  //asignacion a variables globales del array
      estadoFormulario.IdArea = data.id_area;
      estadoFormulario.Nombre_Area = data.area;
      //ASIGNACION A INPUTS
      document.getElementById("txtarea").value = estadoFormulario.Nombre_Area;
}

function asignacionVariablesDispositivos(data)
{
  
                 estadoFormulario.IdDispositivo = data.id_dispositivo;
                  estadoFormulario.Dispositivo = data.tipo_equipo;
                  estadoFormulario.AbrDispositivo = data.abreviatura_tipo;
                        //ASIGNACION A INPUTS
                  document.getElementById("txtIddispositivo").value =
                    estadoFormulario.IdDispositivo;
                  document.getElementById("txtdispositivo").value =
                    estadoFormulario.Dispositivo;
                    //LIMPIEZA DE INPUTS POR SELECCION
                  document.getElementById("txtIdCatalogo").value = "";
                  document.getElementById("txtnombrecatalogo").value = "";
                  document.getElementById("txtdescripcioncatalogo").value = "";
}

 function asignacionVariablesCatalogoComponentes(data)
{
  //asignacion a variables globales del array
     estadoFormulario.IdCatalogoComponente =
                    data.id_catalogo_componente;
                  estadoFormulario.Nombre_Catalogo = data.nombre_catalogo;
                  estadoFormulario.Descripcion = data.descripcion_modelo;
                  estadoFormulario.marca = data.marca;
                  estadoFormulario.modelo = data.modelo;
                  estadoFormulario.procesador = data.Procesador;
                  estadoFormulario.memoria_ram = data["Memoria Ram"];
                  estadoFormulario.disco_duro = data["Disco Duro"];
                  estadoFormulario.sistema_operativo =
                    data["Sistema Operativo"];
      //ASIGNACION A INPUTS
      document.getElementById("txtIdCatalogo").value =
                  estadoFormulario.IdCatalogoComponente;
                document.getElementById("txtnombrecatalogo").value =
                  estadoFormulario.Nombre_Catalogo;
                document.getElementById("txtdescripcioncatalogo").value =
                  estadoFormulario.Descripcion;
}

 function asignacionVariablesFacturas(data)
{
   console.log("data",data);
  //asignacion a variables globales del array
    estadoFormulario.IdFactura = data.IdFactura;
                  estadoFormulario.NumeroFactura = data.NumeroFactura;
                  estadoFormulario.NombreProveedor = data.NombreProveedor;
                  estadoFormulario.LugarCompra = data.LugarCompra;
                  estadoFormulario.FechaFactura = data.FechaFactura;
                  estadoFormulario.Observacion = data.Observacion;
      //ASIGNACION A INPUTS
      document.getElementById("txidfactura").value =
                  estadoFormulario.IdFactura;
                document.getElementById("txtnumerofactura").value =
                  estadoFormulario.NumeroFactura;
                document.getElementById("txtnombreprovedor").value =
                  estadoFormulario.NombreProveedor;
                document.getElementById("txtlugarcompra").value =
                  estadoFormulario.LugarCompra;
                document.getElementById("txtobservacionfactura").value =
                  estadoFormulario.Observacion;
                document.getElementById("datefechafactura").value =
                  conversionFecha(estadoFormulario.FechaFactura);

}


  //*////////////////////////////////////////////////////////////////////////////////////////////////////////////*

  // FUNCIONES PARA FACTURAS Y OTROS EVENTOS (SE ENCUENTRAN EN EL FORMULARIO BOTONES ETC)

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
        "txtobservacionfactura"
      );
      const btncancnuevafactura = document.getElementById(
        "btncancnuevafactura"
      );

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
        "txtobservacionfactura"
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
        "txtobservacionfactura"
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
          // Usa response.id para lo que necesites
        }
      }

      // Editar factura existente
      else {
        if (estadoFormulario.StatusFacturaEdit == true) {
          if (
            General.verificacion_numerica_entero(
              inputidfactura.value,
              "El ID factura"
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

            const data = {
              idFactura: inputidfactura.value,
            };

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
  document
    .getElementById("btneditarfactura")
    .addEventListener("click", function (event) {
      const inputidfactura = document.getElementById("txidfactura");
      inputidfactura.disabled = false;
      estadoFormulario.StatusFacturaEdit = true;
    });

  // FUNCION INICIALIZAR FORMULARIO
  async function InicializarFormulario() {
    // Reiniciar el formulario
    document.getElementById("FormEditComponente").reset();
    // Limpiar los campos de error
    const errorFields = document.querySelectorAll(".error");
    errorFields.forEach((field) => (field.textContent = ""));

    const validaridcomponente = General.verificacion_numerica_entero(
      idcomponente,
      "El ID Componente"
    );

    if (validaridcomponente.error) {
      // Array de todas las validaciones para iterar
      const validations = [validaridcomponente];

      // Encontrar la primera validación que falló
      const failedValidation = validations.find((val) => val.error);
      Swal.fire({
        icon: failedValidation.icon,
        title: "ID no Válido",
        text: failedValidation.message || "Login exitoso.",
      }).then(() => {
        window.location.href = "/EditarDatos";
      });
    } else {
      //asignar a campo
      document.getElementById("txtidcomponente").value = idcomponente;

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

        document.getElementById("txtcodigoti").value = componente.codigo_TI;
        estadoFormulario.IdUnidadValue = componente.id_unidad.toString();
        estadoFormulario.operacion = componente.operacion.toString();
        estadoFormulario.contratoid = componente.num_contrato_actual.toString();
        estadoFormulario.tipo_unidad = componente.tipo_unidad;
        estadoFormulario.nombre_unidad = componente.nombre_unidad; //nombre_unidad
        estadoFormulario.Estado = componente.Estado; //Estado
        estadoFormulario.IdDispositivo = componente.id_dispositivo;
        estadoFormulario.EsClienteServidor = componente.EsClienteServidor;
        estadoFormulario.IdArea = componente.FK_id_area;
        console.log("IdArea", estadoFormulario.IdArea);
        estadoFormulario.AbrevEstado = componente.abreviatura_estado;
        estadoFormulario.AbrDispositivo = componente.abreviatura_tipo;
        estadoFormulario.IdCatalogoComponente =
          componente.id_catalogo_componente;
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
        if (estadoFormulario.operacion === "GUANAJUATO") {
          document.getElementById("txtIdUnidad").value =
            General.concatenar_contrato_unidad(
              estadoFormulario.IdUnidadValue,
              estadoFormulario.contratoid
            );
        } else {
          document.getElementById("txtIdUnidad").value =
            estadoFormulario.IdUnidadValue;
        }
        document.getElementById("txtnombreunidad").value =
          estadoFormulario.nombre_unidad;
        document.getElementById("txtoperacion").value =
          estadoFormulario.operacion;
        document.getElementById("txtarea").value = componente.area;
        document.getElementById("txtidresponsable").value =
          componente.id_responsable;
        document.getElementById("txtnombreresponsable").value =
          componente.nombre_responsable;
        document.getElementById("txtcargoresponsable").value = componente.cargo;
        document.getElementById("txtarearesponsable").value = componente.area;
        document.getElementById("txtIddispositivo").value =
          estadoFormulario.IdDispositivo;
        document.getElementById("txtdispositivo").value =
          componente.tipo_equipo;
        document.getElementById("txtIdCatalogo").value =
          estadoFormulario.IdCatalogoComponente;
        document.getElementById("txtnombrecatalogo").value =
          componente.marca + " " + componente.modelo;
        document.getElementById("txtdescripcioncatalogo").value =
          componente.descripcion_modelo;
        document.getElementById("txtnumeroserie").value =
          estadoFormulario.NumeroSerie;
        document.getElementById("txtobservaciones").value =
          estadoFormulario.Observaciones;

        //*SWITCH QUE PERMITE DAR UN ACTIVO O CANCELADO
        const switchElement = document.getElementById("switchinventario");
        console.log(
          "EstatusInventario inicial formulario",
          estadoFormulario.EstatusInventario
        );
        if (estadoFormulario.EstatusInventario.toString() == "1") {
          switchElement.checked = true; // Activar switch si activo
          cambiarLabelSwitch("switchinventario", "ACTIVO");
          //*error por aqui
        } else if (estadoFormulario.EstatusInventario.toString() === "0") {
          switchElement.checked = false; // Desactivar si cancelado
          cambiarLabelSwitch("switchinventario", "CANCELADO");
        } else {
          switchElement.checked = false; // Por defecto, desactivado
          cambiarLabelSwitch("switchinventario", "UNDEFINED");
        }

        // Cargar PUESTOS
        //await SelectobtenerPuestos('AsignacionSelectPuestos'); // Llenar el select de PUESTOS
        // Seleccionar el color correspondiente
        //const selectpuesto = document.getElementById('AsignacionSelectPuestos');
        //selectpuesto.value = usuarios.IdPuesto; // Asegúrate de que este valor coincida con el value de las opciones

        document.getElementById("datefechacompra").value = conversionFecha(
          estadoFormulario.FechaCompra
        );
        let clienteservidor = estadoFormulario.EsClienteServidor.toString();
        console.log("clienteservidor", clienteservidor);
        if (clienteservidor === "SERVIDOR") {
          document.getElementById("chbxservidor").checked = true;
        } else if (clienteservidor === "CLIENTE") {
          document.getElementById("chbxcliente").checked = true;
        } else if (clienteservidor === "N/A") {
          document.getElementById("chbxna").checked = true;
        }
        document.getElementById("statusequiposelect").value =
          estadoFormulario.EstatusComponente.toString();
        document.getElementById("txidfactura").value =
          VariablesFactura.idfactura;
        document.getElementById("txtnumerofactura").value =
          VariablesFactura.numerofactura;
        document.getElementById("txtnombreprovedor").value =
          VariablesFactura.nombreproveedor;
        document.getElementById("txtlugarcompra").value =
          VariablesFactura.lugarcompra;
        document.getElementById("datefechafactura").value = conversionFecha(
          VariablesFactura.fechafactura
        );
        document.getElementById("txtobservacionfactura").value =
          VariablesFactura.observacionfactura;
      } else {
        Toast.fire({
          icon: "error",
          title: "No se encontraron datos del componente Solicitado",
        });
        console.error("No se encontraron datos del componente Solicitado");
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
      ComponentesAnteriores.FK_id_area = estadoFormulario.IdArea; //IdArea
      //DISPOSITIVOS
      ComponentesAnteriores.FK_id_dispositivo = estadoFormulario.IdDispositivo;
      ComponentesAnteriores.abreviatura_tipo = estadoFormulario.AbrDispositivo;
      //COMPONENTES
      ComponentesAnteriores.FK_id_catalogo_componentes =
        estadoFormulario.IdCatalogoComponente;
      ComponentesAnteriores.numero_serie = estadoFormulario.NumeroSerie;
      ComponentesAnteriores.numero_consecutivo =
        estadoFormulario.NumeroConsecutivo;
      ComponentesAnteriores.abreviatura_EQ = estadoFormulario.AbrevEQ;
      ComponentesAnteriores.observaciones = estadoFormulario.Observaciones;
      ComponentesAnteriores.status_componente =
        estadoFormulario.EstatusComponente;
      ComponentesAnteriores.status_inventario =
        estadoFormulario.EstatusInventario;
      ComponentesAnteriores.FechaRegistro = estadoFormulario.FehaRegistro;
      ComponentesAnteriores.EsClienteServidor =
        estadoFormulario.EsClienteServidor;
      ComponentesAnteriores.FechaCompra = estadoFormulario.FechaCompra;
      ComponentesAnteriores.codigoTI = estadoFormulario.CodigoTI;
    }
  }

  // FUNCION ActualizarComponenteFactura
  //inicio UPDATE COMPONENTE FACTURA
  async function ActualizarComponenteFactura() {
    const id_factura = document.getElementById("idpersonallavadoHidden").value;
    if (id_factura === "*") {
      Toast.fire({
        icon: "warning",
        title: "Es un *.",
      });
    } else if (id_factura != "*") {
      const verificar_numero = General.verificacion_numerica_entero(id_factura);
      if (verificar_numero === true) {
      } else {
        Toast.fire({
          icon: "warning",
          title: "Dato Inválido",
        });
      }
    }

    // Obtener el ID del lavador a editar
  }
});
