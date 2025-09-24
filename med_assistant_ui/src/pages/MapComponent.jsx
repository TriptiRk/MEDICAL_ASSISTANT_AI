import React, { useState, useEffect, useCallback, useRef } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 28.6139, // Delhi fallback
  lng: 77.209,
};

const LIBRARIES = ["places"];

export default function MapComponent({ specialist, location }) {
  const [center, setCenter] = useState(defaultCenter);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const mapRef = useRef(null);

  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: API_KEY,
    libraries: LIBRARIES,
  });

  // Search doctors using PlacesService
  const searchDoctors = useCallback(() => {
    if (!specialist || !location || !window.google || !mapRef.current) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: location }, (results, status) => {
      if (status === "OK" && results[0]) {
        const loc = results[0].geometry.location;
        setCenter(loc);

        const service = new window.google.maps.places.PlacesService(mapRef.current);
        service.textSearch(
          {
            location: loc,
            query: `${specialist.split(" or ")[0]} in ${location}`,
            radius: 5000,
          },
          (results, status) => {
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
  }, [specialist, location]);

  // Fetch full details for selected doctor
  const fetchDoctorDetails = useCallback((placeId) => {
    if (!window.google || !mapRef.current) return;

    const service = new window.google.maps.places.PlacesService(mapRef.current);
    service.getDetails(
      {
        placeId,
        fields: [
          "name",
          "formatted_address",
          "formatted_phone_number",
          "rating",
          "reviews",
          "website",
        ],
      },
      (place, status) => {
        if (status === "OK" && place) {
          setSelectedDoctor(place);
        } else {
          console.error("Failed to fetch doctor details:", status);
          setSelectedDoctor(null);
        }
      }
    );
  }, []);

  const onLoad = useCallback(
    (map) => {
      mapRef.current = map;
      searchDoctors();
    },
    [searchDoctors]
  );

  useEffect(() => {
    if (mapRef.current) searchDoctors();
  }, [specialist, location, searchDoctors]);

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {/* Doctor List */}
      <div className="bg-white text-black p-4 rounded-lg shadow space-y-4 max-h-[400px] overflow-y-auto">
        <h2 className="text-xl font-bold text-blue-600">Nearby {specialist}</h2>

        {doctors.length > 0 ? (
          doctors.map((doc) => (
            <div
              key={doc.place_id}
              className="border-b pb-2 mb-2 last:border-0 last:pb-0 last:mb-0 cursor-pointer hover:bg-gray-100 p-2 rounded"
              onClick={() => fetchDoctorDetails(doc.place_id)}
            >
              <strong className="block">{doc.name}</strong>
              <span className="text-sm text-gray-600">{doc.formatted_address}</span>
              {doc.rating && <span className="block text-yellow-600">⭐ {doc.rating}</span>}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No doctors found yet.</p>
        )}

        {/* Selected Doctor Details */}
        {selectedDoctor && (
          <div className="bg-gray-50 p-3 rounded-lg border mt-4">
            <h3 className="text-lg font-bold">{selectedDoctor.name}</h3>
            {selectedDoctor.rating && <p>Rating: ⭐ {selectedDoctor.rating}</p>}
            {selectedDoctor.formatted_address && <p>Address: {selectedDoctor.formatted_address}</p>}
            {selectedDoctor.formatted_phone_number && <p>Phone: {selectedDoctor.formatted_phone_number}</p>}
            {selectedDoctor.website && (
              <p>
                Website:{" "}
                <a href={selectedDoctor.website} target="_blank" className="text-blue-600">
                  {selectedDoctor.website}
                </a>
              </p>
            )}
            {selectedDoctor.reviews && (
              <div className="mt-2">
                <h4 className="font-semibold">Reviews:</h4>
                {selectedDoctor.reviews.slice(0, 3).map((rev, idx) => (
                  <p key={idx} className="text-sm text-gray-700">
                    "{rev.text}" - <strong>{rev.author_name}</strong>
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Google Map */}
      <div className="rounded-lg overflow-hidden shadow">
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13} onLoad={onLoad}>
          {doctors.map((doc) => (
            <Marker
              key={doc.place_id}
              position={doc.geometry.location}
              title={doc.name}
              onClick={() => fetchDoctorDetails(doc.place_id)}
            />
          ))}
        </GoogleMap>
      </div>
    </div>
  );
}
