// auth.js - Función global para manejar autenticación y mostrar username
function loadUserFromStorage(tituloId = 'titulo', perfilId = 'username',avatar= 'profile-avatar') {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
        // Verifica y actualiza 'titulo' si existe (e.g., en /inicio)
        const tituloElement = document.getElementById(tituloId);
        const perfilElement = document.getElementById(perfilId);
         const avatarElement = document.querySelector('.profile-avatar');
        if (avatarElement) {
            avatarElement.classList.remove('hidden-until-loaded');  // Muestra la imagen
        }
         if (tituloElement) {
            tituloElement.textContent = storedUsername;
             tituloElement.classList.remove('hidden-until-loaded');
        
           
        }

        // Verifica y actualiza 'username' si existe (e.g., en navbar de todas las páginas)
        
        if (perfilElement) {
            perfilElement.textContent = storedUsername;
             perfilElement.classList.remove('hidden-until-loaded');
             
            
        }

        return storedUsername;  // Retorna para uso adicional
    } else {
     
        window.location.href = '/logintecnico';
        return null;
    }
}

// Opcional: Función para limpiar datos al logout
function clearUserStorage() {
    localStorage.removeItem('username');
    localStorage.removeItem('id_tecnico');
}

// Ejecuta automáticamente en todas las páginas (después de que el DOM cargue)
document.addEventListener('DOMContentLoaded', () => {
    loadUserFromStorage();  // Llama con IDs por defecto
});