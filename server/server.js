const express = require('express');
const db = require('./utils/db.query');
const bodyParser = require('body-parser');
const cors = require('cors');
const apiRouter = require('./apiRouter').router;

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/api/', apiRouter);

app.listen(8080, function () {
    console.log('Serveur lancé sur le port 8080 !');
});