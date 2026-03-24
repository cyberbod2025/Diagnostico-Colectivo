/* SIRDE-310 | Logic & Wizard Blindaje v1.0.2 */
const SUPABASE_URL = 'https://uvnetpnjinxzhggoqmwz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_oBpidcqpYzP_JMU-xYi9ZQ_HXYouwyL';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let globalAlumnos = [];
let globalPersonal = [];
let currentStep = 1;

async function checkAccess(pin) {
    if (!pin) return;
    try {
        console.log("LOG: Verificando PIN institucional...");
        const { data: teacher, error } = await supabaseClient.from('personal').select('*').ilike('acceso_pin', pin.trim()).single();
        if (error || !teacher) { 
            alert("PIN NO VÁLIDO. Verifique sus credenciales institucionales."); 
            console.warn("LOG: Intento de acceso fallido.");
            return; 
        }
        
        console.log("LOG: Acceso concedido a:", teacher.nombre);
        sessionStorage.setItem('sirde_session_pin', pin);
        await initData();

        const docInput = document.getElementById('docente');
        if(docInput) {
            docInput.value = teacher.nombre;
            docInput.disabled = true;
            onTeacherChange();
        }
        document.getElementById('auth-wall').classList.add('hidden');
        updateProgress(1);
    } catch (e) { console.error("Critical error in checkAccess:", e); }
}

async function initData() {
    console.log("Iniciando carga de datos escolar...");
    const { data: p, error: ep } = await supabaseClient.from('personal').select('nombre, departamento').order('nombre');
    globalPersonal = p || [];
    if (ep) console.error("Error cargando personal:", ep);
    
    const { data: a, error: ea } = await supabaseClient.from('alumnos').select('*').order('nombre_completo');
    globalAlumnos = a || [];
    if (ea) console.error("Error cargando alumnos:", ea);
    
    console.log(`Cargados ${globalPersonal.length} docentes y ${globalAlumnos.length} alumnos.`);
    
    const d = document.getElementById('docente');
    if (d) {
        d.innerHTML = '<option value="">Seleccionar Docente...</option>';
        globalPersonal.forEach(x => d.add(new Option(x.nombre, x.nombre)));
    }
}

function updateProgress(step) {
    const bar = document.getElementById('prog-bar');
    if (!bar) return;
    const pct = ((step - 1) / 3) * 100;
    bar.style.width = pct + "%";
    
    for (let i = 1; i <= 4; i++) {
        const dot = document.getElementById(`step-dot-${i}`);
        const lbl = document.getElementById(`step-lbl-${i}`);
        if (!dot || !lbl) continue; // SEGURIDAD: evitar crash si no existen

        if (i < step) {
            dot.classList.add('bg-primary-green', 'text-[#02140f]', 'border-primary-green');
            dot.classList.remove('bg-slate-800', 'border-white/10', 'text-slate-500');
            lbl.classList.add('text-primary-green');
            lbl.classList.remove('text-slate-500');
        } else if (i === step) {
            dot.classList.add('border-primary-green', 'scale-110', 'shadow-[0_0_15px_rgba(0,255,166,0.4)]');
            dot.classList.remove('bg-slate-800', 'text-[#02140f]');
            dot.style.backgroundColor = 'white';
            lbl.classList.add('text-white');
            lbl.classList.remove('text-slate-500');
        } else {
            dot.className = 'w-8 h-8 rounded-full bg-slate-800 border-2 border-white/10 flex items-center justify-center text-[10px] font-black transition-all';
            dot.style.backgroundColor = '';
            lbl.className = 'text-[8px] font-bold text-slate-500 uppercase tracking-tighter';
        }
    }
}

function validateNext(from, to) {
    if (from === 1) {
        const valDocente = document.getElementById('docente').value;
        const valGrupo = document.getElementById('grupo').value;
        const valAsignatura = document.getElementById('asignatura').value;
        if (!valDocente || !valGrupo || !valAsignatura) { 
            alert("Por favor complete Docente, Grupo y Asignatura para continuar."); 
            return; 
        }
    }
    
    document.getElementById(`step-${from}`).classList.add('hidden');
    document.getElementById(`step-${to}`).classList.remove('hidden');
    if (to === 2) calculateImpact(); // Asegurar impacto al llegar al Paso 2
    if (to === 3) renderStudents(); // Asegurar render al llegar al Paso 3
    updateProgress(to);
    window.scrollTo(0, 0);
}

function prevSection(to) {
    const current = document.querySelector('section.card:not(.hidden)');
    if (current) current.classList.add('hidden');
    document.getElementById(`step-${to}`).classList.remove('hidden');
    updateProgress(to);
}

function toggleOtroFactor(checked) {
    document.getElementById('otro-factor-container').classList.toggle('hidden', !checked);
}

function onTeacherChange() {
    const name = document.getElementById('docente').value;
    const p = globalPersonal.find(x => x.nombre === name);
    if (p) {
        const asig = document.getElementById('asignatura');
        asig.value = p.departamento || '';
        asig.readOnly = true;
        updateCampo();
    }
}

