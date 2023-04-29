
function initMap() {

  // Cebu city location
  let cebuCity = {lat: 10.31793, lng: 123.87512};
    
  // Create the map.
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 11,
    center: cebuCity,
  });
  
  // Load the stores GeoJSON onto the map.
  map.data.loadGeoJson(
    "https://raw.githubusercontent.com/HangerIsACat/cebu-restomap/main/data/resto-cebu.json", 
    {idPropertyName: "id"});
  
  const infoWindow = new google.maps.InfoWindow();

  // Show the information for a restaurant when its marker is clicked.
  map.data.addListener("click", (event) => {
    const name = event.feature.getProperty("name");
    const restoType = event.feature.getProperty("type");
    const specialty = event.feature.getProperty("specialty");
    const revenue = event.feature.getProperty("revenue");
    
    const position = event.feature.getGeometry().get();
    const content = `
        <h2>${name}</h2>
        <p>Restaurant type: ${restoType}</p>
        <p>Specialty: ${specialty}</p>
    `;

    infoWindow.setContent(content);
    infoWindow.setPosition(position);
    infoWindow.setOptions({pixelOffset: new google.maps.Size(0, -30)});
    infoWindow.open(map);
  });
}

