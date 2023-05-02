
function initMap() { 

  // Cebu city location
  let cebuCity = {lat: 10.31793, lng: 123.87512};
    
  // Create the map.
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: cebuCity
  });
  
  // Load the restaurant GeoJSON onto the map.
  map.data.loadGeoJson(
    "https://raw.githubusercontent.com/HangerIsACat/cebu-restomap/main/data/resto-cebu.json", 
    {idPropertyName: "id"}, 
    Helper.initRestaurants);
  
  // Call initApp() for all non-map render-related functionalities
  initApp(map);
  
}

