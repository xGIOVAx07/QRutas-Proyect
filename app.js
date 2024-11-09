// Datos de los camiones por destino
const busesByDestination = {
    "conalep169": ["Mololoa Villas del Prado", "Mololoa Álamo", "Llanitos y Prado", "Llanitos Aurora", "Llanitos 2 Álamo", "Progreso 5", "Progreso 4", "Progreso 3", "México", "Pedregal"],
    "uan": ["Mololoa Villas del Prado", "Mololoa Álamo", "Llanitos y Prado", "Llanitos Aurora", "Llanitos 2 Álamo", "Cantera Hospitales 1", "Cantera Hospitales 2", "Progreso 6-2", "Progreso 5", "Progreso 4", "Progreso 2", "Progreso 1", "Agrónomos Universidad", "México", "Sauces 2", "Sauces 1", "Río Suchiate", "Peñitas", "Amado Nervo", "UNINAY", "Cuauhtémoc"],
    "tecnologico": ["Mololoa Villas del Prado", "Mololoa Álamo", "Llanitos y Prado", "Llanitos Aurora", "Llanitos 2 Álamo", "Cantera Hospitales 2", "Cantera Hospitales 1", "Progreso 5", "Progreso 4", "Insurgentes", "Allende", "Sauces 2", "Sauces 1", "Amado Nervo"],
    "cecyten": ["Progreso 4", "Progreso 5", "Insurgentes", "Allende"],
    "cetis100": ["Progreso 6-2", "México", "Cuauhtémoc"]
};

// Tiempos estimados de llegada
const estimatedArrivalTimes = {
    "Mololoa Villas del Prado": 15,
    "Mololoa Álamo": 20,
    "Llanitos y Prado": 18,
    "Llanitos Aurora": 25,
    "Llanitos 2 Álamo": 22,
    "Progreso 5": 30,
    "Progreso 4": 35,
    "Progreso 3": 28,
    "México": 27,
    "Pedregal": 32,
    "Cantera Hospitales 1": 15,
    "Cantera Hospitales 2": 18,
    "Progreso 6-2": 33,
    "Progreso 2": 25,
    "Progreso 1": 20,
    "Agrónomos Universidad": 40,
    "Sauces 2": 12,
    "Sauces 1": 10,
    "Río Suchiate": 17,
    "Peñitas": 14,
    "Amado Nervo": 26,
    "UNINAY": 19,
    "Cuauhtémoc": 21,
    "Insurgentes": 29,
    "Allende": 24
};

// Tiempos de viaje a las instituciones (en minutos)
const travelTimesToInstitutions = {
    "conalep169": 15,
    "uan": 20,
    "tecnologico": 25,
    "cecyten": 10,
    "cetis100": 18
};

// Horarios de operación
const startHour = 6;
const endHour = 21;

// Función que actualiza las opciones de camiones según el destino seleccionado
function updateBusOptions() {
    const destination = document.getElementById("destinationSelect").value;
    const busSelect = document.getElementById("busSelect");

    // Limpiar las opciones anteriores
    busSelect.innerHTML = "<option value=''>Elige un camión...</option>";
    busSelect.disabled = !destination;

    // Si se selecciona un destino válido, agregar las opciones correspondientes
    if (destination && busesByDestination[destination]) {
        busesByDestination[destination].forEach(bus => {
            const option = document.createElement("option");
            option.value = bus;
            option.textContent = bus;
            busSelect.appendChild(option);
        });
    }
}

// Mostrar opciones de credencial dependiendo del tipo de pasajero seleccionado
function showCredentialOption() {
    const passengerType = document.getElementById("passengerType").value;
    document.getElementById("credentialOption").style.display = (passengerType === "student" || passengerType === "child" || passengerType === "senior") ? "block" : "none";
}

// Función para mostrar hora de llegada, costo del pasaje y hacer la cuenta regresiva
function showArrivalTimeAndFare() {
    const bus = document.getElementById("busSelect").value;
    const passengerType = document.getElementById("passengerType").value;
    const hasCredential = document.getElementById("hasCredential").checked;
    const institution = document.getElementById("institutionSelect").value;
    const result = document.getElementById("result");

    // Verificar que se haya seleccionado camión, tipo de pasajero e institución
    if (!bus || !passengerType || !institution) {
        result.textContent = "Por favor, selecciona un camión, el tipo de pasajero e institución.";
        return;
    }

    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    // Verificar que la consulta esté dentro del horario de operación
    if (currentHour < startHour || currentHour >= endHour) {
        result.textContent = "Consulta fuera del horario de operación (6 a.m. - 9 p.m.). Intente de nuevo en horario válido.";
        return;
    }

    // Calcular el tiempo de llegada estimado
    const travelTime = estimatedArrivalTimes[bus] || 0;
    const institutionTravelTime = travelTimesToInstitutions[institution] || 0;

    const totalTime = travelTime + institutionTravelTime; // Tiempo total estimado (camión + institución)
    const arrivalTimeInMinutes = totalTime; // El tiempo total de llegada en minutos

    // Inicializar la cuenta regresiva
    let remainingTime = arrivalTimeInMinutes;
    
    // Mostrar el resultado inicial
    result.innerHTML = `
        <h3>Resultados</h3>
        <p>El camión <strong>${bus}</strong> llegará a las <strong>${getTimeAfterMinutes(currentTime, remainingTime)}</strong>.</p>
        <p>Tiempo estimado de llegada del camión: <strong>${travelTime} minutos</strong>.</p>
        <p>Tiempo estimado para llegar a la institución: <strong>${institutionTravelTime} minutos</strong>.</p>
        <p>Tiempo total de llegada: <strong>${totalTime} minutos</strong>.</p>
        <p>El costo del pasaje es de <strong>$${getFare(passengerType, hasCredential)}</strong>.</p>
        <p id="countdownTimer"></p>
    `;

    // Iniciar la cuenta regresiva
    const countdownTimer = document.getElementById("countdownTimer");
    const countdownInterval = setInterval(function() {
        if (remainingTime <= 0) {
            clearInterval(countdownInterval);
            countdownTimer.textContent = "¡El camión ha llegado!";
        } else {
            remainingTime--;
            countdownTimer.textContent = `Tiempo restante para la llegada: ${remainingTime} minutos`;
        }
    }, 60000); // Actualizar cada minuto
}

// Función para obtener la hora después de n minutos
function getTimeAfterMinutes(currentTime, minutes) {
    currentTime.setMinutes(currentTime.getMinutes() + minutes);
    return currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Función para calcular el costo del pasaje
function getFare(passengerType, hasCredential) {
    let fare;
    switch (passengerType) {
        case "student":
            fare = hasCredential ? 5 : 10;
            break;
        case "child":
            const age = prompt("Ingresa la edad del niño:");
            if (age < 5) {
                fare = 0;
            } else if (age <= 12) {
                fare = 5;
            } else {
                fare = hasCredential ? 5 : 10;
            }
            break;
        case "senior":
            fare = hasCredential ? 5 : 10;
            break;
        case "normal":
            fare = 10;
            break;
        default:
            fare = 10;
    }
    return fare;
}
