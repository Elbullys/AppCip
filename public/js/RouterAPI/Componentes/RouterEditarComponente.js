const api = 'http://localhost:7000';
const idcomponente = document.getElementById('idcomponenteValue').textContent;




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
  }
});


//AL ABRIR LA PAGINA

window.onload = function () {
  // Inicializar DataTable al cargar la página
  InicializarFormulario();

  //var table = $('#table-componentes').DataTable(); 

  //ocultarColumnas();
  // Usar la función importada

  //const resultado=herencia.greet('Juan');  // Muestra: Hola, Juan!


}

async function InicializarFormulario() {
  // Reiniciar el formulario
  document.getElementById('FormEditComponente').reset();
  // Limpiar los campos de error
  const errorFields = document.querySelectorAll('.error');
  errorFields.forEach(field => field.textContent = '');
  //asignar a campo
  document.getElementById('txtidcomponente').value = idcomponente;

  const response = await fetch(`http://localhost:7000/api/componentes/ConsultarIdComponente/${idcomponente}`); // Cambia la URL según tu API

  if (!response.ok) {
    Toast.fire({
      icon: "error",
      title: "Error al obtener los datos",

    });
    console.error('Error al obtener los datos');
    return;
  }

  const data = await response.json();


  // Verifica que el cuerpo de la respuesta contenga datos
  if (data.body.length > 0) {
    const componente = data.body[0]; // Accede al primer elemento del array
    /* console.log(asesor.idAsesorServicio);
 console.log(asesor.nombre);
 console.log(asesor.puesto);
 console.log(idAsesorServicio);*/
    // Llenar el formulario con los datos del componente
    document.getElementById('txtcodigoti').value = componente.codigo_TI;

    IdUnidadValue = componente.id_unidad.toString();
    const operacion = componente.operacion.toString();
    const contratoid = componente.num_contrato_actual.toString();
    tipo_unidad = componente.tipo_unidad;

    if (operacion === 'GUANAJUATO') {
      document.getElementById('txtIdUnidad').value = General.concatenar_contrato_unidad(IdUnidadValue, contratoid);
    }
    else {
      document.getElementById('txtIdUnidad').value = componente.id_unidad;
    }

    document.getElementById('txtnombreunidad').value = componente.nombre_unidad;
    document.getElementById('txtoperacion').value = componente.operacion;
    document.getElementById('txtarea').value = componente.area;
    IdDispositivo=componente.id_dispositivo
    document.getElementById('txtIddispositivo').value =IdDispositivo;
    document.getElementById('txtdispositivo').value = componente.tipo_equipo;
    document.getElementById('txtIdCatalogo').value = componente.id_catalogo_componente;
    document.getElementById('txtnombrecatalogo').value = componente.marca + ' ' + componente.modelo;
    document.getElementById('txtdescripcioncatalogo').value = componente.descripcion_modelo;
    document.getElementById('txtnumeroserie').value = componente.numero_serie;
    EsClienteServidor = componente.EsClienteServidor;

    // Cargar PUESTOS
    //await SelectobtenerPuestos('AsignacionSelectPuestos'); // Llenar el select de PUESTOS
    // Seleccionar el color correspondiente
    //const selectpuesto = document.getElementById('AsignacionSelectPuestos');
    //selectpuesto.value = usuarios.IdPuesto; // Asegúrate de que este valor coincida con el value de las opciones

    document.getElementById('datefechacompra').value = conversionFecha(componente.FechaCompra);
    let clienteservidor = componente.EsClienteServidor.toString();
    console.log(clienteservidor);
    if (clienteservidor === 'SERVIDOR') {
      document.getElementById('chbxservidor').checked = true;
    }
    else if (clienteservidor === 'CLIENTE') {
      document.getElementById('chbxcliente').checked = true;
    }
    else if (clienteservidor === 'N/A') {
      document.getElementById('chbxna').checked = true;
    }
    document.getElementById('statusequiposelect').value = componente.status_componente.toString();
    document.getElementById('txidfactura').value = componente.IdFactura;
    document.getElementById('txtnumerofactura').value = componente.NumeroFactura;
    document.getElementById('txtnombreprovedor').value = componente.NombreProveedor;
    document.getElementById('txtlugarcompra').value = componente.LugarCompra;
    document.getElementById('txtfechafactura').value = conversionFecha(componente.FechaFactura);
    document.getElementById('txtobservacionfactura').value = componente.Observacion;

    // Abre el modal
    /*const modalElement = document.getElementById('editarUsuarioModal');
    const modal = new bootstrap.Modal(modalElement);

    // Asegúrate de que el modal no tenga el atributo inert
    modalElement.removeAttribute('inert');

    modal.show();

    // Agregar un evento para manejar el cierre del modal
    modalElement.addEventListener('hidden.bs.modal', function () {
      // Aquí puedes realizar acciones después de que el modal se haya cerrado
      modalElement.setAttribute('inert', ''); // Agregar inert al cerrar
    });
    */
  } else {
    Toast.fire({
      icon: "error",
      title: "No se encontraron datos para el Personal Solicitado",

    });
    console.error('No se encontraron datos para el Personal Solicitado');
  }

}





