import React, { useEffect, useState } from "react";
import Mapa from "./Mapa";

const MapaContainer = () => {
  const [latitude, setLatitude] = useState(-33.4489); // Default: Santiago
  const [longitude, setLongitude] = useState(-70.6693);
  const [centrosSalud, setCentrosSalud] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    // Obtener ubicación del usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (err) => {
          console.warn(
            "No se pudo obtener ubicación"
          );
        }
      );
    }

    // Obtener datos del backend
    const fetchCentros = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/urgencia`);
        const data = await res.json();
        console.log("Datos del backend:", data);

        if (!Array.isArray(data.centros)) {
          throw new Error("Formato inválido: se esperaba los 'centros'");
        }

        setCentrosSalud(data.centros || []);
      } catch (err) {
        console.error("Error al obtener centros:", err);
        setError(`Error al cargar centros: ${err.message}`);
      }
        
    };

    fetchCentros();
    
  },[]);

  return (
    <div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <Mapa
        latitude={latitude}
        longitude={longitude}
        centrosSalud={centrosSalud}
      />
    </div>
  );
};

export default MapaContainer;