function updateCampo() {
    const val = document.getElementById('asignatura').value.toUpperCase();
    const map = { 
        'MATEMÁTICAS': 'Saberes y P. Científico', 
        'BIOLOGÍA': 'Saberes y P. Científico', 
        'FÍSICA': 'Saberes y P. Científico',
        'QUÍMICA': 'Saberes y P. Científico',
        'TECNOLOGÍA': 'Saberes y P. Científico',
        'ESPAÑOL': 'Lenguajes', 
        'ARTES': 'Lenguajes', 
        'INGLÉS': 'Lenguajes',
        'HISTORIA': 'Ética, Naturaleza y Sociedades',
        'GEOGRAFÍA': 'Ética, Naturaleza y Sociedades',
        'FCYE': 'Ética, Naturaleza y Sociedades',
        'VIDA SALUDABLE': 'De lo Humano y lo Comunitario',
        'EDUCACIÓN FÍSICA': 'De lo Humano y lo Comunitario',
        'SOCIOEMOCIONAL': 'De lo Humano y lo Comunitario'
    };
    document.getElementById('campo_formativo').value = map[val] || 'De lo Humano y lo Comunitario';
}

function renderStudents() {
    const grupo = document.getElementById('grupo').value;
    const list = document.getElementById('student-list');
    const badge = document.getElementById('group-name-badge');
    if (!list) return;

    if (badge) badge.textContent = `GRUPO: ${grupo || '---'}`;

    console.log("LOG: renderStudents para grupo ->", grupo);
    
    if (!grupo) {
        list.innerHTML = '<p class="text-center text-slate-500 text-[10px] uppercase font-black py-10">Seleccione un grupo en el Paso 1 para ver el listado</p>';
        return;
    }

    if (!globalAlumnos || globalAlumnos.length === 0) {
        list.innerHTML = '<div class="p-8 text-center text-slate-500 text-xs italic">Cargando base de datos escolar...</div>';
        return;
    }

    const filtered = globalAlumnos.filter(s => {
        if (!s.grupo) return false;
        return s.grupo.toString().trim().toUpperCase() === grupo.toString().trim().toUpperCase();
    });

    if (filtered.length === 0) {
        list.innerHTML = `<div class="p-8 text-center text-slate-500 text-xs italic font-black uppercase text-red-500/50">No se encontraron alumnos para el grupo ${grupo}</div>`;
        return;
    }
    
    console.log("LOG: Alumnos filtrados ->", filtered.length);
    list.innerHTML = '';
    console.log(`Renderizando ${filtered.length} alumnos para el grupo ${grupo}`);
    
    if (filtered.length === 0) {
        list.innerHTML = `
            <div class="p-10 text-center border-2 border-dashed border-red-500/20 rounded-3xl">
                <p class="text-white font-bold text-sm mb-2">⚠️ NO SE ENCONTRARON ALUMNOS</p>
                <p class="text-[10px] text-slate-500 uppercase">Verifique que el grupo "${grupo}" sea correcto en el Paso 1.</p>
            </div>`;
    } else {
        filtered.forEach(al => {
            const div = document.createElement('div');
            div.className = 'p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-3 transition-all hover:border-primary-green/30 mb-3';
            div.innerHTML = `
                <div class="flex items-center justify-between">
                    <label class="flex items-center gap-3 cursor-pointer w-full">
                        <input type="checkbox" onchange="toggleStudentSub('${al.id}', this.checked)" data-id="${al.id}" class="chk-student w-6 h-6 rounded-lg accent-primary-green">
                        <span class="font-bold text-[13px] text-white tracking-tight leading-tight">${al.nombre_completo}</span>
                    </label>
                </div>
                <div id="sub-${al.id}" class="hidden space-y-4 pt-2 border-t border-white/5 mt-1">
                    ${['Desatención', 'Disrupción', 'Agresión', 'Tareas'].map(b => {
                        const uniqueId = `behav-${al.id}-${b.replace(/\s+/g, '')}`;
                        return `
                            <div class="flex flex-col gap-2">
                                <label for="${uniqueId}" class="text-[10px] font-black text-slate-400 uppercase tracking-tighter">${b}</label>
                                <select id="${uniqueId}" name="${uniqueId}" class="behav-sel w-full text-xs p-3 bg-slate-900 rounded-xl text-white border-white/10" data-name="${b}">
                                    <option value="Nula">NIVEL: NULO</option>
                                    <option value="Baja">BAJO</option>
                                    <option value="Media">MEDIO</option>
                                    <option value="Alta">ALTO</option>
                                </select>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
            list.appendChild(div);
        });
    }
}

function toggleStudentSub(id, v) { 
    const sub = document.getElementById(`sub-${id}`);
    if (sub) sub.classList.toggle('hidden', !v); 
}


function calculateImpact() {
    const sum = Array.from(document.querySelectorAll('.impact-factor')).reduce((a, b) => a + parseInt(b.value), 0);
    document.getElementById('impacto').value = (sum <= 4) ? 'Crítico' : (sum <= 6) ? 'Alto' : (sum <= 8) ? 'Medio' : 'Bajo';
}

