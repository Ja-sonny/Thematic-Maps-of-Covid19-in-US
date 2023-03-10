mapboxgl.accessToken =
    'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v10', // style URL
    zoom: 4, // starting zoom
        projection: {
        name: 'albers'
    },
    center: [-97, 40] // starting position [lng, lat]
});

const layers = ['0~9', '10~24', '25~49', '50~99', '100~149', '150~199', '200~300'];
const colors = ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C',
                '#FC4E2A', '#E31A1C', '#BD0026', '#800026'];

map.on('load', () => {
    map.addSource('covidRate', {
        type: 'geojson',
        data: 'assets/us-covid-2020-rates.json'
    });

    map.addLayer({
        'id': 'covidRate-layer',
        'type': 'fill',
        'source': 'covidRate',
        'paint': {
            'fill-color': [
              'step',
              ['get', 'RATES'],
              '#FFEDA0',   // stop_output_0
              10,          // stop_input_0
              '#FED976',   // stop_output_1
              25,          // stop_input_1
              '#FEB24C',   // stop_output_2
              50,          // stop_input_2
              '#FD8D3C',   // stop_output_3
              100,         // stop_input_3
              '#FC4E2A',   // stop_output_4
              150,         // stop_input_4
              '#E31A1C',   // stop_output_5
              200,         // stop_input_5
              '#BD0026',   // stop_output_6
              300,        // stop_input_6
              "#800026"    // stop_output_7
          ],
            'fill-opacity': 0.7
        }
    });

    map.addLayer({
      'id': 'outline',
      'type': 'line',
      'source': 'covidRate',
      'paint': {
          'line-color': 'blue',
          'line-width': 0.5,
          'line-opacity': 0.7
      }
    });

  map.on('mousemove', ({point}) => {
    const state = map.queryRenderedFeatures(point, {
        layers: ['covidRate-layer']
    });
    document.getElementById('text-description').innerHTML = state.length ?
        `<h3>${state[0].properties.COUNTY} County</h3><p><strong><em>${state[0].properties.RATES}%</strong></em> Rate of Covid-19 cases</p>` :
        `<p><b>Hover over a county!<b></p>`;
  });

});

const legend = document.getElementById('legend');
legend.innerHTML = "<b>Rate of Covid-19 by County<br>(%)</b><br><br>";

layers.forEach((layer, i) => {
  const color = colors[i];
  const item = document.createElement('div');
  const key = document.createElement('span');
  key.className = 'legend-key';
  key.style.backgroundColor = color;

  const value = document.createElement('span');
  value.innerHTML = `${layer}`;
  item.appendChild(key);
  item.appendChild(value);
  legend.appendChild(item);
});



