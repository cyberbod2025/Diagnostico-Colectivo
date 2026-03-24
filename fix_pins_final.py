
def get_name_parts(full):
    # Heurística: Muchos están como SUR SUR NAME NAME
    # Otros como NAME NAME SUR SUR
    # Surnames comunes:
    surnames = {'SANCHEZ', 'RESENDIZ', 'ALVAREZ', 'GOMEZ', 'ANDRADE', 'GALICIA', 'ARELLANO', 'SANTOYO', 'AZUCENO', 'GIL', 'CONTRERAS', 'MARTINEZ', 'CORTES', 'BAIZABAL', 'ROJAS', 'SALMERON', 'CRUZ', 'MARIN', 'DIAZ', 'VILLANUEVA', 'NUÑEZ', 'RUIZ', 'ECHEVARRIA', 'GARCIA', 'FLORES', 'CALVILLO', 'LOPEZ', 'SILVA', 'GALINDO', 'ARGUETA', 'GUERRERO', 'OROZCO', 'PEREZ', 'GUTIERREZ', 'AVENDANO', 'HERNANDEZ', 'MARCOS', 'HURTADO', 'JURADO', 'CHAVEZ', 'LEGARIA', 'GORDILLO', 'MEDINA', 'FRANCO', 'MORALES', 'SANDOVAL', 'MOTA', 'CANO', 'NERIA', 'RANGEL', 'BANDY', 'RIVERA', 'ROBLEDO', 'OSORIO', 'RODRIGUEZ', 'MARQUEZ', 'ROSAS', 'BELLO', 'TABAREZ', 'CASARRUBIAS', 'URBANO', 'VALLERROJO', 'MALLA', 'VARGAS', 'ANDRES', 'VILLALOBOS', 'CERVANTES', 'XOLALPA', 'JIMENEZ'}
    
    words = full.replace('.', '').split()
    names = [w for w in words if w.upper() not in surnames]
    if not names:
        # Si falló la heurística, buscar palabras que no son apellidos conocidos (asumiendo que los que quedaron son nombres)
        # O simplemente tomar las que sobran
        if len(words) >= 3: names = words[2:]
        else: names = [words[0]]
    return names

data = [
    "MIGUEL ANGEL MORALES SANDOVAL", "NERIA DIAZ PABLO ISAAC", "LOPEZ QUERO JOSE LUIS",
    "JURADO CHAVEZ VICTOR ALEJANDRO", "ROBLEDO OSORIO MARTHA GDPE.", "VARGAS ANDRES DIANA ALEXANDRA",
    "VILLALOBOS CERVANTES SILVIA Y.", "XOLALPA JIMENEZ NORMA LORENA", "INGRID GONZALEZ NAVARRETE",
    "GUERRERO PEREZ SUSANA", "CORTES BAIZABAL GERMAN", "LEGARIA GORDILLO JOSE LUIS",
    "RAMIREZ TELOXA ANGELES YERALDIN", "VALLERROJO MALLA MA. DEL SOCORRO", "BERNAL ESTRADA MARISOL",
    "CORTES ROJAS JUAN ANTONIO", "URBANO LOPEZ HANS EDSON", "TABAREZ CASARRUBIAS BALTAZAR",
    "ECHEVARRIA GARCIA ELIZABETH", "HERNANDEZ MARCOS PEDRO", "CORTES SALMERON JAIRO DAVID",
    "CRUZ MARIN FERMIN ANTONIO", "ROSAS BELLO JORGE LUIS", "PINA FUENTES DULCE JANETTE",
    "PEREZ PEREZ KIMBERLY", "DIAZ VILLANUEVA BRENDA JOSAHANY", "RIVERA GARCIA PABLO MIGUEL",
    "RANGEL BANDY JORGE ANTONIO", "GUERRERO OROZCO NORMA P.", "HURTADO MARIN JUAN JOSE",
    "FLORES LOPEZ VICTOR MANUEL", "GUTIERREZ AVENDANO DIANA BELEM", "ARELLANO SANTOYO MIGUEL",
    "MOTA CANO NOE", "MORALES NAVARRETE RUTH", "RAMÍREZ SILVA VICENTE", "CONTRERAS MARTINEZ JOSELYN",
    "ANDRADE GALICIA CLAUDIA", "FLORES SILVA JORGE ALBERTO", "CAMPOS VILCHIS EDUARDO",
    "RIVERA CRUZ ORALIA", "AZUCENO GIL JUVENTINA ROCIO", "DIAZ NUÑEZ MARIA ELENA",
    "ALVAREZ GOMEZ JUAN LUIS", "GARCIA PEÑALOZA MARCELINA PAULA", "MEDINA FRANCO JOSE LUIS",
    "DIAZ RUIZ EDGAR", "FLORES CALVILLO GABRIELA", "GALINDO ARGUETA DULCE MARIA",
    "RODRIGUEZ MARQUEZ JORGE", "SANCHEZ RESENDIZ HUGO"
]

results = []
for full in data:
    names = get_name_parts(full)
    pin_name = "".join(names).upper()
    if not pin_name: pin_name = full.split()[0] # Fallback
    
    # Especial HUGO
    if "HUGO" in full: pin_name = "HUGO"
    
    results.append({"full": full, "pin_base": pin_name})

# Verificar duplicados y añadir inicial de apellido si necesario
counts = {}
for r in results:
    p = r["pin_base"]
    counts[p] = counts.get(p, 0) + 1

final_sql = []
for r in results:
    pin = r["pin_base"]
    if counts[pin] > 1:
        # Añadir inicial del primer apellido del original
        sur = r["full"].split()[0]
        pin = f"{pin}{sur[0]}"
    
    final_sql.append(f"UPDATE personal SET acceso_pin = '09DES4310M-{pin}' WHERE nombre = '{r['full']}';")

print("\n".join(final_sql))