// Evento para botón buscar
function BuscarUnidad() {
  searchTerm = $('#inputBusqueda').val().trim();

  if (searchTerm) {

    inicializarDataTableUnidades(searchTerm);
  } else {

    inicializarDataTableUnidades('');
  }
}



//INICIO CLASES GENERALES PARA REUTILIZAR FUNCIONES
class General {
  //INICIO VALIDAR QUE EL CAMPO DE BUSQUEDA NO ESTE VACIO
  static validarBusqueda(searchTerm) {
    console.log(searchTerm);
    if (searchTerm === '' || searchTerm.length === 0) {
      Toast.fire({
        icon: "warning",
        title: "Por favor ingrese un término de búsqueda",
      });
      return;
    }

  }
  //FIN  VALIDAR QUE EL CAMPO DE BUSQUEDA NO ESTE VACIO

  //INICIO PERMITE CONCATENAR EL ID DE CONTRATO + ID UNIDAD PARA OPERACION GUANAJUATO DANDO COMO RESULTADO EL ID UNIDAD  Y NOMBRE COMPLETO
  static concatenar_contrato_unidad(idunidad, contratoid) {
    idunidad = String(idunidad);  // Asegura que sea cadena
    if (idunidad.length === 1) {
      return contratoid + '00' + idunidad;
    } else if (idunidad.length === 2) {
      return contratoid + '0' + idunidad;
    } else if (idunidad.length === 3) {
      return contratoid + idunidad;
    }
  }
}
//FIN CONCATENER ID CONTRATO + ID UNIDAD


//INICIO FUNCION PARA CONVERTIR FECHA A FORMATO ACEPTADO POR INPUT DATE
function conversionFecha(fecha) {
  // Extraer solo la parte de la fecha
  const extraerfecha = fecha.split('T')[0]; // Esto dará '2000-01-01'

  // Dividir la fecha en sus componentes
  const [anio, mes, dia] = extraerfecha.split('-'); // ['2000', '01', '01']

  // Reorganizar a formato 'DD-MM-YYYY' (si necesitas mostrarlo en otro lugar)
  const fechaFormateada = `${dia}-${mes}-${anio}`;


  // Retornar la fecha en formato 'YYYY-MM-DD' para el input de tipo date
  return extraerfecha; // Retorna '2000-01-01'
}
//FIN FUNCION PARA CONVERTIR FECHA A FORMATO ACEPTADO POR INPUT DATE


//FIN CLASES GENERALES PARA REUTILIZAR FUNCIONES




function resetearTabla() {
  var table = $('#table_Modal_Consulta').DataTable();
  // Limpiar input de búsqueda personalizado (si tienes)
  $('#inputBusqueda').val('');
  // Limpiar búsqueda interna de DataTables y refrescar tabla vacía
  table.search('').clear().draw();
  // Limpiar datos de la tabla
  table.clear().draw();
  // Remover selección de filas
  table.$('tr.selected').removeClass('selected');
}

/*//////////////////////////////////////////////////////////////////////////////////////////////////////////*/
//FUNCION CON PROGRESS BAR "GET" PARA OBTENER DATOS 

