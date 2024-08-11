import React, { useState, useCallback, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  DirectionsRenderer,
} from "@react-google-maps/api";
import BluePinIcon from "../../assets/icons/PinIcons/BluePinIcon.svg";
import RedPinIcon from "../../assets/icons/PinIcons/RedPinIcon.svg";
import GreenPinIcon from "../../assets/icons/PinIcons/GreenPinicon.svg";
import YellowPinIcon from "../../assets/icons/PinIcons/YellowPinIcon.svg";
import MidpointIcon from "../../assets/icons/PinIcons/MidpointIcon.svg";
import ItineraryIcon from "../../assets/icons/PinIcons/ItineraryIcon.svg";
import { useGoogleMaps } from "../../contexts/MapsContext";

function Map({ friendsAddresses, itinerary, containerStyle, stage, paths, setSelected }) {
  const { isLoaded, loadError } = useGoogleMaps();

  const strokeColors = ["#FF0000", "#FDBF49", "#2985FF", "#2CCE59"];

  const [map, setMap] = useState(null);
  const [directionsResults, setDirectionsResults] = useState([]);
  const [waypointResults, setWaypointResults] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);

  const onLoad = useCallback(
    (map) => {
      setMap(map);
      const bounds = new window.google.maps.LatLngBounds();

      console.log(friendsAddresses);

      if (friendsAddresses) {
        friendsAddresses.map(
          (address) =>
            !!address &&
            bounds.extend(
              new window.google.maps.LatLng(
                address.location.lat,
                address.location.lng
              )
            )
        );
        map.fitBounds(bounds);
      }
    },
    [friendsAddresses, stage]
  );

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const fetchDirections = useCallback(async () => {
    if (!map || !currentLocation || stage === 1) return;

    const directionsService = new window.google.maps.DirectionsService();

    const routePromises =
      !!friendsAddresses[0] &&
      friendsAddresses.map(
        (address) =>
          new Promise((resolve, reject) => {
            directionsService.route(
              {
                origin: new window.google.maps.LatLng(
                  address.location.lat,
                  address.location.lng
                ),
                destination: new window.google.maps.LatLng(
                  itinerary.midpoint[0],
                  itinerary.midpoint[1]
                ),
                travelMode: window.google.maps.TravelMode.DRIVING,
              },
              (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                  resolve(result);
                } else {
                  reject(`Directions request failed due to ${status}`);
                }
              }
            );
          })
      );

    try {
      const results = await Promise.all(routePromises);
      setDirectionsResults(results);
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
  }, [map, currentLocation, itinerary, friendsAddresses, stage]);

  const fetchWaypointSteps = useCallback(
    async ({ origin, destination }) => {
      if (!map || !currentLocation || stage === 1) return;

      const directionsService = new window.google.maps.DirectionsService();

      try {
        const result = await new Promise((resolve, reject) => {
          directionsService.route(
            {
              origin: new window.google.maps.LatLng(origin[0], origin[1]),
              destination: new window.google.maps.LatLng(
                destination[0],
                destination[1]
              ),
              travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === window.google.maps.DirectionsStatus.OK) {
                resolve(result);
              } else {
                reject(`Directions request failed due to ${status}`);
              }
            }
          );
        });
        setWaypointResults((prevResults) => [...prevResults, result]);
      } catch (error) {
        console.error("Error fetching directions:", error);
      }
    },
    [map, currentLocation, stage]
  );

  useEffect(() => {
    if (isLoaded && map) {
      setDirectionsResults([]); // Clear previous directions
      setWaypointResults([]); // Clear previous waypoints

      if (stage > 1) {
        fetchDirections();

        !!paths && paths?.directions?.map((place, index) => {
          const origin = place.origin;
          const destination = place.destination;

          console.log(origin, destination);

          fetchWaypointSteps({ origin, destination });
        });
      }
    }
  }, [
    isLoaded,
    map,
    friendsAddresses,
    itinerary,
    fetchDirections,
    fetchWaypointSteps,
    stage,
  ]);

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(userLocation);
          map?.setCenter(userLocation);
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [map]);

  if (loadError) {
    return <div>Error loading map</div>;
  }

  return isLoaded && currentLocation ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={currentLocation}
      zoom={14}
      onLoad={onLoad}
      onUnmount={onUnmount}
      key={stage}
    >
      {stage < 3 &&
        directionsResults.map((result, index) => (
          <MarkerF
            position={result.routes[0].overview_path[0]}
            key={index}
            icon={
              (index === 0 && RedPinIcon) ||
              (index === 1 && YellowPinIcon) ||
              (index === 2 && BluePinIcon) ||
              (index === 3 && GreenPinIcon)
            }
          />
        ))}
      {stage > 1 && (
        <>
          <MarkerF
            position={{
              lat: itinerary?.midpoint[0],
              lng: itinerary?.midpoint[1],
            }}
            key={"center"}
            icon={MidpointIcon}
          />
          {itinerary?.itinerary.map((place, idx) => (
            <MarkerF
              position={place.coord}
              key={`it-${idx}`}
              icon={ItineraryIcon}
              onClick={() => setSelected(place)}
            />
          ))}
        </>
      )}
      {stage === 2 &&
        stage < 3 &&
        directionsResults.map((result, index) => (
          <DirectionsRenderer
            key={index}
            directions={result}
            options={{
              polylineOptions: {
                strokeColor: strokeColors[index],
                strokeWeight: 3,
              },
              suppressMarkers: true,
            }}
            suppressMarkers={true}
          />
        ))}
      {stage > 2 &&
        waypointResults.map((result, index) => (
          <DirectionsRenderer
            key={index}
            directions={result}
            options={{
              polylineOptions: {
                strokeColor: "#5CCA7B",
                strokeWeight: 3,
              },
              suppressMarkers: true,
            }}
            suppressMarkers={true}
          />
        ))}
    </GoogleMap>
  ) : (
    <div
      style={{ height: containerStyle.height }}
      className="bg-base-white flex items-center justify-center"
    >
      <h3 className="text-black">Loading Map</h3>
    </div>
  );
}

export default React.memo(Map);
