# node-leaflet-geolocalization

## Creación de proyecto
  
  1.Creamos proyecto de node
  
  ```
  npm init --y
  ```
  
  2.Instalamos modulos
  
  ```
    npm install ejs-mate express socket.io
  ```

  3.Estructuramos el proyecto
  
    -> src
        
        -> public
        
          ->  css
          
            ->  style.css
        
          -> js
          
            -> main.js  
            
        -> routes
          
            ->index.routes.js
            
        -> views
              
            ->index.ejs
            
        -> index.js
        
        -> socket.js //servidor local de socketio
      
  4.Inicializamos y configuramos la aplicacion:
  
  ```javascript
    const express = require('express');
    const engine = require('ejs-mate');
    const path = require('path');
    const socketIO = require('socket.io');
    const http = require('http');
    //Initialization
    const app = express();
    const server = http.createServer(app);
    const io = socketIO(server);

    //Settings
    app.set('port',process.env.PORT || 3500);
    app.set('view engine','ejs'); // motor de plantillas
    app.set('views',path.join(__dirname,'views'))

    //Socket
    require('./socket')(io); //importamos el servidor de socket.io

    //Static files:
    app.use(express.static(path.join(__dirname,'public')))

    //Routes
    app.use(require('./routes/index.routes'));

    //Start server
    server.listen(app.get('port'),()=>{
        console.log(`Server on PORT ${app.get('port')}`);
    })
  ```
  
  5.Configuramos el servidor de socket.io
  
  ```node
    module.exports = (io)=>{
    io.on('connection',(socket)=>{
        
        console.log('New User Connected');
        socket.on('userCoordinates',coords=>{
            console.log(coords);
        })
    });
  };
  
  ```
  
  6.Diseñas la plantilla html5 en index.ejs
  
  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nodejs Leaflet | melpCode</title>
      <!--Leaflet CDN-->
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />

      <!--Custom style-->
      <link rel="stylesheet" href="/css/style.css">
  </head>
  <body>
  
      <!--Div contendra el map-->
      <div id="map-container"></div>
      
      <!--javascript leaflet-->
      <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
      <!--javascript socketio-->
      <script src="/socket.io/socket.io.js"></script>
      <!--javascript static-->
      <script src="/js/index.js"></script>
  </body>
  ```
  
  7.Configuramos los archivos estaticos CSS - JavaScript
  
  ```css
  body{
    padding: 0;
    margin: 0;
  }
  #map-container{
      height: 100%;
      width: 100%;
      top: 0;
      position: absolute;
      background: gray;
  }
  ```
  
  
  ```javascript
    
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
  ```
  
  
  
 ## Recursos adicionales:
  
  1.https://leafletjs.com/reference-1.7.1.html 
  
  2.https://geopois.com/blog/leaflet/leaflet-tiles
