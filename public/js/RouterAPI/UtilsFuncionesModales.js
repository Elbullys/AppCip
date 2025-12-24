import {
  conversionFecha, handleDataTableLoadingGET, General,
  handleDataTableLoadingPOST, handlePOST, handlePUT, cambiarLabelSwitch,
  obtenerValorRadioSeleccionado, obtenerEstadoSwitch, handleGET, URLAPI,ObtenerIdTecnicoSesion
  ,obtenerUsuarioLocalStorage
} from './Utils.js';

const api = URLAPI;
export class clsAreas{
 static BuscarArea(searchTerm,tipo_unidad) {
    
    if (searchTerm) {
      inicializarDataTableAreasPorTipoUnidad(searchTerm, tipo_unidad);
    } else {
      inicializarDataTableAreasPorTipoUnidad('', tipo_unidad);
    }
  }

  static inicializarDataTableAreasPorTipoUnidad(searchTerm = '', tipo_unidad) {
    
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
          data: { TipoUnidad: tipo_unidad },
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
    // FINALIZAR DATATABLE RESPONSABLE POR TIPO UNIDAD
}