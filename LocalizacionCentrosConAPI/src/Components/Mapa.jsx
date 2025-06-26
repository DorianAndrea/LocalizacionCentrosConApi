import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader,} from "@react-google-maps/api";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "90vh",
};
const mapId = "7d9e6a68029b6674";

const Mapa = ({ centrosSalud }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearestCentro, setNearestCentro] = useState(null);
  const [distanceKm, setDistanceKm] = useState(null);
  const [centroSeleccionado, setCentroSeleccionado] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyD4ZEmTaUkJj7cm5Ux7qYsuJ8mR0AeJMBg",
    libraries,
  });

  // Cálculo de distancia con fórmula de Haversine
  const getDistanciaKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  useEffect(() => {
    if (!isLoaded || !navigator.geolocation || centrosSalud.length === 0) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLatLng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setUserLocation(userLatLng);

        // Buscar centro más cercano
        let minDistance = Infinity;
        let nearest = null;
        let distance = null;

        centrosSalud.forEach((centro) => {
          const d = getDistanciaKm(
            userLatLng.lat,
            userLatLng.lng,
            parseFloat(centro.latitud),
            parseFloat(centro.longitud)
          );
          if (parseFloat(d) < minDistance) {
            minDistance = parseFloat(d);
            nearest = centro;
            distance = d;
          }
        });

        if (nearest) {
          setNearestCentro(nearest);
          setDistanceKm(distance);
          setOpenDialog(true);
        }
      },
      (error) => console.error("Error obteniendo ubicación del usuario:", error)
    );
  }, [isLoaded, centrosSalud]);

  if (loadError) return <div>Error al cargar el mapa</div>;
  if (!isLoaded) return <div>Cargando mapa...</div>;

  return (
    <>
      <GoogleMap
        center={userLocation || { lat: -33.4489, lng: -70.6693 }}
        zoom={13}
        mapContainerStyle={mapContainerStyle}
        mapId={mapId}
      >
        {/* Marcador del usuario */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
              scaledSize: new window.google.maps.Size(40, 40),
            }}
            title="Aquí Estoy"
          />
        )}

        {/* Marcadores de centros de salud */}
        {centrosSalud.map((centro, i) => (
          <Marker
            key={i}
            position={{
              lat: parseFloat(centro.latitud),
              lng: parseFloat(centro.longitud),
            }}
            onClick={() => setCentroSeleccionado(centro)}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/hospitals.png",
              scaledSize: new window.google.maps.Size(32, 32),
            }}
            title={centro.nombre}
          />
        ))}

        {/* InfoWindow cuando se selecciona un centro */}
        {centroSeleccionado && (
          <InfoWindow
            position={{
              lat: parseFloat(centroSeleccionado.latitud),
              lng: parseFloat(centroSeleccionado.longitud),
            }}
            onCloseClick={() => setCentroSeleccionado(null)}
          >
            <div>
              <strong>{centroSeleccionado.nombre}</strong>
              <p>Dirección: {centroSeleccionado.direccion} {centroSeleccionado.numero}</p>
              <p>Teléfono: {centroSeleccionado.telefono || "Sin teléfono"}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Diálogo con el centro más cercano */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Centro de Urgencia Más Cercano</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>{nearestCentro?.nombre}</strong>
            <br />
            Dirección: {nearestCentro?.direccion} {nearestCentro?.numero}
            <br />
            Tipo: {nearestCentro?.tipo}
            <br />
            Distancia: {distanceKm} km
            {nearestCentro?.telefono && (
              <>
                <br />
                Teléfono: {nearestCentro.telefono}
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
