
$(document).ready(gets_coordinates);



function gets_coordinates(evt) {
    $.get('/user-info.json', map_climbs);
}


function map_climbs(results) {

    var map = new google.maps.Map(document.getElementById('map'))

    var bounds = new google.maps.LatLngBounds();

    var places = results['map'];

    var infoWindows = [];

    var markers = [];

    var i = 0;

    // consider making some noise on coordinates to prevent stacking

    for(var place in places) {

      //adds noise to coordinates to prevent inadvertenant overlaying 
      places[place].coordinates['lat'] = places[place].coordinates['lat'] + Math.random() * 0.001

      var marker = new google.maps.Marker({
        position: places[place].coordinates,
        num: i
      });

      markers.push(marker);

      var infowindow = new google.maps.InfoWindow();

      var content = createContent(places[place].info_window);

      infowindow.setContent(content)

      infoWindows.push(infowindow)
      
      i += 1;

      bounds.extend(marker.position);

      marker.setMap(map);


    function addClick(marker) {
      marker.addListener('click', function() {
        infowindow.setContent(content);
        
        index = marker.num;

        infoWindows.map(function(info_window) {
          info_window.close()
        });

        infoWindows[index].open(map, marker);
      })
    }
    addClick(marker)


    function createContent(data) {
      var date = data[0];
      var name = data[1].toUpperCase();
      var v_grade = data[2]
      var state = data[3];
      var area = data[4];
      var url = data[6];
      var lat = data[7];
      var lng = data[8];

      if(data[5] === null) {
        var img = '';
      } else {
        var img = '/uploads/' + data[5]
      }

      return '<h4>' + name + ' (V' + v_grade + ') </h4>' 
             + '<h5>' + date + '</h5>'
             + '<h5>(' + lat + ', ' + lng + ')</h5>'
             + '<h5>' + area + ', ' + state + '</h5>' 
             + '<a href=' + url + '> MORE INFO </a><br>'
             + '<img src=' + img + ' width="450px">'

    }

  }

    map.fitBounds(bounds)

  // Add a marker clusterer to manage the markers.
  var markerCluster = new MarkerClusterer(map, markers,
      {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
}



