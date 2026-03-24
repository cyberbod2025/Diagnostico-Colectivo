/* SIRDE-310 | Institutional Logic & Validation with Mobile Success State */
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
    try {
        const { data: teacher, error } = await supabaseClient
            .from('personal')
            .select('*')
            .ilike('acceso_pin', pin.trim())
            .single();

        if (error || !teacher) {
            alert("PIN Institucional NO VÁLIDO. Verifique con Dirección.");
            return false;
        }

        CONFIG.CURRENT_TEACHER = teacher;
        sessionStorage.setItem('sirde_session_pin', pin);
        
        const rolesEspectador = ['DIRECCION', 'SUBDIRECCION', 'ORIENTACION', 'TRABAJO SOCIAL', 'MEDICO ESCOLAR'];
        const depto = teacher.departamento?.toUpperCase() || '';
        CONFIG.IS_SPECTATOR = rolesEspectador.some(rol => depto.includes(rol));

        if (CONFIG.IS_SPECTATOR && window.location.pathname.includes('index.html')) {
            const confirmGo = confirm("ACCESO COMO ESPECTADOR:\nUsted tiene permisos de consulta. ¿Desea ir al Dashboard de Análisis?");
            if (confirmGo) { window.location.href = 'dashboard.html'; return true; }
        }

        // Cargar datos si es necesario
        if (typeof initData === 'function' && globalPersonal.length === 0 && document.getElementById('docente')) {
            await initData();
        }

        // Auto-llenado para Docentes
        const docInput = document.getElementById('docente');
        if(docInput) {
            docInput.value = teacher.nombre;
            docInput.disabled = true;
            onTeacherChange(); // Disparar lógica de filtrado inicial
        }
        
        document.getElementById('auth-wall').classList.add('hidden');
        return true;
    } catch (e) {
        console.error("Critical Auth Error:", e);
        return false;
    }
}

// Filtrar grupos enviados para evitar duplicados
async function filterGroups() {
    const docente = document.getElementById('docente')?.value;
    const asig = document.getElementById('asignatura')?.value;
    if (!docente || !asig) return;

    try {
        const { data: envios } = await supabaseClient
            .from('respuestas_docentes')
            .select('grupo')
            .match({ docente, asignatura: asig, periodo: 'T2-2026' });

        const Enviados = (envios || []).map(e => e.grupo);
        const grupoSelect = document.getElementById('grupo');
        if (grupoSelect) {
            Array.from(grupoSelect.options).forEach(opt => {
                if (Enviados.includes(opt.value)) {
                    opt.disabled = true;
                    opt.textContent = opt.value + " (YA ENVIADO)";
                }
            });
        }
    } catch (e) { console.error("Filter Error:", e); }
}

const CAMPO_FORMATIVO_MAP = {
    'Español': 'Lenguajes', 'Artes': 'Lenguajes', 'Inglés': 'Lenguajes', 'LENGUA MATERNA': 'Lenguajes',
    'Matemáticas': 'Saberes y Pensamiento Científico', 'Biología': 'Saberes y Pensamiento Científico',
    'Física': 'Saberes y Pensamiento Científico', 'Química': 'Saberes y Pensamiento Científico',
    'Geografía': 'Ética, Naturaleza y Sociedades', 'Historia': 'Ética, Naturaleza y Sociedades',
    'Formación Cívica y Ética': 'Ética, Naturaleza y Sociedades', 'F.CÍVICA Y ÉTICA': 'Ética, Naturaleza y Sociedades',
    'Educación Física': 'De lo Humano y lo Comunitario', 'Tecnología': 'De lo Humano y lo Comunitario',
    'Tutoría': 'De lo Humano y lo Comunitario', 'Socioemocional': 'De lo Humano y lo Comunitario',
    'Vida Saludable': 'De lo Humano y lo Comunitario', 'Diseño Arquitectónico': 'De lo Humano y lo Comunitario', 'Diseño Gráfico': 'De lo Humano y lo Comunitario'
};

let globalAlumnos = [];
let globalPersonal = [];

async function initData() {
    try {
        const { data: personal } = await supabaseClient.from('personal').select('nombre, departamento').order('nombre');
        globalPersonal = personal || [];
        
        const { data: alumnos } = await supabaseClient.from('alumnos').select('*').order('nombre_completo');
        globalAlumnos = alumnos || [];

        const d = document.getElementById('docente');
        if (d && personal.length > 0) {
            d.innerHTML = '<option value="">Seleccionar...</option>';
            personal.forEach(p => d.add(new Option(p.nombre, p.nombre)));
        }
    } catch (e) { console.error("Init Error:", e); }
}

function onTeacherChange() {
    const el = document.getElementById('docente');
    if (!el) return;
    const docenteName = el.value;
    const p = globalPersonal.find(x => x.nombre === docenteName);
    if (p) {
        const asigInput = document.getElementById('asignatura');
        if (asigInput) {
            asigInput.value = p.departamento || '';
            asigInput.readOnly = true;
            updateCampo();
            filterGroups();
        }
    }
}

