import {
  General,
  handlePOST,
  handleDataTableLoadingGET,
  URLAPI,
  ConfigTable,
  handleGETSinProgressBar,
  handlePUT,
  handleGET,
  obtenerUsuarioLocalStorage,
} from "../Utils.js"; // Importa tus utilidades

import {
  BuscadorGenericoSelectFiltro,
  SelectLoader,
  ocultarElementos,
  mostrarElementos,
  inicializarDataTableUnidades,
  clsFuncionesModales,
} from "../UtilsFuncionesModales.js";

const api = URLAPI;

// PARA ALERTAS TOAST SWEETALERT2
const Toast = Swal.mixin({
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

const StatePanelResponsable = {
  //VARIABLES DE CONTROL
  IdUnidadNombreUnidad: null,
  accion_update_insert: null,
  BanderaAutorizacionInsercion: 0,
  id_responsable: null,
  nombre_responsable: null,
  EsDispositivoMovil: null,
  login: null,
  password: null,
  password_confirm: null,
  cargo: null,
  estado_responsable: null,
  //AREAS
  IdArea: null,
  Nombre_Area: null,
  //UNIDADES
  IdUnidadValue: null,
  contratoid: null,
  operacion: null,
  tipo_unidad: null,
  Estado: null,
  nombre_unidad: null,
  AbrevEstado: null,
};
document.addEventListener("DOMContentLoaded", async () => {
  var table;
  // Variable global para la tabla
  var searchTerm = "";
  let visibleState = false; // Declarada aquí para manejar el estado de las columnas
  let urlEdit;
  // Variable para checkbox cambiar contraseña
  let isChecked = false;
  //PARA LISTA DESPLEGABLE
  const loader = new SelectLoader();
  const btnmaximizarColumnas = document.getElementById(
    "btnMaximizartblResponsable",
  ); //toggleColumns
  const btnBuscarResponsable = document.getElementById("btnBuscarResponsable"); //BOTON BUSCAR RESPONSABLE
  const btnAbriragregarResponsable = document.getElementById(
    "btnAbriragregarResponsable",
  ); //BOTON ABRIR MODAL BOTON AGREGAR catalogo
  const inputBusquedaresponsable = document.getElementById(
    "inputBusquedaresponsable",
  ); //INPUT PERMITE INTRODUCIR BUSQUEDA
  const btnAbrirEditarResponsable = document.getElementById(
    "btnAbrirEditarResponsable",
  ); //BOTON ABRIR MODAL VISUALIZAR RESPONSABLE
  const btnVisualizarResponsable = document.getElementById(
    "btnVisualizarResponsable",
  );
  const inputUnidadPanel = document.getElementById("inputUnidadPanel");
  const selectAreaPanel = document.getElementById("selectAreaPanel");

  //DETECTAR SI ES DISPOSITIVO MOVIL
  StatePanelResponsable.EsDispositivoMovil = General.esDispositivoMovil();

  //INICIALIZAR MODAL
  const modalTitle = document.getElementById("upsertCatalogoModalLabel");
  const btonupsertcatalogo = document.getElementById("btonupsertcatalogo"); //BOTON SAVE TECNICO MODAL
  const btoncloseupsertCatalogomodal = document.getElementById(
    "btoncloseupsertCatalogomodal",
  );

  //*modal UPSERT CATALOGO
  const ModalupsertResponsableModal = document.getElementById(
    "upsertResponsableModal",
  ); //INICIALIZAR MODAL
  const upsertResponsableModal = new bootstrap.Modal(
    ModalupsertResponsableModal,
    {
      keyboard: false, // Deshabilita el cierre con ESC
    },
  ); //INICIALIZAR MODAL
  const btonupsertResponsable = document.getElementById(
    "btonupsertResponsable",
  ); //BOTON SAVE TECNICO MODAL
  const btoncloseupsertResponsablemodal = document.getElementById(
    "btoncloseupsertResponsablemodal",
  );
  //*modal DETALLE CATALOGO
  const ModalResponsable_Detalle = document.getElementById(
    "detalleResponsableModal",
  ); //INICIALIZAR MODAL
  const DetalleResponsableModal = new bootstrap.Modal(
    ModalResponsable_Detalle,
  );

  //*VARIABLES MODAL EDITAR CATALOGO
  const inputidResponsable = document.getElementById("inputidResponsable");
  const inputNombreResponsable = document.getElementById(
    "inputNombreResponsable",
  );
  const inputUsuario = document.getElementById("inputUsuario");
  const selectCargo = document.getElementById("selectCargo");
  const inputUnidad = document.getElementById("inputUnidad");
  const inputArea = document.getElementById("inputArea");

  const divcambiarpassword = document.getElementById("divcambiarpassword");
  const divcontraseña = document.getElementById("divcontraseña");

  //LOCALSTORAGE NOMBRE DE USUARIO EN PERFIL
  obtenerUsuarioLocalStorage();

  inputUnidadPanel.placeholder = StatePanelResponsable.EsDispositivoMovil
    ? "👉 Toca para seleccionar unidad"
    : "👉 Pulsa F1 para buscar";
  //INICIALIZAR TABLA RESPONSABLES
  inicializarDataTableResponsable("", "");

  //* /////////////////////////////////////////////////////////////////////////////////////////////
  //*INICIALIZAR TABLA RESPONSABLES

  //* /////////////////////////////////////////////////////////////////////////////////////////////
  //*funcion PARA INICIALIZAR LA TBLA AL CARGAR
  async function inicializarDataTableResponsable(searchTerm, id_unidad) {
    var url;

    if (searchTerm == "") {
      url = `${api}/api/responsables/consultaResponsablesGlobalPorUnidad`;
    } else {
      url = `${api}/api/Responsables/consulta_Por_ResponsableGlobalPorUnidad`;
    }

    let selectedRow = null;
    let selectedId = null;
    const configBase = {
      columns: [
        {
          data: "id_responsable",
        },
        { data: "nombre_responsable" },
        { data: "login" },
        { data: "cargo" },
        { data: "nombre_unidad" },
        { data: "area" },
        { data: "estado_responsable" },
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

    if (!searchTerm && !id_unidad) {
      // Tabla vacía sin AJAX
      table = $("#table_Responsable").DataTable({
        ...configBase,
        data: [],
      });
    } else {
      handleDataTableLoadingGET({
        url: url,
        data: { id_unidad: id_unidad, searchTerm: searchTerm },
        timeoutDuration: 60000,
      }).then((data) => {
        console.log("data", data);
        if (data && Array.isArray(data) && data.length > 0) {
          // Verificación de éxito
          // ASIGNAR LA INSTANCIA DE LA TABLA CREADA A LA VARIABLE 'table'
          table = $("#table_Responsable").DataTable({
            ...configBase,
            data: data,
          });

          table.on("click", "tr", function () {
            var rowData = table.row(this).data();

            // 1. Obtener datos y asignar ID
            if (rowData && rowData.id_responsable) {
              StatePanelResponsable.id_responsable = rowData.id_responsable;

              // 2. Deseleccionar la fila anterior si existe
              if (selectedRow) {
                // Elimina tu clase y la clase activa de Bootstrap
                selectedRow.removeClass("selected-row table-active");
                selectedRow.find("td").removeClass("selected-cell");
              }

              // 3. Establecer la nueva fila como seleccionada
              const newSelectedRow = $(this);

              // Agrega tu clase y la clase activa de Bootstrap para el color
              newSelectedRow.addClass("selected-row table-active");
              newSelectedRow.find("td").addClass("selected-cell");

              // 4. Actualizar la variable de estado
              selectedRow = newSelectedRow;
              selectedId = rowData.id_responsable;
            }
          });

          //*OCULTAR COLUMNAS AL INICIAR
          ConfigTable.ocultarColumnas(table, [2, 3, 6]);
          //Establece el estado inicial después de ocultarlas
          visibleState = false;
        } else {
          Toast.fire({
            icon: "warning",
            title: "No se encontraron resultados.",
          });
        }

        return {
          table,
          selectedId,
          selectedRow,
        };
      });
    }
  }

  //*PERMITE REALIZAR LA BUSQUEDA DE ALGUN USUARIO
  function BuscarResponsble() {
    let searchTerm = inputBusquedaresponsable.value;
    if (searchTerm && StatePanelResponsable.IdUnidadValue) {
      inicializarDataTableResponsable(
        searchTerm,
        StatePanelResponsable.IdUnidadValue,
      );
    } else if (!StatePanelResponsable.IdUnidadValue) {
      Toast.fire({
        icon: "warning",
        title: "Seleccione una unidad para realizar la busqueda.",
      });
    } else {
      inicializarDataTableResponsable(
        ((searchTerm = ""), StatePanelResponsable.IdUnidadValue),
      );
    }
  }
  if (btnBuscarResponsable) {
    btnBuscarResponsable.addEventListener("click", BuscarResponsble);
  }
  //*EVENTO PARA REALIZAR BUSQUEDA  DE ALGUN USUARIO POR MEDIO DE LA TECLA ENTER
  if (inputBusquedaresponsable) {
    inputBusquedaresponsable.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        BuscarResponsble();
      }
    });
  }

  //*PERMITE HACER EL MECANISMO OCULTAR/MAXIMIZAR CAMBIA EL ESTADO DE VISIBLE / NO VISIBLE
  const setVisibleState = (newValue) => {
    visibleState = newValue; // Actualiza la variable
  };

  //*PERMITE MAXIMIZAR LAS COLUMNAS
  if (btnmaximizarColumnas) {
    btnmaximizarColumnas.addEventListener("click", () => {
      // Llama al método con los parámetros correctos
      ConfigTable.maximizarColumnas(
        table, // Instancia de la tabla
        visibleState, // Estado actual (boolean dinámico)
        setVisibleState, // Función callback para actualizar el estado
        [2, 3, 6], // Columnas a alternar
      );
    });
  }

  //* /////////////////////////////////////////////////////////////////////////////////////////////
  //* INTERACCION DE MODALES
  //* /////////////////////////////////////////////////////////////////////////////////////////////

  //* Evento para abrir modal unidades
  // Evento teclado para abrir modal unidades
  inputUnidadPanel.addEventListener("keydown", function (event) {
    if (event.key === "F1" || event.key === "F2") {
      event.preventDefault();
      document.getElementById("inputBusqueda").value = "";
      $("#consultaUnidadesModal").modal("show");
      inicializarDataTableUnidades("");
    }
  });

  // Evento touch para abrir modal unidades
  inputUnidadPanel.addEventListener("click", async function (event) {
    if (StatePanelResponsable.EsDispositivoMovil == true) {
      event.preventDefault();
      document.getElementById("inputBusqueda").value = "";
      $("#consultaUnidadesModal").modal("show");
      inicializarDataTableUnidades("");
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
        const EleccionUnidad =
          await clsFuncionesModales.BuscarUnidad(searchTerm);
        //asignacion a variables globales del array
        asignacionVariablesUnidades(EleccionUnidad);
      }
    });
  }

  //*EVENTO ABRIR MODAL AGREGAR RESPONSABLE
  btnAbriragregarResponsable.addEventListener("click", async () => {
    //asignar datos de inicio al abrir el modal
    upsertResponsableModalLabel.textContent = "Agregar Responsable";
    inputidResponsable.value = "*";
    btonupsertResponsable.textContent = "Registrar";

    //asignar valores a estado global
    StatePanelResponsable.accion_update_insert = "INSERT";
    //mostrar solo los campos necesarios para el insert y desabilitar
    inputUsuario.disabled = false;
    ocultarElementos(["#colrow3"]);
    mostrarElementos(["#colrow4"]);
    colrow3.style.display = "none";
    document.getElementById("lblcontraseña").textContent = "Contraseña";

    //abrir modal
    upsertResponsableModal.show();
  });

  //*EVENTO ABRIR MODAL Actualizar RESPONSABLE
  btnAbrirEditarResponsable.addEventListener("click", async () => {
    if (!StatePanelResponsable.id_responsable) {
      Toast.fire({
        icon: "warning",
        title: "No se ha seleccionado un responsable.",
      });
      return;
    }
    upsertResponsableModalLabel.textContent = "Editar Responsable";
    btonupsertResponsable.textContent = "Actualizar";

    //asignar valores a estado global
    StatePanelResponsable.accion_update_insert = "UPDATE";
    colrow4.style.display = "none";
    colrow3.style.display = "block";
    inputUsuario.disabled = true;
    document.getElementById("lblcontraseña").innerText = "Nueva contraseña";

    //CONSULTA DE DATOS PARA LLENAR EL MODAL

    const config = {
      url: `${api}/api/responsables/ConsultaResponsablePorIdResponsable`, // Asegúrate de que 'api' esté definida
      data: { id_responsable: StatePanelResponsable.id_responsable },
    };

    try {
      const response = await handleGETSinProgressBar(config);

      if (!response || !response.data) {
        console.warn(
          "Respuesta inválida de handleGET: response o response.data es null/undefined",
        );
        return;
      }

      const data = response.data.body[0];

      ModalupsertResponsableModal.removeAttribute("inert");

      $("#upsertResponsableModal").off("shown.bs.modal"); // Limpiar eventos previos

      $("#upsertResponsableModal").on("shown.bs.modal", async function () {
        StatePanelResponsable.IdUnidadValue = data.FK_idunidad;
        StatePanelResponsable.IdArea = data.FK_id_area;
        StatePanelResponsable.tipo_unidad = data.tipo_unidad;
        StatePanelResponsable.nombre_responsable = data.nombre_responsable;
        StatePanelResponsable.login = data.login;
        StatePanelResponsable.cargo = data.cargo;
        StatePanelResponsable.estado_responsable = data.estado_responsable;

        // Asignaciones a inputs
        inputidResponsable.value = data.id_responsable;
        inputNombreResponsable.value = StatePanelResponsable.nombre_responsable;
        inputUsuario.value = StatePanelResponsable.login;
        inputUnidad.value = data.nombre_unidad;
        selectCargo.value = StatePanelResponsable.cargo;

        selectStatusResponsable.value =
          StatePanelResponsable.estado_responsable;
        // Carga las opciones y asigna selectArea.value en el callback onLoaded
        const loader = new SelectLoader();

        await loader.cargarOpciones(
          {
            endpoint: `${api}/api/areas/ConsultaAreaPorTipoUnidad`,
            selectId: "selectArea",
            renderOption: (i) => ({ value: i.id_area, text: i.area }),
            getExtraParams: () => ({
              TipoUnidad: StatePanelResponsable.tipo_unidad,
              searchTerm: "",
            }),
          },
          true,
        );

        //.PARA SELECCIONAR EL AREA CORRESPONDIENTE AL RESPONSABLE,
        let selectArea = document.getElementById("selectArea");
        selectArea.value = StatePanelResponsable.IdArea;

        // Evento para capturar el cambio en el select de área y actualizar el estado global
        selectArea.addEventListener("change", (e) => {
          const seleccionado = e.target.options[e.target.selectedIndex];

          if (e.target.value !== "") {
            // Capturamos el ID
            StatePanelResponsable.IdArea = e.target.value;

            // Capturamos el Texto
            StatePanelResponsable.Nombre_Area = seleccionado.text;
          } else {
            // Reset
            StatePanelResponsable.IdArea = null;
            StatePanelResponsable.Nombre_Area = "";
          }
        });
      });

      upsertResponsableModal.show();

      // Asignación de datos (descomentado y movido aquí para ejecutarse solo si hay data)
    } catch (error) {
      console.error("Error en la petición GET:", error); // Log del error en catch
      Toast.fire({
        icon: "error",
        title: "Error al consultar el técnico. Revisa la consola.",
      });
    }
  });

  //*PERMITE DEICIDIR SI QUIERE CAMBIAR LA CONTRASEÑA
  $("#checkCambiarPassword").on("change", function () {
    isChecked = $(this).is(":checked");

    ocultarDesSesionPassword(isChecked);
  });

  //* /////////////////////////////////////////////////////////////////////////////////////////////
  //EVENTO PARA MODALES SELECTOR
  //* /////////////////////////////////////////////////////////////////////////////////////////////
  // Configuración para cada campo buscable
  let elementosInsert = [
    "#colrow1",
    "#colrow2",
    "#colrow4",
    "#colrow5",
    "#colrow6",
    "#colrow7",
  ];
  let elementosUpdate = [
    "#colrow1",
    "#colrow2",
    "#colrow3",
    "#colrow5",
    "#colrow6",
    "#colrow7",
  ];
  const configBuscador = {
    unidad: {
      nombre: "de la unidad",
      inputVisual: document.getElementById("inputUnidad"),
      btnAbrir: document.getElementById("btnAbrirBuscadorUnidad"),
      endpoint: `${api}/api/unidades/ConsultaPorUnidadBusqueda`,
      onOpen: () => {
        // Decidimos qué lista usar según la acción actual
        const listaOcultar =
          StatePanelResponsable.accion_update_insert === "UPDATE"
            ? elementosInsert
            : elementosUpdate;

        // Pasamos la lista elegida a la función
        buscador.ocultarElementos(listaOcultar);

        // Ocultamos el botón de registro
        document.getElementById("btonupsertResponsable").style.display = "none";
      },
      onClose: () => {
        // Decidimos qué lista usar según la acción actual
        const mostrar =
          StatePanelResponsable.accion_update_insert === "UPDATE"
            ? elementosUpdate
            : elementosInsert;

        // Pasamos la lista elegida a la función
        buscador.mostrarElementos(mostrar);

        // Ocultamos el botón de registro
        document.getElementById("btonupsertResponsable").style.display = "";
      },
      placeholder: "Busca una unidad...",
      renderLabel: (item) => {
        if (item.Estado === "GUANAJUATO") {
          StatePanelResponsable.contratoid = item.num_contrato_actual;
          StatePanelResponsable.IdUnidadNombreUnidad =
            General.concatenar_contrato_unidad(
              item.id_unidad,
              item.num_contrato_actual,
            );
        } else {
          StatePanelResponsable.contratoid = "0";
          StatePanelResponsable.IdUnidadNombreUnidad =
            General.concatenar_contrato_unidad(
              item.id_unidad,
              item.num_contrato_actual,
            );
        }
        return `${StatePanelResponsable.IdUnidadNombreUnidad} - ${item.nombre_unidad}`;
      },

      onSelect: (item) => {
        StatePanelResponsable.IdUnidadValue = item.id_unidad.toString();

        StatePanelResponsable.contratoid = item.num_contrato_actual;
        StatePanelResponsable.operacion = item.Estado;
        StatePanelResponsable.tipo_unidad = item.tipo_unidad;
        StatePanelResponsable.Estado = item.Estado;
        StatePanelResponsable.nombre_unidad = item.nombre_unidad;
        StatePanelResponsable.AbrevEstado = item.abreviatura_estado;
        //inputnombrecatalogo.disabled = false;
        //ASIGNACION DE VALOR A INPUT
        inputUnidad.value =
          StatePanelResponsable.IdUnidadNombreUnidad.toString() +
          "-" +
          StatePanelResponsable.nombre_unidad.toString();
      },
      onVisibility: async (selectedItem) => {
        //  Llena las listas desplegables del modal responsable
        // Carga las opciones y asigna selectArea.value en el callback onLoaded
        const loader = new SelectLoader();

        loader.cargarOpciones(
          {
            endpoint: `${api}/api/areas/ConsultaAreaPorTipoUnidad`,
            selectId: "selectArea",
            renderOption: (i) => ({ value: i.id_area, text: i.area }),
            getExtraParams: () => ({
              TipoUnidad: StatePanelResponsable.tipo_unidad,
              searchTerm: "",
            }),
          },
          true,
        );
      },
    },
  };

  const elementosDOM = {
    vistaBuscador: document.getElementById("vistaBuscador"),
    inputBusqueda: document.getElementById("inputBusquedaInterna"),
    btnFiltro: document.getElementById("btnEjecutarFiltro"),
    listaResultados: document.getElementById("listaResultados"),
    btnCancelar: document.getElementById("btnCancelarBusqueda"),
  };

  // Instancia e inicialización
  const buscador = new BuscadorGenericoSelectFiltro(
    configBuscador,
    elementosDOM,
  );
  buscador.inicializar();

  // Función para manejar la búsqueda (reutiliza config)
  async function manejarBusqueda() {
    const items = await buscador.buscar();
    buscador.listaResultados.innerHTML = "";
    if (items.length === 0) {
      buscador.listaResultados.innerHTML =
        '<div class="text-center p-3 text-muted">No se encontraron resultados</div>';
      return;
    }

    const config = buscador.configBuscador[buscador.campoActual];

    items.forEach((item) => {
      const li = document.createElement("li");
      li.className = "list-group-item list-group-item-action";
      li.textContent = config.renderLabel(item);

      li.onclick = () => {
        const selectedItem = buscador.seleccionarItem(item);

        // Reutiliza onSelect
        config.onSelect(selectedItem);

        // Reutiliza onVisibility (diferencia por campo automáticamente)
        if (config.onVisibility) {
          config.onVisibility(selectedItem);
        }
      };

      buscador.listaResultados.appendChild(li);
    });
  }

  // Asigna evento
  buscador.btnFiltro.onclick = manejarBusqueda;
  buscador.inputBusqueda.onkeyup = (e) => {
    if (e.key === "Enter") manejarBusqueda();
  };

  //* /////////////////////////////////////////////////////////////////////////////////////////////
  //*FUNCIONES ADICIONALES RESPONSABLES
  //* /////////////////////////////////////////////////////////////////////////////////////////////

  async function asignacionVariablesUnidades(data) {
    try {
      StatePanelResponsable.IdUnidadValue = data.id_unidad;
      StatePanelResponsable.contratoid = data.num_contrato_actual;
      StatePanelResponsable.operacion = data.Estado;
      StatePanelResponsable.Estado = data.Estado;
      StatePanelResponsable.nombre_unidad = data.nombre_unidad;
      StatePanelResponsable.tipo_unidad = data.tipo_unidad;
      StatePanelResponsable.AbrevEstado = data.abreviatura_estado;
      if (StatePanelResponsable.operacion === "GUANAJUATO") {
        inputUnidadPanel.value = General.concatenar_contrato_unidad(
          StatePanelResponsable.IdUnidadValue,
          StatePanelResponsable.contratoid,
        );
      } else {
        StatePanelResponsable.contratoid = "0";
        inputUnidadPanel.value = General.concatenar_contrato_unidad(
          StatePanelResponsable.IdUnidadValue,
          StatePanelResponsable.contratoid,
        );
      }
      // Agregar el nombre de la unidad al final del valor del input
      inputUnidadPanel.value =
        inputUnidadPanel.value + "-" + data.nombre_unidad;

      await inicializarDataTableResponsable(
        "",
        StatePanelResponsable.IdUnidadValue,
      );
    } catch (error) {
      console.error("Error al asignar variables de unidad:", error);
    }
  }

  //*FUNCION QUE VALIDA CAMPOS MODAL RESPONSABLE
  function ValidarCamposResponsables(
    inputNombreResponsable,
    inputUsuario,
    inputpassword,
    inputpasswordrepetir,
    inputUnidad,
    selectCargo,
    selectArea,
    selectStatusResponsable,
  ) {
    const validarinputnombreResponsable = General.validar_Campos_String(
      inputNombreResponsable,
      "El nombre",
    );
    const validarinputusuarioResponsable = General.username(inputUsuario);
    const validarinputpassword = General.password(inputpassword);
    const validarinputpasswordrepetir = General.validar_Campos_String(
      inputpasswordrepetir,
      "La contraseña",
    );
    const validarinputUnidad = General.validar_Campos_String(
      inputUnidad,
      "La unidad",
    );
    const validarselectcargo = General.validar_Campos_Select(
      selectCargo,
      "un cargo",
    );
    const validarselectArea = General.validar_Campos_Select(
      selectArea,
      "una área",
    );
    const validarselectStatusResponsable = General.validar_Campos_Select(
      selectStatusResponsable,
      "un estatus",
    );

    if (
      validarinputnombreResponsable.error ||
      validarinputusuarioResponsable.error ||
      validarinputpassword.error ||
      validarinputpasswordrepetir.error ||
      validarinputUnidad.error ||
      validarselectcargo.error ||
      validarselectArea.error ||
      validarselectStatusResponsable.error
    ) {
      // Array de todas las validaciones para iterar
      const validations = [
        validarinputnombreResponsable,
        validarinputusuarioResponsable,
        validarinputpassword,
        validarinputpasswordrepetir,
        validarinputUnidad,
        validarselectcargo,
        validarselectArea,
        validarselectStatusResponsable,
      ];

      // Encontrar la primera validación que falló
      const failedValidation = validations.find((val) => val.error);

      Toast.fire({
        icon: failedValidation.icon,
        title: failedValidation.message,
      });

      return true;
    }
    return false;
  }

  //*PERMITE OCULTAR O MOSTRAR LA SECCION DE CAMBIO DE CONTRASEÑA
  function ocultarDesSesionPassword(isChecked) {
    const $passFields = $("#colrow4 input");
    if (isChecked) {
      console.log("isChecked", isChecked);
      $("#colrow4").slideDown(); // Muestra con animación
      $passFields.attr("required", true); // Hace los campos obligatorios
    } else {
      console.log("isChecked CAN", isChecked);
      $("#colrow4").slideUp(); // Oculta con animación
      $passFields.attr("required", false); // Quita el atributo requerido
      $passFields.val(""); // Opcional: Limpia los valores al ocultar
    }
  }

  //*FUNCION PARA INICIALIZAR MODAL INSERT/UPDATE CATALOGO COMPONENTE
  function inicializarmodalUpsertResponsable() {
    // Reset nativo del formulario (esto limpia TODO de golpe)
    const formulario = document.getElementById("formularioupsertResponsable");
    if (formulario) {
      formulario.reset();
    }

    selectArea.innerHTML = "";
    General.limpiarSelectDinamico("selectArea");
    colrow4.style.display = "none";
    document.getElementById("vistaBuscador").style.display = "none";
    StatePanelResponsable.id_responsable=null;
    $("#upsertResponsableModal").off("shown.bs.modal");

    upsertResponsableModal.hide();
  }
  //*////////////////////////////////////////////////////////////////////////////////////////////////////////////*

  //*BOTONES MODAL INSERT/UPDATE CATALOGO COMPONENTE

  //*//////////////////////////////////////////////////////////////////////////////////////////////////////////*/
  //*BOTON GUARDAR MODAL INSERT/UPDATE RESPONSABLE
  btonupsertResponsable.addEventListener("click", async function () {
    if (isChecked === false) {
      inputpassword.value = "NoCambiarPassword1234*";
      inputpasswordrepetir.value = "NoCambiarPassword1234*";
    }
    //VALIDAR CAMPOS MODAL INSERT/UPDATE CATALOGO COMPONENTE
    const hayErrores = ValidarCamposResponsables(
      inputNombreResponsable.value,
      inputUsuario.value,
      inputpassword.value,
      inputpasswordrepetir.value,
      inputUnidad.value,
      selectCargo.value,
      selectArea.value,
      selectStatusResponsable.value,
    );

    if (hayErrores == false) {
      const Dataresponsable = {
        nombre_responsable: inputNombreResponsable.value,
        login: inputUsuario.value,
        password: inputpassword.value,
        Passwordrepetir: inputpasswordrepetir.value,
        cargo: selectCargo.value,
        FK_idunidad: StatePanelResponsable.IdUnidadValue,
        estado_responsable: selectStatusResponsable.value,
        FK_id_area: StatePanelResponsable.IdArea,
      };
      if (Dataresponsable.password != Dataresponsable.Passwordrepetir) {
        Toast.fire({
          icon: "warning",
          title: "La contraseña no coincide",
        });
        return;
      }
      if (StatePanelResponsable.accion_update_insert == "INSERT") {
        //INSERTAR RESPONSABLE
        const config = {
          url: `${api}/api/responsables/AgregarResponsable`,
          data: Dataresponsable,
          successTitle: "Responsable agregado exitosamente",
        };
        const response = await handlePOST(config);

        Swal.fire({
          icon: response.data.icon || "success",
          title: response.data.tittle,
          text: response.data.message,
          showConfirmButton: false,
          timer: 2000, // Cierra automáticamente después de 2 segundos (1000 ms)
        });

        if (response.data.error === false) {
          setTimeout(() => {
            //upsertResponsableModal.hide();
            //al recargar tabla limpiar campos

            inputBusquedaInterna.value = "";
            selectArea.innerHTML = "";
            General.limpiarSelectDinamico("selectArea");
            visibleState = false;
            inicializarmodalUpsertResponsable();
          }, 2000);
        }
      } else if (StatePanelResponsable.accion_update_insert == "UPDATE") {
        const id_responsable =
          document.getElementById("inputidResponsable").value;
        let capturapassword;

        //CAMBIO DE CONTRASEÑA
        if (isChecked == true) {
          if (
            inputpassword.value != inputpasswordrepetir.value &&
            inputpassword.value != "" &&
            inputpasswordrepetir.value != ""
          ) {
            Toast.fire({
              icon: "warning",
              title: "La contraseña no coincide o esta vacía",
            });
            return;
          }

          capturapassword = inputpassword.value;
          urlEdit = `${api}/api/responsables/EditarResponsablePorIDConPassword`;
        } else {
          capturapassword = "12345";
          console.log("isChecked false no cambiemos contraseña", isChecked);
          urlEdit = `${api}/api/responsables/EditarResponsablePorIDSinPassword`;
        }

        //ASIGNACION A ARRAY
        const Dataresponsable = {
          nombre_responsable: inputNombreResponsable.value,
          login: inputUsuario.value,
          password: inputpassword.value,
          Passwordrepetir: inputpasswordrepetir.value,
          cargo: selectCargo.value,
          FK_idunidad: StatePanelResponsable.IdUnidadValue,
          estado_responsable: selectStatusResponsable.value,
          FK_id_area: StatePanelResponsable.IdArea,
        };
        try {
          const config = {
            url: urlEdit,
            id: StatePanelResponsable.id_responsable,
            data: Dataresponsable,
            successTitle: `¡Exito!`,
            successMessage: `El responsable ${Dataresponsable.nombre_responsable} ha sido modificado correctamente.`,
          };

          const response = await handlePUT(config);
          console.log("response", response);

          if (response.error === false && response.status == 200) {
            setTimeout(() => {
              isChecked = false;
              inputBusquedaInterna.value = "";
              selectArea.innerHTML = "";
              General.limpiarSelectDinamico("selectArea");
              visibleState = false;
              inicializarDataTableResponsable("", "");
              inputUnidadPanel.value = "";
              inputBusquedaresponsable.value = "";
              inicializarmodalUpsertResponsable();
            }, 2000);
          }
        } catch (error) {
          console.error("Error en la petición PUT:", error); // Log del error en catch
        }
      }
    } else {
      return;
    }
  });

    //*BOTON CONSULTA(DETALLE) MODAL AGREGAR TECNICO
    btnVisualizarResponsable.addEventListener("click", async function () {
      if (
        typeof StatePanelResponsable.id_responsable !== "number" ||
        StatePanelResponsable.id_responsable <= 0
      ) {
        Toast.fire({
          icon: "warning",
          title: "ID  inválido ",
        });
        return;
      }
  
      const config = {
        url: `${api}/api/responsables/ConsultaResponsablePorIdResponsable`, // URL específica
        timeoutDuration: 5000, // Opcional: ajusta el timeout si es necesario
        data: { id_responsable: StatePanelResponsable.id_responsable },
      };
  
      const response = await handleGET(config);
  
      const bodyData = response.data.body;
      const dataResponsable =
        Array.isArray(bodyData) && bodyData.length > 0 ? bodyData[0] : null;
      // Verifica que el cuerpo de la respuesta contenga datos
      if (dataResponsable) {
        // Limpiar contenido previo
        const listGroup = document.querySelector(
          "#detalleResponsableContenido .list-group",
        );
        listGroup.innerHTML = "";
  
        // Agregar información al modal
        listGroup.innerHTML = `
              <div class="card-detalle-custom shadow-sm">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                      <span class="badge bg-primary">ID: ${dataResponsable.id_responsable|| "---"}</span>
                      <span class="badge ${dataResponsable.estado_responsable === "ACTIVO" ? "bg-success" : "bg-danger"}">
                      ${dataResponsable.estado_responsable === "ACTIVO" ? "ACTIVO" : "CANCELADO"}
                  </span>
                  </div>
                  <h5 class="fw-semibold text-dark mb-1">${dataResponsable.nombre_responsable}</h5>
                  <div class="text-muted small">
                   <i class="fa fa-user" aria-hidden="true"></i> ${dataResponsable.nombre_unidad}
                   <i class="fa fa-building" aria-hidden="true"></i> ${dataResponsable.area}
              </div>
            <div class="info-grid">
              <div class="info-item">
                  <span class="info-label">Usuario</span>
                  <span class="info-value">
                      <i class="fas fa-at me-1 text-gray-400"></i>
                      ${dataResponsable.login || "N/A"}
                  </span>
              </div>
              <div class="info-item">
                  <span class="info-label">Cargo</span>
                  <span class="info-value">
                      <i class="fas fa-briefcase me-1 text-gray-400"></i>
                      ${dataResponsable.cargo || "N/A"}
                  </span>
              </div>
          </div>
              </div>
  
          `;
      }
      DetalleResponsableModal.show();
    });
  //*BOTON AL CERRAR MODAL INSERT/UPDATE CATALOGO COMPONENTE
  btoncloseupsertResponsablemodal.addEventListener("click", function () {
    Swal.fire({
      title: "¿Estás seguro que desea salir?, no se guardarán los cambios",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "SI",
    }).then((result) => {
      if (result.isConfirmed) {
        inicializarmodalUpsertResponsable();
      } else if (result.isDenied) {
      }
    });
  });
});
