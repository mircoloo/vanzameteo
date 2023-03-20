var winWidth = window.innerWidth;
var winHeight = window.innerHeight;
var bubbles = document.getElementsByClassName('bubble');

  
window.initMap = initMap();




// ======================================= FUNCTIONS ==========================================
// Initialize and add the map
function initMap() {
  // The location of Uluru
  const uluru = { lat: 45.850755, lng: 11.077408 };
  // The map, centered at Uluru
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: uluru,
  });
  // The marker, positioned at Uluru
  const marker = new google.maps.Marker({
    position: uluru,
    map: map,
  });
}