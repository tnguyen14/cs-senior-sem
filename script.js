var geocoder,
    map,
    markers = [],
    center = {
      lat: 41.967269,
      lng: -71.184955,
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
      })
      .fail(function() {
        $('.results').html('Results are displayed');
        loadAddresses([{
          address: 'Wright-Patterson Air Force Base, Fairborn, Ohio, USA',
          title: 'Wright-Patterson Air Force Base, Fairborn, OH'
        }, {
          address: 'Cincinnati, Ohio, USA',
          title: 'Cincinnati, OH'
        }, {
          address: 'Public Square, Cleveland, Ohio, USA',
          title: '(Stand-in for Stuttgart, Germany. Crowd/fight scene with Loki and Captain America/Iron Man.)'
        }, {
          address: 'East 9th St, Cleveland, Ohio, USA',
          title: '(Explosions/fights on New York City street scenes and fights with aliens and Captain America/Thor)'
        }, {
          address: 'Albuquerque Studios - 5650 University Boulevard SE, Albuquerque, New Mexico, USA',
          title: 'Albuquerque Studios - 5650 University Boulevard SE, Albuquerque, NM'
        }, {
          address: 'Lakeside Court House, Cleveland, Ohio, USA',
          title: '(Indoor party scene in Stuttgart, Germany with Loki/eyeball.)'
        }, {
          address: 'Ameritrust Rotunda, Cleveland, Ohio, USA',
          title: '(Scene where aliens take people hostage, Captain America saves them and gets blown out a window.)'
        }, {
          address: 'Cedar Avenue and Ashland Road, Cleveland, Ohio, USA',
          title: '(Exterior shot of old factory where Black Widow was being interrogated)'
        }]);
      })
    }
  });
});