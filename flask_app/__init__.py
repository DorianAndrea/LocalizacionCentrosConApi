from flask import Flask
from flask_cors import CORS
import os

app = Flask(__name__)
app.secret_key = "shhhhhh"

# URL frontend en GitHub Pages y Render
CORS(app, resources={
    r"/api/*": {
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

