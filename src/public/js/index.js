

const map = L.map('map-container');
const tileURL = 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tile = L.tileLayer(tileURL)

//Socket io:
const socket = io();

//Geolocation:
map.locate({enableHighAccurancy:true});
map.on('locationfound',(e)=>{
    const coords = [e.latlng.lat,e.latlng.lng];
    //Set View with your coordinates.
    map.setView(coords,13)
    const newMaker = L.marker(coords);
    newMaker.bindPopup('You are here');
    map.addLayer(newMaker);
    socket.emit('userCoordinates',e.latlng)
})

map.addLayer(tile);