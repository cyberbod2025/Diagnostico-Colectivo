
surnames = {
    'MORALES', 'SANDOVAL', 'NERIA', 'DIAZ', 'LOPEZ', 'QUERO', 'JURADO', 'CHAVEZ', 
    'ROBLEDO', 'OSORIO', 'VARGAS', 'ANDRES', 'VILLALOBOS', 'CERVANTES', 'XOLALPA', 
    'JIMENEZ', 'GONZALEZ', 'NAVARRETE', 'GUERRERO', 'PEREZ', 'CORTES', 'BAIZABAL', 
    'LEGARIA', 'GORDILLO', 'RAMIREZ', 'TELOXA', 'VALLERROJO', 'MALLA', 'BERNAL', 
    'ESTRADA', 'URBANO', 'TABAREZ', 'CASARRUBIAS', 'ECHEVARRIA', 'GARCIA', 
    'HERNANDEZ', 'MARCOS', 'SALMERON', 'CRUZ', 'MARIN', 'ROSAS', 'BELLO', 'PINA', 
    'FUENTES', 'RIVERA', 'RANGEL', 'BANDY', 'HURTADO', 'FLORES', 'GUTIERREZ', 
    'ARELLANO', 'SANTOYO', 'MOTA', 'CANO', 'RAMÍREZ', 'SILVA', 'CONTRERAS', 
    'MARTINEZ', 'ANDRADE', 'GALICIA', 'CAMPOS', 'VILCHIS', 'AZUCENO', 'GIL', 
    'NUÑEZ', 'RUIZ', 'CALVILLO', 'GALINDO', 'ARGUETA', 'RODRIGUEZ', 'MARQUEZ', 
    'RESENDIZ', 'SANCHEZ', 'GOMEZ', 'ALVAREZ'
}

data = [
    {"nombre":"MIGUEL ANGEL MORALES SANDOVAL","id":"CB28"},
    {"nombre":"NERIA DIAZ PABLO ISAAC","id":"1790"},
    {"nombre":"LOPEZ QUERO JOSE LUIS","id":"11B5"},
    {"nombre":"JURADO CHAVEZ VICTOR ALEJANDRO","id":"C3D8"},
    {"nombre":"ROBLEDO OSORIO MARTHA GDPE.","id":"C191"},
    {"nombre":"VARGAS ANDRES DIANA ALEXANDRA","id":"E6A8"},
    {"nombre":"VILLALOBOS CERVANTES SILVIA Y.","id":"0B2D"},
    {"nombre":"XOLALPA JIMENEZ NORMA LORENA","id":"191E"},
    {"nombre":"INGRID GONZALEZ NAVARRETE","id":"7D8A"},
    {"nombre":"GUERRERO PEREZ SUSANA","id":"A484"},
    {"nombre":"CORTES BAIZABAL GERMAN","id":"03B2"},
    {"nombre":"LEGARIA GORDILLO JOSE LUIS","id":"7C7B"},
    {"nombre":"RAMIREZ TELOXA ANGELES YERALDIN","id":"252E"},
    {"nombre":"VALLERROJO MALLA MA. DEL SOCORRO","id":"35BE"},
    {"nombre":"BERNAL ESTRADA MARISOL","id":"FD01"},
    {"nombre":"CORTES ROJAS JUAN ANTONIO","id":"8778"},
    {"nombre":"URBANO LOPEZ HANS EDSON","id":"7A40"},
    {"nombre":"TABAREZ CASARRUBIAS BALTAZAR","id":"54B6"},
    {"nombre":"ECHEVARRIA GARCIA ELIZABETH","id":"5095"},
    {"nombre":"HERNANDEZ MARCOS PEDRO","id":"A0E7"},
    {"nombre":"CORTES SALMERON JAIRO DAVID","id":"8DFE"},
    {"nombre":"CRUZ MARIN FERMIN ANTONIO","id":"093F"},
    {"nombre":"ROSAS BELLO JORGE LUIS","id":"7358"},
    {"nombre":"PINA FUENTES DULCE JANETTE","id":"0A1D"},
    {"nombre":"PEREZ PEREZ KIMBERLY","id":"80D4"},
    {"nombre":"DIAZ VILLANUEVA BRENDA JOSAHANY","id":"69E0"},
    {"nombre":"RIVERA GARCIA PABLO MIGUEL","id":"78F6"},
    {"nombre":"RANGEL BANDY JORGE ANTONIO","id":"6BB4"},
    {"nombre":"GUERRERO OROZCO NORMA P.","id":"7285"},
    {"nombre":"HURTADO MARIN JUAN JOSE","id":"1916"},
    {"nombre":"FLORES LOPEZ VICTOR MANUEL","id":"4C83"},
    {"nombre":"GUTIERREZ AVENDANO DIANA BELEM","id":"8429"},
    {"nombre":"ARELLANO SANTOYO MIGUEL","id":"B796"},
    {"nombre":"MOTA CANO NOE","id":"06C8"},
    {"nombre":"MORALES NAVARRETE RUTH","id":"53F1"},
    {"nombre":"RAMÍREZ SILVA VICENTE","id":"3CCF"},
    {"nombre":"CONTRERAS MARTINEZ JOSELYN","id":"DE22"},
    {"nombre":"ANDRADE GALICIA CLAUDIA","id":"E835"},
    {"nombre":"FLORES SILVA JORGE ALBERTO","id":"B94F"},
    {"nombre":"CAMPOS VILCHIS EDUARDO","id":"B6F7"},
    {"nombre":"RIVERA CRUZ ORALIA","id":"0123"},
    {"nombre":"AZUCENO GIL JUVENTINA ROCIO","id":"D91E"},
    {"nombre":"DIAZ NUÑEZ MARIA ELENA","id":"386E"},
    {"nombre":"ALVAREZ GOMEZ JUAN LUIS","id":"8B48"},
    {"nombre":"GARCIA PEÑALOZA MARCELINA PAULA","id":"8AD1"},
    {"nombre":"MEDINA FRANCO JOSE LUIS","id":"BB2F"},
    {"nombre":"DIAZ RUIZ EDGAR","id":"3A25"},
    {"nombre":"FLORES CALVILLO GABRIELA","id":"0CB0"},
    {"nombre":"GALINDO ARGUETA DULCE MARIA","id":"2412"},
    {"nombre":"RODRIGUEZ MARQUEZ JORGE","id":"92B6"},
    {"nombre":"SANCHEZ RESENDIZ HUGO","id":"HUGO"}
]

sql_updates = []
for item in data:
    name_full = item["nombre"]
    words = name_full.replace('.', '').split()
    
    # Intentar encontrar el primer nombre (Palabra que no sea apellido)
    chosen_name = None
    for w in words:
        if w.upper() not in surnames:
            chosen_name = w
            break
    
    if not chosen_name:
        # Si todos son "apellidos", probamos la 3ra palabra (formato SUR SUR NAME)
        if len(words) >= 3:
            chosen_name = words[2]
        else:
            chosen_name = words[0]
            
    # Caso especial para HUGO
    if "HUGO" in name_full:
        pin = "09DES4310M-HUGO"
    else:
        pin = f"09DES4310M-{chosen_name.upper()}-{item['id']}"
        
    sql_updates.append(f"UPDATE personal SET acceso_pin = '{pin}' WHERE nombre = '{name_full}';")

print("\n".join(sql_updates))
