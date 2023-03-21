var winWidth = window.innerWidth;
var winHeight = window.innerHeight;
var bubbles = document.getElementsByClassName('bubble');
var webcam = document.querySelector("#webcam")

window.initMap = initMap();
//document.querySelector("#webcam").style.transform = "scale(1, 0.1)";

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

/* function onResize(event){
var w = window.innerWidth;
var h = window.innerHeight;



webcam.style.transform = "scale("+ w/1400 + "," + w/1400 + ") "// + "translateX("+  w/100 + "px)"
console.log(w, h, webcam.getBoundingClientRect().x, webcam.getBoundingClientRect().y)
//webcam.style.transform = "translateX("+  w/100 + "px)";
}  */