function updateCampo() {
    const asigInput = document.getElementById('asignatura');
    const campoInput = document.getElementById('campo_formativo');
    if (!asigInput || !campoInput) return;

    let asig = asigInput.value.trim();
    let normalized = asig.charAt(0).toUpperCase() + asig.slice(1).toLowerCase();
    let field = CAMPO_FORMATIVO_MAP[normalized] || CAMPO_FORMATIVO_MAP[asig.toUpperCase()] || 'Asignar campo...';
    campoInput.value = field;
}

function renderStudents() {
    const grupo = document.getElementById('grupo').value;
    const list = document.getElementById('student-list');
    const manualZone = document.getElementById('manual-student-zone');
    const manualSelect = document.getElementById('manual-student-select');

    list.innerHTML = '';
    if (!grupo) {
        list.innerHTML = `<div class="p-8 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">SELECCIONE UN GRUPO PARA ACTIVAR EL LISTADO</div>`;
        if (manualZone) manualZone.classList.add('hidden');
        return;
    }

    if (manualZone) manualZone.classList.remove('hidden');
    if (manualSelect) {
        manualSelect.innerHTML = '<option value="">Buscar en toda la escuela...</option>';
        globalAlumnos.sort((a,b)=>a.nombre_completo.localeCompare(b.nombre_completo)).forEach(a => manualSelect.add(new Option(`${a.nombre_completo} (${a.grupo})`, a.id)));
    }

    const filtered = globalAlumnos.filter(a => a.grupo === grupo);
    
    // Header Instrucción
    const instr = document.createElement('div');
    instr.className = 'mb-6 p-4 bg-primary-green/10 border border-primary-green/20 rounded-lg';
    instr.innerHTML = `<p class="text-[11px] text-slate-300 font-bold">📋 Seleccione alumnos con situaciones recurrentes en su materia.</p>`;
    list.appendChild(instr);

    filtered.forEach(alumno => {
        const div = document.createElement('div');
        div.className = 'student-entry';
        div.innerHTML = createStudentHTML(alumno);
        list.appendChild(div);
    });
}

function createStudentHTML(alumno, manual = false) {
    return `
        <div class="flex items-center justify-between mb-2">
            <label class="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" onchange="toggleForm('${alumno.id}', this.checked)" data-id="${alumno.id}" class="chk-student w-5 h-5">
                <span class="font-bold text-sm ${manual ? 'text-yellow-400' : ''}">${alumno.nombre_completo} ${manual ? '(Focalizado)' : ''}</span>
            </label>
        </div>
        <div id="subform-${alumno.id}" class="student-subform hidden overflow-hidden" data-id="${alumno.id}">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                ${['Interrupciones', 'Agresión', 'No trabaja', 'Distracción', 'Groserías', 'Material'].map(b => `
                    <div class="flex items-center justify-between p-2 bg-slate-900/40 rounded">
                        <span>${b}</span>
                        <select class="behav-sel p-1 text-[10px]" data-name="${b}">
                            <option value="Nula">Nula</option><option value="Baja">Baja</option><option value="Media">Media</option><option value="Alta">Alta</option>
                        </select>
                    </div>
                `).join('')}
            </div>
            <div class="mt-3 p-3 bg-slate-900/60 rounded border border-slate-800">
                <label class="text-[10px] items-center flex gap-2 mb-2"><input type="checkbox" onchange="toggleAttendance('${alumno.id}', this.checked)" class="citado-chk"> ¿Citado a padres?</label>
                <div id="attendance-${alumno.id}" class="hidden gap-2 flex-wrap mb-2">
                    <select class="acudio-sel text-[10px] p-1" onchange="toggleFollowUp('${alumno.id}', this.value)"><option value="">¿Acudieron?</option><option value="SÍ">SÍ</option><option value="NO">NO</option></select>
                    <div id="followup-${alumno.id}" class="hidden"><select class="follow-sel text-[10px] p-1"><option value="">¿Seguimiento?</option><option value="SÍ">SÍ</option><option value="NO">NO</option></select></div>
                </div>
                <textarea class="obs-area w-full p-2 text-xs bg-slate-800 rounded" placeholder="Observaciones..."></textarea>
            </div>
        </div>`;
}

async function addManualStudent() {
    const sel = document.getElementById('manual-student-select');
    const id = sel.value;
    if (!id || document.getElementById(`subform-${id}`)) return;
    const al = globalAlumnos.find(a => a.id == id);
    const list = document.getElementById('student-list');
    const div = document.createElement('div');
    div.className = 'student-entry border-l-4 border-yellow-500 bg-yellow-500/5';
    div.innerHTML = createStudentHTML(al, true);
    list.appendChild(div);
}

