
function initMap() { 

  // Cebu city location
  let cebuCity = {lat: 10.31793, lng: 123.87512};
    
  // Create the map.
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: cebuCity
  });
  
  // Get input elements
  const fromEl = document.getElementById("from");
  const toEl = document.getElementById("toResto");
  const travelModeEl = document.getElementById("mode");
  
  // Set values on first load
  let locationValues = {
    from: fromEl.value, 
    to: toEl.value, 
    mode: travelModeEl.value
  };
  
  // Load the restaurant GeoJSON onto the map.
  map.data.loadGeoJson(
    "https://raw.githubusercontent.com/HangerIsACat/cebu-restomap/main/data/resto-cebu.json", 
    {idPropertyName: "id"}, 
    
    // GeoJSON load callback; used for setting options of the select element To
    (data) => { 
      
      for (let i = 0; i < data.length; i++) {
        let optionEl = document.createElement("option");
        optionEl.innerHTML = data[i].h.name;
        
        // Set restaurant coordinates as option value
        let restoCoords = data[i].g.get();
        optionEl.value = `${restoCoords.lat()},${restoCoords.lng()}`;
        
        toEl.appendChild(optionEl);
      }
      
      // After loading GeoJSON data, try to calculate direction
      locationValues.to = toEl.value;
      calculateAndDisplay(dirService, dirRenderer, locationValues);
      
    });
  
  const infoWindow = new google.maps.InfoWindow();

  // Show the information for a restaurant when its marker is clicked.
  map.data.addListener("click", (event) => {
    const name = event.feature.getProperty("name");
    const restoType = event.feature.getProperty("type");
    const specialty = event.feature.getProperty("specialty");
    const revenue = event.feature.getProperty("revenue");
    
    const position = event.feature.getGeometry().get();
    const imgSrc = `https://maps.googleapis.com/maps/api/streetview?size=350x120&location=${position.lat()},${position.lng()}&key=AIzaSyBte69eYal_spmFAdVtkgxtv58da7sjbA4`;
    
    const content = `
        <h2>${name}</h2>
        <p>Restaurant type: ${restoType}</p>
        <p>Specialty: ${specialty}</p>
        <p>No. of visitors: ${0}</p>
        <p><img src="${imgSrc}"></p>
    `;

    infoWindow.setContent(content);
    infoWindow.setPosition(position);
    infoWindow.setOptions({pixelOffset: new google.maps.Size(0, -30)});
    infoWindow.open(map);
  });
  
  // Place the search input at the top right as a Google control.
  let searchRestoPanelEl = document.getElementById("searchRestoPanel");
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(searchRestoPanelEl);
  
  // Set autocomplete on from input element. 
  let fromInputEl = document.getElementById("from");
  const autocompleteOptions = { componentRestrictions: {country: "ph"} };
  autocomplete = new google.maps.places.Autocomplete(fromInputEl, autocompleteOptions);
  
  // Set the origin marker point when the user selects an address. 
  const originMarker = new google.maps.Marker({map: map});
  originMarker.setVisible(false);
  
  // Listener for autocomplete; set marker on the location that the user inputs.
  autocomplete.addListener("place_changed", async () => {
    originMarker.setVisible(false);
    let originLocation = map.getCenter();
    const place = autocomplete.getPlace();
    
    if (!place.geometry) {
      window.alert(`No address available for that input: ${place.name}`);
      return;
    }
    
    // Recenter the map to the selected address
    originLocation = place.geometry.location;
    map.setCenter(originLocation);
    
    // Reposition origin marker
    originMarker.setPosition(originLocation);
    originMarker.setVisible(true);
    
    // Re-calculate direction based on from value change
    locationValues.from = fromEl.value;
    calculateAndDisplay(dirService, dirRenderer, locationValues);
  });
  
  // Instantiate objects needed for rendering directions
  const dirRenderer = new google.maps.DirectionsRenderer();
  const dirService = new google.maps.DirectionsService();
  
  dirRenderer.setMap(map);
  
  toEl.addEventListener("change", () => {
    locationValues.to = toEl.value;
    calculateAndDisplay(dirService, dirRenderer, locationValues);
  }); 
  
  travelModeEl.addEventListener("change", () => {
    locationValues.mode = travelModeEl.value;
    calculateAndDisplay(dirService, dirRenderer, locationValues);
  });
  
}

function convertToLatLng(value) {
  let locationArray = value.split(",", 2);
  return new google.maps.LatLng(parseFloat(locationArray[0]), parseFloat(locationArray[1]));
}

function calculateAndDisplay(dirService, dirRenderer, location) {
  
  if (!location.from || !location.to) {
    return;
  }

  dirService
    .route({
      origin: location.from, 
      destination: convertToLatLng(location.to), 
      travelMode: google.maps.TravelMode.DRIVING
    })
    .then((response) => {
      dirRenderer.setDirections(response);
    })
    .catch((error) => {
      alert(`Direction request failed due to ${status}.`);
    });
}

