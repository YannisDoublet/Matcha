const express = require('express');
const db = require('./utils/db.query');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const apiRouter = require('./apiRouter').router;
const app = express();

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(fileUpload());

app.use('/api/', apiRouter);

app.listen(8080, function () {
    console.log('Serveur lancé sur le port 8080 !');
});