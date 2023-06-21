// Initialize map with base layer
var map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
}).addTo(map);

// Read the data from the JSON file
$.getJSON('dataset.json', function (data) {
    // Defineing the color based on earthquake depth
    function getColor(depth) {
            return depth > 100 ? '#800026' :
            depth > 70 ? '#BD0026' :
            depth > 50 ? '#E31A1C' :
            depth > 30 ? '#FC4E2A' :
            depth > 10 ? '#FD8D3C' :
            '#FEB24C';
    }

    // Create the legend table
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        var depths = [0, 10, 30, 50, 70, 100];
        var labels = [];
        var legendContent = '<div class="legend-title">Depth (km)</div>';
        for (var i = 0; i < depths.length; i++) {
            legendContent +=
                '<div class="legend-row">' +
                '<i style="background:' + getColor(depths[i] + 1) + '"></i>' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '</div>' : '+') +
                '</div>';
        }

        div.innerHTML = legendContent;
        return div;
    };

    // Add the legend table to the map
    legend.addTo(map);
    data.features.forEach(function (feature) {
    
        var magnitude = feature.properties.mag;
        var depth = feature.geometry.coordinates[2];

        // Define the size and color of the marker
        var markerSize = magnitude * 3; 
        var markerColor = getColor(depth);

        var marker = L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            radius: markerSize,
            fillColor: markerColor,
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        });

        // Add a popup 
        var popupContent = '<strong>Magnitude:</strong> ' + magnitude + '<br>' +
            '<strong>Depth:</strong> ' + depth + ' km<br>' +
            '<strong>Location:</strong> ' + feature.properties.place;
        marker.bindPopup(popupContent);
        marker.addTo(map);
    });
});
