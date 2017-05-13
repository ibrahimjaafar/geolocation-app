
var current_lat;
var current_lon;
var second_lat;
var second_lon;
var worker;
var message;
var map;
var worker;

function createMap(latitude, longitude, container, check) {
	var geocoder = new google.maps.Geocoder;
	var infowindow = new google.maps.InfoWindow;
	var latlng = {lat: latitude, lng: longitude};
	var location = {lat: latitude, lng: longitude};
	var mid = {lat: 1.8312, lng:78.1834};
	if (check == 0){
	map = new google.maps.Map(container, {
      zoom: 30,
      center: mid
    });
	}
	displayAddress(geocoder, map, infowindow, latlng);		
}

function displayAddress(geocoder, map, infowindow, latlng) {

        geocoder.geocode({'location': latlng}, function(addr, status) {
       
		 if (status === 'OK') {
		
            if (addr[0]) {
            // alert((addr[0].formatted_address));
			  map.setZoom(3);
			  var marker = new google.maps.Marker({
                position: latlng,
                map: map
              });
			 
              infowindow.setContent(addr[0].formatted_address);
              infowindow.open(map, marker);
            } 
          }
        });
				
}
window.onload = function() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationFailure);
	}
	else {
		console.log("This browser doesn't support geolocation.");
	}
};

function startWorker() {
	if (typeof(worker) == "undefined") {

		worker = new Worker("worker.js");
	}
		worker.onmessage = function(e) { 
		var msg = e.data;
		document.getElementById('distances').innerHTML += msg.lat2+", "+msg.lon2+"----------------------------------------------------------------------"+msg.distance + " km <br>";

	};
}

function stopWorker() {
	worker.terminate();
	worker = undefined;
}


function geolocationSuccess(position) {
	current_lat = position.coords.latitude;
	current_lon = position.coords.longitude;
	createMap(current_lat, current_lon, document.getElementById('googlemap'), 0);
}

function geolocationFailure(error) {
	console.log("Geolocation failed: " + error.message);
}
function drop(event) {
		event.preventDefault();
		var file = event.dataTransfer.files[0],
		reader = new FileReader();
		reader.onload = function(event) {
		var r = reader.result;
        var pairs = r.split('\n');
		var lat, lon, index, i; 
		startWorker();
		for (i = 0; i < pairs.length - 1; i++){
			index = pairs[i].indexOf(",");  
			lat = pairs[i].substr(0, index); 
			lon = pairs[i].substr(index + 1)
			second_lat = parseFloat(lat);
			second_lon = parseFloat(lon);
			var	message = { lat1: current_lat, lon1: current_lon,lat2: second_lat, lon2: second_lon};
			worker.postMessage(message);
			createMap(parseFloat(lat),parseFloat(lon),document.getElementById('googlemap'), 1);
		}	
    };
	reader.readAsText(file);
}

function dragOver(event) {
    event.preventDefault();
}

getCoords = function()  {
	startWorker();
	var coord = document.getElementById("sc").value;
	index =coord.indexOf(",");  
	lat = coord.substr(0, index); 
	lon = coord.substr(index + 1)
	second_lat = parseFloat(lat);
	second_lon = parseFloat(lon);
	var	message = { lat1: current_lat, lon1: current_lon,lat2: second_lat, lon2: second_lon};
	worker.postMessage(message);
	createMap(second_lat,second_lon, document.getElementById('googlemap'), 1)
}