function calculateImpact() {
    const factors = document.querySelectorAll('.impact-factor');
    let sum = 0;
    factors.forEach(f => sum += parseInt(f.value));
    let result = (sum <= 6) ? "Crítico" : (sum <= 8) ? "Alto" : (sum <= 10) ? "Medio" : "Bajo";
    document.getElementById('impacto').value = result;
}

function toggleOtroFactor(val) {
    const c = document.getElementById('otro-factor-container');
    if (c) c.style.display = (val === 'Otro') ? 'block' : 'none';
}

function toggleForm(id, v) { document.getElementById(`subform-${id}`).classList.toggle('hidden', !v); }
function toggleAttendance(id, v) { document.getElementById(`attendance-${id}`).classList.toggle('hidden', !v); }
function toggleFollowUp(id, v) { document.getElementById(`followup-${id}`).classList.toggle('hidden', v !== 'SÍ'); }

async function handleFormSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-submit');
    const docente = document.getElementById('docente').value;
    const grupo = document.getElementById('grupo').value;
    const asignatura = document.getElementById('asignatura').value;
    const periodo = document.getElementById('current-periodo').value;

    const reportedStudents = [];
    document.querySelectorAll('.chk-student:checked').forEach(chk => {
        const id = chk.getAttribute('data-id');
        const sub = document.getElementById(`subform-${id}`);
        reportedStudents.push({
            alumno_id: id,
            nombre: globalAlumnos.find(a => a.id == id)?.nombre_completo,
            behaviors: Array.from(sub.querySelectorAll('.behav-sel')).filter(s => s.value !== 'Nula').map(s => ({ type: s.getAttribute('data-name'), level: s.value })),
            citado: sub.querySelector('.citado-chk').checked,
            acudio: sub.querySelector('.acudio-sel').value,
            seguimiento: sub.querySelector('.follow-sel').value,
            obs: sub.querySelector('.obs-area').value
        });
    });

    const payload = {
        docente, grupo, asignatura, periodo,
        campo_formativo: document.getElementById('campo_formativo').value,
        impacto: document.getElementById('impacto').value,
        tiempo_conducta: document.getElementById('tiempo_conducta').value,
        nivel_grupo: document.getElementById('nivel_grupo').value,
        ambiente: { atencion: document.getElementById('amb-atencion').value, respeto: document.getElementById('amb-respeto').value, participacion: document.getElementById('amb-participacion').value },
        factores_externos: { incluye: document.getElementById('fact-ext-select').value, descripcion: document.getElementById('fact-ext-text').value },
        conductas_grupales: Array.from(document.querySelectorAll('.chk-grupo')).map(sel => ({ type: sel.getAttribute('data-behav'), level: sel.value, frequency: document.querySelector(`.chk-grupo-freq[data-behav="${sel.getAttribute('data-behav')}"]`)?.value || 'Ocasional' })),
        intervenciones: { estrategias: Array.from(document.querySelectorAll('.estrategia-chk:checked')).map(el => el.value), otra_estrategia: document.getElementById('chk-otra-est').checked ? document.getElementById('otra-est-text').value : '', eficacia: document.getElementById('est-eficacia').value },
        alumnos_reportados: reportedStudents,
        comentarios: document.getElementById('comentarios').value,
        fecha: new Date().toISOString()
    };

    btn.disabled = true;
    btn.innerHTML = "GUARDANDO RESPALDO...";

    try {
        const { error } = await supabaseClient.from('respuestas_docentes').insert([payload]);
        if (error) throw error;
        
        document.body.innerHTML = `
            <div class="min-h-screen flex flex-col items-center justify-center p-6 bg-[#02140f] text-white text-center">
                <div class="card max-w-lg w-full border-2 border-primary-green">
                    <h1 class="text-2xl font-black mb-4">¡REPORTE GUARDADO!</h1>
                    <p class="text-xs text-slate-400 mb-8">${grupo} - ${asignatura}</p>
                    <div class="grid grid-cols-1 gap-4">
                        <button onclick="window.print()" class="btn-primary">🖨️ REVISAR REPORTE</button>
                        <a href="dashboard.html" class="px-6 py-4 bg-blue-600 font-bold rounded-xl text-xs">📊 VER ANÁLISIS DEL GRUPO</a>
                        <button onclick="location.reload()" class="px-6 py-4 bg-slate-800 font-bold rounded-xl text-xs">➕ ENVIAR OTRO GRUPO</button>
                    </div>
                </div>
            </div>`;
    } catch (e) {
        alert("Error: " + e.message);
        btn.disabled = false;
        btn.innerHTML = "REGISTRAR DIAGNÓSTICO";
    }
}

function togglePinVisibility(id) {
    const input = document.getElementById(id);
    input.type = (input.type === 'password') ? 'text' : 'password';
}

function logoutSIRDE() {
    sessionStorage.clear();
    location.reload();
}

window.addEventListener('DOMContentLoaded', () => {
    const pin = sessionStorage.getItem('sirde_session_pin');
    if (pin) checkAccess(pin);
});
