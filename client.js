console.log("testing");
var fs = require('fs');

// Note: MapboxGL is loaded as a global object via mapbox-gl-dev.js
// I tried require(), but Mapbox is using special "browser"-field magic
// in package.json that doesn't play nice with Electron.
var container = document.getElementById('mapbox-container');
console.log(container);

mapboxgl.accessToken = 'pk.eyJ1IjoiYnVjaGFuYWUiLCJhIjoiY2loNzR0Y3U5MGd2OXZka3QyMHJ5bXo0ZCJ9.HdT8S-gTjPRkTb4v8Z23KQ';


var mapbox = new mapboxgl.Map({
  container: container,
  style: 'mapbox://styles/mapbox/streets-v8',
  // Needed to get the image data from the <canvas> element
  preserveDrawingBuffer: true,
});

mapbox.on('load', function() {
  var canvas = container.children[0].children[0];
  var imgURL = canvas.toDataURL();
  var base64Data = imgURL.replace(/^data:image\/png;base64,/, "");

  fs.writeFile("out1.png", base64Data, 'base64', function(err) {
    console.log(err);
  });
});
