import React, { useEffect, useState, useRef } from "react";
import Mapa from "./Mapa";

const MapaContainer = () => {
  const [latitude, setLatitude] = useState(-33.4489); // Default: Santiago
  const [longitude, setLongitude] = useState(-70.6693);
  const [centrosSalud, setCentrosSalud] = useState([]);
  const [ubicacionOk, setUbicacionOk] = useState(false); // estado que ayuda a controlar el renderizado(la retrasa) hasta que la ubicacion del usuario
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // ubicación del usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setUbicacionOk(true) //solo se activa despues de obtener ubicacion
        },
        (err) => {
          console.warn("No se pudo obtener ubicación, usando la ubicación por defecto");
          setUbicacionOk(true)
        }
      );
    }else{
      setUbicacionOk(true)
    }

    // Obtener datos del backend
    const fetchCentros = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/`);
        const data = await res.json();
        //console.log("Datos del backend:", data);

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
      {!ubicacionOk ? (
        <p> Cargando ubicacación del usuario...</p>
      ) :(
        <Mapa
        latitude={latitude}
        longitude={longitude}
        centrosSalud={centrosSalud}
      />   
      )}
      
    </div>
  );
};

export default MapaContainer;
