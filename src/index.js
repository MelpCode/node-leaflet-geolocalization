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
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

//Socket
require('./socket')(io);

//Static files:
app.use(express.static(path.join(__dirname,'public')))


//Routes
app.use(require('./routes/index.routes'));

//Start server
server.listen(app.get('port'),()=>{
    console.log(`Server on PORT ${app.get('port')}`);
})