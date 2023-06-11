exports.routeRadiusComparison = (route, storeLocations) => {
  const steps = route.legs[0].steps;
  let results = [];
  const storeDistance = 10;

  for (let i = 0; i < storeLocations.length; i++) {
    const storeLatitude = storeLocations[i].latitude;
    const storeLongitude = storeLocations[i].longitude;

    for (let index = 0; index < steps.length; index++) {
      const latitude = steps[i].startLocation.latLng.latitude;
      const longitude = steps[i].startLocation.latLng.longitude;

      const distance = calculateDistance(
        latitude,
        longitude,
        storeLatitude,
        storeLongitude
      );
      // console.log(distance);
      if (distance <= storeDistance) {
        results.push(storeLocations[i]);
        break;
      }
    }
  }

  return results;
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  // Convert coordinates to radians
  const lat1Rad = toRadians(lat1);
  const lon1Rad = toRadians(lon1);
  const lat2Rad = toRadians(lat2);
  const lon2Rad = toRadians(lon2);

  // Calculate differences
  const dLat = lat2Rad - lat1Rad;
  const dLon = lon2Rad - lon1Rad;

  // Haversine formula
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Earth's radius in kilometers
  const radius = 6371;

  // Calculate distance
  const distance = radius * c;

  return distance;
}

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}
