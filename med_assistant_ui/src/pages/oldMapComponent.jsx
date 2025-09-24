import { useState, useEffect, useCallback } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 28.6139, // Delhi fallback
  lng: 77.209,
};

export default function MapComponent({ specialist, location }) {
  const [center, setCenter] = useState(defaultCenter);
  const [doctors, setDoctors] = useState([]);
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;

  // Ref callback for map (so we can call PlacesService once map is ready)
  const onLoad = useCallback(
    (map) => {
      if (!specialist || !location) return;

      // Step 1: Geocode location into coordinates
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: location }, (results, status) => {
        if (status === "OK" && results[0]) {
          const loc = results[0].geometry.location;
          setCenter(loc);

          // Step 2: Search nearby doctors using PlacesService
          const service = new window.google.maps.places.Place(map);
          service.textSearch(
            {
              query: `${specialist.split(" or ")[0]} in ${location}`,
              location: loc,
              radius: 5000,
            },
            

            (results, status) => {
              console.log("Searching doctors with query:", `${specialist.split(" or ")[0]} in ${location}`);
              console.log("Places API Results:", results);
              if (status === "OK" && results) {
                setDoctors(results);
              } else {
                console.error("Places search failed:", status);
                setDoctors([]);
              }
            }
          );
        } else {
          console.error("Geocode failed:", status);
        }
      });
    },
    [specialist, location]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {/* Doctor List */}
      <div className="bg-white text-black p-4 rounded-lg shadow space-y-4 max-h-[400px] overflow-y-auto">
        <h2 className="text-xl font-bold text-blue-600">Nearby {specialist}</h2>
        {doctors.length > 0 ? (
          doctors.map((doc) => (
            <div
              key={doc.place_id}
              className="border-b pb-2 mb-2 last:border-0 last:pb-0 last:mb-0"
            >
              <strong className="block">{doc.name}</strong>
              <span className="text-sm text-gray-600">
                {doc.formatted_address}
              </span>
              {doc.rating && (
                <span className="block text-yellow-600">⭐ {doc.rating}</span>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No doctors found yet.</p>
        )}
      </div>

      {/* Google Map */}
      <div className="rounded-lg overflow-hidden shadow">
        <LoadScript googleMapsApiKey={API_KEY} libraries={["places"]}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={13}
            onLoad={onLoad} // Attach Places logic here
          >
            {doctors.map((doc) => (
              <Marker
                key={doc.place_id}
                position={doc.geometry.location}
                title={doc.name}
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
}
