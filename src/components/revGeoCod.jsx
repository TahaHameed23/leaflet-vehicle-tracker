import axios from "axios";

const url = "https://nominatim.openstreetmap.org/reverse?format=jsonv2";

const revGeoCod = async (latitude, longitude) => {
    try {
        const response = await axios.get(`${url}&lat=${latitude}&lon=${longitude}`);
        return response.data.display_name;
    } catch (error) {
        console.error("Error fetching address:", error);
        return null;
    }
};

export default revGeoCod;
