const VehicleInfo = ({ position, heading, speed, time, start, isStarted}) => {
  return (
    <div className="flex flex-col justify-between bg-transparent opacity-75 hover:opacity-100 border-blue-400 border-2 hover:border-blue-600 duration-200 rounded-lg max-w-lg mx-auto">
      <div className="p-8 rounded-md px-10">
        <h4 className="text-xl font-semibold mb-4 underline text-gray-800">Vehicle Info</h4>
        <p className="text-gray-700"><strong>Latitude:</strong> {position[0]}</p>
        <p className="text-gray-700"><strong>Longitude:</strong> {position[1]}</p>
        <p className="text-gray-700"><strong>Heading:</strong> {heading.toFixed(2)}°</p>
        <p className="text-gray-700"><strong>Speed:</strong> {(speed * 3.6).toFixed(2)} km/h</p>
        <p className="text-gray-700"><strong>Time:</strong> {time.toLocaleTimeString()}</p> 
      </div>
      <div className="mx-auto my-4">
        <button   className={`bg-blue-600 px-20 rounded-md
    ${isStarted ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-blue-500 active:bg-blue-700 duration-200 cursor-pointer '}`}
        disabled={isStarted} 
         onClick={()=>{
          start()
        }}
        >Start</button>
      </div>
    </div>
  );
};

export default VehicleInfo;
