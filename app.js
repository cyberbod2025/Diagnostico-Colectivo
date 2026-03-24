/* SIRDE-310 | Institutional Logic & Validation */
const SUPABASE_URL = 'https://uvnetpnjinxzhggoqmwz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_oBpidcqpYzP_JMU-xYi9ZQ_HXYouwyL';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const _k = "SIRDE310_SECUNDARIA";
const CONFIG = {
    PERIODOS_DISPONIBLES: ['Trímetros 1 (2026)', 'Trímetros 2 (2026)', 'Trímetros 3 (2026)', 'Diagnóstico Inicial'],
    CURRENT_TEACHER: null,
    IS_SPECTATOR: false
};

async function checkAccess(pin) {
    if (!pin) return false;
    
    console.log("Intentando acceso con PIN:", pin);
    
    try {
        const { data: teacher, error } = await supabaseClient
            .from('personal')
            .select('*')
            .ilike('acceso_pin', pin.trim())
            .single();

        if (error || !teacher) {
            console.error("Error BD:", error);
            alert("PIN Institucional NO VÁLIDO. Verifique con Dirección.");
            return false;
        }
        
        console.log("Docente encontrado:", teacher.nombre);

    CONFIG.CURRENT_TEACHER = teacher;
    sessionStorage.setItem('sirde_session_pin', pin);
    
    // Identificar roles de SOLO LECTURA (Espectadores)
    const rolesEspectador = ['DIRECCION', 'SUBDIRECCION', 'ORIENTACION', 'TRABAJO SOCIAL', 'MEDICO ESCOLAR'];
    const depto = teacher.departamento?.toUpperCase() || '';
    CONFIG.IS_SPECTATOR = rolesEspectador.some(rol => depto.includes(rol));

    // Si es espectador en la página de captura, invitar al Dashboard
    if (CONFIG.IS_SPECTATOR && window.location.pathname.includes('index.html')) {
        const confirmGo = confirm("ACCESO COMO ESPECTADOR:\nUsted tiene permisos de consulta. ¿Desea ir al Dashboard de Análisis?");
        if (confirmGo) window.location.href = 'dashboard.html';
        else {
            document.body.innerHTML = `
                <div class="h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6 text-center">
                    <h1 class="text-3xl font-black mb-4">MODO ESPECTADOR</h1>
                    <p class="mb-8 opacity-70">Usted no tiene permisos para capturar datos en este formulario.</p>
                    <a href="dashboard.html" class="btn-primary inline-block">IR AL DASHBOARD DE ANÁLISIS</a>
                    <button onclick="logoutSIRDE()" class="mt-4 text-xs opacity-50 underline">Cerrar Sesión</button>
                </div>
            `;
            return true;
        }
    }

    // Sólo cargar datos si estamos en la página del formulario (donde existe el select de docentes)
    if (typeof initData === 'function' && globalPersonal.length === 0 && document.getElementById('docente')) {
        await initData();
    }

    // Pre-llenado Automático para Docentes
    const docInput = document.getElementById('docente');
    if(docInput) {
        // Añadir el nombre si no existe en el select (caso limpieza de tabla)
        if (![...docInput.options].some(o => o.value === teacher.nombre)) {
            const opt = new Option(teacher.nombre, teacher.nombre);
            docInput.add(opt);
        }
        docInput.value = teacher.nombre;
        docInput.disabled = true;
    }
    
    // Auto-llenar Asignatura y Campo Formativo si existen en la BD
    const asigInput = document.getElementById('asignatura');
    if(asigInput && teacher.departamento) {
        asigInput.value = teacher.departamento;
        asigInput.readOnly = true;
        
        // Disparar la lógica de campo formativo
        updateCampo(); 
    }

    onTeacherChange(); 
    
    document.getElementById('auth-wall').classList.add('hidden');
    return true;
    
    } catch (e) {
        console.error("Falla Crítica Auth:", e);
        alert("Error de conexión. Verifique su internet.");
        return false;
    }
}

// Llamada al cargar para evitar re-login si ya tiene PIN en sesión
window.addEventListener('load', async () => {
    const savedPin = sessionStorage.getItem('sirde_session_pin');
    if (savedPin) {
        const pinInput = document.getElementById('entry-pin');
        if (pinInput) pinInput.value = savedPin;
        await checkAccess(savedPin);
    }
});

