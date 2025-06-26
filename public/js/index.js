//crea elemento
const video = document.createElement("video");
// Importar las funciones de respuesta
//nuestro camvas
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

// Seleccionar el botón y el input
const btnManual = document.getElementById("btnmanual");
const miInput = document.getElementById("codigoti");
const btnVerificar = document.getElementById("btnverificar");


//div donde llegara nuestro canvas
const btnScanQR = document.getElementById("btn-scan-qr");

//lectura desactivada
let scanning = false;

//funcion para encender la camara
const encenderCamara = () => {
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function (stream) {
      scanning = true;
      btnScanQR.hidden = true;
      canvasElement.hidden = false;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.srcObject = stream;
      video.play();
      tick();
      scan();
   // Mostrar el botón
    btnHabilitar.style.display = "inline-block"; // Cambiar a "inline-block" o "block"
    
    // Habilitar el botón
    btnHabilitar.disabled = false;
    });
};

//funciones para levantar las funiones de encendido de la camara
function tick() {
  canvasElement.height = video.videoHeight;
  canvasElement.width = video.videoWidth;
  canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

  scanning && requestAnimationFrame(tick);
}

function scan() {
  try {
    qrcode.decode();
  } catch (e) {
    setTimeout(scan, 300);
  }
}

//apagara la camara
const cerrarCamara = () => {
  video.srcObject.getTracks().forEach((track) => {
    track.stop();
  });
  canvasElement.hidden = true;
  btnScanQR.hidden = false;
};

const activarSonido = () => {
  var audio = document.getElementById('audioScaner');
  audio.play();
}

//callback cuando termina de leer el codigo QR
qrcode.callback = (respuesta) => {
  if (respuesta) {
    //const respuesfinal=respuesta;
    //console.log(respuesta);
    document.getElementById("codigoti").value=respuesta;
 
    //respuestas.textContent=`${respuesfinal}`;
    Swal.fire(respuesta)
    activarSonido();
    //setRespuesta(respuesta);
    //encenderCamara();    
    cerrarCamara();    

  }
};
//evento para mostrar la camara sin el boton 
window.addEventListener('load', (e) => {
  encenderCamara();
})

  //HABILITAR INPUT "codigoti" cuando se presione  

// Agregar un evento de clic al botón
btnManual.addEventListener("click", () => {
  // Habilitar el input
  miInput.disabled = false;
  // Opcional: Puedes esconder el botón después de habilitar el input
  btnManual.style.display = "none";
});

//EVENTO PARA CONVERTIR A MAYUSCULAS
function convertirAMayusculas() {
  // Seleccionar el input
  const inputTexto = document.getElementById("codigoti");
    
  // Convertir el valor del input a mayúsculas
  inputTexto.value = inputTexto.value.toUpperCase();
}

// Agregar un evento de clic al botón
btnVerificar.addEventListener("click", () => {
  console.log(miInput.value);
});


