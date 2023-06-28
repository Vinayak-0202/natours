const locations = document.getElementById('map').dataset.locations;
console.log(locations);
L.mapquest.key = '0zWOmSlU3x9j4BKOKCcKWiAcMMTde7gT';

// 'map' refers to a <div> element with the ID map
L.mapquest.map('map', {
  center: [37.7749, -122.4194],
  layers: L.mapquest.tileLayer('map'),
  zoom: 12,
});