const CAMPO_FORMATIVO_MAP = {
    'Español': 'Lenguajes', 'Inglés': 'Lenguajes', 'Artes': 'Lenguajes', 'Música': 'Lenguajes', 'Español 1': 'Lenguajes', 'Español 2': 'Lenguajes', 'Español 3': 'Lenguajes',
    'Matemáticas': 'Saberes y Pensamiento Científico', 'Biología': 'Saberes y Pensamiento Científico', 'Matemáticas 1': 'Saberes y Pensamiento Científico', 'Matemáticas 2': 'Saberes y Pensamiento Científico', 'Matemáticas 3': 'Saberes y Pensamiento Científico',
    'Física': 'Saberes y Pensamiento Científico', 'Química': 'Saberes y Pensamiento Científico', 'Ciencias Física': 'Saberes y Pensamiento Científico', 'Ciencias Biología': 'Saberes y Pensamiento Científico',
    'Ciencias Química': 'Saberes y Pensamiento Científico', 'Laboratorio': 'Saberes y Pensamiento Científico', 
    'Geografía': 'Ética, Naturaleza y Sociedades', 'Historia': 'Ética, Naturaleza y Sociedades', 'Historia 1': 'Ética, Naturaleza y Sociedades', 'Historia 2': 'Ética, Naturaleza y Sociedades',
    'Formación Cívica y Ética': 'Ética, Naturaleza y Sociedades', 'F.CÍVICA Y ÉTICA': 'Ética, Naturaleza y Sociedades',
    'Educación Física': 'De lo Humano y lo Comunitario', 'EDUC. FÍSICA': 'De lo Humano y lo Comunitario',
    'Tecnología': 'De lo Humano y lo Comunitario', 'Tutoría': 'De lo Humano y lo Comunitario',
    'Socioemocional': 'De lo Humano y lo Comunitario', 'Vida Saludable': 'De lo Humano y lo Comunitario',
    'Diseño Arquitectónico': 'De lo Humano y lo Comunitario', 'Diseño Gráfico': 'De lo Humano y lo Comunitario',
    'DISEÑO ARQUITEC.': 'De lo Humano y lo Comunitario', 'DISEÑO GRÁFICO': 'De lo Humano y lo Comunitario'
};

let globalAlumnos = [];
let globalPersonal = [];

async function initData() {
    try {
        const { data: personal } = await supabaseClient.from('personal').select('nombre, departamento').order('nombre');
        globalPersonal = personal || [];
        const d = document.getElementById('docente');
        if (d && personal) {
            d.innerHTML = '<option value="">Seleccionar...</option>';
            personal.forEach(p => {
                const opt = document.createElement('option');
                opt.value = opt.textContent = p.nombre;
                d.appendChild(opt);
            });
        }
        const { data: alumnos } = await supabaseClient.from('alumnos').select('*').order('nombre_completo');
        globalAlumnos = alumnos || [];
    } catch (e) { 
        console.error("Error initData:", e); 
        alert("Error de conexión con el servidor institucional. Por favor, recargue la página.");
    }
}

function calculateImpact() {
    const factors = document.querySelectorAll('.impact-factor');
    let sum = 0;
    factors.forEach(f => sum += parseInt(f.value));
    
    // Max sum = 12, Min = 4
    let result = "Bajo";
    if (sum <= 6) result = "Crítico";
    else if (sum <= 8) result = "Alto";
    else if (sum <= 10) result = "Medio";
    
    document.getElementById('impacto').value = result;
}

function onTeacherChange() {
    const el = document.getElementById('docente');
    if (!el) return;
    const docenteName = el.value;
    const p = globalPersonal.find(x => x.nombre === docenteName);
    if (p) {
        document.getElementById('asignatura').value = p.departamento || '';
        updateCampo();
    }
}

function updateCampo() {
    const asigInput = document.getElementById('asignatura');
    const campoInput = document.getElementById('campo_formativo');
    if (!asigInput || !campoInput) return;

    let asig = asigInput.value.trim();
    if (!asig) {
        campoInput.value = 'Esperando asignatura...';
        return;
    }

    // Normalización: "ESPAÑOL" -> "Español"
    let normalized = asig.charAt(0).toUpperCase() + asig.slice(1).toLowerCase();
    
    // Búsqueda inteligente
    let field = CAMPO_FORMATIVO_MAP[normalized] || 
                CAMPO_FORMATIVO_MAP[asig.toUpperCase()] || 
                CAMPO_FORMATIVO_MAP[asig] ||
                null;

    // Si no encuentra, buscar coincidencia parcial (Ej. si asig es "Ciencias 1" y mapa tiene "Ciencias")
    if (!field) {
        field = Object.keys(CAMPO_FORMATIVO_MAP).find(key => asig.includes(key) || key.includes(asig));
        if (field) field = CAMPO_FORMATIVO_MAP[field];
    }

    campoInput.value = field || 'Asignar campo...';
}

