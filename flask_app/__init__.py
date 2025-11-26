from flask import Flask
from flask_cors import CORS
import os

app = Flask(__name__)
app.secret_key = "shhhhhh"

# CORS: permite que tu frontend (Render + GitHub Pages) llame a la API
CORS(app, resources={
    r"/*": {  # si quieres restringir a /api/* puedes cambiarlo, pero así es más simple
        "origins": [
            "https://frontend-localizacion.onrender.com",
            "https://dorianandrea.github.io"
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Variables de entorno opcionales
frontend_url = os.getenv("FRONTEND_URL", "https://dorianandrea.github.io")
DATABASE_URL = os.getenv("DATABASE_URL")

# 👇 IMPORTANTE: aquí se importan las rutas para que Flask las registre
from flask_app.controllers import locate_centers  # noqa
