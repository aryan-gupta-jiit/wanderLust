
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style:"mapbox://styles/mapbox/streets-v12",
    center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 10 // starting zoom
});

const marker = new mapboxgl.Marker({color:'red'})
.setLngLat(coordinates) // Listing.geometry.coordinates
.setPopup(new mapboxgl.Popup({offset:25,className:'my-class'})
.setHTML(`<h4>${location1}</h4><p>Exact Location provided after booking</p>`
))
.addTo(map);

// console.log([coordinates[0],coordinates[1]])
console.log(coordinates)
console.log([77.209,28.6139])