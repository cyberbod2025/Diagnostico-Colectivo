const fs = require('fs');

const file = 'c:/Users/Hugo System/repos/Diagnostico-Colectivo/dashboard.html';
let content = fs.readFileSync(file, 'utf8');

// Aumentar la tipografía minúscula
content = content.replace(/text-\[8px\]/g, 'text-xs');
content = content.replace(/text-\[9px\]/g, 'text-xs');
content = content.replace(/text-\[10px\]/g, 'text-sm');
content = content.replace(/text-\[11px\]/g, 'text-sm');

// Quitar tonos slate/blue/orange rígidos por defaults transparentes/claros
content = content.replace(/text-slate-900/g, 'text-cyan-400');
content = content.replace(/text-slate-800/g, 'text-cyan-300');
content = content.replace(/text-slate-500/g, 'text-slate-400'); // Un poco más legibles
content = content.replace(/bg-slate-900/g, 'bg-transparent');
content = content.replace(/text-blue-900/g, 'text-white');
content = content.replace(/text-orange-900/g, 'text-orange-300');

// Eliminar las clases custom que arruinan la card en el header de dashboard.html
content = content.replace('<style>\r\n        .conclusion-card {\r\n            border-left: 6px solid var(--primary-blue);\r\n            line-height: 1.6;\r\n            background: #1e293b !important;\r\n            color: #f8fafc !important;\r\n        }\r\n        .cte-section {\r\n            border: 2px dashed var(--primary-blue);\r\n            margin-top: 1.5rem;\r\n            background: rgba(30, 41, 59, 0.5) !important;\r\n        }\r\n    </style>', '');
content = content.replace('<style>\n        .conclusion-card {\n            border-left: 6px solid var(--primary-blue);\n            line-height: 1.6;\n            background: #1e293b !important;\n            color: #f8fafc !important;\n        }\n        .cte-section {\n            border: 2px dashed var(--primary-blue);\n            margin-top: 1.5rem;\n            background: rgba(30, 41, 59, 0.5) !important;\n        }\n    </style>', '');

// Guardar
fs.writeFileSync(file, content);
console.log('Done replacement on dashboard.html');
