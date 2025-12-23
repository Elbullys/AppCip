// const api ='https://apirestcip.onrender.com';
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

const StatePanelTecnico = {
    id_tecnico: null
};

document.addEventListener('DOMContentLoaded', () => {
    var table; // Variable global para la tabla
    var searchTerm = "";
    let visibleState = false; // Declarada aquí para manejar el estado de las columnas
    let urlEdit;
    const btnmaximizarColumnas = document.getElementById('btnMaximizartblTecnicos');//toggleColumns
    const btnBuscartecnico = document.getElementById('btnBuscartecnico');//BOTON BUSCAR TECNICO
    const btnagregartecnico = document.getElementById('btnagregartecnico');//BOTON ABRIR MODAL BOTON AGREGAR TECNICO
    const inputBusquedatecnico = document.getElementById('inputBusquedatecnico');//INPUT PERMITE INTRODUCIR BUSQUEDA
    const btnAbrirEditarTecnico = document.getElementById('btnAbrirEditarTecnico');//BOTON ABRIR MODAL EDITAR TECNICO
    const btnAbrirDetalleTecnico = document.getElementById('btnEditarVisualizarTecnico');
    //MODALES
    //*modal AGREGAR TECNICO
    const agregarTecnicoModal = new bootstrap.Modal(document.getElementById('agregarTecnicoModal'));//INICIALIZAR MODAL
    const btonsavetecnico = document.getElementById('btonsavetecnico');//BOTON SAVE TECNICO MODAL
    const btonclosetecnicomodal = document.getElementById('btonclosetecnicomodal');
    //*modal Editar TECNICO
    const modaleditartecnico = document.getElementById('EditarTecnicoModal');
    const EditarTecnicoModal = new bootstrap.Modal(modaleditartecnico);//INICIALIZAR MODAL
    const btnEditTecnico = document.getElementById('btnEditTecnico');//BOTON Edicion TECNICO MODAL
    const btnclosedittecnicomodal = document.getElementById('btnclosedittecnicomodal');
    let isChecked = false;
    //*modal Detalle TECNICO
    const modalDetalletecnico = document.getElementById('detalleTecnicoModal');
    const detalleTecnicoModal = new bootstrap.Modal(modalDetalletecnico);//INICIALIZAR MODAL


    //VARIABLES MODAL EDITAR TECNICO
    const idtecnicohidden = document.getElementById('idtecnicohidden');
    const inputnombretecnicoEdit = document.getElementById('inputnombretecnicoEdit');
    const inputusuariotecnicoEdit = document.getElementById('inputusuariotecnicoEdit');
    const inputpasswordEdit = document.getElementById('inputpasswordEdit');
    const inputpasswordrepetirEdit = document.getElementById('inputpasswordrepetirEdit');
    const selectcargoEdit = document.getElementById('selectcargoEdit');
    const selectEstatustecnicoEdit = document.getElementById('selectEstatustecnicoEdit');
    const selectisadminEdit = document.getElementById('selectisadminEdit');

    //INICIALIZAR TABLA TECNICOS

    inicializarDataTableTecnico(searchTerm);

     //LOCALSTORAGE NOMBRE DE USUARIO EN PERFIL 
           obtenerUsuarioLocalStorage();

    //*funcion PARA INICIALIZAR LA TBLA AL CARGAR
    function inicializarDataTableTecnico(searchTerm) {
        var url = `${api}/api/tecnicos/consultatecnicos`;

        let selectedRow = null;
        let selectedId = null;
        const configBase = {
            "columns": [
                {
                    "data": 'id_tecnico',
                    /*"render": function (data, type, row) {
                        // Aquí se guarda el ID de la primera fila. 
                        // NOTA: Si hay varias filas, solo se guarda el ID de la última.
                        id_componente = data;
                        return data;
                    }*/
                },
                { "data": 'nombre' },
                { "data": 'usuario' },
                { "data": 'cargo' },
                { "data": 'estatus_tecnico' },
                {
                    "data": 'IsAdmin',
                    "render": function (data, type, row) {
                        if (data === 1) {
                            return '<span class="text-success">SI</span>';
                        } else if (data === 0) {
                            return '<span class="text-danger">NO</span>';
                        } else {
                            return '<span class="text-warning">DESCONOCIDO</span>';
                        }
                    },
                    "title": "Es Administrador"
                }

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
        handleDataTableLoadingGET({
            url: url,
            data: { searchTerm: searchTerm },
            timeoutDuration: 60000,
        }).then((data) => {
            console.log("data", data);
            if (data && Array.isArray(data) && data.length > 0) { // Verificación de éxito
                // ASIGNAR LA INSTANCIA DE LA TABLA CREADA A LA VARIABLE 'table'
                table = $('#table_tecnicos').DataTable({
                    ...configBase,
                    data: data, // Usa los datos retornados
                });

                table.on('click', 'tr', function () {
                    var rowData = table.row(this).data();

                    // 1. Obtener datos y asignar ID
                    if (rowData && rowData.id_tecnico) {
                        StatePanelTecnico.id_tecnico = rowData.id_tecnico;

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
                        selectedId = rowData.id_tecnico;

                    }
                });

                //*OCULTAR COLUMNAS AL INICIAR
                ConfigTable.ocultarColumnas(table, [3, 4]);
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
                [3, 4]  // Columnas a alternar
            );
        });
    }
    //*PERMITE REALIZAR LA BUSQUEDA DE ALGUN USUARIO
    function BuscarTecnico() {
        let searchTerm = inputBusquedatecnico.value;
        if (searchTerm) {
            inicializarDataTableTecnico(searchTerm);
        } else {
            inicializarDataTableTecnico(searchTerm = '');
        }
    }
    if (btnBuscartecnico) {
        btnBuscartecnico.addEventListener('click', BuscarTecnico);
    }


    //*BOTON ABRIR MODAL AGREGAR TECNICO
    btnagregartecnico.addEventListener('click', function () {

        agregarTecnicoModal.show();

    });


    //*BOTON SAVE TECNICO EN MODAL
    btonsavetecnico.addEventListener('click', async function () {

        const inputnombretecnico = document.getElementById('inputnombretecnico');
        const inputusuariotecnico = document.getElementById('inputusuariotecnico');
        const inputpassword = document.getElementById('inputpassword');
        const inputpasswordrepetir = document.getElementById('inputpasswordrepetir');
        const selectcargo = document.getElementById('selectcargo');
        const selectEstatustecnico = document.getElementById('selectEstatustecnico');
        const selectisadmin = document.getElementById('selectisadmin');


        const validacion = await ValidarCamposTecnicos(inputnombretecnico.value, inputusuariotecnico.value, inputpassword.value, selectcargo.value, selectEstatustecnico.value, selectisadmin.value);

        if (validacion == false) {
            const Datatecnico = {
                nombre: inputnombretecnico.value,
                usuario: inputusuariotecnico.value,
                password: inputpassword.value,
                Passwordrepetir: inputpasswordrepetir.value,
                cargo: selectcargo.value,
                estatus_tecnico: selectEstatustecnico.value,
                IsAdmin: selectisadmin.value
            }

            if (Datatecnico.password != Datatecnico.Passwordrepetir) {
                Toast.fire({
                    icon: "warning",
                    title: "La contraseña no coincide",
                });
                return;
            }
            const config = {
                url: `${api}/api/tecnicos/AgregarTecnico`,
                data: Datatecnico,
                successTitle: 'Técnico agregado exitosamente',
            };

            const response = await handlePOST(config);
            console.log("response", response);

            Swal.fire({
                icon: response.data.icon || "success",
                title: response.data.tittle,
                text: response.data.message,
                showConfirmButton: false,
                timer: 2000          // Cierra automáticamente después de 2 segundos (1000 ms)


            });
            console.log("response.data.error", response.data.error);
            if (response.data.error === false) {


                setTimeout(() => {
                    General.resetearCampos('#formularioAgregarTecnico');
                    agregarTecnicoModal.hide();
                    //al recargar tabla limpiar campos
                    searchTerm = "";
                    inputBusquedatecnico.value = "";
                    visibleState = false;
                    inicializarDataTableTecnico(searchTerm);
                }, 2000);


            }

        }



    });
    //PERMITE DEICIDIR SI QUIERE CAMBIAR LA CONTRASEÑA
    $('#checkCambiarPassword').on('change', function () {
        isChecked = $(this).is(':checked');
        const $passFields = $('#seccionPassword input');

        if (isChecked) {
            console.log("isChecked", isChecked)
            $('#seccionPassword').slideDown(); // Muestra con animación
            $passFields.attr('required', true); // Hace los campos obligatorios
        } else {
            console.log("isChecked CAN", isChecked)
            $('#seccionPassword').slideUp(); // Oculta con animación
            $passFields.attr('required', false); // Quita el atributo requerido
            $passFields.val(''); // Opcional: Limpia los valores al ocultar
        }
    });

    //*cerrar modal limpiar campos
    btonclosetecnicomodal.addEventListener('click', function () {
        General.resetearCampos('#formularioAgregarTecnico');

    });



    //*BOTON ABRIR MODAL EDITAR TECNICO
    // BOTON ABRIR MODAL EDITAR TECNICO
    btnAbrirEditarTecnico.addEventListener('click', async function () {


        if (!StatePanelTecnico.id_tecnico) {
            Toast.fire({
                icon: "warning",
                title: "Elige un usuario",
                timer: 1000
            });
            return;
        }

        let id_tecnico = StatePanelTecnico.id_tecnico;


        const config = {
            url: `${api}/api/tecnicos/consultarportecnico`, // Asegúrate de que 'api' esté definida
            data: { id_tecnico: id_tecnico }
        };

        try {

            const response = await handleGETSinProgressBar(config);


            if (!response || !response.data) {
                console.warn('Respuesta inválida de handleGET: response o response.data es null/undefined');
                return;
            }

            const data = response.data.body[0];


            // Mostrar el modal solo si hay datos
            modaleditartecnico.removeAttribute('inert');
            EditarTecnicoModal.show();
            $('#EditarTecnicoModal').on('shown.bs.modal', function () {


                idtecnicohidden.value = data.id_tecnico;
                selectcargoEdit.value = data.cargo;
                inputnombretecnicoEdit.value = data.nombre;
                inputusuariotecnicoEdit.value = data.usuario;
                selectEstatustecnicoEdit.value = data.estatus_tecnico;
                selectisadminEdit.value = data.IsAdmin;

            });

            // Asignación de datos (descomentado y movido aquí para ejecutarse solo si hay data)



        } catch (error) {
            console.error("Error en la petición GET:", error); // Log del error en catch
            Toast.fire({
                icon: "error",
                title: "Error al consultar el técnico. Revisa la consola.",
            });
        }
    });

    //*BTON EDITAR TECNICO EN MODAL
    btnEditTecnico.addEventListener('click', async function () {


        const id_tecnico = document.getElementById('idtecnicohidden').value;
        let capturapassword;

        //CAMBIO DE CONTRASEÑA
        if (isChecked == true) {
            console.log("isChecked cambiemos contraseña", isChecked);
            if (inputpasswordEdit.value != inputpasswordrepetirEdit.value && inputpasswordEdit.value != '' && inputpasswordrepetirEdit.value != '') {
                Toast.fire({
                    icon: "warning",
                    title: "La contraseña no coincide o esta vacía",
                });
                return;

            }

            capturapassword = inputusuariotecnicoEdit.value;
            urlEdit = `${api}/api/tecnicos/EditartecnicoPorIDConPassword`;

        }
        else {
            capturapassword = "12345";
            console.log("isChecked false no cambiemos contraseña", isChecked);
            urlEdit = `${api}/api/tecnicos/EditartecnicoPorIDSinPassword`;
        }

        const validacion = await ValidarCamposTecnicos(inputnombretecnicoEdit.value, inputusuariotecnicoEdit.value, capturapassword, selectcargoEdit.value, selectEstatustecnicoEdit.value, selectisadminEdit.value);
        console.log("urlEdit", urlEdit);
        if (validacion == false) {
            console.log("validacion", validacion);
            //ASIGNACION A ARRAY  
            const TecnicoData = {
                nombre: inputnombretecnicoEdit.value,
                usuario: inputusuariotecnicoEdit.value,
                password: inputpasswordEdit.value,
                cargo: selectcargoEdit.value,
                estatus_tecnico: selectEstatustecnicoEdit.value,
                IsAdmin: selectisadminEdit.value,
            };
            try {
                const config = {
                    url: urlEdit,
                    id: id_tecnico,
                    data: TecnicoData,
                    //submitButtonId: 'btnEditarLavador',
                    //formId: 'formularioPersonal',
                    //modalId: 'editarEmpleadoLavadoModal',
                    //table: table, // Tu DataTable
                    successTitle: `¡Exito!`,
                    successMessage: `El técnico ${TecnicoData.nombre} ha sido modificado correctamente.`,
                };


                const response = await handlePUT(config);
                console.log("response", response);


                if (response.error === false && response.status == 200) {

                    setTimeout(() => {
                        General.resetearCampos('#EditarTecnicoEdit');
                        EditarTecnicoModal.hide();
                        StatePanelTecnico.id_tecnico = null;
                        searchTerm = "";
                        inputBusquedatecnico.value = "";
                        visibleState = false;
                        inicializarDataTableTecnico(searchTerm);
                    }, 2000);
                }

            } catch (error) {
                console.error("Error en la petición PUT:", error); // Log del error en catch

            }
        }


    });

    //*cerrar modal editar limpiar campos
    btnclosedittecnicomodal.addEventListener('click', function () {
        General.resetearCampos('#formularioAgregarTecnico');
        StatePanelTecnico.id_tecnico = null;

    });

    //*BOTON CONSULTA(DETALLE) MODAL AGREGAR TECNICO
    btnAbrirDetalleTecnico.addEventListener('click', async function () {


        if (typeof StatePanelTecnico.id_tecnico !== 'number' || StatePanelTecnico.id_tecnico <= 0) {

            Toast.fire({
                icon: "warning",
                title: "ID  inválido ",

            });
            return;
        }
        
        const config = {
            url: `${api}/api/tecnicos/consultarportecnico`, // URL específica
            timeoutDuration: 5000, // Opcional: ajusta el timeout si es necesario
            data: { id_tecnico: StatePanelTecnico.id_tecnico }
        };

        const response = await handleGET(config);
       
        const bodyData = response.data.body;
        const dataTecnico = (Array.isArray(bodyData) && bodyData.length > 0) ? bodyData[0] : null;
        // Verifica que el cuerpo de la respuesta contenga datos
        if (dataTecnico) {
            // Limpiar contenido previo
            const listGroup = document.querySelector('#detalleTecnicoContenido .list-group');
            listGroup.innerHTML = '';

        // Agregar información al modal
        listGroup.innerHTML = `
            <li class="list-group-item"><strong>ID Tecnico:</strong> ${dataTecnico.id_tecnico}</li>
            <li class="list-group-item"><strong>Nombre:</strong> ${dataTecnico.nombre}</li>
            <li class="list-group-item"><strong>Usuario:</strong> ${dataTecnico.usuario}</li>
            <li class="list-group-item"><strong>Cargo:</strong> ${dataTecnico.cargo}</li>
            <li class="list-group-item"><strong>Estatus del Técnico:</strong> ${dataTecnico.estatus_tecnico}</li>
            <li class="list-group-item"><strong>Es Administrador:</strong> ${dataTecnico.IsAdmin === 1 ? 'SI' : 'NO'}</li>
          
        `;

        }
        detalleTecnicoModal.show();

    });


});
//FUNCIONES
function ValidarCamposTecnicos(inputnombre, inputusuario, inputpassword, selectcargo, selectestatus_tecnico, selectisadmin) {
    const validarinputnombretecnico = General.validar_Campos_String(inputnombre, "El nombre");
    const validarinputusuariotecnico = General.username(inputusuario);
    const validarinputpassword = General.password(inputpassword);
    const validarselectcargo = General.validar_Campos_Select(selectcargo, "un cargo");
    const validarselectEstatustecnico = General.validar_Campos_Select(selectestatus_tecnico, "un Estatus");
    const validarselectisadmin = General.validar_Campos_Select(selectisadmin, "un dato");

    if (validarinputnombretecnico.error || validarinputusuariotecnico.error || validarinputpassword.error
        || validarselectEstatustecnico.error || validarselectcargo.error || validarselectisadmin.error
    ) {
        // Array de todas las validaciones para iterar
        const validations = [validarinputnombretecnico, validarinputusuariotecnico, validarinputpassword,
            validarselectcargo, validarselectEstatustecnico, validarselectisadmin
        ];

        // Encontrar la primera validación que falló
        const failedValidation = validations.find(val => val.error);


        Toast.fire({
            icon: failedValidation.icon,
            title: failedValidation.message,
        });

        return true;
    }
    return false;
}










