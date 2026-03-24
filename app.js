/* SIRDE-310 | Institutional Logic & Validation */
const SUPABASE_URL = 'https://uvnetpnjinxzhggoqmwz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_oBpidcqpYzP_JMU-xYi9ZQ_HXYouwyL';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const _k = [51, 49, 48];
const CONFIG = {
    ACCESS_PIN: _k.map(c => String.fromCharCode(c)).join(''),
    CURRENT_PERIODO: 'Primer Trimestre 2026'
};

const CAMPO_FORMATIVO_MAP = {
    'Español': 'Lenguajes', 'Inglés': 'Lenguajes', 'Artes': 'Lenguajes', 'Música': 'Lenguajes',
    'Matemáticas': 'Saberes y Pensamiento Científico', 'Biología': 'Saberes y Pensamiento Científico',
    'Física': 'Saberes y Pensamiento Científico', 'Química': 'Saberes y Pensamiento Científico',
    'Ciencias Química': 'Saberes y Pensamiento Científico', 'Laboratorio': 'Saberes y Pensamiento Científico',
    'Geografía': 'Ética, Naturaleza y Sociedades', 'Historia': 'Ética, Naturaleza y Sociedades',
    'Formación Cívica y Ética': 'Ética, Naturaleza y Sociedades', 'F.CÍVICA Y ÉTICA': 'Ética, Naturaleza y Sociedades',
    'Educación Física': 'De lo Humano y lo Comunitario', 'EDUC. FÍSICA': 'De lo Humano y lo Comunitario',
    'Tecnología': 'De lo Humano y lo Comunitario', 'Tutoría': 'De lo Humano y lo Comunitario',
    'Socioemocional': 'De lo Humano y lo Comunitario', 'Vida Saludable': 'De lo Humano y lo Comunitario',
    'Diseño Arquitectónico': 'De lo Humano y lo Comunitario', 'Diseño Gráfico': 'De lo Humano y lo Comunitario',
    'DISEÑO ARQUITEC.': 'De lo Humano y lo Comunitario', 'DISEÑO GRÁFICO': 'De lo Humano y lo Comunitario'
};

let globalAlumnos = [];

async function initData() {
    try {
        const { data: personal } = await supabaseClient.from('personal').select('nombre').order('nombre');
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
    } catch (e) { console.error("Error initData:", e); }
}

function updateCampo() {
    const asig = document.getElementById('asignatura').value;
    document.getElementById('campo_formativo').value = CAMPO_FORMATIVO_MAP[asig] || 'Asignar campo...';
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
                <p style="font-size: 0.75rem; font-weight: 700; margin-bottom: 0.5rem;">Causa del reporte (Obligatorio):</p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.75rem;">
                    <label><input type="checkbox" name="behav-${alumno.id}" value="Interrupciones"> Interrupciones</label>
                    <label><input type="checkbox" name="behav-${alumno.id}" value="Agresión"> Agresión</label>
                    <label><input type="checkbox" name="behav-${alumno.id}" value="No trabaja"> No trabaja</label>
                    <label><input type="checkbox" name="behav-${alumno.id}" value="Distracción"> Distracción</label>
                    <label><input type="checkbox" name="behav-${alumno.id}" value="Desafío"> Desafío autoridad</label>
                    <label><input type="checkbox" name="behav-${alumno.id}" value="Material"> Falta de material</label>
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
    const periodo = CONFIG.CURRENT_PERIODO;

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
        const name = chk.parentElement.nextElementSibling ? chk.parentElement.nextElementSibling.textContent : ''; // fall back
        const behaviors = Array.from(document.querySelectorAll(`input[name="behav-${id}"]:checked`)).map(b => b.value);
        
        if (behaviors.length === 0) {
            alert('VALIDACIÓN: Cada alumno seleccionado debe tener al menos una conducta marcada.');
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
        conductas_grupales: Array.from(document.querySelectorAll('.chk-grupo:checked')).map(c => c.value),
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

// Auth Centralized
function getAuthCode() {
    return CONFIG.ACCESS_PIN;
}

function checkAccess(val) {
    if (val === getAuthCode()) {
        sessionStorage.setItem('auth_sirde', 'true');
        document.getElementById('auth-wall').style.display = 'none';
        initData();
        return true;
    }
    return false;
}

function logoutSIRDE() {
    sessionStorage.removeItem('auth_sirde');
    location.reload();
}
