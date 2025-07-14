// Iniciar el escaneo automáticamente al cargar la página
window.addEventListener('load', async () => {
    const video = document.getElementById('qr-video');
    const resultDiv = document.getElementById('result');
    const qrResult = document.getElementById('qr-result');

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        video.srcObject = stream;
        video.play();

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d', { willReadFrequently: true }); // Establecer willReadFrequently a true
        
       const scanQR = () => {
    frameCount++;
    if (frameCount % 3 !== 0) { // Escanear cada 3 cuadros
        requestAnimationFrame(scanQR);
        return;
    }

    canvas.width = video.videoWidth * 2; // Aumentar la resolución
    canvas.height = video.videoHeight * 2; // Aumentar la resolución
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    try {
        const qrCode = jsQR(context.getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height);
        
        if (qrCode) {
            // Mostrar el resultado en la misma vista
            resultDiv.classList.remove('hidden');
            qrResult.textContent = qrCode.data;

            // Imprimir en la consola el resultado escaneado
            console.log("Código QR escaneado:", qrCode.data);
            
            // Enviar al servidor
            fetch('/ResultScaneo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: qrCode.data })
            });
            
            // Detener stream
            video.srcObject.getTracks().forEach(track => track.stop());
            return;
        }
        
        requestAnimationFrame(scanQR);
    } catch (e) {
        console.error("Error al leer QR:", e);
    }
};
        let frameCount = 0; // Contador de cuadros para limitar la frecuencia de escaneo
        
        requestAnimationFrame(scanQR);
    } catch (err) {
        alert('Error al acceder a la cámara: ' + err);
    }
});
