
import json

data = [
    {"id":"cb28", "nombre":"MIGUEL ANGEL MORALES SANDOVAL", "name":"MIGUEL", "sur":"ANGEL"},
    {"id":"1790", "nombre":"NERIA DIAZ PABLO ISAAC", "name":"PABLO", "sur":"ISAAC"}, # Note: Neria Diaz is surname
    {"id":"11b5", "nombre":"LOPEZ QUERO JOSE LUIS", "name":"JOSE", "sur":"LUIS"},
    {"id":"c3d8", "nombre":"JURADO CHAVEZ VICTOR ALEJANDRO", "name":"VICTOR", "sur":"ALEJANDRO"},
    {"id":"c191", "nombre":"ROBLEDO OSORIO MARTHA GDPE.", "name":"MARTHA", "sur":"GDPE"},
    {"id":"e6a8", "nombre":"VARGAS ANDRES DIANA ALEXANDRA", "name":"DIANA", "sur":"ALEXANDRA"},
    {"id":"80d4", "nombre":"PEREZ PEREZ KIMBERLY", "name":"KIMBERLY", "sur":""},
    {"id":"69e0", "nombre":"DIAZ VILLANUEVA BRENDA JOSAHANY", "name":"BRENDA", "sur":""},
    {"id":"78f6", "nombre":"RIVERA GARCIA PABLO MIGUEL", "name":"PABLO", "sur":"MIGUEL"},
    {"id":"6bb4", "nombre":"RANGEL BANDY JORGE ANTONIO", "name":"JORGE", "sur":"ANTONIO"},
    {"id":"7285", "nombre":"GUERRERO OROZCO NORMA P.", "name":"NORMA", "sur":""},
    {"id":"1916", "nombre":"HURTADO MARIN JUAN JOSE", "name":"JUAN", "sur":"JOSE"},
    {"id":"4c83", "nombre":"FLORES LOPEZ VICTOR MANUEL", "name":"VICTOR", "sur":"MANUEL"},
    {"id":"8429", "nombre":"GUTIERREZ AVENDANO DIANA BELEM", "name":"DIANA", "sur":"BELEM"},
    {"id":"b796", "nombre":"ARELLANO SANTOYO MIGUEL", "name":"MIGUEL", "sur":""},
    {"id":"06c8", "nombre":"MOTA CANO NOE", "name":"NOE", "sur":""},
    {"id":"53f1", "nombre":"MORALES NAVARRETE RUTH", "name":"RUTH", "sur":""},
    {"id":"3ccf", "nombre":"RAMÍREZ SILVA VICENTE", "name":"VICENTE", "sur":""},
    {"id":"de22", "nombre":"CONTRERAS MARTINEZ JOSELYN", "name":"JOSELYN", "sur":""},
    {"id":"e835", "nombre":"ANDRADE GALICIA CLAUDIA", "name":"CLAUDIA", "sur":""},
    {"id":"b94f", "nombre":"FLORES SILVA JORGE ALBERTO", "name":"JORGE", "sur":"ALBERTO"},
    {"id":"b6f7", "nombre":"CAMPOS VILCHIS EDUARDO", "name":"EDUARDO", "sur":""},
    {"id":"0123", "nombre":"RIVERA CRUZ ORALIA", "name":"ORALIA", "sur":""},
    {"id":"d91e", "nombre":"AZUCENO GIL JUVENTINA ROCIO", "name":"JUVENTINA", "sur":""},
    {"id":"386e", "nombre":"DIAZ NUÑEZ MARIA ELENA", "name":"MARIA", "sur":""},
    {"id":"8b48", "nombre":"ALVAREZ GOMEZ JUAN LUIS", "name":"JUAN", "sur":"LUIS"},
    {"id":"8ad1", "nombre":"GARCIA PEÑALOZA MARCELINA PAULA", "name":"MARCELINA", "sur":""},
    {"id":"bb2f", "nombre":"MEDINA FRANCO JOSE LUIS", "name":"JOSE", "sur":"LUIS"},
    {"id":"3a25", "nombre":"DIAZ RUIZ EDGAR", "name":"EDGAR", "sur":""},
    {"id":"0cb0", "nombre":"FLORES CALVILLO GABRIELA", "name":"GABRIELA", "sur":""},
    {"id":"2412", "nombre":"GALINDO ARGUETA DULCE MARIA", "name":"DULCE", "sur":"MARIA"},
    {"id":"92b6", "nombre":"RODRIGUEZ MARQUEZ JORGE", "name":"JORGE", "sur":""},
    {"id":"daa7", "nombre":"SANCHEZ RESENDIZ HUGO", "name":"HUGO", "sur":""},
    {"id":"0b2d", "nombre":"VILLALOBOS CERVANTES SILVIA Y.", "name":"SILVIA", "sur":""},
    {"id":"191e", "nombre":"XOLALPA JIMENEZ NORMA LORENA", "name":"NORMA", "sur":"LORENA"},
    {"id":"7d8a", "nombre":"INGRID GONZALEZ NAVARRETE", "name":"INGRID", "sur":""},
    {"id":"a484", "nombre":"GUERRERO PEREZ SUSANA", "name":"SUSANA", "sur":""},
    {"id":"03b2", "nombre":"CORTES BAIZABAL GERMAN", "name":"GERMAN", "sur":""},
    {"id":"7c7b", "nombre":"LEGARIA GORDILLO JOSE LUIS", "name":"JOSE", "sur":"LUIS"},
    {"id":"252e", "nombre":"RAMIREZ TELOXA ANGELES YERALDIN", "name":"ANGELES", "sur":""},
    {"id":"35be", "nombre":"VALLERROJO MALLA MA. DEL SOCORRO", "name":"MA", "sur":""},
    {"id":"fd01", "nombre":"BERNAL ESTRADA MARISOL", "name":"MARISOL", "sur":""},
    {"id":"8778", "nombre":"CORTES ROJAS JUAN ANTONIO", "name":"JUAN", "sur":"ANTONIO"},
    {"id":"7a40", "nombre":"URBANO LOPEZ HANS EDSON", "name":"HANS", "sur":""},
    {"id":"54b6", "nombre":"TABAREZ CASARRUBIAS BALTAZAR", "name":"BALTAZAR", "sur":""},
    {"id":"5095", "nombre":"ECHEVARRIA GARCIA ELIZABETH", "name":"ELIZABETH", "sur":""},
    {"id":"a0e7", "nombre":"HERNANDEZ MARCOS PEDRO", "name":"PEDRO", "sur":""},
    {"id":"8dfe", "nombre":"CORTES SALMERON JAIRO DAVID", "name":"JAIRO", "sur":""},
    {"id":"093f", "nombre":"CRUZ MARIN FERMIN ANTONIO", "name":"FERMIN", "sur":""},
    {"id":"7358", "nombre":"ROSAS BELLO JORGE LUIS", "name":"JORGE", "sur":"LUIS"},
    {"id":"0a1d", "nombre":"PINA FUENTES DULCE JANETTE", "name":"DULCE", "sur":"JANETTE"}
]

# Paso 1: Contar ocurrencias de nombres
counts = {}
for item in data:
    name = item["name"]
    counts[name] = counts.get(name, 0) + 1

# Paso 2: Generar PINs
final_pins = []
for item in data:
    name = item["name"]
    full_name = item["nombre"]
    if counts[name] > 1:
        # Usar el primer apellido para diferenciar
        surname_parts = full_name.split()
        # Heurística: Si detectamos que el nombre es al final (HUGO), buscamos el primer apellido
        # Pero para ser simples: usamos la primera palabra del nombre completo como apellido si el nombre era la 3ra.
        # En el caso de "JORGE ANTONIO RANGEL", Jorge es el nombre.
        # Mejor: Usamos las dos primeras letras de su apellido paterno.
        surname = surname_parts[0]
        pin = f"09DES4310M-{name}-{surname}"
    else:
        pin = f"09DES4310M-{name}"
    
    # Especial HUGO
    if "HUGO" in full_name:
        pin = "09DES4310M-HUGO"
        
    final_pins.append((full_name, pin))

sql = "BEGIN;\n"
for name, pin in final_pins:
    sql += f"UPDATE personal SET acceso_pin = '{pin}' WHERE nombre = '{name}';\n"
sql += "COMMIT;"
print(sql)