/*//////////////////////////////////////////////////////////////////////////////////////////////////////////*/
/*GET*/
// Función reutilizable para manejar el loader y la inicialización
async function handleDataTableLoadingGET(config) {
  const { url, data, timeoutDuration = 3000 } = config;

  // Validaciones iniciales
  if (!url) {
    console.error('Error: URL es requerida.');
    Swal.fire({
      title: 'Error',
      text: 'No se proporcionó una URL válida.',
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
    return [];
  }

  let progress = 0;
  const swalInstance = Swal.fire({
    title: 'Cargando datos... (0%)',
    text: 'Por favor, espera mientras se obtienen los datos. Conectando...',
    icon: 'info',
    allowOutsideClick: false,
    backdrop: true,
    didOpen: () => {
      Swal.showLoading();
      const progressInterval = setInterval(() => {
        progress += 5;
        if (progress > 100) progress = 100;
        Swal.getTitle().textContent = `Cargando datos... (${progress}%)`;
      }, 300);
      swalInstance._progressInterval = progressInterval;
    },
  });

  try {
    // Construye la URL con parámetros de consulta
    let fullUrl = url;
    if (data && typeof data === 'object' && Object.keys(data).length > 0) {
      const queryString = new URLSearchParams(data).toString();
      fullUrl += '?' + queryString;
    }

    const response = await fetch(fullUrl, {
      method: 'GET',
      signal: AbortSignal.timeout(timeoutDuration),
    });

    if (!response.ok) {
      throw new Error(`Error en la respuesta: ${response.statusText}`);
    }

    const json = await response.json();
    clearInterval(swalInstance._progressInterval);

    // Agrega un retraso mínimo antes de cerrar la alerta
    await new Promise(resolve => setTimeout(resolve, 1000));  // Espera 1 segundo
    Swal.close();

    console.log('Datos retornados:', json.body || []);
    return json.body || [];
  } catch (error) {
    clearInterval(swalInstance._progressInterval);
    Swal.close();  // Cierra inmediatamente en caso de error para no bloquear al usuario

    if (error.name === 'TimeoutError') {
      console.error('Error de timeout:', error);
      Swal.fire({
        title: 'Tiempo de espera agotado',
        text: 'Intenta de nuevo más tarde.',
        icon: 'warning',
      });
    } else {
      console.error('Error general:', error);
      Swal.fire({
        title: 'Error inesperado',
        text: 'Ocurrió un problema al cargar los datos.',
        icon: 'error',
      });
    }
    return [];
  }
}

/*POST*/
async function handleDataTableLoadingPOST(config) {
  const { url, data, timeoutDuration = 3000 } = config;



  let progress = 0;
  const swalInstance = Swal.fire({
    title: 'Cargando datos... (0%)',
    text: 'Por favor, espera mientras se obtienen los datos. Conectando...',
    icon: 'info',
    allowOutsideClick: false,
    backdrop: true,
    didOpen: () => {
      Swal.showLoading();
      const progressInterval = setInterval(() => {
        progress += 5;
        if (progress > 100) progress = 100;
        Swal.getTitle().textContent = `Cargando datos... (${progress}%)`;
      }, 300);
      swalInstance._progressInterval = progressInterval;
    },
  });

  try {
    const response = await fetch(url, {
      method: 'POST',  // Cambiado a POST
      headers: {
        'Content-Type': 'application/json',  // Agregado para indicar que el body es JSON
      },
      body: JSON.stringify(data),  // Agregado: Envía data como cuerpo JSON
      signal: AbortSignal.timeout(timeoutDuration),
    });
    if (!response.ok) {
      throw new Error(`Error en la respuesta: ${response.statusText}`);
    }
    const json = await response.json();
    clearInterval(swalInstance._progressInterval);
    // Agrega un retraso mínimo antes de cerrar la alerta
    await new Promise(resolve => setTimeout(resolve, 1000));  // Espera 1 segundo
    Swal.close();

    console.log('Datos retornados:', json.body || []);
    return json.body || [];
  }
  catch (error) {
    clearInterval(swalInstance._progressInterval);
    Swal.close();  // Cierra inmediatamente en caso de error para no bloquear al usuario

    if (error.name === 'TimeoutError') {
      console.error('Error de timeout:', error);
      Swal.fire({
        title: 'Tiempo de espera agotado',
        text: 'Intenta de nuevo más tarde.',
        icon: 'warning',
      });
    } else {
      console.error('Error general:', error);
      Swal.fire({
        title: 'Error inesperado',
        text: 'Ocurrió un problema al cargar los datos.',
        icon: 'error',
      });
    }
    return [];
  }
}

// Función reutilizable para manejar el loader y la inicialización


/*//////////////////////////////////////////////////////////////////////////////////////////////////////////*/
/*FUNCIONES DE MODALES, VENTANAS EMERGENTES */
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////*/
//MODAL TABLA UNIDADES
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////*/
//INICIO EVENTO TECLADO PARA ABRIR MODAL UNIDADES
document.getElementById('txtIdUnidad').addEventListener('keydown', function (event) {
  if (event.key === 'F1' || event.key === 'F2') {
    event.preventDefault(); // Evitar acción por defecto (como ayuda del navegador)
    document.getElementById('inputBusqueda').value = '';// Limpiar el campo de búsqueda al abrir el modal
    $('#consultaUnidadesModal').modal('show'); // Mostrar modal
    inicializarDataTableUnidades('');
  }
});
//FINALIZAR EVENTO TECLADO PARA ABRIR MODAL UNIDADES

// Evento para botón buscar Unidad en modal
function BuscarUnidad() {
  searchTerm = $('#inputBusqueda').val().trim();

  if (searchTerm) {

    inicializarDataTableUnidades(searchTerm);
  } else {

    inicializarDataTableUnidades('');
  }
}
// FIN Evento para botón buscar Unidad en modal

// INICIALIZAR DATATABLE UNIDADES
async function inicializarDataTableUnidades(searchTerm = '') {
  var url = `${api}/api/unidades/ConsultaPorUnidad`;

  // Declarar variables para la selección y la tabla
  let selectedId = null;
  let selectedRow = null;
  let table; // Declarar aquí

  // Desconectar eventos previos
  $('#table_Modal_Consulta tbody').off('dblclick', 'tr');
  $('#table_Modal_Consulta tbody').off('click', 'tr');
  $('#btnSeleccionar').off('click');

  // Configuración base
  const configBase = {
    columns: [
      { data: 'id_unidad', title: 'ID Unidad' },
      { data: 'tipo_unidad', title: 'Tipo de Unidad' },
      { data: 'nombre_unidad', title: 'Unidad' },
      { data: 'municipio', title: 'Municipio' },
      { data: 'Estado', title: 'Estado' },
      { data: 'estado_unidad', title: 'Status' }
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
    destroy: true
  };

  if (!searchTerm) {
    // Tabla vacía sin AJAX
    table = $('#table_Modal_Consulta').DataTable({
      ...configBase,
      data: []
    });
  } else {
    try {
      const dataFromServer = await handleDataTableLoadingPOST({
        url: url,
        data: { search: searchTerm },  // Pasa los datos para POST
        timeoutDuration: 60000  // Ajusta si es necesario
      });

      table = $('#table_Modal_Consulta').DataTable({
        ...configBase,
        data: dataFromServer  // Usa los datos retornados por handleDataTableLoading
      });

      // Ahora agrega los eventos, ya que la tabla está inicializada
      $('#table_Modal_Consulta tbody').on('dblclick', 'tr', function () {
        var data = table.row(this).data();
        if (data && data.id_unidad) {
          IdUnidadValue = data.id_unidad;
          contratoid = data.num_contrato_actual;
          operacion = data.Estado;
          if (operacion === 'GUANAJUATO') {
            document.getElementById('txtIdUnidad').value = General.concatenar_contrato_unidad(IdUnidadValue, contratoid);
          } else {
            document.getElementById('txtIdUnidad').value = data.id_unidad;
          }
          document.getElementById('txtnombreunidad').value = data.nombre_unidad;
          document.getElementById('txtoperacion').value = operacion;
          document.getElementById('txtarea').value = "";
          Toast.fire({
            icon: "info",
            title: "ID de unidad capturado",
            text: "El ID es: " + IdUnidadValue
          });
          searchTerm = '';
          $('#consultaUnidadesModal').modal('hide');
        } else {
          Toast.fire({
            icon: "error",
            title: "No se pudo capturar el ID"
          });
        }
      });

      $('#table_Modal_Consulta tbody').on('click', 'tr', function () {
        var data = table.row(this).data();
        if (data && data.id_unidad) {
          IdUnidadValue = data.id_unidad;
          contratoid = data.num_contrato_actual;
          operacion = data.Estado;
          nombre_unidad = data.nombre_unidad;
          tipo_unidad = data.tipo_unidad;

          if (selectedRow && selectedRow.length > 0) {
            selectedRow.removeClass('selected-row table-active');
            selectedRow.find('td').removeClass('selected-cell');
          }

          $(this).removeClass('odd even hover');
          $(this).find('td').removeClass('odd even hover');

          $(this).addClass('selected-row');
          $(this).find('td').addClass('selected-cell');

          selectedRow = $(this);
          selectedId = data.id_unidad;

          table.cells().invalidate();
        }
      });

      $('#btnSeleccionar').on('click', function (e) {
        e.preventDefault();
        if (selectedId) {
          if (operacion === 'GUANAJUATO') {
            document.getElementById('txtIdUnidad').value = General.concatenar_contrato_unidad(IdUnidadValue, contratoid);
          } else {
            document.getElementById('txtIdUnidad').value = IdUnidadValue;
          }
          document.getElementById('txtnombreunidad').value = nombre_unidad;
          document.getElementById('txtoperacion').value = operacion;
          document.getElementById('txtarea').value = "";
          Toast.fire({
            icon: "info",
            title: "ID de unidad capturado",
            text: "El ID es: " + IdUnidadValue
          });
          searchTerm = '';
          $('#consultaUnidadesModal').modal('hide');
        } else {
          Toast.fire({
            icon: "warning",
            title: "Selecciona una fila primero",
            text: "Haz clic en una fila de la tabla para seleccionarla."
          });
        }
      });
    } catch (error) {
      console.error('Error al cargar datos:', error);
      Toast.fire({
        icon: "error",
        title: "Error en la carga",
        text: "Ocurrió un problema al obtener los datos."
      });
      // Inicializa la tabla con datos vacíos en caso de error
      table = $('#table_Modal_Consulta').DataTable({
        ...configBase,
        data: []
      });
    }
  }
}

// FINALIZAR DATATABLE UNIDADES


/*////////////////////////////////////////////////////////////////////////////////////////////////////////////*

//MODAL TABLA Area(Ubicacion)

/*//////////////////////////////////////////////////////////////////////////////////////////////////////////*/ 
//INICIO EVENTO TECLADO PARA ABRIR MODAL AREAS (UBICACION)
document.getElementById('txtarea').addEventListener('keydown', function (event) {
  if (event.key === 'F1' || event.key === 'F2') {
    event.preventDefault(); // Evitar acción por defecto (como ayuda del navegador)

    if (!tipo_unidad) {
      Toast.fire({
        icon: "warning",
        title: "Dato no Válido",

      });
    }
    else {
      document.getElementById('inputBusquedaArea').value = '';// Limpiar el campo de búsqueda al abrir el modal
      $('#consultaAreasModal').modal('show'); // Mostrar modal
      inicializarDataTableAreasPorTipoUnidad(searchTerm = '', tipo_unidad);

    }



  }
});

//FINALIZAR EVENTO TECLADO PARA ABRIR MODAL AREAS (UBICACION)

// Evento para botón buscar AREA en modal
function BuscarArea() {
  searchTerm = $('#inputBusquedaArea').val().trim();

  if (searchTerm) {

    inicializarDataTableAreasPorTipoUnidad(searchTerm, tipo_unidad);
  } else {

    inicializarDataTableAreasPorTipoUnidad('');
  }
}
// FIN Evento para botón buscar AREA en modal

// INICIALIZAR DATATABLE AREAS POR TIPO UNIDAD
function inicializarDataTableAreasPorTipoUnidad(searchTerm = '', tipo_unidad) {
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
      console.log('Entrando en then con data:', data);  // Log para depuración
      if (data && Array.isArray(data) && data.length > 0) {  // Verificación de éxito
        table = $('#table_Modal_ConsultaArea').DataTable({
          ...configBase,
          data: data,  // Usa los datos retornados
        });

        // Agrega eventos aquí
        $('#table_Modal_ConsultaArea tbody').on('dblclick', 'tr', function (event) {

          var rowData = table.row(this).data();
          if (rowData && rowData.id_area) {
            IdArea = rowData.id_area;
            Nombre_Area = rowData.area;
            document.getElementById('txtarea').value = rowData.area;
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
            IdArea = rowData.id_area;
            Nombre_Area = rowData.area;

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
            document.getElementById('txtarea').value = Nombre_Area;
            Swal.fire({
              icon: "info",
              title: "Área capturada",
              text: "El área es: " + Nombre_Area
            });
            $('#consultaAreasModal').modal('hide');
          } else {
            Swal.fire({
              icon: "warning",
              title: "Selecciona una fila primero",
              text: "Haz clic en una fila de la tabla para seleccionarla."
            });
          }
        });
      } else {
        console.log('No se recibieron datos válidos en then:', data);
        Swal.fire({
          icon: "warning",
          title: "No se recibieron datos",
          text: "Intenta nuevamente o verifica la solicitud."
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
      data: { TipoUnidad: tipo_unidad, searchTerm: searchTerm },
      timeoutDuration: 60000,
    }).then((data) => {
      console.log('Datos recibidos en then:', data);
      if (data && Array.isArray(data) && data.length > 0) {
        table = $('#table_Modal_ConsultaArea').DataTable({
          ...configBase,
          data: data,
        });
        // Agrega eventos aquí si es necesario
      } else {
        console.log('No se recibieron datos válidos');
        Swal.fire({
          icon: "warning",
          title: "No se recibieron datos",
          text: "Intenta nuevamente."
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
// FINALIZAR DATATABLE AREAS POR TIPO UNIDAD


/*////////////////////////////////////////////////////////////////////////////////////////////////////////////*

//MODAL TABLA Dispositivo

/*//////////////////////////////////////////////////////////////////////////////////////////////////////////*/ 

//INICIO EVENTO TECLADO PARA ABRIR MODAL DISPOSITIVOS
document.getElementById('txtIddispositivo').addEventListener('keydown', function (event) {
  if (event.key === 'F1' || event.key === 'F2') {
    event.preventDefault(); // Evitar acción por defecto (como ayuda del navegador)
    document.getElementById('inputBusquedadispositivo').value = '';// Limpiar el campo de búsqueda al abrir el modal
    $('#consultaDispositivosModal').modal('show'); // Mostrar modal
    inicializarDataTableDispositivos(searchTerm = '');

  }
});
//FINALIZAR EVENTO TECLADO PARA ABRIR MODAL DISPOSITIVOS

// Evento para botón buscar DISPOSITIVOS en modal
function BuscarDispositivo() {
  searchTerm = $('#inputBusquedadispositivo').val().trim();

  if (searchTerm) {

    inicializarDataTableDispositivos(searchTerm);
  } else {

    inicializarDataTableDispositivos('');
  }
}
// FIN Evento para botón buscar DISPOSITIVOS en modal
// INICIALIZAR DATATABLE DISPOSITIVOS
function inicializarDataTableDispositivos(searchTerm = '') {
  var url = `${api}/api/dispositivos/ConsultaPorDispositivosBusqueda`;
  // Declarar variables locales para la selección y la tabla
  let selectedId = null;
  let selectedRow = null;
  let table;

  // Desconectar eventos previos para evitar duplicados (siempre al inicio)
  $('#table_Modal_ConsultaDispositivos tbody').off('dblclick', 'tr');
  $('#table_Modal_ConsultaDispositivos tbody').off('click', 'tr');
  $('#btnBuscar').off('click');

  // Configuración base común
  // Configuración base personalizada para filtro en modal de áreas
  const configBase = {
    columns: [
      { data: 'id_dispositivo', title: 'ID Dispositivo' },
      { data: 'tipo_equipo', title: 'Dispositivo' },
      { data: 'abreviatura_tipo', title: 'Abreviatura' },
      { data: 'descripcion_equipo', title: 'Descripción' },
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

  if (!searchTerm) {
     // Tabla vacía sin AJAX
    table = $('#table_Modal_ConsultaDispositivos').DataTable({
      ...configBase,
      data: []
    });
  } else {
    handleDataTableLoadingGET({
      url: url,
      data: { searchTerm: searchTerm },
      timeoutDuration: 60000,
    }).then((data) => {

      if (data && Array.isArray(data) && data.length > 0) {
        table = $('#table_Modal_ConsultaDispositivos').DataTable({
          ...configBase,
          data: data,
        });
        // Agrega eventos 
// EVENTOS PARA SELECCIONAR FILA Y CAPTURAR ID DISPOSITIVO DOBLE CLIC
        $('#table_Modal_ConsultaDispositivos tbody').on('dblclick', 'tr', function (event) {

          var rowData = table.row(this).data();
          if (rowData && rowData.id_dispositivo) {
            IdDispositivo = rowData.id_dispositivo;
            Dispositivo = rowData.tipo_equipo;
            AbrDispositivo = rowData.abreviatura_tipo;
            document.getElementById('txtIddispositivo').value = IdDispositivo;
            document.getElementById('txtdispositivo').value = Dispositivo;
            $('#consultaDispositivosModal').modal('hide');
          } else {
            Swal.fire({
              icon: "error",
              title: "No se pudo capturar el ID"
            });
          }
        });

        // Evento de clic para seleccionar fila
        $('#table_Modal_ConsultaDispositivos tbody').on('click', 'tr', function () {
          var rowData = table.row(this).data();
          if (rowData && rowData.id_dispositivo) {
            IdDispositivo = rowData.id_dispositivo;
            Dispositivo = rowData.tipo_equipo;
            AbrDispositivo = rowData.abreviatura_tipo;
            if (selectedRow && selectedRow.length > 0) {
              selectedRow.removeClass('selected-row table-active');
              selectedRow.find('td').removeClass('selected-cell');
            }

            $(this).removeClass('odd even hover');
            $(this).find('td').removeClass('odd even hover');

            $(this).addClass('selected-row');
            $(this).find('td').addClass('selected-cell');

            selectedRow = $(this);
            selectedId = rowData.id_dispositivo;

            table.cells().invalidate();
          }
        });
//BOTON SELECCIONAR DISPOSITIVO
        $('#btnSeleccionardispositivo').on('click', function (e) {
          e.preventDefault();
          if (selectedId) {
               document.getElementById('txtIddispositivo').value = IdDispositivo;
            document.getElementById('txtdispositivo').value = Dispositivo;
            Swal.fire({
              icon: "info",
              title: "dispositivo capturada",
              text: "El dispositivo es: " + AbrDispositivo
            });
            $('#consultaDispositivosModal').modal('hide');
          } else {
            Swal.fire({
              icon: "warning",
              title: "Selecciona una fila primero",
              text: "Haz clic en una fila de la tabla para seleccionarla."
            });
          }
        });
      } else {
       
        Swal.fire({
          icon: "warning",
          title: "No se recibieron datos",
          text: "Intenta nuevamente o verifica la solicitud."
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


/*////////////////////////////////////////////////////////////////////////////////////////////////////////////*

//MODAL TABLA CATALOGO COMPONENTES

/*//////////////////////////////////////////////////////////////////////////////////////////////////////////*/ 

//INICIO EVENTO TECLADO PARA ABRIR MODAL CATALOGO COMPONENTES
document.getElementById('txtIdCatalogo').addEventListener('keydown', function (event) {
  if (event.key === 'F1' || event.key === 'F2') {
    event.preventDefault(); // Evitar acción por defecto (como ayuda del navegador)
    //document.getElementById('inputBusquedadispositivo').value = '';// Limpiar el campo de búsqueda al abrir el modal
    $('#consultaCatalogoComponenteModal').modal('show'); // Mostrar modal
    console.log('IdDispositivo antes de inicializarDataTableCatalogoComponentePorDispositivo:', IdDispositivo);
    inicializarDataTableCatalogoComponentePorDispositivo(searchTerm = '',IdDispositivo);

  }
});
//FINALIZAR EVENTO TECLADO PARA ABRIR MODAL CATALOGO COMPONENTES
// Evento para botón buscar AREA en modal
function BuscarCatalogoComponente() {
  searchTerm = $('#inputBusquedaCatalogo').val().trim();

  if (searchTerm) {

    inicializarDataTableCatalogoComponentePorDispositivo(searchTerm, IdDispositivo);
  } else {

    inicializarDataTableCatalogoComponentePorDispositivo('');
  }
}
// FIN Evento para botón buscar AREA en modal


// INICIALIZAR DATATABLE CATALOGO COMPONENTES POR DISPOSITIVO
function inicializarDataTableCatalogoComponentePorDispositivo(searchTerm = '', IdDispositivo) {
  var urlBusquedaCatalogoComponentePorDispositivo = `${api}/api/CatalogosComponentes/ConsultaCatalogosPorDispositivoBusqueda`;
  var urlTodosCatalogoComponentePorDispositivo = `${api}/api/CatalogosComponentes/ConsultaTodosCatalogoPorDispositivo`;

  // Declarar variables locales para la selección y la tabla
  let selectedId = null;
  let selectedRow = null;
  let table;


  // Desconectar eventos previos para evitar duplicados (siempre al inicio)
  $('#table_Modal_ConsultaCatalogoComponente tbody').off('dblclick', 'tr');
  $('#table_Modal_ConsultaCatalogoComponente tbody').off('click', 'tr');
  $('#btnSeleccionarCatalogo').off('click');

  // Configuración base común
  // Configuración base personalizada para filtro en modal de áreas
  const configBase = {
    columns: [
      { data: 'nombre_catalogo', title: 'Nombre Cátalogo' },
      
      { data: 'tipo_equipo', title: 'Dispositivo' },
      { data: 'marca', title: 'Marca' },
      { data: 'modelo', title: 'Modelo' },
      { data: 'Procesador', title: 'Procesador' },
      { data: 'Memoria Ram', title: 'Memoria Ram' },
      { data: 'Disco Duro', title: 'Disco Duro' },
      { data: 'Sistema Operativo', title: 'Sistema Operativo' }
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
    destroy: true // Opción clave: destruye automáticamente si ya existe

  };

  // Uso en tu función principal
  if (!searchTerm) {
    handleDataTableLoadingGET({
      url: urlTodosCatalogoComponentePorDispositivo,
      data: { IdDispositivo: IdDispositivo },
      timeoutDuration: 60000,
    }).then((data) => {
     
      if (data && Array.isArray(data) && data.length > 0) {  // Verificación de éxito
        table = $('#table_Modal_ConsultaCatalogoComponente').DataTable({
          ...configBase,
          data: data,  // Usa los datos retornados
        });

        // Agrega eventos aquí
        $('#table_Modal_ConsultaCatalogoComponente tbody').on('dblclick', 'tr', function (event) {

          var rowData = table.row(this).data();
          if (rowData && rowData.id_catalogo_componente) {
            IdCatalogoComponente = rowData.id_catalogo_componente;
            Nombre_Catalogo = rowData.nombre_catalogo;
            Descripcion = rowData.descripcion_modelo;
            marca = rowData.marca;
            modelo = rowData.modelo;
            procesador = rowData.Procesador;
            memoria_ram = rowData['Memoria Ram'];
            disco_duro = rowData['Disco Duro'];
            sistema_operativo = rowData['Sistema Operativo'];
            document.getElementById('txtIdCatalogo').value = IdCatalogoComponente;
            document.getElementById('txtnombrecatalogo').value = Nombre_Catalogo;
            document.getElementById('txtdescripcioncatalogo').value = Descripcion;
            
            $('#consultaCatalogoComponenteModal').modal('hide');
          } else {
            Swal.fire({
              icon: "error",
              title: "No se pudo capturar el ID"
            });
          }
        });

        $('#table_Modal_ConsultaCatalogoComponente tbody').on('click', 'tr', function () {
          var rowData = table.row(this).data();
          if (rowData && rowData.id_catalogo_componente) {
            IdCatalogoComponente = rowData.id_catalogo_componente;
            Nombre_Catalogo = rowData.nombre_catalogo;
            Descripcion = rowData.descripcion_modelo;
            marca = rowData.marca;
            modelo = rowData.modelo;
            procesador = rowData.Procesador;
            memoria_ram = rowData['Memoria Ram'];
            disco_duro = rowData['Disco Duro'];
            sistema_operativo = rowData['Sistema Operativo'];

            if (selectedRow && selectedRow.length > 0) {
              selectedRow.removeClass('selected-row table-active');
              selectedRow.find('td').removeClass('selected-cell');
            }

            $(this).removeClass('odd even hover');
            $(this).find('td').removeClass('odd even hover');

            $(this).addClass('selected-row');
            $(this).find('td').addClass('selected-cell');

            selectedRow = $(this);
            selectedId = rowData.id_catalogo_componente;

            table.cells().invalidate();
          }
        });

        $('#btnSeleccionarCatalogo').on('click', function (e) {
          e.preventDefault();
          if (selectedId) {
            document.getElementById('txtIdCatalogo').value = IdCatalogoComponente;
            document.getElementById('txtnombrecatalogo').value = Nombre_Catalogo;
            document.getElementById('txtdescripcioncatalogo').value = Descripcion;
            $('#consultaCatalogoComponenteModal').modal('hide');
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
      url: urlBusquedaCatalogoComponentePorDispositivo,
      data: { IdDispositivo: IdDispositivo, searchTerm: searchTerm },
      timeoutDuration: 60000,
    }).then((data) => {

      if (data && Array.isArray(data) && data.length > 0) {
        table = $('#table_Modal_ConsultaCatalogoComponente').DataTable({
          ...configBase,
          data: data,
        });
        // Agrega eventos aquí si es necesario
        // Agrega eventos aquí
        $('#table_Modal_ConsultaCatalogoComponente tbody').on('dblclick', 'tr', function (event) {

          var rowData = table.row(this).data();
          if (rowData && rowData.id_catalogo_componente) {
            IdCatalogoComponente = rowData.id_catalogo_componente;
            Nombre_Catalogo = rowData.nombre_catalogo;
            Descripcion = rowData.descripcion_modelo;
            marca = rowData.marca;
            modelo = rowData.modelo;
            procesador = rowData.Procesador;
            memoria_ram = rowData['Memoria Ram'];
            disco_duro = rowData['Disco Duro'];
            sistema_operativo = rowData['Sistema Operativo'];
            document.getElementById('txtIdCatalogo').value = IdCatalogoComponente;
            document.getElementById('txtnombrecatalogo').value = Nombre_Catalogo;
            document.getElementById('txtdescripcioncatalogo').value = Descripcion;
            
            $('#consultaCatalogoComponenteModal').modal('hide');
          } else {
            Swal.fire({
              icon: "error",
              title: "No se pudo capturar el ID"
            });
          }
        });

        $('#table_Modal_ConsultaCatalogoComponente tbody').on('click', 'tr', function () {
          var rowData = table.row(this).data();
          if (rowData && rowData.id_catalogo_componente) {
            IdCatalogoComponente = rowData.id_catalogo_componente;
            Nombre_Catalogo = rowData.nombre_catalogo;
            Descripcion = rowData.descripcion_modelo;
            marca = rowData.marca;
            modelo = rowData.modelo;
            procesador = rowData.Procesador;
            memoria_ram = rowData['Memoria Ram'];
            disco_duro = rowData['Disco Duro'];
            sistema_operativo = rowData['Sistema Operativo'];

            if (selectedRow && selectedRow.length > 0) {
              selectedRow.removeClass('selected-row table-active');
              selectedRow.find('td').removeClass('selected-cell');
            }

            $(this).removeClass('odd even hover');
            $(this).find('td').removeClass('odd even hover');

            $(this).addClass('selected-row');
            $(this).find('td').addClass('selected-cell');

            selectedRow = $(this);
            selectedId = rowData.id_catalogo_componente;

            table.cells().invalidate();
          }
        });

        $('#btnSeleccionarCatalogo').on('click', function (e) {
          e.preventDefault();
          if (selectedId) {
            document.getElementById('txtIdCatalogo').value = IdCatalogoComponente;
            document.getElementById('txtnombrecatalogo').value = Nombre_Catalogo;
            document.getElementById('txtdescripcioncatalogo').value = Descripcion;
            $('#consultaCatalogoComponenteModal').modal('hide');
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
// FINALIZAR DATATABLE AREAS POR TIPO UNIDAD