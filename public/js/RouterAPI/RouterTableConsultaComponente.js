const api='https://apirestcip.onrender.com'; 

async function cargarDetallesUsuario(idusuario, modal) {
    
    const url = `${api}/api/Usuarios/ConsultaUsuarioId/${idusuario}`; 

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        //console.log("Nombre:", data.body[0].Nombre);

        // Limpiar contenido previo
        const listGroup = document.querySelector('#detalleUsuarioContenido .list-group');
        listGroup.innerHTML = '';

        // Agregar información al modal
        listGroup.innerHTML = `
            <li class="list-group-item"><strong>ID Usuario:</strong> ${data.body[0].idusuario}</li>
            <li class="list-group-item"><strong>Nombre:</strong> ${data.body[0].nombre}</li>
            <li class="list-group-item"><strong>Puesto:</strong> ${data.body[0].NombrePuesto}</li>
            <li class="list-group-item"><strong>Status:</strong> ${data.body[0].status === 1 ? 'ACTIVO' : 'INACTIVO'}</li>
          
        `;

        // DECLARAMOS MODAL 
        const bootstrapModal = new bootstrap.Modal(document.getElementById('detalleUsuarioModal'));
        bootstrapModal.show();

    } catch (error) {
     
        Toast.fire({
                icon: "error",
                title: "Error al cargar los detalles:  ",

          });
          console.log(error)
    }
}