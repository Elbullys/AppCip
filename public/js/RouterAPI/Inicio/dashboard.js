import { handleGET, URLAPI,handleGETSinProgressBar } from '../Utils.js';  // Agregado handlePOST para consistencia; removido textInputs si no lo usas

const api = URLAPI;
const cacheKey = 'cacheConsRetTransito';
const cacheKeyChart = 'TipoUnidad';
const cacheKeyChartActivoBaja='CharActivoBAJA';
let data;

document.addEventListener('DOMContentLoaded', async () => {

    const btnlogout = document.getElementById('logout');
    //const titulo = document.getElementById('titulo');
    const nombreperfil = document.getElementById('username');//username
     nombreperfil.classList.remove('hidden-until-loaded');
    const contadortransito = document.getElementById('equiposEnTransitoContador');
    const MovComponentesContador = document.getElementById('MovComponentesContador');
    const MantPreventivoContador = document.getElementById('MantPreventivoContador');
    const MantCorrectivoContador = document.getElementById('MantCorrectivoContador');

    fetchComponentes().then(parsedData => {
        // Renderiza datos (ej. en un div)
        console.log("data ejecutado fetch componnete", parsedData);
        const conteoMantoCorrectivo = parsedData.mantenimientoCorrectivo;
        const conteoMantPreventivo = parsedData.mantenimientoPreventivo;
        const conteoMovComponente = parsedData.movimientoComponente;
        const conteoRetiroTransito =parsedData.retiroEnTransito;

        contadortransito.textContent = conteoRetiroTransito;
        MovComponentesContador.textContent = conteoMovComponente;
        MantPreventivoContador.textContent = conteoMantPreventivo;
        MantCorrectivoContador.textContent = conteoMantoCorrectivo;

       

        //document.getElementById('dashboard').innerHTML = data.map(item => `<p>${item.area}: ${item.count}</p>`).join('');
    });

    fetchChart().then(data => {
        if (Array.isArray(data) && data.length > 0) {
             renderChart(data); // ✅ Solo llama a renderChart si hay datos válidos
        } else {
             console.warn("No se pudo renderizar el gráfico: Datos no válidos o vacíos.");
        }

    });
      fetchChartActivoNBaja().then(data => {
        if (Array.isArray(data) && data.length > 0) {
             renderChartActivoBaja(data); // ✅ Solo llama a renderChart si hay datos válidos
        } else {
             console.warn("No se pudo renderizar el gráfico: Datos no válidos o vacíos.");
        }

    });
  


    const shouldVerify = window.location.pathname === '/inicio';  // O tu lógica
    if (shouldVerify) {
        const urlProtected = `${api}/api/logintecnicos/protected`;
        try {
            const response = await fetch(urlProtected, {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                // Actualiza localStorage y UI con datos frescos
                localStorage.setItem('username', data.data.usuario);
                
                nombreperfil.textContent = localStorage.getItem('username');

            } else if (response.status === 401) {
                // Limpia localStorage y redirige
                localStorage.removeItem('username');
                window.location.href = '/logintecnico';
            }
        } catch (error) {
            console.error('Error al verificar sesión:', error);
            // No rediriges aquí para no interrumpir la UX; solo loguea
        }
    }


    btnlogout.addEventListener('click', async function (event) {
        event.preventDefault();
        console.log('Cerrando sesión...');
        // Limpia localStorage y redirige
        localStorage.removeItem('username');

         //CACHE DATOS TRANSITO, MOV DIA, CORRECTIVO Y PREVENTIVO
         localStorage.removeItem(cacheKey);
        localStorage.removeItem(cacheKey + '_time');
        //CACHE DATOS CHARTS
         localStorage.removeItem(cacheKeyChart);
        localStorage.removeItem(cacheKeyChart + '_time');

        try {//`${api}/api/componentes/BusquedaComponenteCodigoTINumSerie
            // 1. Enviar la solicitud POST al servidor para limpiar la cookie
            const response = await fetch(`${api}/api/logintecnicos/logouttecnico`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log("response.ok", response);
            if (response.ok) {
                // 1. Redirige solo si la respuesta del servidor fue exitosa (código 200-299)
                window.location.href = '/logintecnico';
            } else {
                console.error('Error del servidor al cerrar sesión.');
                // Puedes mostrar un SweetAlert si tienes uno
            }
        } catch (error) {
            console.error('Error de conexión:', error);
        }


    });
});

// Función para obtener datos con cache local
async function fetchComponentes() {

    const cached = localStorage.getItem(cacheKey);
    const cacheTime = localStorage.getItem(cacheKey + '_time');
    const now = Date.now();
    ;

    // Si hay cache y no ha expirado (ej. 1 hora)
    if (cached && cacheTime && (now - cacheTime) < 3600000) {
        console.log('Datos desde localStorage fecth');
        try {
            const parsedData = JSON.parse(cached);
            return parsedData;  // Devuelve el valor cacheado (ej. 8)
        } catch (error) {
            console.error('Error al parsear cache, limpiando:', error);
            localStorage.removeItem(cacheKey);
            localStorage.removeItem(cacheKey + '_time');
        }
    }
    const config = {
        url: `${api}/api/reportes/reporteDashboard/consultaretirostransito`, // URL específica
        timeoutDuration: 5000, // Opcional: ajusta el timeout si es necesario
        // data: {} // Opcional: no se pasa si no hay query params
    };
    try {
        const response = await handleGET(config);
        console.log("Respuesta completa:", response);
        // Asume que response.data es el array [{ EquiposEnTransito: 8 }]
        // Verifica si response tiene body y es válida
       // Verifica si la respuesta es válida
        if (!response || !response.data) {
            console.warn('Respuesta inválida de handleGET');
            return 0;
        }
        const data = response.data.body;
        
        console.log("Data extraída (body):", data.mantenimientoCorrectivo);
        if (data) {
            console.log("entro array");
            // Guarda con JSON.stringify
            localStorage.setItem(cacheKey, JSON.stringify(data));
            localStorage.setItem(cacheKey + '_time', now.toString());
            return data;
        } else {
            console.warn('Datos inválidos de la API:', data);
            return 0;
        }
    } catch (error) {
        console.error('Error en fetchComponentes:', error);
        return 0;  // Fallback
    }
}

async function fetchChart() {

    const cached = localStorage.getItem(cacheKeyChart);
    const cacheTime = localStorage.getItem(cacheKeyChart + '_time');
    const now = Date.now();

    // Si hay cache y no ha expirado (ej. 1 hora)
    if (cached && cacheTime && (now - cacheTime) < 3600000) {
        console.log('Datos desde localStorage');
        try {
            const data = JSON.parse(cached);
            console.log("data cache chart", data);
            
            return data;  // Devuelve el valor cacheado (ej. 8)
        } catch (error) {
            console.error('Error al parsear cache, limpiando:', error);
            localStorage.removeItem(cacheKeyChart);
            localStorage.removeItem(cacheKeyChart + '_time');
            
        }
    }
    const config = {
        url: `${api}/api/reportes/reporteDashboard/ConsultaComponentesChartCoteoTipoUnidad`, // URL específica
        timeoutDuration: 5000, // Opcional: ajusta el timeout si es necesario
        // data: {} // Opcional: no se pasa si no hay query params
    };
    try {
        const response = await handleGETSinProgressBar(config);
        console.log("Respuesta completa:", response);
        // Asume que response.data es el array [{ EquiposEnTransito: 8 }]
        // Verifica si response tiene body y es válida
       // Verifica si la respuesta es válida
        if (!response || !response.data) {
            console.warn('Respuesta inválida de handleGET');
            return 0;
        }
        const data = response.data.body;
        
        console.log("Data extraída (body):", data.mantenimientoCorrectivo);
        if (data) {
            console.log("entro array");
            // Guarda con JSON.stringify
            localStorage.setItem(cacheKeyChart, JSON.stringify(data));
            localStorage.setItem(cacheKeyChart + '_time', now.toString());
            return data;
        } else {
            console.warn('Datos inválidos de la API:', data);
            return 0;
        }
    } catch (error) {
        console.error('Error en fetchComponentes:', error);
        return 0;  // Fallback
    }
}

// Función para renderizar el gráfico (agrega esto fuera de fetchChart)
function renderChart(chartData) {
       // Extrae etiquetas y valores
    const labels = chartData.map(item => item.tipo_unidad);  // ["CEDIS GUANAJUATO", "HOSPITAL", ...]
    const dataValues = chartData.map(item => item.Total_Componentes);  // [1907, 1883, 860, ...]
    const ctx = document.getElementById('chartConteoPorTipoUnidad').getContext('2d');//
    new Chart(ctx, {
        type: 'bar',  // Gráfico de barras
        data: {
            labels: labels,
           datasets: [{
                label: 'Total de Componentes por Unidad',
                data: dataValues,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

}

async function fetchChartActivoNBaja() {

    const cached = localStorage.getItem(cacheKeyChartActivoBaja);
    const cacheTime = localStorage.getItem(cacheKeyChartActivoBaja + '_time');
    const now = Date.now();

    // Si hay cache y no ha expirado (ej. 1 hora)
    if (cached && cacheTime && (now - cacheTime) < 3600000) {
        console.log('Datos desde localStorage');
        try {
            const data = JSON.parse(cached);
            console.log("data cache chart", data);
            
            return data;  // Devuelve el valor cacheado (ej. 8)
        } catch (error) {
            console.error('Error al parsear cache, limpiando:', error);
            localStorage.removeItem(cacheKeyChartActivoBaja);
            localStorage.removeItem(cacheKeyChartActivoBaja + '_time');
            
        }
    }
    const config = {
        url: `${api}/api/reportes/reporteDashboard/ConsultaComponentesChartConteoActivoBaja`, // URL específica
        timeoutDuration: 5000, // Opcional: ajusta el timeout si es necesario
        // data: {} // Opcional: no se pasa si no hay query params
    };
    try {
        const response = await handleGETSinProgressBar(config);
        console.log("Respuesta completa ACVTIVO BJA:", response);
        // Asume que response.data es el array [{ EquiposEnTransito: 8 }]
        // Verifica si response tiene body y es válida
       // Verifica si la respuesta es válida
        if (!response || !response.data) {
            console.warn('Respuesta inválida de handleGET');
            return 0;
        }
        const data = response.data.body;
        
      
        if (data) {
            console.log("entro array");
            // Guarda con JSON.stringify
            localStorage.setItem(cacheKeyChartActivoBaja, JSON.stringify(data));
            localStorage.setItem(cacheKeyChartActivoBaja + '_time', now.toString());
            return data;
        } else {
            console.warn('Datos inválidos de la API:', data);
            return 0;
        }
    } catch (error) {
        console.error('Error en fetchComponentes:', error);
        return 0;  // Fallback
    }
}

function renderChartActivoBaja(chartData) {
    // Extrae etiquetas y valores
    const labels = chartData.map(item => item.status_inventario); 
    const dataValues = chartData.map(item => item.totalcomponentes);  

    // Colores dinámicos para cada sección (puedes personalizar o usar una paleta)
    const backgroundColors = [
        'rgba(255, 99, 132, 0.8)',   // Rojo
        'rgba(54, 162, 235, 0.8)',   // Azul
        'rgba(255, 205, 86, 0.8)',   // Amarillo
        'rgba(75, 192, 192, 0.8)',   // Verde
        'rgba(153, 102, 255, 0.8)',  // Morado
        // Agrega más si hay más categorías
    ].slice(0, labels.length);  // Limita al número de etiquetas

    const ctx = document.getElementById('chartActivoPasivo').getContext('2d');
    new Chart(ctx, {
        type: 'pie',  // Cambia a 'pie' para gráfico de pastel
        data: {
            labels: labels,
            datasets: [{
                label: 'Total de Componentes Activo/BAJA',  // Opcional, pero útil para tooltips
                data: dataValues,
                backgroundColor: backgroundColors,
                hoverBackgroundColor: backgroundColors.map(color => color.replace('0.8', '1')),  // Más opaco al hover
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'  // Muestra la leyenda abajo (opcional, puedes quitarla si usas custom)
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
            // Quita 'scales' porque el pastel no las necesita
        }
    });
}








