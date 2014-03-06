var geocoder,
    map,
    markers = [],
    center = {
      lat: 39.8282,
      lng: -98.5795,
    },
    reader = new FileReader();

var initialize = function () {
  var mapOptions = {
    center: new google.maps.LatLng(center.lat, center.lng),
    zoom: 4
  };
  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  geocoder = new google.maps.Geocoder();
}

var loadAddresses = function(addresses){
  // remove previous markers
  setMarkers(null);
  markers = [];
  for (var i = 0; i < addresses.length; i++) {
    loadMarker(addresses[i]);
  }
}

function setMarkers(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

var loadMarker = function(address) {
  var icon;
   geocoder.geocode( { 'address': address.address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      // map.setCenter(results[0].geometry.location);
      if (address.icon) {
        icon = {
          url: address.icon,
          scaledSize: new google.maps.Size(50,50)
        };
      }
      var marker = new google.maps.Marker({
        title: address.title,
        map: map,
        position: results[0].geometry.location,
        icon: icon
      });
      markers.push(marker);
      console.log(marker);
    } else {

    }
  });
}

google.maps.event.addDomListener(window, 'load', initialize);

// var inputElement = document.getElementById("file");
// inputElement.addEventListener("change", handleFiles, false);
function handleFiles() {
  var result;
  reader.readAsBinaryString(this.files[0]);
  reader.onload = function(e) {
    result = CSV.parse(e.target.result);
    loadAddresses(result);
  }
}

jQuery( document ).ready(function( $ ) {
  $('#q').keypress(function (e) {
    if (e.which === 13) {
      e.preventDefault();
      // go do the search
      var query = $(this).val();
      $('.results').html('searching for ' + query + '...');
      $.ajax({
        url: 'http://cs-senior-sem-imdb.herokuapp.com/movies/' + query,
        success: function(resp) {
          var addresses = JSON.parse(resp);
          loadAddresses(addresses);
          $('.results').html('filming locations found and displayed on the map.');
        },
        error: function(jqxhr, status, error) {
           $('.results').html(status);
           console.log(error);
        }
      });
    }
  });
});