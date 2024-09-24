import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import VehicleInfo from "./VehicleInfo";
import revGeoCod from "./revGeoCod"; 


const vehicleIcon = new L.Icon({
  iconUrl: "/car.png",
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
  const [isStarted, setIsStarted] = useState(false)
  
  const startMoving = () => {
    if (!isStarted) {
      setIsStarted(true); // Disable button after first click
      axios
        .get("https://lvt-backend.onrender.com/vehicle-data?limit=20")
        .then((response) => {
          const data = response.data.data;
          const parsedRoute = data.map((point) => ({
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
    }
  };

  useEffect(() => {
    let currentIndex = 0;

    const moveVehicle = () => {
      if (route.length > 0 && currentIndex < route.length - 1) {
        //moves vehicle
        const prevPosition = route[currentIndex];
        currentIndex += 1;
        const newPosition = route[currentIndex];
        setCurrentPosition([newPosition.latitude, newPosition.longitude]);
        setVisitedRoute((prevPath) => [...prevPath, newPosition]);

        //rotate car
        const latDiff = newPosition.latitude - prevPosition.latitude;
        const lngDiff = newPosition.longitude - prevPosition.longitude;
        const angle = Math.atan2(lngDiff, latDiff) * (180 / Math.PI) + 180;
        setHeading(angle);

        //info
        const distance = Math.sqrt(latDiff ** 2 + lngDiff ** 2);
        setSpeed(distance * 1000);
        setCurrentTime(newPosition.timestamp);

        setTimeout(moveVehicle, 300);
      } else {
        // If the vehicle reached the last point, stop fetching address
        setIsVehicleMoving(false);
        setIsStarted(false)
        setSpeed(0)
      }
    };

    if (route.length > 0) {
      moveVehicle();
    }
  }, [route]);

  useEffect(() => {
    const fetchAddress = () => {
      // Only fetch if the vehicle is still moving
      if (!isVehicleMoving) {
        clearInterval(intervalId); // stop fetching address
        return; 
      }
      revGeoCod(currentPosition[0], currentPosition[1]).then(fetchedAddress => {
        setAddress(fetchedAddress);
      });
    };
    // Initial call to fetch address
    const intervalId = setInterval(fetchAddress, 4000); 
    fetchAddress();
  
    return () => {
      clearInterval(intervalId); 
    };
  }, [isVehicleMoving]);
  
  

  
  return (
    <div className="relative h-[500px]">
      <div className="absolute top-4 right-4 bg-white bg-opacity-80 rounded-lg shadow-lg z-20">
        <VehicleInfo 
          position={currentPosition} 
          heading={heading} 
          speed={speed} 
          time={currentTime}
          start={startMoving}
          isStarted={isStarted}
        />
      </div>

      <MapContainer center={currentPosition} zoom={14.3} className="h-screen p-4 mx-auto w-full z-10">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
      />
        <>
          <Marker
            position={currentPosition}
            icon={L.divIcon({
              className: 'vehicle-icon',
              html: `<div style="transform: rotate(${heading}deg); transform-origin: bottom center;">
                      <img src="${vehicleIcon.options.iconUrl}" style="width: 30px; height: 50px; background:transparent" />
                      </div>`,
              iconSize: [40, 50],
              iconAnchor: [19, 38],
            })}
          >
            <Popup className="rounded-lg">
              <div className="font-semibold"><span className="text-blue-600 font-extrabold">Address: </span>{address ? address : "Loading address..."}</div>
            </Popup>
          </Marker>
            <Polyline positions={visitedRoute.map(pt => [pt.latitude, pt.longitude])} color="blue" />
          </>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
