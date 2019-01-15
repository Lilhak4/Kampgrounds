mapboxgl.accessToken = 'pk.eyJ1IjoibGlsaGFrNCIsImEiOiJjanF3emJjeWgwNG5kNDhtajF0MnY5OGlnIn0.QSqmhEM3_LdydtqybcuhLw';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/outdoors-v11',
  center: [0, 0],
  zoom: 1
});

const url = '/findiss';

map.on('load', () => {

  window.setInterval(() => {
    fetch(url).then((response) => {
      return response.json();
    })
      .then((json) => {
        const data = json,
          issLastSeen = data.features[0].geometry.coordinates,
          details = data.features[0].properties,
          resultingDOM = "";

        for (const prop in details) {
          resultingDOM += "<span class='title'>" + prop.toUpperCase() + "</span>" + " " + details[prop] + "</br>";
        }

        document.getElementById('details').innerHTML = resultingDOM;
        document.getElementById('locate').setAttribute("data-coordinate", JSON.stringify(issLastSeen));

        map.getSource('iss').setData(data);
      })
      .catch((error) => {
        console.log(error);
      });

  }, 2000);

  map.addSource('iss', { type: 'geojson', data: url });
  map.addLayer({
    "id": "iss",
    "type": "symbol",
    "source": "iss",
    "layout": {
      "icon-image": "rocket-15"
    }
  });

  map.addControl(new mapboxgl.FullscreenControl());

  document.getElementById('map').addEventListener('click', (event) => {
    const lastSeenLocaton = JSON.parse(this.getAttribute('data-coordinate'));
    map.flyTo({
      center: lastSeenLocaton
    });
  });

});