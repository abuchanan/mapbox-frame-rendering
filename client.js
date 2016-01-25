console.log("testing");
var fs = require('fs');
var Multiline = require("./multiline");

// Note: MapboxGL is loaded as a global object via mapbox-gl-dev.js
// I tried require(), but Mapbox is using special "browser"-field magic
// in package.json that doesn't play nice with Electron.
var container = document.getElementById('mapbox-container');
console.log(container);

mapboxgl.accessToken = 'pk.eyJ1IjoiYnVjaGFuYWUiLCJhIjoiY2loNzR0Y3U5MGd2OXZka3QyMHJ5bXo0ZCJ9.HdT8S-gTjPRkTb4v8Z23KQ';

var flightData = require("./data/auckland-to-bali.json");

var mapbox = new mapboxgl.Map({
  container: container,
  style: 'mapbox://styles/mapbox/streets-v8',
  // Needed to get the image data from the <canvas> element
  preserveDrawingBuffer: true,
  center: [138.26709949131447, -33.436065664065275],
  zoom: 1.9543686361293977
});

function slice_line(source, percent) {
  let source_length = source.geometry.coordinates.length;
  let slice_length = Math.floor(source_length * percent);
  let clone = extend(true, {}, source);

  if (slice_length < 2) {
    clone.geometry.coordinates = [];
    return clone;
  }

  if (slice_length > source_length) {
    slice_length = source_length;
  }

  let slice = source.geometry.coordinates.slice(0, slice_length);
  clone.geometry.coordinates = slice;
  return clone;
}

function slice_flight(flight, percent) {
  if (flight.arc.geometry.type == "MultiLineString") {
    slice = Multiline.slice(flight.arc, flight.progress);
  } else {
    slice = slice_line(flight.arc, flight.progress);
  }
}

mapbox.on('load', function() {

  mapbox.addSource("flight", {
    type: "geojson",
    data: flightData,
  });

  mapbox.addLayer({
    "id": "flight-lines",
    "source": "flight",
    "type": "line",
    "paint": {
      "line-color": "#3b52ec",
    }
  });

  mapbox.on('render', function() {
    console.log('render event');
    dumpCanvas("frames/renderevent.png");
  });

  setTimeout(function() {
    dumpCanvas("frames/timeout.png");
  }, 200);
});

function dumpCanvas(path) {
  var canvas = container.children[0].children[0];
  var imgURL = canvas.toDataURL();
  var base64Data = imgURL.replace(/^data:image\/png;base64,/, "");

  fs.writeFile(path, base64Data, 'base64', function(err) {
    console.log(err);
  });
}
