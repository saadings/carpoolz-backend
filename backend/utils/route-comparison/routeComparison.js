exports.routeComparison = (route, routeList) => {
  activePassengers = [];

  driverSteps = {};

  for (let i = 0; i < route.legs.length; i++) {
    for (let j = 0; j < route.legs[i].steps.length; j++) {
      let encodedPolyline = route.legs[i].steps[j].polyline.encodedPolyline;
      driverSteps[encodedPolyline] = route.legs[i].steps[j];
    }
  }

  for (let i = 0; i < routeList.route.length; i++) {
    let userName = routeList[i].userName;
    if (
      routeList[i].polyline.encodedPolyline == route.polyline.encodedPolyline
    ) {
      activePassengers.push(userName);
      continue;
    }

    let distance = 0;
    let legs = routeList[i].legs;

    for (let j = 0; j < legs.length; j++) {
      let steps = legs[j].steps;

      for (let k = 0; k < steps.length; k++) {
        let encodedPolyline = steps[k].polyline.encodedPolyline;
        try {
          if (driverSteps[encodedPolyline]) {
            distance += steps[k].distanceMeters;
          }
        } catch (error) {}
      }
    }

    if (distance > route.distanceMeters * 0.5) {
      console.log("Distance: ", distance);
      console.log("Actual Distance: ", route.distanceMeters);
      activePassengers.push(userName);
    }
  }
  return activePassengers;
};
