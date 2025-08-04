
  const btonmanual=document.getElementById('btnmanual');
  const queryParams = new URLSearchParams(); // Inicializar queryParams
  const componenteoData = {};
 // Asegúrate de que la ruta sea correcta

//PARA ALERTAS TOAST SWEETALERT2
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




 function verDetallesComponenteQR() {
     const databusqueda = document.getElementById('qr-result').value;
    console.log(databusqueda);
    // Validar id
    if (!databusqueda) {
     
        Toast.fire({
                icon: "warning",
                title: "No se ha proporcionado ningun dato de búsqueda",

          });
        return;
    }

    const modal = $('#detallecomponenteQR');
    
    // Cerrar el modal si está abierto
    if (modal.hasClass('show')) {
        modal.modal('hide');
        modal.one('hidden.bs.modal', function () {
            console.log("Modal cerrado, recargando datos...",modal);
            cargarComponenteQR(databusqueda,modal);
        });
    } else {
        // Cargar detalles y abrir el modal
        cargarComponenteQR(databusqueda,modal);
    }
}

async function cargarComponenteQR(databusqueda,modal) {
    console.log("Cargando detalles del componente para:", databusqueda);
    console.log("Modal:", modal);
    const queryParams = new URLSearchParams({
        dataBusqueda: databusqueda,
    });

    try {
        const response = await fetch(`https://apirestcip.onrender.com/api/componentes/BusquedaComponenteCodigoTINumSerie?${queryParams}`, {
            method: 'POST', // Cambiado a GET
            headers: { 'Content-Type': 'application/json' } // Este encabezado no es necesario para GET
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

      
/*
        // Agregar filas a la tabla
        data.body.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.nombre_responsable}</td>
                <td>${row.nombre_unidad}</td>
                <td>${row.tipo_equipo}</td>
                <td>${row.marca}</td>
                <td>${row.modelo}</td>
                <td>${row.numero_serie}</td>
                <td>${row.codigo_TI}</td>
                <td>${row.operacion}</td>
                <td>${row.observaciones}</td>
                <td>${row.status_componente}</td>
                <td>${row.area}</td>
                <td>${row.status_inventario === 1 ? '<span class="text-success">Activo</span>' : '<span class="text-danger">Inactivo</span>'}</td>
            `;
            tableBody.appendChild(tr);
        });*/

        const idUnidad = String(data.body[0].id_unidad);
       
         // Convertir a cadena para manipulación
    // Verificar la longitud del ID y agregar ceros según sea necesario
    if (idUnidad.length === 1) {
        textoFormateado = '00'+idUnidad; // Agregar 2 ceros si tiene 1 dígito
    } else if (idUnidad.length === 2) {
        textoFormateado = '0'+idUnidad ; // Agregar 1 cero si tiene 2 dígitos
    } 
    else if(idUnidad.length === 3)
    {
             textoFormateado =idUnidad ; 
    }
   
    // Formatear las fechas
     fecha = data.body[0].FechaFactura;
     Fechafactura = General.ConversionFecha(fecha);
     fecha = data.body[0].FechaRegistro;
     fecharegistro = General.ConversionFecha(fecha);
     fecha = data.body[0].FechaCompra;
     fechacompra = General.ConversionFecha(fecha);


        // Limpiar contenido previo
        document.getElementById('idunidad').innerText =String(data.body[0].num_contrato_actual) + textoFormateado;
        document.getElementById('tecnicoregistro').innerText = data.body[0].nombre;
        document.getElementById('fecharegistro').innerText = fecharegistro;
        document.getElementById('fechacompra').innerText = fechacompra;
        document.getElementById('clienteservidor').innerText = data.body[0].EsClienteServidor;
        document.getElementById('numerofactura').innerText = data.body[0].NumeroFactura;
        document.getElementById('nombreproveedor').innerText = data.body[0].NombreProveedor;
        document.getElementById('lugarcompra').innerText = data.body[0].LugarCompra;
        document.getElementById('fechafactura').innerText =Fechafactura;
        document.getElementById('nombreResponsable').innerText = data.body[0].nombre_responsable;
        document.getElementById('nombreUnidad').innerText = data.body[0].nombre_unidad;
        document.getElementById('tipoEquipo').innerText = data.body[0].tipo_equipo;
        document.getElementById('marca').innerText = data.body[0].marca;
        document.getElementById('modelo').innerText = data.body[0].modelo;
        document.getElementById('numeroSerie').innerText = data.body[0].numero_serie;
        document.getElementById('codigoTI').innerText = data.body[0].codigo_TI;
        document.getElementById('operacion').innerText = data.body[0].operacion;
        document.getElementById('statusComponente').innerText = data.body[0].status_componente;
        document.getElementById('area').innerText = data.body[0].area;
        document.getElementById('statusInventario').innerText = data.body[0].status_inventario === 1 ? 'ACTIVO' : 'INACTIVO';
        // Mostrar el modal con Bootstrap 5
        const bootstrapModal = new bootstrap.Modal(document.getElementById('detallecomponenteQR'));
        bootstrapModal.show();

    } catch (error) {
        Toast.fire({
            icon: "error",
            title: "Error al cargar los detalles:  ",
        });
        console.log(error);
    }
}


          

async function Verificacion_Componente() {
 
   const componenteoData = {
        databusqueda: document.getElementById('qr-result').value,
    };

    console.log("componenteoData", componenteoData.databusqueda); // Imprimir el valor del campo de entrada
// Validar datos
    if (!componenteoData.databusqueda) {
        Toast.fire({
            icon: "warning",
            title: "Favor de llenar todos los campos",
        });
        return; // Salir de la función si hay un error
    }
    
// Construir parámetros de consulta
    const queryParams = new URLSearchParams({
        dataBusqueda: componenteoData.databusqueda,
    });
    

    try {
        // Usar comillas invertidas para la interpolación de cadenas
        const response = await fetch(`https://apirestcip.onrender.com/api/componentes/VerificarExistenciaComponente?${queryParams}`, {
            method: 'POST', // Cambiar a GET
            headers: { 'Content-Type': 'application/json' } // Este encabezado no es necesario para GET, pero no causa problemas
        });

        const result = await response.json(); // Obtener la respuesta JSON
console.log("Resultado de la búsqueda:", result.error);
         if (!response.ok) {
            // Si hay un error en la respuesta
            Swal.fire({
                icon: result.icon || "error",
                title: result.message || "Ocurrió un error al solicitar la búsqueda",
                showConfirmButton: true
            });
            return; // Salir de la función si hay un error
        }

           if (result.body.error === true) {
         Swal.fire({
            icon: result.body.icon || "warning",
            title: result.body.message || "No se encontró el componente",
            showConfirmButton: true
        });
          
        } 
     
        if (result.body.error === false) {
            console.log("si existe:");
             Swal.fire({
            icon: result.body.icon || "success",
            title: result.body.message || "Búsqueda realizada con éxito",
            showConfirmButton: true
        });

        localStorage.setItem('databusqueda', componenteoData.databusqueda);
        window.location.href = '/Mostrar_Info_Componente';
            // Enviar los datos obtenidos a otra ruta
            // Enviar los datos obtenidos a otra ruta
       
       
            
        btonmanual.disabled = true;

          
        } 
          console.log("error comparativo:", result.body.error);
            console.log("Resultado de la body:", result.body);
        

    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Ocurrió un error al solicitar la búsqueda",
            showConfirmButton: true
        });
        console.error(error);
    } finally {
        //submitButton.disabled = false; // Habilitar el botón nuevamente
    }
}

function close()
{
    const modal = $('#detallecomponenteQR');
    if (modal.hasClass('show')) {
        modal.modal('hide');
        modal.one('hidden.bs.modal', function () {
            console.log("Modal cerrado");
        });
    }
}

class General {
  static ConversionFecha(fecha) {
        const date = new Date(fecha);
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
        const anio = date.getFullYear();
        return `${dia}-${mes}-${anio}`; // Usar comillas invertidas para la interpolación
    }
    }




