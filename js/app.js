
function initApp(map) {
  
  // Instantiate objects needed for rendering directions
  const dirRenderer = new google.maps.DirectionsRenderer();
  const dirService = new google.maps.DirectionsService();
  
  // Intantiate objects needed for rendering restaurant info window
  const infoWindow = new google.maps.InfoWindow();
  
  // Get input elements
  const fromEl = document.getElementById("from");
  const toEl = document.getElementById("toResto");
  const travelModeEl = document.getElementById("mode");
  
  // Set map to directions renderer
  dirRenderer.setMap(map);

  // Show the information for a restaurant when its marker is clicked.
  map.data.addListener("click", (event) => {
    let infoContainer = Helper.restoInfoContainer(event);
    
    
    infoWindow.setContent(infoContainer.contentEl);
    infoWindow.setPosition(infoContainer.position);
    infoWindow.setOptions({pixelOffset: new google.maps.Size(0, -30)});
    infoWindow.open(map);
  });
  
  // Place the search input at the top right as a Google control.
  let searchRestoPanelEl = document.getElementById("searchRestoPanel");
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(searchRestoPanelEl);
  
  // Set autocomplete on from input element. 
  const autocompleteOptions = { componentRestrictions: {country: "ph"} };
  autocomplete = new google.maps.places.Autocomplete(fromEl, autocompleteOptions);
  
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
    
    // Re-calculate distance when origin address changes
    Helper.locationValues.from = Helper.searchRestoInputEl.from.value;
    Helper.calculateDistance(
      dirService, 
      dirRenderer, 
      Helper.locationValues);
  });  
  
  // Re-calculate distance everytime a restaurant is selected
  toEl.addEventListener("change", () => {    
    Helper.locationValues.to = Helper.searchRestoInputEl.to.value;
    Helper.calculateDistance(
      dirService, 
      dirRenderer, 
      Helper.locationValues);
  }); 
  
  // Re-calculate distance everytime a tranvel mode is selected  
  travelModeEl.addEventListener("change", () => {
    Helper.locationValues.mode = Helper.searchRestoInputEl.mode.value;
    Helper.calculateDistance(
      dirService, 
      dirRenderer, 
      Helper.locationValues);
  });
  
}

