from flask_app import app
from flask import jsonify
from flask_cors import cross_origin
import os
import json

@app.route('/')
@cross_origin()
def locate():
    ruta_json = os.path.join(app.root_path, 'static', 'centros.json')
    print(f"Ruta del JSON: {ruta_json}")

    try:
        with open(ruta_json, 'r', encoding='utf-8') as f:
            datos = json.load(f)

        print(f" Total registros cargados: {len(datos)}")

        centros = []
        for item in datos:
            try:
                if isinstance(item, dict):
                    lat = float(item.get("LATITUD", 0))
                    lng = float(item.get("LONGITUD", 0))
                    if lat and lng:
                        centro = {
                            "nombre": item.get("NOMBRE", "Sin nombre"),
                            "latitud": lat,
                            "longitud": lng,
                            "tipo": item.get("TIPO", ""),
                            "numero": item.get("NUMERO", ""),
                            "direccion": item.get("DIRECCION", ""),
                            "telefono": item.get("FONO", ""),
                            "region": item.get("REGION", ""),
                            "comuna": item.get("COMUNA", "")
                        }
                        centros.append(centro)
            except Exception as err_item:
                print(f"⚠️ Error en item: {err_item}")
                continue

        print(f"Centros válidos: {len(centros)}")
        if centros:
            print(f"Primer centro: {centros[0]}")
        return jsonify({"centros": centros})
    
    except Exception as e:
        print(f"Error cargando JSON: {e}")
        return jsonify({"centros": [], "error": str(e)})
