import {
    General, handlePOST, handleDataTableLoadingGET, URLAPI, ConfigTable,
    handleGETSinProgressBar, handlePUT, handleGET,obtenerUsuarioLocalStorage
} from '../Utils.js';  // Importa tus utilidades
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
    }
});

const StatePanelCatalogoComponente = {
    id_catalogo: null
};

document.addEventListener('DOMContentLoaded', () => {
var table; // Variable global para la tabla
    var searchTerm = "";
    let visibleState = false; // Declarada aquí para manejar el estado de las columnas
    let urlEdit;
    const btnmaximizarColumnas = document.getElementById('btnMaximizartblTecnicos');//toggleColumns
    const btnBuscarCatalogo= document.getElementById('btnBuscarCatalogo');//BOTON BUSCAR catalogo
    const btnagregarCatalogo = document.getElementById('btnAbriragregarCatalogo');//BOTON ABRIR MODAL BOTON AGREGAR catalogo
    const inputBusquedaCatalogo = document.getElementById('inputBusquedaCatalogo');//INPUT PERMITE INTRODUCIR BUSQUEDA
    const btnAbrirEditarCatalogo = document.getElementById('btnAbrirEditarCatalogo');//BOTON ABRIR MODAL EDITAR catalogo
    const btnAbrirDetalleCatalogo= document.getElementById('btnVisualizarCatalogo');//BOTON ABRIR MODAL CONSULTAR catalogo

     //LOCALSTORAGE NOMBRE DE USUARIO EN PERFIL 
       obtenerUsuarioLocalStorage();
 inicializarDataTableCatalogoComponente(searchTerm);
  //*funcion PARA INICIALIZAR LA TBLA AL CARGAR
     function inicializarDataTableCatalogoComponente(searchTerm) {
         var url = `${api}/api/CatalogosComponentes/ConsultaTodosCatalogosBusqueda`;
 
         let selectedRow = null;
         let selectedId = null;
         const configBase = {
             "columns": [
                 {
                     "data": 'id_catalogo_componente',
                 },
                 { "data": 'nombre_catalogo' },
                 { "data": 'descripcion_modelo' },
                 { "data": 'marca' },
                 { "data": 'modelo' },
                 { "data": 'Procesador' },
                 { "data": 'Memoria Ram' },
                 { "data": 'Disco Duro' },
                 { "data": 'Sistema Operativo' }

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
             destroy: true 
             
             
 
         };

          if (!searchTerm) {
     
      // Tabla vacía sin AJAX
      table = $('#table_Catalogo').DataTable({
        ...configBase,
        data: []
      });
    }
    else{
     
         handleDataTableLoadingGET({
             url: url,
             data: { searchTerm: searchTerm },
             timeoutDuration: 60000,
         }).then((data) => {
             console.log("data", data);
             if (data && Array.isArray(data) && data.length > 0) { // Verificación de éxito
                 // ASIGNAR LA INSTANCIA DE LA TABLA CREADA A LA VARIABLE 'table'
                 table = $('#table_Catalogo').DataTable({
                     ...configBase,
                     data: data, // Usa los datos retornados
                 });
 
                 table.on('click', 'tr', function () {
                     var rowData = table.row(this).data();
 
                     // 1. Obtener datos y asignar ID
                     if (rowData && rowData.id_catalogo_componente) {
                         StatePanelCatalogoComponente.id_catalogo = rowData.id_catalogo_componente;
 
                         // --- INICIO DE LA LÓGICA DE SELECCIÓN OPTIMIZADA ---
 
                         // 2. Deseleccionar la fila anterior si existe
                         if (selectedRow) {
                             // Elimina tu clase y la clase activa de Bootstrap
                             selectedRow.removeClass('selected-row table-active');
                             selectedRow.find('td').removeClass('selected-cell');
                         }
 
                         // 3. Establecer la nueva fila como seleccionada
                         const newSelectedRow = $(this);
 
                         // Agrega tu clase y la clase activa de Bootstrap para el color
                         newSelectedRow.addClass('selected-row table-active');
                         newSelectedRow.find('td').addClass('selected-cell');
 
                         // 4. Actualizar la variable de estado
                         selectedRow = newSelectedRow;
                         selectedId = rowData.id_catalogo_componente;
 
                     }
                 });
 
                //*OCULTAR COLUMNAS AL INICIAR
                ConfigTable.ocultarColumnas(table, [2, 6,7,8]);
                // Establece el estado inicial después de ocultarlas
                visibleState = false;
             }
 
             return {
                 table,
                 selectedId,
                 selectedRow
             };
 
         });
        
    }
        
     }

      //*PERMITE HACER EL MECANISMO OCULTAR/MAXIMIZAR CAMBIA EL ESTADO DE VISIBLE / NO VISIBLE
    const setVisibleState = (newValue) => {
        visibleState = newValue; // Actualiza la variable

    };

    //*PERMITE MAXIMIZAR LAS COLUMNAS
    if (btnmaximizarColumnas) {
        btnmaximizarColumnas.addEventListener('click', () => {
            // Llama al método con los parámetros correctos
            ConfigTable.maximizarColumnas(
                table,              // Instancia de la tabla
                visibleState,       // Estado actual (boolean dinámico)
                setVisibleState,    // Función callback para actualizar el estado
                [2, 6,7,8]  // Columnas a alternar
            );
        });
    }

     //*PERMITE REALIZAR LA BUSQUEDA DE ALGUN USUARIO
    function BuscarCatalogoComponente() {
        
        let searchTerm = inputBusquedaCatalogo.value;
        if (searchTerm) {
            inicializarDataTableCatalogoComponente(searchTerm);
        } else {
            inicializarDataTableCatalogoComponente(searchTerm = '');
        }
    }
    if (btnBuscarCatalogo) {
        
        btnBuscarCatalogo.addEventListener('click', BuscarCatalogoComponente);
    }



});
