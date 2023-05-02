
class Helper {

  // Get input elements
  static get searchRestoInputEl() {
    return {
      // type: document.getElementById("type"), 
      from: document.getElementById("from"), 
      to: document.getElementById("toResto"), 
      mode: document.getElementById("mode")
    }
  }
  
  // Set values on first load
  static get locationValues() {
    return {
      from: this.searchRestoInputEl.from.value, 
      to: this.searchRestoInputEl.to.value, 
      mode: this.searchRestoInputEl.mode.value
    }
  }
  
  // GeoJSON load callback; used for setting options of the select element To
  static initRestaurants(data) {
    let restoTypes = new Set();
    
    data.forEach((feature) => {
    
      // Add unique type value to restaurant types
      restoTypes.add(feature.h.type);
    
      let optionEl = document.createElement("option");
      optionEl.innerHTML = feature.h.name;
      
      // Set restaurant coordinates as option value
      let restoCoords = feature.g.get();
      optionEl.value = `${restoCoords.lat()},${restoCoords.lng()}`;
      
      Helper.searchRestoInputEl.to.appendChild(optionEl);
      
    });
    
    // Set restaurant types value using GeoJSON data
    restoTypes.forEach((value) => {      
      let optionEl = document.createElement("option");
      optionEl.innerHTML = value;
      optionEl.value = value;
      
      // Helper.searchRestoInputEl.type.appendChild(optionEl);
    });
  }
  
  static convertToLatLng(value) {
    let locationArray = value.split(",", 2);
    return new google.maps.LatLng(parseFloat(locationArray[0]), parseFloat(locationArray[1]));
  }
  
  // Calculate distance between origin and destination
  static calculateDistance(directionService, directionRenderer, location) {
    
    if (!location.from || !location.to) {
      return;
    }

    directionService
      .route({
        origin: location.from, 
        destination: Helper.convertToLatLng(location.to), 
        travelMode: google.maps.TravelMode[location.mode]
      })
      .then((response) => {
        directionRenderer.setDirections(response);
      })
      .catch((error) => {
        console.error(error.stack);
        alert(`${Messages.errorCalculateDistance} ${error.message}`);
      });
  }
  
  // Show the information for a restaurant.
  static restoInfoContainer(event) { 
    const name = event.feature.getProperty("name");
    const restoType = event.feature.getProperty("type");
    const specialty = event.feature.getProperty("specialty");
    const revenue = event.feature.getProperty("revenue");
    
    const position = event.feature.getGeometry().get();
    const imgSrc = `https://maps.googleapis.com/maps/api/streetview?size=350x120&location=${position.lat()},${position.lng()}&key=AIzaSyBte69eYal_spmFAdVtkgxtv58da7sjbA4`;
    
    const contentEl = `
        <h2>${name}</h2>
        <p>Restaurant type: ${restoType}</p>
        <p>Specialty: ${specialty}</p>
        <p>No. of visitors: ${0}</p>
        <p><img src="${imgSrc}"></p>
    `;
    
    return { contentEl, position }
  }

}

