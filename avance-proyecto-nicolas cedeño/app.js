/* ==========================================================
   TALENTOMATCH PRO - MOTOR PRINCIPAL Y GESTIÓN DE PERSISTENCIA
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM totalmente cargado. Inicializando TalentoMatch Pro...");
    configurarEventosFormulario();
    configurarPersonalizadorColor();
    renderizarCandidatos();
});

/**
 * Configura el personalizador de colores dinámico de la interfaz
 */
function configurarPersonalizadorColor() {
    const colorPicker = document.getElementById("colorPicker");
    if (!colorPicker) return;

    const colorGuardado = localStorage.getItem("talentos_theme_color");
    if (colorGuardado) {
        document.documentElement.style.setProperty('--primary-color', colorGuardado);
        colorPicker.value = colorGuardado;
    }

    colorPicker.addEventListener("input", (e) => {
        const nuevoColor = e.target.value;
        document.documentElement.style.setProperty('--primary-color', nuevoColor);
        localStorage.setItem("talentos_theme_color", nuevoColor);
    });
}

/**
 * Configura de forma limpia y directa el evento submit del formulario
 */
function configurarEventosFormulario() {
    const formulario = document.getElementById("formRegistro");
    if (!formulario) {
        console.error("No se encontró el formulario #formRegistro en el DOM.");
        return;
    }

    formulario.addEventListener("submit", function(event) {
        event.preventDefault();
        console.log("Evento submit interceptado correctamente.");

        const nombre = document.getElementById("nombreCandidato").value.trim();
        const cargo = document.getElementById("selectCargo").value;
        const habilidadesRaw = document.getElementById("habilidadesCandidato").value.trim();
        const experiencia = document.getElementById("experienciaAños").value.trim();

        console.log("Datos capturados:", { nombre, cargo, habilidadesRaw, experiencia });

        if (!nombre || !cargo || !habilidadesRaw || !experiencia) {
            alert("Error de validación: Todos los campos obligatorios deben estar llenos.");
            return;
        }

        const nuevoCandidato = {
            id: 'TID-' + Date.now(),
            nombre: nombre,
            cargo: cargo,
            experiencia: parseInt(experiencia),
            habilidades: habilidadesRaw.split(",").map(h => h.trim()).filter(h => h.length > 0),
            fechaRegistro: new Date().toLocaleDateString()
        };

        guardarCandidatoEnAlmacenamiento(nuevoCandidato);

        formulario.reset();
        renderizarCandidatos();

        alert(`¡Candidato "${nombre}" registrado con éxito!`);
    });
}

/**
 * Almacena el candidato en localStorage de manera persistente
 */
function guardarCandidatoEnAlmacenamiento(candidato) {
    try {
        let listaCandidatos = JSON.parse(localStorage.getItem("talentos_db_enterprise")) || [];
        listaCandidatos.push(candidato);
        localStorage.setItem("talentos_db_enterprise", JSON.stringify(listaCandidatos));
        console.log("Guardado exitoso en localStorage. Total registros:", listaCandidatos.length);
    } catch (error) {
        console.error("Error al guardar en localStorage:", error);
    }
}

/**
 * Obtiene la lista de candidatos desde localStorage
 */
function obtenerCandidatosDesdeAlmacenamiento() {
    try {
        const datos = localStorage.getItem("talentos_db_enterprise");
        return datos ? JSON.parse(datos) : [];
    } catch (error) {
        console.error("Error al leer localStorage:", error);
        return [];
    }
}

/**
 * Renderiza las tarjetas de los candidatos en pantalla
 */
function renderizarCandidatos(listaFiltrada = null) {
    const contenedor = document.getElementById("listaCandidatosContainer");
    const contadorTotal = document.getElementById("totalCandidatosCount");
    if (!contenedor) return;

    const candidatos = listaFiltrada !== null ? listaFiltrada : obtenerCandidatosDesdeAlmacenamiento();
    
    if (contadorTotal) {
        contadorTotal.textContent = candidatos.length;
    }

    contenedor.innerHTML = "";

    if (candidatos.length === 0) {
        contenedor.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-folder-open"></i>
                <p>No se encontraron registros de candidatos almacenados.</p>
            </div>
        `;
        return;
    }

    candidatos.forEach(candidato => {
        const tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta-candidato-pro";

        const tagsHtml = candidato.habilidades
            .map(hab => `<span class="tag"><i class="fa-solid fa-check"></i> ${hab}</span>`)
            .join("");

        tarjeta.innerHTML = `
            <div class="tarjeta-header">
                <h3><i class="fa-solid fa-user-tie"></i> ${candidato.nombre}</h3>
                <span class="badge-cargo">${candidato.cargo}</span>
            </div>
            <div class="tarjeta-body">
                <p><strong><i class="fa-solid fa-award"></i> Experiencia:</strong> ${candidato.experiencia} años en el área</p>
                <p><strong><i class="fa-solid fa-id-badge"></i> ID Registro:</strong> ${candidato.id} (${candidato.fechaRegistro})</p>
                <div class="tags-habilidades">
                    ${tagsHtml}
                </div>
            </div>
        `;
        contenedor.appendChild(tarjeta);
    });
}

/**
 * Filtra los candidatos en tiempo real desde el buscador
 */
function filtrarCandidatosUI() {
    const inputBuscador = document.getElementById("buscadorInput");
    if (!inputBuscador) return;

    const textoFiltro = inputBuscador.value.toLowerCase();
    const todosLosCandidatos = obtenerCandidatosDesdeAlmacenamiento();

    const filtrados = todosLosCandidatos.filter(c => {
        const matchNombre = c.nombre.toLowerCase().includes(textoFiltro);
        const matchCargo = c.cargo.toLowerCase().includes(textoFiltro);
        const matchHabilidades = c.habilidades.some(h => h.toLowerCase().includes(textoFiltro));
        return matchNombre || matchCargo || matchHabilidades;
    });

    renderizarCandidatos(filtrados);
}