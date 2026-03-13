import {
  General,
  obtenerUsuarioLocalStorage,
  imprimirEtiquetaSimple,
  imprimirEtiquetaRegulatorio,
  URLAPI, handleGET,
 
} from "../Utils.js";

//IMPORTAR FUNCIONES PARA INCIALIZAR MODALES
import {
  clsFuncionesModales,
  inicializarDataTableComponentes,
} from "../UtilsFuncionesModales.js";

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
  //COMPONENTE
  id_componente: null,
  //VARIABLES DE CONTROL
  EsDispositivoMovil: null,
};


document.addEventListener("DOMContentLoaded", (e) => {
  const api = URLAPI;
  let searchTerm;
  //DECLARACION INPUTS Y ELEMENTOS DEL DOM
  const chkRegulatorio = document.getElementById("checkRegulatorio");
  const containerInput = document.getElementById("container-input-regulatorio");
  const textboxregulatorio = document.getElementById("textboxregulatorio");
  const inputRegulatorio = document.getElementById("inputRegulatorio");
  const viewRegEtiqueta = document.getElementById(
    "view_codigo_regulatorio_etiqueta",
  );
  const inputidcomponente = document.getElementById("inputidcomponente");
  const view_codigo_ti = document.getElementById("view_codigo_ti");
  const view_numero_serie = document.getElementById("view_numero_serie");
  const view_dispositivo = document.getElementById("view_dispositivo");
  const view_marca = document.getElementById("view_marca");
  const view_modelo = document.getElementById("view_modelo");
  const imgQR = document.getElementById("img_qr");

  //DECLARACION DE BOTONES
  const btnImprimirEtiqueta = document.getElementById("btnImprimirEtiqueta");
  const btnGenerarQR = document.getElementById("btnGenerarQR");
  const btnNuevo = document.getElementById("btnNuevo");
  const btnEscanear = document.getElementById("btnEscanear");

  //LOCALSTORAGE NOMBRE DE USUARIO EN PERFIL
  obtenerUsuarioLocalStorage();
  e.preventDefault();
  estadoFormulario.EsDispositivoMovil = General.esDispositivoMovil();

  //*EVENTO BOTON BUSCAR UNIDAD EN MODAL
  const btnBuscarcomponente = document.getElementById("btnBuscarcomponente");
  if (btnBuscarcomponente) {
    btnBuscarcomponente.addEventListener("click", async () => {
      //  captura los valores JUSTO en el momento del clic
      const searchTerm = $("#inputBusquedaComponente").val().trim();

      const EleccionComponente =
        await clsFuncionesModales.BuscarComponente(searchTerm);
      //asignacion a variables globales del array
      asignacionVariablesComponentes(EleccionComponente);
    });
  }

  const inputBusqueda = document.getElementById("inputBusquedaComponente");
  if (inputBusqueda) {
    inputBusqueda.addEventListener("keydown", async function (event) {
      if (event.key === "Enter") {
        const searchTerm = $("#inputBusquedaComponente").val().trim();
        const EleccionComponente =
          await clsFuncionesModales.BuscarComponente(searchTerm);
        //asignacion a variables globales del array
        asignacionVariablesComponentes(EleccionComponente);
      }
    });
  }
  /*////////////////////////////////////////////////////////////////////////////////////////////////////////////*
  
    //* EVENTOS PARA ABRIR MODALES
  
  //* /////////////////////////////////////////////////////////////////////////////////////////////////////////*/

  //* Evento para abrir modal COMPONENTES
  inputidcomponente.addEventListener("keydown", function (event) {
    if (event.key === "F1" || event.key === "F2") {
      event.preventDefault();
      document.getElementById("inputBusquedaComponente").value = "";
      $("#consultaComponentesModal").modal("show");
      inicializarDataTableComponentes("");
    }
  });

  // Evento touch para abrir modal COMPONENTES
  inputidcomponente.addEventListener("click", async function (event) {
    if (estadoFormulario.EsDispositivoMovil == true) {
      event.preventDefault();
      document.getElementById("inputBusquedaComponente").value = "";
      $("#consultaComponentesModal").modal("show");
      inicializarDataTableComponentes("");
    }
  });

  /*////////////////////////////////////////////////////////////////////////////////////////////////////////////*
  
    //* EVENTOS FORMULARIO
  
  //* /////////////////////////////////////////////////////////////////////////////////////////////////////////*/

  // Mostrar u ocultar el campo de código regulatorio según el estado del checkbox
  chkRegulatorio.addEventListener("change", (e) => {
    if (chkRegulatorio.checked) {
      containerInput.classList.remove("d-none");
      containerInput.classList.add("d-block");
      textboxregulatorio.hidden = false;

      inputRegulatorio.focus();
    } else {
      textboxregulatorio.hidden = true;

      containerInput.classList.add("d-none");
      containerInput.classList.remove("d-block");
      inputRegulatorio.value = ""; // Limpiamos el dato al desmarcar
    }
  });

  // Evento para actualizar el código regulatorio en la vista previa de la etiqueta
  inputRegulatorio.addEventListener("input", (e) => {
    viewRegEtiqueta.textContent = e.target.value.toUpperCase() || "--";
  });

  // Evento para buscar información del componente al presionar Enter en el campo de ID Componente
  inputidcomponente.addEventListener("keydown", async function (event) {
    if (event.key === "Enter") {
      searchTerm = inputidcomponente.value;
      if (!searchTerm) {
        Toast.fire({
          icon: "warning",
          title: "Por favor, ingrese un ID de componente para buscar.",
        });
        return;
      }
      const validarinputidcomponente = General.verificacion_numerica_entero(
        searchTerm,
        "El ID Componente",
      );
      if (
      validarinputidcomponente.error
    ) {

      const validations = [validarinputidcomponente];
      const failedValidation = validations.find((val) => val.error);
      Toast.fire({
        icon: failedValidation.icon,
        title: failedValidation.message,
      });
      return;
    } 

    await llenado_informacion_por_idcomponente(searchTerm);

    }
  });



  // Evento para limpiar el modal al hacer clic en "Nuevo"
  btnNuevo.addEventListener("click", () => {
    limpiarmodalQR();
  });
  // Evento para generar el código QR al hacer clic en el botón "Generar QR"
  btnGenerarQR.addEventListener("click", () => {
    if (!estadoFormulario.CodigoTI) {
      Toast.fire({
        icon: "warning",
        title: "Por favor, seleccione un componente para generar la etiqueta.",
      });

      return;
    }

    const codigoTI = document.getElementById("view_codigo_ti").textContent;
    estadoFormulario.CodigoTI = codigoTI; // Guardar el código TI en el estado del formulario

    // Limpiar QR anterior
    imgQR.src = "";

    QRCode.toDataURL(
      estadoFormulario.CodigoTI,
      { width: 150 },
      function (err, url) {
        imgQR.src = url;
        // Habilitamos el botón de imprimir una vez generado

        btnImprimirEtiqueta.disabled = false;
        btnImprimirEtiqueta.className = "btn btn-success";
        document.getElementById("view_codigo_ti_etiqueta").textContent =
          estadoFormulario.CodigoTI;
        if (chkRegulatorio.checked == true) {
          document.getElementById(
            "view_codigo_regulatorio_etiqueta",
          ).textContent = inputRegulatorio.value;
          estadoFormulario.codigoregulatorio = inputRegulatorio.value;
        }
      },
    );
  });

  btnImprimirEtiqueta.addEventListener("click", async () => {
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

      estadoFormulario.codigoregulatorio = inputRegulatorio.value;
      await imprimirEtiquetaRegulatorio(
        estadoFormulario.CodigoTI,
        estadoFormulario.codigoregulatorio,
        qrYaGenerado,
      );
    } else {
      if (
        view_codigo_ti_etiqueta.textContent == "--" ||
        view_codigo_ti_etiqueta.textContent == "" ||
        view_codigo_ti_etiqueta.textContent == null
      ) {
        Toast.fire({
          icon: "warning",
          title: "Generar el Código QR para imprimir la etiqueta",
        });
        return;
      }

      await imprimirEtiquetaSimple(estadoFormulario.CodigoTI, qrYaGenerado);
    }
    limpiarmodalQR();
  });

  //*////////////////////////////////////////////////////////////////////////////////////////////////////////////*

  //*FUNCIONES PARA ASIGNACION DE CAMPOS

  //*//////////////////////////////////////////////////////////////////////////////////////////////////////////*/

  function asignacionVariablesComponentes(data) {
    estadoFormulario.id_componente = data.id_componente;
    estadoFormulario.IdUnidadValue = data.id_unidad;
    estadoFormulario.nombre_responsable = data.nombre_responsable;
    estadoFormulario.nombre_unidad = data.nombre_unidad;
    estadoFormulario.Nombre_Area = data.area;
    estadoFormulario.operacion = data.operacion;
    estadoFormulario.Dispositivo = data.tipo_equipo;
    estadoFormulario.marca = data.marca;
    estadoFormulario.modelo = data.modelo;
    estadoFormulario.Nombre_Catalogo = data.nombre_catalogo;
    estadoFormulario.NumeroSerie = data.numero_serie;
    estadoFormulario.CodigoTI = data.codigo_TI;
    estadoFormulario.Observaciones = data.observaciones;
    estadoFormulario.EstatusComponente = data.status_componente;
    estadoFormulario.EstatusInventario = data.status_inventario;
    estadoFormulario.contratoid = data.num_contrato_actual;
    /*
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
        }*/
    inputidcomponente.value = estadoFormulario.id_componente;
    view_codigo_ti.textContent = estadoFormulario.CodigoTI;
    view_numero_serie.textContent = estadoFormulario.NumeroSerie;
    view_dispositivo.textContent = estadoFormulario.Dispositivo;
    view_marca.textContent = estadoFormulario.marca;
    view_modelo.textContent = estadoFormulario.modelo;

    //despues de asignar los valores a las variables globales, se asignan a los campos del formulario
    inputidcomponente.disabled = true;
  }

  //*////////////////////////////////////////////////////////////////////////////////////////////////////////////*

  //*FUNCIONES ADICIONALES

  //*//////////////////////////////////////////////////////////////////////////////////////////////////////////*/

  function limpiarmodalQR()  {
    inputidcomponente.value = "";
    view_codigo_ti.textContent = "--";
    view_numero_serie.textContent = "--";
    view_dispositivo.textContent = "--";
    view_marca.textContent = "--";
    view_modelo.textContent = "--";
    chkRegulatorio.checked = false;
    textboxregulatorio.hidden = true;
    imgQR.src = "/resources/exampleQR.png";
    btnImprimirEtiqueta.disabled = true;
    textboxregulatorio.hidden = true;

    inputRegulatorio.value = ""; // Limpiamos el dato al desmarcar
    textboxregulatorio.hidden = true;
    containerInput.classList.add("d-none");
    containerInput.classList.remove("d-block");
    inputRegulatorio.value = ""; // Limpiamos el dato al desmarcar
    document.getElementById("view_codigo_regulatorio_etiqueta").textContent =
      "--";
    document.getElementById("view_codigo_ti_etiqueta").textContent = "--";
    inputidcomponente.disabled = false;
  }

 async function llenado_informacion_por_idcomponente(searchTerm)  {
    const config = {
        url: `${api}/api/componentes/ConsultarIdComponente/${searchTerm}`, // URL específica
        timeoutDuration: 5000,
        // data: {} //  no se pasa si no hay query params
      };
      const response = await handleGET(config);

      const data = response.data.body[0];
      
      asignacionVariablesComponentes(data);
    };
});


