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

const StatePanelCatalogoComponente = {
  //VARIABLES DE CONTROL
  accion_update_insert: null,
  BanderaAutorizacionInsercion: 0,
  id_catalogo: null,
  //DISPOSITIVOS
  IdDispositivo: null,
  Dispositivo: null,
  AbrDispositivo: null,
  CaracteristicasAdicionales: null,
  //MARCA MODELO
  FK_id_marca_cata: null,
  Marca: null,
  Modelo: null,
  //PROCESADOR
  IdProcesador: null,
  procesador: null,
  //MEMORIA RAM
  IdMemoriaRam: null,
  MemoriaRam: null,
  //ALMACENAMIENTO
  IdDiscoDuro: null,
  Almacenamiento: null,
  //SISTEMA OPERATIVO,
  IdSistemaOperativo: null,
  SistemaOperativo: null,
  //CATALOGO COMPONENTE
  FK_catalogo_caracteristicas: null,
  nombre_catalogo: null,
  descripcion_modelo: null,
};

document.addEventListener("DOMContentLoaded", async () => {
  var table;
  // Variable global para la tabla
  var searchTerm = "";
  let visibleState = false; // Declarada aquí para manejar el estado de las columnas
  let urlEdit;
  //PARA LISTA DESPLEGABLE
  const loader = new SelectLoader();
  const btnmaximizarColumnas = document.getElementById(
    "btnMaximizartblCatalogo",
  ); //toggleColumns
  const btnBuscarCatalogo = document.getElementById("btnBuscarCatalogo"); //BOTON BUSCAR catalogo
  const btnagregarCatalogo = document.getElementById("btnAbriragregarCatalogo"); //BOTON ABRIR MODAL BOTON AGREGAR catalogo
  const inputBusquedaCatalogo = document.getElementById(
    "inputBusquedaCatalogo",
  ); //INPUT PERMITE INTRODUCIR BUSQUEDA
  const btnAbrirEditarCatalogo = document.getElementById(
    "btnAbrirEditarCatalogo",
  ); //BOTON ABRIR MODAL VISUALIZAR catalogo
  const btnVisualizarCatalogo = document.getElementById(
    "btnVisualizarCatalogo",
  );

  //LOCALSTORAGE NOMBRE DE USUARIO EN PERFIL
  obtenerUsuarioLocalStorage();

  //MODALES
  //INICIALIZAR MODAL
  const modalTitle = document.getElementById("upsertCatalogoModalLabel");
  const btonupsertcatalogo = document.getElementById("btonupsertcatalogo"); //BOTON SAVE TECNICO MODAL
  const btoncloseupsertCatalogomodal = document.getElementById(
    "btoncloseupsertCatalogomodal",
  );

  //*modal UPSERT CATALOGO
  const ModalCatalogo_upsert = document.getElementById("upsertCatalogoModal"); //INICIALIZAR MODAL
  const Catalogo_upsertModal = new bootstrap.Modal(ModalCatalogo_upsert, {
    keyboard: false, // Deshabilita el cierre con ESC
  }); //INICIALIZAR MODAL
  const btonsavetecnico = document.getElementById("btonsavetecnico"); //BOTON SAVE TECNICO MODAL
  const btonclosetecnicomodal = document.getElementById(
    "btonclosetecnicomodal",
  );
  //*modal DETALLE CATALOGO
  const ModalCatalogo_Detalle = document.getElementById(
    "detalleCatalogoComponenteModal",
  ); //INICIALIZAR MODAL
  const consultaCatalogoComponenteModal = new bootstrap.Modal(
    ModalCatalogo_Detalle,
  );

  //VARIABLES MODAL EDITAR CATALOGO
  const inputidcatalogo = document.getElementById("inputidcatalogo");
  const inputnombrecatalogo = document.getElementById("inputnombrecatalogo");
  const inputdispositivo = document.getElementById("inputdispositivo");
  const inputmarcamodelo = document.getElementById("inputmarcamodelo");
  const inputdescripcioncatalogo = document.getElementById(
    "inputdescripcioncatalogo",
  );
  const selectprocesador = document.getElementById("selectprocesador");
  const selectmemoriaram = document.getElementById("selectmemoriaram");
  const selectdiscoduro = document.getElementById("selectdiscoduro");
  const selectsistemaoperativo = document.getElementById(
    "selectsistemaoperativo",
  );
  const sesionCaracteristicasAdicionales = document.getElementById(
    "sesionCaracteristicasAdicionales",
  );
  sesionCaracteristicasAdicionales.style.display = "none";
  //* /////////////////////////////////////////////////////////////////////////////////////////////
  //*INICIALIZAR TABLA CATALOGO COMPONENTE

  //* /////////////////////////////////////////////////////////////////////////////////////////////
  //PERMITE INICIALIZAR LA TABLA CATALOGO COMPONENTES
  inicializarDataTableCatalogoComponente(searchTerm, null);
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
        [2, 6, 7, 8, 9], // Columnas a alternar
      );
    });
  }

  //*funcion PARA INICIALIZAR LA TBLA AL CARGAR
  function inicializarDataTableCatalogoComponente(
    searchTerm,
    id_catalogo_componente,
  ) {
    var url;

    if (id_catalogo_componente == null) {
      url = `${api}/api/CatalogosComponentes/ConsultaTodosCatalogosBusqueda`;
    } else {
      var searchTerm = id_catalogo_componente;
      url = `${api}/api/CatalogosComponentes/ConsultaCatalogoPorID`;
    }

    let selectedRow = null;
    let selectedId = null;
    const configBase = {
      columns: [
        {
          data: "id_catalogo_componente",
        },
        { data: "nombre_catalogo" },
        { data: "descripcion_modelo" },
        { data: "tipo_equipo" },
        { data: "marca" },
        { data: "modelo" },
        { data: "Procesador" },
        { data: "Memoria Ram" },
        { data: "Disco Duro" },
        { data: "Sistema Operativo" },
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

    if (!searchTerm) {
      // Tabla vacía sin AJAX
      table = $("#table_Catalogo").DataTable({
        ...configBase,
        data: [],
      });
    } else {
      handleDataTableLoadingGET({
        url: url,
        data: { searchTerm: searchTerm },
        timeoutDuration: 60000,
      }).then((data) => {
        console.log("data", data);
        if (data && Array.isArray(data) && data.length > 0) {
          // Verificación de éxito
          // ASIGNAR LA INSTANCIA DE LA TABLA CREADA A LA VARIABLE 'table'
          table = $("#table_Catalogo").DataTable({
            ...configBase,
            data: data, // Usa los datos retornados
          });

          table.on("click", "tr", function () {
            var rowData = table.row(this).data();

            // 1. Obtener datos y asignar ID
            if (rowData && rowData.id_catalogo_componente) {
              StatePanelCatalogoComponente.id_catalogo =
                rowData.id_catalogo_componente;

              // --- INICIO DE LA LÓGICA DE SELECCIÓN OPTIMIZADA ---

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
              selectedId = rowData.id_catalogo_componente;
            }
          });

          //*OCULTAR COLUMNAS AL INICIAR
          ConfigTable.ocultarColumnas(table, [2, 6, 7, 8, 9]);
          // Establece el estado inicial después de ocultarlas
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
  function BuscarCatalogoComponente() {
    let searchTerm = inputBusquedaCatalogo.value;
    if (searchTerm) {
      inicializarDataTableCatalogoComponente(searchTerm, null);
    } else {
      inicializarDataTableCatalogoComponente(((searchTerm = ""), null));
    }
  }
  if (btnBuscarCatalogo) {
    btnBuscarCatalogo.addEventListener("click", BuscarCatalogoComponente);
  }
  //*EVENTO PARA REALIZAR BUSQUEDA  DE ALGUN USUARIO POR MEDIO DE LA TECLA ENTER
  if (inputBusquedaCatalogo) {
    inputBusquedaCatalogo.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        BuscarCatalogoComponente();
      }
    });
  }

  //* /////////////////////////////////////////////////////////////////////////////////////////////
  // FIN INICIALIZAR TABLA CATALOGO COMPONENTE
  //* /////////////////////////////////////////////////////////////////////////////////////////////

  //* /////////////////////////////////////////////////////////////////////////////////////////////
  // INTERACCION DE MODALES
  //* /////////////////////////////////////////////////////////////////////////////////////////////
  //*BOTON ABRIR MODAL AGREGAR CATALOGO
  btnagregarCatalogo.addEventListener("click", function () {
    StatePanelCatalogoComponente.accion_update_insert = "INSERT";
    modalTitle.textContent = "Agregar Catálogo Componente";
    inputidcatalogo.value = "*";
    btonupsertcatalogo.textContent = "Registrar";

    Catalogo_upsertModal.show();
  });

  //*BOTON ABRIR MODAL EDITAR CATALOGO
  btnAbrirEditarCatalogo.addEventListener("click", async function () {
    if (StatePanelCatalogoComponente.id_catalogo === null) {
      Toast.fire({
        icon: "warning",
        title: "Seleccione un ID catálogo para editar",
      });
      return;
    }
    //NOMBRE DE BOTON SUBMIT
    btonupsertcatalogo.textContent = "Actualizar";
    //aignacion de id catalogo

    inputidcatalogo.value = StatePanelCatalogoComponente.id_catalogo;
    let id_catalogo = StatePanelCatalogoComponente.id_catalogo;

    const config = {
      url: `${api}/api/CatalogosComponentes/ConsultaCatalogoPorID`, // Asegúrate de que 'api' esté definida
      data: { searchTerm: id_catalogo },
    };

    try {
      const response = await handleGET(config);

      if (!response || !response.data) {
        console.warn(
          "Respuesta inválida de handleGET: response o response.data es null/undefined",
        );
        return;
      }

      const data = response.data.body[0];
      //declaracion de accion update
      StatePanelCatalogoComponente.accion_update_insert = "UPDATE";
      //cambio de nombre de modal
      modalTitle.textContent = "Editar Catálogo Componente";
      ModalCatalogo_upsert.removeAttribute("inert");

      $("#upsertCatalogoModal").off("shown.bs.modal"); // Limpiar eventos previos
      // Asignación de datos cuando el modal se muestra
      $("#upsertCatalogoModal").on("shown.bs.modal", async function () {
        // Asignación de datos al modal
        inputnombrecatalogo.value = data.nombre_catalogo;
        inputdispositivo.value = data.tipo_equipo;
        inputmarcamodelo.value = data.marca + " " + data.modelo;
        inputdescripcioncatalogo.value = data.descripcion_modelo;
        //asignacion de datos a variables globales
        StatePanelCatalogoComponente.Marca = data.marca;
        StatePanelCatalogoComponente.Modelo = data.modelo;
        StatePanelCatalogoComponente.procesador = data["Procesador"];
        StatePanelCatalogoComponente.MemoriaRam = data["Memoria Ram"];
        StatePanelCatalogoComponente.Almacenamiento = data["Disco Duro"];
        StatePanelCatalogoComponente.SistemaOperativo =
          data["Sistema Operativo"];
        //ASIGNACION DE VALORES A VARIABLES DE ESTADO
        StatePanelCatalogoComponente.CaracteristicasAdicionales =
          data.CaracteristicasAdicionales;
        //LOGICA PARA MOSTRAR U OCULTAR ELEMENTOS DE ACUERDO A SI TIENE CARACTERISTICAS ADICIONALES
        if (data.CaracteristicasAdicionales === "SI") {
          StatePanelCatalogoComponente.IdProcesador = data.ProcesadorID;
          StatePanelCatalogoComponente.IdMemoriaRam = data.MemoriaRamID;
          StatePanelCatalogoComponente.IdDiscoDuro = data.DiscoDuroID;
          StatePanelCatalogoComponente.IdSistemaOperativo =
            data.SistemaOperativoID;

          mostrarElementos(["#sesionCaracteristicasAdicionales"]);
          //*permite realizar el llenado de select y seleccionarel dato de la BD
          const loader = new SelectLoader();
          //*LLENADO DE LISTA DESPLEGABLES PROCESADOR
          await loader.cargarOpciones(
            {
              endpoint: `${api}/api/procesador/consulta_Todos_Procesador_busqueda`,
              selectId: "selectprocesador",
              renderOption: (i) => ({
                value: i.IdProcesador,
                text: `${i.Fabricante} ${i.serie}-${i.modelo}`,
              }),
              getExtraParams: () => ({
                searchTerm: "",
              }),
            },
            true,
          );
          //.PARA SELECCIONAR dato arrojado de la bd
          let selectprocesador = document.getElementById("selectprocesador");
          selectprocesador.value = StatePanelCatalogoComponente.IdProcesador;

          // Evento para capturar el cambio en el select de área y actualizar el estado global
          selectprocesador.addEventListener("change", (e) => {
            const seleccionado = e.target.options[e.target.selectedIndex];

            if (e.target.value !== "") {
              // Capturamos el ID
              StatePanelCatalogoComponente.IdProcesador = e.target.value;

              // Capturamos el Texto
              StatePanelCatalogoComponente.procesador = seleccionado.text;
            } else {
              // Reset
              StatePanelCatalogoComponente.IdProcesador = null;
              StatePanelCatalogoComponente.procesador = "";
            }
          });

          //*LLENADO DE LISTA DESPLEGABLES MEMORIA RAM
          await loader.cargarOpciones(
            {
              endpoint: `${api}/api/MemoriaRam/consulta_Todos_MemoriaRam_busqueda`,
              selectId: "selectmemoriaram",
              renderOption: (i) => ({
                value: i.IdMemoriaRam,
                text: `${i.CapacidadGB} ${i.Tipo}`,
              }),
              getExtraParams: () => ({
                searchTerm: "",
              }),
            },
            true,
          );
          //.PARA SELECCIONAR dato arrojado de la bd,
          let selectmemoriaram = document.getElementById("selectmemoriaram");
          selectmemoriaram.value = StatePanelCatalogoComponente.IdMemoriaRam;

          // Evento para capturar el cambio en el select de área y actualizar el estado global
          selectmemoriaram.addEventListener("change", (e) => {
            const seleccionado = e.target.options[e.target.selectedIndex];

            if (e.target.value !== "") {
              // Capturamos el ID
              StatePanelCatalogoComponente.IdMemoriaRam = e.target.value;

              // Capturamos el Texto
              StatePanelCatalogoComponente.MemoriaRam = seleccionado.text;
            } else {
              // Reset
              StatePanelCatalogoComponente.IdMemoriaRam = null;
              StatePanelCatalogoComponente.MemoriaRam = "";
            }
          });
          //*LLENADO DE LISTA DESPLEGABLES ALMACENAMIENTO
          await loader.cargarOpciones(
            {
              endpoint: `${api}/api/Almacenamiento/consulta_Todos_DiscoDuro_busqueda`,
              selectId: "selectdiscoduro",
              renderOption: (i) => ({
                value: i.IdDiscoDuro,
                text: `${i.Tipo} ${i.Capacidad_GB}`,
              }),
              getExtraParams: () => ({
                searchTerm: "",
              }),
            },
            true,
          );
          //.PARA SELECCIONAR dato arrojado de la bd
          let selectdiscoduro = document.getElementById("selectdiscoduro");
          selectdiscoduro.value = StatePanelCatalogoComponente.IdDiscoDuro;

          // Evento para capturar el cambio en el select de área y actualizar el estado global
          selectdiscoduro.addEventListener("change", (e) => {
            const seleccionado = e.target.options[e.target.selectedIndex];

            if (e.target.value !== "") {
              // Capturamos el ID
              StatePanelCatalogoComponente.IdDiscoDuro = e.target.value;

              // Capturamos el Texto
              StatePanelCatalogoComponente.Almacenamiento = seleccionado.text;
            } else {
              // Reset
              StatePanelCatalogoComponente.IdDiscoDuro = null;
              StatePanelCatalogoComponente.Almacenamiento = "";
            }
          });

          //*LLENADO DE LISTA DESPLEGABLES SISTEMA OPERATIVO
          await loader.cargarOpciones(
            {
              endpoint: `${api}/api/SistemaOPerativo/consulta_Todos_SistemaOperativo_busqueda`,
              selectId: "selectsistemaoperativo",
              renderOption: (i) => ({
                value: i.IdSistemaOperativo,
                text: `${i.Nombre} ${i.VersIon_SO} ${i.Arquitectura}`,
              }),
              getExtraParams: () => ({
                searchTerm: "",
              }),
            },
            true,
          );
          //.PARA SELECCIONAR dato arrojado de la bd
          let selectsistemaoperativo = document.getElementById(
            "selectsistemaoperativo",
          );
          selectsistemaoperativo.value =
            StatePanelCatalogoComponente.IdSistemaOperativo;

          // Evento para capturar el cambio en el select de área y actualizar el estado global
          selectsistemaoperativo.addEventListener("change", (e) => {
            const seleccionado = e.target.options[e.target.selectedIndex];

            if (e.target.value !== "") {
              // Capturamos el ID
              StatePanelCatalogoComponente.IdSistemaOperativo = e.target.value;

              // Capturamos el Texto
              StatePanelCatalogoComponente.SistemaOperativo = seleccionado.text;
            } else {
              // Reset
              StatePanelCatalogoComponente.IdSistemaOperativo = null;
              StatePanelCatalogoComponente.SistemaOperativo = "";
            }
          });
        } else if (data.CaracteristicasAdicionales === "NO") {
          inputnombrecatalogo.disabled = false;
          inputdescripcioncatalogo.disabled = false;
          inputmarcamodelo.disabled = false;
          ocultarElementos(["#sesionCaracteristicasAdicionales"]);
        }
        //ASIGNACION A VARIABLES DE ESTADO
        StatePanelCatalogoComponente.id_catalogo = data.id_catalogo_componente;
        StatePanelCatalogoComponente.nombre_catalogo = data.nombre_catalogo;
        StatePanelCatalogoComponente.descripcion_modelo =
          data.descripcion_modelo;
        StatePanelCatalogoComponente.IdDispositivo = data.FK_id_dispositivo;
        StatePanelCatalogoComponente.FK_id_marca_cata = data.FK_id_marca_cata;
        StatePanelCatalogoComponente.FK_catalogo_caracteristicas =
          data.FK_catalogo_caracteristicas;
        StatePanelCatalogoComponente.Marca = data.marca;
        StatePanelCatalogoComponente.Modelo = data.modelo;
      });
      Catalogo_upsertModal.show();
      // Asignación de datos (descomentado y movido aquí para ejecutarse solo si hay data)
    } catch (error) {
      console.error("Error en la petición GET:", error); // Log del error en catch
      Toast.fire({
        icon: "error",
        title: "Error al consultar el técnico. Revisa la consola.",
      });
    }
  });

  //* /////////////////////////////////////////////////////////////////////////////////////////////
  //FIN Interaccion de modales
  //* /////////////////////////////////////////////////////////////////////////////////////////////

  //* /////////////////////////////////////////////////////////////////////////////////////////////
  //EVENTO PARA MODALES SELECTOR
  //* /////////////////////////////////////////////////////////////////////////////////////////////
  
  const configBuscador = {
    dispositivo: {
      nombre: "del dispositivo",
      inputVisual: document.getElementById("inputdispositivo"),
      btnAbrir: document.getElementById("btnAbrirBuscador"),
      endpoint: `${api}/api/dispositivos/ConsultaPorDispositivosBusqueda`,
      onOpen: () => {
        
        buscador.ocultarElementos([
          "#colIdCatalogoComponentes",
          "#colIdCatalogo",
          "#colNombreCatalogo",
          "#colDispositivo",
          "#colmarcamodelo",
          "#coldescripcioncatalogo",
          ".d-grid",
          "#sesion"
        ]);
        document.getElementById("btonupsertcatalogo").style.display = "none";
      },
      onClose: () => {
       
        buscador.mostrarElementos([
          "#colIdCatalogoComponentes",
          "#colNombreCatalogo",
          "#colDispositivo",
          "#colmarcamodelo",
        ]);

        document.getElementById("btonupsertcatalogo").style.display = "";
      },
      placeholder: "Busca un tipo de equipo...",
      renderLabel: (item) =>
        `${item.tipo_equipo} (${item.abreviatura_tipo || "N/A"})`,
      onSelect: (item) => {
        StatePanelCatalogoComponente.IdDispositivo =
          item.id_dispositivo.toString();

        StatePanelCatalogoComponente.Dispositivo = item.tipo_equipo;
        StatePanelCatalogoComponente.CaracteristicasAdicionales =
          item.CaracteristicasAdicionales;
        inputnombrecatalogo.disabled = false;
        //ASIGNACION DE VALOR A INPUT
        inputdispositivo.value = StatePanelCatalogoComponente.Dispositivo;
        inputmarcamodelo.value = "";
      },
      // Agrega lógica de visibilidad específica para dispositivo
      onVisibility: (selectedItem) => {
        //*comparacion para saber si el item seleccionado tiene caracteristicas adicionales
        if (selectedItem.CaracteristicasAdicionales === "SI") {
          sesionCaracteristicasAdicionales.hidden = false;
          sesionCaracteristicasAdicionales.style.display = "flex";
          inputmarcamodelo.disabled = false;
          inputdescripcioncatalogo.disabled = true;
          inputnombrecatalogo.disabled = true;
          LlenadoListasDesplegablesModalCatalogoComponente(false);
        } else {
          sesionCaracteristicasAdicionales.hidden = true;
          sesionCaracteristicasAdicionales.style.display = "none";
          inputmarcamodelo.disabled = false;
          inputdescripcioncatalogo.disabled = false;
        }
      },
    },
    marcamodelo: {
      nombre: "de la marca o modelo",
      inputVisual: document.getElementById("inputmarcamodelo"),
      btnAbrir: document.getElementById("btnAbrirBuscadorMarca"),
      endpoint: `${api}/api/MarcaModelo/ctl_consulta_Por_MarcaModelo_BusquedaPorDispositivo`,
      onOpen: () => {
        
             
        buscador.ocultarElementos([
          "#colIdCatalogoComponentes",
          "#colIdCatalogo",
          "#colNombreCatalogo",
          "#colDispositivo",
          "#colmarcamodelo",
          "#coldescripcioncatalogo",
          ".d-grid",
        ]);
        sesionCaracteristicasAdicionales.style.display = "none";
      },
      onClose: () => {
        
           
        buscador.mostrarElementos([
          "#colIdCatalogoComponentes",
          "#colIdCatalogo",
          "#colNombreCatalogo",
          "#colDispositivo",
          "#colmarcamodelo",
          "#coldescripcioncatalogo",
          ".d-grid",
        ]);
        sesionCaracteristicasAdicionales.style.display = "flex";
      },
      getExtraParams: () => ({
        FK_dispositivo: StatePanelCatalogoComponente.IdDispositivo,
      }),
      placeholder: "Busca marca o modelo...",
      renderLabel: (item) => `${item.marca} ${item.modelo || "Genérico"}`,
      onSelect: (item) => {
        StatePanelCatalogoComponente.FK_id_marca_cata = item.id_marca;
        StatePanelCatalogoComponente.Marca = item.marca;
        StatePanelCatalogoComponente.Modelo = item.modelo;

        //ASIGNACION DE VALOR A INPUT
        inputmarcamodelo.value =
          StatePanelCatalogoComponente.Marca +
          " " +
          StatePanelCatalogoComponente.Modelo;

        //ASIGNACION A NOMBRE DE CATALOGO (MARCA MODELO) COMO SUGERENCIA
        StatePanelCatalogoComponente.nombre_catalogo =
          StatePanelCatalogoComponente.Marca +
          " " +
          StatePanelCatalogoComponente.Modelo;
        inputnombrecatalogo.value =
          StatePanelCatalogoComponente.nombre_catalogo;
      },
      // Agrega lógica de visibilidad específica para marca (ejemplo: habilitar algo más)
       onVisibility: (selectedItem) => {
        //*comparacion para saber si el item seleccionado tiene caracteristicas adicionales
        console.log("CaracteristicasAdicionales",StatePanelCatalogoComponente.CaracteristicasAdicionales);
        if (StatePanelCatalogoComponente.CaracteristicasAdicionales === "SI") {
          sesionCaracteristicasAdicionales.hidden = false;
          sesionCaracteristicasAdicionales.style.display = "flex";
          inputmarcamodelo.disabled = false;
          inputdescripcioncatalogo.disabled = true;
          inputnombrecatalogo.disabled = true;
          LlenadoListasDesplegablesModalCatalogoComponente(false);
        } else {
          sesionCaracteristicasAdicionales.hidden = true;
          sesionCaracteristicasAdicionales.style.display = "none";
          inputmarcamodelo.disabled = false;
          inputdescripcioncatalogo.disabled = false;
        }
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
  //*FUNCIONES ADICIONALES CATALOGO COMPONENTE
  //* /////////////////////////////////////////////////////////////////////////////////////////////

  //*FUNCIONES PARA MODAL INSERT/UPDATE CATALOGO COMPONENTE
  function ValidarCamposCatalogoComponentes(
    inputdispositivo,
    inputmarcamodelo,
    selectprocesador,
    selectmemoriaram,
    selectdiscoduro,
    selectsistemaoperativo,
  ) {
    const validarinputdispositivo = General.validar_Campos_String(
      inputdispositivo,
      "El dispositivo",
    );
    const validarinputmarcamodelo = General.validar_Campos_String(
      inputmarcamodelo,
      "La marca y modelo",
    );
    const validarselectprocesador = General.validar_Campos_Select(
      selectprocesador,
      "un procesador",
    );
    const validarselectmemoriaram = General.validar_Campos_Select(
      selectmemoriaram,
      "una memoria RAM",
    );
    const validarselectdiscoduro = General.validar_Campos_Select(
      selectdiscoduro,
      "un disco duro",
    );
    const validarselectsistemaoperativo = General.validar_Campos_Select(
      selectsistemaoperativo,
      "un sistema operativo",
    );

    if (
      validarinputdispositivo.error ||
      validarinputmarcamodelo.error ||
      validarselectprocesador.error ||
      validarselectmemoriaram.error ||
      validarselectdiscoduro.error ||
      validarselectsistemaoperativo.error
    ) {
      // Array de todas las validaciones para iterar
      const validations = [
        validarinputdispositivo,
        validarinputmarcamodelo,
        validarselectprocesador,
        validarselectmemoriaram,
        validarselectdiscoduro,
        validarselectsistemaoperativo,
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

  //*FUNCION LLENADO DE LISTAS DESPLEGABLES MODAL CATALOGO COMPONENTE
  function LlenadoListasDesplegablesModalCatalogoComponente(limpiarOpciones) {
    //*LLENADO DE LISTA DESPLEGABLES PROCESADOR
    loader.cargarOpciones(
      {
        endpoint: `${api}/api/procesador/consulta_Todos_Procesador_busqueda`, // Tu endpoint
        selectId: "selectprocesador",
        renderOption: (item) => ({
          value: item.IdProcesador,
          text: `${item.Fabricante} ${item.serie}-${item.modelo}`,
        }),
        getExtraParams: () => ({
          searchTerm: "",
        }),
      },
      limpiarOpciones,
    );

    // Evento para cuando cambie el select PROCESADOR
    document
      .getElementById("selectprocesador")
      .addEventListener("change", (e) => {
        StatePanelCatalogoComponente.IdProcesador = e.target.value;
        
        const combo = e.target;
        StatePanelCatalogoComponente.procesador =
          combo.options[combo.selectedIndex].text;

        // Aquí puedes cargar otro select dependiente, e.g., marcas basadas en dispositivo
      });
    //*LLENADO DE LISTA DESPLEGABLES MEMORIA RAM
    loader.cargarOpciones(
      {
        endpoint: `${api}/api/MemoriaRam/consulta_Todos_MemoriaRam_busqueda`, // Tu endpoint
        selectId: "selectmemoriaram",
        renderOption: (item) => ({
          value: item.IdMemoriaRam,
          text: `${item.CapacidadGB} ${item.Tipo}`,
        }),
        getExtraParams: () => ({
          searchTerm: "",
        }),
      },
      limpiarOpciones,
    );

    // Evento para cuando cambie el select PROCESADOR
    document
      .getElementById("selectmemoriaram")
      .addEventListener("change", (e) => {
        StatePanelCatalogoComponente.IdMemoriaRam = e.target.value;
        // 2. Obtener el texto (Lo que el usuario ve)
        const combo = e.target;
        StatePanelCatalogoComponente.MemoriaRam =
          combo.options[combo.selectedIndex].text;

        // Aquí puedes cargar otro select dependiente, e.g., marcas basadas en dispositivo
      });

    //*LLENADO DE LISTA DESPLEGABLES ALMACENAMIENTO
    loader.cargarOpciones(
      {
        endpoint: `${api}/api/Almacenamiento/consulta_Todos_DiscoDuro_busqueda`, // Tu endpoint
        selectId: "selectdiscoduro",
        renderOption: (item) => ({
          value: item.IdDiscoDuro,
          text: `${item.Tipo} ${item.Capacidad_GB}`,
        }),
        getExtraParams: () => ({
          searchTerm: "",
        }),
      },
      limpiarOpciones,
    );

    // Evento para cuando cambie el select PROCESADOR
    document
      .getElementById("selectdiscoduro")
      .addEventListener("change", (e) => {
        StatePanelCatalogoComponente.IdDiscoDuro = e.target.value;
        // 2. Obtener el texto (Lo que el usuario ve)
        const combo = e.target;
        StatePanelCatalogoComponente.Almacenamiento =
          combo.options[combo.selectedIndex].text;

        // Aquí puedes cargar otro select dependiente, e.g., marcas basadas en dispositivo
      });

    //*LLENADO DE LISTA DESPLEGABLES SISTEMA OPERATIVO
    loader.cargarOpciones(
      {
        endpoint: `${api}/api/SistemaOPerativo/consulta_Todos_SistemaOperativo_busqueda`, // Tu endpoint
        selectId: "selectsistemaoperativo",
        renderOption: (item) => ({
          value: item.IdSistemaOperativo,
          text: `${item.Nombre} ${item.VersIon_SO} ${item.Arquitectura}`,
        }),
        getExtraParams: () => ({
          searchTerm: "",
        }),
      },
      limpiarOpciones,
    );

    // Evento para cuando cambie el select PROCESADOR
    document
      .getElementById("selectsistemaoperativo")
      .addEventListener("change", (e) => {
        StatePanelCatalogoComponente.IdSistemaOperativo = e.target.value;
        // 2. Obtener el texto (Lo que el usuario ve)
        const combo = e.target;
        StatePanelCatalogoComponente.SistemaOperativo =
          combo.options[combo.selectedIndex].text;

        // Aquí puedes cargar otro select dependiente, e.g., marcas basadas en dispositivo
      });
  }

  //*FUNCION PARA INICIALIZAR MODAL INSERT/UPDATE CATALOGO COMPONENTE
  function inicializarmodalUpsertCatalogoComponente() {
    // Reset nativo del formulario (esto limpia TODO de golpe)
    const formulario = document.getElementById("formularioupsertCatalogo");
    if (formulario) {
      formulario.reset();
    }

    // deshabilitar campos
    inputnombrecatalogo.disabled = true;
    inputdescripcioncatalogo.disabled = true;
    document.getElementById("vistaBuscador").style.display = "none";

    $("#upsertCatalogoModal").off("shown.bs.modal");

    mostrarElementos([
      "#colIdCatalogoComponentes",

      "#colNombreCatalogo",

      "#colDispositivo",

      "#colmarcamodelo",

      "#coldescripcioncatalogo",
    ]);
    ocultarElementos(["#sesionCaracteristicasAdicionales"]);
    inputBusquedaCatalogo.value = "";
    StatePanelCatalogoComponente.accion_update_insert = null;

    //inicializarDataTableCatalogoComponente("", null);
    Catalogo_upsertModal.hide();
  }

  //*////////////////////////////////////////////////////////////////////////////////////////////////////////////*

  //BOTONES MODAL INSERT/UPDATE CATALOGO COMPONENTE

  //*//////////////////////////////////////////////////////////////////////////////////////////////////////////*/
  //*BOTON GUARDAR MODAL INSERT/UPDATE CATALOGO COMPONENTE
  btonupsertcatalogo.addEventListener("click", async function () {
    //VALIDAR CAMPOS MODAL INSERT/UPDATE CATALOGO COMPONENTE
    const hayErrores = ValidarCamposCatalogoComponentes(
      inputdispositivo.value,
      inputmarcamodelo.value,
      selectprocesador.value,
      selectmemoriaram.value,
      selectdiscoduro.value,
      selectsistemaoperativo.value,
    );

    if (
      StatePanelCatalogoComponente.CaracteristicasAdicionales.toString() ===
      "SI"
    ) {
      if (hayErrores == false) {
        //CREACION DE DESCRIPCION MODELO AUTOMATICO
        StatePanelCatalogoComponente.descripcion_modelo =
          "PROCESADOR " +
          StatePanelCatalogoComponente.procesador +
          " ,MEMORIA RAM " +
          StatePanelCatalogoComponente.MemoriaRam +
          " ,ALMACENAMIENTO DISCO " +
          StatePanelCatalogoComponente.Almacenamiento +
          " ,SISTEMA OPERATIVO " +
          StatePanelCatalogoComponente.SistemaOperativo;

        //CREACION DE NOMBRE CATALOGO AUTOMATICO
        StatePanelCatalogoComponente.nombre_catalogo =
          StatePanelCatalogoComponente.Marca +
          " " +
          StatePanelCatalogoComponente.Modelo +
          " " +
          StatePanelCatalogoComponente.procesador +
          " " +
          StatePanelCatalogoComponente.MemoriaRam +
          " " +
          StatePanelCatalogoComponente.Almacenamiento +
          " " +
          StatePanelCatalogoComponente.SistemaOperativo;
      } else {
        return;
      }
    } else if (
      StatePanelCatalogoComponente.CaracteristicasAdicionales.toString() ===
      "NO"
    ) {
      //validamos si nombre catalogo contiene texto
      const validarinputnombrecatalogo = General.validar_Campos_String(
        inputnombrecatalogo.value,
        " El nombre de catálogo",
      );
      const validarinputdispositivo = General.validar_Campos_String(
        inputdispositivo.value,
        " El dispositivo",
      );
      const validarinputmarcamodelo = General.validar_Campos_String(
        inputmarcamodelo.value,
        " La marca y modelo",
      );
      const validarinputdescripcioncatalogo = General.validar_Campos_String(
        inputdescripcioncatalogo.value,
        " La descripción de catálogo",
      );
      if (
        validarinputnombrecatalogo.error ||
        validarinputdescripcioncatalogo.error ||
        validarinputdispositivo.error ||
        validarinputmarcamodelo.error
      ) {
        // Array de todas las validaciones para iterar
        const validations = [
          validarinputnombrecatalogo,
          validarinputdescripcioncatalogo,
          validarinputdispositivo,
          validarinputmarcamodelo,
        ];

        // Encontrar la primera validación que falló
        const failedValidation = validations.find((val) => val.error);

        Toast.fire({
          icon: failedValidation.icon,
          title: failedValidation.message,
        });

        return;
      }

      //ASIGNACION DE VALORES A ESTADO GLOBAL
      StatePanelCatalogoComponente.descripcion_modelo =
        inputdescripcioncatalogo.value;
      StatePanelCatalogoComponente.nombre_catalogo = inputnombrecatalogo.value;
      StatePanelCatalogoComponente.FK_catalogo_caracteristicas = 1;
    } else {
      Toast.fire({
        icon: "warning",
        title: "Error desconocido en la descripción, intente de nuevo.",
      });
    }

    //inputdescripcioncatalogo.value,
    const DataCatalogoComponentes = {
      id_catalogo_componente: StatePanelCatalogoComponente.id_catalogo || 0,
      nombre_catalogo: StatePanelCatalogoComponente.nombre_catalogo,
      descripcion_modelo: StatePanelCatalogoComponente.descripcion_modelo,
      FK_id_dispositivo: StatePanelCatalogoComponente.IdDispositivo,
      nombre_marca: StatePanelCatalogoComponente.Marca,
      nombre_modelo: StatePanelCatalogoComponente.Modelo,
      id_procesador: StatePanelCatalogoComponente.IdProcesador,
      id_memoriaram: StatePanelCatalogoComponente.IdMemoriaRam,
      id_discoduro: StatePanelCatalogoComponente.IdDiscoDuro,
      id_sistema_operativo: StatePanelCatalogoComponente.IdSistemaOperativo,
      FK_id_marca_cata: StatePanelCatalogoComponente.FK_id_marca_cata,
      CaracteristicasAdicionales:
        StatePanelCatalogoComponente.CaracteristicasAdicionales,
      BanderaAutorizacionInsercion:
        StatePanelCatalogoComponente.BanderaAutorizacionInsercion,
    };
    if (StatePanelCatalogoComponente.accion_update_insert == "INSERT") {
      inputnombrecatalogo.value = StatePanelCatalogoComponente.nombre_catalogo;
      inputdescripcioncatalogo.value =
        StatePanelCatalogoComponente.descripcion_modelo;

      // Función interna para manejar el flujo
      const procesarInsercion = async (forzarInsercion = false) => {
        // Modificar DataCatalogoComponentes
        const dataToSend = { ...DataCatalogoComponentes };
        if (forzarInsercion) {
          dataToSend.BanderaAutorizacionInsercion = 1; // Forzar inserción
        }

        const config = {
          url: `${api}/api/CatalogosComponentes/InsertaryVerificarCatalogoComponente`,
          data: dataToSend,
          successTitle: "Cátalogo agregado exitosamente",
        };
        const response = await handlePOST(config);
        const data = response.data.body;
        if (data.existeMarcaModelo == 1 && data.resultado == 1) {
          // Caso exitoso: ya insertado
          const IdCatalogoInsertado = data.Id_Catalogo_Insert; //DATOS ID INSERTADO EN BASE DE DATOS
          Swal.fire({
            title: "Agregado",
            text: "El catálogo se ha agregado exitosamente.",
            icon: "success",
            showCancelButton: false,
            timer: 2000,
          });
          setTimeout(() => {
            General.resetearCampos("#vistaFormulario");
            inputBusquedaCatalogo.value = "";
            //al recargar tabla limpiar campos
            searchTerm = "";
            StatePanelCatalogoComponente.accion_update_insert = null;
            inputnombrecatalogo.disabled = true;
            inputdescripcioncatalogo.disabled = true;
            Catalogo_upsertModal.hide();
            //INICIALIZAMOS CON EL ID CATALOGO INSERTADO

            inicializarDataTableCatalogoComponente(
              searchTerm,
              IdCatalogoInsertado,
            );
          }, 2000);
        } else if (data.existeMarcaModelo == 1) {
          // Caso: existe, pero no insertado (resultado == 0)
          const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: "btn btn-success",
              cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
          });
          const result = await swalWithBootstrapButtons.fire({
            title: "¿Estas Seguro?",
            text: "El catálogo que intentas agregar ya existe. ¿Deseas continuar y agregarlo de todos modos?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí",
            cancelButtonText: "No",
            reverseButtons: true,
          });

          if (result.isConfirmed) {
            // Usuario confirmó: volver a llamar recursivamente con forzarInsercion = true
            await procesarInsercion(true);
          }
        } else {
          // Caso: no existe marca/modelo, y se insertó (resultado == 1)
          const IdCatalogoInsertado = data.Id_Catalogo_Insert; //DATOS ID INSERTADO EN BASE DE DATOS
          Swal.fire({
            title: "Agregado",
            text: "El catálogo se ha agregado exitosamente.",
            icon: "success",
            showCancelButton: false,
            timer: 2000,
          });
          setTimeout(() => {
            General.resetearCampos("#vistaFormulario");

            //al recargar tabla limpiar campos
            searchTerm = "";
            StatePanelCatalogoComponente.accion_update_insert = null;
            Catalogo_upsertModal.hide();

            inicializarDataTableCatalogoComponente(
              searchTerm,
              IdCatalogoInsertado,
            );
          }, 2000);
        }
      };

      // Llamar la función interna
      await procesarInsercion();
    } else if (StatePanelCatalogoComponente.accion_update_insert == "UPDATE") {
      urlEdit = `${api}/api/CatalogosComponentes/EditarCatalogoComponentesPorId`;
      const dataCatalogoComponente = {
        nombre_catalogo: StatePanelCatalogoComponente.nombre_catalogo,
        descripcion_modelo: StatePanelCatalogoComponente.descripcion_modelo,
        FK_id_dispositivo: StatePanelCatalogoComponente.IdDispositivo,
        FK_id_marca_cata: StatePanelCatalogoComponente.FK_id_marca_cata,
        FK_catalogo_caracteristicas:
          StatePanelCatalogoComponente.FK_catalogo_caracteristicas,
      };

      try {
        const config = {
          url: urlEdit,
          id: parseInt(StatePanelCatalogoComponente.id_catalogo),
          data: dataCatalogoComponente,
          successTitle: `¡Exito!`,
          successMessage: `El Id cátalogo #${StatePanelCatalogoComponente.id_catalogo} ha sido modificado correctamente.`,
        };

        const response = await handlePUT(config);

        if (response.error === false && response.status == 200) {
          setTimeout(() => {
            General.resetearCampos("#vistaFormulario");
            inputBusquedaCatalogo.value = "";
            //al recargar tabla limpiar campos
            searchTerm = "";
            StatePanelCatalogoComponente.accion_update_insert = null;
            inputnombrecatalogo.disabled = true;
            inputdescripcioncatalogo.disabled = true;
            Catalogo_upsertModal.hide();
            //INICIALIZAMOS CON EL ID CATALOGO INSERTADO

            inicializarDataTableCatalogoComponente(
              searchTerm,
              StatePanelCatalogoComponente.id_catalogo,
            );
          }, 2000);
        }
      } catch (error) {
        console.error("Error en la petición PUT:", error); // Log del error en catch
      }
    }
  });
  // *BOTON ABRIR MODAL VISUALIZAR CATALOGO COMPONENTE
  btnVisualizarCatalogo.addEventListener("click", async function () {
    if (StatePanelCatalogoComponente.id_catalogo === null) {
      Toast.fire({
        icon: "warning",
        title: "Seleccione un ID catálogo para editar",
      });
      return;
    }
    const config = {
      url: `${api}/api/CatalogosComponentes/ConsultaCatalogoPorID`, // URL específica
      timeoutDuration: 5000, // Opcional: ajusta el timeout si es necesario
      data: { searchTerm: StatePanelCatalogoComponente.id_catalogo },
    };

    try {
      const response = await handleGET(config);

      const bodyData = response.data.body;
      const dataCatalogoComponente =
        Array.isArray(bodyData) && bodyData.length > 0 ? bodyData[0] : null;
      // Verifica que el cuerpo de la respuesta contenga datos
      if (dataCatalogoComponente) {
        // Limpiar contenido previo
        const listGroup = document.querySelector(
          "#detalleCatalogoComponenteContenido .list-group",
        );
        listGroup.innerHTML = "";

        // Agregar información al modal
        listGroup.innerHTML = `
    
        <div class="card-detalle-custom shadow-sm">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="badge bg-primary">ID: ${dataCatalogoComponente.id_catalogo_componente || "---"}</span>
                <span class="badge ${dataCatalogoComponente.CaracteristicasAdicionales === "SI" ? "bg-success" : "bg-success"}">
                    ${dataCatalogoComponente.CaracteristicasAdicionales === "SI" ? "CON ESPECIFICACIONES" : "BÁSICO"}
                </span>
            </div>
            <h5 class="fw-semibold text-dark mb-1">${dataCatalogoComponente.nombre_catalogo}</h5> 
            <div class="text-muted small">
                <i class="fas fa-tag me-1"></i> ${dataCatalogoComponente.marca} | 
                <i class="fas fa-microchip me-1"></i> ${dataCatalogoComponente.modelo} |
                <i class="fas fa-microchip me-1"></i> ${dataCatalogoComponente.tipo_equipo}
            </div>
        </div>

        <div class="mb-4">
            <p class="subtitulo-modal-agrupado">Descripción del Catálogo</p>
            <div class="p-3 bg-white border rounded shadow-sm italic text-secondary">
                ${dataCatalogoComponente.descripcion_modelo || "Sin descripción."}
            </div>
        </div>

        ${
          dataCatalogoComponente.CaracteristicasAdicionales === "SI"
            ? `
            <div class="subtitulo-modal-agrupado mb-2">
                <i class="fas fa-list me-1"></i> Ficha Técnica
            </div>
            <table class="table-specs-custom">
                <tr>
                    <td class="label">Procesador</td>
                    <td class="text-end text-dark">${dataCatalogoComponente.Procesador || "N/A"}</td>
                </tr>
                <tr>
                    <td class="label">Memoria RAM</td>
                    <td class="text-end text-dark">${dataCatalogoComponente["Memoria Ram"] || "N/A"}</td>
                </tr>
                <tr>
                    <td class="label">Almacenamiento</td>
                    <td class="text-end text-dark">${dataCatalogoComponente["Disco Duro"] || "N/A"}</td>
                </tr>
                <tr>
                    <td class="label">S.O.</td>
                    <td class="text-end text-dark">${dataCatalogoComponente["Sistema Operativo"] || "N/A"}</td>
                </tr>
            </table>
        `
            : ""
        }
  
`;
      }
      consultaCatalogoComponenteModal.show();
    } catch (error) {
      console.error("Error en la petición GET:", error); // Log del error en catch
      return;
    }
  });

  //*BOTON AL CERRAR MODAL INSERT/UPDATE CATALOGO COMPONENTE
  btoncloseupsertCatalogomodal.addEventListener("click", function () {
    Swal.fire({
      title: "¿Estás seguro que desea salir?, no se guardarán los cambios",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "SI",
    }).then((result) => {
      if (result.isConfirmed) {
        inicializarmodalUpsertCatalogoComponente();
      } else if (result.isDenied) {
      }
    });
  });
});
