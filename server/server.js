const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const apiRouter = require('./apiRouter').router;
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const Socket = require('./utils/socket');

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(fileUpload());

app.use('/api/', apiRouter);

Socket.NotificationCenter(io);

server.listen(8080, function () {
    console.log('Serveur lancé sur le port 8080 !');
});