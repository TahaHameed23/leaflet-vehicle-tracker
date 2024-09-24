import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios"; // Import axios to make API calls
import VehicleInfo from "./VehicleInfo";
import revGeoCod from "./revGeoCod"; // Ensure this import is correct

const vehicleIcon = new L.Icon({
  iconUrl: "../../public/car.png",
  iconSize: [30, 50],
});

const MapComponent = () => {
  const [route, setRoute] = useState([]);
  const [currentPosition, setCurrentPosition] = useState([25.446815, 81.851309]);
  const [visitedRoute, setVisitedRoute] = useState([]);
  const [heading, setHeading] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [address, setAddress] = useState(""); 
  const [isVehicleMoving, setIsVehicleMoving] = useState(true); 

  useEffect(() => {
    axios.get("http://localhost:3000/vehicle-data?limit=20")
      .then((response) => {
        const data = response.data.data;
        const parsedRoute = data.map(point => ({
          latitude: point.latitude,
          longitude: point.longitude,
          timestamp: new Date(point.timestamp),
        }));
        setRoute(parsedRoute);
        setCurrentPosition([parsedRoute[0].latitude, parsedRoute[0].longitude]);
        setVisitedRoute([{ latitude: parsedRoute[0].latitude, longitude: parsedRoute[0].longitude }]);
      })
      .catch((error) => {
        console.error("Error fetching vehicle data:", error);
      });
  }, []);

  useEffect(() => {
    let currentIndex = 0;

    const moveVehicle = () => {
      if (route.length > 0 && currentIndex < route.length - 1) {
        const prevPosition = route[currentIndex];
        currentIndex += 1;
        const newPosition = route[currentIndex];
        setCurrentPosition([newPosition.latitude, newPosition.longitude]);
        setVisitedRoute((prevPath) => [...prevPath, newPosition]);

        const latDiff = newPosition.latitude - prevPosition.latitude;
        const lngDiff = newPosition.longitude - prevPosition.longitude;
        const angle = Math.atan2(lngDiff, latDiff) * (180 / Math.PI) + 180;
        setHeading(angle);
        const distance = Math.sqrt(latDiff ** 2 + lngDiff ** 2);
        setSpeed(distance * 1000);
        setCurrentTime(newPosition.timestamp);

        setTimeout(moveVehicle, 800);
      } else {
        // If the vehicle has reached the last point, set isVehicleMoving to false
        setIsVehicleMoving(false);
      }
    };

    if (route.length > 0) {
      moveVehicle();
    }
  }, [route]);

  // New useEffect for calling revGeoCod every 6 seconds
  useEffect(() => {
    const fetchAddress = () => {
      // Only fetch if the vehicle is still moving
      if (!isVehicleMoving) {
        clearInterval(intervalId); // Clear interval if the vehicle has stopped
        return; // Exit the function if the vehicle is not moving
      }
  
      revGeoCod(currentPosition[0], currentPosition[1]).then(fetchedAddress => {
        setAddress(fetchedAddress);
      });
    };
  
    // Define the intervalId variable here
    const intervalId = setInterval(fetchAddress, 6000); // Call every 6 seconds
  
    // Initial call to fetch address
    fetchAddress();
  
    return () => {
      clearInterval(intervalId); // Clear interval on component unmount
    }; // Cleanup function to clear interval
  }, [isVehicleMoving]); // Depend on isVehicleMoving and currentPosition
  
  

  
  return (
    <div>
      <VehicleInfo 
        position={currentPosition} 
        heading={heading} 
        speed={speed} 
        time={currentTime}
      />

      <MapContainer center={currentPosition} zoom={13.4} style={{ height: "500px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {visitedRoute.length > 0 && (
          <>
            <Marker
              position={currentPosition}
              icon={L.divIcon({
                className: 'vehicle-icon',
                html: `<div style="transform: rotate(${heading}deg); transform-origin: bottom center;">
                         <img src="${vehicleIcon.options.iconUrl}" style="width: 30px; height: 50px;" />
                       </div>`,
                iconSize: [40, 50],
                iconAnchor: [19, 38],
              })}
            >
              <Popup>
                {address ? address : "Loading address..."}
              </Popup>
            </Marker>
            <Polyline positions={visitedRoute.map(pt => [pt.latitude, pt.longitude])} color="blue" />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