async function handleFormSubmit(e) {
    if (e) e.preventDefault();
    const btn = document.getElementById('btn-submit');
    btn.disabled = true;
    btn.textContent = "REGISTRANDO...";

    const reported = [];
    document.querySelectorAll('.chk-student:checked').forEach(chk => {
        const id = chk.getAttribute('data-id');
        const s = document.getElementById(`sub-${id}`);
        if (!s) return;
        reported.push({
            alumno_id: id,
            nombre: globalAlumnos.find(a => a.id == id)?.nombre_completo,
            behaviors: Array.from(s.querySelectorAll('.behav-sel')).map(sel => ({ type: sel.getAttribute('data-name'), level: sel.value }))
        });
    });

    const estrategias = Array.from(document.querySelectorAll('.estrategia-chk:checked')).map(c => c.value);
    if (document.getElementById('chk-otra-est')?.checked) {
        const otraVal = document.getElementById('otra-est-text')?.value;
        if (otraVal) estrategias.push(`OTRA: ${otraVal}`);
    }

    const payload = {
        docente: document.getElementById('docente').value,
        grupo: document.getElementById('grupo').value,
        asignatura: document.getElementById('asignatura').value,
        campo_formativo: document.getElementById('campo_formativo').value,
        periodo: document.getElementById('current-periodo')?.value || 'T2-2026',
        impacto: document.getElementById('impacto').value,
        tiempo_conducta: document.getElementById('tiempo_conducta').value,
        ambiente_aula: {
            atencion: document.getElementById('amb-atencion').value,
            respeto: document.getElementById('amb-respeto').value,
            participacion: document.getElementById('amb-participacion').value
        },
        factores_externos: Array.from(document.querySelectorAll('.fact-ext-chk:checked')).map(c => c.value).concat(document.getElementById('fact-ext-otro-chk').checked ? [document.getElementById('fact-ext-text').value] : []),
        alumnos_reportados: reported,
        estrategias: estrategias,
        eficacia_estrategias: document.getElementById('est-eficacia').value,
        comentarios: document.getElementById('comentarios').value,
        fecha: new Date().toISOString()
    };

    try {
        const { error } = await supabaseClient.from('respuestas_docentes').insert([payload]);
        if (error) throw error;
        
        document.body.innerHTML = `
            <div class="min-h-screen flex flex-col items-center justify-center p-6 bg-[#02140f] text-white text-center">
                <div id="success-card" class="card max-w-lg w-full border-2 border-primary-green animate-fade-in p-10">
                    <div class="mb-8">
                        <div class="w-20 h-20 bg-primary-green text-[#02140f] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-green/20">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h1 class="text-3xl font-black mb-2 tracking-tighter text-primary-green">DIAGNÓSTICO REGISTRADO</h1>
                        <p class="text-[10px] text-slate-400 uppercase tracking-widest">Respaldo Institucional para ${payload.grupo} - ${payload.asignatura}</p>
                    </div>

                    <div class="grid grid-cols-1 gap-4 mb-10">
                        <button onclick="window.print()" class="btn-primary py-4 rounded-2xl flex items-center justify-center gap-3">
                            <span>🖨️ IMPRIMIR REPORTE</span>
                        </button>
                        <button onclick="exportResultPDF()" class="px-6 py-4 bg-white/10 font-bold rounded-2xl border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-3">
                            <span>📥 GUARDAR PDF (DISPOSITIVO)</span>
                        </button>
                        <a href="dashboard.html" class="px-6 py-4 bg-blue-600 font-bold rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 text-xs">
                            <span class="text-xs">📊 VER ANÁLISIS DEL GRUPO</span>
                        </a>
                        <button onclick="location.reload()" class="px-6 py-4 bg-slate-800 font-bold rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-3 text-xs">
                            <span class="text-xs">➕ ENVIAR OTRO REPORTE</span>
                        </button>
                    </div>
                </div>
            </div>`;
    } catch (err) {
        alert("Error al guardar: " + err.message);
        btn.disabled = false;
        btn.textContent = "REINTENTAR REGISTRO";
    }
}

function exportResultPDF() {
    const element = document.getElementById('success-card');
    const opt = { 
        margin: 10, 
        filename: 'SIRDE-310-Reporte.pdf', 
        image: { type: 'jpeg', quality: 1 }, 
        html2canvas: { scale: 3 }, 
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } 
    };
    html2pdf().set(opt).from(element).save();
}

function togglePinVisibility(id) { const i = document.getElementById(id); i.type = (i.type === 'password' ? 'text' : 'password'); }
function logoutSIRDE() { sessionStorage.clear(); location.reload(); }

window.addEventListener('DOMContentLoaded', () => {
    const pin = sessionStorage.getItem('sirde_session_pin');
    if (pin) checkAccess(pin);
    // Inicializar impacto si los elementos existen
    if(document.querySelector('.impact-factor')) calculateImpact();
});
