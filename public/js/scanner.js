let videoStream; // Variable para almacenar el stream de video
const video = document.getElementById('qr-video');
const resultDiv = document.getElementById('result');
const qrcodigoti = document.getElementById('qr-result');
let frameCount = 0; // Contador de cuadros para limitar la frecuencia de escaneo

// Función para iniciar la cámara
const startCamera = async () => {
    try {
        videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        video.srcObject = videoStream;
        video.play();
        scanQR(); // Iniciar el escaneo de QR automáticamente
        qrcodigoti.disabled=true; // Deshabilitar el campo de entrada hasta que se escanee un código QR
    } catch (err) {
        alert('Error al acceder a la cámara: ' + err);
    }
};

// Función para detener la cámara
const stopCamera = () => {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        video.srcObject = null; // Limpiar el objeto de video
        
    }
};

// Función para escanear códigos QR
const scanQR = () => {
    frameCount++;
    if (frameCount % 3 !== 0) { // Escanear cada 3 cuadros
        requestAnimationFrame(scanQR);
        return;
    }

    // Verificar si el video tiene dimensiones válidas
    if (video.videoWidth === 0 || video.videoHeight === 0) {
       
        requestAnimationFrame(scanQR);
        return;
    }

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { willReadFrequently: true }); // Establecer willReadFrequently a true

    // Aumentar la resolución
    canvas.width = video.videoWidth * 2; 
    canvas.height = video.videoHeight * 2; 
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    try {
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
        const qrCode = jsQR(imageData, canvas.width, canvas.height);
        
        if (qrCode) {
            // Mostrar el resultado en la misma vista
            resultDiv.classList.remove('hidden');

            // Imprimir en la consola el resultado escaneado
            console.log("Código QR escaneado:", qrCode.data);
            qrcodigoti.value = qrCode.data.toUpperCase(); // Convertir a mayúsculas
            
            // Enviar al servidor
            /*
            fetch('/ResultScaneo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: qrCode.data })
            });*/
            
            // Detener stream
            stopCamera(); // Detener la cámara después de escanear
            return;
        }
        
        requestAnimationFrame(scanQR);
    } catch (e) {
        console.error("Error al leer QR:", e);
    }
};

// Función para detener la cámara
const BusquedaManual = () => {
    stopCamera(); // Detener la cámara si está activa
    video.hidden = false; // Mostrar el video
    qrcodigoti.disabled = false; // Habilitar el campo de entrada
};


// Iniciar el escaneo automáticamente al cargar la página
window.addEventListener('load', async () => {

    startCamera(); // Iniciar la cámara al cargar la página
    qrcodigoti.disabled = true; // Deshabilitar el campo de entrada hasta que se escanee un código QR
});

