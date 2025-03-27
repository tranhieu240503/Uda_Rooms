const axios = require("axios");

// chuyển địa chỉ sang tọa độ
const createCoordinates = async (address) => {
    try {
        const response = await axios.get("https://nominatim.openstreetmap.org/search", {
            params: {
                q: address,
                format: "json",
                limit: 1
            }
        })
        if (response.data.length > 0) {
            const { lat, lon } = response.data[0]; // Lấy kinh độ (lon) và vĩ độ (lat)
            return { lat, lon }; // Trả về kết quả tọa độ
        } else {
            throw new Error("Không tìm thấy tọa độ."); // Nếu không tìm thấy, ném lỗi
        }
    } catch (error) {

    }
}
// tính khoảng cách giữa các tọa độđộ
const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Bán kính Trái đất (km)
    const toRad = angle => (angle * Math.PI) / 180; // Chuyển độ sang radian

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c * 1000; // Khoảng cách theo km
};
// tìm các tiện ích gần nhất ( mỗi loại 1 cáicái)
const findNearbyAmenities = async (lat, lon, radius = 4000) => {
    try {
        const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];(node(around:${radius},${lat},${lon})[amenity~"hospital|pharmacy|place_of_worship"];node(around:${radius},${lat},${lon})[shop=convenience];);out;`;

        const response = await axios.get(overpassUrl);
        console.log(response)
        if (!response.data.elements.length) {
            return "Không tìm thấy tiện ích nào gần đây.";
        }

        let nearestAmenities = {}; // Lưu tiện ích gần nhất cho từng loại

        response.data.elements.forEach(place => {
            const type = place.tags.amenity;
            const distance = calculateHaversineDistance(lat, lon, place.lat, place.lon);

            // Nếu chưa có tiện ích loại này hoặc tìm được cái gần hơn
            if (!nearestAmenities[type] || distance < nearestAmenities[type].distance) {
                nearestAmenities[type] = {
                    name: place.tags.name || "Không có tên",
                    type,
                    lat: place.lat,
                    lon: place.lon,
                    distance
                };
            }
        });

        return Object.values(nearestAmenities); // Trả về danh sách mỗi loại 1 cái gần nhất
    } catch (error) {
        console.error("Lỗi khi tìm tiện ích:", error);
        return null;
    }
};

module.exports = { createCoordinates, findNearbyAmenities, calculateHaversineDistance }; // Xuất hàm để sử dụng ở nơi khác
