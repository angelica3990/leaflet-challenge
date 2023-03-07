let features;
let depthArray = [];

let map = L.map('map').setView([15, -67], 2.3);
// create tile layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 13,
    attribution: '© OpenStreetMap'
}).addTo(map);

// json retrieval

const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// collect the data with D3
d3.json(url).then(function(data) {

  features = data.features;  

  // Iterate

  for (let i=0; i<features.length; i++) 
  {

      // collect coordinates to display data

      let coords = features[i].geometry.coordinates;
      let lon = coords[0];
      let lat = coords[1];

      // circle size, etc.

      let depth = parseInt(coords[2]);
      if (!Number.isNaN(depth)) {
        depthArray.push(depth);
      }
      let mag = parseFloat(features[i].properties.mag);
      if (mag < 0) {
        mag = Math.abs(mag);
      }  
      if (depth < 0) {
        depth = Math.abs(depth);
      }  
      let title = features[i].properties.title;
      let magnitude = features[i].properties.mag;
      let place = features[i].properties.place;

      // adjust size of circles based on magnitude 
      
      let radius = (200000 * mag) / Math.PI;

      // assign color based on the data for the depth of the earthquake
    
      if (depth <= 10) {
        color = "#26a300";
      } else if (depth <= 30) {
        color = "#91e600";
      } else if (depth <= 50) {
        color = "#fff30a";
      } else if (depth <= 70) {
        color = "#f59f00";
      } else if (depth <= 90) {
        color = "#ff0f0f";
      } else {
        color = "#721d1d";
      }
      // create circles using the Leaflet library 
      let circle = L.circle([lat, lon], {
        color: color,
        fillColor: color,
        fillOpacity: 0.4,
        radius: radius,
        weight: 0.5
      }).addTo(map);     

      // creation of tool-tip
      let popupText = title + "<br><b>Depth: </b>" + depth + "<br><b>Magnitude: </b>" + magnitude + "<br><b>Location: </b>" + place;
     
      circle.bindPopup(popupText);
            
  }

  let ascDepthArray = depthArray.sort(function(a, b){return a-b});

// create the legend
  let legend = L.control({position: "bottomright"});
// legend shows which color it belongs to
  legend.onAdd = function(map) {
      let div = L.DomUtil.create("div", "legend");      
      div.innerHTML += "<h4>Depth</h4>";
      div.innerHTML += '<i style="background: #26a300"></i><span>-10-10</span><br>';
      div.innerHTML += '<i style="background: #91e600"></i><span>10-30</span><br>';
      div.innerHTML += '<i style="background: #fff30a"></i><span>30-50</span><br>';
      div.innerHTML += '<i style="background: #f59f00"></i><span>50-70</span><br>';
      div.innerHTML += '<i style="background: #ff0f0f"></i><span>70-90</span><br>';
      div.innerHTML += '<i style="background: #721d1d"></i><span>>90+</span><br>';
      
      return div;   

  };
  
  legend.addTo(map);

});
