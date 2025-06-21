import React, { useEffect, useRef, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const libraries = ["places", "marker"];
const mapId = "7d9e6a68029b6674";

const Mapa = ({ latitude, longitude, centrosSalud }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [nearestCentro, setNearestCentro] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [distanceKm, setDistanceKm] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyD4ZEmTaUkJj7cm5Ux7qYsuJ8mR0AeJMBg",
    libraries: libraries,
    mapIds: [mapId],
  });

  // Fórmula de Haversine
  const getDistanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  useEffect(() => {
    if (loadError) {
      console.error("Error al cargar Google Maps API:", loadError);
      return;
    }

    if (!isLoaded || !window.google || !window.google.maps || !centrosSalud || centrosSalud.length === 0) {
      return;
    }

    console.log("Centros recibidos del backend:", centrosSalud);

    const googleMap = new window.google.maps.Map(mapRef.current, {
      center: {
        lat: parseFloat(latitude) || -33.4489,
        lng: parseFloat(longitude) || -70.6693,
      },
      zoom: 13,
      mapId: mapId,
    });

    setMap(googleMap);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLatLng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setUserLocation(userLatLng);
          googleMap.setCenter(userLatLng);
          
          // agregar un icono distinto a los centros de salud
          const iconoUsuario = document.createElement('div');
          iconoUsuario.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="#4CAF50'" viewBox="0 0 24 24">
           <path d="M13.49 5.48a1.5 1.5 0 1 0-2.98 0 1.5 1.5 0 0 0 2.98 0ZM10.75 9c-.66 0-1.28.32-1.68.85L7.46 
           12.16a2.25 2.25 0 0 0 .24 2.96l.68.68-1.65 3.69a.75.75 0 1 0 1.36.61l1.84-4.11a.75.75 0 0 0-.14-.84l-.95-.95.6-.92 2.3 2.3-.79 3.57a.75.75 0 0 0 1.47.32l.85-3.86a.75.75 0 0 0-.2-.68l-1.75-1.75.9-1.38.5 1.23c.1.26.3.48.55.6l2.63 1.32a.75.75 0 0 0 .67-1.34l-2.22-1.1-1.01-2.5A1.75 1.75 0 0 0 10.75 9Z" />
          </svg>
          `
          new window.google.maps.marker.AdvancedMarkerElement({
            map: googleMap,
            position: userLatLng,
            title: "Tu ubicación",
            content: iconoUsuario
          });

          let minDistance = Infinity;
          let nearest = null;
          let calculatedDistance = null;

          centrosSalud.forEach((centro) => {
            const distance = getDistanceKm(
              userLatLng.lat,
              userLatLng.lng,
              parseFloat(centro.latitud),
              parseFloat(centro.longitud)
            );

            if (parseFloat(distance) < minDistance) {
              minDistance = parseFloat(distance);
              nearest = centro;
              calculatedDistance = distance;
            }
          });

          if (nearest) {
            setNearestCentro(nearest);
            setDistanceKm(calculatedDistance);
            setOpenDialog(true);
          }
        },
        (error) => console.error("Error obteniendo ubicación del usuario", error)
      );
    }

    centrosSalud.forEach((centro) => {
      if (!centro.latitud || !centro.longitud) return;

      new window.google.maps.marker.AdvancedMarkerElement({
        map: googleMap,
        position: {
          lat: parseFloat(centro.latitud),
          lng: parseFloat(centro.longitud),
        },
        title: centro.nombre,
      });
    });

  }, [isLoaded, loadError, latitude, longitude, centrosSalud]);

  if (loadError) return <div>Error al cargar Google Maps API</div>;
  if (!isLoaded) return <div>Cargando mapa...</div>;

  return (
    <>
      <div ref={mapRef} style={{ width: "100%", height: "90vh" }} />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Centro de Urgencia Más Cercano</DialogTitle>
        <DialogContent>
          <DialogContentText>
            El centro de salud más cercano es:
            <br />
            <strong>{nearestCentro?.nombre}</strong>
            <br />
            <strong>Dirección:</strong> {nearestCentro?.direccion}
            <br />
            <strong>Número:</strong> {nearestCentro?.numero}
            <br />
            <strong>Tipo:</strong> {nearestCentro?.tipo}
            <br />
            <strong>Distancia:</strong> {distanceKm} km
            {nearestCentro?.telefono && (
              <>
                <br />
                <strong>Teléfono:</strong> {nearestCentro.telefono}
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Mapa;
