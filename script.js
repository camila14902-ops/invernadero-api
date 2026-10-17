// =========================================================================
// 1. SELECCIÓN DE LOS ELEMENTOS VISUALES DEL FORMULARIO (DOM)
// =========================================================================
const txtTemperatura = document.getElementById('temperatura');
const txtHumedad = document.getElementById('humedad');
const txtPH = document.getElementById('ph'); // Conectamos la casilla de pH
const txtReporteEscrito = document.getElementById('reporteEscrito');
const selectIdioma = document.getElementById('idioma'); // Conectamos el selector de idioma
const btnLeer = document.getElementById('btnLeer');
const btnReporte = document.getElementById('btnReporte');

// Variables globales para recordar los estados actuales calculados por los sensores
let estadoTempGlobal = "";
let estadoHumGlobal = "";
let estadoPHGlobal = "";

// =========================================================================
// 2. FUNCIÓN PARA GENERAR EL TEXTO DEL REPORTE SEGÚN EL IDIOMA SELECCIONADO
// =========================================================================
function actualizarTextoReporte() {
    // Si todavía no se han leído datos de los sensores, salimos de la función
    if (!estadoTempGlobal) return;

    const idiomaSeleccionado = selectIdioma.value;

    if (idiomaSeleccionado === "es-ES") {
        // Reporte estructurado en Español
        txtReporteEscrito.value = `El Invernadero tiene Temperatura ${estadoTempGlobal}, Humedad ${estadoHumGlobal} y pH ${estadoPHGlobal}`;
    } else {
        // Reporte traducido dinámicamente al Inglés según los estados detectados
        let tempEN = estadoTempGlobal === "Normal" ? "Normal" : (estadoTempGlobal === "Alta" ? "High" : "Low");
        let humEN = estadoHumGlobal === "Normal" ? "Normal" : (estadoHumGlobal === "Alta" ? "High" : "Low");
        let phEN = estadoPHGlobal === "Normal" ? "Normal" : (estadoPHGlobal === "Ácido" ? "Acidic" : "Alkaline");

        txtReporteEscrito.value = `The Greenhouse has ${tempEN} Temperature, ${humEN} Humidity and ${phEN} pH`;
    }
}

// Escuchar si el usuario cambia el idioma en el selector para traducir el texto al instante
selectIdioma.addEventListener('change', actualizarTextoReporte);


// =========================================================================
// 3. EVENTO PARA LEER LOS DATOS DE LA RED DE SENSORES (INCLUYENDO pH)
// =========================================================================
btnLeer.addEventListener('click', () => {
    // A. Simulación matemática de sensores usando números aleatorios
    const valorTemp = Math.floor(Math.random() * (35 - 15 + 1)) + 15; // De 15°C a 35°C
    const valorHum = Math.floor(Math.random() * (80 - 30 + 1)) + 30;   // De 30% a 80%
    
    // Escala del pH: Generamos un decimal aleatorio entre 4.0 y 9.0 para simular la tierra
    const valorPH = (Math.random() * (9.0 - 4.0) + 4.0).toFixed(1);

    // B. Mostrar los números calculados en las cajas blancas de la pantalla
    txtTemperatura.value = `${valorTemp} °C`;
    txtHumedad.value = `${valorHum} %`;
    txtPH.value = valorPH;

    // C. Evaluación lógica de rangos para la Temperatura
    if (valorTemp > 30) {
        estadoTempGlobal = "Alta";
    } else if (valorTemp < 18) {
        estadoTempGlobal = "Baja";
    } else {
        estadoTempGlobal = "Normal";
    }

    // D. Evaluación lógica de rangos para la Humedad
    if (valorHum > 70) {
        estadoHumGlobal = "Alta";
    } else if (valorHum < 40) {
        estadoHumGlobal = "Baja";
    } else {
        estadoHumGlobal = "Normal";
    }

    // E. Evaluación lógica de rangos para la nueva variable: pH
    // Rango ideal para plantas agrícolas oscila entre 6.0 y 7.5 (Neutro/Normal)
    if (valorPH < 6.0) {
        estadoPHGlobal = "Ácido";
    } else if (valorPH > 7.5) {
        estadoPHGlobal = "Alcalino";
    } else {
        estadoPHGlobal = "Normal";
    }

    // F. Invocar la función para escribir el reporte en el idioma que esté activo
    actualizarTextoReporte();
});


// =========================================================================
// 4. EJECUCIÓN DE LA API COGNITIVA DE VOZ (TEXT TO SPEECH MULTI-IDIOMA)
// =========================================================================
btnReporte.addEventListener('click', () => {
    const textoALeer = txtReporteEscrito.value;

    // Control de seguridad por si presionan "Reporte" antes de calcular datos
    if (!textoALeer) {
        alert("Por favor, primero haga clic en 'Leer datos' para generar la información.");
        return;
    }

    // Comprobamos que el navegador del usuario tenga activo el sistema SpeechSynthesis
    if ('speechSynthesis' in window) {
        // Cancelar lecturas previas que hayan quedado en cola
        window.speechSynthesis.cancel();

        // Creamos la instancia de voz con el texto actual de la pantalla
        const emisionVoz = new SpeechSynthesisUtterance(textoALeer);
        
        // Configuramos la API Cognitiva con el idioma exacto seleccionado (es-ES o en-US)
        emisionVoz.lang = selectIdioma.value; 
        
        // Velocidad de lectura estándar, clara y pausada
        emisionVoz.rate = 0.9; 

        // Ordenamos al navegador reproducir la locución por los parlantes
        window.speechSynthesis.speak(emisionVoz);
    } else {
        alert("Tu navegador web no es compatible con el motor de voz cognitivo.");
    }
});