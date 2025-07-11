document.getElementById('start-btn').addEventListener('click', async () => {
    const video = document.getElementById('qr-video');
    const resultDiv = document.getElementById('result');
    const qrResult = document.getElementById('qr-result');

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        video.srcObject = stream;
        video.play();

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        const scanQR = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            try {
                const qrCode = jsQR(context.getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height);
                
                if (qrCode) {
                    resultDiv.classList.remove('hidden');
                    qrResult.textContent = qrCode.data;
                    
                    // Enviar al servidor
                    fetch('/process-qr', {
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
        
        requestAnimationFrame(scanQR);
    } catch (err) {
        alert('Error al acceder a la cámara: ' + err);
    }
});