function renderStudents() {
    const grupo = document.getElementById('grupo').value;
    const list = document.getElementById('student-list');
    list.innerHTML = '';

    if (!grupo) {
        list.innerHTML = '<p style="padding: 2rem; text-align: center; color: #64748b;">Seleccione un grupo...</p>';
        return;
    }

    const filtered = globalAlumnos.filter(a => a.grupo === grupo);
    filtered.forEach(alumno => {
        const div = document.createElement('div');
        div.className = 'student-entry';
        div.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <label style="display: flex; align-items: center; margin: 0; cursor: pointer;">
                    <input type="checkbox" onchange="toggleForm('${alumno.id}', this.checked)" data-id="${alumno.id}" class="chk-student" style="width: 18px; height: 18px; margin-right: 12px;">
                    <span style="font-size: 0.9rem;">${alumno.nombre_completo}</span>
                </label>
            </div>
            <div id="subform-${alumno.id}" class="student-subform" data-id="${alumno.id}">
                <p style="font-size: 0.75rem; font-weight: 700; margin-bottom: 0.5rem;">Causa del reporte (Intensidad):</p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.75rem;">
                    <div class="flex items-center justify-between"><span class="mr-2">Interrupciones</span>
                        <select class="behav-sel" data-name="Interrupciones"><option value="Nula">Nula</option><option value="Baja">Baja</option><option value="Media">Media</option><option value="Alta">Alta</option></select>
                    </div>
                    <div class="flex items-center justify-between"><span class="mr-2">Agresión</span>
                        <select class="behav-sel" data-name="Agresión"><option value="Nula">Nula</option><option value="Baja">Baja</option><option value="Media">Media</option><option value="Alta">Alta</option></select>
                    </div>
                    <div class="flex items-center justify-between"><span class="mr-2">No trabaja</span>
                        <select class="behav-sel" data-name="No trabaja"><option value="Nula">Nula</option><option value="Baja">Baja</option><option value="Media">Media</option><option value="Alta">Alta</option></select>
                    </div>
                    <div class="flex items-center justify-between"><span class="mr-2">Distracción</span>
                        <select class="behav-sel" data-name="Distracción"><option value="Nula">Nula</option><option value="Baja">Baja</option><option value="Media">Media</option><option value="Alta">Alta</option></select>
                    </div>
                    <div class="flex items-center justify-between"><span class="mr-2">Groserías</span>
                        <select class="behav-sel" data-name="Groserías"><option value="Nula">Nula</option><option value="Baja">Baja</option><option value="Media">Media</option><option value="Alta">Alta</option></select>
                    </div>
                    <div class="flex items-center justify-between"><span class="mr-2">Falta de material</span>
                        <select class="behav-sel" data-name="Material"><option value="Nula">Nula</option><option value="Baja">Baja</option><option value="Media">Media</option><option value="Alta">Alta</option></select>
                    </div>
                </div>
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #cbd5e1; display: flex; gap: 1rem;">
                    <label style="margin: 0;">¿Citado a padres? <input type="checkbox" onchange="toggleAttendance('${alumno.id}', this.checked)" class="citado-chk"></label>
                    <div id="attendance-${alumno.id}" style="display: none; align-items: center; gap: 0.5rem;">
                        <span style="font-size: 0.75rem;">¿Acudieron?</span>
                        <select class="acudio-sel" onchange="toggleFollowUp('${alumno.id}', this.value)" style="width: auto; padding: 0.2rem; font-size: 0.75rem;">
                            <option value="">--</option>
                            <option value="SÍ">SÍ</option>
                            <option value="NO">NO</option>
                        </select>
                    </div>
                </div>
                <div id="followup-${alumno.id}" style="display: none; margin-top: 0.5rem;">
                   <label style="font-size: 0.75rem;">¿Hubo seguimiento? <select class="follow-sel" style="width: auto; padding: 0.2rem; font-size: 0.75rem;"><option value="">--</option><option value="SÍ">SÍ</option><option value="NO">NO</option></select></label>
                </div>
                <textarea class="obs-area" placeholder="Observación institucional complementaria..." style="font-size: 0.75rem; min-height: 40px; margin-top: 0.5rem;"></textarea>
            </div>
        `;
        list.appendChild(div);
    });
}

function toggleForm(id, visible) {
    document.getElementById(`subform-${id}`).classList.toggle('visible', visible);
}

function toggleAttendance(id, visible) {
    document.getElementById(`attendance-${id}`).style.display = visible ? 'flex' : 'none';
}

function toggleFollowUp(id, val) {
    document.getElementById(`followup-${id}`).style.display = val === 'SÍ' ? 'block' : 'none';
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-submit');
    const docente = document.getElementById('docente').value;
    const grupo = document.getElementById('grupo').value;
    const asignatura = document.getElementById('asignatura').value;
    const periodo = document.getElementById('current-periodo').value;

    // 1. Check for duplicates
    const { data: existing } = await supabaseClient
        .from('respuestas_docentes')
        .select('id')
        .match({ docente, grupo, asignatura, periodo });

    if (existing && existing.length > 0) {
        alert('ADVERTENCIA: Usted ya ha registrado un diagnóstico para este grupo y asignatura en el periodo vigente.');
        return;
    }

    // 2. Collect & Validate Students
    const reportedStudents = [];
    const checked = document.querySelectorAll('.chk-student:checked');
    
    for (let chk of checked) {
        const id = chk.getAttribute('data-id');
        const behaviors = Array.from(document.querySelectorAll(`#subform-${id} .behav-sel`))
            .filter(sel => sel.value !== 'Nula')
            .map(sel => ({ type: sel.getAttribute('data-name'), level: sel.value }));
        
        if (behaviors.length === 0) {
            alert('VALIDACIÓN: Cada alumno seleccionado debe tener al menos una conducta con intensidad (Baja, Media o Alta).');
            return;
        }

        const sub = document.getElementById(`subform-${id}`);
        const citado = sub.querySelector('.citado-chk').checked;
        const acudio = sub.querySelector('.acudio-sel').value;
        const seguimiento = sub.querySelector('.follow-sel').value;
        const obs = sub.querySelector('.obs-area').value;

        if (citado && !acudio) {
            alert('VALIDACIÓN: Si un alumno fue citado, debe indicar si los padres acudieron.');
            return;
        }

        if (acudio === 'SÍ' && !seguimiento) {
            alert('VALIDACIÓN: Si los padres acudieron, es obligatorio indicar si hubo seguimiento.');
            return;
        }

        reportedStudents.push({ 
            alumno_id: id, 
            nombre: globalAlumnos.find(a => a.id == id)?.nombre_completo,
            behaviors, 
            citado, 
            acudio, 
            seguimiento, 
            obs 
        });
    }

    const payload = {
        docente,
        grupo,
        asignatura,
        periodo,
        campo_formativo: document.getElementById('campo_formativo').value,
        impacto: document.getElementById('impacto').value,
        tiempo_conducta: document.getElementById('tiempo_conducta').value,
        nivel_grupo: document.getElementById('nivel_grupo').value,
        ambiente: {
            atencion: document.getElementById('amb-atencion').value,
            respeto: document.getElementById('amb-respeto').value,
            participacion: document.getElementById('amb-participacion').value
        },
        factores_externos: {
            incluye: document.getElementById('fact-ext-switch').value,
            descripcion: document.getElementById('fact-ext-text').value
        },
        conductas_grupales: Array.from(document.querySelectorAll('.chk-grupo')).map(sel => {
            const behave = sel.getAttribute('data-behav');
            const freqSel = document.querySelector(`.chk-grupo-freq[data-behav="${behave}"]`);
            return {
                type: behave,
                level: sel.value,
                frequency: freqSel ? freqSel.value : 'Ocasional'
            };
        }),
        intervenciones: {
            estrategias: Array.from(document.querySelectorAll('.estrategia-chk:checked')).map(el => el.value),
            otra_estrategia: document.getElementById('chk-otra-est').checked ? document.getElementById('otra-est-text').value : '',
            eficacia: document.getElementById('est-eficacia').value
        },
        alumnos_reportados: reportedStudents,
        comentarios: document.getElementById('comentarios').value,
        fecha: new Date().toISOString()
    };

    btn.disabled = true;
    btn.innerHTML = `
        <span class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            PROCESANDO RESPALDO INSTITUCIONAL...
        </span>`;

    try {
        const { error } = await supabaseClient.from('respuestas_docentes').insert([payload]);
        if (error) throw error;
        alert('Diagnóstico guardado exitosamente.');
        location.reload();
    } catch (e) {
        alert('Error Connection: ' + e.message);
        btn.disabled = false;
        btn.textContent = 'REGISTRAR DIAGNÓSTICO';
    }
}

// Auth Visibility Toggle Wrapper

function togglePinVisibility(inputId) {
    const pinInput = document.getElementById(inputId);
    if (pinInput.type === 'password') {
        pinInput.type = 'text';
    } else {
        pinInput.type = 'password';
    }
}

function logoutSIRDE() {
    sessionStorage.removeItem('sirde_session_pin');
    sessionStorage.removeItem('auth_sirde');
    window.location.reload();
}

function updatePeriodTitle() {
    const sel = document.getElementById('current-periodo');
    if (!sel) return;
    const text = sel.options[sel.selectedIndex].text;
    console.log("Periodo actualizado a:", text);
}

// Inicialización de Periodo por defecto (Trimestre 2)
window.addEventListener('DOMContentLoaded', () => {
    const sel = document.getElementById('current-periodo');
    if (sel) {
        sel.value = 'T2-2026';
        updatePeriodTitle();
    }
});
