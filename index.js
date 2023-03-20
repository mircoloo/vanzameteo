const bubbleDiv = document.querySelector(".bubble") ;
var winWidth = window.innerWidth;
var winHeight = window.innerHeight;
var bubbles = document.getElementsByClassName('bubble');

// Initialize and add the map
function initMap() {
    // The location of Uluru
    const uluru = { lat: 45.850755, lng: 11.077408 };
    // The map, centered at Uluru
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 18,
      center: uluru,
    });
    // The marker, positioned at Uluru
    const marker = new google.maps.Marker({
      position: uluru,
      map: map,
    });
  }
  
  window.initMap = initMap;



console.log(bubbles.length)

for ( var i=0; i < bubbless.length; i++ ) {
 	console.log(thisDiv)
    // shortcut! the current div in the list
    var thisDiv = bubbles[i];
    
    // get random numbers for each element
    randomTop = getRandomNumber(0, winHeight);
    randomLeft = getRandomNumber(0, winWidth);
    
    // update top and left position
    thisDiv.style.top = randomTop +"px";
    thisDiv.style.left = randomLeft +"px";
    
}

// function that returns a random number between a min and max
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}