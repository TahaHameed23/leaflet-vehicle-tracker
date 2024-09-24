import React from "react";

// A functional component to display the vehicle's information
const VehicleInfo = ({ position, heading, speed, time }) => {
  return (
    <div className="flex justify-between">
    <div style={{ padding: "10px", border: "1px solid #ccc" }}>
      <h4>Vehicle Info</h4>
      <p><strong>Latitude:</strong> {position[0]}</p>
      <p><strong>Longitude:</strong> {position[1]}</p>
      <p><strong>Heading:</strong> {heading.toFixed(2)}°</p>
      <p><strong>Speed:</strong> {(speed * 3.6).toFixed(2)} km/h</p> {/* Convert speed to km/h */}
      <p><strong>Time:</strong> {time.toLocaleTimeString()}</p> {/* Display time */}
    </div>
    <div>
        <button className="p-4 m-4 active:bg-blue-600 rounded-2xl bg-blue-400">Start</button>
        <button className="p-4 m-4 active:bg-green-600 rounded-2xl bg-green-400">Stop</button>
    </div>
    </div>
  );
};

export default VehicleInfo;
